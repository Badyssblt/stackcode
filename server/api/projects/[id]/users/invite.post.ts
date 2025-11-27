import {prisma} from "~~/lib/prisma"; // adapte selon ton projet
import { getSocketIO } from "~~/server/plugins/socket.server";

export default defineEventHandler(async (event) => {
  try {
    const projectId = event.context.params.id
    const body = await readBody(event);
    const { email, role = "member" } = body;

    if (!email) {
      return { status: 400, error: "L'email est requis." };
    }

    // Vérifie que le projet existe
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return { status: 404, error: "Projet introuvable." };
    }

    // Vérifie si l’utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Vérifie s’il est déjà membre du projet
    if (existingUser) {
      const alreadyMember = await prisma.projectUser.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: existingUser.id,
          },
        },
      });
      if (alreadyMember) {
        return { status: 400, error: "Cet utilisateur fait déjà partie du projet." };
      }
    }

    // Vérifie si une invitation existe déjà
    const existingInvitation = await prisma.projectUserInvitation.findUnique({
      where: {
        projectId_email: {
          projectId,
          email,
        },
      },
    });
    if (existingInvitation) {
      return { status: 400, error: "Une invitation a déjà été envoyée à cet email." };
    }

    // Crée l’invitation
    const invitation = await prisma.projectUserInvitation.create({
      data: {
        projectId,
        email,
        role,
      },
      include: {
        project: true, // <-- AJOUT IMPORTANT
      },
    });

    console.log(invitation);
    



    const io = getSocketIO();
    if (io) {
      // Si l'utilisateur invité existe et est connecté
      if (existingUser) {
        io.to(`user:${existingUser.id}`).emit('notification:invitation', invitation);
        console.log(`📤 Notification envoyée à user:${existingUser.id}`);
      }

      // Notifier tous les membres du projet
      io.to(`project:${projectId}`).emit('project:invitation', {
        type: 'member_invited',
        projectId,
        email,
        role,
        invitationId: invitation.id,
        timestamp: new Date().toISOString()
      });
      console.log(`📤 Notification envoyée au projet:${projectId}`);
    }


    // (Optionnel) envoyer un mail ici si tu as un service d’emailing
    // await sendInvitationEmail(email, project.name, invitation.id);
    
    return { message: "Invitation envoyée avec succès.", invitation };
  } catch (error) {
    console.error("Erreur lors de la création de l'invitation :", error);
    return { status: 500, error: "Erreur interne du serveur." };
  }
});
