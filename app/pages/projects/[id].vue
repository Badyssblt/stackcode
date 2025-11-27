<template>
<div class="flex flex-col h-screen p-2">
    <h3 class="text-xl font-bold">{{ project.name }}</h3>

    <div class="tabs tabs-border flex-1">
        <input type="radio" name="primary_tabs" class="tab w-fit" aria-label="Tâches" checked />
        <div class="tab-content border-base-200 bg-base-100 p-2 min-h-0">
            <TasksTabContent/>
        </div>

        <input type="radio" name="primary_tabs" class="tab w-fit" aria-label="Modules"  />
        <div class="tab-content border-base-200 bg-base-100 p-2 min-h-0">
            <div class="tabs tabs-border flex-1">
                <input type="radio" name="my_tabs_2" class="tab w-fit" aria-label="CodeScan" checked="checked" />
                <div class="tab-content border-base-200 bg-base-100 p-2 min-h-0">
                    <ModulesCodescanTabContent/>
                </div>

                <input type="radio" name="my_tabs_2" class="tab w-fit" aria-label="CodeGraph" checked="checked" />
                <div class="tab-content border-base-200 bg-base-100 p-2 min-h-0">
                    <ModulesCodegraphTabContent/>
                </div>
            </div>
        </div>
    </div>
    
</div>
</template>

<script setup lang="ts">
const id = useRoute().params.id as string

const { getProject } = useProjects()

const { data: project } = await useAsyncData('project-' + id, () => getProject(id))

definePageMeta({
    ssr: false
})
</script>