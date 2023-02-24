<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () =>{ 
  console.log("Home mounted")
})

const handleJoinChatroom = () => {
  router.push({ name: 'Chatroom' })
}

</script>

<template>
  <div>
    <button 
      class="block bg-blue-600 px-3 py-1 rounded-lg mt-2 text-slate-100 hover:bg-blue-700" 
      @click="handleJoinChatroom"
    >
       Join Chatroom
    </button>
  </div>
</template>

<style scoped>
</style>
