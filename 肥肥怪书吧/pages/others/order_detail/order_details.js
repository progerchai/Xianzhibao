Page({
  data: {
    iscomments:true,
    comments:'',
    itemdata:null,
    itemdetail: null,
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      itemdata: JSON.parse(options.itemdata),
    });
  var itemdetail=null;
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/getInformation',
      data: { isUser: 0, bookid:this.data.itemdata.bookid },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        that.setData({
          itemdetail: res.data[0]
        });
      }
    });


    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showComment',
      data: { isUser: 0, openid: getApp().globalData.openid, bookid: this.data.itemdata.bookid },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        if(res.data.length!=0)
       {
          that.setData({
            iscomments: false,
            comments:res.data[0]
          });
       }
      }
    });
  },
  changestatus:function(){
    if (this.data.itemdata.status==2)
    {
      wx.request({
        url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/changeOrderState',
        data: { orderid: this.data.itemdata.orderid, status: this.data.itemdata.status },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { "content-type": "application/json" }, // 设置请求的 header
        success: function (res) {
          console.log("订单修改成功！！！");
              // 延迟函数
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/others/all_orders/all_orders?currentTab='+3,
                });
                wx.showToast({
                  title: '更改成功',
                  icon: 'success',
                  duration: 1500
                });
              }, 1500);
              //延迟函数结束
        }
      });
    }

    if (this.data.itemdata.status == 4) {
console.log("应该运行这里");
    //////////完善支付功能

      wx.request({
        url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/changeOrderState',
        data: { orderid: this.data.itemdata.orderid, status: this.data.itemdata.status },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { "content-type": "application/json" }, // 设置请求的 header
        success: function (res) {
          console.log("订单修改成功！！！");
          // 延迟函数
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/others/all_orders/all_orders?currentTab=' + 1,
            });
            wx.showToast({
              title: '更改成功',
              icon: 'success',
              duration: 1500
            });
          }, 1500);
          //延迟函数结束
        }
      });
    }
  },
  // toBuy:function(){
  //   // var acount = JSON.stringify(acountlist);
  //   // var model = JSON.stringify(booklist);
  //   // wx.navigateTo({
  //   //   url: "/pages/others/balance/balance?model=" + model + "&acount=" + acount,
  //   // })
  //   wx:wx.showToast({
  //     title: '重新结算',
  //     icon: 'seccess',
  //     image: '',
  //     duration: 0,
  //     mask: true,
  //     success: function(res) {},
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })
  // }
  inputTyping:function(e){
    this.data.comments = e.detail.value;
  },
  submit:function(){
    var that = this;
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/addComment',
      data: { bookid: this.data.itemdata.bookid,evaluate:5, comment:this.data.comments, openid: getApp().globalData.openid},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        that.setData({
          iscomments: false
        });
      }
    });
  },
})