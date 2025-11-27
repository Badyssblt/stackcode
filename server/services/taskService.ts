import { prisma } from "~~/lib/prisma"
import type { TaskStatus } from '~~/types/types'

export async function getProjectTasks(projectId: string) {
  return prisma.task.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          name: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getTaskById(taskId: string) {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          name: true,
        }
      },
      project: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  })
}

export async function createTask(data: {
  title: string
  description?: string
  status?: TaskStatus
  priority?: 'low' | 'medium' | 'high'
  assignedTo?: string
  projectId: string
}) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      assignedTo: data.assignedTo,
      projectId: data.projectId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          name: true,
        }
      }
    }
  })
}

export async function updateTask(taskId: string, data: {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: 'low' | 'medium' | 'high'
  assignedTo?: string | null
}) {
  return prisma.task.update({
    where: { id: taskId },
    data,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          name: true,
        }
      }
    }
  })
}

export async function deleteTask(taskId: string) {
  return prisma.task.delete({
    where: { id: taskId }
  })
}

export async function getUserTasks(userId: string) {
  return prisma.task.findMany({
    where: { assignedTo: userId },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}
