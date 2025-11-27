import prisma from "~~/lib/prisma";
import { getAllProjects, getFullProject } from "~~/server/services/projectService";
import { getUserNotifications } from "~~/server/services/userService";
import { checkProjectAccess } from "~~/server/utils/projectRoles";

export default defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const notification = getUserNotifications(user.id)
    
    return notification;
})