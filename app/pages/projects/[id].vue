<template>
<div>
    <h3 class="text-xl font-bold">{{  project.name  }}</h3>
</div>
</template> 

<script setup lang="ts">
const id = useRoute().params.id as string

const { getProject } = useProjects()

const { data: project } = await useAsyncData('project-' + id, () => getProject(id))
</script>