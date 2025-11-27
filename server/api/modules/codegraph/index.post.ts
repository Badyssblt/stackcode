// server/modules/codegraph/index.post.ts
import { defineEventHandler, readBody } from 'h3'
import { getGitHubRepoFiles, getGitHubFile } from '~~/server/services/githubService'
import { parseFileDependencies } from './parser/universalParser'

export default defineEventHandler(async (event) => {
  const { repoUrl, branch = 'main' } = await readBody(event)
  const files = await getGitHubRepoFiles(event, repoUrl, branch)

  console.log(files);
  
  const edges = []
  const nodes = []

  for (const file of files) {
    if (!file.path.match(/\.(js|ts|tsx|vue|c|cpp|h|hpp)$/)) continue

    const fileData = await getGitHubFile(event, repoUrl, branch, file.path)
    const deps = await parseFileDependencies(file.path, fileData.content)
    
    
    if (Array.isArray(deps)) {
        edges.push(...deps)
    } else if (deps) {
    // Si c’est un seul objet ou une valeur simple
        edges.push(deps)
    }
    nodes.push({ id: file.path })
  }

  return { success: true, nodes, edges }
})
