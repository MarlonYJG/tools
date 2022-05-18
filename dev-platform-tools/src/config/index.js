/*
 * @Author: Marlon
 * @Date: 2020-10-30 15:48:09
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-14 17:11:43
 * @Description: 系统——》平台——》产品名(项目名) || 产品级配置
 */

/* ****************产品(配置)*****************
    GST : {
        数据中台：  dmp
            数据标准管理：data-standard-manage
            规则中心：rule-center
            元数据管理：meta-data-manage
            数据采集：data-collection
            数据ETL配置: data-dev-etl / etl-config
            数据质量管理：data-quality-manage
            自助智能分析：self-service-analysis
            数据管理：data-manage
        业务中台：  gbc
            指标中心：indicator-center
            用户画像：user-portrait
        公共配置： cfg
            控制台：console
            管理中心：control-center
    }
    BD  : {
        标道：  BD
    }
    SHBI:{
        自助智能分析：  SHBI
    }
*/


/* 产品名(项目名) */
export const PRODUCT = 'BD'

/* 产品列表 */
export const PRODUCTLIST = {
    GST: {
        /* 系统配置(默认) */
        PLATFORM: 'dmp',// 平台名称
        PROJECTKEY: 'data-standard-manage', // 系统名称
        /* API配置 */
        BASEURL: '',
        BASEURL_testing: 'http://10.0.204.111',
        BASEURL_local: 'http://10.0.204.128',
    },
    BD: {
        /* 系统配置(默认) */
        PLATFORM: 'bd',// 平台名称
        PROJECTKEY: 'bd', // 系统名称
        /* API配置 */
        BASEURL: '',
        BASEURL_testing: 'http://10.0.204.111',
        BASEURL_local: 'http://10.0.204.128',
    },
    SHBI: {
        /* 系统配置(默认) */
        PLATFORM: 'shbi',// 平台名称
        PROJECTKEY: 'shbi', // 系统名称
        /* API配置 */
        BASEURL: '',
        BASEURL_testing: 'http://10.0.204.104',
        BASEURL_local: 'http://10.0.204.104',
    }
}