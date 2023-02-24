// Could probably use Pinia for this but it's fine for now
import getAndCreateTempId from '@/util/getAndCreateTempId';
import { reactive, readonly } from 'vue';


const user = reactive({
  name: undefined,
  id: getAndCreateTempId(),
})

const userDispatch = (action, payload) => {
  const actions = {
    setName: (name) => {
      user.name = name;
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