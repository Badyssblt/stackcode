<template>
    <div class="menu bg-base-200 h-screen rounded-box w-56">
        <h1 class="text-lg font-bold">StackCode.</h1>
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
                <li v-for="project in projects"><a>{{ project.name  }}</a></li>
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
import { Plus } from 'lucide-vue-next';

const { projects, getProjects, createProject } = useProjects();

await useAsyncData('load-projects', () => getProjects());

const createProjectModal = ref(null)

const name = ref("")

</script>