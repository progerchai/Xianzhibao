var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var address = require('../../../utils/city.js')
var app = getApp();
  var qqmapsdk;
  Page({
      data:{
        animationAddressMenu: {},
        addressMenuIsShow: false,
        value: [0, 0, 0],
        provinces: [],
        citys: [],
        areas: [],
        province: '浙江省',
        city: '温州市',
        area: '瓯海区',
        addressDetails:null,
        phone_number:null,
        consignee_name:null,
      },
    onLoad: function (options) {
      // 初始化动画变量
      var animation = wx.createAnimation({
        duration: 500,
        transformOrigin: "50% 50%",
        timingFunction: 'ease',
      })
      this.animation = animation;
      // 默认联动显示浙江省温州市瓯海区
      var id = address.provinces[2].id
      this.setData({
        provinces: address.provinces,
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
      console.log(this.data)
    },
    // 点击所在地区弹出选择框
    selectDistrict: function (e) {
      var that = this
      if (that.data.addressMenuIsShow) {
        return
      }
      that.startAddressAnimation(true)
    },
    // 执行动画
    startAddressAnimation: function (isShow) {
      console.log(isShow)
      var that = this
      if (isShow) {
        that.animation.translateY(0 + 'vh').step()
      } else {
        that.animation.translateY(40 + 'vh').step()
      }
      that.setData({
        animationAddressMenu: that.animation.export(),
        addressMenuIsShow: isShow,
      })
    },
    // 点击地区选择取消按钮
    cityCancel: function (e) {
      this.startAddressAnimation(false)
    },
    // 点击地区选择确定按钮
    citySure: function (e) {
      var that = this;
      var value = that.data.value;
      that.startAddressAnimation(false)
      // 将选择的城市信息显示到输入框
      var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
      that.setData({
        areaInfo: areaInfo,
        province: that.data.provinces[value[0]].name,
        city: that.data.citys[value[1]].name,
        area: that.data.areas[value[2]].name
      })
    },
    hideCitySelected: function (e) {
      console.log(e)
      this.startAddressAnimation(false)
    },
    // 处理省市县联动逻辑
    cityChange: function (e) {
      console.log(e)
      var value = e.detail.value
      var provinces = this.data.provinces
      var citys = this.data.citys
      var areas = this.data.areas
      var provinceNum = value[0]
      var cityNum = value[1]
      var countyNum = value[2]
      if (this.data.value[0] != provinceNum) {
        var id = provinces[provinceNum].id
        this.setData({
          value: [provinceNum, 0, 0],
          citys: address.citys[id],
          areas: address.areas[address.citys[id][0].id],
        })
      } else if (this.data.value[1] != cityNum) {
        var id = citys[cityNum].id
        this.setData({
          value: [provinceNum, cityNum, 0],
          areas: address.areas[citys[cityNum].id],
        })
      } else {
        this.setData({
          value: [provinceNum, cityNum, countyNum]
        })
      }
      console.log(this.data)
    },
    addressDetails:function(e){
      var that = this;
      that.setData({
        addressDetails: e.detail.value
      });
    },
    consignee_name: function (e) {
      var that = this;
      that.setData({
        consignee_name: e.detail.value
      });
    },
    phone_number: function (e) {
      var that = this;
      that.setData({
        phone_number: e.detail.value
      });
    },
    submit:function(){
      var that = this;
      wx.request({
        url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/changeAddress',
        data: { openid: getApp().globalData.openid, address:getApp().globalData.usermes.address+'-'+ that.data.consignee_name + '-' + that.data.phone_number+'-'+that.data.province+'-'+that.data.city+'-'+that.data.area+'-'+that.data.addressDetails},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { "content-type": "application/json" }, // 设置请求的 header
        success: function (res) {
          wx.request({
            url: 'https://www.ffgbookbar.cn/BookStoreProject/public/store.php/getInformation',
            data: { isUser: 1, openid: app.globalData.openid},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/json" }, // 设置请求的 header
            success: function (res) {
              app.globalData.usermes=res.data[0];
            }
          });
            // 延迟函数
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/others/myaddress/myaddress',
              });
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1500
              });
            }, 1500);
        }
      });
    }
})