 var Temp = require('../template/contract.js');
Page(Object.assign({}, Temp.Quantity, {
  data: {
    flagtimer:false,
    showModal:false,
    index:0,
    isAllSelect: false,
    totalMoney: 0,
    // 商品详情介绍
    carts: [],
    isSelect:[],
    istouchmove:[],
    booklist:null,
    startX: 0, //开始坐标
    startY: 0
  },
  onLoad(){
    var that = this;
    that.setData({
      flagtimer: false,
      showModal: false,
      index: 0,
      isAllSelect: false,
      totalMoney: 0,
      // 商品详情介绍
      carts: [],
      isSelect: [],
      booklist: null,
    });
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showShoppingCar',
      data: { openid: getApp().globalData.openid },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        that.setData({
          booklist: res.data,
        });
        var bookidlist = ''+res.data[0].bookid;
        for (let i = 1; i < res.data.length; i++) {
         bookidlist= bookidlist+","+res.data[i].bookid
        }
        
        wx.request({
          url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/getInformation',
          data: { isUser: 0, bookid: bookidlist },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: { "content-type": "application/json" }, // 设置请求的 header
          success: function (e) {
            
            
            that.data.istouchmove.push({ isTouchMove: false });
            for (let i = 0;i <e.data.length;i++)
            {
              that.data.isSelect.push({ ischecked: false });
            }
            that.setData({
              carts: e.data,
              isSlect: that.data.isSelect
            });
          }
        });
      }
    });
    
  },
  onShow(){
    var that = this;  
    if(this.data.flagtimer==false)
    {
      console.log("第一次触发");
      this.data.flagtimer=!this.data.flagtimer}
    else
    {
      console.log("不是第一次触发")
      that.onLoad();
    }
  },
  //勾选事件处理函数  
  switchSelect: function (e) {
    // 获取item项的id，和数组的下标值  
    var Allprice = 0, i = 0;
    var index = e.target.dataset.index;
    this.data.isSelect[index].ischecked = !this.data.isSelect[index].ischecked;
    //价钱统计
    if (this.data.isSelect[index].ischecked) {
      this.data.totalMoney = this.data.totalMoney + this.data.carts[index].discountprice * this.data.booklist[index].boughtnumber;
    }
    else {
      this.data.totalMoney = this.data.totalMoney - this.data.carts[index].discountprice * this.data.booklist[index].boughtnumber;
    }
    //是否全选判断
    for (i = 0; i < this.data.carts.length; i++) {
      Allprice = Allprice + this.data.carts[i].discountprice;
    }
    if (Allprice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    }
    else {
      this.data.isAllSelect = false;
    }
    this.setData({
      carts: this.data.carts,
      totalMoney: parseFloat(parseFloat(this.data.totalMoney).toFixed(2)),
      isAllSelect: this.data.isAllSelect,
      isSelect:this.data.isSelect,
    })
  },
  //全选
  allSelect: function () {
    //处理全选逻辑
    let i = 0;
    if (!this.data.isAllSelect) {
      this.data.totalMoney=0;
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.isSelect[i].ischecked = true;
        this.data.totalMoney = this.data.totalMoney + this.data.carts[i].discountprice * this.data.booklist[i].boughtnumber;
      }   
    }
    else {
      for (i = 0; i < this.data.carts.length; i++) {
        //错误修正
        this.data.isSelect[i].ischecked = false;
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      carts: this.data.carts,
      isSelect: this.data.isSelect,
      booklist:this.data.booklist,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: parseFloat(parseFloat(this.data.totalMoney).toFixed(2)),
    })
  },
  // 去结算
  toBuy() {
//判断结算列表
var booklist=[];
var acountlist=[];
    for (var i = 0; i < this.data.isSelect.length;i++)
    {
      if(this.data.isSelect[i].ischecked==true)
      {
        acountlist.push(this.data.booklist[i].boughtnumber);
        booklist.push(this.data.carts[i]);
      }
    }
    if (acountlist.length==0)
    {
      wx.showToast({
        title: '请选择结算商品',
        icon: 'none',
        duration: 2000
      });
      return 0;
    }
  //   var acount = JSON.stringify(acountlist);
  //   var model = JSON.stringify(booklist);
  //   console.log(acount);
  //   console.log(model);
  //   console.log("ggggggggggggg");
  //  wx.navigateTo({
  //    url: "/pages/others/balance/balance?model="+model+"&acount="+acount,
  //  })
    wx.showModal({
      title: '抱歉',
      content: '目前已将在线支付功能关闭了哦，请和商家联系。',
      showCancel: false,//是否显示取消按钮
      cancelColor: 'skyblue',//取消文字的颜色
      confirmText: "我知道了",//默认是“确定”
      confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) { },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },
  decreaseCount:function(e){
    var componentId = e.target.dataset.index;
    if (this.data.booklist[componentId].boughtnumber>1)
    {
      this.data.booklist[componentId].boughtnumber = this.data.booklist[componentId].boughtnumber - 1;
      if (this.data.isSelect[componentId].ischecked) {
        this.data.totalMoney = this.data.totalMoney - parseFloat(this.data.carts[componentId].discountprice);
      }
    }
    this.setData({
      booklist: this.data.booklist,
      carts: this.data.carts,
      totalMoney: parseFloat(parseFloat(this.data.totalMoney).toFixed(2)),
    });
  }, 
  addCount:function(e){
    console.log(e.target.dataset.index);
    var componentId = e.target.dataset.index;
    this.data.booklist[componentId].boughtnumber = this.data.booklist[componentId].boughtnumber + 1;

    if (this.data.isSelect[componentId].ischecked) {
      this.data.totalMoney =this.data.totalMoney + parseFloat(this.data.carts[componentId].discountprice);
    }
    this.setData({
      booklist:this.data.booklist,
      carts: this.data.carts,
      totalMoney: parseFloat(parseFloat(this.data.totalMoney).toFixed(2)),
    });
  },
  todetail:function(e){
    var index = this.data.index;
    var bookid = this.data.carts[index].bookid;
 
    wx.navigateTo({
      url: '/pages/others/details/details?bookid=' + bookid,
      success: function (res) {
        console.log("详细跳转成功");
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  
    
  },
  into_garbage:function(){
    var that = this;
    var componentId = this.data.index;
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/deleteShoppingcar',
      data: {openid:getApp().globalData.openid,bookid:this.data.carts[componentId].bookid},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "application/json" }, // 设置请求的 header
      success: function (res) {
        console.log(res);  
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 3000
        });
        that.setData({
          carts: [],
          isSelect: [],
          booklist: null,
          isAllSelect: false,
          totalMoney: 0,
        });
        that.onLoad();
      }
    }); 
  },
  onShareAppMessage: function (res) {
    if (res.from === "menu") {
      console.log("来自右上角转发菜单")
    }
    return {
      title: "肥肥怪二手",
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
  showModal: function (e) {
    this.setData({
      showModal: true,
      index: e.target.dataset.index,
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
    this.into_garbage();
    wx.showToast({
      title: '已删除',
    })
    this.hideModal();
  },
// 左滑删除动画开始
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.istouchmove.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    });
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      istouchmove: this.data.istouchmove
    });

  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.istouchmove.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      istouchmove: that.data.istouchmove
    })
  },

  /**
  
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */

  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
// 左滑删除动画结束
}));
