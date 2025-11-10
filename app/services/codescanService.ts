export const getAllDependancies = async (repoUrl: string) => {
    try {
        const api = useApi()
        const response = await api.apiRequest('/api/modules/codescan/analyze', {
            method: "POST",
            body: {
                repoUrl,
                branch: "dev"
            }
        })
        return response
    }catch (error) {
        console.log(error);
        
    }
}