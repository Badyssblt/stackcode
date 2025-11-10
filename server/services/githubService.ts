// server/services/githubService.ts
import { getAccessToken } from "~~/server/utils/account"

/**
 * Récupère le contenu d'un fichier GitHub
 */
export async function getGitHubFile(event: any, repoUrl: string, branch: string, path: string) {
  // Nettoyer l'URL GitHub
  const cleanUrl = repoUrl.replace(/\.git$/, "")
  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error("Invalid GitHub URL")

  const [_, owner, repo] = match

  // Récupérer le token si disponible
  const account = await getAccessToken(event, "github")
  const githubToken = account?.access_token

  const headers: HeadersInit = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }

  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`
  }

  // Appel à l'API GitHub pour récupérer le fichier
  const fileRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers }
  )

  if (!fileRes.ok) {
    throw new Error(`Impossible de récupérer le fichier (${fileRes.status})`)
  }

  const fileData = await fileRes.json()

  // Décodage du contenu base64
  const content = Buffer.from(fileData.content, 'base64').toString('utf-8')

  return {
    path: fileData.path,
    name: fileData.name,
    content,
    size: fileData.size,
    sha: fileData.sha
  }
}
