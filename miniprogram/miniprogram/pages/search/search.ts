import { bgAudioManager, play } from "../../utils/bgAudioManager";
import Toast from 'tdesign-miniprogram/toast/index';
// pages/search/search.ts
Page({
  data: {
    musicList: [] as IMusicResult[],
    playList: [] as IMusicResult[],
    currentPlayIndex: 0,
    source: 'tencent',
    page: 1,
    pageSize: 20,
    searchValue: '',
    hasShowMore: false,
    loading: false,
  },
  onLoad() {

  },
  onReady() {

  },
  onChangeValue(e: { detail: { value: string } }) {
    const { value } = e.detail;
    this.setData({ searchValue: value });
  },
  onSubmit() {
    const { searchValue, pageSize, page } = this.data;
    this.setData({ hasShowMore: false, loading: true });
    wx.request({
      url: `https://music-api.gdstudio.xyz/api.php?types=search&source=tencent&name=${searchValue}&count=${pageSize}&pages=${page}`, success: (res) => {
        const data = res.data as IMusicResult[];
        this.setData({ hasShowMore: data.length === pageSize, musicList: data, loading: false });
      }
    });
  },
  onClear() {
    this.setData({ page: 1, searchValue: '', musicList: [] })
  },
  async onPlay(e) {
    const id = e.currentTarget.dataset.id;
    const musicInfo = this.data.musicList.find(x => x.id === id)!;
    await play(musicInfo);
  },
  async onPlayAll() {
    const { playList, musicList, currentPlayIndex } = this.data;
    this.setData({ playList: musicList, currentPlayIndex: 0 });
    const musicInfo = musicList[currentPlayIndex];
    await play(musicInfo);
    let playIndex = currentPlayIndex + 1;
    bgAudioManager.onNext(async () => {
      if (musicList.length > currentPlayIndex) {
        await play(musicList[playIndex]);
        this.setData({ currentPlayIndex: playIndex })
      }
    });
    bgAudioManager.onEnded(async () => {
      if (musicList.length > currentPlayIndex) {
        playIndex += 1;
        await play(musicList[playIndex]);
        this.setData({ currentPlayIndex: playIndex })
      }
    });
  },
  onReachBottom() {
    const { hasShowMore, loading, musicList, searchValue, pageSize, page } = this.data;
    if (hasShowMore && !loading) {
      this.setData({ loading: true });
      const pages = page + 1;
      wx.request({
        url: `https://music-api.gdstudio.xyz/api.php?types=search&source=tencent&name=${searchValue}&count=${pageSize}&pages=${pages}`, success: (res) => {
          const data = res.data as IMusicResult[];
          this.setData({ hasShowMore: data.length === pageSize, musicList: musicList.concat(data), page: pages, loading: false });
        }
      });
    }
  },
})