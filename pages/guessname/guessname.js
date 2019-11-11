// pages/guessname/guessname.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classmate:{name:'游道平'},
    answerName: [{ name: '', id: -1 }, { name: '', id: -1 }, { name: '', id: -1 }],
    options: [{ word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '平', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '道', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }, { word: '游', show: true }], 


    showInfoDialog:false,

  },

/**
 * 选择选项
 */
  select:function(e){
    var _t = this;
    var _td = _t.data;
    var id = e.currentTarget.dataset.id;
    var opts = _td.options;
    var opt = opts[id]; 
    if(!opt.show){
      return;
    }

    opt.show = false;
    opts[id] = opt;

    this.setData({ options: opts });

    //赋值给答案框
    var answers = _td.answerName; 
    var isChange = false;
    for(var i=0;i<answers.length;i++){
      var a = answers[i];
      if(a.name==""){
        answers[i] = { name: opt.word,id:id};
        this.setData({ answerName: answers });
        isChange = true;
        break;
      }
    }

    //检查答案
    if (isChange){
      var newA = "";
      for (var i = 0; i < answers.length; i++) {
        newA += answers[i].name;
      }
      if(newA == _td.classmate.name){
        console.log(newA);
        this.setData({
          showInfoDialog: true
        })
      }
    }
  },
 
  closeDialog: function () {
    this.setData({ 
      showInfoDialog: false
    })
  },

  /**
   * 取消选择
   */
  unSelect:function(e){
    var _t = this;
    var _td = _t.data;
    var id = e.currentTarget.dataset.id;

    var answers = _td.answerName;
    var oldAnswer = answers[id];
    if(oldAnswer.name==""){
      return;
    }

    var optid = oldAnswer.id;
    var opts = _td.options;
    var opt = opts[optid];
    opt.show = true;
    opts[optid] = opt;

    oldAnswer = { name: '', id: -1 };
    answers[id] = oldAnswer;

    this.setData({ options: opts, answerName: answers}); 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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