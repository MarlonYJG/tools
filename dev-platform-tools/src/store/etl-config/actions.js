import api from 'api'
// 获取菜单列表信息
export const getMenuInfo = async function ({
  commit
}, currId) {
  //   await api.initNavigation({}, 'af2acd2a-b634-4a72-977e-bfc96a582754' ).then((res) => {
  //         let resData = res.data.data;
  //         let oneMeun = [];
  //         // 过滤列表信息
  //         for (let i = 0; i < resData.length; i++) {
  //           let obj = {};
  //           obj.menuName = resData[i].menuName;
  //           obj.path = resData[i].path;
  //           oneMeun.push(obj)
  //         }
  //         commit('SET_MEUN_INFO', resData);
  //         commit('SET_ONEMENU_LIST', oneMeun);
  //    })
  let resData = [{
      "id": "1",
      "code": null,
      "menuName": "数据ETL配置",
      "path": '/menuNav1',
      "level": 1,
      "pcode": null,
      "pid": null,
      "belongSystemCode": null,
      "belongSystemId": null,
      "isDel": "1",
      "createTime": "2019-05-28T07:01:42.000+0000",
      "childrenMenu": [{
          "id": "1-1",
          "code": null,
          "menuName": "数据源管理",
          "path": '/',
          "level": 5,
          "pcode": null,
          "pid": "bc3f16df-17b5-4691-a6f3-7226dfe9e76",
          "belongSystemCode": null,
          "belongSystemId": null,
          "isDel": "1",
          "createTime": "2019-05-28T07:08:46.000+0000",
          "childrenMenu": [{
            "id": "1-1-1",
            "code": null,
            "menuName": "数据源信息",
            "path": '/menuNav1/dataInfo',
            "level": 5,
            "pcode": null,
            "pid": "bc3f16df-17b5-4691-a6f3-7226dfe9e76",
            "belongSystemCode": null,
            "belongSystemId": null,
            "isDel": "1",
            "createTime": "2019-05-28T07:08:46.000+0000",
          }]
        },
        {
          "id": "1-2",
          "code": null,
          "menuName": "作业规则",
          "path": '/',
          "level": 5,
          "pcode": null,
          "pid": "bc3f16df-17b25-4691-a6f3-7226dfe9e76",
          "belongSystemCode": null,
          "belongSystemId": null,
          "isDel": "1",
          "createTime": "2019-05-28T07:08:46.000+0000",
          "childrenMenu": [{
            "id": "1-2-1",
            "code": null,
            "menuName": "作业列表",
            "path": '/menuNav1/taskList',
            "level": 5,
            "pcode": null,
            "pid": "bc3f16df-17b5-4691-a6f3-7226dfe9e76",
            "belongSystemCode": null,
            "belongSystemId": null,
            "isDel": "1",
            "createTime": "2019-05-28T07:08:46.000+0000",
          }]
        },
        {
          "id": "1-3",
          "code": null,
          "menuName": "作业配置",
          "path": '/',
          "level": 5,
          "pcode": null,
          "pid": "bc3f16df-17b5-4691-a436f3-7226dfe9e76",
          "belongSystemCode": null,
          "belongSystemId": null,
          "isDel": "1",
          "createTime": "2019-05-28T07:08:46.000+0000",
          "childrenMenu": [{
            "id": "1-3-1",
            "code": null,
            "menuName": "转换规则配置",
            "path": '/menuNav1/ruleConfig',
            "level": 5,
            "pcode": null,
            "pid": "bc3f16df-17b5-4691-a6f3-7226dfe9e76",
            "belongSystemCode": null,
            "belongSystemId": null,
            "isDel": "1",
            "createTime": "2019-05-28T07:08:46.000+0000",
          }, ]
        },
        {
          "id": "1-4",
          "code": null,
          "menuName": "数据追溯",
          "path": '/',
          "level": 5,
          "pcode": null,
          "pid": "bc3f16df-17b5-4691-a436f3-7226dfe9e76",
          "belongSystemCode": null,
          "belongSystemId": null,
          "isDel": "1",
          "createTime": "2019-05-28T07:08:46.000+0000",
          "childrenMenu": [{
            "id": "1-4-1",
            "code": null,
            "menuName": "作业列表",
            "path": '/menuNav1/jobList',
            "level": 5,
            "pcode": null,
            "pid": "bc3f16df-17b5-4691-a6f3-7226dfe9e76",
            "belongSystemCode": null,
            "belongSystemId": null,
            "isDel": "1",
            "createTime": "2019-05-28T07:08:46.000+0000",
          }]
        }
      ]
    },
    {
      "id": "2",
      "code": null,
      "menuName": "作业调度管理",
      "path": '/menuNav2',
      "level": 1,
      "pcode": null,
      "pid": null,
      "belongSystemCode": null,
      "belongSystemId": null,
      "isDel": "1",
      "createTime": "2019-05-28T07:01:42.000+0000",
      "childrenMenu": [{
        "id": "2-1",
        "code": null,
        "menuName": "作业调度管理",
        "path": '/',
        "level": 5,
        "pcode": null,
        "pid": "bc3f16df-17b5-4691-a6f3-7226dfe9e76",
        "belongSystemCode": null,
        "belongSystemId": null,
        "isDel": "1",
        "createTime": "2019-05-28T07:08:46.000+0000",
        "childrenMenu": [{
            "id": "2-1-1",
            "code": null,
            "menuName": "定时任务",
            "path": '/menuNav2/timeTask',
            "level": 5,
            "pcode": null,
            "pid": "bc3f16df-17b5-4691-a6f3-7226dfe9e76",
            "belongSystemCode": null,
            "belongSystemId": null,
            "isDel": "1",
            "createTime": "2019-05-28T07:08:46.000+0000",

          },
          {
            "id": "2-1-2",
            "code": null,
            "menuName": "依赖任务",
            "path": '/menuNav2/relyTask',
            "level": 5,
            "pcode": null,
            "pid": "bc3f16df-17b5-4691-a6f3-7226dfe9e76",
            "belongSystemCode": null,
            "belongSystemId": null,
            "isDel": "1",
            "createTime": "2019-05-28T07:08:46.000+0000",

          }
        ]
      }]
    }, {
      "id": "3",
      "code": null,
      "menuName": "配置数据管理",
      "path": '/menuNav3',
      "level": 1,
      "pcode": null,
      "pid": null,
      "belongSystemCode": null,
      "belongSystemId": null,
      "isDel": "1",
      "createTime": "2019-05-28T07:01:42.000+0000",
      childrenMenu: [{
        "id": "3-1",
        "code": null,
        "menuName": "前端数据管理",
        "path": '/',
        "level": 5,
        "pcode": null,
        "pid": "bc3f16df-17b5-4691-a6f3-7226dfe9e76",
        "belongSystemCode": null,
        "belongSystemId": null,
        "isDel": "1",
        "createTime": "2019-05-28T07:08:46.000+0000",
        "childrenMenu": [{
          "id": "2-1-1",
          "code": null,
          "menuName": "前端数据编辑",
          "path": '/menuNav3/index',
          "level": 5,
          "pcode": null,
          "pid": "bc3f16df-17b5-4691-a6f3-7226dfe9e76",
          "belongSystemCode": null,
          "belongSystemId": null,
          "isDel": "1",
          "createTime": "2019-05-28T07:08:46.000+0000"
        }]
      }]
    }
  ];
  let oneMeun = [];
  // 过滤列表信息
  for (let i = 0; i < resData.length; i++) {
    let obj = {};
    obj.menuName = resData[i].menuName;
    obj.path = resData[i].path;

    oneMeun.push(obj)
  }
  commit('SET_MEUN_INFO', resData);
  commit('SET_ONEMENU_LIST', oneMeun);
}
