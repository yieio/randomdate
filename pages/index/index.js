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
    animationData: {},
    shakeTimeHandler: null,
    schoolTerm: 1,
    classmates: [],

    appointment: {
      title: "不要一个人吃饭",
      msg: "点击 【我请你】 后会匿名随机给下面的一个同学发出约饭邀请，对方接受后可以看到彼此。吃饭我们是认真的，请守约哦^_^",
      appointmentStatus: 0
    },

    defaultAppointment: {
      title: "不要一个人吃饭",
      msg: "点击 【我请你】 后会匿名随机给下面的一个同学发出约饭邀请，对方接受后可以看到彼此。吃饭我们是认真的，请守约哦^_^",
      appointmentStatus: 0
    },

    inviters: [],

    showDialog: false,

    dateList: ["今天", "明天", "后天", "最近课程那一天"],
    dateIndex: 3,
    dateDesc:"",

    timeList: ["早餐", "午餐", "晚餐", "宵夜"],
    timeIndex: 1
  },
  openDialog: function() {
    this.setData({
      showDialog: true
    })
  },
  closeDialog: function() {
    this.setData({
      showDialog: false
    })
  },
  //事件处理函数
  goCourse: function() {
    var _td = this.data;
    wx.navigateTo({
      url: '../course/course?classNumber=' + _td.userInfo.classNumber + "&schoolTerm=" + _td.schoolTerm + "&courseDate=" + _td.courseDate.date,
    })
  },
  /**
   * 点击同学头像跳转同学档案页面
   */
  goProfile: function(e) {
    console.log("goProfile=>");
    console.log(e);

    wx.navigateTo({
      url: '../my/my?userId=' + e.currentTarget.id
    })
  },

  //获取最新课程
  getLatestCourse: function(classNumber) {
    var _t = this;
    var _td = _t.data;
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
            schoolTerm: item.schoolTerm
          });

          if(_td.dateIndex==3){
            var dateDesc = _td.dateList[3] + "：" + courseDate.date;
            _t.setData({
              dateDesc:dateDesc
            });
          }

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
 * 格式化约饭信息
 */
  formatAppointment:function(app,iscreater){
    if(iscreater){
      if (app.appointmentStatus == 1) {
        //等待回应
        app.title = "约饭邀请已发出";
        app.msg = app.content;
        app.endTime = util.formatTime(app.expiredTime);
      } else if (app.appointmentStatus == 10) {
        //对方接受邀约
        app.title = "约饭成功";
        app.msg = app.content;
      } else if (app.appointmentStatus == 13) {
        //对方拒绝邀约
        app.title = "约饭失败";
        app.msg = app.content;
      } else if (app.appointmentStatus == 40) {
        //约饭过期没人回应
        app.title = "约饭过期未回应";
        app.msg = app.content;
      }else if(app.appointmentStatus == 42){
        //已经过了约会时间
        app.title = "已过约会时间";
        app.msg = app.content;
      }
    }else{
      if (app.appointmentStatus == 1) {
        //等待回应
        app.title = "有人请你吃饭";
        app.msg = app.content;
        app.hasInviter = true;
        app.showAnimation = true;
      } else if (app.appointmentStatus == 10) {
        //对方接受邀约
        app.title = "与人有约";
        app.msg = app.content;
        app.hasInviter = true;
      }else {
        app.hasInviter = false;
      }
    }

    return app; 
  },

  /**
   * 获取约饭
   */
  getAppointments: function() {
    var _t = this;
    wx.request({
      url: app.api.getAppointments,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      dataType: "json",
      success: function(result) {
        console.log(result);
        var resultData = result.data;
        if (resultData.type == 401) {
          wx.redirectTo({
            url: '/pages/signup/signup',
          })
          return;
        }

        if (resultData.type != 200) {
          wx.showToast({
            title: resultData.content,
            icon: 'none',
          })
          return;
        }

        var apps = resultData.data.creaters;
        console.log(apps);
        if (apps.length > 0) {
          var creater = _t.formatAppointment(apps[0],true);

          _t.setData({
            appointment: creater
          });
        }

        //邀请数据
        apps = resultData.data.inviters;
        var inviters = [];
        if (apps.length > 0) {
          for (var i = 0; i < apps.length;i++){
            var creater = _t.formatAppointment(apps[i], false);
            if(creater.hasInviter){
              inviters.push(creater);
            } 
          }

          _t.setData({
            inviters: inviters
          });
        }
      }
    })
  },

  /**
   * 取消约饭
   */
  cancelAppointment: function(e) {
    var _t = this;
    var _td = this.data;
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.api.cancelAppointment + "?id=" + id,
      method: "POST",
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
          wx.showToast({
            title: result.data.content,
            icon: "none"
          })
          return;
        }

        _t.setData({
          appointment: _td.defaultAppointment
        });

      }
    })
  },

  /**
   * 拒绝约饭
   */
  rejectAppointment: function(e) {
    var _t = this;
    var _td = this.data;
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.api.rejectAppointment + "?id=" + id,
      method: "POST",
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
          wx.showToast({
            title: result.data.content,
            icon: "none"
          })
          return;
        }
        
        //拒绝成功，更新
        var app = result.data.data.appointment;
        var inviters = _td.inviters;
        for(var i=0;i<inviters.length;i++){
          var item = inviters[i];
          if(item.id == app.id){
            inviters.splice(i,1);
          }
        }
 
        _t.setData({
          inviters: inviters
        });

      }
    })
  },

  /**
   * 接受约饭
   */
  acceptAppointment: function (e) {
    var _t = this;
    var _td = this.data;
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.api.acceptAppointment + "?id=" + id,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
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
          wx.showToast({
            title: result.data.content,
            icon: "none"
          })
          return;
        }

        var app = result.data.data.appointment;
        var inviters = _td.inviters;
        for (var i = 0; i < inviters.length; i++) {
          var item = inviters[i];
          if (item.id == app.id) {
            inviters[i] = _t.formatAppointment(app, false);
            break;
          }
        }

        _t.setData({
          inviters: inviters
        });

      }
    })
  },

  finishAppointment: function(e){
    var _t = this;
    var _td = this.data;
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.api.finishAppointment + "?id=" + id,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
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
          wx.showToast({
            title: result.data.content,
            icon: "none"
          })
          return;
        }

        _t.setData({
          appointment: _td.defaultAppointment
        });

      }
    })
  },

  /**
   * 获取同学
   */
  getClassmates: function() {
    var _t = this;
    wx.request({
      url: app.api.classmates,
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

        var cs = result.data.data.classmates;
        _t.setData({
          classmates: cs
        });
      }
    });
  },

  /**
   * 选择日期
   */
  selectDate: function(e) {
    var id = e.currentTarget.dataset.id;
    var _td = this.data;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate() + id;

    var dateDesc = _td.dateList[id]+"："+[year, month, day].join('/');

    if (id == 3) {
      dateDesc = _td.dateList[id] +"："+_td.courseDate.date;
    }

    this.setData({
      dateIndex: id,
      dateDesc: dateDesc
    });
  },

  /**
   * 选择时间
   */
  selectTime: function(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      timeIndex: id,
    });
  },

  /**
   * 确定约饭
   */
  makeDate: function(e) {
    var _t = this;
    var _td = _t.data;

    var now = new Date();
    var appointmentDate = "";
    var timeType

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate() + _td.dateIndex;
    
    appointmentDate = [year, month, day].join('/') + " 00:00:00";

    if (_td.dateIndex == 3) {
      appointmentDate = _td.courseDate.date + " 00:00:00";
    }

    var postData = {
      appointmentDate: appointmentDate,
      timeType: _td.timeIndex
    };

    console.log(postData);

    wx.request({
      url: app.api.makeAppointment,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      dataType: "json",
      data: postData,
      success: function(result) {
        console.log(result);
        var resultData = result.data;
        if (resultData.type == 401) {
          wx.redirectTo({
            url: '/pages/signup/signup',
          })
          return;
        }

        if (resultData.type != 200) {
          wx.showToast({
            title: resultData.content,
            icon: 'none',
          })
          return;
        }

        console.log(resultData.data.appointment);

        var ap = _t.formatAppointment(resultData.data.appointment,true);

        _t.setData({
          showDialog: false,
          appointment: ap,
        });

        wx.showToast({
          title: resultData.content,
          icon: 'success',
        })



      }
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

      this.getAppointments();
    }

    console.log("page/index=>onload");
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

/**
 * 下拉刷新
 */
  onPullDownRefresh:function(){
    if (app.globalData.userInfo) {
      //this.getLatestCourse(app.globalData.userInfo.classNumber); 
      //this.getClassmates(); 
      this.getAppointments();
      wx.stopPullDownRefresh();
    };
  },

  onShareAppMessage:function(obj){
    return {
      title:"",
    };

  },

})