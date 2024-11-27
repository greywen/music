/**
 * QQ音乐排行榜
 * 3 巅峰榜·欧美
 * 4 巅峰榜·流行指数
 * 5 巅峰榜·内地
 * 16 巅峰榜·韩国
 * 17 巅峰榜·日本
 * 26 巅峰榜·热歌
 * 27 巅峰榜·新歌
 * 28 巅峰榜·网络歌曲
 * 29 巅峰榜·影视金曲
 * 36 巅峰榜·K歌金曲
 * 52 巅峰榜·腾讯音乐人原创榜
 * 57 电音榜
 * 58 说唱榜
 * 60 抖音热歌榜
 * 61 台湾地区榜
 * 62 飙升榜
 * 63 DJ舞曲榜
 * 64 综艺新歌榜
 * 65 国风热歌榜
 * 67 听歌识曲榜
 * 72 动漫音乐榜
 * 73 游戏音乐榜
 * 75 有声榜
 * 78 国乐榜
 * 201 巅峰榜·MV
 */
export const TOP_IDS = [
  3, 4, 5, 16, 17, 26, 27, 28, 29, 36, 52, 57, 58, 60, 61, 62, 63, 64, 65, 67,
  72, 73, 75, 78, 201,
];

export async function getTopList() {
  interface IQQTop {
    id: number;
    songList: { singername: string; songname: string }[];
  }

  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
  const params = new URLSearchParams({
    format: 'jsonp',
    g_tk: '5381',
    uin: '0',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: '0',
    platform: 'h5',
    needNewCode: '1',
    _: `${Date.now()}`,
    jsonp: 'jsonpCallback',
  });

  const requestUrl = `${url}?${params.toString()}`;

  try {
    const response = await fetch(requestUrl);
    const jsonString = await response.text();

    const jsonData = jsonString.substring(
      jsonString.indexOf('(') + 1,
      jsonString.lastIndexOf(')')
    );
    const data = JSON.parse(jsonData);
    if (data['code'] === 0 && !data['message']) {
      return {
        code: 200,
        data: data['data']['topList'] as IQQTop[],
      };
    }
  } catch (error) {
    console.error('获取QQ音乐排行榜失败: ', error);
  }
  return {
    code: 400,
    message: '获取排行榜数据失败',
    data: [],
  };
}
