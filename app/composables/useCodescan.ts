import { analyzeCodeContent, getAllDependancies } from "~/services/codescanService";

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

        const analyzeCode = async (repoUrl: string, branch: string, filePath: string) => {
            try {
                const response = await analyzeCodeContent(repoUrl, branch, filePath)
                return response
            }catch (error) {
                console.log(error);
                
            }
        }


    return {
        analyzeDependancies,
        analyzeCode,
        fileSelected
    }
}