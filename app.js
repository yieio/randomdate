var config = require('/utils/config.js');

//app.js
App({
  onLaunch: function() {
    // wx.login({
    //   success: res => {
    //     console.log(res.code);
    //   }
    // })
    
    var userToken = wx.getStorageSync('userToken') || null;
    if (userToken && userToken.accessToken.length>0) { 
      //还要判断下 Token 过期情况
      this.globalData.userToken = userToken;
    }

    var userInfo = wx.getStorageSync('userInfo') || null;
    if (userInfo&&userInfo.realName.length>0) {
      this.globalData.userInfo = userInfo;
    }

    var firstView = wx.getStorageSync('firstView') || null;
    if (firstView) {
      this.globalData.firstView = firstView;
    }

    var updateCount = wx.getStorageSync('updateCount') || 0;
    if (updateCount) {
      this.globalData.updateCount = updateCount;
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

  /**
   * 检查登录状态
   */
  checkLogin:function(){


  },


  globalData: {
    firstView:0,//是否首次访问
    shareClassNumber:null,//通过分享链接进入后会记录
    userInfo: null,
    userInfoEx: null,
    userToken: null,
    authSetting: null,
    updateCount:0//记录更新版本，每次更新加1，其他页面显示时对比该数据确认是否要重新加载
  },

  api: {
    login: config.host + "/Identity/LoginByWeApp",
    signup: config.host + "/Identity/UpdateUserInfoByWeApp",
    latestCourse: config.host + "/study/GetLatestCourse",
    classCourse: config.host + "/study/GetClassCourse",
    makeAppointment: config.host + "/Study/MakeAppointment",
    getAppointments: config.host + "/Study/GetAppointments",
    cancelAppointment: config.host +"/Study/CancelAppointment",
    rejectAppointment: config.host +"/Study/rejectAppointment",
    acceptAppointment: config.host + "/Study/acceptAppointment",
    finishAppointment: config.host +"/Study/FinishAppointment",
    classmates: config.host + "/classmate/GetClassmates",
    organizations: config.host +"/classmate/GetOrganizations",
    classmateProfile: config.host + "/classmate/GetClassmateProfile",
    editProfile: config.host + "/classmate/EditProfile",
    getMyCourse:config.host+"/study/GetMyCourse",
    getMyCourseDate:config.host+"/study/GetMyCourseDate",
    addMyCourse:config.host+"/study/AddMyCourse",
    deleteMyCourseDate:config.host+"/study/deleteMyCourse",
    updateMyCourse:config.host+"/study/UpdateMyCourse",
  }
})