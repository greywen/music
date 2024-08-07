/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface IMusicResult {
  id: string;
  name: string;
  artist: string[];
  album: string;
  pic_id: string;
  lyric_id: string;
  source: string;
}

interface IMusicResult {
  url: string;
  size: number;
  br: number;
}