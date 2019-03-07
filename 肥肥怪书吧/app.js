//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/getOpenid',
          data: {code:res.code},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: { "content-type": "application/json" }, // 设置请求的 header
          success: function (res) {
            var openid=JSON.parse(res.data).openid;
            getApp().globalData.openid=openid;
            //判断是否第一次注册
            wx.request({
              url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/getInformation',
              data: { isUser: 1, openid: openid },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: { "content-type": "application/json" }, // 设置请求的 header
              success: function (res) {
                getApp().globalData.usermes=res.data[0];
                // console.log(res.data[0]);
                if(res.data.length==1) {
                  console.log("账户已注册");
                }
                else{
                  //进行注册操作
                  wx.request({
                    url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/register',
                    data: { openid: openid, nickname: getApp().globalData.userInfo.nickName, headportrait_url:getApp().globalData.userInfo.avatarUrl},
                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: { "content-type": "application/json" }, // 设置请求的 header
                    success: function (res) {
                      console.log("注册时的nickname为：" + getApp().globalData.userInfo.nickName);
                      console.log("账号注册成功！");
                    }
                  });
                }
              }
            });
              //判断是否第一次注册结束

          }
        });
      }
    }),

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
               
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid:null,
    usermes:null,
  }
})