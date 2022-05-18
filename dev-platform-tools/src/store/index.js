/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:05:43
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-14 17:25:39
 * @Description: 状态机 监控台
 */
import Vue from "vue"
import Vuex from "vuex"
import createLogger from "vuex/dist/logger"
import system from '@/config/system.config.js'
import publicState from './public'
import { PRODUCT } from '@/config'

const { NODE_ENV, PROJECTKEY } = system

Vue.use(Vuex);
const debug = !NODE_ENV;

const PK = JSON.parse(JSON.stringify(PROJECTKEY))
let systemState = []
switch (PK) {
    case 'bd':
        {
            systemState = require(`./bd`).default
        }
        break;
    case 'login':
        {
            systemState = require(`./login`).default
        }
        break;
    case 'data-standard-manage':
        {
            systemState = require(`./data-standard-manage`).default
        }
        break;
    case 'data-collection':
        {
            systemState = require(`./data-collection`).default
        }
        break;
    case 'data-dev-etl':
        {
            systemState = require(`./data-dev-etl`).default
        }
        break;
    case 'data-manage':
        {
            systemState = require(`./data-manage`).default
        }
        break;
    case 'data-quality-manage':
        {
            systemState = require(`./data-quality-manage`).default
        }
        break;
    case 'etl-config':
        {
            systemState = require(`./etl-config`).default
        }
        break;
    case 'indicator-center':
        {
            systemState = require(`./indicator-center`).default
        }
        break;
    case 'meta-data-manage':
        {
            systemState = require(`./meta-data-manage`).default
        }
        break;
    case 'rule-center':
        {
            systemState = require(`./rule-center`).default
        }
        break;
    case 'self-service-analysis':
        {
            systemState = require(`./self-service-analysis`).default
        }
        break;
    case 'user-portrait':
        {
            systemState = require(`./user-portrait`).default
        }
        break;
    default:
        break;
}

let Public = {};

if ('GST' == PRODUCT) {
    Public = {
        ...publicState,
        modules: {
            systemState
        },

        // strict: debug,
        plugins: debug ? [createLogger()] : []
    }
} else if ('BD' == PRODUCT) {
    Public = {
        modules: {
            systemState
        },

        // strict: debug,
        plugins: debug ? [createLogger()] : []
    }
}

export default new Vuex.Store(Public)
