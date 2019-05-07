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
    goodsname: '',//商品名称
    content: '',//商品详细介绍
    mes: '',//卖家留言
    price:null,//价格
    sellerphone:'',//卖家联系方式
    sellerWechat:'',//卖家微信号
    info: '',
    showTopTips: false,
    TopTips: '',
  },
  onLoad: function () {
    console.log("头部输出测试：");
    console.log("*****" + username, openid, userid + "*****");
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
        content: '图片最多只能放三张哦',
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
  //商品文本信息上传，传入时间戳作为判断依据
  goodsupload: function (uptime,path){
    var imgpath = "https://www.ffgbookbar.cn/BookStoreProject/public/uploads/" + app.globalData.openid + "/" + uptime + "/"+path;
    wx.request({
      url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/Index/goodsUpload',
      data: { openid: app.globalData.openid, uptime: uptime, goodsname: this.data.goodsname, content: this.data.content, mes: this.data.mes, price: this.data.price, sellerNickname: app.globalData.userInfo.nickName, sellerphone: this.data.sellerphone, sellerWechat: this.data.sellerWechat, book_url:imgpath},
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log("商品文本信息上传成功");
        console.log(res.data);
      }
    });
  },
  // 图片上传服务器端
  upLoadImg:function(){
    var that = this;
    var tempFilePath = that.data.filepath;
    var uptime = Date.parse(new Date())/1000; 
   for(var i = 0;i<tempFilePath.length;i++)
   {
     wx.uploadFile({
       url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/Index/upLoadImg',
       filePath: tempFilePath[i] + '',
       name: 'file',
       header: {
         "Content-Type": "multipart/form-data"
       },
       formData: {
         "openid":app.globalData.openid,
         "uptime":uptime,
       },
       success: function (resoult) {
         console.log("图片传输成功" + JSON.stringify(resoult.data));
         // 成功上传之后，调用商品内容传输函数 goodsupload()
         //temp作为中转站
         var temp = JSON.parse(resoult.data);
         that.goodsupload(uptime, temp.file);
       },
       fail: function (resoult) {
         console.log("图片传输失败" + JSON.stringify(resoult));
       },
       complete: function (resoult) {
         console.log("图片传输结束" + JSON.stringify(resoult));
       },
     })
   }
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
    var that = this;
    var goodsname = e.detail.value.goodsname;
    var content = e.detail.value.content;
    var mes = e.detail.value.mes;
    var price = parseFloat(e.detail.value.price); 
    var sellerphone = e.detail.value.phone; 
    var sellerWechat = e.detail.value.wechat; 
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
    else if (!price){
      console.log("对价格进行判断");
      this.setData({
        showTopTips: true,
        TopTips: '请确保价格为数字'
      });
    }
    else if (sellerphone.length!=11){
      this.setData({
        showTopTips: true,
        TopTips: '请核对您的联系方式，以方便对方联系您'
      });
    }
    else if (sellerWechat == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入您的微信号，以方便对方联系您'
      });
    }
    else if (that.data.filepath.length==0) {
      this.setData({
        showTopTips: true,
        TopTips: '请至少上传一张商品图片'
      });
    }
    else {
      that.setData({
        goodsname: goodsname,
        content: content,
        mes: mes,
        price: price,
        sellerphone: sellerphone ,
        sellerWechat: sellerWechat ,
      })
      wx.showModal({
        title: '提示',
        content: '是否确认提交反馈',
        success: function (res) {
          if (res.confirm) {
            that.upLoadImg();
            that.setData({
              isLoading: true,
              isdisabled: true,
            });
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
