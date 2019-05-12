//获取应用实例
var app = getApp();
Page({
  data: {
    judgecontent:true,
    goods:[],
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/Index/selfSellShow',
      data: { openid: app.globalData.openid },
      method: 'GET',
      header: { "content-type": "application/json" },
      success: function (res) {
        var goods = res.data.reverse(); 
        that.setData({
          goods: goods,
          judgecontent: true,
        });
        if (res.data.length == 0)
          that.setData({
            judgecontent: false,
          });
      }
    });
  },
  onLoad: function () {
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
  },
  goto:function(e){
    var bookid = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '../details/details?bookid='+bookid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
});
