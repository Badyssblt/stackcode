import { getCurrentUser } from "~~/server/utils/auth";
import {prisma} from "~~/lib/prisma";

export default defineEventHandler(async (event) => {

    const user = await getCurrentUser(event);

    const body = await readBody(event);
    const { name } = body;

    const project = await prisma.project.create({
        data: {
            name,
            users: {
                    create: {
                    userId: user.id,
                    role: 'owner',
                    },
                },
            },
            include: {
            users: true, // pour voir que l'user est bien attaché
    },
    })
    
    return project;

});