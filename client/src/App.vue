<script setup>
import axios from 'axios'
import { onMounted } from 'vue';
import { API_URL } from '@/util/constants'

onMounted(async () =>{ 
  const a = await axios.get(`${API_URL}`)
  console.log(a)
})
</script>

<template>
  <div class="bg-red-400">
    hello world
  </div>
</template>

<style scoped>
</style>
