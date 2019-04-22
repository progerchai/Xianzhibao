// pages/others/mycards/mycards.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  gotoshop: function () {
    wx.switchTab({
      url: '../../../pages/index/index',
      success: function (res) {
        console.log("跳转主页成功");
      },
      fail: function (res) {
        console.log("跳转主页失败");
      },
      complete: function (res) { },
    })
  },

})