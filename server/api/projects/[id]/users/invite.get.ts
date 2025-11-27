import {prisma} from "~~/lib/prisma";
import { getServerSession } from "#auth"; // si tu utilises Nuxt Auth (ex: NuxtAuth)
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { projectId } = event.context.params || {};

    if (!projectId) {
      return { status: 400, error: "Identifiant du projet manquant dans l'URL." };
    }

    // 🧑‍💼 Récupère la session (selon ton système d'auth)
    const session = await getServerSession(event);

    if (!session?.user?.email) {
      return { status: 401, error: "Utilisateur non authentifié." };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { status: 404, error: "Utilisateur introuvable." };
    }

    // 🔍 Vérifie que l'utilisateur est owner du projet
    const projectMembership = await prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id,
        },
      },
    });

    if (!projectMembership || projectMembership.role !== "owner") {
      return { status: 403, error: "Accès refusé. Seul le propriétaire peut voir les invitations." };
    }

    // ✅ Récupère toutes les invitations du projet
    const invitations = await prisma.projectUserInvitation.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return { invitations };
  } catch (error) {
    console.error("Erreur lors de la récupération des invitations :", error);
    return { status: 500, error: "Erreur interne du serveur." };
  }
});
