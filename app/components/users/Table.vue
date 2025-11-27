<template>
<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <button class="btn btn-primary" @click="addUserModal?.showModal()">Ajouter un utilisateur</button>
  <dialog id="add_user_modal" class="modal" ref="addUserModal">
    <div class="modal-box">
      <h3 class="font-bold">Ajouter un utilisateur</h3>
      <label for="" class="input input-sm">
        Email
        <input type="email" placeholder="johndoe@email.com" class="text-sm" v-model="email" @blur.prevent="handleSearchUser"/>
      </label>
      <div class="flex flex-col mt-2 border border-base-content/10 rounded-md max-h-48 overflow-y-auto">
          <div v-for="user in users" class="p-2 text-sm border-b border-base-content/10 flex items-center justify-between">
            <p>{{ user.email }}</p>
            <button class="btn btn-primary btn-xs" @click="handleInviteUser(user.email)" v-if="!isUserInProject(user.email)">Envoyer une invitation</button>
            <button class="btn btn-primary btn-xs"  v-else>Invitation déjà envoyé</button>
          </div>
        </div>
      <div class="modal-action">
        <form method="dialog">
          
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
  <CommonTableBaseTable v-if="data" :columns="columns" :data="data">
      <template #actions>
        <button>Modifier</button>
      </template>
  </CommonTableBaseTable>
</div>
</template> 

<script setup lang="ts">
const { project, findUserByEmail, inviteUserOnProject } = useProjects()
const addUserModal = ref(null)

const users = ref()
const email = ref<string>()

const handleSearchUser = async () => {
  users.value = []
  users.value = await findUserByEmail(email.value!)
}

const handleInviteUser = async (email: string) => {
  if(!project.value) return
  await inviteUserOnProject(email)
} 

const isUserInProject = (email: string) => {  
  return project.value?.invitations.find(invitation => invitation.email === email)
}

const columns = [
  { header: 'Nom', accessorKey: 'name' },
  { header: 'Email', accessorKey: 'email' },
  { header: 'Rôle', accessorKey: 'role' },
]

const data = computed(() => {
  return project.value?.users?.map(user => {
    return {
      name: user.user?.firstname + " " + user.user?.lastname,
      email: user.user?.email,
      role: user.role,
    }
  }) || []
})
</script>