// pages/my/my.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isShowEdit: false,
    isGoEdit: false,
  },
  /**
   * 去编辑用户信息
   */
  goEditProfile: function() {
    this.data.isGoEdit = true;
    wx.navigateTo({
      url: '../profile/profile?userId=' + this.data.userInfo.userId
    })
  },

  /**
   * 获取同学档案信息
   */
  getClassmateProfile: function(userId) {
    var _t = this;
    wx.request({
      url: app.api.classmateProfile + "?userid=" + userId,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      dataType: "json",
      success: function(result) {
        console.log(result);
        if (result.data.type == 401) {
          wx.redirectTo({
            url: '/pages/signup/signup',
          })
          return;
        }
        if (result.data.type != 200) {
          return;
        }

        var cp = result.data.data.classmateProfile;
        cp.genderName = app.getGenderName(cp.gender);

        _t.setData({
          userInfo: cp
        });

      }
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.getClassmateProfile(options.userId);
      if (app.globalData.userInfo.userId == options.userId) {
        this.setData({
          isShowEdit: true,
          isLoad: true
        });
      }
    } else {
      wx.redirectTo({
        url: '../signup/signup'
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.isGoEdit && app.globalData.userInfo) {
      this.getClassmateProfile(app.globalData.userInfo.userId);
      this.data.isGoEdit = false;
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (obj) {
    return {
      title: "同学",
    }; 
  }
})