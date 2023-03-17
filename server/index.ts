import express from "express";
import { Server } from "socket.io";
import morgan from 'morgan';
import http from 'http';
import socket from '#core/socket';
import sessions from '#core/sessions';
import roomRouter from '#routes/rooms';
import authRouter from '#routes/auth';
import { users } from '#core/store';

const start = () => {
  const app     = express()
  const port    = 3000
  const server  = http.createServer(app);
  const io      = new Server(server, {
    cors: { origin: 'http://localhost:8080' }
  })
  app.use(express.json())
  app.use(morgan('tiny'))

  // Auth middleware for socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const id = socket.handshake.auth.id;
    if(!id)                               return next(new Error('No id'));
    if(!token)                            return next(new Error('No token'));
    if(!sessions.has(id))                 return next(new Error('Invalid id'));
    if(sessions.get(id).token !== token)  return next(new Error('Invalid token'));
    return next();
  })
  socket.use(io);

  // Routes
  const apiRouter = express.Router()
  apiRouter.use('/rooms', roomRouter)
  apiRouter.use('/auth', authRouter)
  app.use('/api', apiRouter)

  // Jobs (every 30 minutes)
  setInterval(() => {
    console.log('[Cleanup] User tokens cleanup...')
    sessions.cleanup(users);
  }, 60000 * 30)

  server.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
}

start();