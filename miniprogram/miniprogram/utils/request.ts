export function request<T>(options: WechatMiniprogram.RequestOption): Promise<T> {
  return new Promise((resovle, reject) => {
    wx.request({
      ...options,
      success: (res) => { resovle(res.data as T) },
      fail: reject
    })
  })
}