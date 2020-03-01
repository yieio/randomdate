// pages/mycourseinfo/mycourseinfo.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseDate: '',
    startTime: '',
    endTime: '',
    isShowAddPanel: false,
    switchBtnText: '添加',
    myCourseDates: [],
    myCourseInfo: {},
    myCourseInfoEdit: {},
    hasEditRight:false,
  },

  switchAddPanel: function () {
    var _td = this.data;
    this.setData({
      isShowAddPanel: !_td.isShowAddPanel,
      switchBtnText: _td.isShowAddPanel ? '添加' : '取消'
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
   * 格式化courseDate 数据
   * @param {object} item 
   */
  formatCourseDateInfo: function (item) {
    var start = util.formatTime(item.startTime);
    var end = util.formatTime(item.endTime);
    item.timeGap = start + "-" + end;
    var date = new Date(item.courseDate);
    item.courseDate = util.formatDate(date);
    item.gap = util.formatDayGap(util.getDateGap(date));
    item.week = util.formatWeekDay(date);
    return item;
  },

  /**
   * 获取选修课信息及课程日期安排
   * @param {int} courseId 
   */
  getMyCourseDate: function (courseId) {
    var _t = this;
    var _td = _t.data;
    wx.request({
      url: app.api.getMyCourseDate,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: {
        id: courseId
      },
      dataType: "json",
      success: function (result) {
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
        if (cs.length < 0) {
          return;
        }

        for (var i = 0; i < cs.length; i++) {
          cs[i] = _t.formatCourseDateInfo(cs[i]);
        }

        _td.myCourseInfoEdit.name = cs[0].name;
        _td.myCourseInfoEdit.teacher = cs[0].teacher;

        _t.setData({
          myCourseDates: cs,
          myCourseInfo: cs[0]
        });
      }
    });
  },

  /**
   * 提交选修课程表单
   * @param {} e 
   */
  courseFormSubmit: function (e) {
    var _t = this;
    var _td = _t.data;
    var formData = e.detail.value;
    console.log(formData);

    formData.classRoom = formData.classRoom.replace(/^\s*|\s*$/g, "");
    if (formData.classRoom.length < 1) {
      wx.showToast({
        title: '请输入课室名',
        icon: 'none',
        duration: 2000
      });
      return false;
    };
    _td.myCourseInfo.classRoom = formData.classRoom;
    _t.setData({
      myCourseInfo: _td.myCourseInfo
    });

    formData.courseDate = formData.courseDate.replace(/^\s*|\s*$/g, "");
    if (formData.courseDate.length < 1) {
      wx.showToast({
        title: '请选择首节课日期',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.startTime = formData.courseDate + " " + formData.startTime;
    formData.endTime = formData.courseDate + " " + formData.endTime;
    formData.name = _td.myCourseInfo.name;
    formData.teacher = _td.myCourseInfo.teacher;

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
          var course = _t.formatCourseDateInfo(_data.course);

          _td.myCourseDates.unshift(course);
          _t.setData({
            myCourseDates: _td.myCourseDates
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
   * 删除选修课程日期
   */
  deleteMyCourseDate: function (e) {
    var courseId = e.currentTarget.dataset.id;
    var _t = this;
    var _td = _t.data;
    wx.request({
      url: app.api.deleteMyCourseDate,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: {
        id: courseId
      },
      dataType: "json",
      success: function (result) {
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
        var courseId = result.data.data.id;
        for (var i = 0; i < _td.myCourseDates.length; i++) {
          var item = _td.myCourseDates[i];
          if (item.id == courseId) {
            _td.myCourseDates.splice(i, 1);
            _t.setData({
              myCourseDates: _td.myCourseDates
            })
          }
        }
      }
    });

  },

  /**
   * 监听课程名称和老师姓名的输入
   * @param {*} e 
   */
  bindCourseInfoInput: function (e) {
    var val = e.detail.value;
    var target = e.currentTarget.id;
    var _t = this;
    var _td = _t.data;
    if (target == "name") {
      var name = val.replace(/^\s*|\s*$/g, "");
      if(name.length<2){
        wx.showToast({
          title: '课程名不能少于2个字符',
          icon: 'none',
          duration: 2000
        });
        return val; 
      }
      _td.myCourseInfoEdit.name = name; 
    } else if (target == "teacher") {
      var teacher = val.replace(/^\s*|\s*$/g, "");
      if(teacher.length<1){
        wx.showToast({
          title: '请输入老师姓名',
          icon: 'none',
          duration: 2000
        });
        return val; 
      }
      _td.myCourseInfoEdit.teacher = teacher;
    }
  },

  /**
   * 提交课程名和老师姓名的修改
   */
  updateMyCourseInfo: function (e) {
    console.log("mycourseinfo updateMyCourseInfo=>");
    var _t = this;
    var _td = _t.data;

    //判断是否有修改
    if(_td.myCourseInfo.name==_td.myCourseInfoEdit.name&&_td.myCourseInfoEdit.teacher==_td.myCourseInfo.teacher){ 
      return;
    }

    //发起接口调用,保存用户信息
    wx.request({
      url: app.api.updateMyCourse,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: {
        id: _td.myCourseInfo.id,
        name: _td.myCourseInfoEdit.name,
        teacher: _td.myCourseInfoEdit.teacher
      },
      success: function (result) {
        console.log(result);
        if (result.data.type == 200) {
          var _data = result.data.data;
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
          _td.myCourseInfo.name=_td.myCourseInfoEdit.name;
          _td.myCourseInfo.teacher=_td.myCourseInfoEdit.teacher;

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
    console.log("mycourse onload options=>");
    console.log(options);

    this.getMyCourseDate(options.courseId);
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
    var _td = this.data;
    return {title:"选修课信息",path: 'pages/mycourseinfo/mycourseinfo?courseId=' + _td.myCourseInfo.id}

  }
})