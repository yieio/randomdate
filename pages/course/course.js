// pages/course/course.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses:[]
  },

  /**
   * 获取学期课程表
   */
  getClassCourse:function(classNumber,schoolTerm){
    var _t = this;
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

          for (var i = 0; i < cs.length; i++) { 
            var item = cs[i];
            
            var start = util.formatTime(item.startTime);
            var end = util.formatTime(item.endTime);
            cs[i].timeGap = start + "-" + end;

            if(item.courseDate != lastDate){
              courses.push(courseDate);
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

          _t.setData({
            courses: courses 
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
  onShareAppMessage: function () {

  }
})