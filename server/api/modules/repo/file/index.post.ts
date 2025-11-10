import { getAccessToken } from "~~/server/utils/account"

// server/api/github/file.post.ts
export default defineEventHandler(async (event) => {
  const { repoUrl, branch, path } = await readBody(event)

  // Supprimer .git si présent
  const cleanUrl = repoUrl.replace(/\.git$/, "")

  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw createError({ statusCode: 400, statusMessage: "Invalid GitHub URL" })

  const [_, owner, repo] = match

  
  const account = await getAccessToken(event, "github")
  const githubToken = account?.access_token
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
  
  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`
  }

  // Récupérer le contenu du fichier
  const fileRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers }
  )
  
  if (!fileRes.ok) {
    throw createError({ 
      statusCode: fileRes.status, 
      statusMessage: "Impossible de récupérer le fichier" 
    })
  }

  const fileData = await fileRes.json()

  // Le contenu est en base64, il faut le décoder
  const content = Buffer.from(fileData.content, 'base64').toString('utf-8')

  return {
    path: fileData.path,
    name: fileData.name,
    content,
    size: fileData.size,
    sha: fileData.sha
  }
})