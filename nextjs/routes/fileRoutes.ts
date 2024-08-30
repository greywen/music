import { Router } from 'express';
import path from 'path';
import * as fs from 'fs';
import prisma from '../prisma/prisma';
import download from '../utils/downloadMusic';
import { getMusicList } from '../service/music';

const router = Router();

router.use('/music', async (req, res) => {
  const mid = req.query['mid'] as string;
  const name = req.query['name'] as string;
  if (!mid) {
    res.status(404).end('Music not found');
  }

  let music = await prisma.music.findUnique({ where: { mid } });
  if (!music && name) {
    const musics = await getMusicList({ name });
    const music = musics.find((x) => x.id === mid);
    if (!music) {
      res.status(404).end('Music not found');
      return;
    }
    await download([music]);
  } else {
    res.status(404).end('Music not found');
  }

  const savePath = process.env.MUSIC_SAVE_PATH!;
  const filePath = path.resolve(savePath, music!.url!);

  if (await fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).end('File not found');
  }
});

router.use('/cover', async (req, res) => {
  const id = +(req.query['id'] || 0);
  if (!id) {
    res.status(404).end('Cover not found');
  }

  const savePath = process.env.COVER_SAVE_PATH!;
  const cover = await prisma.cover.findUnique({ where: { id } });
  const filePath = path.resolve(savePath, cover?.url!);

  if (await fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(filePath);
  } else {
    res.status(404).end('File not found');
  }
});

export default router;
