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
    title: '',
    content: '',
    info: '',
    showTopTips: false,
    TopTips: '',
  },
  onLoad: function () {
    that = this;
    that.setData({//初始化数据
      src: "",
      isSrc: false,
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
              var tempFilePaths = res.tempFilePaths
              that.setData({
                isSrc: true,
                src: tempFilePaths
              })
              console.log(that.data.src);
            }
          })
        }
      }
    });
  },

  //删除图片
  clearPic: function () {//删除图片
    that.setData({
      isSrc: false,
      src: ""
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
    var title = e.detail.value.title;
    var content = e.detail.value.content;
    //先进行表单非空验证
    if (title == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入反馈标题'
      });
    } else if (content == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入反馈内容'
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
        success:function(res){
          if (res.confirm){
            console.log("上传成功");
            // 延迟函数
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/self/self',
              });
              wx.showToast({
                title: '反馈成功',
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
