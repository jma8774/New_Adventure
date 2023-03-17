<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { getRooms } from '@/api/rooms';
import { userDispatch } from '@/core/store';

let refresher = null;
const rooms = ref([]);
const route = useRoute();
const router = useRouter();

onMounted(async () =>{ 
  console.log("Home mounted")
  
  rooms.value = (await getRooms()) || [];
  refresher = setInterval(async () => {
    rooms.value = (await getRooms()) || [];
  }, 3000)
})

onUnmounted(async () => {
  clearInterval(refresher)
})

const handleCreateChatroom = () => {
  // TODO: join same room id and name for now
  router.push({ name: 'Chatroom', params: { id: uuidv4() }, query: { nameIfNewRoom: "Hello World " + uuidv4().substring(0, 4) }})
}

</script>

<template>
  <div class="p-3">
    <button 
      class="block bg-blue-600 px-3 py-1 rounded-lg mt-2 text-slate-100 hover:bg-blue-700" 
      @click="handleCreateChatroom"
    >
       Create Chatroom
    </button>
    <button 
      class="block bg-red-600 px-3 py-1 rounded-lg mt-2 text-slate-100 hover:bg-red-700" 
      @click="userDispatch('logout')"
    >
      Logout
    </button>
    <div class="flex flex-wrap gap-3 mt-3">
      <RouterLink
        v-for="room in rooms"
        :key="room.id"
        :to="{ name: room.type, params: { id: room.id } }"
        class="p-4 bg-slate-200 rounded-lg w-52 flex justify-center items-center hover:bg-slate-300 relative"
      >
        <div class="font-semibold mt-5">
          {{ room.name }}
        </div>
        <div class="absolute top-1 left-1 bg-blue-400 flex justify-center items-center rounded-full py-0.5 px-2">
          {{ room.usersCount }} {{ room.usersCount > 1 ? 'users' : 'user' }}
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
</style>
