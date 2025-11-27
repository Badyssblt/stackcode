export const getAllNotifications = async () => {
    const api = useApi()
    try {
        const response = await api.apiRequest('/api/users/notifications')
        return response
    }catch(error){
        console.log(error);
        
    }
}
