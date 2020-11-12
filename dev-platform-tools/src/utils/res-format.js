/*
 * @Author: Marlon
 * @Date: 2020-02-21 11:40:57
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-06 19:40:37
 * @Description: 响应解析
 */
import { Message } from "element-gui";

/**
 * @name: ResDatas
 * @param {type} 
 * @return: 
 * @description: 响应处理类
 */
class ResDatas {
    constructor({ res = null, code = 200, msg = null, error = null,
        fieldKey = {
            data: 'data',
            title: 'title',
            total: 'total',
            pageSize: 'pageSize'
        },
    }, load = null, vm = null) {
        this.res = res;
        this.code = code;
        this.vm = vm;
        this.load = load;
        this.msg = msg;
        this.error = error;
        this.serverError = '服务异常';
        this.fieldKey = fieldKey;

    }
    init() {
        if (this.vm && this.load) {
            this.vm[this.load] = false;
        }
        try {
            if (this.res && this.res.data && Number(this.res.data.code) === Number(this.code)) {
                let resData = this.res.data.data;
                if (!!resData) {
                    return resData;
                } else {
                    console.error('暂无数据(缺少data字段)');
                    return null
                }
            } else {
                Message({
                    showClose: true,
                    message: this.error || this.res.data.message,
                    type: "error"
                });
                return null
            }
        } catch (error) {
            Message({
                showClose: true,
                message: this.serverError,
                type: "error"
            });
            console.error(error, '服务异常——响应解析类')
            return null
        }
    }
    // 状态(增/删/改) 格式化
    state() {
        try {
            if (this.res && this.res.data && Number(this.res.data.code) === Number(this.code)) {
                if (this.msg) {
                    Message({
                        showClose: true,
                        message: this.msg,
                        type: "success"
                    });
                } else {
                    Message({
                        showClose: true,
                        message: this.res.data.message || '',
                        type: "success"
                    });
                }
            } else {
                if (this.error) {
                    Message({
                        showClose: true,
                        message: this.error,
                        type: "error"
                    });
                } else {
                    Message({
                        showClose: true,
                        message: this.res.data.message || '',
                        type: "error"
                    });
                }
            }
        } catch (error) {
            if (this.error) {
                Message({
                    showClose: true,
                    message: this.serverError,
                    type: "error"
                });
            } else {
                Message({
                    showClose: true,
                    message: this.res.data.message || '',
                    type: "error"
                });
            }

            console.error(error, '服务异常——响应解析类')
        }
    }
    // table 格式化
    formatData() {
        let formatDatas = {};
        for (const key in this.fieldKey) {
            if (this.fieldKey.hasOwnProperty(key)) {
                if (this.fieldKey[key]) {
                    let resData = this.res.data.data;
                    if (resData && JSON.stringify(resData) !== "{}") {
                        if (!Array.isArray(resData)) {
                            for (const reskey in resData) {
                                if (resData.hasOwnProperty(reskey)) {
                                    if (this.fieldKey[key] === reskey) {
                                        formatDatas[key] = resData[reskey];
                                    }
                                }
                            }
                        } else {
                            console.error("数据类型错误(对象结构)—响应解析类");
                        }
                    }
                }
            }
        }
        return formatDatas
    }
    // 级联菜单 格式化
    formatCascader(arr) {
        let _this = this;
        let formatArr = [];
        function loop(arrData, formatArr) {
            if (arrData && arrData.length) {
                arrData.forEach(item => {
                    item['label'] = item[_this.fieldKey.label]
                    item['value'] = item[_this.fieldKey.value]
                    if (item[_this.fieldKey.children] && item[_this.fieldKey.children].length) {
                        item['children'] = [];
                        loop(item[_this.fieldKey.children], item['children'])
                    }
                    formatArr.push({
                        ...item
                    })
                });
            }
        }
        loop(arr, formatArr)
        return formatArr
    }
}

/**
 * @name: projectDbTable
 * @param {type} 
 * @return: 
 * @description: 项目-数据库-表 解析
 */
const projectDbTable = function (arr, obj) {
    let objKey = [];
    let returnArr = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            objKey.push(key)
        }
    }
    if (arr && arr.length) {
        arr.forEach(item => {
            if (item[objKey[0]] === obj[objKey[0]]) {
                returnArr.push(item.value)
            }
            if (item.children && item.children.length) {
                item.children.forEach(ite => {
                    if (ite[objKey[1]] === obj[objKey[1]]) {
                        returnArr.push(ite.value)
                    }
                    if (ite.children && ite.children.length) {
                        ite.children.forEach(it => {
                            if (it[objKey[2]] === obj[objKey[2]]) {
                                returnArr.push(it.value)
                            }
                        });
                    }
                });
            }
        });
    }
    return returnArr
}

/**
 * @name: reqFormatDic
 * @param {type} 
 * @return: 请求参数处理
 * @description: 如果对应字段为空，则删除对应字段
 */
const reqFormatDic = function (reqObj) {
    if (reqObj && JSON.stringify(reqObj) !== "{}") {
        if (!Array.isArray(reqObj)) {
            for (const key in reqObj) {
                if (reqObj.hasOwnProperty(key)) {
                    if (reqObj[key] === '' || reqObj[key] === 'undefined' || reqObj[key] === null) {
                        delete reqObj[key]
                    }
                }
            }
        } else {
            console.error("请求参数处理(对象结构)—响应解析类");
        }
    }
    return reqObj
}

/**
 * @name: globalLoading
 * @param {type} 
 * @return: 
 * @description: 全局loading
 */
const globalLoading = function (cfg) {
    let text_ = 'Loading'
    let spinner_ = 'el-icon-loading'
    let background_ = 'rgba(0, 0, 0, 0.7)'
    if (cfg) {
        const { text = text_, spinner = spinner_, background = background_ } = cfg
        text_ = text;
        spinner_ = spinner;
        background_ = background;
    }
    const GlobalLoading = $this.$loading({
        lock: true,
        text: text_,
        spinner: spinner_,
        background: background_
    });
    return GlobalLoading
}



























export { ResDatas, projectDbTable, reqFormatDic, globalLoading }