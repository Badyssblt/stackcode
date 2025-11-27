// server/modules/codegraph/parsers/jsParser.ts
export function parseJSImports(filePath: string, content: string) {
  const matches = [
    ...content.matchAll(/import\s+[^'"]*['"](.*?)['"]/g),
    ...content.matchAll(/require\s*\(\s*['"](.*?)['"]\s*\)/g),
  ]
  
  const imports = []
  for (const match of matches) {
    const target = match[1]
    if (target.startsWith('.')) {
      imports.push({
        source: filePath,
        target,
        type: 'import',
      })
    }
  }

  

  return imports
}
