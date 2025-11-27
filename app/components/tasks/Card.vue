<template>
  <div
    class="bg-base-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-move border border-base-300"
    @click="openDetails"
  >
    <div class="flex items-start justify-between mb-2">
      <h4 class="font-semibold text-sm flex-1">{{ task.title }}</h4>
      <button
        class="btn btn-ghost btn-xs btn-circle text-error"
        @click.stop="$emit('delete')"
        title="Supprimer"
      >
      </button>
    </div>

    <p v-if="task.description" class="text-xs text-base-content/70 mb-3">
      {{ task.description }}
    </p>

    <div class="flex items-center justify-between">
      <div
        v-if="task.priority"
        :class="[
          'badge badge-sm',
          task.priority === 'high' ? 'badge-error' : '',
          task.priority === 'medium' ? 'badge-warning' : '',
          task.priority === 'low' ? 'badge-info' : '',
        ]"
      >
        {{ priorityLabel }}
      </div>

      <div v-if="task.assignedTo" class="avatar placeholder">
        <div class="bg-neutral text-neutral-content rounded-full w-6">
          <span class="text-xs">{{ task.assignedTo.charAt(0).toUpperCase() }}</span>
        </div>
      </div>
    </div>
  </div>


  <div class="drawer drawer-end">
    <input id="my-drawer-5" type="checkbox" class="drawer-toggle" />
    <div class="drawer-side">
      <label for="my-drawer-5" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="menu bg-base-200 min-h-full w-80 p-4">
        <div class="flex items-center gap-4">
          <p
          class="font-medium text-lg"
          contenteditable
          ref="editableTitle"
          @input="updateTitle"
          >
          {{ title }}
          </p>
          <Pen class="size-4" @click.stop="editTitle" />
        </div>
        <div class="flex flex-col gap-2 mt-2">
          <div>
          <label for="assigned_to">Assigné à</label>
          
          <select class="select" v-model="assignedTo">
            <option v-for="user in project?.users">{{ user.user.firstname && user.user.lastname ? user.user?.firstname + " " + user.user?.lastname : user.user?.email }}</option>
          </select>
          
        </div>

        <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Priorité</span>
            </label>
            <select v-model="priority" class="select select-bordered">
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
        </div>
        </div>

        <button class="btn btn-primary">Modifier</button>
        <common-dialog-confirmation-modal title="Voulez-vous supprimer la tâche ?" confirmation-text="Cette action est irréversible" confirm-text="Supprimer">
          <template #button>
            <button class="btn btn-error mt-2 w-full">
              <Trash class="size-4"/>
              Supprimer
            </button>
          </template>
        </common-dialog-confirmation-modal>

      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { Pen } from 'lucide-vue-next';
import { Trash } from 'lucide-vue-next';
import type { Task } from '~~/types/types';

const props = defineProps<{
  task: Task;
}>();

defineEmits<{
  delete: [];
}>();

const { project } = useProjects()


const openDetails = () => {
  const drawer = document.getElementById('my-drawer-5') as HTMLInputElement
  if (drawer) drawer.checked = true
}

const priorityLabel = computed(() => {
  switch (props.task.priority) {
    case 'high':
      return 'Haute';
    case 'medium':
      return 'Moyenne';
    case 'low':
      return 'Basse';
    default:
      return '';
  }
});

const title = ref(props.task.title)
const assignedTo = ref(props.task.assignedTo)
const priority = ref(props.task.priority)

const editableTitle = ref<HTMLElement | null>(null)


const updateTitle = () => {
  if (editableTitle.value) {
    const text = editableTitle.value.innerText.trim()
    console.log("Titre modifié :", text)
    // task.title = text si tu veux mettre à jour en direct
  }
}

const editTitle = () => {
  const el = editableTitle.value
  if (!el) return

  el.setAttribute("contenteditable", "true")
  el.focus()

  // Met le curseur à la fin
  const range = document.createRange()
  const sel = window.getSelection()
  range.selectNodeContents(el)
  range.collapse(false)
  sel?.removeAllRanges()
  sel?.addRange(range)
}
</script>
