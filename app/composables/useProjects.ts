import { getAllProjects, addProject, getOneProject, inviteUserToProject } from "~/services/projectService";
import type { Project } from '@@/types/types';
import { searchNonProjectUsers } from "~/services/projectService";

export const useProjects = () => {

    const projects = useState<Project[]>('projects', () => []);
    const project = useState<Project | null>('project', () => null);
    const userFound = useState<any[]>('userFound', () => []);

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
            project.value = data
            return data
        }catch (error) {
            console.log(error);
            
        }
    }

    const findUserByEmail = async (email: string) => {
        try {
            const projectId = project.value?.id
            console.log(project.value);
            
            if(!projectId) return
            const response = await searchNonProjectUsers(projectId, email)
            userFound.value = response || []
            return response
        }catch (error) {
            console.log(error);
            
        }
    }

    const inviteUserOnProject = async (email: string) => {
        try {
            const projectId = project.value?.id
            if(!projectId) return
            const response = await inviteUserToProject(projectId, email)
            return response
        }catch (error) {
        }
    }

    

    return {
        projects,
        project,
        getProjects,
        createProject,
        getProject,
        findUserByEmail,
        inviteUserOnProject
    }

}