//获取应用实例
var app = getApp();
Page({
  data: {
    judgecontent:true,
    goods:[],
  },
  onLoad: function () {
      var that = this;
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/Index/selfSellShow',
      data: { openid: app.globalData.openid },
      method: 'GET', 
      header: { "content-type": "application/json" },
      success: function (res) {
        that.setData({
          goods:res.data,
          judgecontent:true,
        });
        if(res.data.length==0)
        that.setData({
          judgecontent: false,
        });
      }
    });
    
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
