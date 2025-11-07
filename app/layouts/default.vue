<template>
    <div class="flex">
        <Sidebar />
        <div class="p-2">
            <slot />
        </div>
    </div>
</template>

<script setup>
import Sidebar from '~/components/layouts/Sidebar.vue'
</script>