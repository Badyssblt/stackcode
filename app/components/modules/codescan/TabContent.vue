<template>
  <!-- Ce conteneur doit pouvoir grandir ET limiter la hauteur -->
  <div class="flex flex-1 min-h-0 gap-2 h-full">
    <ProjectRepositoryTree class="h-[820px] overflow-y-auto"/>

    <!-- 🟩 Ce bloc DOIT avoir flex + min-h-0 + overflow-y-auto -->
    <div class="flex-1 min-h-0 h-[820px] overflow-y-auto rounded bg-base-200 p-2">
      <div v-html="code"></div>
    </div>

    <ModulesCodescanAnalyze />
  </div>
</template>

<script setup lang="ts">
import { createHighlighter } from 'shiki'

const { getRepository, currentFileContent } = useGithub()

const highlighter = ref<any>(null)
const code = ref('')

watch(currentFileContent, async (newContent) => {
  if (newContent && highlighter.value) {
    code.value = highlighter.value.codeToHtml(
      newContent.content,
      { lang: 'javascript',
      theme: 'slack-dark',
        lineNumbers: true
    },

    )
  }
})

onMounted(async () => {
    highlighter.value = await createHighlighter({
      themes: ['slack-dark'],
      langs: ['css', 'javascript', 'typescript', 'json', 'vue', 'html']
    })
    await highlighter.value.loadLanguage('javascript')
    await getRepository()
})
</script>

<style scoped> 
:deep(code){
    counter-reset: step;
  counter-increment: step 0;
}

:deep(code .line::before){
  content: counter(step);
  counter-increment: step;
  width: 1rem;
  margin-right: 1.5rem;
  display: inline-block;
  text-align: right;
  color: rgba(115,138,148,.4)
}
</style>