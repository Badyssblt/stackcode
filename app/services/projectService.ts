export const getAllProjects = async () => {
    try {
        const data = await $fetch('/api/projects');
        console.log(data);
        
        return data || [];
    }catch (error) {
        console.log(error);
        
    }
}