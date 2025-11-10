<template>
<div class="flex flex-col h-screen p-2">
    <h3 class="text-xl font-bold">{{ project.name }}</h3>

    <div class="tabs tabs-border w-full flex-1 min-h-0 flex flex-col">
        <input type="radio" name="my_tabs_2" class="tab w-fit" aria-label="CodeScan" checked="checked" />
        <div class="tab-content border-base-200 bg-base-100 p-2 flex-1 min-h-0">
            <CodeScanContent/>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { CodeScanContent } from '~/components/modules/codescan';

const id = useRoute().params.id as string

const { getProject } = useProjects()

const { data: project } = await useAsyncData('project-' + id, () => getProject(id))
</script>