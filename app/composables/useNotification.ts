import { getAllNotifications as fetchNotifications } from '~/services/notificationService'
import type { Notification } from '~~/types/types'


export const useNotification = () => {
    
    const notifications = useState<{ id: string, message: string }[]>('user-notifications')

    const api = useApi()
    const { getProjects } = useProjects()

    const getAllNotifications = async () => {
        const data = await fetchNotifications()
        notifications.value = data
        return data
    }

    const acceptNotification = async (notification: Notification) => {
        const data = await api.apiRequest('/api/users/notifications/' + notification.id + '/accept', {
            method: "POST"
        })
        getProjects()
        getAllNotifications()
    }

    return {
        getAllNotifications,
        acceptNotification,
        notifications 
    }

}