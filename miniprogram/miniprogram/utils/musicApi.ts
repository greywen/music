import { request } from "./request";

function getMusic(musicString: string): IMusicResult {
  const regex = /jQuery\((\{.*\})\)/;
  const match = musicString.match(regex);
  if (match && match[1]) {
    try {
      const jsonObject = JSON.parse(match[1]);
      return jsonObject as IMusicResult;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  } else {
    console.error('No match found');
  }
  return {} as IMusicResult;;
}

async function getMusicPlayUrl(id: string) {
  try {
    const data = await request<string>({ url: `https://music-api-cn.gdstudio.xyz:22443/api.php?callback=jQuery&types=url&id=${id}&source=tencent` });
    return getMusic(data);
  } catch {
    console.error('获取音乐失败');
  }
  return {} as IMusicResult;
}

interface IGetCoverImgUrlResult {
  url: string
}
async function getCoverImgUrl(picId: string) {
  try {
    const data = await request<IGetCoverImgUrlResult>({ url: `https://music-api.gdstudio.xyz/api.php?types=pic&source=tencent&id=${picId}&size=300` });
    return data.url;
  } catch {
    console.error('获取封面失败');
  }
  return "";
}

export { getMusicPlayUrl, getCoverImgUrl }