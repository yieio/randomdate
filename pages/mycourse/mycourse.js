// pages/mycourse.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseDate:'',
    startTime:'',
    endTime:'',
    isShowAddPanel:false,
    switchBtnText:'添加',
    //我的自选课程
    myCourses:[],
  },

  switchAddPanel:function(){
    var _td = this.data;
    this.setData({
      isShowAddPanel:!_td.isShowAddPanel,
      switchBtnText:_td.isShowAddPanel?'添加':'取消'
    }); 
  },

  bindDateChange: function (e) { 
    this.setData({
      courseDate: e.detail.value
    })
  },

  bindStartTimeChange: function (e) { 
    this.setData({
      startTime: e.detail.value
    })
  },

  bindEndTimeChange: function (e) { 
    this.setData({
      endTime: e.detail.value
    })
  },

   /**
   * 选修课信息
   */
  goMyCourseInfo:function(e){
    var _id = e.currentTarget.dataset.id;
    console.log(_id);
    wx.navigateTo({
      url: '../mycourseinfo/mycourseinfo?courseId='+_id
    })

  },

  /**
   * 获取自选课信息
   */
  getMyCourse:function(){
    var _t = this;
    wx.request({
      url: app.api.getMyCourse,
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

        var cs = result.data.data.courses;
        for(var i=0;i<cs.length;i++){
          cs[i].startTime = util.formatDateTime(cs[i].startTime);
          cs[i].endTime = util.formatDateTime(cs[i].endTime);
        }


        _t.setData({
          myCourses: cs
        });
      }
    });

  },

  /**
   * 提交选修课程表单
   * @param {} e 
   */
  courseFormSubmit:function(e){
    var _t = this;
    var _td = _t.data;
    var formData = e.detail.value;
    console.log(formData);

    formData.name = formData.name.replace(/^\s*|\s*$/g, "");
    if (formData.name.length < 2) {
      wx.showToast({
        title: '课程名称至少需要2个字符',
        icon: 'none',
        duration: 2000
      });
      return false;
    };
    console.log(formData.name);

    formData.teacher = formData.teacher.replace(/^\s*|\s*$/g, "");
    if (formData.teacher.length < 2) {
      wx.showToast({
        title: '课程名称至少需要2个字符',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.classRoom = formData.classRoom.replace(/^\s*|\s*$/g, "");
    if (formData.classRoom.length < 1) {
      wx.showToast({
        title: '请输入课室名',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.courseDate = formData.courseDate.replace(/^\s*|\s*$/g, "");
    if (formData.courseDate.length < 1) {
      wx.showToast({
        title: '请选择首节课日期',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.startTime = formData.courseDate+" "+formData.startTime;
    formData.endTime = formData.courseDate+" "+formData.endTime;

    //发起接口调用,保存用户信息
    wx.request({
      url: app.api.addMyCourse,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: formData,
      success: function (result) {
        console.log(result);
        if (result.data.type == 200) {
          var _data = result.data.data;
          //添加返回的数据到
          var course = _data.course;
          course.startTime = util.formatDateTime(course.startTime);
          course.endTime = util.formatDateTime(course.endTime);
          _td.myCourses.unshift(course);
          _t.setData({
            myCourses:_td.myCourses
          });

          //切换隐藏添加面板
          _t.switchAddPanel();
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //判断登录情况，已登录获取用户选修课程
    if (app.globalData.userInfo) {
      this.getMyCourse(); 
    }else{
      wx.redirectTo({
        url: '../signup/signup',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _t = this;
    _t.onPullDownRefresh();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");

    var _t = this;
    _t.getMyCourse();

    wx.stopPullDownRefresh({
      complete: (res) => {},
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return {title:"选修课"}

  }
})