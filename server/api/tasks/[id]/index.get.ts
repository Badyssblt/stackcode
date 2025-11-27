import { getTaskById } from "~~/server/services/taskService"
import { checkProjectAccess } from "~~/server/utils/projectRoles"

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  const taskId = getRouterParam(event, "id")

  if (!taskId) {
    throw createError({ statusCode: 400, statusMessage: "Task ID is required" })
  }

  const task = await getTaskById(taskId)

  if (!task) {
    throw createError({ statusCode: 404, statusMessage: "Task not found" })
  }

  // Vérifier que l'utilisateur a accès au projet de la tâche
  const access = await checkProjectAccess(task.projectId, user.id)
  if (!access) {
    throw createError({ statusCode: 403, statusMessage: "Access denied" })
  }

  return task
})
