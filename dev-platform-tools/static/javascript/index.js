/*
 * @Author: Marlon
 * @Date: 2020-10-22 16:26:30
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-30 13:55:49
 * @Description: demo- 获取执行任务列表
 */
// 动态加载 css 添加到首行

// 
var bidConfig = null
var myChart = null

var GST = {
    init: function () {
        var scriptElement = document.createElement('script');
        document.head.appendChild(scriptElement);
        scriptElement.src = "https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js?_v_=1598903772045"

    },
    GSTTask: {
        // 初始化模块渲染
        randerDom: function (domId) {
            var html_ = `<div id="task-model">
            <div class="task-content">
                <div class="a" id="${domId}"></div>
                <span class="close-gst" onclick="GST.GSTTask.hide()">X</span>
            </div>`
            document.body.insertAdjacentHTML('afterend', html_)

            // document.getElementsByClassName('close-gst')

        },
        // DOM 操作
        show: function () {
            document.getElementById('task-model').style.cssText = 'display: block;'
        },
        hide: function () {
            document.getElementById('task-model').style.cssText = 'display: none;'
        },
        // API 操作
        APIGet(params) {
            // 参数处理
            // API 调用
            console.log('获取参数', params)
            var xAxisData = ["0-23", "23-46", "46-69", "69-92", "92-115", "115-138", "138-161", "161-184", "184-207", "207-230", "230-253", "253-276", "276-299", "299-322", "322-345", "345-368", "368-391", "391-414", "414-437", "437-460"]
            var seriesData = [{ "name": "0-23", "value": 2, "date": "2018-10至2018-10" },
            { "name": "23-46", "value": 0, "date": "" },
            { "name": "46-69", "value": 0, "date": "" },
            { "name": "69-92", "value": 0, "date": "" },
            { "name": "92-115", "value": 0, "date": "" },
            { "name": "115-138", "value": 0, "date": "" },
            { "name": "138-161", "value": 0, "date": "" },
            { "name": "161-184", "value": 0, "date": "" },
            { "name": "184-207", "value": 0, "date": "" },
            { "name": "207-230", "value": 0, "date": "" },
            { "name": "230-253", "value": 0, "date": "" },
            { "name": "253-276", "value": 0, "date": "" },
            { "name": "276-299", "value": 0, "date": "" },
            { "name": "299-322", "value": 0, "date": "" }, { "name": "322-345", "value": 34, "date": "2016-12至2017-01" },
            { "name": "345-368", "value": 166, "date": "2016-12至2017-01" },
            { "name": "368-391", "value": 219, "date": "2016-12至2017-01" },
            { "name": "391-414", "value": 72, "date": "2016-12至2017-01" },
            { "name": "414-437", "value": 9, "date": "2016-12至2016-12" },
            { "name": "437-460", "value": 0, "date": "" }]

            setTimeout(() => {
                if (bidConfig && myChart) {
                    bidConfig.xAxis.data = xAxisData
                    bidConfig.series[0].data = seriesData
                    console.log(bidConfig)
                    myChart.setOption(bidConfig, true);
                }

            }, 2000);
        },
        rander() {
            bidConfig = {
                "graphic":
                {
                    "elements":
                        [{
                            "type": "text", "right": "260px", "top": "66px",
                            "style": { "text": "平均数=370.84", "fill": "#555555", "fontSize": "14" }
                        },
                        {
                            "type": "text", "right": "160px", "top": "66px",
                            "style": { "text": "标准差=30.14", "fill": "#555555", "fontSize": "14" }
                        },
                        {
                            "type": "text", "right": "60px", "top": "66px",
                            "style": { "text": "个案数=502", "fill": "#555555", "fontSize": "14" }
                        }]
                },
                "grid":
                    { "top": "20%", "bottom": "5%" },
                "color":
                {
                    "type": "linear", "x": 0, "y": 0, "x2": 0, "y2": 1,
                    "colorStops": [{ "offset": 0, "color": "#70EFF8" },
                    { "offset": 1, "color": "#2BA4F9" }], "global": false
                }, "tooltip": {
                    "trigger": "axis", "axisPointer":
                    {
                        "type": "shadow",
                        "shadowStyle": { "color": { "type": "linear", "x": 0, "y": 0, "x2": 0, "y2": 1, "colorStops": [{ "offset": 0, "color": "#70EFF8" }, { "offset": 1, "color": "#2BA4F9" }], "global": false }, "opacity": 0.3 }
                    }
                }, "xAxis": {
                    "show": true, "name": "投标次数：次", "type": "category",
                    "data": [], "nameGap": 20, "axisLine": { "lineStyle": { "color": "#999999" } }
                }, "yAxis":
                {
                    "show": true, "name": "企业家数：家", "type": "value", "nameGap": 15,
                    "axisLine": { "lineStyle": { "color": "#999999" } }, "nameTextStyle": { "align": "right" }
                }, "series": [{
                    "name": "投标次数",
                    "data":
                        [],
                    "barwidth": 100,
                    "type": "bar"
                }]
            };
            myChart = echarts.init(document.getElementById('myBadList'))
            myChart.setOption(bidConfig, true);
        }
    },

}

window.GST = GST

/*

1. 预加载 css echart http
2. 渲染 HTML模板
3. 调用API获取数据填充至HTML
  3.1 获取参数
  3.2 数据处理
  3.3 填充HTML
4. DOM操作

*/

// GST.init()
// GST.GSTTask.randerDom('myBadList')
// GST.GSTTask.rander()
// GST.GSTTask.APIGet({ 'a': 1, 'b': 2 })





