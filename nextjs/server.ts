import { createServer } from 'http';
import next from 'next';
import express from 'express';
import { fileRoutes } from './routes';
import cron from 'node-cron';
import { downloadJob } from './jobs';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const task = cron.schedule('* * * * *', () => {
    console.log('download job start', new Date());
    downloadJob();
  });
  task.start();
  const server = express();
  server.use('/files', fileRoutes);
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  createServer(server).listen(port);
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});
