// pages/others/balance/balance.js
var app = getApp();
Page({
  data: {
    userInfo: {}, 
    mylist:[],
    totalmoney:null,
    acountlist:[],
    usermes:null,
    address_name:null,
    address_phone:null,
    address_province:null,
    address_city:null,
    address_area:null,
    address_detail:null,
  },
  onLoad: function (options){
    var that = this;
    var split= null;
    split = app.globalData.usermes.address.split("-");
    // console.log("%%%%%%%%%%");
    // console.log(JSON.parse(options.acount));
    // console.log("%%%%%%%%%%");
      that.setData({
        mylist: JSON.parse(options.model),
        acountlist: JSON.parse(options.acount),
        userInfo: app.globalData.userInfo,
        usermes:app.globalData.usermes,
        address_name: split[0],
        address_phone: split[1],
        address_province: split[2],
        address_city: split[3],
        address_area: split[4],
        address_detail: split[5],
      })
    //总价汇总
    var totalmoney = 0;
    for (var i = 0; i < this.data.mylist.length ; i++) {
      totalmoney = totalmoney + this.data.mylist[i].discountprice * this.data.acountlist[i];
    }

    that.setData({
      totalmoney: parseFloat(parseFloat(totalmoney).toFixed(2)),
    });
  },
  topay:function(){
    var that = this;
    var len = that.data.mylist.length;
    var mylist=that.data.mylist;
    var acountlist = that.data.acountlist;
    wx.showToast({
      title: '已结算',
      icon: 'success',
      image: '',
      duration: 2000,
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
//调用jsapi支付接口
//成功回调
    for (var i = 0; i < len ;i++)
    {
      wx.request({
        url: 'http://139.199.0.182/BookStoreProject/public/store.php/submitOrder',
        data: { bookid: mylist[i].bookid, openid: app.globalData.openid, amount: acountlist[i],note:"备注",address:that.data.usermes.address,phone_number:that.data.phone_number},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { "content-type": "application/json" }, // 设置请求的 header
        success: function (res) {
          console.log("支付结束，成功了！");
        }
      });
    }    
//失败回调
console.log("如果支付失败，修改订单为待付款");
  },
  changeaddress:function(){
    wx.navigateTo({ 
      url: '/pages/others/myaddress/myaddress',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})