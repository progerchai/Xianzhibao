import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';
Page({
  data: {
    iscollections:true,
    showModal:false,
    booklist:null,
    carts: [],
    deletebookid:null,
  },
  onLoad(){
    var that = this;
    //获取收藏数据
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showCollect',
      data: { openid:getApp().globalData.openid},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        var booklist = res.data.reverse();
        that.setData({
          booklist: booklist,
        });
        that.show(booklist);
           console.log(that.data.booklist.length);
              if(that.data.booklist.length==0)
              {
                that.setData({
                  iscollections:false
                });
              }
              else 
              {
                that.setData({
                  iscollections: true
                });
              }
      }
    });
  },
  async show(booklist){
    for (var i = 0; i < booklist.length; i++)
    {
      const doit = await this.showcollect(booklist[i].bookid);
    }
  },
  showcollect: function (bookid){
    var that = this;
    return new Promise((resolve, reject) =>{
      wx.request({
        url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/getInformation',
        data: { isUser: 0, bookid: bookid },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { "content-type": "application/json" }, // 设置请求的 header
        success: function (e) {
          that.data.carts.push(e.data[0]);
          that.setData({
            carts: that.data.carts,
          });
          resolve(e);
        }
      });
    })
      

  },
  showModal:function(e){
    console.log(e);
    var delid=e.target.dataset.bookid;
    this.setData({
      showModal:true,
      deletebookid:delid,
    });
  },
  hideModal: function () {
    this.setData({
      showModal: false,
    });
  },
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var that = this;
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/deleteCollect',
      data: {openid:getApp().globalData.openid,bookid:this.data.deletebookid},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        wx.showToast({
          title: '已删除',
        })
        that.setData({
          booklist: null,
          carts: [],
          deletebookid: null,
        });
        that.onLoad();
      }
    });
    this.hideModal();
    
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
  gotodetail:function(e){
    var bookid = e.currentTarget.dataset.bookid;
    console.log("你点击的书本bookid为："+bookid);
    wx.navigateTo({
      url: '/pages/others/details/details?bookid=' + bookid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})