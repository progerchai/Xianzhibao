//获取应用实例
var app = getApp();
var that;
var username = wx.getStorageSync("my_nick");
var openid = wx.getStorageSync("user_openid");
var userid = wx.getStorageSync("user_id");
Page({
  data: {
    list_remind: '加载中',
    itemopen: false,
    hasFeed: false,
    goodsname: '',
    content: '',
    mes: '',
    info: '',
    showTopTips: false,
    TopTips: '',
  },
  onLoad: function () {
    that = this;
    that.setData({//初始化数据
      filepath: [],
      isSrc: true,
      ishide: "0",
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false
    })

    //获取设备和用户信息
    wx.getSystemInfo({
      success: function (res) {
        var info = '---\r\n**用户信息**\r\n';
        info += '用户名：' + username;
        info += '\r\n手机型号：' + res.model;
        info += '（' + res.platform + ' - ' + res.windowWidth + 'x' + res.windowHeight + '）';
        info += '\r\n微信版本号：' + res.version;
        info += '\r\nTogether版本号：' + app.version;
        that.setData({
          info: info
        });
        console.log(info);
      }
    });

  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    wx.hideToast()
  },


  //上传图片
  uploadPic: function () {
    var that = this;
    if (that.data.filepath.length == 3) {
      wx.showModal({
        title: '提示',
        content: '图片只能放三张哦',
        showCancel: false,//是否显示取消按钮
        cancelColor: 'skyblue',//取消文字的颜色
        confirmText: "我知道了",//默认是“确定”
        confirmColor: 'skyblue',//确定文字的颜色
        success: function (res) { },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })
      return 0;
    }
    //设置第一张上传时弹出提示框消耗流量
    if (that.data.filepath.length == 0) {
      wx.showModal({
        title: '提示',
        content: '上传图片需要消耗流量，是否继续？',
        confirmText: '继续',
        success: function (res) {
          if (res.confirm) {
            wx.chooseImage({
              count: 1, // 默认9
              sizeType: ['compressed'], //压缩图
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var filepath = that.data.filepath;
                var tempFilePaths = res.tempFilePaths;
                console.log(filepath);
                filepath.push(tempFilePaths);
                console.log("地址路径为：" + tempFilePaths);
                that.setData({
                  isSrc: true,
                  filepath: filepath,
                })
                console.log("地址路径为：" + that.data.filepath[0]);
              }
            })
          }
        }
      });
    }
    else {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], //压缩图
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var filepath = that.data.filepath;
          var tempFilePaths = res.tempFilePaths;
          console.log(filepath);
          filepath.push(tempFilePaths);
          console.log("地址路径为：" + tempFilePaths);
          that.setData({
            isSrc: true,
            filepath: filepath,
          })
          console.log("地址路径为：" + that.data.filepath[0]);
        }
      })
    }
  },

  //删除图片
  clearPic: function (event) {//删除图片
    console.log(event);
    var that = this;
    var index = event.currentTarget.dataset.index;
    var filepath = that.data.filepath;
    filepath.splice(index, 1);
    that.setData({
      isSrc: true,
      filepath: filepath,
      // isSrc用来掩盖增加图标
    })
  },
  // 图片上传
  upLoadImg:function(){
    var that = this;
    var tempFilePath = that.data.filepath;
    console.log("上传的图片路径为："+tempFilePath[0]);
    wx.uploadFile({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/showBooks',
      filePath: tempFilePath[0]+"",
      name: 'seller_img',
      // formData: {'user': 'test'},
      success: function (res) {
        console.log("图片传输成功"+res);
        // 成功上传之后，删除后面的延迟函数，调用 toast函数
      },
      fail: function (res) {
        console.log("图片传输失败" + res);
      },
      complete: function (res) {
        console.log("图片传输结束" + res);
      },
    })
  },

  //表单验证
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  //提交表单
  submitForm: function (e) {
    var goodsname = e.detail.value.goodsname;
    var content = e.detail.value.content;
    var mes = e.detail.value.mes;
    //先进行表单非空验证
    if (goodsname == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入商品名称'
      });
    } else if (content == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入商品详细介绍'
      });
    }
    else {
      that.setData({
        isLoading: true,
        isdisabled: true,
      })
      wx.showModal({
        title: '提示',
        content: '是否确认提交反馈',
        success: function (res) {
          if (res.confirm) {
            that.upLoadImg();
            // 延迟函数
            setTimeout(function () {
              wx.navigateBack({
                delta:1,
              });
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1500
              });
            }, 1500);

          }
        }
      })
    }
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  }

});
