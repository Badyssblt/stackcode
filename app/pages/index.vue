<script setup lang="ts">
const { data } = useAuth()
</script>

<template>
  <div v-if="data">
    Hello {{ data.user.name }}!
  </div>
  <div v-else>
    You are not logged in.
  </div>
</template>