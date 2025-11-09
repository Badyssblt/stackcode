import { getAllProjects, addProject, getOneProject } from "~/services/projectService";

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

    const getProject = async (id: string) => {
        try {
            const data = await getOneProject(id)
    
            return data
        }catch (error) {
            console.log(error);
            
        }
    }

    return {
        projects,
        getProjects,
        createProject,
        getProject
    }

}