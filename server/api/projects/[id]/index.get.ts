import prisma from "~~/lib/prisma";
import { getFullProject } from "~~/server/services/projectService";
import { checkProjectAccess } from "~~/server/utils/projectRoles";

export default defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const projectId = getRouterParam(event, "id");

    if(!projectId) throw createError({ statusCode: 400, statusMessage: "Project ID is required" });

    // Vérifier que l'utilisateur a accès
    const access = await checkProjectAccess(projectId, user.id);
    if (!access) throw createError({ statusCode: 403 });

    const project = getFullProject(projectId);
    
    return project;
})