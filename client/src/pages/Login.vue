<script setup>
import { onMounted } from 'vue';
import { connect } from '@/core/socket';
import { useRoute, useRouter } from 'vue-router';
import { user, userDispatch } from '@/core/store';
import { v4 as uuidv4 } from 'uuid';
import { postAccess } from '@/api/auth';

const route = useRoute();
const router = useRouter();

onMounted(async () =>{ 
  // TODO: make ui look better for login
  console.log("Login Mounted")

  if(!user.id) {
    let id;
    let token;
    while (!token) {
      id = uuidv4();
      token = (await postAccess(id))?.token;
    }
    userDispatch('login', { 
      name: prompt("What's your name?"),
      id, 
      token
    })
    connect();
  }

  if(route.query.redirect) {
    console.log("Login done. Session created. Redirecting back...")
    return router.push(route.query.redirect)
  }

  console.log("Login done. Session created. Redirecting home...")
  return router.push({ name: 'Home' })
})
</script>

<template>
  <div>
    Logging in...
  </div>
</template>

<style scoped>
</style>
