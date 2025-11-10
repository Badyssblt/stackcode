export default defineEventHandler(async (event) => {
  const { repoUrl, branch } = await readBody(event)

  // Supprimer .git si présent
  const cleanUrl = repoUrl.replace(/\.git$/, "")

  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw createError({ statusCode: 400, statusMessage: "Invalid GitHub URL" })

  const [_, owner, repo] = match

  // Étape 1 : Récupérer les infos du repo pour connaître la branche par défaut
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
  if (!repoRes.ok) throw createError({ statusCode: repoRes.status, statusMessage: "GitHub API error (repo)" })
    
  
  const repoData = await repoRes.json()
  const branchToUse = branch || repoData.default_branch || "main"

  // Étape 2 : Récupérer le SHA du dernier commit de la branche
  const branchRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches/${branchToUse}`
  )
  if (!branchRes.ok) throw createError({ statusCode: branchRes.status, statusMessage: "GitHub API error (branch)" })
  
  const branchData = await branchRes.json()
  const commitSha = branchData.commit.sha

  // Étape 3 : Récupérer l'arborescence complète avec le SHA
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${commitSha}?recursive=1`
  )
  if (!treeRes.ok) throw createError({ statusCode: treeRes.status, statusMessage: "GitHub API error (tree)" })

  const data = await treeRes.json()

  const tree = data.tree.map((item: any) => ({
    path: item.path,
    type: item.type, // "blob" ou "tree"
  }))

  return { owner, repo, branch: branchToUse, tree }
})