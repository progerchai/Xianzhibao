//获取应用实例
var app = getApp();
Page({
  data: {
    judgecontent:false,
  },
  onLoad: function () {
      // 刚进入页面或返回时对数据进行刷新
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function (){
  },
  tonewsell: function () {
    wx.navigateTo({
      url: '../mysell/mysell',
      success: function (res){},
      fail: function (res){},
      complete: function (res){},
    })
  }
});
