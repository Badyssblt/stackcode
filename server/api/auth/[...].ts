import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from '@sidebase/authjs-prisma-adapter'
import bcrypt from 'bcryptjs'
import prisma from "../../../lib/prisma";
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: 'your-secret-here',
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    // @ts-expect-error Use .default here for it to work during SSR.
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        // Récupérer l'utilisateur dans la base
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) {
          throw new Error("User not found")
        }

        // Vérifier le mot de passe
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        // Retourner un objet user compatible avec NuxtAuth
        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email,
        }
      },
    }),
  ]
})