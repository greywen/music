import { createServer } from 'http';
import next from 'next';
import express from 'express';
import cron from 'node-cron';

const port = parseInt(process.env.PORT || '3000', 10);
const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const task = cron.schedule('* * * * * *', async () => {
    console.log('job running');
  });
  task.start();
  const server = express();
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  createServer(server).listen(port);
  console.log(
    `> Server listening at http://localhost:${port} as ${
      isDev ? 'development' : process.env.NODE_ENV
    }`
  );
});
