/*
 * @Author: 赵鹏鹏
 * @Date: 2020-05-20 08:46:31
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-05-22 14:30:07
 * @Description: 指标构建-公共Mixins
 */ 
export default {
  date() {
    return {
    }
  },
  methods: {
    // 弹出框关闭之前清除检验
    handleClose() {
      this.FDRules = {};
      // 解决二次进入弹出框内下拉列表默认选中 this.plateValue 需要及时清空
      // TODO:"删除this.plateValue赋值"
      if (this.plateValue) { this.plateValue = "" }
    },
    // 表格多选赋值
    handleSelectionChange(type, selectionArr) {
      if (type == 'checkbox') this.checkboxArr = selectionArr;
    }
  }
}
