<!--
 * @Author: Marlon
 * @Date: 2020-02-19 10:06:12
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-09 09:28:58
 * @Description: 表单弹出框
 -->
<template>
  <el-dialog
    :title="FDTitle"
    :visible.sync="dialogTableVisible"
    :width="FDWidth === '' ? null : `${FDWidth}px`"
    @close="close"
    class="form_dialog"
    :close-on-click-modal="false"
  >
    <el-form
      v-if="FDVisible"
      :model="form"
      :rules="rules"
      :ref="FDId"
      class="TDForm"
      size="medium"
    >
      <template v-for="(item, index) in FDForm">
        <!-- 输入框 -->
        <el-form-item
          v-if="item.type === 'input' && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <el-input
            :disabled="FDIsLook || item.disabled"
            :style="`width:${Number(item.width)}px`"
            v-model="form[item.key]"
            autocomplete="off"
            :clearable="item.clearable || null"
            :show-password="item.showPassword"
          ></el-input>
        </el-form-item>
        <!-- 下拉选择 -->
        <el-form-item
          v-if="item.type === 'select' && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <el-select
            :disabled="FDIsLook || item.disabled"
            filterable
            v-model="form[item.key]"
            :placeholder="item.placeholder"
            :multiple="item.multiple && item.multiple.show ? true : false"
            :collapse-tags="
              item.multiple && item.multiple.collapseTags ? true : false
            "
            :style="`width:${Number(item.width)}px`"
            :clearable="item.clearable || null"
            @change="handlerSelect(item, $event)"
            @visible-change="visibleChange(item, $event)"
          >
            <el-option
              v-for="(items, i) in item.option"
              :key="i"
              :label="items.label"
              :value="items.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 下拉选择树 -->
        <el-form-item
          v-if="item.type === 'select-tree' && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <TreeSelect
            :disabled="FDIsLook || item.disabled"
            filterable
            v-model="form[item.key]"
            :placeholder="item.placeholder"
            :multiple="item.multiple && item.multiple.show ? true : false"
            :collapse-tags="
              item.multiple && item.multiple.collapseTags ? true : false
            "
            :style="`width:${Number(item.width)}px`"
            :clearable="item.clearable || null"
            @deselect="handlerSelect(item, $event)"
            :options="item.option"
            search-nested
          ></TreeSelect>
        </el-form-item>
        <!-- 级联菜单 -->
        <el-form-item
          v-if="item.type === 'cascader' && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <el-cascader
            :disabled="FDIsLook || item.disabled"
            :placeholder="item.placeholder"
            :style="`width:${Number(item.width)}px`"
            v-model="form[item.key]"
            :options="item.options"
            :props="{ expandTrigger: 'hover' }"
            size="small"
            filterable
            :clearable="item.clearable"
            @change="handleChange"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf">({{ data.children.length }})</span>
            </template>
          </el-cascader>
        </el-form-item>
        <!-- 文本域 -->
        <el-form-item
          v-if="item.type === 'textarea' && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <el-input
            :disabled="FDIsLook || item.disabled"
            :style="`width:${Number(item.width)}px`"
            type="textarea"
            :autosize="{
              minRows: item.autosize.min,
              maxRows: item.autosize.min,
            }"
            :placeholder="item.placeholder"
            v-model="form[item.key]"
            :show-word-limit="!!item.width"
          ></el-input>
        </el-form-item>
        <!-- 多段类型(默认2段) -->
        <el-form-item
          v-if="item.type === 'input-2' && item.inputItem.length && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <ul class="input-n">
            <li v-for="(items, i) in item.inputItem" :key="i">
              <el-tooltip
                v-if="!!items.tip"
                class="item"
                effect="dark"
                :content="items.tip"
                placement="top"
              >
                <label for v-if="items.label">{{ items.label }}：</label>
              </el-tooltip>
              <label v-else for>{{
                items.label ? `${items.label}：` : ""
              }}</label>
              <el-input-number
                v-if="items.input.type === 'number'"
                :style="`width:${Number(items.input.width)}px`"
                controls-position="right"
                :disabled="items.input.disabled || false"
                v-model="form[items.input.key]"
              ></el-input-number>

              <el-select
                v-else-if="items.input.type === 'select'"
                :disabled="FDIsLook || item.disabled"
                filterable
                v-model="form[items.key]"
                :placeholder="items.input.placeholder"
                :multiple="
                  items.input.multiple ? items.input.multiple.show : null
                "
                :collapse-tags="
                  items.input.multiple
                    ? items.input.multiple.collapseTags
                    : null
                "
                :style="`width:${Number(items.input.width)}px`"
              >
                <el-option
                  v-for="(itemss, i) in items.input.option"
                  :key="i"
                  :label="itemss.label"
                  :value="itemss.value"
                ></el-option>
              </el-select>

              <el-input
                v-else
                :disabled="FDIsLook || item.disabled"
                :style="`width:${Number(items.input.width)}px`"
                v-model="form[item.key]"
                autocomplete="off"
              ></el-input>
            </li>
          </ul>
        </el-form-item>
        <!-- 单选 -->
        <el-form-item
          v-if="item.type === 'radio' && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          style="text-align: center"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <el-radio-group v-model="form[item.key]">
            <el-radio
              v-for="(items, i) in item.radioItem"
              :disabled="FDIsLook || item.disabled"
              :key="i"
              :label="items.value"
              >{{ items.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <!-- 开关 -->
        <el-form-item
          v-if="item.type === 'switch' && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          style="text-align: left"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <el-switch
            v-model="form[item.key]"
            :active-text="item.on.label"
            :active-color="item.on.color"
            :inactive-text="item.off.label"
          ></el-switch>
        </el-form-item>
        <!-- 复选框 -->
        <el-form-item
          v-if="item.type === 'checkbox' && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          style="text-align: center"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <template v-for="(ite, index) in item.option">
            <el-checkbox
              v-if="ite.show || null"
              v-model="form[ite.key]"
              :label="ite.label"
              :key="index"
              @change="checkBoxFn(ite, $event)"
            ></el-checkbox>
          </template>
        </el-form-item>
        <!-- 区域类型 -->
        <el-form-item
          v-if="item.type === 'area-type' && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          style="text-align: center"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <div class="area-type">
            <el-form-item
              v-for="(items, i) in item.list"
              :key="i"
              :label-width="`${items.label.width}px`"
              :label="!!items.label.name ? `${items.label.name}：` : ''"
              :prop="items.key || null"
              :required="rulesKey.includes(item.key) ? true : null"
            >
              <el-select
                v-model="form[item.key]"
                :disabled="FDIsLook || item.disabled"
                :placeholder="items.selectItem[0].placeholder"
                class="area-type-list"
              >
                <el-option
                  v-for="itemss in items.selectItem[0].option"
                  :key="itemss.value"
                  :label="itemss.label"
                  :value="itemss.value"
                ></el-option>
              </el-select>
              <span class="area-type-">——</span>
              <el-select
                v-model="form[item.key]"
                :disabled="FDIsLook || item.disabled"
                :placeholder="items.selectItem[1].placeholder"
                class="area-type-list"
              >
                <el-option
                  v-for="itemss in items.selectItem[1].option"
                  :key="itemss.value"
                  :label="itemss.label"
                  :value="itemss.value"
                ></el-option>
              </el-select>
              <i
                v-if="!FDIsLook"
                class="el-icon-circle-close area-type-icon-del"
                @click="areaEdit('del', item.list, i)"
              ></i>
              <i
                class="el-icon-circle-plus-outline area-type-icon-add"
                v-if="!FDIsLook && item.list.length - 1 === i"
                @click="areaEdit('add', item.list, i)"
              ></i>
            </el-form-item>
          </div>
        </el-form-item>
        <!-- 文件上传 -->
        <el-form-item
          v-if="item.type === 'upload' && !item.show"
          :label="!!item.label.name ? `${item.label.name}：` : ''"
          :label-width="`${item.label.width}px`"
          :key="index"
          :prop="item.key || null"
          style="text-align: center"
          :required="rulesKey.includes(item.key) ? true : null"
        >
          <div style="text-align: left">
            <el-upload
              ref="upload"
              accept=".xlsx"
              :action="item.url"
              :on-preview="handlePreview"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              :on-change="handleChangeFiles"
              :file-list="filesList"
              multiple
              :auto-upload="false"
              :data="item.data || null"
              :name="item.name || 'file'"
              :limit="item.limit || null"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
              <el-button
                style="margin-left: 10px"
                size="small"
                type="success"
                @click="submitUpload"
                >上传到服务器</el-button
              >
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <!-- 底部信息 -->
    <div class="foot-info">{{ FDFootInfo }}</div>
    <div slot="footer" class="dialog-footer" v-if="!FDIsLook">
      <template v-for="(item, index) in FDFoot.button">
        <!-- 默认确定按钮 -->
        <Debounce time="1500" :key="index">
          <el-button
            size="medium"
            v-if="item.type === 'ok'"
            type="primary"
            @click="FDEdit(item)"
            >{{ item.label }}</el-button
          >
        </Debounce>
        <!-- 非默认按钮类 -->
        <Debounce time="1500" :key="index">
          <el-button
            size="medium"
            :key="index"
            v-if="item.type === 'button'"
            @click="FDEdit(item)"
            >{{ item.label }}</el-button
          >
        </Debounce>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import Debounce from "@/components/debounce/index";
import { projectIdDbIdTableId } from "utils";
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  props: {
    // Id
    FDId: {
      type: [Number, String],
      default: "",
    },
    // 标题
    FDTitle: {
      type: String,
      default: "",
    },
    // 是否显示
    FDVisible: {
      type: Boolean,
      default: false,
    },
    // 弹出框宽度
    FDWidth: {
      type: String,
      default: "",
    },
    // 表单元素
    FDForm: {
      type: Array,
      default: function () {
        return [
          {
            type: "input",
            label: {
              name: "活动名称",
              width: "auto",
            },
            width: "120",
            defaultModel: "",
            placeholder: "",
          },
          {
            type: "select",
            label: {
              name: "活动名称",
              width: "auto",
            },
            width: "120",
            defaultModel: "",
            placeholder: "",
          },
          {
            type: "textarea",
            label: {
              name: "活动名称",
              width: "auto",
            },
            width: "80",
            defaultModel: "",
            placeholder: "",
            autosize: {
              min: 2,
              max: 4,
            },
          },
        ];
      },
    },
    // 表单元素验证规则
    FDRules: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 是否仅仅查看
    FDIsLook: {
      type: Boolean,
      default: false,
    },
    // 底部操作
    FDFoot: {
      type: Object,
      default: function () {
        return {
          type: "submit",
          button: [
            // {
            //   type: "button",
            //   label: "取消"
            // },
            {
              type: "ok",
              label: "确定",
            },
          ],
        };
      },
    },
    // 底部信息
    FDFootInfo: {
      type: String,
      default: "",
    },
  },
  components: { TreeSelect, Debounce },
  data() {
    return {
      dialogTableVisible: false, // 控制弹出框显示
      form: {
        // isAutoIncrement: true
      }, // 表单
      rules: {}, // 验证规则
      rulesKey: [],
      cascaderOption: [], // 多级菜单下拉选择
      isRunHandleChange: false,
      filesList: [], // 上传的文件列表
    };
  },
  watch: {
    FDVisible(newVal, oldVal) {
      this.dialogTableVisible = newVal;
      this.rules = this.FDRules;
    },
    FDForm: {
      handler(newVal, oldVal) {
        // 动态生成表单字段并初始化值
        let obj_ = {};
        let obj__ = {};
        let obj_checkBox = {};
        let obj_select_mutiple = {};
        if (newVal.length) {
          newVal.forEach((item) => {
            if (item.type === "cascader") {
              this.cascaderOption = item.options;
              obj_[item.key] = item.defaultModel;
            } else if (item.type === "input-2") {
              let arr = item.inputItem;
              arr.forEach((ele) => {
                obj__[ele.input.key] = ele.input.defaultModel;
              });
            } else if (item.type == "checkbox") {
              let checkbox = item.option;
              checkbox.forEach((ite) => {
                obj_checkBox[ite.key] = ite.defaultModel;
              });
            } else if (item.type === "area-type") {
            } else {
              if (item.key) {
                obj_[item.key] = item.defaultModel;
              }
            }
          });
          this.form = Object.assign({}, this.form, obj_, obj__, obj_checkBox);
          console.log(this.form, "根据key动态创建form字段并初始化值");
        }
        this.rules = this.FDRules;
      },
      deep: true,
    },
    FDRules: {
      handler(newVal) {
        this.rulesKey = [];
        for (const key in newVal) {
          if (newVal.hasOwnProperty(key)) {
            this.rulesKey.push(key);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    // select下拉选择——关联
    handlerSelect(item, val) {
      this.$emit("FDhandlerSelect", { item, val, form: this.form });
    },
    // 下拉框出现/隐藏时触发
    visibleChange(item, isTrue) {
      this.$emit("visibleChange", item, isTrue, this.form);
    },
    // 级联下拉选择——关联
    handleChange(item) {
      this.isRunHandleChange = true;
      let obj = projectIdDbIdTableId(this.cascaderOption, item);
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          this.form[key] = obj[key];
        }
      }
      this.$emit("handleChangeCb", obj, this.form);
    },
    // 确定按钮
    FDEdit(edit) {
      if (edit.cb) {
        if (!this.isRunHandleChange) {
          let obj = {};
          this.FDForm.forEach((item) => {
            if (item.type === "cascader") {
              obj = projectIdDbIdTableId(
                this.cascaderOption,
                this.form[item.key]
              );
            }
          });
          this.form = Object.assign({}, this.form, obj);
        }
        edit.cb(this.form, this);
      } else {
        console.error("按钮配置中缺少回调函数(cb)");
      }
    },
    // 关闭弹出框
    close() {
      this.isRunHandleChange = true;
      if (this.FDId && this.$refs[this.FDId]) {
        this.$refs[this.FDId].resetFields();
      }
      // 清空上传文件列表
      this.filesList = [];
      this.$emit(
        "editBtnCb",
        {
          label: "close",
          close: this.dialogTableVisible,
        },
        this.FDId
      );
    },
    // 区域类型操作(自定义)
    areaEdit(type, list, i) {
      if (type === "del") {
        if (list.length) {
          if (list.length - 1 !== 0) {
            list = list.splice(i, 1);
          }
        }
      } else {
        let dom = {
          label: {
            name: "匹配字段",
            width: "120",
          },
          selectItem: [
            {
              placeholder: "",
              option: [
                {
                  label: "值",
                  value: "值",
                },
              ],
            },
            {
              placeholder: "",
              option: [
                {
                  label: "值",
                  value: "值",
                },
              ],
            },
          ],
        };
        list.push(dom);
      }
    },
    // 复选级联——业务处理
    checkBoxFn(item, val) {
      this.$emit("checkBoxCb", { type: item, value: val, form: this.form });
    },
    // 上传文件
    submitUpload() {
      this.$refs.upload[0].submit();
    },
    handleRemove(file, fileList) {
      this.$emit("FDUploadFiles", { type: "remove", file, fileList });
    },
    handlePreview(file) {
      this.$emit("FDUploadFiles", { type: "preview", file });
    },
    beforeUpload(file) {
      if (
        file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        return false;
      }
      return true;
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChangeFiles(file, fileList) {
      // 上传限制1个文件，如果选择多个文件，则只获取最后选择的一个
      let uploadFileOne = "";
      this.FDForm.forEach((item) => {
        if (item.type === "upload") {
          uploadFileOne = item;
        }
      });
      if (uploadFileOne.limitOne && uploadFileOne.limitOne == 1) {
        this.filesList = [fileList.pop()];
      }
      // 上传文件限制为Excel
      if (
        file.raw.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        this.$message({
          message: "请上传Excel文件",
          type: "warning",
        });
        this.filesList = [];
        return false;
      }
    },
    handleSuccess(response, file, fileList) {
      this.$message({
        message: `${response.message}`,
        type: "success",
      });
      this.$emit("FDUploadFiles", {
        type: "success",
        response,
        file,
        fileList,
      });
    },
    handleError(err, file, fileList) {
      this.$message({
        message: `${err}`,
        type: "error",
      });
      this.$emit("FDUploadFiles", { type: "error", file, fileList, err });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/config.scss";
.form_dialog {
  // 多段input
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