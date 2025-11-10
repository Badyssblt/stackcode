// server/api/github/file.post.ts
export default defineEventHandler(async (event) => {
  const { owner, repo, branch, path } = await readBody(event)

  const user = await getCurrentUser(event)
  console.log(user);
  
  const githubToken = process.env.GITHUB_TOKEN
  
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