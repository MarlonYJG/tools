/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:38:51
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-04 11:18:21
 * @Description: 临时数据库
 */
const cloneRuleForm = {
    dyName: "", // 订阅名称
    importWord: [], // 关键词
    importWord1: "",
    importWord2: "",
    importWord3: "",
    importWord4: "",
    importWord5: "",
    importWord6: "",
    cityAll: [], // 所在省市
    industryType: [], // 行业类型
    noticeType: [], // 公告类型
    searchRange: "1" // 搜索范围 默认1 全文 2 标题
};

const state = {
    // 我的订阅
    dy_dialogInfo: {
        dialogVisible: false, // 弹框显示
        dialogTitle: "", // 弹框header
        ruleForm: JSON.parse(JSON.stringify(cloneRuleForm))
    },
    cloneRuleForm: JSON.parse(JSON.stringify(cloneRuleForm)),
    optionsCity: [], // 所在省市
    citiesIntypeArr: [], // 行业类型
    citiesNoticeArr: [], // 公告类型
    searchRangeArr: [], // 搜索类型
    timeTypeArr: [] // 时间范围
}

export default state;