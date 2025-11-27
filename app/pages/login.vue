<script setup lang="ts">
// Remember to disable the middleware protection from your page!
 

const { signIn } = useAuth()

/*
 * NOTE: Here we hard-coded username and password
 * On your own page this should probably be connected to two inputs
 */
const demoCredentials = { username: 'test', password: 'hunter2' }
</script>

<template>
  <div>
    <p class="font-bold">Sign-In Options:</p>
    <button @click="signIn('github')">
      Github
    </button>
    <button @click="signIn('credentials', demoCredentials)">
      Username and Password
    </button>
  </div>
</template>