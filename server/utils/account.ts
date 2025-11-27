import {prisma} from "~~/lib/prisma"

export const getAccessToken = async (event: any, provider: string) => {
    try {
        const user = await getCurrentUser(event)
        const account = await prisma.account.findFirst({
            where: {
                userId: user.id,
                provider: provider
            }
        })

        return account
    }catch (error) {
    }
}