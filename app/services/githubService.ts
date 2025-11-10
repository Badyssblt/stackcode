export const getOneRepository = async (branch = "dev") => {
    const api = useApi()
    const repoUrl = "https://github.com/Badyssblt/stackcode.git"
    try {
        const data = await api.apiRequest('/api/modules/repo', {
            method: 'POST',
            body: { repoUrl, branch }
        })
        return data;
    }catch (error) {
        console.log(error);
        
    }
}

export const readFile = async (path, branch = "dev") => {
    console.log("test");
    
    const api = useApi()
    const repoUrl = "https://github.com/Badyssblt/stackcode.git"
    try {
        const data = await api.apiRequest('/api/modules/repo/file', {
            method: 'POST',
            body: { repoUrl, branch, path }
        })
        return data;
    }catch (error) {
        console.log(error);
        
    }
}