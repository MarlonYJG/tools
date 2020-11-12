/*
 * @Author: Marlon
 * @Date: 2020-05-08 14:59:02
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-30 16:34:19
 * @Description: 全局自定义指令
 */
import Vue from 'vue'

// 防抖
(function () {
    let openDelay = false;
    Vue.directive('intervalclick', function (el, binding) {
        el.onclick = function (e) {
            if (openDelay) return;
            openDelay = !openDelay;
            if (!binding.value) {
                console.error("未传入Value数据！");
                return;
            }
            let func = binding.value['func'];
            let time = binding.value['time'];
            if (typeof time !== 'number') {
                console.error('传入等待时间错误');
                return;
            }
            let args = [];
            for (const key in binding.value) {
                if (binding.value.hasOwnProperty(key)) {
                    if (key === 'func' || key === 'time') continue;
                    args.push(binding.value[key])
                }
            }
            setTimeout(() => {
                openDelay = !openDelay;
            }, time);
            func(...args);
        }
    })
})()
