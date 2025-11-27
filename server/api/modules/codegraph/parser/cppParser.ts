// server/modules/codegraph/parsers/cppParser.ts
export function parseCPPIncludes(filePath: string, content: string) {
  const matches = [...content.matchAll(/#include\s*[<"]([^">]+)[">]/g)]

  const includes = []
  for (const match of matches) {
    includes.push({
      source: filePath,
      target: match[1],
      type: 'include',
    })
  }

  return includes
}
