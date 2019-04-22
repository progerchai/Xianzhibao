Page({
  data: {
    //addressList用来计数地址数量
    addressList: [],
addresslist:[],
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      addressList: null,
    });
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/getInformation',
      data: { isUser: 1, openid:getApp().globalData.openid },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
       console.log(res.data[0]);
        var dateList = res.data[0].address.split("-");
        var arr = []
        for (var i in dateList) {
          arr = arr.concat(dateList[i]);
        }
        var list =[];
        for(var i = 0; i<arr.length/6;i++)
        {
          list.push(i);
        }
        console.log(list);
        that.setData({
          addresslist:arr,
          addressList:list,
        });
      }
    });

  },
  add_btn:function(){
    wx.redirectTo({
      url: '../add_address/add_address',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})