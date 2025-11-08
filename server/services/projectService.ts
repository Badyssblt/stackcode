import prisma from "~~/lib/prisma"

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
      }
    },
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
    })
}

export async function checkProjectOwner(projectId: string, userId: string) {
  const projectUser = await prisma.projectUser.findUnique({
    where: { projectId_userId: { projectId, userId } },
  })
  return projectUser?.role === "owner"
}
