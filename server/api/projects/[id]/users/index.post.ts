import { getCurrentUser } from "~~/server/utils/auth"
import {prisma} from "~~/lib/prisma"
import { checkProjectAccess } from "~~/server/utils/projectRoles"

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  const projectId = event.context.params.id
  const { email, role = "member" } = await readBody(event)

  // Vérifier que l'utilisateur peut gérer le projet
  const access = await checkProjectAccess(projectId, user.id)
  if (!["owner", "admin"].includes(access.role)) throw createError({ statusCode: 403 })

  // Récupérer user à ajouter
  const newUser = await prisma.user.findUnique({ where: { email } })
  if (!newUser) throw createError({ statusCode: 404, statusMessage: "User not found" })

  // Ajouter dans ProjectUser
  const projectUser = await prisma.projectUser.create({
    data: {
      projectId,
      userId: newUser.id,
      role,
    },
  })

  return projectUser
})
