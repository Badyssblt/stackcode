<template>
    <RepositoryTree/>
</template> 

<script setup lang="ts">
import RepositoryTree from '~/components/project/RepositoryTree.vue';
const { getRepository } = useProjects()

onMounted(async () => {
    await getRepository()
})
</script>