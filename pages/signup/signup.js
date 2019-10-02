// pages/signup/signup.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    classIndex: 0,
    classArrary: ['2019-MBA-PB-1班', '2019-MBA-PB-2班', '2019-MBA-PB-3班', '2019-MBA-PB-4班', '2019-MBA-PB-5班', '2019-MBA-PB-6班'],
    signupForm: {
      realName: "",
      phoneNumber: "",
      classNumber: "",
    },
    signupBtnDisabled: true,

  },

  //班级选择
  bindClassPickerChange: function(e) { 
    this.setData({
      classIndex: e.detail.value
    })
  },

  //检查signup表单的输入情况，不能为空，手机号码要有11位
  checkTheSignUpForm: function(e) {
    var _tds = this.data.signupForm;
    console.log("checkTheSignUpForm=>")
    console.log(e);
    _tds[e.target.id] = e.detail.value;

    if (_tds.realName.length >= 2 && _tds.phoneNumber.length == 11) {
      this.setData({
        signupBtnDisabled: false
      });
    } else {
      this.setData({
        signupBtnDisabled: true
      });
    }

    console.log(this.data.signupForm);
  },

  //用户信息表单提交
  signupFormSubmit: function(e) {
    console.log("signupFormSubmit=>");
    console.log(e);

    var formData = e.detail.value;
    console.log(formData);
    this.data.signupForm = formData;
    this.data.signupForm["formId"] = e.detail.formId;
  },

  //这个是授权信息按钮的回调
  getUserInfo: function(e) {
    console.log("getUserInfo=>")
    console.log(e);
    if (typeof(e.detail.userInfo) == "undefined") {
      console.log("getUserInfo=>cancel")
      return;
    };

    app.globalData.userInfo = e.detail.userInfo;

    var _td = this.data;
    for (var name in _td.signupForm) {
      app.globalData.userInfo[name] = _td.signupForm[name];
    }

    console.log("getUserInfo app.globalData.userInfo=>")
    console.log(app.globalData.userInfo);

    //发起接口调用
    wx.request({
      url: app.api.signup,
      method: "POST",
      header: { 
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: app.globalData.userInfo,
      success: function(result) {
        console.log(result);
        if (result.data.type == 200) {
          var _data = result.data.data;
          app.globalData.userInfo = _data.userInfo;
          app.globalData.userInfo.genderName = app.getGenderName(_data.userInfo.gender);
          //设置storage
          wx.setStorageSync('userInfo', app.globalData.userInfo)
          //跳转到首页
          wx.redirectTo({
            url: '../index/index'
          });
        }else{
          wx.showToast({
            title: '授权登录失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //请求服务器加载用户信息
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          console.log("usercode1=>" + res.code);
          console.log("loginApi=>" + app.api.login);
          var _t = this;
          wx.request({
            url: app.api.login + "?code=" + res.code,
            method: "POST",
            dataType: "json",
            success: function(result) {
              console.log("wx.login=>")
              console.log(result);

              //返回标记是否要跳转去设置班级，姓名，手机号等
              if (result.data.type == 200) {
                var _data = result.data.data;
                app.globalData.userInfo = _data.userInfo;
                app.globalData.userInfo.genderName = app.getGenderName(_data.userInfo.gender);
                
                //记录用户token
                app.globalData.userToken = _data.token;
                //设置storage
                wx.setStorageSync('userInfo', app.globalData.userInfo);
                wx.setStorageSync('userToken', _data.token);

                _t.setData({ userinfo: app.globalData.userInfo });
                if (_data.userInfo.realName != null && _data.userInfo.classNumber != null) {
                  //跳转到首页
                  wx.redirectTo({
                    url: '../index/index'
                  });
                }else{
                  console.log(_data.userInfo.realName)
                }
              }
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        app.globalData.authSetting = res.authSetting;
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo;
            }
          })
        } else {

        }
      }
    })

    if (!this.data.canIUse){
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
        }
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
  onShareAppMessage: function() {

  }
})