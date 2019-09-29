//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    userDateCount:{dateCnt:0,callDateCnt:0},
    animationData: {}, 
    shakeTimeHandler: null
  },
  //事件处理函数
  goCourse: function() {
    wx.navigateTo({
      url: '../course/course'
    })
  },
  goMy: function() {
    wx.navigateTo({
      url: '../my/my'
    })
  },

  //页面onload 
  onLoad: function() {
    this.setData({ userInfo: app.globalData.userInfo}); 
  },

  onShow: function() {
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'linear',
    })

    clearTimeout(this.data.shakeTimeHandler);

    this.data.shakeTimeHandler = setTimeout(function() {
      //添加左右抖动动画效果
      for (var i = 0; i < 8; i++) {
        var d = 160 - i * 10;
        animation.translateX(16).step({
          duration: d
        })
        animation.translateX(-16).step({ 
          duration: d
        }) 
      };


      animation.translateX(0).step({
        duration: 10
      });
      if (app.globalData.userInfo) {
        this.setData({
          animationData: animation.export()
        })
      } 
    }.bind(this), 2000)
  },
 
})