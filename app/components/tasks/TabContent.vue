<template>
  <div class="h-full w-full p-6 bg-base-100">
    <div class="flex gap-4 h-full overflow-x-auto">
      <!-- Colonne: À faire -->
      <div class="flex-shrink-0 w-80 bg-base-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-gray-400"></span>
            À faire
            <span class="badge badge-sm">{{ tasks.todo.length }}</span>
          </h3>
          <button class="btn btn-ghost btn-sm btn-circle" @click="addTask('todo')">
            <Plus/>
          </button>
        </div>
        <draggable
          :list="tasks.todo"
          :group="{ name: 'tasks', pull: true, put: true }"
          :animation="200"
          item-key="id"
          class="space-y-3 min-h-[200px]"
          @change="onTaskMove"
        >
          <TasksCard
            v-for="task in tasks.todo"
            :key="task.id"
            :task="task"
            @delete="deleteTaskHandler(task.id)"
          />
        </draggable>
      </div>

      <!-- Colonne: En cours -->
      <div class="flex-shrink-0 w-80 bg-base-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-400"></span>
            En cours
            <span class="badge badge-sm badge-primary">{{ tasks.in_progress.length }}</span>
          </h3>
          <button class="btn btn-ghost btn-sm btn-circle" @click="addTask('in_progress')">
            <Plus />
          </button>
        </div>
        <draggable
          :list="tasks.in_progress"
          :group="{ name: 'tasks', pull: true, put: true }"
          :animation="200"
          item-key="id"
          class="space-y-3 min-h-[200px]"
          @change="onTaskMove"
        >
          <TasksCard
            v-for="task in tasks.in_progress"
            :key="task.id"
            :task="task"
            @delete="deleteTaskHandler(task.id)"
          />
        </draggable>
      </div>

      <!-- Colonne: En revue -->
      <div class="flex-shrink-0 w-80 bg-base-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
            En revue
            <span class="badge badge-sm badge-warning">{{ tasks.review.length }}</span>
          </h3>
          <button class="btn btn-ghost btn-sm btn-circle" @click="addTask('review')">
            <Plus/>
          </button>
        </div>
        <draggable
          :list="tasks.review"
          :group="{ name: 'tasks', pull: true, put: true }"
          :animation="200"
          item-key="id"
          class="space-y-3 min-h-[200px]"
          @change="onTaskMove"
        >
          <TasksCard
            v-for="task in tasks.review"
            :key="task.id"
            :task="task"
            @delete="deleteTaskHandler(task.id)"
          />
        </draggable>
      </div>

      <!-- Colonne: Terminé -->
      <div class="flex-shrink-0 w-80 bg-base-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-green-400"></span>
            Terminé
            <span class="badge badge-sm badge-success">{{ tasks.done.length }}</span>
          </h3>
          <button class="btn btn-ghost btn-sm btn-circle" @click="addTask('done')">
            <Plus/>
          </button>
        </div>
        <draggable
          :list="tasks.done"
          :group="{ name: 'tasks', pull: true, put: true }"
          :animation="200"
          item-key="id"
          class="space-y-3 min-h-[200px]"
          @change="onTaskMove"
        >
          <TasksCard
            v-for="task in tasks.done"
            :key="task.id"
            :task="task"
            @delete="deleteTaskHandler(task.id)"
          />
        </draggable>
      </div>
    </div>

    <!-- Modal pour ajouter une tâche -->
    <dialog ref="taskModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Nouvelle tâche</h3>
        <form @submit.prevent="saveNewTask">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Titre</span>
            </label>
            <input
              v-model="newTask.title"
              type="text"
              placeholder="Titre de la tâche"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Description</span>
            </label>
            <textarea
              v-model="newTask.description"
              placeholder="Description (optionnel)"
              class="textarea textarea-bordered"
              rows="3"
            ></textarea>
          </div>
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Priorité</span>
            </label>
            <select v-model="newTask.priority" class="select select-bordered">
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
          <div class="modal-action">
            <button type="button" class="btn" @click="closeModal">Annuler</button>
            <button type="submit" class="btn btn-primary">Créer</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import type { Task, TaskStatus } from '~/types/types'
import { Plus } from 'lucide-vue-next'
import * as taskService from '~/services/taskService'

const props = defineProps<{
  projectId: string
}>()

const { project } = useProjects()

// État des colonnes
const tasks = reactive<Record<TaskStatus, Task[]>>({
  todo: [],
  in_progress: [],
  review: [],
  done: [],
})

const loading = ref(true)

// Charger les tâches au montage du composant
const loadTasks = async () => {
  try {
    loading.value = true
    const data = await taskService.getProjectTasks(project.value.id)

    // Réorganiser les tâches par statut
    tasks.todo = data.filter((t: Task) => t.status === 'todo')
    tasks.in_progress = data.filter((t: Task) => t.status === 'in_progress')
    tasks.review = data.filter((t: Task) => t.status === 'review')
    tasks.done = data.filter((t: Task) => t.status === 'done')
  } catch (error) {
    console.error('Error loading tasks:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTasks()
})

// Modal et nouvelle tâche
const taskModal = ref<HTMLDialogElement | null>(null)
const newTask = reactive({
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  status: 'todo' as TaskStatus,
})

const addTask = (status: TaskStatus) => {
  newTask.status = status
  taskModal.value?.showModal()
}

const saveNewTask = async () => {
  try {
    const task = await taskService.createTask(project.value.id, {
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
    })

    tasks[newTask.status].push(task)
    closeModal()
  } catch (error) {
    console.error('Error creating task:', error)
  }
}

const closeModal = () => {
  taskModal.value?.close()
  newTask.title = ''
  newTask.description = ''
  newTask.priority = 'medium'
}

const deleteTaskHandler = async (taskId: string) => {
  try {
    await taskService.deleteTask(taskId)

    // Supprimer la tâche de l'état local
    for (const status in tasks) {
      const index = tasks[status as TaskStatus].findIndex((t) => t.id === taskId)
      if (index !== -1) {
        tasks[status as TaskStatus].splice(index, 1)
        break
      }
    }
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

const onTaskMove = async (evt: any) => {
  // Trouver la tâche déplacée et son nouveau statut
  if (evt.added || evt.moved) {
    const element = evt.added?.element || evt.moved?.element

    if (element) {
      // Déterminer le nouveau statut en fonction de la liste
      let newStatus: TaskStatus = 'todo'
      for (const [status, taskList] of Object.entries(tasks)) {
        if (taskList.includes(element)) {
          newStatus = status as TaskStatus
          break
        }
      }

      // Mettre à jour le statut de la tâche
      if (element.status !== newStatus) {
        try {
          await taskService.updateTask(element.id, { status: newStatus })
          element.status = newStatus
        } catch (error) {
          console.error('Error updating task status:', error)
          // Recharger les tâches en cas d'erreur
          await loadTasks()
        }
      }
    }
  }
}
</script>
