import { getOneRepository, readFile as readFileService } from "~/services/githubService"

export const useGithub = () => {

    const repository = useState('repository', () => null);
    const currentFileContent = useState('currentFileContent', () => null);

    const readFile = async (path: string) => {
        try {
            const data = await readFileService(path)
            currentFileContent.value = data
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

    return {
        readFile,
        getRepository,
        repository,
        currentFileContent
    }
}