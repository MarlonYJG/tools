/*
 *                                |~~~~~~~|
 *                                |       |
 *                                |       |
 *                                |       |
 *                                |       |
 *                                |       |
 *     |~.\\\_\~~~~~~~~~~~~~~xx~~~         ~~~~~~~~~~~~~~~~~~~~~/_//;~|
 *     |  \  o \_         ,XXXXX),                         _..-~ o /  |
 *     |    ~~\  ~-.     XXXXX`)))),                 _.--~~   .-~~~   |
 *      ~~~~~~~`\   ~\~~~XXX' _/ ';))     |~~~~~~..-~     _.-~ ~~~~~~~
 *               `\   ~~--`_\~\, ;;;\)__.---.~~~      _.-~
 *                 ~-.       `:;;/;; \          _..-~~
 *                    ~-._      `''        /-~-~
 *                        `\              /  /
 *                          |         ,   | |
 *                           |  '        /  |
 *                            \/;          |
 *                             ;;          |
 *                             `;   .       |
 *                             |~~~-----.....|
 *                            | \             \
 *                           | /\~~--...__    |
 *                           (|  `\       __-\|
 *                           ||    \_   /~    |
 *                           |)     \~-'      |
 *                            |      | \      '
 *                            |      |  \    :
 *                             \     |  |    |
 *                              |    )  (    )
 *                               \  /;  /\  |
 *                               |    |/   |
 *                               |    |   |
 *                                \  .'  ||
 *                                |  |  | |
 *                                (  | |  |
 *                                |   \ \ |
 *                                || o `.)|
 *                                |`\\) |
 *                                |       |
 *                                |       |
 */

/*
 * @Author: Marlon
 * @Date: 2020-05-08 14:59:02
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-02 16:45:44
 * @Description: 全局自定义指令
 */
import Vue from 'vue'

/* 
    防抖
*/
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

/* 
    拖拽
*/
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