const mutations = {
    // 存储横向导航列表
    SET_ONEMENU_LIST: (state, val) => {
        state.oneMenuList = val;
    },
    // 存储侧边栏路由表
    SET_OTHERMENU_LIST: (state, val) => {
        let otherMeun = [];
        let meunInfo = state.meunInfo;
      // 过滤列表信息
      for (let i = 0; i < meunInfo.length; i++) {
        let cPath = meunInfo[i].path.replace("/","");
        if (cPath === val) {
            state.otherMenuList = otherMeun.concat(meunInfo[i].childrenMenu);
        }
      }
    },
    // 导航列表
    SET_MEUN_INFO: (state, val) => {
        state.meunInfo = val;
    },
    SET_SHRINK: (state, val) => {
        state.isShrink = val;
    },
    SET_WIDTH: (state, val) => {
        state.width = val;
    }
}
export default mutations;