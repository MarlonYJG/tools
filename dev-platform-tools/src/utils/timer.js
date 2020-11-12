/*
 * @Author: liyajun 
 * @Date: 2019-11-14 15:17:08 
 * @Last Modified by: liyajun
 * @Last Modified time: 2019-11-27 10:17:41
 */
import moment from 'moment' //导入文件
//时间段转化---开始-->结束日期
const timeTypeChange = (date, type, dateType = 'YYYY-MM-DD') => {
  if (type == 'year') {
    let startTime = moment(date).startOf('year').format(dateType)
    let endTime = moment(date).endOf('year').format(dateType)
    return {
      startTime,
      endTime
    }
  } else if (type == 'quarter') {
    let currentQuarter = parseFloat(date.charAt(date.length - 1));
    let currentYear = moment(new Date(date.substr(0, 4))) // 当前年
    let startDate = moment(currentYear).startOf('year').format(dateType);
    let startTime = moment(startDate).quarter(currentQuarter).format(dateType)
    let endTime = moment(startTime).endOf('quarter').format(dateType);
    return {
      startTime,
      endTime
    }
  } else if (type == 'month') {
    let startTime = moment(date).startOf('month').format(dateType);
    let endTime = moment(date).endOf('month').format(dateType);
    return {
      startTime,
      endTime
    }
  }
}
//去年开始时间-->现在NOW
const timeGap = (dateType = 'YYYY-MM-DD') => {
  let startYear = moment().startOf('year').format(dateType)
  let startTime = moment(startYear).subtract(1, 'y').format(dateType);
  let endTime = moment().format(dateType)
  return [startTime, endTime]
}
// 获取当天开始结束时间
const getCurrDays = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().startOf('day').format(dateType);
  let endTime = moment().endOf('day').format(dateType);
  return [startTime, endTime]
}

// 获取昨天的开始结束时间
const getYesterday = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().subtract('days', 1).startOf('day').format(dateType);
  let endTime = moment().subtract('days', 1).endOf('day').format(dateType);
  return [startTime, endTime]
}
// 获取明天的开始结束时间
const getTomorrow = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().add('days', 1).startOf('day').format(dateType);
  let endTime = moment().add('days', 1).endOf('day').format(dateType);
  return [startTime, endTime]
}
// 获取最近七天的开始结束时间
const getLast7Days = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  // 包含当天
  // moment().subtract('days',6).format(dateType)
  // moment().format(dateType)
  // 不包含当天
  let startTime = moment().subtract('days', 7).startOf('day').format(dateType)
  let endTime = moment().subtract('days', 1).endOf('day').format(dateType)
  return [startTime, endTime]
}
// 获取最近30天的开始结束时间
const getLast30Days = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().subtract('days', 30).startOf('day').format(dateType);
  let endTime = moment().subtract('days', 1).endOf('day').format(dateType);
  return [startTime, endTime]
}
// 获取当前周的开始结束时间，周日到周六
const getCurrWeekDays = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().startOf('week').format(dateType)
  let endTime = moment().endOf('week').format(dateType)
  return [startTime, endTime]
}
// 获取上一周的开始结束时间，周日到周六
const getLastWeekDays = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().week(moment().week() - 1).startOf('week').format(dateType)
  let endTime = moment().week(moment().week() - 1).endOf('week').format(dateType)
  return [startTime, endTime]
}
// 获取下一周的开始结束时间，周日到周六
const getNextWeekDays = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().week(moment().week() + 1).startOf('week').format(dateType)
  let endTime = moment().week(moment().week() + 1).endOf('week').format(dateType)
  return [startTime, endTime]
}
// 获取当前月的开始结束时间
const getCurrMonthDays = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().startOf('month').format(dateType)
  let endTime = moment().endOf('month').format(dateType)
  return [startTime, endTime]
}
// 获取上一月的开始结束时间
const getLastMonthDays = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().month(moment().month() - 1).startOf('month').format(dateType)
  let endTime = moment().month(moment().month() - 1).endOf('month').format(dateType)
  return [startTime, endTime]
}
// 当前季度
const getCurrQuarter = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().startOf('quarter').format(dateType)
  let endTime = moment().endOf('quarter').format(dateType)
  return [startTime, endTime]
}
// 上个季度
const getLastQuarter = (dateType = 'YYYY-MM-DD') => {
  //精确时分秒 'YYYY-MM-DD HH:mm:ss'
  let startTime = moment().quarter(moment().quarter() - 1).startOf('quarter').format(dateType)
  let endTime = moment().quarter(moment().quarter() - 1).endOf('quarter').format(dateType)
  return [startTime, endTime]
}
export {
  timeTypeChange, //开始-->结束日期
  timeGap, //去年开始时间-->现在NOW
  getCurrDays, // 获取当天开始结束时间
  getYesterday, // 获取昨天的开始结束时间
  getTomorrow, // 获取明天的开始结束时间
  getLast7Days, // 获取最近七天的开始结束时间
  getLast30Days, // 获取最近30天的开始结束时间
  getCurrWeekDays, // 获取当前周的开始结束时间，周日到周六
  getLastWeekDays, // 获取上一周的开始结束时间，周日到周六
  getNextWeekDays, // 获取下一周的开始结束时间，周日到周六
  getCurrMonthDays, // 获取当前月的开始结束时间
  getLastMonthDays, // 获取上一月的开始结束时间
  getCurrQuarter, // 当前季度
  getLastQuarter, // 上个季度
}
