import useApi from "~/composables/useApi";


export const getAllProjects = async () => {

    const api = useApi()


    try {
        const data = await api.apiRequest('/api/projects')
        return data || [];
    }catch (error) {
        console.log(error);
        
    }
}

export const addProject = async (name: string) => {
    const api = useApi()

    try {
        const data = await api.apiRequest('/api/projects', {
            method: 'POST',
            body: { name }
        })
        return data;
    }catch (error) {
    }
}

export const getOneProject = async (id: string) => {
        const api = useApi()

    try {
        const data = await api.apiRequest('/api/projects/' + id)
        return data;
    }catch (error) {
    }
}

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