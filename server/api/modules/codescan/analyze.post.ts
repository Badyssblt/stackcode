import { defineEventHandler, readBody, createError } from 'h3'
import { getGitHubFile } from "~~/server/services/githubService"
import fetch from 'node-fetch'

async function checkVulnerabilities(deps: Record<string, string>) {
  const results: any[] = []

  for (const [name, version] of Object.entries(deps)) {
    try {
      const cleanedVersion = version.replace(/^[\^~]/, '')


      const res = await fetch(`https://registry.npmjs.org/${name}`)
      if (!res.ok) throw new Error("Registry fetch failed")

      const data = await res.json()
      const latestVersion = data['dist-tags']?.latest
      const status = cleanedVersion !== latestVersion ? "update-available" : "ok"

      results.push({ name, currentVersion: cleanedVersion, latestVersion, status })
    } catch (err: any) {
      results.push({ name, currentVersion: version, status: "unknown", error: err.message })
    }
  }

  return results
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { repoUrl, branch } = body

    if (!repoUrl) throw createError({ statusCode: 400, statusMessage: "repoUrl is required" })

    const fileData = await getGitHubFile(event, repoUrl, branch || "main", 'package.json')
    if (!fileData?.content) throw createError({ statusCode: 404, statusMessage: "package.json not found" })

    const cleaned = fileData.content.replace(/^\uFEFF/, '').replace(/[\u0000-\u001F]+/g, '')

    let packageJson
    try {
      packageJson = JSON.parse(cleaned)
    } catch {
      throw createError({ statusCode: 500, statusMessage: "Invalid package.json content" })
    }

    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }

    const results = await checkVulnerabilities(deps)

    return { success: true, dependencies: results }

  } catch (err: any) {
    return { success: false, message: err.message || "Error" }
  }
})
