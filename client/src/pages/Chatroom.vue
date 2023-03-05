<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { socket } from '@/core/socket';
import { useRouter, useRoute } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { user, room, roomDispatch } from '@/core/store';

const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const isKicked = ref(false);

const msg = ref('')
const msgs = ref([])
const users = ref([])

onMounted(async () =>{ 
  console.log("Chatroom mounted")

  registerRoomListeners();

  socket.on('join', (data) => {
    if(data.error) {
      console.log("Error joining the room", data.error)
      router.replace({ name: 'Home' })
      return
    }

    roomDispatch('join', data)
    isLoading.value = false;
    console.log("Joined the room", data)
    document.title = data.name
  })

  socket.on('leave', () => {
    console.log("Kicked from the room")
    isKicked.value = true;
    router.replace({ name: 'Home' })
    destroyRoomListeners();
  })

  // TODO: stop hard code room data
  const roomData = {
    id: route.params.id,
    name: route.query.nameIfNewRoom || "Hello World"
  }
  socket.emit('join', roomData)
})

onUnmounted(() => {
  // User left voluntarily, not kicked
  if(!isKicked.value)
    socket.emit('leave')
    
  roomDispatch('leave')
  destroyRoomListeners();
  console.log("Chatroom unmounted")
})

const registerRoomListeners = () => {
  socket.on('messages', (data) => {
    console.log('msgs', data)
    msgs.value = data
  })
    
  socket.on('users', (data) => {
    console.log('users', data)
    users.value = data
  })
}

const destroyRoomListeners = () => {
  socket.off('messages')
  socket.off('users')
}

const sendMsg = (e) => {
  const msgPayload = {
    name: socket.io.opts.query.name,
    msg: e.target.value,
  }
  console.log("message", msgPayload)
  socket.emit('message', msgPayload)
  msg.value = ''
}

const classes = {
  isMe: "bg-green-200 px-2 py-1 rounded-lg w-fit",
  isNotMe: "bg-slate-200 px-2 py-1 rounded w-fit",
}
</script>

<template>
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else class="ml-2">
    <div>Connected users: {{ users }}</div>
    <button 
      class="block bg-blue-600 px-3 py-1 rounded-lg mt-2 text-slate-100 hover:bg-blue-700" 
      @click="router.push({ name: 'Home' })"
    >
      Leave
    </button>
    <input 
      type="text"
      :value="msg" 
      @change="sendMsg"
      class="border mt-2 px-2 py-1"
      placeholder="Type a message..."
    />
    <div class="flex flex-col gap-2 mt-4">
      <div
        v-for="msgData in msgs"
        :key="msgData.id"
        class="grid grid-cols-12 gap-3"
      >
        <div class="col-span-2 mt-1 flex flex-col">
          {{ new Date(msgData.timestamp).toLocaleTimeString() }} 
          <span :class="user.id === msgData.userId ? classes.isMe : classes.isNotMe">{{  msgData.name }}</span>
        </div>
        <div class="col-span-9 bg-slate-200 px-2 py-1 rounded w-full">
          {{  msgData.msg }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
