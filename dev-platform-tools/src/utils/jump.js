/*
 * @Author: Marlon
 * @Date: 2020-02-19 14:27:22
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-17 16:26:30
 * @Description: 跳转
 */
import { Message } from "element-gui";
import SystemConf from '@/config/system.config.js'

/**
 * @name
 * @param {
 *  type：{
 *      href:在本窗体打开一个新的页面(默认);
 *      open:在一个新的窗口打开一个新的页面;
 *      replace:本窗口的页面被替换为一个新的页面URL，替换后不可以回退到上个页面;
 *      assign:本窗口的页面转为一个新的页面URL，与href类似，但此方法可回退至上一页面。
 *  }
 * } 
 * @return: 
 * @description: 外部跳转
 * 
 */
export const openUrl = ({ type = 'href', url = '', obj = null }) => {
    let _url = SystemConf.BASEURL + url
    let params = '';
    if (obj && JSON.stringify(obj) !== "{}") {
        if (!Array.isArray(obj)) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    params += "&" + key + "=" + obj[key];
                }
            }
            if (!!params) {
                params = params.replace("&", "?");
            }
        }
    }
    switch (type) {
        case 'href':
            window.location.href = _url + params
            return;
        case 'open':
            window.open(_url + params)
            return;
        case 'replace':
            window.location.replace(_url + params)
            return;
        case 'assign':
            window.localtion.assign(_url + params)
            return;
        default:
            Message({
                showClose: true,
                message: '请选择跳转类型:(href/open/replace/assign)',
                type: "error"
            });
            return;
    }
}


/**
 * @name: 
 * @param {type} 
 * @return: 
 * @description: 单元格跳转
 */
export const cellJump = (vm, { row, column, TClickItem = [] }, cb) => {
    // console.log(row, column, TClickItem)
    let clickCell = ''
    if (row && column) {
        clickCell = column.property || "";
    }
    if (TClickItem.length) {
        for (let index = 0; index < TClickItem.length; index++) {
            if (TClickItem[index].cells && Array.isArray(TClickItem[index].cells)) {// 非抽象跳转
                if (TClickItem[index].cells.length && TClickItem[index].cells.includes(clickCell)) {
                    // 判断是哪种点击类型
                    if (TClickItem[index].link) {// 跳转
                        if (TClickItem[index].openType) {
                            let openType = TClickItem[index].openType;
                            switch (openType) {
                                case "blank":
                                    let routeData = vm.$router.resolve({
                                        path: TClickItem[index].link,
                                        query: {
                                            // 'itemInfo': JSON.stringify(pathInfo),
                                            // 'currIndex': currSider
                                        },
                                        params: {
                                            row: JSON.stringify(row),
                                            column: JSON.stringify(column),
                                        }
                                    });
                                    window.open(routeData.href, "_blank");
                                    break;
                                case "replace":
                                    vm.$router.replace({
                                        path: TClickItem[index].link,
                                        params: {
                                            row: JSON.stringify(row),
                                            column: JSON.stringify(column),
                                        }
                                    })
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            // 默认跳转方式
                            vm.$router.push({
                                path: TClickItem[index].link,
                                query: {
                                    row: JSON.stringify(row),
                                    column: JSON.stringify(column)
                                },
                            })
                        }
                    } else if (TClickItem[index].type === 'dialog') {
                        cb({ row, column })
                    }
                }
            } else {// 抽象列跳转
                if (TClickItem[index].jump) {
                    const { type, mode } = TClickItem[index].jump
                    if (type === "out") {
                        openUrl({ type: mode, url: TClickItem[index].link, obj: { row: JSON.stringify(row), column: JSON.stringify(column) } })
                    } else {
                        // 默认内部跳转
                        switch (mode) {
                            case "blank":
                                let routeData = vm.$router.resolve({
                                    path: TClickItem[index].link,
                                    query: {
                                        // 'itemInfo': JSON.stringify(pathInfo),
                                        // 'currIndex': currSider
                                    }
                                });
                                window.open(routeData.href, "_blank");
                                return;
                            case "replace":
                                vm.$router.replace({
                                    path: TClickItem[index].link,
                                    query: {
                                        row: JSON.stringify(row),
                                        column: JSON.stringify(column),
                                    }
                                });
                                return;
                            default:
                                // 默认push
                                vm.$router.push({
                                    path: TClickItem[index].link,
                                    query: {
                                        row: JSON.stringify(row),
                                        column: JSON.stringify(column)
                                    }
                                });
                                break;
                        }
                    }
                } else {
                    console.error('未定义跳转类型:跳转工具')
                }
            }
        }
    }

}


/**
 * @name: 
 * @param {type} 
 * @return: 
 * @description: 一站式名片-》详情
 */
export const jumpToDetails = ({
    path = '',
    query = null
}) => {
    let params_ = ''
    if (query) {
        params_ = JSON.stringify(query)
    }
    let routeData = $this.$router.resolve({
        path: path || "/discovery/card/cardDetails",
        query: params_ ? {
            itemInfo: params_,

        } : '',
    })
    window.open(routeData.href, "_blank");
}

/**
 * @name: 
 * @param {type} 
 * @return: 
 * @description: 一站式名片(产权)-》详情
 */
export const jumpToDetails_ = ({
    path = '',
    query = null
}) => {
    let params_ = ''
    if (query) {
        params_ = JSON.stringify(query)
    }
    let routeData = $this.$router.resolve({
        path: path || "/discovery/card/cardDetailsThree",
        query: params_ ? {
            itemInfo: params_,
        } : '',
    })
    window.open(routeData.href, "_blank");
}

/**
 * @name: 
 * @param {type} 
 * @return: 
 * @description: 一站式名片(土地)-》详情
 */
export const jumpToDetails__ = ({
    path = '',
    query = null
}) => {
    let params_ = ''
    if (query) {
        params_ = JSON.stringify(query)
    }
    let routeData = $this.$router.resolve({
        path: path || "/discovery/card/cardDetailsTwo",
        query: params_ ? {
            itemInfo: params_,
        } : '',
    })
    window.open(routeData.href, "_blank");
}


/**
 * @name: 
 * @param {type} 
 * @return: 
 * @description: 历史交易详情(建设工程)-》详情
 */
export const historyToDetails_JSGC = ({
    path = '',
    query = null
}) => {
    let params_ = ''
    if (query) {
        params_ = JSON.stringify(query)
    }
    let routeData = $this.$router.resolve({
        path: path || "/discovery/history/jsgcHistoryDetails",
        query: params_ ? {
            itemInfo: params_,
        } : '',
    })
    window.open(routeData.href, "_blank");
}

/**
 * @name: 
 * @param {type} 
 * @return: 
 * @description: 历史交易详情(政府采购)-》详情
 */
export const historyToDetails_ZFCG = ({
    path = '',
    query = null
}) => {
    let params_ = ''
    if (query) {
        params_ = JSON.stringify(query)
    }
    let routeData = $this.$router.resolve({
        path: path || "/discovery/history/zcHistoryDetails",
        query: params_ ? {
            itemInfo: params_,
        } : '',
    })
    window.open(routeData.href, "_blank");
}

/**
 * @name: 
 * @param {type} 
 * @return: 
 * @description: 历史交易详情(国有产权)-》详情
 */
export const historyToDetails_GYCQ = ({
    path = '',
    query = null
}) => {
    let params_ = ''
    if (query) {
        params_ = JSON.stringify(query)
    }
    let routeData = $this.$router.resolve({
        path: path || "/discovery/history/srHistoryDetails",
        query: params_ ? {
            itemInfo: params_,
        } : '',
    })
    window.open(routeData.href, "_blank");
}

/**
 * @name: 
 * @param {type} 
 * @return: 
 * @description: 历史交易详情(土地)-》详情
 */
export const historyToDetails_TD = ({
    path = '',
    query = null
}) => {
    let params_ = ''
    if (query) {
        params_ = JSON.stringify(query)
    }
    let routeData = $this.$router.resolve({
        path: path || "/discovery/history/irHistoryDetails",
        query: params_ ? {
            itemInfo: params_,
        } : '',
    })
    window.open(routeData.href, "_blank");
}

/**
 * @name: 
 * @param {type} 
 * @return: 
 * @description: 历史交易详情(拍卖行)-》详情
 */
export const historyToDetails_PMH = ({
    path = '',
    query = null
}) => {
    let params_ = ''
    if (query) {
        params_ = JSON.stringify(query)
    }
    let routeData = $this.$router.resolve({
        path: path || "/discovery/history/auctionHistoryDetails",
        query: params_ ? {
            itemInfo: params_,
        } : '',
    })
    window.open(routeData.href, "_blank");
}