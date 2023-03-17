<script setup>
import { ref, onMounted } from 'vue';

onMounted(async () =>{ 
  console.log("NotFound mounted")
  document.title = "Not Found"
})
</script>

<template>
  <div>
    Not Found
  </div>
</template>

<style scoped>
</style>
