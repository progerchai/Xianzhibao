Page({
  data: {
    inputShowed: false,
    inputVal: "",
    judge:0
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
    var inputVal= e.detail.value;
    console.log(inputVal);
if(inputVal.length>0)
  this.setData({
    judge: 1
  });
  },
});