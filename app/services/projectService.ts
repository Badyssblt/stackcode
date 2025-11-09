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
    console.log(name);
    if(!name) return;
    try {
        const data = await api.apiRequest('/api/projects', {
            method: 'POST',
            body: { name }
        })
        return data;
    }catch (error) {
    }
}