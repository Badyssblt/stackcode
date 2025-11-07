import { getServerSession } from '#auth'
import prisma from "../../lib/prisma";

export async function getCurrentUser(event: any) {
    

  const session = await getServerSession(event)

  if (!session || !session.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  // Optionnel : récupérer l'utilisateur complet depuis la DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) throw createError({ statusCode: 401, statusMessage: "User not found" })

  return user
}
