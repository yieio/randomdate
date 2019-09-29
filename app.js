var config = require('/utils/config.js');

//app.js
App({
  onLaunch: function() {
    var userToken = wx.getStorageSync('userToken') || {};    
    if (!userToken.accessToken || userToken.accessToken == null || userToken.accessToken == "") {
      wx.redirectTo({
        url: 'pages/signup/signup',
      })
    } else {
      //还要判断下 Token 过期情况
      this.globalData.userToken = userToken;
    }
 
    var userInfo = wx.getStorageSync('userInfo') || {};
    if (!userInfo.realName || userInfo.realName == null || userInfo.realName == "") {
      wx.redirectTo({
        url: 'pages/signup/signup',
      })
    }else{
      this.globalData.userInfo = userInfo;
    }

    
  },

  //根据git获取性别，0-未知，1-男，2-女
  getGenderName: function(gint) {
    var result = "未知";
    if (gint == 1) {
      result = "靓仔";
    } else if (gint == 2) {
      result = "美女";
    }
    return result;
  },


  globalData: {
    userInfo: null,
    userInfoEx: null,
    userToken: null,
    authSetting: null,
  },

  api: {
    login: config.host + "/Identity/LoginByWeApp",
    signup: config.host + "/Identity/UpdateUserInfoByWeApp"
  }
})