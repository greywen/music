import { getCoverImgUrl, getMusicPlayUrl } from "./musicApi";

const bgAudioManager = wx.getBackgroundAudioManager();
async function play(musicInfo: IMusicResult) {
  const musicResult = await getMusicPlayUrl(musicInfo.id);
  const coverImgUrl = await getCoverImgUrl(musicInfo.pic_id);
  bgAudioManager.src = musicResult.url;
  bgAudioManager.title = musicInfo.name;
  bgAudioManager.epname = musicInfo.album;
  bgAudioManager.singer = musicInfo.artist.join();
  bgAudioManager.coverImgUrl = coverImgUrl
}



export { bgAudioManager, play }