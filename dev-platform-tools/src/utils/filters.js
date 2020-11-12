/*
 * @Author: Marlon
 * @Date: 2020-08-24 16:30:17
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-18 13:47:55
 * @Description: 标准产品-专用
 */
// 金额格式处理
let MoneyFormat = value => {
    if (value) {
      value = value / 10000;
      return Number(value).toFixed(4);
    } else {
      return value;
    }
}



// 中国标椎时间转化
let parseTime = value => {
  let year = value.getFullYear();
  // 不足十位补零
  let month = (value.getMonth() + 1) < 10 ? '0'+(value.getMonth()+1) : value.getMonth()+1;
  let date =  value.getDate() < 10 ? '0'+(value.getDate()) : value.getDate();
  const newDate = year + '-' + month + '-' + date;
  return newDate;
}



// 获取 去年整年时间
let prevYear = (type,timeFormar)=> {
   //获取当前时间  
   let currentDate= new Date();  
   //获得当前年份4位年  
   let currentYear=currentDate.getFullYear();  
   if (type === 'year') { // 年
    let prevYear = currentYear;
    return prevYear;
   } else if (type === 'quarter') { // 年和季度
     let startStopTime = new Array();
     let firstQuarter = "";
     let fourQuarter = "";
     let currQuarterTime = currentYear;
     if(timeFormar === "yyyy-q") {
      firstQuarter = currQuarterTime + '-1';
      fourQuarter = currQuarterTime + '-4';
     }else {
      firstQuarter = currQuarterTime + '年第1季度';
      fourQuarter = currQuarterTime + '年第4季度';
     }
     startStopTime.push(firstQuarter); 
     startStopTime.push(fourQuarter);
     return startStopTime;
   } else if(type === 'singleTime') { // 单个时间段
    let startStopTime = parseTime(currentDate);
    return startStopTime;  
   } else if(type === 'week') {
      var today = new Date();
      var firstDay = new Date(today.getFullYear(),0, 1);
      var dayOfWeek = firstDay.getDay(); 
      var spendDay= 1;
      if (dayOfWeek !=0) {
        spendDay=7-dayOfWeek+1;
      }
      firstDay = new Date(today.getFullYear(),0, 1+spendDay);
      var d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);
      var result =Math.ceil(d/7);
      return result+1;
   } else { // 多个时间段(去年--今年)
    let startStopTime = new Array();
    // let priorYearFirstDay = new Date(currentYear,0,1);  

    // startStopTime.push(parseTime(priorYearFirstDay));  
    // startStopTime.push(parseTime(currentDate));
    let lastYear = parseInt(currentYear -1);
    startStopTime = [`${lastYear}-01-01`, `${lastYear}-12-31`]
    return startStopTime;
   }
   
}

// 转化大写数字
let formatNum = data=>{
  let resultNum = 0;
  switch(data) {
    case '一':
      resultNum = 1;
      break;
    case '二':
      resultNum = 2;
      break;
    case '三':
      resultNum = 3;
      break;
    case '四':
      resultNum = 4;
      break;
  }
  return resultNum;
}

// 时间转化
let formatTime = (data,timeName,dateType) => {
  let year,month,week='';
  for(let i=0; i<data.length; i++) {
    let tmpData = data[i];
    if(tmpData[timeName] !== '平均值') {
      switch(dateType){
        case 'quarter':
          year = tmpData[timeName].split("年")[0];
          let _quarter = tmpData[timeName].split("第")[1].split("季度")[0];
          _quarter = formatNum(_quarter);
          tmpData[timeName] = year+'年'+_quarter+'季度';
          break;
        case 'month':
          year = tmpData[timeName].split("年")[0];
          month = tmpData[timeName].split("年")[1].split("月")[0]< 10 ? ('0' + tmpData[timeName].split("年")[1].split("月")[0]) : tmpData[timeName].split("年")[1].split("月")[0];
          tmpData[timeName] = year+'年'+month+'月';
          break;
        case 'week':
          year = tmpData[timeName].split("年")[0];
          week = tmpData[timeName].split("第")[1].split("周")[0]< 10 ? ('0' + tmpData[timeName].split("第")[1].split("周")[0]) : tmpData[timeName].split("第")[1].split("周")[0];
          tmpData[timeName] = year+'年'+week+'周';
          break;
      }
    }
  }
  return data;
}

// 获取侧边栏的点击位置
let getCurrMenuId = pathName => {
  // let getAllMenu =JSON.parse(localStorage.getItem('getAllMenuId'));
  // let tmpArr,lastArr = [];
  // for(let i =0; i<getAllMenu.length; i++) {
  //   if(getAllMenu[i].name.indexOf('/') !== -1) {
  //     tmpArr = getAllMenu[i].name.split('/');
  //     lastArr = tmpArr.pop();// 获取路径最后一个参数
  //   }else {
  //     lastArr = getAllMenu[i].name;// 获取路径最后一个参数
  //   }
  //   // 获取数组中 与传入参数相对应的 id值 来记录侧边栏点击位置
  //   if(lastArr === pathName) {
  //     // 通过id的配置规则，获取要跳转链接的一级导航位置
  //     let pathId = getAllMenu[i].id+"";
  //     pathId = pathId.split('')
  //     let pathIndex = pathId.splice(-7,1);
  //     localStorage.setItem("onePathIndex",pathIndex[0]-1)
  //     return getAllMenu[i].id;
  //   }
  // }
  return ''
  
}
// 分析维度数据格式化 isAll 数据前面是否加‘全部’
let formatAnalysis = (data, isAll) => {
  let temArr = [];
  for (let i = 0; i < data.length; i++) {
    let obj = {};
    if(data[i]) {
      obj.value = data[i].analysisCode;
      obj.label = data[i].analysisName;
    }
    if(isAll) {
      temArr.unshift({ label: "全部", value: "All" });
    }
    temArr.push(obj);
  }
  return temArr
}
// 根据大屏传的年份获取整年时间
let getYearData = ()=> {
  let year = localStorage.getItem('selectTime');
  let startStopTime = [];
  let currentYearFirstDay = new Date(year,0,1);
  let currentYearEndDay = new Date(year,11,31);
  startStopTime.push(parseTime(currentYearFirstDay));
  startStopTime.push(parseTime(currentYearEndDay));
  return startStopTime;
}
export {
  MoneyFormat,
  getCurrMenuId,
  prevYear,
  formatTime,
  formatAnalysis,
  getYearData 
}
