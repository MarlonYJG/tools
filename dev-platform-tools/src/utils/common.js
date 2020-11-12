import html2canvas from "html2canvas";
import api from 'api'
import { getCurrMenuId } from "./filters";
// 导出图片
let downloadPNG = idName => {
  let mycanvas = document.getElementById(idName);
  html2canvas(mycanvas, {
    backgroundColor: null // 解决生成的图片有白边
  }).then(canvas => {
    let image = canvas.toDataURL("image/png");
    let $a = document.createElement("a");
    $a.setAttribute("href", image);
    $a.setAttribute("download", "");
    $a.click();
    $a.setAttribute("download", "echarts图片下载");
  });
}
// 通用 导出excel
let exportExcel = (data, url, fileName) => {
  data.downLoad = true
  data.excelName = fileName
  api.downLoadExcel({
    data,
    url
  }).then(res => {
    let blob = new Blob([res.data], {
      type: 'application/vnd.ms-excel'
    });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    // let fileNameHeader = res.headers['content-disposition']
    // let fileName = fileNameHeader.substring(21, fileNameHeader.length);
    a.href = url
    a.download = fileName + '.xlsx'
    a.click()
    window.URL.revokeObjectURL(url) //释放url对象
  }).catch(err => {
    console.log(err)
  })
}
// 获取"?"符后的数据
let getRequest = () => {  
  let url = '?'+location.hash.split('?')[1]; //获取url中"?"符后的字串
  let theRequest = {};  
  if (url.indexOf("?") != -1) {  
     let str = url.substr(1);  
     let strs = str.split("&");  
     for(let i = 0; i < strs.length; i ++) {  
        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
     }  
  }
  return theRequest;  
}
// 交易天网-跳转历史交易回溯
let jumpHistoryAll = async (menu, queryStr, vm) => {
  // gc: 工程建设 zf: 政府采购 td: 土地交易回溯 kyq: 矿业权交易回溯 gycq: 国有产权交易回溯
  let pathAdress, currMenuid;
  switch(menu) {
    case "gc":
      pathAdress = "/discovery/history/jsgcHistoryDetails";
      currMenuid = "gcHistoryRecall";
      break;
    case "zf":
      pathAdress = "/discovery/history/zcHistoryDetails";
      currMenuid = "zcHistoryRecall";
      break;
    default:
      return false;
  }
  await api.getSourceSectionId(queryStr).then(res => {
    if (res.data.code == "0" || res.data.code == "200") {
      let resData = res.data.data;
      let pathInfo = {
        unifiedDealCode: resData
      };
      // 跳到历史交易回溯详情
      let routeData = vm.$router.resolve({
        path: pathAdress,
        query: {
          itemInfo: JSON.stringify(pathInfo),
          // currIndex: getCurrMenuId(currMenuid)
        }
      });
      window.open(routeData.href, "_blank");
    }
  });
}
// 交易天网-跳转一站式名片
let jumpOneStopCardAll = (legalCode, roleCode, vm) => {
  // 01 招标人 02 招标代理 03 投标人，中标人  04 采购人  05 采购代理 06 供应商，中标人 07 08 09 10 11 12 13
  let menuid;
  switch(roleCode){
    case "01":
      menuid = "zbrCard";
      break;
    case "02":
      menuid = "zbdlCard";
      break;
    case "03":
      menuid = "tbrCard";
      break;
    case "04":
      menuid = "cgrCard";
      break;
    case "05":
      menuid = "cgdlCard";
      break;
    case "06":
      menuid = "gysCard";
      break;
    default:
      return false;
  }
  let routeData = vm.$router.resolve({
    path: "/discovery/card/cardDetails",
    query: {
      itemInfo: JSON.stringify(
        {
          legalCode, 
          roleCode
        }
      ),
      // currIndex: getCurrMenuId(menuid)
    }
  });
  window.open(routeData.href, "_blank");
}

// 钻取明细
//drillType：明细类型 rowData:行，columnData：列，tableName：表头数据，vm:this指向
let queryDetails = (drillType, rowData, columnData, tableName, funName, vm) => {
  // 获取表头名字
  // 如果drillType是 总值 则忽略次步骤
  if (!drillType) {
    vm.xTableVal = columnData ? getHeadProp(columnData.property, tableName) : "";
    vm.yTableVal = rowData ? rowData.countName : "";
    vm.xSonTableval = columnData.property;
  } else {
    vm.xTableVal = "";
    vm.yTableVal = "";
    vm.xSonTableval = "";
  }

  vm.isShowDrill = true;
  vm.diaTableLoading = true;
  // 初始化页数
  vm.digPageNum = 1;
  vm.digPageSize = 10;
  vm[funName]();
}
// 获取表头信息
let getHeadProp = (property, tableNames) => {
  for (let i = 0; i < tableNames.length; i++) {
    let tmpVal = tableNames[i];
    if (tmpVal.child && tmpVal.child.length !== 0) {
      if (tmpVal.child[0].prop === property) {
        return tmpVal.label;
      }
    } else if (tmpVal.prop === property) {
      return tmpVal.label;
    }
  }
}

/* 
  单位处理（万元）
  params = {
    val:123123123123123213,
    digits:10000
  }
*/
let formatterMoney = (params = null) => {
  if (params && params.val && params.digits) {
    let value = Number(params.val) / params.digits
    return value;
  }
  return 0
}

export {
  getCityName,
  downloadPNG,
  exportExcel,
  getFirstMenuPath,
  setPageSign,
  getHeadProp,
  getItemName,
  queryDetails,
  rankExportExcel,
  getPlanId,
  getRequest,
  jumpHistoryAll,
  jumpOneStopCardAll,
  formatterMoney
}
