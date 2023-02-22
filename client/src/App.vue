<script setup>
import { ref, onMounted } from 'vue';
import { 
  name,
  room,
  socket,
  connect,
  join,
  leave
} from '@/core/socket';

const users = ref([])
const msg = ref('')
const msgs = ref([])

onMounted(async () =>{ 
  initialize();
})

const initialize = () => {
  connect();
  // TODO: this should be logic for different rooms, for now it's just default chatroom
  socket.on('messages', (data) => {
    console.log('msgs', data)
    msgs.value = data
  })
  
  socket.on('users', (data) => {
    console.log('users', data)
    users.value = data
  })
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

// Need to think of a better model for socket.on events
const cleanup = () => {
  msgs.value = []
  users.value = []
}
const test = () => {
  socket.on('messages', (data) => {
    console.log('msgs', data)
    msgs.value = data
  })
  socket.on('users', (data) => {
    console.log('users', data)
    users.value = data
  })
}


const classes = {
  isMe: "bg-green-200 px-2 py-1 rounded-lg w-fit",
  isNotMe: "bg-slate-200 px-2 py-1 rounded",
}
</script>

<template>
  <div class="ml-2">
    <div>Connected users: {{ users }}</div>
    <input 
      type="text"
      :value="msg" 
      @change="sendMsg"
      class="border mt-2 px-2 py-1"
      placeholder="Type a message..."
    />
    <button 
      class="block bg-blue-600 px-3 py-1 rounded-lg mt-2 text-slate-100 hover:bg-blue-700" 
      @click="() => {
        if(room) {
          leave()
          cleanup()
        } else {
          join()
          test()
        }
      }"
    >
      {{ room ? 'Leave' : 'Join' }}
    </button>
    <div class="flex flex-col gap-2 mt-4">
      <div
        v-for="msgData in msgs"
        :key="msgData.id"
        class="grid grid-cols-12"
      >
        <div class="col-span-2 mt-1 flex flex-col">
          {{ new Date(msgData.timestamp).toLocaleTimeString() }} 
          <span :class="classes.isMe">{{  msgData.name }}</span>
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
