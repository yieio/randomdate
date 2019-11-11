// pages/profile/profile.js
// 用户信息编辑页面
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    genderArrary: ['保密', '靓仔', '美女'],
    genderIndex: 0,
    classArrary: [{name:'2019-MBA-PB-4班'}],
    classIndex: 0,

  },

/**
 * 性别选择
 */
  bindGenderPickerChange:function(e){
    this.setData({
      genderIndex: e.detail.value
    }) 
  },

/**
 * 班级选择
 */
  bindClassPickerChange: function (e) {
    this.setData({
      classIndex: e.detail.value
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

        var cas = _t.data.classArrary;

        for (var i = 0; i < cas.length; i++) {
          if (cas[i] == cp.classNumber) {
            _t.setData({
              classIndex: i
            });
          }
        }

        _t.setData({
          userInfo: cp,
          genderIndex: cp.gender
        });

      }
    });
  },
  /**
   * 保存用户资料
   */
  profileFormSubmit: function(e) {
    //姓名，手机号，不能为空
    var formData = e.detail.value;
    formData.realName = formData.realName.replace(/^\s*|\s*$/g, "");
    if (formData.realName.length < 2) {
      wx.showToast({
        title: '真实姓名至少需要2个字符',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.phoneNumber = formData.phoneNumber.replace(/^\s*|\s*$/g, "");
    if (formData.phoneNumber.length != 11) {
      wx.showToast({
        title: '手机号码应为11位数字',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.userId = this.data.userInfo.userId;

    //发起接口调用,保存用户信息
    wx.request({
      url: app.api.editProfile,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: formData,
      success: function (result) {
        console.log(result);
        if (result.data.type == 200) {
          var _data = result.data.data;
          app.globalData.userInfo = _data.userInfo;
          app.globalData.userInfo.genderName = app.getGenderName(_data.userInfo.gender);
          //设置storage
          wx.setStorageSync('userInfo', app.globalData.userInfo)
          //跳转到首页
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },

  /**
  * 获取组织列表
  */
  getOrganizations: function (name) {
    var _t = this;
    var _td = _t.data;
    wx.request({
      url: app.api.organizations,
      method: "GET",
      dataType: "json",
      success: function (result) {
        console.log(result);
        if (result.data.type != 200) {
          wx.showToast({
            title: '组织/班级列表获取失败',
            icon: 'none'
          })
          return;
        }

        var cs = result.data.data.classNumbers;
        if (cs.length > 0) {
          _t.setData({
            classArrary: cs
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (app.globalData.userInfo) { 
      this.getOrganizations();
      this.getClassmateProfile(app.globalData.userInfo.userId);
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

})