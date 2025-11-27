import { createTask } from "~~/server/services/taskService"
import { checkProjectAccess } from "~~/server/utils/projectRoles"
import type { TaskStatus } from "~~/types/types"

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  const projectId = getRouterParam(event, "id")

  if (!projectId) {
    throw createError({ statusCode: 400, statusMessage: "Project ID is required" })
  }

  // Vérifier que l'utilisateur a accès au projet
  const access = await checkProjectAccess(projectId, user.id)
  if (!access) {
    throw createError({ statusCode: 403, statusMessage: "Access denied" })
  }

  const body = await readBody(event)

  if (!body.title) {
    throw createError({ statusCode: 400, statusMessage: "Title is required" })
  }

  const task = await createTask({
    title: body.title,
    description: body.description,
    status: body.status as TaskStatus,
    priority: body.priority,
    assignedTo: body.assignedTo,
    projectId,
  })

  return task
})
