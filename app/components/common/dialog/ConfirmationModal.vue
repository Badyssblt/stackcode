<template>
    <div @click="openModal">
      <slot name="button" />
    </div>

    <Teleport to="body">
      <dialog ref="modal" class="modal">
        <div class="modal-box" @click.stop>
          <h3 class="text-lg font-bold">{{ title }}</h3>
          <p class="py-4">{{ confirmationText }}</p>

          <div class="modal-action flex gap-2">
            <button class="btn btn-primary" @click="confirm">
              {{ confirmText ?? "Confirmer" }}
            </button>

            <button class="btn" @click="closeModal">
              {{ cancelText ?? "Fermer" }}
            </button>
          </div>
        </div>

        <!-- ⬇️ CLICK OUTSIDE PROPRE -->
        <form method="dialog" class="modal-backdrop" @click="closeModal"></form>
      </dialog>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    title: string
    confirmationText: string
    confirmText?: string
    cancelText?: string
  }>()
  
  const emit = defineEmits<{ confirm: [] }>()
  
  const modal = ref<HTMLDialogElement | null>(null)

  const openModal = () => modal.value?.showModal()
  const closeModal = () => modal.value?.close()

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === modal.value) {
      closeModal()
    }
  }

  const confirm = () => {
    emit("confirm")
    closeModal()
  }
  </script>
  