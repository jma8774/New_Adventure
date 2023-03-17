<script setup>
import { ref, onMounted } from 'vue';
import { connect } from '@/core/socket';
import { user, userDispatch } from '@/core/store';

const isLoading = ref(true);

onMounted(async () =>{
  console.log("App mounted")
  if(user.id)
    await connect();
  else
    userDispatch('logout')
    
  isLoading.value = false;
})

</script>

<template>
  <div v-if="isLoading">
    Loading...
  </div>
  <RouterView v-else />
</template>

<style scoped>
</style>
