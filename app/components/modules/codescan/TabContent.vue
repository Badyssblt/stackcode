<template>
<div class="flex flex-1 min-h-0 gap-2 h-full">
      <RepositoryTree />

      <div class="flex-1 min-h-0 overflow-y-auto rounded">
        <div v-html="code"></div>
      </div>

      <ModulesCodescanAnalyze/>
</div>
</template>

<script setup lang="ts">
import RepositoryTree from '~/components/project/RepositoryTree.vue';
import CodeScanAnalyze from '~/components/modules/codescan/Analyze.vue';
import { useGithub } from '~/composables/useGithub';
import { createHighlighter } from 'shiki'

const { getRepository, currentFileContent } = useGithub()

const highlighter = await createHighlighter({
  themes: ['slack-dark'],
  langs: ['css', 'javascript', 'typescript', 'json', 'vue', 'html']
})
await highlighter.loadLanguage('javascript')
const code = ref('')


watch(currentFileContent, async (newContent) => {
  if (newContent) {
    code.value = highlighter.codeToHtml(
      newContent.content,
      { lang: 'javascript', 
      theme: 'slack-dark',
        lineNumbers: true
    },
      
    )
  }
})



onMounted(async () => {
    await getRepository()
})
</script>

<style scoped> 

</style>