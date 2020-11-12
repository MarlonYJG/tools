// 折线颜色 以及阴影颜色(带同比环比的)
let getChartColor = value => {
    let brokenLineColor = [];
    switch (value) {
        case 0: case 1: case 2:
          brokenLineColor = ["#02E2F1", "#00FDFF", "#49C9E5"];
          break;
        case 3: case 4: case 5:
          brokenLineColor = ["#6B78FD", "#6B78FD", "#B6C0FF"];
          break;
        case 6: case 7: case 8:
          brokenLineColor = ["#9883ED", "#9883ED", "#FFCEF8"];
          break;
        case 9: case 10: case 11:
          brokenLineColor = ["#0CCBD0", "#0CCBD0", "#90F6CB"];
          break;
        case 12: case 13: case 14:
          brokenLineColor = ["#FF864E", "#FF864E", "#FFD185"];
          break;
        case 15: case 16: case 17:
          brokenLineColor = ["#F2B9F9", "#F2B9F9", "#E966BC"];
          break;
        case 18: case 19: case 20:
          brokenLineColor = ["#FFB594", "#FFB594", "#FF864E"];
          break;
        case 21: case 22: case 23:
          brokenLineColor = ["#66F2EB", "#66F2EB", "#00C2CF"];
          break;
        case 24: case 25: case 26:
          brokenLineColor = ["#FF864E", "#FF864E", "#EB6B66"];
          break;
        case 27: case 28: case 29:
          brokenLineColor = ["#92E1FF", "#92E1FF", "#5391DF"];
          break;
        case 30: case 31: case 32:
          brokenLineColor = ["#D1EF4A", "#D1EF4A", "#6CD686"];
          break;
        case 33: case 34: case 35:
          brokenLineColor = ["#D2C3FF", "#D2C3FF", "#B098FF"];
          break;
        default:
          brokenLineColor = ["#FF6D7E", "#FF6D7E", "#FFB9D6"];
          
    }
    return brokenLineColor;
}
// 折线颜色 以及阴影颜色(不带同比环比的)
let getColor = value => {
  let brokenLineColor = [];
  switch (value) {
      case 0:
        brokenLineColor = ["#02E2F1", "#00FDFF"];
        break;
      case 1:
        brokenLineColor = ["#6B78FD", "#B6C0FF"];
        break;
      case 2:
        brokenLineColor = ["#FFB594", "#FF864E"];
        break;
      case 3:
        brokenLineColor = ["#0CCBD0", "#2BA4F9"];
        break;
      case 4: 
        brokenLineColor = ["#90F6CB", "#0CCBD0"];
        break;  
      case 5: 
        brokenLineColor = ["#F2B9F9", "#E966BC"];
        break;
      case 6: 
        brokenLineColor = ["#9883ED", "#FFCEF8"];
        break;
      case 7: 
        brokenLineColor = ["#66F2EB", "#00C2CF"];
        break;
      case 8: 
        brokenLineColor = ["#FF864E", "#EB6B66"];
        break;
      case 9: 
        brokenLineColor = ["#92E1FF", "#5391DF"];
        break;
      case 10: 
        brokenLineColor = ["#D1EF4A", "#6CD686"];
        break;
      default:
        brokenLineColor = ["#D2C3FF", "#B098FF"];
        
  }
  return brokenLineColor;
}
// 饼图颜色
let getPieChars = value => {
  let pieChars = '';
  switch (value) {
      case 0:
        pieChars = "rgba(110,217,255,1)";
        break;
      case 1:
        pieChars = "rgba(255,151,148,1)";
        break;
      case 2:
        pieChars = "rgba(105,187,255,1)";
        break;
      case 3:
        pieChars = "rgba(206,162,244,1)";
        break;
      case 4:
        pieChars = "rgba(128,232,180,1)";
        break;
      case 5:
        pieChars = "rgba(255,207,123,1)";
        break;
      case 6:
        pieChars = "rgba(255,181,148,1)";
        break;
      case 7:
        pieChars = "rgba(102,242,235,1)";
        break;
      case 8:
        pieChars = "rgba(255,134,78,1)";
        break;
      case 9:
        pieChars = "rgba(146,225,255,1)";
        break;
      case 10:
        pieChars = "rgba(209,239,74,1)";
        break;
      default:
        pieChars = "rgba(247,243,119,1)";
  }
  return pieChars;
}
// 柱状图颜色 同步饼图的颜色
let getBarColor = value => {
  let brokenLineColor = "";
    switch (value) {
        case 0: case 1: case 2:
          brokenLineColor = "#6ED9FF";
          break;
        case 3: case 4: case 5:
          brokenLineColor = "#FF9794";
          break;
        case 6: case 7: case 8:
          brokenLineColor = "#69BBFF";
          break;
        case 9: case 10: case 11:
          brokenLineColor = "#CEA2F4";
          break;
        case 12: case 13: case 14:
          brokenLineColor = "#80E8B4";
          break;
        case 15: case 16: case 17:
          brokenLineColor = "#FFCF7B";
          break;
        case 18: case 19: case 20:
          brokenLineColor = "#FFB594";
          break;
        case 21: case 22: case 23:
          brokenLineColor = "#66F2EB";
          break;
        case 24: case 25: case 26:
          brokenLineColor = "#FF864E";
          break;
        case 27: case 28: case 29:
          brokenLineColor = "#92E1FF";
          break;
        case 30: case 31: case 32:
          brokenLineColor = "#D1EF4A";
          break;
        case 33: case 34: case 35:
          brokenLineColor = "#D2C3FF";
          break;
        default:
          brokenLineColor = "#FF6D7E";
          
    }
    return brokenLineColor;
}
// 柱状图，扇形 地区颜色
let areaColor = ["rgba(110,217,255,1)",
                 "rgba(255,151,148,1)",
                 "rgba(105,187,255,1)",
                 "rgba(206,162,244,1)",
                 "rgba(128,232,180,1)",
                 "rgba(255,207,123,1)",
                 "rgba(255,185,214,1)",
                 "rgba(102,242,235,1)",
                 "rgba(255,134,78,1)",
                 "rgba(146,225,255,1)",
                 "rgba(209,239,74,1)",
                 "rgba(247,243,119,1)",
                 "rgba(254,171,168,1)",
                 "rgba(255,169,226,1)",
                 "rgba(193,199,255,1)",
                 "rgba(255,151,148,1)",
                 "rgba(102,242,235,1)",
                 "rgba(227,188,255,1)",
                ]
// 交易天网=投标效能折线图-颜色
let getBidColor = value => {
  let brokenLineColor = [];
  switch (value) {
      case 0:
        brokenLineColor = ["#85BAF9"];
        break;
      case 1:
        brokenLineColor = ["#C9A6F7"];
        break;
      case 2:
        brokenLineColor = ["#80E8B4"];
        break;
      case 3:
        brokenLineColor = ["#FFCF7B"];
        break;
      case 4: 
        brokenLineColor = ["#5BDAEF"];
        break;  
      case 5: 
        brokenLineColor = ["#F2B9F9"];
        break;
      case 6: 
        brokenLineColor = ["#9883ED"];
        break;
      case 7: 
        brokenLineColor = ["#66F2EB"];
        break;
      case 8: 
        brokenLineColor = ["#FF864E"];
        break;
      case 9: 
        brokenLineColor = ["#92E1FF"];
        break;
      case 10: 
        brokenLineColor = ["#D1EF4A"];
        break;
      default:
        brokenLineColor = ["#D2C3FF"];
        
  }
  return brokenLineColor;
}
export {
    getPieChars,
    areaColor,
    getChartColor,
    getColor,
    getBidColor,
    getBarColor
}