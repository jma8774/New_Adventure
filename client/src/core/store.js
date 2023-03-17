// Could probably use Pinia for this but it's fine for now
import { reactive, readonly } from 'vue';
import cookies from '@/core/cookies';
import router from '@/router';
import { v4 as uuidv4 } from 'uuid';
import * as socket from './socket';


const user = reactive({
  name: cookies.getName(),
  id: cookies.getId(),
  token: cookies.getToken()
})

const userDispatch = (action, payload) => {
  const actions = {
    setName: (name) => {
      user.name = name;
      cookies.setName(name)
    },
    setId: (id) => {
      user.id = id
      cookies.setId(id)
    },
    setToken: (token) => {
      user.token = token
      cookies.setToken(token)
    },
    logout: () => {
      user.name = undefined;
      user.id = undefined;
      user.token = undefined;
      cookies.setName(undefined);
      cookies.setId(undefined);
      cookies.setToken(undefined);
      socket.disconnect();
      console.log(router.currentRoute.value.fullPath)
      router.push({ 
        name: 'Login', 
        params: { id: uuidv4() },
        query: { redirect: router.currentRoute.value.fullPath }
      })
    },
    login: (userData) => {
      user.name = userData.name;
      user.id = userData.id;
      user.token = userData.token;
      cookies.setName(userData.name);
      cookies.setId(userData.id);
      cookies.setToken(userData.token);
    }
  }

  return actions[action](payload);
}

const room = reactive({
  isInARoom: false,
  name: undefined,
  id: undefined,
})

const roomDispatch = (action, payload) => {
  const actions = {
    join: (roomData) => {
      room.isInARoom = true;
      room.name = roomData.name;
      room.id = roomData.id;
    },
    leave: () => {
      room.isInARoom = false;
      room.name = undefined;
      room.id = undefined;
    }
  }

  actions[action](payload);
}

const readonlyUser = readonly(user);
const readonlyRoom = readonly(room);
export { 
  readonlyUser as user,
  readonlyRoom as room,
  userDispatch,
  roomDispatch,
}