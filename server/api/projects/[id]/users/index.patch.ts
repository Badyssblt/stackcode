import { checkProjectAccess } from "~~/server/utils/projectRoles"
import {prisma} from "~~/lib/prisma"

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  const projectId = getRouterParam(event, "id")
  const body = await readBody(event)

  if(!projectId) throw createError({ statusCode: 400, statusMessage: "Project ID is required" })

  // Vérifier que l'utilisateur a accès
  const access = await checkProjectAccess(projectId, user.id)
  if (access.role !== "owner") throw createError({ statusCode: 403 })

  const projectUser = await prisma.user.findUnique({
    where: { email: body.email },
})

  const project = await prisma.projectUser.update({
    where: { projectId_userId: {
        projectId,
        userId: projectUser.id
    } },
    data: {
      userId: projectUser.id,
      role: body.role,
    },
  })

  return project
})
