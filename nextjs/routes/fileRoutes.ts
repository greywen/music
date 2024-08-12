import { Router } from 'express';
import path from 'path';
import * as fs from 'fs';
import prisma from '../prisma/prisma';

const router = Router();

router.use('/music', async (req, res) => {
  const id = +(req.query['id'] || 0);
  if (!id) {
    res.status(404).end('Music not found');
    return;
  }

  const savePath = process.env.MUSIC_SAVE_PATH!;
  const music = await prisma.music.findUnique({ where: { id } });
  const filePath = path.resolve(savePath, music?.url!);

  if (await fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

router.use('/cover', async (req, res) => {
  const id = +(req.query['id'] || 0);
  if (!id) {
    res.status(404).end('Cover not found');
    return;
  }

  const savePath = process.env.COVER_SAVE_PATH!;
  const cover = await prisma.cover.findUnique({ where: { id } });
  const filePath = path.resolve(savePath, cover?.url!);

  if (await fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

export default router;
