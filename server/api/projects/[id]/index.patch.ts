import { getCurrentUser } from "~~/server/utils/auth"
import {prisma} from "~~/lib/prisma"
import { checkProjectAccess } from "~~/server/utils/projectRoles"

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  const projectId = getRouterParam(event, "id")
  const body = await readBody(event)

  if(!projectId) throw createError({ statusCode: 400, statusMessage: "Project ID is required" })

  // Vérifier que l'utilisateur a accès
  const access = await checkProjectAccess(projectId, user.id)
  if (access.role !== "owner") throw createError({ statusCode: 403 })

  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: body.name,
      repoUrl: body.repoUrl,
      description: body.description,
    },
  })

  return project
})
