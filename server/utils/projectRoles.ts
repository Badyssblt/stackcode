import {prisma} from "~~/lib/prisma"

/**
 * Vérifie que l'utilisateur a accès à un projet.
 * @param projectId - ID du projet
 * @param userId - ID de l'utilisateur
 * @param requiredRoles - roles autorisés (optionnel, default = tout)
 * @returns ProjectUser
 */
export async function checkProjectAccess(
  projectId: string,
  userId: string,
  requiredRoles?: string[]
) {
  const projectUser = await prisma.projectUser.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  })

  if (!projectUser) {
    throw createError({ statusCode: 403, statusMessage: "Access denied" })
  }

  if (requiredRoles && !requiredRoles.includes(projectUser.role)) {
    throw createError({ statusCode: 403, statusMessage: "Insufficient permissions" })
  }

  return projectUser
}
