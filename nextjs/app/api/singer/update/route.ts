import prisma from '@/prisma/prisma';
import QQMusicService from '@/service/qqmusicService';

async function processSongCount(ids: string[]) {
  const promises = ids.map(async (id) => {
    const result = await QQMusicService.singerSong({ num: 1, singermid: id });
    console.log(id, result?.total);
    return {
      mid: id,
      songCount: result?.total,
    };
  });

  const singers = await Promise.all(promises);
  return singers;
}

export async function POST() {
  const singers = await prisma.singer.findMany({
    select: { mid: true },
  });

  const num = 100;
  let count = Math.ceil(singers.length % num);

  while (count > 0) {
    count -= 1;
    let singer = singers.splice(0, num);
    await update(singer.map((x) => x.mid));
  }

  return new Response('Done');
}
async function update(ids: string[]) {
  const singer = await processSongCount(ids.map((x) => x));
  const updatePromises = singer.map((s) => {
    return prisma.singer.update({
      where: { mid: s.mid },
      data: s,
    });
  });
  await Promise.all(updatePromises);
}
