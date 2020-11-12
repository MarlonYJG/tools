/*
 * @Author: 赵鹏鹏
 * @Date: 2020-05-30 19:16:36
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-16 14:35:49
 * @Description: 全局指令-拖拽
 */
import Vue from 'vue';
Vue.directive('trag', (el, binding) => {
    el.style.position = 'absolute';
    el.onmousedown = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var startX = e.clientX - el.offsetLeft;
        var startY = e.clientY - el.offsetTop;
        document.onmousemove = function (e) {
            var ev = e || event;
            ev.cancelBubble = true;
            ev.returnValue = false;
            var endX = e.clientX - startX;
            var endY = e.clientY - startY;
            el.style.left = endX + 'px';
            el.style.top = endY + 'px';
        }
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
})