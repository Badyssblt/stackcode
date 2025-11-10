import { getAllDependancies } from "~/services/codescanService";

export const useCodescan = () => {

    const fileSelected = useState<string>('fileSelected', () => '');

    const analyzeDependancies = async (repoUrl: string, branch: string) => {
        try {
            const response = await getAllDependancies(repoUrl, branch)
            return response.dependencies
        }catch (error) {
            console.log(error);
            
        }
    }

    return {
        analyzeDependancies,
        fileSelected
    }
}