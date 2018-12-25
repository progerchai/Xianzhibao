Page({
  data: {
    navbar: ['已完成', '待付款', '待发货','待收货','退款中'],
    text:'您暂无相关订单',
    currentTab:0,
    userName:null,
    infoimage:null,
  allOrder:null,
  yiwancheng:null,//已完成status=5
  daifukuan:null,//待付款status=4
  daifahuo: null,//待发货status=1
  daishouhuo:null,//待收货status=2
  tuikuanzhong:null,//退款中status=3

    yiwancheng_mes: [],
    daifukuan_mes: null,
    daifahuo_mes: null,
    daishouhuo_mes: null,
    tuikuanzhong_mes: null,
  },
  onLoad:function(option){
    var that = this;
    // console.log("11111111111111111111111111111111");
    this.setData({
      currentTab: option.currentTab,
      infoimage: getApp().globalData.userInfo.avatarUrl,
      userName: getApp().globalData.userInfo.nickName,
    })
    //用户订单的检索
    wx.request({
      url: 'http://139.199.0.182/BookStoreProject/public/store.php/showOrder',
      data: { openid:getApp().globalData.openid },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        that.setData({
          allOrder: res.data
        });
        console.log(res.data);
      var yiwancheng= [];
      var daifukuan= [];
      var daifahuo= [];
      var daishouhuo= [];
      var tuikuanzhong= [];
        var yiwancheng_mes = [];
        var daifukuan_mes = [];
        var daifahuo_mes = [];
        var daishouhuo_mes = [];
        var tuikuanzhong_mes = [];
        for (var i = 0;i<res.data.length;i++)
        {
          
          // console.log("这里是数据");
          // console.log(res.data[i]);
          if (res.data[i].status == 1)
          {
            daifahuo.push(res.data[i]);
            wx.request({
              url: 'http://139.199.0.182/BookStoreProject/public/store.php/getInformation',
              data: { isUser: 0, bookid: res.data[i].bookid },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: { "content-type": "application/json" }, // 设置请求的 header
              success: function (resoult) {
                daifahuo_mes.push(resoult.data[0]);
                that.setData({
                  daifahuo_mes: daifahuo_mes,
                });
              }
            });
          }
          else if (res.data[i].status == 2)
            {
            daishouhuo.push(res.data[i]);
            wx.request({
              url: 'http://139.199.0.182/BookStoreProject/public/store.php/getInformation',
              data: { isUser: 0, bookid: res.data[i].bookid },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: { "content-type": "application/json" }, // 设置请求的 header
              success: function (resoult) {
                daishouhuo_mes.push(resoult.data[0]);
                that.setData({
                  daishouhuo_mes: daishouhuo_mes,
                });
              }
            });
            }
          else if (res.data[i].status == 3)
            {
            tuikuanzhong.push(res.data[i]);
            wx.request({
              url: 'http://139.199.0.182/BookStoreProject/public/store.php/getInformation',
              data: { isUser: 0, bookid: res.data[i].bookid },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: { "content-type": "application/json" }, // 设置请求的 header
              success: function (resoult) {
                tuikuanzhong_mes.push(resoult.data[0]);
                that.setData({
                  tuikuanzhong_mes: tuikuanzhong_mes,
                });
              }
            });
            }
          else if (res.data[i].status == 4)
            {
            daifukuan.push(res.data[i]);
            wx.request({
              url: 'http://139.199.0.182/BookStoreProject/public/store.php/getInformation',
              data: { isUser: 0, bookid: res.data[i].bookid },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: { "content-type": "application/json" }, // 设置请求的 header
              success: function (resoult) {
                daifukuan_mes.push(resoult.data[0]);
                that.setData({
                  daifukuan_mes: daifukuan_mes,
                });
              }
            });
            }
          else if (res.data[i].status == 5)
            {
            // console.log(res.data[i]);
            // console.log(this.data.mes);
            yiwancheng.push(res.data[i]);
            wx.request({
              url: 'http://139.199.0.182/BookStoreProject/public/store.php/getInformation',
              data: { isUser: 0, bookid: res.data[i].bookid },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: { "content-type": "application/json" }, // 设置请求的 header
              success: function (resoult) {
                yiwancheng_mes.push(resoult.data[0]);
                that.setData({
                  yiwancheng_mes: yiwancheng_mes,
                });
              }
            });
            }
        }
      that.setData({
        yiwancheng: yiwancheng,
        daifukuan: daifukuan,
        daifahuo: daifahuo,
        daishouhuo: daishouhuo,
        tuikuanzhong: tuikuanzhong,
        yiwancheng_mes: yiwancheng_mes,
        daifukuan_mes: daifukuan_mes,
        daifahuo_mes: daifahuo_mes,
        daishouhuo_mes: daishouhuo_mes,
        tuikuanzhong_mes: tuikuanzhong_mes,
      });
      
      }
    });
  },
  toOrderDetail: function (e) {
    var index=e.currentTarget.dataset.index; 
    var status = e.currentTarget.dataset.status; 
    var itemdata =null;
    console.log(this.data.yiwancheng);
    if (status==5)
      {
      itemdata = this.data.yiwancheng[index];
      }
    else if (status == 4) {
      itemdata = this.data.daifukuan[index];
    }
    else if (status == 1) {
      itemdata = this.data.daifahuo[index];
    }
    else if (status == 2) {
      itemdata = this.data.daishouhuo[index];
    }
    else if (status == 3) {
      itemdata = this.data.tuikuanzhong[index];
    }
    console.log(itemdata);
    itemdata = JSON.stringify(itemdata);
    wx.navigateTo({
      url: '../order_detail/order_details?index=' + index + "&itemdata=" + itemdata,
    })
  },
  // 头部导航栏滑动
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  gotoshop:function(){
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
  }

});