import prisma from '@/prisma/prisma';
import QQMusicService from '@/service/qqmusicService';
import { convertOnlineImageToBase64 } from '@/utils/convertImageToBase64';

async function processSingers(
  list: { picture: string; name: string; mid: string }[]
) {
  const promises = list.map(async (s) => {
    const picture = await convertOnlineImageToBase64(
      s.picture.replace('http://', 'https://')
    );
    return {
      ...s,
      picture,
    };
  });

  const singers = await Promise.all(promises);
  return singers;
}

export async function POST() {
  const singerList = await QQMusicService.singerList({
    area: -100,
    genre: -100,
    index: -100,
    sex: -100,
    pageNo: 1,
  });

  if (!singerList) {
    return Response.json({
      message: '获取歌手列表失败',
    });
  }

  const singerCount = await prisma.singer.count();
  if (singerList.total > singerCount) {
    let eachCount = Math.ceil(singerList.total / 80);
    let pageNo = 0;
    let singers = [];
    while (eachCount != 0) {
      eachCount -= 1;
      pageNo += 1;
      const qqSingers = await QQMusicService.singerList({
        area: -100,
        genre: -100,
        index: -100,
        sex: -100,
        pageNo,
      });
      if (!qqSingers) {
        break;
      }
      const qqSingersList = qqSingers.list.map((x) => {
        return {
          name: x.singer_name,
          mid: x.singer_mid,
          picture: x.singer_pic,
        };
      });
      const existSingers = await prisma.singer.findMany({
        where: { name: { in: qqSingersList.map((s) => s.name) } },
      });
      singers = qqSingersList.filter(
        (s) => !existSingers.find((es) => es.name === s.name)
      );

      singers = await processSingers(singers);

      await prisma.singer.createMany({
        data: singers,
        skipDuplicates: true,
      });
      singers = [];
    }
    return new Response('Done');
  }
}
