<template>
    <li>
        <div class="flex justify-between items-center">
            <p>{{  project.name  }}</p>
            <div class="dropdown">
            <div tabindex="0" role="button"><EllipsisVertical class="size-4"/></div>
            <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <li><button class="btn btn-soft btn-error">Supprimer</button></li>
            </ul>
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next';

type Project = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}


defineProps<{project: Project}>()
</script>