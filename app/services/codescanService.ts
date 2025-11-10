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

export const analyzeCodeContent = async (repoUrl: string, filePath: string, branch: string) => {
    try {
        const api = useApi()
        const response = await api.apiRequest('/api/modules/codescan/code', {
            method: "POST",
            body: {
                repoUrl,
                branch: "dev",
                filePath
            }
        })
        return response
    }catch (error) {
        console.log(error);
        
    }
}