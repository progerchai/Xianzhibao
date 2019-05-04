Page({
  data: {
    inputShowed: false,
    inputVal: "",
    judge:0,
    queryresult:null,
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      judge:0
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  judge: function (e) {
    var that = this;
    var inputVal= e.detail.value;
  if(inputVal.length==0)
    that.setData({
      judge: 0
    });
    else
    {
    // var content = encodeURI(inputVal);
    // console.log(content);
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/Index/query',
      data: { querycontent: inputVal },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/x-www-form-urlencoded;charset=utf-8" }, // 设置请求的 header
      success: function (res) {
        // console.log(res.data);
        that.setData({
          queryresult: res.data
        });
      }
    });

      that.setData({
        judge: 1
      });
    }
  },
});