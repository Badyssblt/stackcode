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

export const searchNonProjectUsers = async (projectId: string, email: string) => {
    const api = useApi()

    try {
        const data = await api.apiRequest('/api/projects/' + projectId + '/users/search', {
            method: 'POST',
            body: { email }
        })
        return data
    }catch (error) {
        console.log(error);
    }
}

export const inviteUserToProject = async (projectId: string, email: string) => {
    const api = useApi()

    try {
        const data = await api.apiRequest('/api/projects/' + projectId + '/users/invite', {
            method: 'POST',
            body: { email }
        })
        return data
    }catch (error) {
        console.log(error);
    }
}