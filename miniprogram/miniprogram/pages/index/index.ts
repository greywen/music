// index.ts
const bgAudioManager = wx.getBackgroundAudioManager();
Component({
  data: {

  },
  methods: {
    onShow: () => { },
    onSearch: () => {  wx.navigateTo({ url: '../search/search' }) },
    onStart: () => {
      bgAudioManager.title = "夜曲";
      bgAudioManager.src = "https://ws.stream.qqmusic.qq.com/M800002202B43Cq4V4.mp3?guid=246108826&vkey=CD550A060AE4D1F70A64F8C130E9B42A8D35490371FA23BD164FAA8123FEACF36E6414777155D8414C65798F98DFA1F27593BFEBCC7719F2&uin=1556418073&fromtag=120093";
    },
    onPause: () => {
      bgAudioManager.pause();
    }
  },
})
