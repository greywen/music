// pages/search/search.ts
let timeoutId: ReturnType<typeof setTimeout>;
Page({
  data: {
    musicList: [] as IMusicList[],
    source: 'tencent',
    page: 1,
    pageSize: 20,
    searchValue: '',
    showMore: false
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
    this.setData({ showMore: false });
    wx.request({
      url: `https://music-api.gdstudio.xyz/api.php?types=search&source=tencent&name=${searchValue}&count=${pageSize}&pages=${page}`, success: (res) => {
        const data = res.data as IMusicList[];
        this.setData({ showMore: data.length === pageSize, musicList: data });
      }
    });
  },
  onShowMore() {
    const { musicList, searchValue, pageSize, page } = this.data;
    const pages = page + 1;
    wx.request({
      url: `https://music-api.gdstudio.xyz/api.php?types=search&source=tencent&name=${searchValue}&count=${pageSize}&pages=${pages}`, success: (res) => {
        const data = res.data as IMusicList[];
        this.setData({ showMore: data.length === pageSize, musicList: musicList.concat(data), page: pages });
      }
    });
  },
  onClear() {
    this.setData({ page: 1, searchValue: '', musicList: [] })
  },
  onShow() {

  },
  onHide() {

  },
})