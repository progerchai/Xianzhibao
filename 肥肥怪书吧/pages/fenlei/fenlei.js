Page({
  data: {
    activeIndex: 0,
    scrolltop:0,
    tabs: [
      {
        id: 1,
        tabName: '热搜推荐'
      }, {
        id: 2,
        tabName: '精品好物'
      }, {
        id: 3,
        tabName: '新品热卖'
      }, {
        id: 4,
        tabName: '即刻秒杀'
      }, {
        id: 5,
        tabName: '二手旧书'
      }, {
        id: 6,
        tabName: '二手杂货'
      }
    ],
    resoutuijian:null,
    jingpinhaoshu:null,
    xinshuremai:null,
    jikemiaosha:null,
    ershoujiushu:null,
    ershouzahuo:null,
  },
  search_page: function () {
    wx.navigateTo({
      url: '../search_page/search_page',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that =this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          deviceHeight: res.windowHeight,
        });
      }
    }); 
    // 获取热搜推荐数据
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showBooks',
      data: { isAll: 1,'type':1},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
       that.setData({
         resoutuijian:res.data,
       });
      }
    });
    // 获取精品好书数据
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showBooks',
      data: { isAll: 1, 'type': 2 },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        that.setData({
          jingpinhaoshu: res.data,
        });
      }
    });
    // 获取新书热卖数据
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showBooks',
      data: { isAll: 1, 'type': 3 },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        that.setData({
          xinshuremai: res.data,
        });
      }
    });
    // 获取即刻秒杀数据
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showBooks',
      data: { isAll: 1, 'type': 4 },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        that.setData({
          jikemiaosha: res.data,
        });
      }
    });
    // 获取二手旧书数据
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showBooks',
      data: { isAll: 1, 'type': 5 },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        that.setData({
          ershoujiushu: res.data,
        });
      }
    });
    // 获取二手杂货数据
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showBooks',
      data: { isAll: 1, 'type': 6 },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        that.setData({
          ershouzahuo: res.data,
        });
      }
    });
  },
  changeTab: function (e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      scrolltop:0,
    })
  },
  gotodetail:function(res){ 
    var bookid = res.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '../others/details/details?bookid='+bookid,
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === "menu") {
      console.log("来自右上角转发菜单")
    }
    return {
      title: "肥肥怪书吧",
      path: '/pages/index/index',
      imageUrl: "https://www.ffgbookbar.cn/BookStoreProject/public/index.png",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  getMore: function () {
    // this.setData({
    //   contentList: this.data.contentList.concat([
    //     { text: ' ' },
    //     { text: ' ' },
    //     { text: ' ' },
    //     { text: ' ' },
    //     { text: ' ' }
    //   ])
    // });
  },
})