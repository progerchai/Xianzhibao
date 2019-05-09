Page({
  data: {
    inputShowed: false,
    inputVal: "",
    judge:0,
    queryresult:null,
    hotsearch:[],
  },
  onLoad:function(){
    var that = this;
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/Index/showHotSearch',
      data: {},
      method: 'GET',
      header: { "content-type": "application/json" },
      success: function (res) {
        that.setData({
          hotsearch: res.data
        });
      }
    });
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
  //进入数据库进行搜索并返回查询结果
  searchStart:function(){
    var that = this;
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/Index/query',
      data: { querycontent: that.data.inputVal },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/x-www-form-urlencoded;charset=utf-8" }, // 设置请求的 header
      success: function (res) {
        // console.log(res.data);
        that.setData({
          queryresult: res.data
        });
      }
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
      //调用搜索
      that.searchStart();
      that.setData({
        judge: 1
      });
    }
  },
  hotsearch:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var inputVal = that.data.hotsearch[index].name;
    that.setData({
      inputVal: inputVal,
    });
    that.searchStart();
  }
});