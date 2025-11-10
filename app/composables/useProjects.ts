import { getAllProjects, addProject, getOneProject, getOneRepository } from "~/services/projectService";
import type { Project } from '@@/types/types';

export const useProjects = () => {

    const projects = useState<Project[]>('projects', () => []);
    const repository = useState('repository', () => null);
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

    const getRepository = async () => {
        try {
            const data = await getOneRepository()
            if(data) repository.value = data
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
        getProject,
        getRepository,
        repository
    }

}