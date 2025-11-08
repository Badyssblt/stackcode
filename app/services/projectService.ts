export const getAllProjects = async () => {
    try {
        const data = await $fetch('/api/projects');
        console.log(data);
        
        return data.value || [];
    }catch (error) {
        console.log(error);
        
    }
}