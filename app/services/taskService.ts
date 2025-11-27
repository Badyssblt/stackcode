import useApi from "~/composables/useApi"
import type { Task, TaskStatus } from "~/types/types"

export const getProjectTasks = async (projectId: string) => {
  const api = useApi()

  try {
    const data = await api.apiRequest(`/api/projects/${projectId}/tasks`)
    return data || []
  } catch (error) {
    console.error('Error fetching project tasks:', error)
    throw error
  }
}

export const getTaskById = async (taskId: string) => {
  const api = useApi()

  try {
    const data = await api.apiRequest(`/api/tasks/${taskId}`)
    return data
  } catch (error) {
    console.error('Error fetching task:', error)
    throw error
  }
}

export const createTask = async (projectId: string, taskData: {
  title: string
  description?: string
  status?: TaskStatus
  priority?: 'low' | 'medium' | 'high'
  assignedTo?: string
}) => {
  const api = useApi()

  try {
    const data = await api.apiRequest(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      body: taskData
    })
    return data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export const updateTask = async (taskId: string, taskData: {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: 'low' | 'medium' | 'high'
  assignedTo?: string | null
}) => {
  const api = useApi()

  try {
    const data = await api.apiRequest(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: taskData
    })
    return data
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export const deleteTask = async (taskId: string) => {
  const api = useApi()

  try {
    const data = await api.apiRequest(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    })
    return data
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}
