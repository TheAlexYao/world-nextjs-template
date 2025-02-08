import { createServer } from 'http';
import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

const httpServer = createServer();
const io = new Server(httpServer, {
  path: '/api/socket',
  addTrailingSlash: false,
  cors: {
    origin: process.env.NEXTAUTH_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('message', (message) => {
    io.emit('message', {
      id: socket.id,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3001);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Socket server is running' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
