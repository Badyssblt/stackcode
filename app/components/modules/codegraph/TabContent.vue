<template>
  <div class="flex flex-col h-full w-full gap-2">
    <button class="btn btn-primary w-40" @click="analyzeCodeGraph">
      Lancer l'analyse
    </button>
    <div class="w-full h-full">
      <VueFlow
        v-model="elements"
        class="bg-base-200 rounded-lg h-full"
        :fit-view="true"
        :min-zoom="0.2"
        :max-zoom="2"
      >
        <Background />
      </VueFlow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const elements = ref<any[]>([])

interface TreeNode {
  id: string
  type: 'folder' | 'file'
  children?: TreeNode[]
}

/** Résout un chemin relatif en chemin absolu */
function resolveRelativePath(from: string, to: string): string {
  // Si c'est déjà un chemin absolu, le retourner tel quel
  if (!to.startsWith('.')) return to

  // Obtenir le dossier du fichier source
  const fromParts = from.split('/')
  fromParts.pop() // Enlever le nom du fichier

  // Traiter le chemin relatif
  const toParts = to.split('/')
  
  toParts.forEach(part => {
    if (part === '..') {
      fromParts.pop() // Remonter d'un niveau
    } else if (part !== '.') {
      fromParts.push(part) // Ajouter le segment
    }
  })

  let resolved = fromParts.join('/')
  
  // Ajouter l'extension .vue si elle manque
  if (!resolved.endsWith('.vue') && !resolved.endsWith('.ts')) {
    resolved += '.vue'
  }

  return resolved
}

/** Transforme un tableau de fichiers en arbre hiérarchique */
function buildTree(filePaths: string[]): TreeNode[] {
  const tree: Record<string, TreeNode & { children: Record<string, TreeNode> }> = {}

  filePaths.forEach(path => {
    const parts = path.split('/')
    let currentLevel = tree

    parts.forEach((part, index) => {
      const id = parts.slice(0, index + 1).join('/')
      if (!currentLevel[id]) {
        currentLevel[id] = {
          id,
          type: index === parts.length - 1 ? 'file' : 'folder',
          children: {}
        } as TreeNode & { children: Record<string, TreeNode> }
      }
      if (index < parts.length - 1) currentLevel = currentLevel[id].children
    })
  })

  function convert(nodeObj: Record<string, TreeNode & { children: Record<string, TreeNode> }>): TreeNode[] {
    return Object.values(nodeObj).map(node => ({
      id: node.id,
      type: node.type,
      children: node.children ? convert(node.children) : undefined
    }))
  }

  return convert(tree)
}

/** Calcule hauteur totale pour aligner verticalement */
function calculateHeight(node: TreeNode, spacing = 50): number {
  if (!node.children || node.children.length === 0) return spacing
  return node.children.reduce((sum, child) => sum + calculateHeight(child, spacing), spacing)
}

/** Transforme l'arbre en nodes & edges VueFlow avec structure hiérarchique */
function buildNodesEdges(
  tree: TreeNode[],
  importEdges: any[],
  startX = 0,
  startY = 0,
  folderSpacing = 250,
  fileSpacing = 50
) {
  const nodes: any[] = []
  const edges: any[] = []
  const nodeMap = new Map<string, any>()

  let xOffset = startX

  tree.forEach(node => {
    const nodeHeight = calculateHeight(node, fileSpacing)
    const yOffset = startY

    // Créer le node (dossier ou fichier)
    nodes.push({
      id: node.id,
      label: node.id.split('/').pop(),
      type: node.type,
      data: { label: node.id.split('/').pop() },
      position: { x: xOffset, y: yOffset },
      style: {
        padding: node.type === 'folder' ? '6px 12px' : '4px 8px',
        borderRadius: '6px',
        background: node.type === 'folder' ? '#4f46e5' : '#1e293b',
        color: '#f1f5f9',
        border: '1px solid ' + (node.type === 'folder' ? '#6366f1' : '#475569'),
        fontSize: '0.85rem'
      }
    })

    nodeMap.set(node.id, true)

    // Si le node a des enfants, les traiter récursivement
    if (node.children && node.children.length > 0) {
      let childY = yOffset + fileSpacing
      node.children.forEach(child => {
        const { nodes: childNodes, edges: childEdges } = buildNodesEdges(
          [child],
          [],
          xOffset + folderSpacing,
          childY,
          folderSpacing,
          fileSpacing
        )
        nodes.push(...childNodes)
        edges.push(...childEdges)

        // Edge de hiérarchie (dossier -> enfant)
        edges.push({
          id: `hierarchy-${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          animated: false,
          style: { stroke: '#64748b', strokeDasharray: '5,5' }
        })

        const childHeight = calculateHeight(child, fileSpacing)
        childY += childHeight
      })
    }

    xOffset += folderSpacing
  })

  // Ajouter les edges d'import uniquement si les nodes existent
  importEdges.forEach(e => {
    const resolvedTarget = resolveRelativePath(e.source, e.target)
    
    if (nodeMap.has(e.source) && nodeMap.has(resolvedTarget)) {
      edges.push({
        id: `import-${e.source}-${resolvedTarget}`,
        source: e.source,
        target: resolvedTarget,
        animated: true,
        style: { stroke: '#facc15', strokeWidth: 2 },
        label: 'import',
        labelStyle: { fill: '#facc15', fontSize: '10px' }
      })
    }
  })

  return { nodes, edges }
}

/** Utilise directement la réponse de ton API */
const analyzeCodeGraph = async () => {
  const response = await $fetch('/api/modules/codegraph', {
    method: 'POST',
    body: {
      repoUrl: "https://github.com/Badyssblt/stackcode.git",
      branch: "dev"
    }
  })

  const files = response.nodes.map((n: any) => n.id)
  const tree = buildTree(files)
  
  const { nodes, edges } = buildNodesEdges(tree, response.edges)

  elements.value = [...nodes, ...edges]
}
</script>