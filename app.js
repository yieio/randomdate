var config = require('/utils/config.js');

//app.js
App({
  onLaunch:function() { 
    wx.login({
      success:res=>{
        console.log(res.code);
      }
    })


    var userToken = wx.getStorageSync('userToken') || null;    
    if (!userToken|| !userToken.accessToken || userToken.accessToken == "") {
      wx.redirectTo({
        url: 'pages/signup/signup',
      })
    } else {
      //还要判断下 Token 过期情况
      this.globalData.userToken = userToken;
    }
 
    var userInfo = wx.getStorageSync('userInfo') || null; 
    if (!userInfo|| !userInfo.realName || userInfo.realName == "") {
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
    signup: config.host + "/Identity/UpdateUserInfoByWeApp",
    latestCourse: config.host + "/study/GetLatestCourse",
    classCourse: config.host + "/study/GetClassCourse",
    classmates: config.host + "/classmate/GetClassmates",
    classmateProfile: config.host + "/classmate/GetClassmateProfile",
    editProfile: config.host + "/classmate/EditProfile"
  }
})