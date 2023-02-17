import Room from './room';
import Chatroom from './chatroom';

interface Rooms {
  [name: string]: Room;
}

export {
  Room,
  Rooms,
  Chatroom,
}