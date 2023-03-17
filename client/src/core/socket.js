import { SERVER } from '@/util/constants'
import { io } from "socket.io-client";
import { user, userDispatch } from '@/core/store'
import { v4 as uuidv4 } from 'uuid'
import route from '@/router'

let socket;

const NO_ID         = 'No id'  
const NO_TOKEN      = 'No token'
const INVALID_ID    = 'Invalid id'
const INVALID_TOKEN = 'Invalid token'

const connect = async () => {
  if(socket) return new Promise(resolve => resolve(socket));

  if(user.name === undefined) {
    userDispatch('setName', `Anonymous-${uuidv4().slice(0, 4)}`);
  }

  socket = io(SERVER, {
    reconnection: true,
    query: {
      name: user.name,
      id: user.id,
    },
    auth: {
      token: user.token,
      id: user.id
    }
  });

  window.addEventListener('beforeunload', () => socket.disconnect())

  socket.on('connect', () => {
    console.log('Connected', socket.io.opts.query)
  })

  socket.on('disconnect', () => {
    socket = undefined;
    console.log('Disconnected')
  })

  socket.on("connect_error", (err) => {
    if (err.message === NO_ID) {
      console.log('No id')
    } else if (err.message === NO_TOKEN) {
      console.log('No token')
    } else if (err.message === INVALID_ID) {
      console.log('Invalid id')
    } else if (err.message === INVALID_TOKEN) {
      console.log('Invalid token')
    }
    userDispatch('logout')
  });

  socket.connect();
  return new Promise(resolve => resolve(socket));
}

const disconnect = () => {
  socket?.disconnect();
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
  disconnect,
  join,
  leave,
}