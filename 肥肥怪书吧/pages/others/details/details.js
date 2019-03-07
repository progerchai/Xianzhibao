Page({
  data: {
    iscollection:false,
    boughtnumber:1,

    isShowSelectInfo:true,
    // 书本信息如下：
  bookmsg:[],
  comments:'',
    // banner
    imgUrls: [],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s 
    duration: 1000, //  滑动动画时长1s
  },
  onLoad:function(options){
    var that = this;
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/getInformation',
      data: { isUser : 0 , bookid : options.bookid},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        console.log(res.data[0]);
        var bookurl1 ='imgUrls['+ 0 +']';
        var bookurl2 = 'imgUrls[' + 1 + ']';
        var bookurl3 = 'imgUrls[' + 2 + ']';
        that.setData({
          bookmsg: res.data[0],
          [bookurl1]: res.data[0].pic1_url,
          [bookurl2]: res.data[0].pic2_url,
          [bookurl3]: res.data[0].pic3_url,
         
        });
        console.log("获取数据成功")
      },
      fail: function (res) {
        console.log("获取数据失败！");
      },
      complete: function () {
        // complete
      }
    });

// 获取评论
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showComment',
      data: { isUser: 0, openid: getApp().globalData.openid, bookid: options.bookid },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        console.log(res.data);
        that.setData({
          comments: res.data
        });
      }
    });
  },
  collection:function(){
    var that = this;
    if(!this.data.iscollection)
    {
      //添加收藏
      wx.request({
        url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/addCollect',
        data: {openid:getApp().globalData.openid,bookid:this.data.bookmsg.bookid},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { "content-type": "application/json" }, // 设置请求的 header
        success: function (res) {
          console.log("收藏成功");
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1500
          });
        }
      });
    }
    else{
      //添加收藏
      wx.request({
        url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/deleteCollect',
        data: { openid: getApp().globalData.openid, bookid: this.data.bookmsg.bookid },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { "content-type": "application/json" }, // 设置请求的 header
        success: function (res) {
          console.log("成功移出收藏");
        }
      });
    }
    that.setData({
      iscollection:!this.data.iscollection,
    });
    console.log("触发了点击事件")
  },
  onShareAppMessage:function(res){
    console.log(res.from);
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
    }
    else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: this.data.bookmsg.bookname,
      path: '/pages/others/details/details?bookid='+this.data.bookmsg.bookid,
      imageUrl: this.data.bookmsg.book_url,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;

    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表  
    })
  },
  // 返回首页
  toHome:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: '/pages/shopcar/shopcar'
    })
  },
  detailinfomation:function(){
    this.showSelectInfo();
  },
  addCar: function () {
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/addShoppingcar',
      data: { openid:getApp().globalData.openid, bookid: this.data.bookmsg.bookid},
      method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  //显示弹窗
  showSelectInfo: function (e) {
    this.setData({
      isShowSelectInfo: false,
    });
  },
  //隐藏弹窗
  hiddenSelectInfo: function () {
    this.setData({
      isShowSelectInfo: true,
    });
  },

  //点击弹窗的商品属性
  clickAttr: function (e) {
    selectIndex = e.currentTarget.dataset.selectIndex;
    attrIndex = e.currentTarget.dataset.attrIndex;
    var count = shopDialogInfo.selectInfoAttributeList[selectIndex].AttributeNameList.length;
    for (var i = 0; i < count; i++) {
      shopDialogInfo.selectInfoAttributeList[selectIndex].AttributeNameList[i].IsSelect = false;
    }
    shopDialogInfo.selectInfoAttributeList[selectIndex].AttributeNameList[attrIndex].IsSelect = true;

    var name = shopDialogInfo.selectInfoAttributeList[selectIndex].AttributeNameList[attrIndex].Name;//点击属性的名称


    var shopSelectInfoHaveSelectName = "";
    //点击过，修改属性
    selectIndexArray[selectIndex].value = name;
    var selectIndexArraySize = selectIndexArray.length;
    //将数组的所有属性名拼接起来
    for (var i = 0; i < selectIndexArraySize; i++) {
      shopSelectInfoHaveSelectName += ' "' + selectIndexArray[i].value + '" ';
    }

    shopDialogInfo.shopSelectInfoHaveSelect = "已选:" + shopSelectInfoHaveSelectName;
    this.setData({
      shopSelectInfo: shopDialogInfo,
    });

  },
  minus:function(){
    var that = this;
    if(this.data.boughtnumber>1)
      this.data.boughtnumber--;
    that.setData({
      boughtnumber:this.data.boughtnumber
    });
  },
  add: function () {
    var that = this;
    this.data.boughtnumber++;
    that.setData({
      boughtnumber: this.data.boughtnumber
    });
  },

  // 立即购买
  immeBuy() {
   //跳转结算页面
    var booklist = [];
    var acountlist = [];
    booklist.push(this.data.bookmsg);
    acountlist.push(this.data.boughtnumber);
    var acount = JSON.stringify(acountlist);
    var model = JSON.stringify(booklist);
    wx.navigateTo({
      url: "/pages/others/balance/balance?model=" + model + "&acount=" + acount,
    })
  },

})