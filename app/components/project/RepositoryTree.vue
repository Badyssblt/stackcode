<template>
  <div>
    <ul class="menu menu-xs bg-base-200 rounded-box max-w-xs w-full">
      <TreeItem 
        v-for="node in tree" 
        :key="node.path" 
        :node="node"
        :level="0"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useGithub } from '~/composables/useGithub'
import TreeItem from './TreeItem.vue'

interface TreeNode {
  path: string
  name: string
  type: 'file' | 'folder'
  children?: TreeNode[]
}

interface GitHubApiResponse {
  owner: string
  repo: string
  branch: string
  tree: Array<{ path: string; type: 'blob' | 'tree' }>
}

const { repository } = useGithub()
const { fileSelected } = useCodescan()


// Fonction pour déterminer si un chemin est un dossier
function isFolder(path: string, allPaths: string[]): boolean {
  // Si un autre chemin commence par ce chemin + "/", c'est un dossier
  return allPaths.some(p => p !== path && p.startsWith(path + '/'))
}

// Fonction pour construire l'arbre hiérarchique
function buildTree(flatTree: Array<{ path: string; type: 'blob' | 'tree' }>): TreeNode[] {
  const root: TreeNode[] = []
  const allPaths = flatTree.map(item => item.path)
  const nodeMap = new Map<string, TreeNode>()

  // Créer tous les nœuds en déterminant leur type
  flatTree.forEach(item => {
    const parts = item.path.split('/')
    const name = parts[parts.length - 1]
    const type = isFolder(item.path, allPaths) ? 'folder' : 'file'
    
    const node: TreeNode = {
      path: item.path,
      name,
      type,
      children: type === 'folder' ? [] : undefined
    }
    
    nodeMap.set(item.path, node)
  })

  // Construire la hiérarchie
  flatTree.forEach(item => {
    const parts = item.path.split('/')
    const node = nodeMap.get(item.path)!
    
    if (parts.length === 1) {
      // Élément racine
      root.push(node)
    } else {
      // Trouver le parent
      const parentPath = parts.slice(0, -1).join('/')
      const parent = nodeMap.get(parentPath)
      
      if (parent && parent.children) {
        parent.children.push(node)
      }
    }
  })

  // Trier : dossiers d'abord, puis fichiers, alphabétiquement
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
    
    nodes.forEach(node => {
      if (node.children) {
        sortNodes(node.children)
      }
    })
  }
  
  sortNodes(root)
  return root
}

// Computed tree basé sur repository
const tree = computed(() => {
  return buildTree(repository.value?.tree || [])
})


</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>