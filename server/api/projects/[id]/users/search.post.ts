import { searchNonProjectUsers } from "~~/server/services/projectService" // adapte le chemin selon ton arborescence

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const projectId = event.context.params.id
  const email = body.email

  // Vérification des paramètres
  if (!projectId || !email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing projectId or email parameter",
    })
  }

  // Appel de ta fonction Prisma
  const users = await searchNonProjectUsers(projectId, email)

  // Retourne les résultats
  return users
})
