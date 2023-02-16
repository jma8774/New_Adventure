import { Socket } from "socket.io";

const socketWrapper = (s: Socket) => {
  const socket = s;

  const getQuery = () => {
    return socket.handshake.query;
  }

  return {
    socket,
    getQuery
  }
}

export default socketWrapper;