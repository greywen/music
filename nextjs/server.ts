import { createServer } from 'http';
import next from 'next';
import path from 'path';
import * as fs from 'fs';
import prisma from './prisma/prisma';
import express from 'express';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use('/files/music', async (req, res) => {
    const id = +(req.query['id'] || 0);
    if (!id) res.status(404).end('File not found');
    const musicSavePath = process.env.MUSIC_SAVE_PATH!;
    const music = await prisma.music.findUnique({ where: { id } });
    const filePath = path.resolve(musicSavePath, music?.url!);

    if (await fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });
  server.get('*', (req, res) => {
    return handle(req, res);
  });
  createServer(server).listen(port);
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});
