/*
 * @Author: yangjianguo
 * @Date: 2019-08-20 14:07:35
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-15 16:39:26
 * @Description: 公共处理函数
 */
import * as CryptoJS from 'crypto-js'

/**
 *加密处理
 */
export const encryption = (params) => {
  let {
    data,
    type,
    param,
    key
  } = params
  const result = JSON.parse(JSON.stringify(data));
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      var data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      var iv = key
      // 加密
      var encrypted = CryptoJS.AES.encrypt(
        data,
        key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        })
      result[ele] = encrypted.toString()
    })
  }
  return result
}
/* 
  单位处理（万元）
  params = {
    val:123123123123123213,
    digits:10000
  }
*/
export function formatterMoney(params = null) {
  if (params && params.val && params.digits) {
    let value = Number(params.val) / params.digits
    return value;
  }
  return 0
}
/**
 * 防抖处理
 */
export function debounce(fn, delay) {
  let timeout = '';
  return (v) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(v);
    }, delay);
  }
};
/**
 * e-charts加载loading
 */
export function echartsLoading(that, elementId) {
  let myCharts = that.$echarts.init(document.getElementById(elementId))
  myCharts.showLoading();
};
/**
 * 获取url后面的参数
 */
export function GetRequest() {
  var url = location.hash;
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(url.indexOf("?") + 1);
    let strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
/**
 * 时间戳转换
 */
export function transformTime(timestamp = +new Date()) {
  if (timestamp) {
    var time = new Date(timestamp);
    var y = time.getFullYear(); //getFullYear方法以四位数字返回年份
    var M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
    var d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
    var h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
    var m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
    var s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
    return y + '-' + M + '-' + d + ' ';
  } else {
    return '';
  }
}
/*
 *@functionName:一站式名片，历史交易回溯跳转 
 */
export function jumpPaths(rowData, columnData, jumpData, vm) {

  // let data = {
  //   history:{
  //      path: ,
  //   },
  //   Detail:{
  //     path:,
  //     code:
  //   },
  // }
  let currSider = localStorage.getItem("currSider");
  
  if (jumpData.hasOwnProperty('history')) {
    // 跳到历史交易回溯详情
    let pathInfo = {
      'unifiedDealCode': rowData.id,
      'type': rowData.srtype
    }
    let routeData = vm.$router.resolve({
      path: jumpData.history.path,
      query: {
        'itemInfo': JSON.stringify(pathInfo),
        'currIndex': currSider
      }
    });
    window.open(routeData.href, '_blank');
  } else {
    // 跳到一站式名片详情
    let pathInfo = {
      id: rowData.id,
      legalCode: jumpData.detail.code,
      roleCode: jumpData.detail.role
    };
    let routeData = vm.$router.resolve({
      path: jumpData.detail.path,
      query: {
        itemInfo: JSON.stringify(pathInfo),
        currIndex: currSider
      }
    });
    window.open(routeData.href, "_blank");
  }
}
/* 网超——一站式名片，历史交易回溯跳转  */
export function jumpPaths_(rowData, columnData, jumpData, vm) {
  let currSider = localStorage.getItem("currSider");
  
  if (jumpData.hasOwnProperty('history')) {
    // 跳到历史交易回溯详情
    let routeData = vm.$router.resolve({
      path: jumpData.history.path,
      query: {
        'itemInfo': JSON.stringify(jumpData.history.query),
        'currIndex': currSider
      }
    });
    window.open(routeData.href, '_blank');
  } else {
    // 跳到一站式名片详情
    let pathInfo = {
      id: rowData.id,
      legalCode: jumpData.detail.code,
      roleCode: jumpData.detail.role
    };
    let routeData = vm.$router.resolve({
      path: jumpData.detail.path,
      query: {
        itemInfo: JSON.stringify(pathInfo),
        currIndex: currSider
      }
    });
    window.open(routeData.href, "_blank");
  }
}
/*
 *@functionName:提示确认  
 */
export function confirm(vm, configData) {
  let param = {
    title: '',
    prop: '提示',
    define: '确定',
    close: '取消',
    type: 'warning',
    errText: '',
    callback() {}
  }
  param = Object.assign(param, configData)
  vm.$confirm(param.title, param.prop, {
      confirmButtonText: param.define,
      cancelButtonText: param.close,
      type: param.type
    })
    .then(() => {
      param.callback()
    })
    .catch(() => {
      vm.$message({
        type: 'info',
        message: param.errText
      })
    })
}
