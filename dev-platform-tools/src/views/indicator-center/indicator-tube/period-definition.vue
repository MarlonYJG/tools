<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-05-25 20:07:49
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-07-18 15:12:02
 * @Description: 指标中心-指标管理-数据期定义
--> 
 <template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="数据期定义" name="first">
        <div class="indicaor-list">
          <ul class="indicaor-list-btn">
            <li>
              <AddButton text="新建数据期" @click="addTask" :clickArgs="{type: '新建数据期'}"></AddButton>
            </li>
          </ul>
          <div class="indicaor-list-selectBox">
            <ul class="indicaor-list-selectBox-one">
              <li>
                <label for>选择项目：</label>
                <el-select
                  v-model="selectVal"
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  @change="selectChange"
                >
                  <el-option
                    v-for="item in getAreaListCenter"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <el-input
                  v-model="indicatorSearchInput"
                  placeholder="数据期名称查询"
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
            @handleSelectionChange="handleSelectionChange"
          ></TableDefault>
        </div>
        <!-- 新弹框 -->
        <el-dialog
          :title="FDTitle"
          :visible.sync="FDVisible"
          width="500px"
          class="form_dialog"
          :before-close="handleClose"
          :close-on-click-modal="false"
        >
          <el-form
            :model="form"
            :rules="rulesData"
            ref="ruleForm"
            :label-position="labelPosition"
            class="TDForm"
          >
            <el-form-item label="所属项目：" :label-width="formLabelWidth" prop="engineEring">
              <el-select v-model="form.engineEring" style="width:280px">
                <el-option
                  v-for="(items, i) in getAreaListCenter"
                  :key="i"
                  :label="items.label"
                  :value="items.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属业务板块：" :label-width="formLabelWidth" prop="taskName">
              <el-input v-model="form.taskName" autocomplete="off" style="width:280px" disabled></el-input>
            </el-form-item>
            <el-form-item label="数据期：" :label-width="formLabelWidth" prop="dataPeriod">
              <el-input v-model="form.dataPeriod" autocomplete="off" style="width:280px"></el-input>
            </el-form-item>
            <el-form-item label="计算频次：" prop="frequencyNum" :label-width="formLabelWidth">
              <el-input v-model="form.frequencyNum" autocomplete="off" style="width:280px"></el-input>
            </el-form-item>
            <el-form-item label="适用时间修饰词：" :label-width="formLabelWidth" prop="timeCunt">
              <el-select v-model="form.timeCunt" style="width:280px" multiple>
                <el-option
                  v-for="items in timeCuntArr"
                  :key="items.code"
                  :label="items.name"
                  :value="items.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="isShowFooter">
            <el-button type="primary" size="medium" @click="submitForm()">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
 
 <script>
import mixin from "mixin";
import API from "api";
import _ from "lodash";
import { ResDatas } from "utils/res-format";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "periodDefinition",
  data() {
    return {
      // 默认tabs显示第一个
      activeName: "first",
      // 表格
      TLoading: false,
      tableTitle: [
        {
          prop: "name",
          label: "数据期"
        },
        {
          prop: "segmentListStr",
          label: "适用业务板块名称"
        },
        {
          prop: "strategy",
          label: "计算频次"
        },
        {
          prop: "timeModifierStr",
          label: "时间修饰词"
        },
        {
          prop: "creator",
          label: "创建人"
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
      checkboxArr: [], // 选择的复选框
      rowID: "",
      // 新弹框
      FDVisible: false,
      FDTitle: "",
      form: {
        engineEring: "", //所属项目
        taskName: "全部", // 业务板块
        dataPeriod: "", // 数据期
        frequencyNum: "", // 计算频次
        timeCunt: [] // 适用时间修饰词
      },
      formLabelWidth: "135px",
      labelPosition: "right",
      rulesData: {
        engineEring: [
          { required: true, message: "请选择所属项目", trigger: "change" }
        ],
        taskName: [
          { required: true, message: "请输入所属业务板块", trigger: "blur" }
        ],
        dataPeriod: [
          { required: true, message: "请输入数据期", trigger: "blur" }
        ],
        frequencyNum: [
          { required: true, message: "请输入计算频次", trigger: "blur" }
        ],
        timeCunt: [
          { required: true, message: "请选择适用时间修饰词", trigger: "change" }
        ]
      },
      isShowFooter: true,
      // 所属项目
      selectVal: "",
      // selectOpt: [],
      // 时间修饰词数组
      timeCuntArr: [],
      // 业务版块查询搜索框
      indicatorSearchInput: ""
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters({
      getAreaListCenter: "getAreaListCenter"
    })
  },
  methods: {
    ...mapActions(["getArea_list"]),
    // ---------------header--from Start ---------------
    // 点击新增任务按钮
    addTask() {
      this.FDVisible = true;
      this.FDTitle = "新建数据期值域";
      if (this.FDTitle == "新建数据期值域") {
        this.$set(this.form, "engineEring", this.selectVal);
      } else {
        this.$set(this.form, "engineEring", "");
      }
    },
    // 点击新建add与编辑
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let {
            engineEring, //所属项目
            taskName, // 业务板块
            dataPeriod, // 数据期
            frequencyNum, // 计算频次
            timeCunt // 适用时间修饰词
          } = this.form;
          if (this.FDTitle == "新建数据期值域") {
            API.ProjectTaskAdd_dataPeriod({
              name: dataPeriod,
              projectId: engineEring,
              strategy: frequencyNum,
              timeModifier: JSON.stringify(timeCunt)
            })
              .then(res => {
                new ResDatas({
                  res,
                  code: 0,
                  msg: "添加成功！"
                }).state();
                if(res.data.code == 0){
                  this.FDVisible = false;
                  this.getList();
                  this.$refs["ruleForm"].resetFields();
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else if (this.FDTitle == "编辑数据期值域") {
            API.editPro_dataPeriod({
              id: this.rowID,
              name: dataPeriod,
              projectId: engineEring,
              strategy: frequencyNum,
              timeModifier: JSON.stringify(timeCunt)
            })
              .then(res => {
                new ResDatas({res, code: 0, msg: "编辑成功！"}).state();
                if(res.data.code == 0){
                  this.FDVisible = false;
                  this.getList();
                }
              })
              .catch(error => {
                console.error(error);
              });
          }
        }
      });
    },
    // 所属产品选择下拉
    selectChange() {
      this.getList();
    },
    // 业务板块名称查询
    searchIndicator() {
      this.getList();
    },
    // ---------------header--from END ---------------

    // --------------- 表格事件start -------------
    // 表格-点击单元格
    async lickCell({ row, column, id }) {
      let { label } = column;
      if (label == "编辑") this.editCz(row);
      if (label == "删除") this.delCurrent(row);
    },
    // 表格-点击删除
    delCurrent({ name, id }) {
      // 多选超过2个以上不可以进行删除操作
      if (this.checkboxArr.length >= 2) {
        this.$message({
          message: "多选超过2个以上不可以进行删除操作！",
          type: "warning"
        });
        return;
      }
      this.$confirm(`您确定要删除数据期名称为“${name}”吗?`, "提示", {
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
    // 表格-删除操作
    del(id) {
      API.delPro_dataPeriod(id)
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
    editCz(row) {
      const {
        timeModifierStr, // 时间修饰词
        strategy, // 计算频次
        projectId, // 项目ID
        name // 数据期名称
      } = row;
      this.rowID = row.id;
      this.FDVisible = true;
      this.FDTitle = "编辑数据期值域";
      this.$set(this.form, "engineEring", projectId);
      this.$set(this.form, "dataPeriod", name);
      this.$set(this.form, "frequencyNum", strategy);

      let timeModifierStrNew = timeModifierStr.split("、");
      let arr = [];
      this.timeCuntArr.length &&
        this.timeCuntArr.forEach(item => {
          timeModifierStrNew.forEach(iten => {
            if (item.name == iten) {
              arr.push(item.code);
            }
          });
        });
      this.$set(this.form, "timeCunt", arr);
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // ------------- 表格事件END -------------

    // --------------获取接口数据start ------------------
    // 获取表格列表接口
    getList() {
      this.TLoading = true;
      let { total, index, size } = this.TPage;
      API.TableList_dataPeriod({
        dataPeriodName: this.indicatorSearchInput.trim(), //数据期名称
        pageNo: index, // 当前页数
        pageSize: size, //每页数量
        projectId: this.selectVal //项目id
      })
        .then(res => {
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
    // 弹框时间修饰词接口
    timeCunt_list() {
      API.timeCunt_dataPeriod().then(res => {
        let Res = new ResDatas({
            res,
            code: 0
        }).init();
        if(Res){
          this.timeCuntArr = Res;
        }
      });
    },
    // ------------- 获取接口数据END -----------------------
    // 弹框关闭之前
    handleClose(done) {
      this.$refs["ruleForm"].resetFields();
      done();
    },
    // 表格多选赋值
    handleSelectionChange(type, selectionArr) {
      if (type == "checkbox") this.checkboxArr = selectionArr;
    }
  },
  mounted() {
    this.getList();
    this.getArea_list();
    this.timeCunt_list();
  }
};
</script>
 
 <style lang="scss" scoped>
@import "./scss/common.scss";
@import "~@/assets/css/platform/gst/config.scss";
.form_dialog {
  .TDForm {
    .input-n {
      overflow: hidden;
      display: flex;
      margin: 0 auto;
      text-align: center;
      & > li {
        float: left;
        flex: 1;
      }
    }
    .area-type {
      width: 100%;
      max-height: 126px;
      box-sizing: border-box;
      //   border: 1px solid red;
      overflow-x: hidden;
      overflow-y: auto;
      &-list {
        width: 35%;
        float: left;
      }
      &- {
        width: 10%;
        float: left;
      }
      &-icon-add {
        margin-right: 5px;
        font-size: 20px;
        cursor: pointer;
        margin-top: 10px;
        &:hover {
          color: green;
        }
      }
      &-icon-del {
        font-size: 20px;
        cursor: pointer;
        margin-top: 10px;
        &:hover {
          color: red;
        }
      }
    }
    // 底部信息
    .foot-info {
      overflow: hidden;
    }
  }
  /deep/ .el-dialog__header {
    background: $form_dialog_header_bg;
    padding: 8px;
    .el-dialog__title {
      font-size: 16px;
      color: $form_dialog_header_color;
    }
    .el-dialog__headerbtn {
      top: 10px;
      .el-icon-close {
        color: $form_dialog_header_color;
      }
    }
  }
}
</style>

