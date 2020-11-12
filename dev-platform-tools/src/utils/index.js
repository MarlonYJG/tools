/*
 * @Author: Marlon
 * @Date: 2020-03-05 11:30:58
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-09-28 11:10:04
 * @Description: 通用工具
 */
import { Message } from "element-gui";
import API from "api";
var moment = require('moment');
import { globalLoading } from './res-format'



/* ============================= 系统级公共 ============================== */
/**
 * @name: breadcrumbList
 * @param {type} 
 * @return: 
 * @description: 面包屑处理
 */
export const breadcrumbList = route => {
  let breadcrumbList = [];
  if (route.matched && route.matched.length) {
    route.matched.forEach(item => {
      if (item.meta && item.meta.title) {
        breadcrumbList.push({
          title: item.meta.title,
          path: item.path
        });
      } else {
        breadcrumbList.push({
          title: item.name || "",
          path: item.path
        });
      }
    });
  }
  return breadcrumbList;
};


/* ============================= 通用 ============================== */
/**
 * @name: isRealNum
 * @param {type} 
 * @return: 
 * @description: 数值类型验证
 */
export const isRealNum = val => {
  if (val === "" || val == null) {
    return false;
  }
  if (!isNaN(val)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @name: checkip
 * @param {type} 
 * @return: 
 * @description: ip格式验证
 */
export const checkip = ip => {
  var pcount = 0;
  var ip_length = ip && ip.length;
  var ip_letters = "1234567890.";
  for (let p = 0; p < ip_length; p++) {
    var ip_char = ip.charAt(p);
    if (ip_letters.indexOf(ip_char) == -1) {
      return false;
    }
  }
  for (var u = 0; u < ip_length; u++) {
    ip.substr(u, 1) == "." ? pcount++ : pcount;
  }
  if (pcount != 3) {
    return false;
  }
  let firstp = ip.indexOf(".");
  let lastp = ip.lastIndexOf(".");
  let str1 = ip.substring(0, firstp);
  let ipstr_tmp = ip.substring(0, lastp);
  let secondp = ipstr_tmp.lastIndexOf(".");
  let str2 = ipstr_tmp.substring(firstp + 1, secondp);
  let str3 = ipstr_tmp.substring(secondp + 1, lastp);
  let str4 = ip.substring(lastp + 1, ip_length);
  if (str1 == "" || str2 == "" || str3 == "" || str4 == "") {
    return false;
  }
  if (
    str1.length > 3 ||
    str2.length > 3 ||
    str3.length > 3 ||
    str4.length > 3
  ) {
    return false;
  }
  if (str1 <= 0 || str1 > 255) {
    return false;
  } else if (str2 < 0 || str2 > 255) {
    return false;
  } else if (str3 < 0 || str3 > 255) {
    return false;
  } else if (str4 < 0 || str4 > 255) {
    return false;
  }
  return true;
};

/**
 * @name: isPositiveInt
 * @param {type} 
 * @return: 
 * @description: 正整数验证
 */
export const isPositiveInt = val => {
  if (val == "") {
    return false;
  }
  if (!/(^[1-9]\d*$)/.test(val)) {
    return false;
  } else {
    return true;
  }
};

/**
 * @name: chnName
 * @param {type} 
 * @return: 
 * @description: 中文验证
 */
export const chnName = (val) => {
  const reg = /^[\u4e00-\u9fa5]+$/g;
  return reg.test(val);
};

/**
 * @name: enName
 * @param {type} 
 * @return: 
 * @description: 英文字母验证
 */
export const enName = (val) => {
  const reg = /^[a-zA-Z]+$/g; // 验证没有空格的英文名
  // const reg = /^[a-zA-Z][A-Za-z\s]*[a-zA-Z]*$/ 验证有空格的英文名
  return reg.test(val);
};

/**
 * @name: underlineName
 * @param {type} 
 * @return: 
 * @description: 英文字母下划线组合
 */
export const underlineName = (val) => {
  const reg = /^(?=.*[a-zA-Z]+.*)(?=.*_.*)([\da-zA-Z_])+$/;
  return reg.test(val);
}

/**
 * @name: __ExportExcel
 * @param {type} 
 * @return: 
 * @description: 导出Excel：方式1(post)
 */
export const __ExportExcel = ({ url, fileName = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'), params, cfg = null }) => {
  let params_ = {
    downLoad: true,
    excelName: fileName
  }
  let text_ = null;
  if (params) {
    params_ = {
      ...params_,
      ...params
    }
  }
  if (cfg) {
    const { text = null } = cfg
    text_ = text
  }
  const GlobalLoading = globalLoading({ text: text_ });
  API.__publicDownLoadExcel({
    params: params_,
    url
  })
    .then(res => {
      setTimeout(() => {
        GlobalLoading.close();
        let blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        // let fileNameHeader = res.headers['content-disposition']
        // let fileName = fileNameHeader.substring(21, fileNameHeader.length);
        a.href = url;
        a.download = fileName + ".xlsx";
        a.click();
        window.URL.revokeObjectURL(url); //释放url对象
      }, 1000);
    })
    .catch(err => {
      GlobalLoading.close();
      console.error(err);
    });
};
/**
 * @name: _ExportExcel
 * @param {type} 
 * @return: 
 * @description: 导出Excel:方式2(get)
 */
export const _ExportExcel = (url, cfg, isParams) => {
  let text_ = null
  if (cfg) {
    const { text } = cfg
    text_ = text
  }
  let url_ = url
  let params_ = ''
  if (isParams && Object.keys(isParams).length) {
    for (const key in isParams) {
      if (isParams.hasOwnProperty(key)) {
        params_ += `${key}=${isParams[key]}&`
      }
    }
    url_ = url + '?' + params_.substring(0, params_.lastIndexOf('&'))
  }
  const GlobalLoading = globalLoading({ text: text_ });
  let downloadElement = document.createElement("a");
  downloadElement.href = url_;

  setTimeout(() => {
    GlobalLoading.close();
    downloadElement.click();
  }, 1000);
};
/**
 * @name: 
 * @param {type} 
 * @return: 
 * @description: 新版-导出Excel-get
 */
export const _DownLoadExcelGet = ({ url, data, cfg, code = 0 }) => {
  let text_ = null
  if (cfg) {
    const { text } = cfg
    text_ = text
  }

  const GlobalLoading = globalLoading({ text: text_ });
  API.__publicDownLoadExcelGet({ url, data }).then(res => {
    console.log(res)
    const { config: { params = {}, url } } = res
    if (200 === res.status) {
      let params_ = ''
      let url_ = ''
      if (params && Object.keys(params).length) {
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            params_ += `${key}=${params[key]}&`
          }
        }
        url_ = url + '?' + params_.substring(0, params_.lastIndexOf('&'))
      }
      setTimeout(() => {
        GlobalLoading.close();
        location.href = url_
      }, 1000);
    }
  }).catch(err => {
    Message({
      showClose: true,
      message: '下载失败',
      type: "error"
    });
    console.error(err);
  })
};
/**
 * @name: formatGetArr
 * @param {type} 
 * @return: 
 * @description: 转换数组
 */
export const formatGetArr = (data, name1, name2) => {
  let newArr = [];
  if (Array.isArray(data) && data.length) {
    data.forEach(item => {
      if (
        item.hasOwnProperty(name1) &&
        item.hasOwnProperty(name2)
      ) {
        newArr.push({
          value: item[name1],
          label: item[name2]
        });
      }
    });
  }
  return newArr;
};

/* ============================= 业务处理 ============================== */
/**
 * @name: projectIdDbIdTableId
 * @param {type} 
 * @return: 
 * @description: 项目-数据库-数据表 反解析
 */
export const projectIdDbIdTableId = (sourceArr, valArr) => {
  let obj = {};
  if (sourceArr.length) {
    sourceArr.forEach(ele => {
      if (ele.value === valArr[0]) {
        obj["projectId"] = ele.projectId;
      }
      if (ele.children && ele.children.length) {
        ele.children.forEach(el => {
          if (el.value === valArr[1]) {
            obj["dbId"] = el.dbId;
          }
          if (el.children && el.children.length) {
            el.children.forEach(e => {
              if (e.value === valArr[2]) {
                obj["tableId"] = e.tableId;
              }
            });
          }
        });
      }
    });
  }
  return obj;
};

/**
 * @name: projectTaskVersion
 * @param {type} 
 * @return: 
 * @description: 项目-任务-版本 级联(初始化数据)
 */
export const projectTaskVersion = (sourceArr, pid) => {
  if (sourceArr && sourceArr.length) {
    sourceArr.forEach(item => {
      if (pid || pid === 0) {
        item["value"] = item.id + "-" + pid;
      } else {
        item["value"] = item.id + "";
      }

      if (item.children && item.children.length) {
        projectTaskVersion(item.children, item.value);
      }
    });
  }
  return sourceArr;
};

/**
 * @name: projectTaskVersionParsing
 * @param {type} 
 * @return: 
 * @description: 项目-任务-版本 级联(解析)
 */
export const projectTaskVersionParsing = ({
  sourceArr,
  ptvArr,
  index = 0,
  key,
  valKey,
  valArr = []
}) => {
  let i = ptvArr.length - 1;
  if (index <= i) {
    if (sourceArr && sourceArr.length) {
      sourceArr.forEach(item => {
        if (item[key] === ptvArr[index]) {
          valArr.push(item[valKey]);
        }
        if (item.children && item.children.length) {
          projectTaskVersionParsing({
            sourceArr: item.children,
            ptvArr,
            index: index + 1,
            key,
            valKey,
            valArr
          });
        }
      });
    }
  }
  return valArr;
};

/**
 * @name: dataRuleFormate
 * @param {type} 
 * @return: 
 * @description:  数据规则处理
 *     type 0新增，1编辑
 */
export const dataRuleFormate = async ({ type = 0, data, id, formData }) => {
  let ruleValue = {};
  let curSelectItem = {};
  if (type === 1) {
    ruleValue = JSON.parse(formData.ruleValue);
  }
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.paraType == 2) {
      //字典
      if (item.displayMode == 1 || item.displayMode == 6) {
        //单选 下拉选
        if (type === 0) {
          //添加
          item.value = item.value || "";
        } else {
          //编辑
          item.value =
            (ruleValue[item.prop] && ruleValue[item.prop].code) || "";
        }
      } else if (item.displayMode == 2) {
        //多选
        if (type === 0) {
          //添加
          item.value = item.value ? item.value.split(",") : [];
        } else {
          //编辑
          let arr = [];
          for (let j = 0; j < ruleValue[item.prop].length; j++) {
            arr.push(ruleValue[item.prop][j].code);
          }
          item.value = arr;
        }
      }
      let obj = JSON.parse(item.paraRange);
      let temp = [];
      for (const key in obj) {
        temp.push({
          name: obj[key],
          code: key,
        });
      }
      item.range = temp;
    } else if (item.paraType == 4) {
      //url
      if (/\$$/.test(item.paraRange)) {
        item.urlPath = item.paraRange.split("?")[0];
        item.urlParam = item.paraRange
          .split("?")[1]
          .split("$")[0]
          .split("=")[0];
        item.paramsType = item.paraRange.split("?")[1].split("$")[1];
        item.range = [];
        //$参数单选 下拉选
        if (type === 0) {
          //添加
          item.value = item.value || "";
        } else {
          //编辑
          item.value =
            (ruleValue[item.prop] && ruleValue[item.prop].code) || "";
        }
      } else {
        item.urlPath = item.paraRange.split("?")[0];
        item.urlParam = item.paraRange.split("?")[1].split("=")[0];
        item.paramsType = item.paraRange.split("?")[2];
        if (item.displayMode == 6) {
          let res = await API.useUrlGetData(item.urlPath, {
            [item.urlParam]: id
          });
          item.range = res.data.data;
          curSelectItem = item;
          //？参数单选 下拉选
          if (type === 0) {
            //新增获取当前行数据集id
            console.log("formData.id", formData);
            item.value = (!formData.ruleId && formData.id) || "";
          } else {
            //编辑
            item.value =
              (ruleValue[item.prop] && ruleValue[item.prop].code) || "";
          }
        }
      }
      // 渲染结构
      if (item.displayMode == 4) {
        if (item.value && item.value.indexOf(',') !== -1) {
          item.value = item.value.split(",");
        } else {
          item.value = ''
        }
      }
    } else {
      //文本，文本域，新增null->""，编辑获取默认值
      if (type === 0) {
        item.value = item.value || "";
      } else {
        item.value = ruleValue[item.prop] || "";
      }
    }
    arr.push(item);
  }
  return { item: curSelectItem, data: arr };
};
