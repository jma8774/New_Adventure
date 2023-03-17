<script setup>
import { ref, onMounted } from 'vue';
import { userDispatch } from '@/core/store';

onMounted(async () =>{ 
  console.log("Disconnected mounted")
  document.title = "Disconnected"
})
</script>

<template>
  <div>Disconnected</div>
</template>

<style scoped>
</style>
