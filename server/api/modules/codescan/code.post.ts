import { defineEventHandler, readBody, createError } from "h3"
import { getGitHubFile } from "~~/server/services/githubService"
import { exec } from "child_process"
import fs from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { repoUrl, branch = "main", filePath } = body

  if (!repoUrl || !filePath) {
    throw createError({ statusCode: 400, statusMessage: "Missing params" })
  }

  const fileData = await getGitHubFile(event, repoUrl, branch, filePath)
  if (!fileData?.content) {
    throw createError({ statusCode: 404, statusMessage: "File not found" })
  }

  // 🔹 On nettoie le contenu (GitHub renvoie parfois du base64 ou du \r)
  const cleanedContent = Buffer.from(fileData.content, "utf-8").toString()

  // 🔹 Sauvegarde temporaire dans /tmp/
  const tmpPath = join(tmpdir(), filePath.replace(/\//g, "_"))
  await fs.writeFile(tmpPath, cleanedContent, "utf-8")

  // 🔹 Lancer semgrep avec un profil de sécurité général
  // --config auto : Semgrep détecte le langage et applique les règles de base
  const result = await new Promise<string>((resolve, reject) => {
    exec(`semgrep --config auto --json ${tmpPath}`, (err, stdout, stderr) => {
      if (err && !stdout) reject(stderr || err.message)
      else resolve(stdout)
    })
  })

  await fs.unlink(tmpPath)

  let parsed
  try {
    parsed = JSON.parse(result)
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: "Invalid Semgrep output" })
  }

  // 🔹 Formatage pour ton UI
  const findings = (parsed.results || []).map((r: any) => ({
    ruleId: r.check_id,
    message: r.extra.message,
    severity: r.extra.severity,
    start: r.start,
    end: r.end,
    path: r.path,
    metadata: r.extra.metadata,
  }))

  return { success: true, findings }
})
