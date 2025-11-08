import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from '@sidebase/authjs-prisma-adapter'
import { PrismaClient } from '@prisma/client'
import type { Adapter } from 'next-auth/adapters'
import bcrypt from 'bcryptjs'
import prisma from "../../../lib/prisma"
import { NuxtAuthHandler } from '#auth'

// Fonction helper pour parser les noms
function parseFullName(fullName: string) {
  const parts = fullName.trim().split(' ')
  return {
    firstname: parts[0] || '',
    lastname: parts.slice(1).join(' ') || ''
  }
}

// Adaptateur custom
function CustomPrismaAdapter(p: PrismaClient): Adapter {
  const baseAdapter = PrismaAdapter(p)
  
  return {
    ...baseAdapter,
    
    async createUser(data: any) {
      let firstname = data.firstname || ''
      let lastname = data.lastname || ''
      
      // Parser le nom si fourni
      if (data.name && !firstname) {
        const parsed = parseFullName(data.name)
        firstname = parsed.firstname
        lastname = parsed.lastname
      }
      
      // Créer l'utilisateur SANS name
      const user = await p.user.create({
        data: {
          email: data.email,
          emailVerified: data.emailVerified || null,
          image: data.image,
          firstname: firstname || data.email?.split('@')[0] || 'User',
          lastname: lastname,
        },
      })
      
      return {
        ...user,
        name: data.name || `${firstname} ${lastname}`.trim()
      }
    },
    
    async linkAccount(data: any) {
      const user = await p.user.findUnique({
        where: { id: data.userId }
      })
      
      const account = await p.account.create({
        data: {
          userId: data.userId,
          type: data.type,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          refresh_token: data.refresh_token,
          access_token: data.access_token,
          expires_at: data.expires_at,
          token_type: data.token_type,
          scope: data.scope,
          id_token: data.id_token,
          session_state: data.session_state,
          name: user ? `${user.firstname} ${user.lastname}`.trim() : null,
        },
      })
      
      return account
    },
    
    async getUser(id: string) {
      const user = await p.user.findUnique({
        where: { id },
        include: { accounts: true }
      })
      
      if (!user) return null
      
      const name = user.firstname && user.lastname 
        ? `${user.firstname} ${user.lastname}`.trim()
        : user.accounts[0]?.name || user.email || 'User'
      
      return {
        ...user,
        name
      }
    },
    
    async getUserByEmail(email: string) {
      const user = await p.user.findUnique({
        where: { email },
        include: { accounts: true }
      })
      
      if (!user) return null
      
      const name = user.firstname && user.lastname 
        ? `${user.firstname} ${user.lastname}`.trim()
        : user.accounts[0]?.name || user.email || 'User'
      
      return {
        ...user,
        name
      }
    },
    
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await p.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: { user: true },
      })
      
      if (!account) return null
      
      const name = account.user.firstname && account.user.lastname
        ? `${account.user.firstname} ${account.user.lastname}`.trim()
        : account.name || account.user.email || 'User'
      
      return {
        ...account.user,
        name
      }
    },
  }
}

export default NuxtAuthHandler({
  secret: process.env.NUXT_SECRET || 'your-secret-here',
  
  // IMPORTANT: Utiliser JWT pour Credentials
  session: {
    strategy: 'jwt', // ← Crucial pour Credentials
  },
  
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    
    // JWT callback - appelé quand le token JWT est créé ou mis à jour
    async jwt({ token, user, account }) {
      // Lors de la connexion initiale (user est défini)
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstname = user.firstname
        token.lastname = user.lastname
        token.name = user.name || `${user.firstname} ${user.lastname}`.trim()
        token.image = user.image
      }
      
      return token
    },
    
    // Session callback - appelé quand la session est vérifiée
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.firstname = token.firstname as string
        session.user.lastname = token.lastname as string
        session.user.image = token.image as string
      }
      
      return session
    },
  },
  
  adapter: CustomPrismaAdapter(prisma),
  
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile: any) {
        const parsed = parseFullName(profile.name || profile.login)
        
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          firstname: parsed.firstname,
          lastname: parsed.lastname,
        }
      },
    }),
    
    // @ts-expect-error Use .default here for it to work during SSR.
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        
        if (!user || !user.password) {
          throw new Error("User not found")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        // ✅ Retourner TOUTES les infos nécessaires
        return {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          name: user.firstname && user.lastname 
            ? `${user.firstname} ${user.lastname}`.trim()
            : user.email,
          image: user.image,
        }
      },
    }),
  ]
})