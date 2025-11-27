<template>
    <div>
        <p>{{ notification.project.name }}</p>
        <div class="flex">
           <button class="btn btn-primary btn-xs" @click="acceptNotification(notification)"><Check /></button>
           <button class="btn btn-primary btn-xs"><X /></button>
        </div>
    </div>
</template> 


<script setup lang="ts">
import type { Notification } from '~~/types/types';
import { Bell, BellRing, Check, Plus, X } from 'lucide-vue-next';

const { acceptNotification } = useNotification()


const props = defineProps<{notification: Notification}>()

</script>