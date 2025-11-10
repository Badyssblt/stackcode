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

  // Récupérer le fichier depuis GitHub
  const fileData = await getGitHubFile(event, repoUrl, branch, filePath)
  if (!fileData?.content) {
    throw createError({ statusCode: 404, statusMessage: "File not found" })
  }

  // Écrire temporairement le fichier
  const tmpPath = join(tmpdir(), filePath.replace(/\//g, "_"))
  await fs.writeFile(tmpPath, fileData.content, "utf-8")

  // 🔹 Lancer Semgrep avec packs officiels + règles locales
  const result = await new Promise<string>((resolve, reject) => {
    exec(
      `semgrep --config p/ci --config p/javascript --config p/typescript --config p/react --config p/security-audit --config ./rules/mvp.yml --json ${tmpPath}`,
      (err, stdout, stderr) => {
        if (err && !stdout) reject(stderr || err.message)
        else resolve(stdout)
      }
    )
  })

  await fs.unlink(tmpPath)

  // Parser les résultats
  let parsed
  try {
    parsed = JSON.parse(result)
  } catch {
    throw createError({ statusCode: 500, statusMessage: "Invalid Semgrep output" })
  }

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
