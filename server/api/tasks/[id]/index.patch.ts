import { getTaskById, updateTask } from "~~/server/services/taskService"
import { checkProjectAccess } from "~~/server/utils/projectRoles"
import type { TaskStatus } from "~~/types/types"

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

  const body = await readBody(event)

  const updatedTask = await updateTask(taskId, {
    title: body.title,
    description: body.description,
    status: body.status as TaskStatus,
    priority: body.priority,
    assignedTo: body.assignedTo,
  })

  return updatedTask
})
