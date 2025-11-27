<template>
  <div
    class="bg-base-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-move border border-base-300"
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '~/types/types';

const props = defineProps<{
  task: Task;
}>();

defineEmits<{
  delete: [];
}>();

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
</script>
