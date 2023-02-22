import { ref, readonly } from 'vue'
import { SERVER } from '@/util/constants'
import { io } from "socket.io-client";
import getAndCreateTempId from '@/util/getAndCreateTempId';

let name;
let socket;
let room = ref(undefined); // TODO: debate whether this should be reactive...

const connect = () => {
  if(name === undefined) {
    // Ask for name (TODO: make a modal for this)
    name = prompt('What is your name?')
  }

  socket = io(SERVER, {
    autoConnect: true,
    reconnection: true,
    query: {
      name,
      id: getAndCreateTempId(),
    }
  });
  window.addEventListener('beforeunload', () => socket.disconnect())

  socket.on('connect', () => {
    console.log('Connected', socket.io.opts.query)
  })

  socket.on('disconnect', () => {
    console.log('Disconnected')
  })

  return socket;
}

const join = (roomName) => {
  // TODO: Implement join room beside's default
  socket.emit('join', 'default')
  room.value = 'default'
}

const leave = () => {
  socket.emit('leave', 'default')
  room.value = undefined

  // TODO: this should be logic for different rooms, for now it's just default chatroom
  socket.off('messages')
  socket.off('users')
}

export {
  name,
  room,
  socket,
  connect,
  join,
  leave
}