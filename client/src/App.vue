<script setup>
import { ref, onMounted } from 'vue';
import { API_URL, SERVER } from '@/util/constants'
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie'

let socket;
const users = ref([])
const msg = ref('')
const msgs = ref([])

onMounted(async () =>{ 
  initialize();
  window.addEventListener('beforeunload', () => socket.disconnect())
})

const initialize = () => {
  let name = prompt("Enter your name") || 'Anonymous';
  socket = io(SERVER, {
    autoConnect: false,
    reconnection: true,
    query: {
      name,
      id: getAndCreateTempId(),
    }
  });
  socket.connect()
  socket.on('connect', () => {
    console.log('Connected', socket.io.opts.query)
    socket.emit('join', 'default')
  })
  socket.on('disconnect', () => {
    console.log('Disconnected')
  })
  socket.on('messages', (data) => {
    console.log('msgs', data)
    msgs.value = data
  })
  socket.on('users', (data) => {
    console.log('users', data)
    users.value = data
  })
}

const getAndCreateTempId = () => {
  let tempId = Cookies.get('tempId')
  if (!tempId) {
    tempId = uuidv4()
    Cookies.set('tempId', tempId)
  }
  return tempId
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
