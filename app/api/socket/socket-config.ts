import { Server } from 'socket.io';

export const socketConfig = {
  path: '/api/socket',
  addTrailingSlash: false,
  transports: ['polling', 'websocket'],
  cors: {
    origin: process.env.NEXTAUTH_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
};
