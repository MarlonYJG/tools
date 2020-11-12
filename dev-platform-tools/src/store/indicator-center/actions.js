/*
 * @Author: 赵鹏鹏
 * @Date: 2020-05-23 16:12:52
 * @LastEditors: 赵鹏鹏
 * @Description: Actions
 */
import api from "api";
import * as types from "./mutation-types";
import { formatGetArr } from "utils";
import { ResDatas } from "utils/res-format";
// 指标中心
const actions = {
  // 选择项目列表
  getArea_list({ commit }, args) {
    api.getAreaList(args).then(res => {
      let Res = new ResDatas({
        res,
        code: 0
      }).init();
      if(Res){
        commit(types.GET_AREA_LIST_CENTER, formatGetArr(Res, "projectId", "projectName"));
      }
    }).catch(error => {
      console.log(error);
    });
  },
  // 业务板块列表
  getPlate_list({ commit }, id) {
    if (id) {
      api.getPlateList_classify({
        projectId: id //项目ID
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if(Res){
          commit(types.GET_PLATE_LIST_CENTER, formatGetArr(Res, "businessSegmentId", "businessSegmentName"));
        }
      }).catch(error => {
        console.log(error);
      });
    } else {
      commit(types.GET_PLATE_LIST_CENTER, []);
    }
  },
  // 数据域分类列表
  getFiled_list({ commit }, id) {
    if (id) {
      api.classification_bos({
        businessSegmentId: id //板块ID
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if(Res){
          commit(types.GET_FILED_LIST_CENTER, formatGetArr(Res, "dataDomainCategoryId", "dataDomainCategoryName"));
        }
      }).catch(error => {
        console.log(error);
      });
    } else {
      commit(types.GET_FILED_LIST_CENTER, []);
    }

  },
  // 数据域列表
  getDataMany_list({ commit }, id) {
    if (id) {
      api.dataMany_send(id).then(res => { // 数据域分类id
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if(Res){
          commit(types.GET_DATAMANY_LIST_CENTER, formatGetArr(Res, "id", "name"));
        }
      }).catch(error => {
        console.log(error);
      });
    } else {
      commit(types.GET_DATAMANY_LIST_CENTER, []);
    }
  }
}
export default actions;