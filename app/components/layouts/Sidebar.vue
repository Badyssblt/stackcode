<template>
    <ul class="menu bg-base-200 rounded-box w-56">
        <li>
            <details open>
            <summary>Mes projets</summary>
            <ul>
                
                <li v-for="project in projects"><a>Project 1</a></li>
            </ul>
            </details>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { useProjects } from '~/composables/useProjects';


const { getProjects, projects } = await useProjects()

onMounted(async () => {
    await getProjects()
})
</script>