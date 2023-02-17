import express from "express";
import { Server } from "socket.io";
import morgan from 'morgan';
import http from 'http';
import socket from '#core/socket';

const start = () => {
  const app     = express()
  const port    = 3000
  const server  = http.createServer(app);
  const io      = new Server(server, {
    cors: { origin: 'http://localhost:8080' }
  });
  socket.use(io);

  app.use(morgan('tiny'))
  
  server.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
}

start();