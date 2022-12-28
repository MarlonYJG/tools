/*
 * @Author: Marlon
 * @Date: 2020-05-08 14:59:02
 * @LastEditors: Marlon
 * @LastEditTime: 2022-01-11 12:01:29
 * @Description: 全局自定义指令
 */
import Vue from 'vue'

// 提交以后禁用按钮一段时间，防止重复提交
Vue.directive('noMoreClick', {
    inserted(el, binding) {
        el.addEventListener('click', e => {
        el.classList.add('is-disabled');
        el.disabled = true;
        setTimeout(() => {
            el.disabled = false;
            el.classList.remove('is-disabled');
        }, 800);
        });
    }
});


