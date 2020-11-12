
// 柱状图的 数据转换
let barformatData = data => {
    let _coldatas = data.coldatas;
    let rownames = data.rownames;
    let pillarData = [];
    for (let i = 0; i < _coldatas.length; i++) {
        let currItem = _coldatas[i];
        for (let j in currItem) {
            let obj = {};
            obj.name = j;
            obj.data = barData(currItem[j], rownames);
            pillarData.push(obj);
        }
    }
    return pillarData;
}
// 柱状图数据转换
let barData = (data, time) => {
    let tmpArr = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < time.length; j++) {
            if (i === j) {
                let obj = {};
                obj.name = time[j];
                obj.value = data[i];
                tmpArr.push(obj);
            }
        }
    }
    return tmpArr;
}
//  饼状图 的 数据转换
let pieTimeLineFormatData = data => {
    let _coldatas = data.coldatas;
    let _rownames = data.rownames;
    let pieData = [];
    // 饼状图--时间轴 数据转换
    let pieArr = [];
    for (let i in _coldatas) {
        let tmpArr = _coldatas[i];
        for (let j in tmpArr) {
            if (j.indexOf('比') === -1) {
                let obj = {};
                obj[j] = tmpArr[j];
                pieArr.push(obj)
            }
        }
    }
    for (let i in _rownames) {
        let tmpArr = [];
        let tmpObj = {};
        tmpObj.time = _rownames[i];
        for (let j in pieArr) {
            let tmpVal = pieArr[j];
            for (let k in tmpVal) {
                let obj = {};
                obj.name = k;
                obj.value = tmpVal[k][i];
                tmpArr.push(obj);
            }
        }
        tmpObj.timeData = tmpArr;
        pieData.push(tmpObj)
    }
    return pieData
}
// 普通饼图(交易规模) 数据转换
let pieFormatData = data => {
    let _coldatas = data.coldatas;
    let _rownames = data.rownames;
    let yArrData = [];
    for (let i = 0; i < _coldatas.length; i++) {
        let currItem = _coldatas[i];
        for (let i in currItem) {
            yArrData = currItem[i];
        }
    }
    let pieData = [];
    for (let i = 0; i < _rownames.length; i++) {
        let tmpVal = _rownames[i];
        for (let j = 0; j < yArrData.length; j++) {
            if (i === j) {
                let obj = {};
                obj.name = tmpVal;
                obj.value = yArrData[i];
                pieData.push(obj);
            }
        }
    }
    return pieData
}

// 柱状图(交易规模)
let jsgmBarData = data => {
    let _coldatas = data.coldatas;
    let _legend = data.colnames;
    let pillarArr = [];
    let pillarObjData = {};
    for (let i = 0; i < _coldatas.length; i++) {
        let tmpVal = _coldatas[i];
        for (let j in tmpVal) {
            pillarArr = tmpVal[j];
        }
    }
    pillarObjData.data = pillarArr;
    pillarObjData.name = _legend[0];
    return pillarObjData;
}
// 活跃度--按时间分析 柱状图数据转换
let activeBarData = data => {
    let _echartsData = data;
    let colnames = _echartsData.colnames;
    let coldatas = _echartsData.coldatas;
    let handleData = [];
    for (let i = 0; i < colnames.length; i++) {
        let currColnames = colnames[i];
        for (let j = 0; j < coldatas.length; j++) {
            let tmpColData = coldatas[j]
            for (let item in tmpColData) {
                if (currColnames.id === item) {
                    let obj = {};
                    obj.name = currColnames.name;
                    obj.data = tmpColData[item];
                    handleData.push(obj)
                }
            }
        }
    }
    return handleData
}
// 活跃度--按时间分析 饼图数据转换
let activeTimePieData = data => {
    let _colnames = data.colnames;
    let _rownames = data.rownames;
    let _coldatas = data.coldatas;
    let tmp = [];
    for (let k = 0; k < _rownames.length; k++) {
        let obj = {};
        obj.name = _rownames[k];
        for (let i = 0; i < _colnames.length; i++) {
            let id = _colnames[i].id
            for (let j = 0; j < _coldatas.length; j++) {
                let item = _coldatas[j];
                for (let key in item) {
                    if (key === id) {
                        if (_colnames[i].name === '活跃家数' || _colnames[i].name ==='活跃数量') {
                            obj.value = item[key][k]
                        } else {
                            obj[_colnames[i].name] = item[key][k];
                        }
                    }
                }
            }
        }
        tmp.push(obj);
    }
    // console.log(tmp)
    return tmp
    // console.log(data)
}
// 活跃度 饼图数据转换
let activePieData = data => {
    let _coldatas = data.coldatas;
    let tmpColdatas = [];
    for (let i = 0; i < _coldatas.length; i++) {
        let currItem = _coldatas[i];
        for (let item in currItem) {
            let obj = {};
            obj.name = item;
            obj.value = currItem[item];
            tmpColdatas.push(obj)
        }
    }
    return tmpColdatas
}
// 雷达图 数据转换
let radarDataFormat = data => {
    let _coldatas = data.coldatas;
    let tmpColdatas = [];
    for (let i = 0; i < _coldatas.length; i++) {
        let currItem = _coldatas[i];
        for (let item in currItem) {
            let obj = {};
            obj.name = item;
            obj.value = currItem[item];
            tmpColdatas.push(obj)
        }
    }
    return tmpColdatas
}
// 市场主体-柱状图
let marketSubjectBarData = data => {
    let colnames = data.colnames;
    let coldatas = data.coldatas;
    let colArrs = [];
    for (let i = 0; i < colnames.length; i++) {
        let obj = {};
        obj.name = colnames[i];
        obj.data = coldatas;
        colArrs.push(obj)
    }
    return colArrs;
}
// 市场主体-饼图
let marketSubjectPieData = data => {
    let rownames = data.rownames;
    let coldatas = data.coldatas;
    let pieArr = [];
    for (let i = 0; i < rownames.length; i++) {
        let obj = {};
        obj.name = rownames[i];
        for (let j = 0; j < coldatas.length; j++) {
            if (i === j) {
                obj.value = coldatas[j];
            }
        }
        pieArr.push(obj)
    }
    return pieArr
}
// 围串标 投标效能柱状图
let effBarChartsData = data => {
    let _coldatas = data.coldatas;
    let _colnames = data.colnames;
    let pillarData = [];
    for (let i = 0; i < _colnames.length; i++) {
        let obj = {};
        obj.name = _colnames[i].name;
        for (let j = 0; j < _coldatas.length; j++) {
            let currItem = _coldatas[j];
            for (let k in currItem) {
                if (_colnames[i].id === k) {
                    obj.data = currItem[k];
                }
            }
        }
        pillarData.push(obj);
    }
    return pillarData
}
// 围串标 饼图数据转换
let horizontalPieData = data => {
    let _colnames = data.colnames;
    let _rownames = data.rownames;
    let _coldatas = data.coldatas;
    let tmp = [];
    for (let k = 0; k < _rownames.length; k++) {
        let obj = {};
        obj.name = _rownames[k];
        for (let i = 0; i < _colnames.length; i++) {
            let id = _colnames[i].id
            for (let j = 0; j < _coldatas.length; j++) {
                let item = _coldatas[j];
                for (let key in item) {
                    if (key === id) {
                        obj.value = item[key][k];
                    }
                }
            }
        }
        tmp.push(obj);
    }
    return tmp
}
// 节资率 按地域统计 饼图
let pieFormatSaveMoney = data => {
    let _coldatas = data.coldatas;
    let _rownames = data.colnames;
    let yArrData = [];
    for (let i = 0; i < _coldatas.length; i++) {
        let currItem = _coldatas[i];
        for (let i in currItem) {
            yArrData = currItem[i];
        }
    }
    let pieData = [];
    for (let i = 0; i < _rownames.length; i++) {
        let tmpVal = _rownames[i];
        for (let j = 0; j < yArrData.length; j++) {
            if (i === j) {
                let obj = {};
                obj.name = tmpVal;
                obj.value = yArrData[i];
                pieData.push(obj);
            }
        }
    }
    return pieData
}
// 散点图
let scatterCharts = data => {
    let coldatas = data.coldatas;
    let colArrs = [];
    for (let i = 0; i < coldatas.length; i++) {
        let tmpColData = coldatas[i];
        for (let item in tmpColData) {
            let obj = {};
            obj.data = tmpColData[item];
            colArrs.push(obj);
        }
    }
    return colArrs;
}
// 特殊散点图（带有最大值最小值）
let scatterFormat = (data, valueType) => {
    let type = {};
    if (valueType !== undefined) {
        type = {
            'max': valueType.max === undefined ? '最大值' : valueType.max,
            'min': valueType.min === undefined ? '最小值' : valueType.min,
            'avg': valueType.avg === undefined ? '平均交易周期' : valueType.avg,
        };
    } else {
        type = {
            'max': '最大值',
            'min': '最小值',
            'avg': '平均交易周期',
        };
    }
    let list = typeof data.series==='undefined'?data[0].list:data.series;
    let maxiValue =typeof data.maximumValue==='undefined'?data[1].MaximumValue:data.maximumValue;
    for (let i = 0; i < list.length; i++) {
        let tmpList = list[i];
        let tmpArr = [];
        tmpList.type = "scatter";
        for (let j = 0; j < maxiValue.length; j++) {
            let maxTmp = maxiValue[j];

            if (tmpList.name === maxTmp.name && maxTmp.type === 'max') {
                let maximumValue = {
                    type: "max",
                    name: "最大值",
                    valueIndex: 1,
                    itemStyle: { color: "#F9BA3E" },
                    label: {
                        show: true,
                        color: "#000",
                        formatter: function () {
                            return "最大";
                        }
                    }
                }
                tmpArr.push(maximumValue);
            }
            if (tmpList.name === maxTmp.name && maxTmp.type === 'min') {
                let maximumValue = {
                    type: "min",
                    name: "最小值",
                    valueIndex: 1,
                    itemStyle: { color: "#47EEE6" },
                    label: {
                        show: true,
                        color: "#000",
                        formatter: function () {
                            return "最小";
                        }
                    }
                }
                tmpArr.push(maximumValue);
            }
            if (maxTmp.type === 'avg') {
                let name;  //重点项目节资率 交易周期
                if(data.titleName==="重点项目节资率分析"){
                    name='全部项目平均节资率';
                }else if(data.titleName==="重点项目交易周期分析"){
                    name='全部项目平均周期'
                }else{
                    name='全部项目平均金额'
                }
                tmpList.markLine = {
                    symbol: "none",
                    data: [
                        {
                            yAxis: maxTmp.value,
                            name: name,

                            lineStyle: {
                                color: "#FFB5B5",
                                type: "solid"
                            },
                            label: {
                                show: true,
                                formatter: function () {
                                    return type.avg;
                                }
                            }
                        }
                    ]
                }
            }
            //重点项目 多个大小
            if (tmpList.name === maxTmp.name && maxTmp.type === 'keyMax') {
                let maximumValue = {
                    type: "max",
                    name: "最大值",
                    valueIndex: 1,
                    itemStyle: { color: "#F9BA3E" },
                    label: {
                        show: true,
                        color: "#000",
                        formatter: function () {
                            return "最大";
                        }
                    }
                }
                tmpArr.push(maximumValue);
            }
            //重点项目 多个平均值
            if ( tmpList.name === maxTmp.name && maxTmp.type === 'keyAvg') {
                let name;  //重点项目节资率 交易周期
                if(data.titleName==="重点项目节资率分析"){
                    name='重点项目平均节资率';
                }else if(data.titleName==="重点项目交易周期分析"){
                    name='重点项目平均周期'
                }else{
                    name='重点项目平均金额'
                }
                tmpList.markLine = {
                    symbol: "none",
                    data: [
                        {
                            yAxis: maxTmp.value,
                            name: name,
                            lineStyle: {
                                color: "#FF9547",
                                type: "solid"
                            },
                            label: {
                                show: true,
                                formatter: function () {
                                    return '重点项目';
                                }
                            }
                        }
                    ]
                }
            }
        }
        tmpList.markPoint = {
            data: tmpArr
        }
    }
    return list;
}
// 散点图——区域
let scatterMarkAreaFormat = (data, valueType) => {
    let type = {};
    if (valueType !== undefined) {
        type = {
            'max': valueType.max === undefined ? '最大值' : valueType.max,
            'min': valueType.min === undefined ? '最小值' : valueType.min,
            'avg': valueType.avg === undefined ? '平均交易周期' : valueType.avg,
        };
    } else {
        type = {
            'max': '最大值',
            'min': '最小值',
            'avg': '平均交易周期',
        };
    }
    let list = data[0].list;
    let maxiValue = data[1].MaximumValue;
    let markArea = null;
    if (data[2] && data[2].markArea) {
        markArea = data[2].markArea;
    }
    for (let i = 0; i < list.length; i++) {
        let tmpList = list[i];
        let tmpArr = [];
        tmpList.type = "scatter";
        for (let j = 0; j < maxiValue.length; j++) {
            let maxTmp = maxiValue[j];

            if (tmpList.name === maxTmp.name && maxTmp.type === 'max') {
                let maximumValue = {
                    type: "max",
                    name: "最大值",
                    valueIndex: 1,
                    itemStyle: { color: "#F9BA3E" },
                    label: {
                        show: true,
                        color: "#000",
                        formatter: function () {
                            return "最大";
                        }
                    }
                }
                tmpArr.push(maximumValue);
            }
            if (tmpList.name === maxTmp.name && maxTmp.type === 'min') {
                let maximumValue = {
                    type: "min",
                    name: "最小值",
                    valueIndex: 1,
                    itemStyle: { color: "#47EEE6" },
                    label: {
                        show: true,
                        color: "#000",
                        formatter: function () {
                            return "最小";
                        }
                    }
                }
                tmpArr.push(maximumValue);
            }
            if (maxTmp.type==='avg') {
                tmpList.markLine = {
                    symbol: "none",
                    data: [
                        {
                            yAxis: maxTmp.value,
                            name: type.avg,
                            lineStyle: {
                                color: "#FFB5B5",
                                type: "solid"
                            },
                            label: {
                                show: true,
                                formatter: function () {
                                    return type.avg;
                                }
                            }
                        }
                    ]
                }
            }
        }
        tmpList.markPoint = {
            data: tmpArr
        }
        // 区间
        if (markArea) {
            tmpList.markArea = {
                data: [
                    [
                        {
                            name: '',
                            yAxis: markArea[0].y
                        },
                        {
                            name: '',
                            yAxis: markArea[1].y
                        }
                    ]
                ]
            }
        }

    }
    return list;
}

// 折线图（专家行为分析）
let lineformatData = data => {
    let _coldatas = data.coldatas;
    let pillarData = [];
    for (let i = 0; i < _coldatas.length; i++) {
        let currItem = _coldatas[i];
        for (let j in currItem) {
            let obj = {};
            obj.name = j;
            obj.data = currItem[j];
            pillarData.push(obj);
        }
    }
    return pillarData
}

export {
    barformatData,
    pieTimeLineFormatData,
    pieFormatData,
    pieFormatSaveMoney,
    activeTimePieData,
    marketSubjectBarData,
    marketSubjectPieData,
    jsgmBarData,
    activeBarData,
    activePieData,
    radarDataFormat,
    effBarChartsData,
    horizontalPieData,
    scatterCharts,
    scatterFormat,
    scatterMarkAreaFormat,
    lineformatData
}