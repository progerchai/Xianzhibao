//获取应用实例
var app = getApp();
Page({
  data: {
    judgecontent:true,
    goods:[
        {
          img: "http://img3m5.ddimg.cn/20/1/23239775-1_x_1.jpg",
          name: "HTML5 Canvas核心技术1",
        inrtoduce: "HTML5 Canvas核心技术：图形、动画与游戏开发(HTML 5 Canvas领域的标杆之作，公认的权威经典)",
          discountprice: 12.50,
          comtime: "2019-4-28 10:12:56"
        },
        {
          img: "http://img3m5.ddimg.cn/20/1/23239775-1_x_1.jpg",
          name: "HTML5 Canvas核心技术2",
          inrtoduce: "HTML5 Canvas核心技术：图形、动画与游戏开发(HTML 5 Canvas领域的标杆之作，公认的权威经典)",
          discountprice: 12.66,
          comtime: "2019-4-28 10:12:56"
        } ,
        {
          img: "http://img3m5.ddimg.cn/20/1/23239775-1_x_1.jpg",
          name: "HTML5 Canvas核心技术3",
          inrtoduce: "HTML5 Canvas核心技术：图形、动画与游戏开发(HTML 5 Canvas领域的标杆之作，公认的权威经典)",
          discountprice: 12,
          comtime: "2019-4-28 10:12:56"
        }
      ],
  },
  onLoad: function () {
      // 刚进入页面或返回时对数据进行刷新
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function (){
  },
  tonewsell: function () {
    wx.navigateTo({
      url: '../mysell/mysell',
      success: function (res){},
      fail: function (res){},
      complete: function (res){},
    })
  }
});
