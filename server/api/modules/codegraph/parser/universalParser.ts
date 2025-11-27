// server/modules/codegraph/parsers/universalParser.ts

import { parseCPPIncludes } from "./cppParser"
import { parseJSImports } from "./jsParser"


export async function parseFileDependencies(filePath: string, content: string) {
  if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.vue')) {
    return parseJSImports(filePath, content)
  }

  if (filePath.endsWith('.c') || filePath.endsWith('.cpp') || filePath.endsWith('.h') || filePath.endsWith('.hpp')) {
    return parseCPPIncludes(filePath, content)
  }

  return [] // Langage non pris en charge pour l'instant
}
