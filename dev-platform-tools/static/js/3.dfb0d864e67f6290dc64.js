webpackJsonp([3],{"0Pfo":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("mvHQ"),l=a.n(i),s=a("is1l"),r=a("gyMJ"),o=a("b0ey"),n={mixins:[s.a],data:function(){var e=this;return{TLoading:!1,TEdit:{show:!0,title:"操作",editTypes:[{label:"编辑",property:"edit"},{label:"删除",property:"del"}]},tableTitle:[{prop:"datasourceName",label:"名称"},{prop:"datasourceType_value",label:"数据库类型"},{prop:"remark",label:"备注"}],tableData:[],TPage:{total:100,index:1,size:10},FDVisible:!1,FDTitle:"",FDForm:[],FDFoot:{button:[{type:"ok",label:"确定",cb:function(t){"新增"===e.dialogActiveItem?e.DSMCAdd(t):e.DSMCUpdate(t)}}]},inputVal:"",clickObj:"",dialogActiveItem:""}},methods:{editBtnCb:function(e,t,a){var i=this;this.clickObj=e;var l=e.label;"删除"===l?r.default.DSMCDel({id:a.id}).then(function(e){new o.a({res:e,msg:"删除成功!"}).state(),i.DSMCList()}):"关闭"===l&&(this.FDVisible=e.close)},showDialog:function(e){var t=this,a=e.type,i=e.initDig,s=void 0===i?null:i;switch(this.dialogActiveItem=a,a){case"新增":return this.FDTitle="新增数据源",this.FDVisible=!0,this.FDForm=[{type:"select",label:{name:"数据库类型",width:"120"},key:"datasourceType",width:"200",defaultModel:"",placeholder:"",option:[]},{type:"input",label:{name:"名称",width:"120"},key:"datasourceName",clearable:!0,width:"280",defaultModel:"",placeholder:""},{type:"input",label:{name:"IP",width:"120"},key:"ip",width:"280",defaultModel:"",placeholder:""},{type:"input",label:{name:"端口",width:"120"},key:"port",width:"280",defaultModel:"",placeholder:""},{type:"input",label:{name:"用户名",width:"120"},key:"username",width:"280",defaultModel:"",placeholder:""},{type:"input",label:{name:"密码",width:"120"},showPassword:!0,key:"password",width:"280",defaultModel:"",placeholder:""},{type:"input",label:{name:"数据库名称",width:"120"},key:"databaseName",width:"280",defaultModel:"",placeholder:""},{type:"textarea",label:{name:"备注",width:"120"},key:"remark",width:"280",defaultModel:"",placeholder:"",autosize:{min:2,max:4}}],void r.default._PublicDataBaseList({name:"datasource_datasource_type"}).then(function(e){var a=new o.a({res:e}).init(),i=[];a&&a.length&&a.forEach(function(e){i.push({label:e.name,value:e.code})}),t.$set(t.FDForm[0],"option",i),t.$set(t.FDForm[0],"defaultModel",i[0].value)});case"编辑":if(this.FDTitle="编辑数据源",this.FDVisible=!0,this.FDForm=[{type:"select",label:{name:"数据库类型",width:"120"},key:"datasourceType",width:"200",defaultModel:"",placeholder:"",option:[]},{type:"input",label:{name:"名称",width:"120"},key:"datasourceName",clearable:!0,width:"280",defaultModel:"",placeholder:""},{type:"input",label:{name:"IP",width:"120"},key:"ip",width:"280",defaultModel:"",placeholder:""},{type:"input",label:{name:"端口",width:"120"},key:"port",width:"280",defaultModel:"",placeholder:""},{type:"input",label:{name:"用户名",width:"120"},key:"username",width:"280",defaultModel:"",placeholder:""},{type:"input",label:{name:"密码",width:"120"},showPassword:!0,key:"password",width:"280",defaultModel:"",placeholder:""},{type:"input",label:{name:"数据库名称",width:"120"},key:"databaseName",width:"280",defaultModel:"",placeholder:""},{type:"textarea",label:{name:"备注",width:"120"},key:"remark",width:"280",defaultModel:"",placeholder:"",autosize:{min:2,max:4}}],s&&"{}"!==l()(s)){var n=function(e){s.hasOwnProperty(e)&&t.FDForm.forEach(function(t){e===t.key&&(t.key=e,t.defaultModel=s[e])})};for(var d in s)n(d)}return void r.default._PublicDataBaseList({name:"datasource_datasource_type"}).then(function(e){var a=new o.a({res:e}).init(),i=[];a&&a.length&&a.forEach(function(e){i.push({label:e.name,value:e.code})}),t.$set(t.FDForm[0],"option",i)});default:return}},changePage:function(e){var t=e.pageSize,a=e.currentPage;this.$set(this.TPage,"index",a),this.$set(this.TPage,"size",t),this.DSMCList()},lickCell:function(e){var t=e.row,a=e.column,i=(e.id,t.databaseName),l=t.datasourceName,s=t.datasourceType,r=t.ip,o=t.password,n=t.port,d=t.remark,u=t.username;switch(a.label){case"编辑":return void this.showDialog({type:a.label,initDig:{databaseName:i,datasourceName:l,datasourceType:s,ip:r,password:o,port:n,remark:d,username:u}})}},clickRow:function(e){e.row,e.column,e.id},DSMCList:function(){var e=this,t=null;t=this.inputVal?{current:this.TPage.index,size:this.TPage.size,datasourceName:this.inputVal}:{current:this.TPage.index,size:this.TPage.size},this.TLoading=!0,r.default.DSMCList(t).then(function(t){var a=new o.a({res:t,fieldKey:{data:"records",title:"",total:"total",pageSize:"size"},titleKey:e.tableTitle},"TLoading",e);if(a.init()){var i=a.formatData(),l=i.data,s=i.total;e.tableData=l,e.$set(e.TPage,"total",s)}})},DSMCAdd:function(e){var t=this,a=e.databaseName,i=e.datasourceName,l=e.datasourceType,s=e.ip,n=e.password,d=e.port,u=e.remark,c=e.username;r.default.DSMCAdd({databaseName:a,datasourceName:i,datasourceType:l,ip:s,password:n,port:d,remark:u,username:c}).then(function(e){new o.a({res:e,msg:"添加成功!"}).state(),t.FDVisible=!1,t.DSMCList()})},DSMCUpdate:function(e){var t=this;e.databaseName,e.datasourceName,e.datasourceType,e.ip,e.password,e.port,e.remark,e.username;r.default.DSMCUpdate(e).then(function(e){new o.a({res:e,msg:"修改成功!"}).state(),t.FDVisible=!1,t.DSMCList()})}},mounted:function(){this.DSMCList()}},d={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"data-source-list"},[a("div",{staticClass:"data-source-list-edit-area"},[a("ul",{staticClass:"data-source-list-edit-area-btn"},[a("li",[a("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(t){return e.showDialog({type:"新增"})}}},[e._v("新增")])],1)]),e._v(" "),a("ul",{staticClass:"data-source-list-edit-area-select"},[a("li",[a("el-input",{attrs:{placeholder:"请输入表名/中文名",clearable:"",size:"small"},model:{value:e.inputVal,callback:function(t){e.inputVal=t},expression:"inputVal"}})],1),e._v(" "),a("li",[a("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.DSMCList}},[e._v("搜索")])],1)])]),e._v(" "),a("div",{staticClass:"data-source-list-table"},[a("TableDefault",{attrs:{TLoading:e.TLoading,TTitle:e.tableTitle,TData:e.tableData,TIsShowPage:!0,TTotal:e.TPage.total,TCurrentPage:e.TPage.index,TPageSize:e.TPage.size,TEdit:e.TEdit},on:{editBtnCb:e.editBtnCb,clickCell:e.lickCell,clickRow:e.clickRow,changePage:e.changePage}})],1),e._v(" "),a("FormDialog",{attrs:{FDVisible:e.FDVisible,FDTitle:e.FDTitle,FDWidth:"500",FDForm:e.FDForm,FDFoot:e.FDFoot},on:{editBtnCb:e.editBtnCb}})],1)},staticRenderFns:[]};var u=a("VU/8")(n,d,!1,function(e){a("CgUi")},"data-v-3ae08219",null);t.default=u.exports},CgUi:function(e,t){},Zrlr:function(e,t,a){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},b0ey:function(e,t,a){"use strict";a.d(t,"a",function(){return u});var i=a("mvHQ"),l=a.n(i),s=a("Zrlr"),r=a.n(s),o=a("wxAW"),n=a.n(o),d=a("zL8q"),u=(a.n(d),function(){function e(t){var a=t.res,i=void 0===a?null:a,s=t.code,o=void 0===s?200:s,n=t.msg,d=void 0===n?"成功!":n,u=t.error,c=void 0===u?"暂无数据":u,h=t.fieldKey,p=void 0===h?{data:"data",title:"title",total:"total",pageSize:"pageSize"}:h,m=t.titleKey,f=void 0===m?null:m,y=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,b=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;r()(this,e),this.res=i,this.code=o,this.vm=b,this.load=y,this.msg=d,this.error=c,this.serverError="服务异常",this.fieldKey=p,this.titleKey=JSON.parse(l()(f))}return n()(e,[{key:"init",value:function(){this.vm&&this.load&&(this.vm[this.load]=!1);try{return this.res&&this.res.data&&Number(this.res.data.code)===Number(this.code)?this.res.data.data:(Object(d.Message)({showClose:!0,message:this.error,type:"error"}),null)}catch(e){return Object(d.Message)({showClose:!0,message:this.serverError,type:"error"}),null}}},{key:"state",value:function(){try{this.res&&this.res.data&&Number(this.res.data.code)===Number(this.code)?Object(d.Message)({showClose:!0,message:this.msg,type:"success"}):Object(d.Message)({showClose:!0,message:this.error,type:"error"})}catch(e){Object(d.Message)({showClose:!0,message:this.serverError,type:"error"})}}},{key:"formatData",value:function(){var e={};for(var t in this.fieldKey)if(this.fieldKey.hasOwnProperty(t))if(this.fieldKey[t]){var a=this.res.data.data;if(a&&"{}"!==l()(a)&&!Array.isArray(a))for(var i in a)a.hasOwnProperty(i)&&this.fieldKey[t]===i&&(e[t]=a[i])}else this.titleKey&&(e.title=this.titleKey);return e}}]),e}())},wxAW:function(e,t,a){"use strict";t.__esModule=!0;var i,l=a("C4MV"),s=(i=l)&&i.__esModule?i:{default:i};t.default=function(){function e(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),(0,s.default)(e,i.key,i)}}return function(t,a,i){return a&&e(t.prototype,a),i&&e(t,i),t}}()}});
//# sourceMappingURL=3.dfb0d864e67f6290dc64.js.map