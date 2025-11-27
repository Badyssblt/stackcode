<script setup lang="ts">
import { useVueTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/vue-table'

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
})

const slots = useSlots()

// Détecte si le slot actions existe (fonction truthy)
const hasActions = computed(() => !!slots.actions)

const table = useVueTable({
  data: props.data,
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
</script>

<template>
  <div class="w-full rounded-2xl bg-background shadow-sm">
    <!-- Table -->
    <table class="w-full text-sm">
      <thead class=" bg-base-200">
        <tr>
          <th
            v-for="header in table.getHeaderGroups()[0]?.headers || []"
            :key="header.id"
            class="px-4 py-2 text-left font-semibold"
          >
            <div
              class="flex items-center cursor-pointer select-none"
              @click="header.column.toggleSorting()"
            >
              {{ header.column?.columnDef?.header }}
              <span v-if="header.column.getIsSorted() === 'asc'" class="ml-1">↑</span>
              <span v-if="header.column.getIsSorted() === 'desc'" class="ml-1">↓</span>
            </div>
          </th>

          <!-- HEADER Actions affiché seulement si le slot existe -->
          <th v-if="hasActions" class="px-4 py-2 text-left font-semibold">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          class="hover:bg-base-200"
        >
          <td
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            class="px-4 py-2"
          >
            {{ cell.getValue() }}
          </td>

          <!-- TD Actions affiché seulement si le slot existe -->
          <td v-if="hasActions" class="px-4 py-2">
            <!-- on place le slot ici : il sera rendu pour CHAQUE ligne -->
            <slot name="actions" :row="row"></slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <CommonTableTablePagination :table="table" />
  </div>
</template>
