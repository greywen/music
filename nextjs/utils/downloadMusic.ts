import { SOURCE_ID } from '@/constants/common';
import prisma from '@/prisma/prisma';
import { getCover, getLyric, getMusicInfo } from '@/service/music';
import createFolder from '@/utils/createFolder';
import { downloadFile, getUrlExtension } from '@/utils/downloadFile';
import imageToBase64 from '@/utils/imageToBase64';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

interface ITx
  extends Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  > {}

interface ITransferOption {
  mid: string;
  sourceId: number;
  name: string;
  albumName: string;
  artist: string[];
  url: string;
  lyricText: string;
  coverUrl?: string;
  br: number;
  size: number;
}

interface ICreateMusic {
  mid: string;
  sourceId: number;
  name: string;
  albumId?: number;
  lyricId: number;
  url: string;
  br: number;
  size: number;
}

async function downloadMusic(music: IMusic) {
  console.time('download music');
  const { id, source, name, artist } = music;
  const musicSavePath = process.env.MUSIC_SAVE_PATH!;
  await createFolder(musicSavePath);
  const musicInfo = await getMusicInfo({ id, source, br: 320 });
  console.log('music url: \n', musicInfo.url);
  const musicPath = `${musicSavePath}/${artist.join()} - ${name}${getUrlExtension(
    musicInfo.url
  )}`;
  await downloadFile({
    url: musicInfo.url,
    filePath: musicPath,
  });
  console.timeEnd('download music');
  return { musicInfo, musicPath };
}

async function downloadCover(music: IMusic) {
  console.time('download cover');
  const { id, source, pic_id } = music;
  const coverSavePath = process.env.COVER_SAVE_PATH!;
  await createFolder(coverSavePath);
  const cover = await getCover({ id: pic_id, source, size: 500 });
  console.log('cover url: \n', cover?.url);
  if (!cover?.url) return undefined;
  const coverPath = `${coverSavePath}/${id}${getUrlExtension(cover.url)}`;
  await downloadFile({
    url: cover.url,
    filePath: coverPath,
  });
  console.timeEnd('download cover');

  console.time('convert cover');
  const coverBase64 = await imageToBase64(coverPath);
  console.timeEnd('convert cover');

  return coverBase64;
}

async function findMusicIds(ids: string[]) {
  const musics = await prisma.music.findMany({
    where: { mid: { in: ids } },
    select: { mid: true },
  });
  return musics.map((x) => x.mid);
}

async function createSinger(tx: ITx, name: string) {
  return await tx.singer.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function createCover(tx: ITx, url: string) {
  return await tx.cover.create({ data: { url } });
}

async function createAlbum(
  tx: ITx,
  singerId: number,
  name: string,
  coverId?: number
) {
  return await tx.album.upsert({
    where: { singerId_name: { singerId, name } },
    update: {},
    create: { singerId, name, coverId },
  });
}

async function createArtist(tx: ITx, musicId: number, singerId: number) {
  return await tx.musicArtist.upsert({
    where: { musicId_singerId: { musicId, singerId } },
    update: {},
    create: { singerId, musicId },
  });
}

async function createLyric(tx: ITx, text: string) {
  return await tx.lyric.create({ data: { text } });
}

async function createMusic(tx: ITx, params: ICreateMusic) {
  const { mid, sourceId, name, albumId, lyricId, url, br, size } = params;
  return await tx.music.create({
    data: {
      mid,
      sourceId,
      name,
      albumId,
      lyricId,
      url,
      br,
      size,
    },
  });
}

function transfer(option: ITransferOption) {
  return prisma.$transaction(async (tx) => {
    const {
      mid,
      sourceId,
      name,
      albumName,
      artist,
      url,
      lyricText,
      coverUrl,
      br,
      size,
    } = option;

    let cover = null;
    if (coverUrl) {
      cover = await createCover(tx, coverUrl);
    }

    let albumId = undefined;
    let singerIds = [];
    for (const item of artist) {
      const singer = await createSinger(tx, item);
      singerIds.push(singer.id);
      if (albumName) {
        const album = await createAlbum(tx, singer.id, albumName, cover?.id);
        if (!albumId) albumId = album.id;
      }
    }

    const lyric = await createLyric(tx, lyricText);
    const music = await createMusic(tx, {
      mid,
      sourceId,
      name,
      albumId: albumId,
      lyricId: lyric.id,
      url,
      br,
      size,
    });
    for (const singerId of singerIds) {
      await createArtist(tx, music.id, singerId);
    }
    return music;
  });
}

export default async function download(musicList: IMusic[]) {
  const musics = await findMusicIds(musicList.map((music) => music.id));
  musicList = musicList.filter((x) => !musics.includes(x.id));
  for (const music of musicList) {
    const { id, source, name, lyric_id, artist, album } = music;
    console.log(`${artist.join()} - ${name}`);
    const { musicInfo, musicPath } = await downloadMusic(music);
    const coverBase64 = album ? await downloadCover(music) : undefined;
    const lyric = await getLyric({ id: lyric_id, source });
    await transfer({
      mid: id,
      sourceId: SOURCE_ID[source],
      name,
      albumName: album,
      artist,
      url: musicPath,
      lyricText: lyric?.lyric,
      coverUrl: coverBase64,
      br: musicInfo.br,
      size: musicInfo.size,
    });
  }
  return musicList;
}
