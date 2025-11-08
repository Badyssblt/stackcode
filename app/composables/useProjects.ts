import { getAllProjects } from "~/services/projectService";

export const useProjects = async () => {

    const projects = useState('projects', () => []);

    /**
     * Récupère tous les projets de l'utilisateur courant
     */
    const getProjects = async () => {
        projects.value = await getAllProjects();
    };

    return {
        projects,
        getProjects
    }

}