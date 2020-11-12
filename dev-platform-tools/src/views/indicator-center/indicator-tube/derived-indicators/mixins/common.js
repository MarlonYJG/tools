/*
 * @Author: 赵鹏鹏
 * @Date: 2020-05-27 19:06:09
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-06-03 19:29:30
 * @Description: 项目名称
 */
export default {
  data(){
    return{}
  },
  methods: {
    // 选择项目下拉发生改变时
    ProjectChange() {
      this.selectPlate = "";
      this.selectYu = "";
      this.selectFinger = "";
      this.getPlate_list(this.selectProject);
      this.getTableList();
    },
    // 业务板块下拉列表改变时
    PlateChange() {
      this.selectYu = "";
      this.selectFinger = "";
      this.getDataMany_list(this.selectPlate);
      this.getTableList();
    },
    // 数据域下拉列表改变时
    YuChange() {
      this.selectFinger = "";
      this.getFingerSend(this.selectYu);
      this.getTableList();
    },
    // 指标来源列表改变时
    FingerChange() {
      this.getTableList();
    }
  }
}