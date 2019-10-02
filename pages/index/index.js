var util = require('../../utils/util.js');

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    courseDate: {
      hasCourse: false
    },
    latestCourse: [],
    userDateCount: {
      dateCount: 0,
      callDateCount: 0
    },
    animationData: {},
    shakeTimeHandler: null,
    schoolTerm:1,
    classmates:[],

    showDialog:false,
    istrue:false,

    dateList:["今天","明天","后天","最近课程那一天"],
    dateIndex:3,

    timeList: ["早餐", "午餐", "晚餐", "宵夜"],
    timeIndex: 1
  },
  openDialog: function () {
    this.setData({
      istrue: true
    })
  },
  closeDialog: function () {
    this.setData({
      istrue: false
    })
  },
  //事件处理函数
  goCourse: function() {
    var _td = this.data; 
    wx.navigateTo({
      url: '../course/course?classNumber=' + _td.userInfo.classNumber + "&schoolTerm=" + _td.schoolTerm,
    })
  },
/**
 * 点击同学头像跳转同学档案页面
 */
  goProfile:function(e){
    console.log("goProfile=>");
    console.log(e);

    wx.navigateTo({
      url: '../my/my?userId=' + e.currentTarget.id
    })
  },

  //获取最新课程
  getLatestCourse: function(classNumber) {
    var _t = this;
    wx.request({
      url: app.api.latestCourse + "?classNumber=" + classNumber,
      method: "GET",
      dataType: "json",
      success: function(result) {
        console.log(app.api.latestCourse + "?classNumber=" + classNumber + "=>");
        console.log(result);
        if (result.data.type == 200) {
          var cs = result.data.data.courses;
          var courseDate = {};

          if (cs.length <= 0) {
            return;
          }

          var item = cs[0];
          var date = new Date(item.courseDate);
          courseDate.hasCourse = true;
          courseDate.date = util.formatDate(date);
          courseDate.gap = util.formatDayGap(util.getDateGap(date));
          courseDate.week = util.formatWeekDay(date);

          for (var i = 0; i < cs.length; i++) {
            var item = cs[i];
            var start = util.formatTime(item.startTime); 
            var end = util.formatTime(item.endTime); 
            cs[i].timeGap = start + "-" + end;
          }

          _t.setData({
            courseDate: courseDate,
            latestCourse: cs,
            schoolTerm:item.schoolTerm
          });

        } else {
          _t.setData({
            courseDate: null,
            latestCourse: []
          })
        }
      }
    });

  },

  /**
   * 获取同学
   */
  getClassmates:function(){
    var _t = this;
    wx.request({
      url: app.api.classmates,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      dataType: "json",
      success: function (result) {
        console.log(result);
        if (result.data.type==401){
          wx.redirectTo({
            url: '/pages/signup/signup',
          })
          return;
        }
        if (result.data.type != 200) {
          return;
        }

        var cs = result.data.data.classmates;
        _t.setData({
          classmates:cs
        }); 
      }
    });
  },

/**
 * 选择日期
 */
  selectDate:function(e){ 
    var id = e.currentTarget.dataset.id;
    this.setData({
      dateIndex : id, 
    }); 
  },

/**
 * 选择时间
 */
  selectTime: function (e) { 
    var id = e.currentTarget.dataset.id;
    this.setData({
      timeIndex: id,
    });
  },

/**
 * 确定约饭
 */
  makeDate:function(e){
    var _t = this;
    var _td = this.data;

    wx.request({
      url: '',
    });

  },

  //页面onload 
  onLoad: function() {
    this.setData({
      userInfo: app.globalData.userInfo
    });

    if (app.globalData.userInfo) {
      this.getLatestCourse(app.globalData.userInfo.classNumber);

      this.getClassmates();
    }
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