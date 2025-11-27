<template>
    <div class="menu bg-base-200 h-screen rounded-box w-56">
        <div class="flex items-center justify-between">
            <h1 class="text-lg font-bold">StackCode.</h1>
            <button  popovertarget="popover-1" style="anchor-name:--anchor-1">
                <BellRing class="size-5" v-if="notifications && notifications.length > 0"/>
                <Bell class="size-5" v-else/>
            </button>
            <ul class="dropdown dropdown-center menu w-52 rounded-box bg-base-100 shadow-sm"
                popover id="popover-1" style="position-anchor:--anchor-1" v-if="notifications && notifications.length > 0">
                <li v-for="notification in notifications">
                   <Notification :notification="notification"/>
                </li>
            </ul>
        </div>
        <ul class="mt-2">
            <li>
            <details open>
            <summary>Mes projets</summary>
            
            <ul>
                <li>
                    <button class="btn px-0 justify-start" @click="() => createProjectModal.showModal()">
                        <Plus/>
                    Créer un projet
                </button>
                </li>
                <ProjectCardSidebar v-for="project in projects" :project="project"/>
            </ul>
            </details>
        </li>
        </ul>
    </div>


    <dialog ref=createProjectModal class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Créer un projet</h3>
            <form @submit.prevent="() => createProject(name)" class="mt-2">
                <label class="input w-full">
                    <span class="label">Nom du projet</span>
                    <input v-model="name" type="text" placeholder="Mon projet" />
                </label>
                <button class="btn btn-primary w-full mt-2">
                    <Plus/>
                    Créer le projet
                </button>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
import { Bell, BellRing, Check, Plus, X } from 'lucide-vue-next';
import ProjectCardSidebar from '../project/ProjectCardSidebar.vue';
import { useSocket } from '~/composables/useSocket';
import { useNotification } from '~/composables/useNotification';
import Notification from '../common/notifications/Notification.vue';

const { projects, getProjects, createProject } = useProjects();
const { notifications, getAllNotifications } = useNotification()
const { subscribeUserNotifications, on } = useSocket();

await useAsyncData('load-projects', () => getProjects());
await useAsyncData('load-notifications', () => getAllNotifications())

const createProjectModal = ref(null)

const name = ref("")


const handleAddNotification = (notification: { id: string, message: string }) => {
    notifications.value.unshift(notification);
    console.log(notifications.value);
    
}

onMounted(() => {
    subscribeUserNotifications()

    // Écoute des notifications depuis le serveur
    on('notification:invitation', (payload: { id: string, message: string }) => {
        handleAddNotification(payload)
    })
})
</script>