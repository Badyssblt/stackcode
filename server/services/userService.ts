import {prisma} from "~~/lib/prisma"

export async function getUserNotifications(userId: string) {
  return prisma.projectUserInvitation.findMany({
    where: {
        user: {
            id: userId
        }
    },
    include: {
        project: {
            select: {
                id: true,
                name: true
            }
        }
    }
  })
}

export async function getUserNotification(userId: string, invitationId: string) {
  return prisma.projectUserInvitation.findUnique({
    where: {
        user: {
            id: userId
        },
        id: invitationId
    },
    include: {
        project: {
            select: {
                id: true,
                name: true
            }
        },
        user: {
            select: {
                id: true
            }
        }
    }
  })
}

export async function deleteUserNotification(userId: string, invitationId: string) {
  return prisma.projectUserInvitation.deleteMany({
    where: {
      id: invitationId,
      user: {
        id: userId
      }
    }
  })
}