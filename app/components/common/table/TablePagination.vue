<script setup lang="ts">
const props = defineProps({ table: Object })
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
    <div>
      Page {{ props.table.getState().pagination.pageIndex + 1 }}
      sur {{ props.table.getPageCount() }}
    </div>

    <div class="flex gap-2">
      <button
        class="px-3 py-1 border rounded disabled:opacity-50"
        :disabled="!props.table.getCanPreviousPage()"
        @click="props.table.previousPage()"
      >
        Précédent
      </button>
      <button
        class="px-3 py-1 border rounded disabled:opacity-50"
        :disabled="!props.table.getCanNextPage()"
        @click="props.table.nextPage()"
      >
        Suivant
      </button>
    </div>
  </div>
</template>
