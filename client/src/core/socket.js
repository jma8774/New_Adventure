import { SERVER } from '@/util/constants'
import { io } from "socket.io-client";
import { user, userDispatch } from '@/core/store'
import { v4 as uuidv4 } from 'uuid'

let socket;

const connect = () => {
  if(user.name === undefined) {
    // Ask for name (TODO: make a modal for this)
    userDispatch('setName', prompt('What is your name?') || "Anonymous");
  }

  socket = io(SERVER, {
    autoConnect: true,
    reconnection: true,
    query: {
      name: user.name,
      id: user.id,
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

const join = (roomData) => {
  // Hard coded for now
  roomData = {
    id: uuidv4(),
    name: 'default',
  }
  socket.emit('join', roomData)
}

const leave = () => {
  socket.emit('leave')
}

export {
  socket,
  connect,
  join,
  leave,
}