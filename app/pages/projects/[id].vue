<template>
<div>
    <h3 class="text-xl font-bold">{{  project.name  }}</h3>

        <!-- name of each tab group should be unique -->
    <div class="tabs tabs-border w-full">
        <input type="radio" name="my_tabs_2" class="tab" aria-label="CodeScan" checked="checked"/>
        <div class="tab-content border-base-200 bg-base-100 p-10 mt-2">
            <div>
                <CodeScanContent/>
            </div>
        </div>

        <input type="radio" name="my_tabs_2" class="tab" aria-label="Tab 2"  />
        <div class="tab-content border-base-300 bg-base-100 p-10">
            Tab content 2
        </div>

        <input type="radio" name="my_tabs_2" class="tab" aria-label="Tab 3" />
        <div class="tab-content border-base-300 bg-base-100 p-10">
            Tab content 3
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