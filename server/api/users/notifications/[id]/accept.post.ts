import prisma from "~~/lib/prisma";
import { addUserToProject, getAllProjects, getFullProject } from "~~/server/services/projectService";
import { deleteUserNotification, getUserNotification } from "~~/server/services/userService";
import { checkProjectAccess } from "~~/server/utils/projectRoles";

export default defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const invitationId = getRouterParam(event, "id");

    if(!invitationId) throw createError({ statusCode: 400, statusMessage: "InvitationId ID is required" })

    const notification = await getUserNotification(user.id, invitationId)
    
    await addUserToProject(notification)

    await deleteUserNotification(user.id, invitationId)


    return notification;
})