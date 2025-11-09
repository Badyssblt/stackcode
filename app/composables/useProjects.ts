import { getAllProjects, addProject } from "~/services/projectService";

export const useProjects = () => {

    const projects = useState('projects', () => []);

    /**
     * Récupère tous les projets de l'utilisateur courant
     */
    const getProjects = async () => {
        try {
            const data = await getAllProjects()
            if(data) projects.value = data
        
            return data
        }catch (error) {
            console.log(error);
            
        }
    }

    const createProject = async (name: string) => {
        try {
            const response = await addProject(name)
            return response
        }catch (error) {
        }
    }

    return {
        projects,
        getProjects,
        createProject
    }

}