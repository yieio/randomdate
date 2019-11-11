const formatTime = date => {
   //2019-09-30T09:00:00 要输出 09:00
   var infos = date.split('T');
   if(infos.length>1){
     return infos[1].substring(0, 5);
   }else{
     return date;
   }
}
 
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//格式化日期间隔
const formatDayGap = n  =>{ 
  if (n > 9) {
    return '';
  } else {
    var dayArr = ["今天", "明天", "后天", "三天后", "四天后", "五天后", "六天后", "七天后", "八天后", "九天后", "十天后"];
    return dayArr[n];
  } 
}

const getDateGap = date => {
  var start = new Date();

  const year = start.getFullYear()
  const month = start.getMonth() + 1
  const day = start.getDate()

  start = new Date([year, month, day].map(formatNumber).join('/')+" 00:00:00");

  var days = (date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);
  return parseInt(days);
}

//格式星期
const formatWeekDay = date=>{
  var weekday = new Array(7)
  weekday[0] = "星期日"
  weekday[1] = "星期一"
  weekday[2] = "星期二"
  weekday[3] = "星期三"
  weekday[4] = "星期四"
  weekday[5] = "星期五"
  weekday[6] = "星期六"
  return weekday[date.getDay()]; 
}

module.exports = {
  formatTime: formatTime,
  getDateGap: getDateGap,
  formatWeekDay: formatWeekDay,
  formatDate: formatDate,
  formatDayGap: formatDayGap
}