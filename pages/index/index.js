//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。 
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  goCourse: function() {
    wx.navigateTo({
      url: '../course/course'
    })
  },
  goMy:function(){
    wx.navigateTo({
      url: '../my/my'
    })
  },


  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log("getUserInfo=>")
    console.log(e); 
    if(typeof(e.detail.userInfo)=="undefined"){
      console.log("getUserInfo=>cancel")
      return;
    }
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    //发起请求保持userInfo到服务器
    wx.login({
      success:function(res){
        if (res.code) { 
          console.log("loginApi=>"+app.api.login);
          wx.request({
            url: app.api.login,
            data: {
              code: res.code,
              userInfo: e.detail.userInfo
            }
          }); 
        } else {
          console.log('登录失败！' + res.errMsg)
        } 
      }
    })
  },
})
