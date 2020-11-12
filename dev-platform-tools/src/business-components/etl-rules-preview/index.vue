<!--
 * @Author: Marlon
 * @Date: 2020-04-01 15:37:57
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-07 10:20:30
 * @Description: 动态展示规则
 -->
 <template>
  <el-dialog
    class="params-preview"
    :title="DigRTitle"
    :visible.sync="dialogVisible"
    :width="DigRWidth? `${DigRWidth}px`:null"
    @close="close"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules" :ref="DigRId" class="DigR_form" size="medium">
      <el-row>
        <el-col :span="10">
          <el-tree
            ref="dongge"
            class="rules-tree"
            :data="DigRTree"
            node-key="id"
            accordion
            highlight-current
            :default-expanded-keys="defaultDigRcurrenKey"
            :current-node-key="DigRcurrenKeycurrentKey"
            :props="defaultProps"
            check-on-click-node
            auto-expand-parent
            @node-click="handleTreeClick"
          >
            <span class="nodeLabel" slot-scope="{ node }">
              <el-tooltip
                v-if="node.label.length > 18"
                effect="dark"
                :content="`${node.label}`"
                placement="left"
              >
                <span>{{ node.label }}</span>
              </el-tooltip>
              <span v-else>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-col>
        <el-col :span="14" style="overflow: auto;">
          <el-form-item
            v-for="(item,key) in DigRForm"
            :key="key"
            :label="item.label"
            label-width="120px"
            :prop="item.prop"
          >
            <!-- 单选 -->
            <el-radio-group v-if="item.displayMode === 1" v-model="form[item.prop]">
              <template v-if="item.paraRange">
                <el-radio v-for="(v, k) in item.paraRange" :label="k" :key="k">{{v}}</el-radio>
              </template>
            </el-radio-group>
            <!-- 多选 -->
            <el-checkbox-group v-if="item.displayMode === 2" v-model="form[item.prop]">
              <template v-if="item.paraRange">
                <el-checkbox v-for="(v, k) in item.paraRange" :label="k" :key="k">{{v}}</el-checkbox>
              </template>
            </el-checkbox-group>
            <!-- 文本 -->
            <el-input v-if="item.displayMode === 3" v-model="form[item.prop]"></el-input>
            <!-- 文本域 -->
            <el-input
              type="textarea"
              :rows="2"
              v-if="item.displayMode === 4 && item.paraType !== 4"
              v-model="form[item.prop]"
            ></el-input>
            <!-- 文本域+筛选 -->
            <div class="search-input" v-if="item.displayMode===4 && item.paraType === 4">
              <el-input v-model="form[item.prop]"></el-input>
              <el-button type="text" @click="add(item)">添加</el-button>
            </div>
            <!-- 下拉-远程获取 -->
            <el-select
              v-if="item.displayMode === 6 && item.paraType ===4"
              v-model="form[item.prop]"
              @focus="getSelectOption(item,$event)"
              clearable
            >
              <el-option
                v-for="item in form[item.prop+'_option']"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- 下拉 -->
            <el-select
              v-if="item.displayMode === 6 && item.paraType !==4"
              v-model="form[item.prop]"
              clearable
            >
              <el-option
                v-for="item in item.paraRange"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <template v-for="(item, index) in DigRFoot">
        <!-- 默认确定按钮 -->
        <el-button
          size="medium"
          :key="index"
          v-if="item.type==='ok'"
          type="primary"
          @click="FDEdit(item)"
        >{{item.label}}</el-button>
      </template>
    </div>
    <!-- 内嵌弹出框(复选框) -->
    <el-dialog width="30%" title="请选择" :visible.sync="innerVisible" append-to-body>
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="(item, index) in checkListOption"
          :key="index"
          :label="item.value"
        >{{item.label}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAll" size="small">全 选/取 消</el-button>
        <el-button type="primary" @click="innerVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
 
 <script>
import API from "api";
import { ResDatas } from "utils/res-format";
const displayMode = [
  {
    key: 1,
    label: "单选",
  },
  {
    key: 2,
    label: "多选",
  },
  {
    key: 3,
    label: "文本",
  },
  {
    key: 4,
    label: "文本域",
  },
  {
    key: 5,
    label: "隐藏域",
  },
  {
    key: 6,
    label: "下拉选",
  },
];
const paraType = [
  {
    key: 1,
    label: "字符串",
  },
  {
    key: 2,
    label: "字典",
  },
  {
    key: 4,
    label: "url",
  },
  {
    key: 5,
    label: "操作",
  },
];
export default {
  props: {
    // 是否显示
    DigRVisible: {
      type: Boolean,
      default: false,
    },
    DigRId: {
      type: String,
      default: "",
    },
    DigRTitle: {
      type: String,
      default: "",
    },
    DigRWidth: {
      type: [String, Number],
      default: "",
    },
    DigRRules: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 底部操作
    DigRFoot: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 激活当前的节点
    DigRcurrenKey: {
      type: Object,
      default: function () {
        return {
          expandedKey: "",
          currentKey: "",
        };
      },
    },
    // 检索条件
    DigRSearch: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 动态构建表单
    DigRForm: {
      type: Array,
      default: function () {
        return [];
      },
    },
    params: {
      type: [String, Number],
      default: function () {
        return "";
      },
    },
    // 当前行信息
    DigRow: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      defaultDigRcurrenKey: [],
      DigRcurrenKeycurrentKey: "",
      dialogVisible: false,
      innerVisible: false,
      DigRTree: [],
      form: {},
      rules: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 多选——内层
      checkList: [],
      checkListOption: [],
      //   临时变量对象
      activeItem_: "",
      activeTree_: "", // 记录当前点击的树
      queryKey_: "", // 记录激活的规则树信息
      clickAdd: false, //记录是否点击了添加
    };
  },
  watch: {
    DigRVisible: {
      handler(newVal) {
        this.dialogVisible = newVal;
      },
    },
    DigRForm: {
      handler(newVal) {
        let obj = {};
        newVal.forEach((item) => {
          obj[item.prop] = item.value;
          if (item.value && item.paraType === 4) {
            if (item.displayMode === 6) {
              // 下拉
              this.getSelectOption(item);
            } else if (item.displayMode === 4) {
              //  文本域-需要手动调用
              if (item.value) {
                this.checkList = item.value.split(",");
              }
            }
          }
          // 下拉+远程获取选项
          if (item.paraType === 4) {
            obj[item.prop + "_option"] = [];
          }
        });
        this.form = Object.assign({}, this.form, obj);
        console.log(newVal, "动态构造表单", this.form);
      },
      deep: true,
      immediate: true,
    },
    // 监测并同步多选与展示的值
    checkList: {
      handler(newVal) {
        this.form[this.activeItem_.prop] = newVal.join(",");
      },
      deep: true,
    },
    // 监测激活的树状节点
    DigRcurrenKey: {
      handler(newVal) {
        if (newVal && newVal.currentKey) {
          this.$nextTick(() => {
            this.$refs.dongge.setCurrentKey(newVal.currentKey);
          });
          this.defaultDigRcurrenKey.push(newVal.expandedKey);
          this.DigRcurrenKeycurrentKey = newVal.currentKey;
          setTimeout(() => {
            this.DigRcurrenKeycurrentKey = newVal.currentKey;
          }, 0);
          if (newVal.parentIds && newVal.parentIds.length) {
            this.activeTree_ = {
              id: newVal.parentIds[newVal.parentIds.length - 1],
              info: {
                parentIds: newVal.parentIds,
              },
            };
          }
          this.$emit("getTreeItemDom", { ruleId: newVal.currentKey });
        } else {
          this.defaultDigRcurrenKey = [];
          this.DigRcurrenKeycurrentKey = "";
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    close() {
      this.clickAdd = false;
      this.$emit("editBtnCb", {
        label: "close",
        close: this.dialogVisible,
      });
    },
    // 确定按钮
    FDEdit(edit) {
      if (edit.cb) {
        this.loop(this.DigRTree, this.activeTree_.id);
        let form = Object.assign({}, this.form);
        this.DigRForm.forEach((item) => {
          // 文本域
          if (item.displayMode === 4 && item.paraType === 4) {
            for (const key in form) {
              if (form.hasOwnProperty(key)) {
                if (item.prop === key) {
                  if (!this.clickAdd) {
                    if (Object.keys(this.DigRow).length) {
                      form[`${item.prop}_option`] = JSON.parse(
                        this.DigRow.rulesContent
                      )[key];
                    }
                  }
                }
              }
            }
          }
        });
        edit.cb(form, this.DigRForm, this.queryKey_, this);
      } else {
        console.error("按钮配置中缺少回调函数(cb)");
      }
    },
    // 点击-树结构
    handleTreeClick(data, Node, node) {
      console.log(data, "规则树点击");
      console.log(this.DigRcurrenKeycurrentKey);
      this.activeTree_ = data;
      this.form = {};
      this.checkListOption = [];
      this.checkList = [];
      this.activeItem_ = "";
      if (data.id == this.DigRcurrenKeycurrentKey) {
        this.$emit("getTreeItemDom", { ruleId: data.id, setValRes: false });
      } else {
        this.$emit("getTreeItemDom", { ruleId: data.id, setValRes: true });
      }
    },
    // 递归查找
    loop(arr, queryKey) {
      let that = this;
      if (arr && arr.length) {
        arr.forEach((item) => {
          if (queryKey === item.id) {
            that.queryKey_ = item;
          }
          if (item.children && item.children.length) {
            that.loop(item.children, queryKey);
          }
        });
      }
    },

    /* 请求 */
    // 树形目录
    getTree() {
      API._publicRuleTypeTree()
        .then((res) => {
          let Res = new ResDatas({
            code: 0,
            res,
          }).init();
          if (Res) {
            this.DigRTree = [
              {
                ...Res.data.children,
                label: Res.data.label,
                id: Res.data.id,
                pid: Res.data.pid,
              },
            ];
          } else {
            this.DigRTree = [];
          }
        })
        .catch((error) => {
          this.DigRTree = [];
          console.error(error);
        });
    },
    // 添加-文本域+远程获取
    add(item) {
      console.log("添加-文本域+远程获取");
      this.activeItem_ = item;
      this.clickAdd = true;
      // 判断取值的地方
      let params = item.paraRange.split("=")[1];
      let type = params.slice(0, 1); // ? or $
      let url = item.paraRange.split("?")[0];
      let urlReq = "";
      let id = "";
      //   参数取值判断
      if (type === "?") {
        let paramsName = params.split("?")[1];
        if (paramsName === "dataSetGroupId") {
          // 地区id
          id = this.DigRSearch.areaId;
        }
      } else if (type === "$") {
        let paramsName = params.split("$")[1];
        id = this.form[paramsName];
      }
      //  请求地址判断
      urlReq = `${url}`;

      this.$set(this.form, `${item.prop}_option`, []);
      console.log(id);
      if (id) {
        this.innerVisible = true;
        API.ruleConfigFieldUrl({
          url: urlReq,
          method: "get",
          data: { id },
        }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          let arr = [];
          if (Res && Res.length) {
            Res.forEach((ele) => {
              arr.push({
                ...ele,
                label: ele.targetColumnName
                  ? ele.targetColumnName + ele.targetColumnCode
                  : ele.targetColumnCode,
                value: ele.targetColumnCode,
                code: ele.targetColumnCode,
                name: ele.targetColumnName,
              });
            });
          }
          this.checkListOption = arr;
          this.$set(this.form, `${item.prop}_option`, arr);
        });
      } else {
        this.$message({
          message: "请选择数据集",
          type: "warning",
        });
        console.error("缺少对应的prop(动态DOM)");
      }
    },
    // 下拉-远程获取
    getSelectOption(item) {
      console.log("下拉-远程获取");
      // 判断取值的地方
      let params = item.paraRange.split("=")[1];
      let type = params.slice(0, 1); // ? or $
      let url = item.paraRange.split("?")[0];
      let urlReq = "";
      let id = "";
      //   参数取值判断
      if (type === "?") {
        let paramsName = params.split("?")[1];
        id = this.DigRSearch.areaId;
      } else if (type === "$") {
        let paramsName = params.split("$")[1];
        if (this.form[paramsName]) {
          id = this.form[paramsName];
        } else {
          this.DigRForm.forEach((item_) => {
            if (paramsName === item_.prop) {
              id = item_.value;
            }
          });
        }
      }
      //  请求地址判断
      urlReq = `${url}`;
      this.$set(this.form, `${item.prop}_option`, []);
      if (id) {
        API.ruleConfigSetData({
          url: urlReq,
          method: "get",
          data: { id },
        }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          let arr = [];
          if (Res && Res.length) {
            // TODO 后端同一个接口返回代表不同的接口含义
            Res.forEach((ele) => {
              arr.push({
                ...ele,
                label:
                  (ele.targetTableName
                    ? ele.targetTableName + ele.targetTableCode
                    : ele.targetTableCode) ||
                  (ele.targetColumnName
                    ? ele.targetColumnName + ele.targetColumnCode
                    : ele.targetColumnCode),
                value: ele.id,
                code: ele.targetTableCode || ele.targetColumnCode,
                name: ele.targetTableName || ele.targetColumnName,
              });
            });
          }
          this.$set(this.form, `${item.prop}_option`, arr);
        });
      } else {
        console.error("缺少对应的prop(id)");
      }
    },
    // 多选(字段)
    handleAll() {
      if (this.checkList.length) {
        // 取消
        this.checkList = [];
      } else {
        // 全选
        this.checkListOption.forEach((item) => {
          this.checkList.push(item.code);
        });
      }
      this.innerVisible = false;
    },
  },
  mounted() {
    this.getTree();
  },
};
</script>
 
<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.params-preview {
  .search-input {
    width: auto;
    height: auto;
    position: relative;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding-bottom: 30px;
    border-radius: 4px;
    /deep/ .el-input__inner {
      border: 0;
    }
    .el-button--text {
      position: absolute;
      bottom: -5px;
      right: 5px;
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
  /deep/ .el-form-item__label {
    padding-right: 10px;
    height: auto;
  }
  // 树
  .rules-tree {
    float: left;
    width: 300px;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    .nodeLabel {
      display: inline-block;
      width: 220px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      & > span {
        display: inline-block;
        width: inherit;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  /deep/ .el-form-item__content {
    position: relative;
    & > div {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
