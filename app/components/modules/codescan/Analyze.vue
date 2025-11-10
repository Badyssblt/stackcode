<template>
<div class="bg-base-200 p-2 rounded-sm min-h-0 overflow-y-auto flex-[0.5]">
    <!-- name of each tab group should be unique -->
    <div class="tabs tabs-border">
        <input type="radio" name="analyze_tab_1" class="tab" aria-label="Dépendances" checked />
        <div class="tab-content border-base-300">
                <button class="btn btn-sm btn-primary w-full" @click="analyzeLatestVersion">
                <span v-if="loading" class="loading loading-spinner"></span>
                Analyser les dépendances
                </button>

            <div class="flex flex-col gap-2 mt-2">
                <div class="border border-base-content/10 p-2 rounded text-sm" v-for="dependancy in dependancies">
                    <p>{{ dependancy.name  }}</p>
                    <div class="flex justify-between">
                        <div class="flex flex-col items-center">
                            <p :class="dependancy.currentVersion === dependancy.latestVersion ? 'text-success' : 'text-warning'">{{  dependancy.currentVersion  }}</p>
                            <span class="badge badge-xs">current</span>
                        </div>
                        <div class="flex flex-col items-center">
                            <p class="text-success">{{  dependancy.latestVersion  }}</p>
                            <span class="badge badge-xs">latest</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <input type="radio" name="analyze_tab_1" class="tab" aria-label="Analyse de fichier" />
        <div class="tab-content">
            <div class="flex flex-col">
                <button class="btn btn-sm btn-primary w-full" @click="analyzeLatestVersion">
                    <span v-if="loading" class="loading loading-spinner"></span>
                    Analyser ce fichier
                </button>
                <p class="text-xs text-center my-1 ">{{ fileSelected }}</p>
            </div>
        </div>
    </div>


</div>
    
</template> 

<script setup lang="ts">
import type { Dependency } from '~~/types/types'
const loading = ref<boolean>(false)

const { project } = useProjects()
const { fileSelected } = useCodescan()


const { analyzeDependancies } = useCodescan()

const dependancies = ref<Dependency[]>([])
const analyzeLatestVersion = async () => {
    loading.value = true
    dependancies.value = await analyzeDependancies(project.value?.repoUrl, 'dev')
    loading.value = false
    
}
</script>