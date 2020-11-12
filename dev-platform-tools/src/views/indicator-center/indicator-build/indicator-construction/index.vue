<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-05-17 21:54:13
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-09-22 15:34:20
 * @Description: 指标构建-业务板块管理
--> 
 <template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="业务板块管理" name="first">
        <div class="indicaor-list">
          <ul class="indicaor-list-btn">
            <li>
              <AddButton text="新建业务板块" @click="addTask" :clickArgs="{type: '新建业务板块'}"></AddButton>
              <el-button size="medium" @click="exportExcel()">
                <i class="el-icon-upload el-icon--left" />Excel导出
              </el-button>
            </li>
          </ul>
          <div class="indicaor-list-selectBox">
            <ul class="indicaor-list-selectBox-one">
              <li>
                <label for>所属项目：</label>
                <el-select
                  v-model="selectVal"
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  @change="selectChange"
                >
                  <el-option
                    v-for="item in selectOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <el-input
                  v-model="indicatorSearchInput"
                  placeholder="业务板块名称查询"
                  size="small"
                  style="width:250px"
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    style="cursor: pointer"
                    @click="searchIndicator()"
                  ></i>
                </el-input>
              </li>
            </ul>
          </div>
        </div>
        <!-- 表格 -->
        <div class="task-list-table">
          <TableDefault
            :TLoading="TLoading"
            :TIsShowCheckBox="true"
            :TAlign="TAlign"
            :TTitle="tableTitle"
            :TData="tableData"
            :TEdit="TEdit"
            :TIsShowPage="true"
            :TTotal="TPage.total"
            :TCurrentPage="TPage.index"
            :TPageSize="TPage.size"
            @clickCell="lickCell"
            @changePage="changePage"
            :TClickItem="TClickItem"
            @handleSelectionChange="handleSelectionChange"
          ></TableDefault>
        </div>
        <!-- 弹出框 -->
        <FormDialog
          :FDId="FDId"
          :FDVisible="FDVisible"
          :FDTitle="FDTitle"
          FDWidth="500"
          :FDForm="FDForm"
          :FDFoot="FDFoot"
          :FDRules="FDRules"
          @editBtnCb="editBtnCb"
          @handleClose="handleClose"
        ></FormDialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
 
 <script>
import mixin from "mixin";
import API from "api";
import _ from "lodash";
import commonMixin from "../mixins/common";
import { reqFormatDic, ResDatas } from "utils/res-format";
import { chnName, enName } from "utils";

export default {
  name: "BusinessSegments",
  data() {
    return {
      // 默认tabs显示第一个
      activeName: "first",
      // 表格
      TLoading: false,
      tableTitle: [
        {
          prop: "code",
          label: "编码"
        },
        {
          prop: "name",
          label: "业务板块名称"
        },
        {
          prop: "dataDomainCount",
          label: "数据域个数"
        },
        {
          prop: "indicatorCount",
          label: "指标个数"
        },
        {
          prop: "dimensionCount",
          label: "维度"
        },
        {
          prop: "projectName",
          label: "所属项目"
        },
        {
          prop: "manager",
          label: "创建人"
        },
        {
          prop: "remark",
          label: "备注"
        },
        {
          prop: "gmtCreate",
          label: "创建时间"
        }
      ],
      TAlign: [], // 控制文本位置
      TEdit: {
        show: true,
        title: "操作",
        width: 200,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "success"
          },
          {
            label: "删除",
            pass: true,
            css: "danger"
          }
        ]
      },
      tableData: [],
      TPage: {
        total: 0, // 条数
        index: 1, // 当前页
        size: 10 // 当前页显示条数
      },
      // 可跳转的值
      TClickItem: [
        {
          link: "/indicator/construct/DataFields?to=two&from=business",
          cells: ["dataDomainCount"]
        },
        {
          link: "/indicator/construct/Indicators",
          cells: ["indicatorCount"]
        },
        {
          link: "/indicator/construct/Dimension?form=businessSegments",
          cells: ["dimensionCount"]
        }
      ],
      // 弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: []
      },
      FDRules: {},
      checkboxArr: [], // 选择的复选框
      // fileterNameArr: [], // 表格业务板块名称一列
      // codeterNameArr: [], // 表格编码一列
      // 所属项目
      selectVal: "",
      selectOpt: [],
      //  业务版块查询搜索框
      indicatorSearchInput: ""
    };
  },
  mixins: [mixin, commonMixin],
  watch: {},
  methods: {
    // ---------------header--from Start ---------------
    // 点击新增任务按钮
    addTask() {
      this.PopupContent("新增业务板块", "新增", {projectName: this.selectVal});
    },
    // EXCEL 导出
    exportExcel() {
      if (this.checkboxArr.length <= 0) {
        this.$message({
          message: "请选择导出范围！",
          type: "warning"
        });
        return;
      }
      let arr = [];
      this.checkboxArr.forEach(item => {
        arr.push(item.id);
      });
      let businessSegmentIds = arr.join(","); // 选中的id

      let isAll = 0;
      if (this.selectVal || this.indicatorSearchInput.trim()) {
        isAll = 0;
      } else {
        isAll = this.checkboxArr.length == this.TPage.total ? 1 : 0; // 是否全部选中
      }
      window.location.href =
        "/constructionservice/business-segment/export?" +
        `businessSegmentIds=${businessSegmentIds}&isAll=${isAll}&businessSegmentName=${this.indicatorSearchInput.trim()}&projectId=${this.selectVal}`;
    },
    // 所属产品选择下拉
    selectChange() {
      this.getList();
    },
    // 业务板块名称查询
    searchIndicator() {
      this.getList();
    },
    // 弹出框关闭回调事件
    editBtnCb({ label, close }) {
      if (label == "close") this.FDVisible = close;
    },
    // ---------------header--from END ---------------

    // ----------   表格事件start -------------
    // 单元格事件
    async lickCell({ row, column, id }) {
      let { label } = column;
      if (label == "编辑") this.editCz(row);
      if (label == "删除") this.delCurrent(row);
    },
    // 表格-点击删除
    delCurrent({ name, dataDomainCount, indicatorCount, dimensionCount, id }) {
      // 多选超过2个以上不可以进行删除操作
      if (this.checkboxArr.length >= 2) {
        this.$message({
          message: "多选超过2个以上不可以进行删除操作！",
          type: "warning"
        });
        return;
      }
      this.$confirm(`您确定要删除业务板块“${name}”吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.del(id);
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 表格删除操作
    del(id) {
      API.delPro({ id })
        .then(res => {
          new ResDatas({res, code: 0, msg: "删除成功！"}).state();
          if(res.data.code == 0){
            this.getList();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 表格编辑操作
    editCz(initDig) {
      this.PopupContent("编辑业务板块", "编辑", initDig);
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // ----------   表格事件END -------------

    // --------------获取接口数据start ------------------
    // 获取所属项目下拉列表
    getColumnTypeList() {
      API.getAreaList()
        .then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          if(Res){
            this.selectOpt = this.formatGetArr(Res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 增加
    add(req) {
      const { taskName, taskCode, engineEring, remark } = req;
      API.projectTaskAdd({
        businessSegmentCode: taskCode, //编码
        businessSegmentName: taskName, // 名称
        projectId: engineEring, //项目id
        remark: remark //备注
      })
        .then(res => {
          let { code, message } = res.data;
          new ResDatas({
            res,
            code: 0,
            msg: "添加成功！"
          }).state();
          if (res.data.code == 0) {
            this.FDVisible = false;
            this.getList();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取表格列表接口
    getList() {
      this.TLoading = true;
      let { total, index, size } = this.TPage;
      API.projectTaskList({
        businessSegmentName: this.indicatorSearchInput.trim(), // 业务板块名称
        pageNo: index, // 当前页数
        pageSize: size, //每页数量
        projectId: this.selectVal //项目id
      })
        .then(res => {
          let { code, message } = res.data;
           let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total"
              }
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total} = Res.formatData();
            this.tableData = data;
            this.tableTitle = title;
            this.$set(this.TPage, `total`, total);
          }else {
            this.tableData = [];
            this.TLoading = false;
            this.$set(this.TPage, `total`, 0);
          }
        })
        .catch(error => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 转换数组
    formatGetArr(data) {
      let newArr = [];
      data.map(item => {
        if (
          item.hasOwnProperty("projectId") &&
          item.hasOwnProperty("projectName")
        ) {
          newArr.push({
            value: item["projectId"],
            label: item["projectName"]
          });
        }
      });
      return newArr;
    },
    // 取下拉列表id
    getId(arr = [], name = "") {
      let val = "";
      this.selectOpt.forEach(item => {
        if (item.label == name) {
          val = item.value;
        }
      });
      return val;
    },
    // 编辑当前-列表接口
    getNewEdit({ taskName, taskCode, engineEring, remark }, id) {
      API.editPro({
        businessSegmentCode: taskCode, // 业务板块编码
        businessSegmentName: taskName, // 业务板块名称
        id, // 业务板块Id
        projectId: _.isNumber(engineEring)
          ? engineEring
          : this.getId(this.selectOpt, engineEring), // 所属项目Id
        remark: remark // 备注
      })
        .then(res => {
          new ResDatas({res, code: 0, msg: "编辑成功！"}).state();     
          if (res.data.code == 0) {
            this.FDVisible = false;
            this.getList();
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    // ------------- 获取接口数据END -----------------------

    // 验证名称
    async asyncChnName(rule, value, callback) {
      if (!value) {
        callback(new Error("请输入名称"));
      } else if (!chnName(value)) {
        callback(new Error("请输入正确的中文名称或查看输入格式"));
      } else {
        return callback();
      }
    },
    // 验证编码
    async asyncEnName(rule, value, callback) {
      if (!value) {
        callback(new Error("请输入编码"));
      } else if (!enName(value)) {
        callback(new Error("请输入正确的英文名"));
      } else {
        return callback();
      }
    },
    // 弹出框公共部分
    PopupContent(FDTitle = "标题", type, initDig = {}) {
      this.FDTitle = FDTitle;
      this.FDVisible = true;
      this.FDForm = [
        {
          type: "input",
          label: {
            name: "业务板块名称",
            width: "135"
          },
          width: "280",
          key: "taskName",
          defaultModel: initDig.name || "",
          placeholder: ""
        },
        {
          type: "input",
          label: {
            name: "业务板块编码",
            width: "135"
          },
          width: "280",
          key: "taskCode",
          defaultModel: initDig.code || "",
          placeholder: ""
        },
        {
          type: "select",
          label: {
            name: "所属项目",
            width: "135"
          },
          width: "280",
          key: "engineEring",
          defaultModel: initDig.projectName || "",
          placeholder: "",
          option: this.selectOpt
        },
        {
          type: "textarea",
          label: {
            name: "备注",
            width: "135"
          },
          width: "280",
          key: "remark",
          defaultModel: initDig.remark || "",
          placeholder: "",
          autosize: {
            min: 2,
            max: 4
          }
        }
      ];
      // 规则校验
      this.FDRules = {
        taskName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          },
          // {
          //   validator: this.asyncChnName,
          //   trigger: ["blur", "change"]
          // }
        ],
        taskCode: [
          { required: true, message: "请输入编码", trigger: "blur" },
          // {
          //   validator: this.asyncEnName,
          //   trigger: ["blur", "change"]
          // }
        ],
        engineEring: [
          { required: true, message: "请选择所属项目", trigger: "change" }
        ]
      };
      // 编辑
      setTimeout(() => {
        this.$set(this.FDFoot, `button`, [
          {
            type: "ok",
            label: "确定",
            cb: (form, $this) => {
              $this.$refs[this.FDId].validate(valid => {
                if (valid) {
                  // 点击编辑项目
                  if (type == "编辑") {
                    this.getNewEdit(form, initDig.id);
                  } else if (type == "新增") {
                    this.add(form);
                  }
                }
              });
            }
          }
        ]);
      }, 0);
    }
  },
  mounted() {
    this.getList();
    this.getColumnTypeList();
  }
};
</script>
 
 <style lang="scss" scoped>
@import "../scss/common.scss";
</style>
