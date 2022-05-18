/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:42:12
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-14 14:34:10
 * @Description: actions
 */
import * as types from "./mutation-types";
import api from "api";
import system from '@/config/system.config.js'

const { BASEURL, LOGIN_PAGE_NAME } = system


// 系统列表
export const getSystemList = ({ commit }, val) => {
  api.__publicGetStytemList().then(res => {
    let resVal = []
    if (res && res.data && res.data.stytemList) {
      // 获取系统地址
      function loop(arr) {
        arr.forEach(item => {
          item['icon'] = item.icon || item.iconCssClass || ''
          if (item.url && item.url.toString().indexOf('/') !== -1) {
            item.url = BASEURL + item.url
          }
          if (item.children && item.children.length) {
            loop(item.children)
          }
        });
      }
      loop(res.data.stytemList)
      resVal = res.data.stytemList;
    }
    commit(types.GET_SYSTEM_LIST, resVal)
  })
}
// 菜单列表
export const getMenuList = ({ commit }, val) => {
  api.__publicGetMenuList().then(res => {
    let resVal = []
    if (res && res.data && res.data.subMenu) {
      resVal = res.data;
    }
    commit(types.GET_MENU_LIST, resVal)
  })
}
// 面包屑
export const getBreadcrumbList = ({ commit }, val) => {
  commit(types.SET_BREADCRUMB_LIST, val)
}

// 获取用户信息
export const getUserInfo = ({ commit }) => {
  return new Promise((resolve, reject) => {
    api.__publicUserInfo().then(res => {
      if (res.data.code == 0) {
        let userRes = {
          userInfo: {
            user: res.data.data.user
          }
        } || null
        commit(types.GET_USER_INFO, userRes)
      }
      resolve(res.data || null)
    }).catch(err => {
      reject(err)
    })
  })
}




// 所在省市
export const getprovinceCityList = ({ commit }) => {
  api.getGeographicalDivisionTree().then(res => {
    if (res.data.code == 0) {
      let { data, type } = res.data.data;
      if (type == "tree") {

        // TODO
        let datas = [
          {
            "id": "110000",
            "pid": "1",
            "label": "北京",
            "info": {
              "name": "北京",
              "id": "110000",
              "parentId": "1"
            },
            "children": [{
              "id": "110100",
              "pid": "110000",
              "label": "北京市",
              "info": {
                "name": "北京市",
                "id": "110100",
                "parentId": "110000"
              },
              "children": []
            }]
          },
          {
            "id": "120000",
            "pid": "1",
            "label": "天津",
            "info": {
              "name": "天津",
              "id": "120000",
              "parentId": "1"
            },
            "children": [{
              "id": "120100",
              "pid": "120000",
              "label": "天津市",
              "info": {
                "name": "天津市",
                "id": "120100",
                "parentId": "120000"
              },
              "children": []
            }]
          },
          {
            "id": "130000",
            "pid": "1",
            "label": "河北省",
            "info": {
              "name": "河北省",
              "id": "130000",
              "parentId": "1"
            },
            "children": [
              {
                "id": "130100",
                "pid": "130000",
                "label": "石家庄市",
                "info": {
                  "name": "石家庄市",
                  "id": "130100",
                  "parentId": "130000"
                },
                "children": []
              },
              {
                "id": "130200",
                "pid": "130000",
                "label": "唐山市",
                "info": {
                  "name": "唐山市",
                  "id": "130200",
                  "parentId": "130000"
                },
                "children": []
              },
              {
                "id": "130300",
                "pid": "130000",
                "label": "秦皇岛市",
                "info": {
                  "name": "秦皇岛市",
                  "id": "130300",
                  "parentId": "130000"
                },
                "children": []
              }
            ]
          }
        ]
        // let arr = [];
        // data.children.label = data.label;
        // data.children.value = data.id;
        // arr.push(data.children);
        commit(types.PROVINCE_CITY_LIST, datas);
      }
    }
  })
    .catch(err => {
      console.log(err);
    });
}

// 行业类型
export const getInstriesList = ({ commit }) => {
  api.getInstriesList().then(res => {
    if (res.data.code == 0) {
      let resData = res.data.data || [];
      commit(types.INSTRIESLIST, resData);
    }
  })
    .catch(err => {
      console.log(err);
    });
}

// 公告类型
export const getAnnouncementTypeList = ({ commit }) => {
  api.getAnnouncementTypeList().then(res => {
    if (res.data.code == 0) {
      let resData = res.data.data || [];
      commit(types.ANNOUNCEMENTYPELIST, resData);
    }
  })
    .catch(err => {
      console.log(err);
    });
}

// 搜索范围
export const getSearchScopeList = ({ commit }) => {
  api.getSearchScopeList().then(res => {
    if (res.data.code == 0) {
      let resData = res.data.data || [];
      commit(types.SEARCHSCOPELIST, resData);
    }
  })
    .catch(err => {
      console.log(err);
    });
}

// 时间范围
export const getTimeType = ({ commit }) => {
  api.getTimeType().then(res => {
    if (res.data.code == 0) {
      let resData = res.data.data || [];
      commit(types.TIME_TIME, resData);
    }
  })
    .catch(err => {
      console.log(err);
    });
}
