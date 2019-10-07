// pages/course/course.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses:[],
    scrollViewHeight:0,
    scrollToViewId:"date5",
    currentCourseDate:""
  },

  /**
   * 获取学期课程表
   */
  getClassCourse:function(classNumber,schoolTerm){
    var _t = this;
    var _td = _t.data;
    wx.request({
      url: app.api.classCourse + "?classNumber=" + classNumber+"&schoolTerm="+schoolTerm,
      method: "GET",
      dataType: "json",
      success: function (result) {
        console.log(app.api.classCourse + "?classNumber=" + classNumber + "&schoolTerm=" + schoolTerm + "=>");
        console.log(result);
        if (result.data.type == 200) {
          var cs = result.data.data.courses;
          

          if (cs.length <= 0) {
            return;
          }

          var courses = [];
          var lastDate = "";
          var courseDate = {};
          var currentViewId = "";

          for (var i = 0,j=0; i < cs.length; i++) { 
            var item = cs[i];
            
            var start = util.formatTime(item.startTime);
            var end = util.formatTime(item.endTime);
            cs[i].timeGap = start + "-" + end;

            if (item.courseDate != lastDate){
              if (courseDate.date){
                courses.push(courseDate);
                if (courseDate.date == _td.currentCourseDate) {
                  currentViewId = "date"+j; 
                }  
                j++;
              }
              lastDate = item.courseDate;
              var date = new Date(item.courseDate);
              courseDate = {
                date: util.formatDate(date),
                gap : util.formatDayGap(util.getDateGap(date)),
                week: util.formatWeekDay(date),
                color:item.nameEnSimple,
                courseItems:[] 
              }; 
            };
            courseDate.courseItems.push(cs[i]); 
          };

          //背景颜色加个简拼音控制下 
          courses.push(courseDate);
          console.log(courses);

          _t.setData({
            courses: courses
          });

          _t.setData({
            scrollToViewId: currentViewId
          });

        } else {
          _t.setData({
            courses: null 
          })
        }

      }
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    console.log("page/course=>onload");
    var _t = this;

    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
      success: function (res) {
        _t.setData({
          scrollViewHeight: res.windowHeight
        });
      }
    });

    _t.setData({
      currentCourseDate:options.courseDate
    });

    this.getClassCourse(options.classNumber,options.schoolTerm); 
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
  onShareAppMessage: function (obj) {
    return {
      title: "课程表",
    };
  }
})