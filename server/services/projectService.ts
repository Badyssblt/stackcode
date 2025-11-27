import {prisma} from "~~/lib/prisma"
import type { Notification } from '~~/types/types';

export async function getFullProject(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      users: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstname: true,
              lastname: true
            },
          },
        },
      },
      invitations: {
        select: {
          email: true,
        },
      }
    },
  })
}

export async function searchNonProjectUsers(projectId: string, emailQuery: string) {
  
  return prisma.user.findMany({
    where: {
      projects: {
        none: { projectId },
      },
      email: {
        contains: emailQuery,
      },
    },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
    },
    take: 10,
  })
}

export async function getAllProjects(userId: string) {

    return prisma.project.findMany({
        where: {
            users: {
                some: {
                    userId
                }
            }
        },
        include: {
          users: {
            where: { userId },
            select: {
              role: true
            }
          }
        }
    })
}

export async function checkProjectOwner(projectId: string, userId: string) {
  const projectUser = await prisma.projectUser.findUnique({
    where: { projectId_userId: { projectId, userId } },
  })
  return projectUser?.role === "owner"
}


export async function addUserToProject(notification: Notification){
  
  const projectUser = await prisma.projectUser.create({
    data: {
      userId: notification.user.id,
      projectId: notification.project.id,
      role: notification.role
    }
  })

  return projectUser
}