import prisma from "~~/lib/prisma";
import { getAllProjects, getFullProject } from "~~/server/services/projectService";
import { checkProjectAccess } from "~~/server/utils/projectRoles";

export default defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const project = getAllProjects(user.id);
    
    return project;
})