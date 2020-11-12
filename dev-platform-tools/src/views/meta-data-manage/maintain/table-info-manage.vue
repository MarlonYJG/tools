<!--
 * @Author: Marlon
 * @Date: 2020-02-18 10:26:19
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-29 13:55:57
 * @Description: 表信息明细管理
 -->
<template>
  <div class="table-info">
    <div class="table-info-edit-area">
      <ul class="table-info-edit-area-select">
        <li>
          <el-select v-model="projectVal" filterable clearable placeholder="请选择项目" size="medium">
            <el-option
              v-for="item in projectOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-select v-model="dbVal" filterable clearable placeholder="请选择数据库" size="medium">
            <el-option
              v-for="item in dbOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-select v-model="tableVal" filterable clearable placeholder="请选择表名称" size="medium">
            <el-option
              v-for="item in tableOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div class="table-info-table">
      <!-- 标签页查询条件 -->
      <ul class="tabs-query" v-if="activeName==='1'">
        <li>
          <el-button size="small" @click="showDialog({type:'添加字段'})">添加字段</el-button>
        </li>
        <li>
          <el-input placeholder="请输入字段名/中文名" v-model="inputVal" size="small" @blur="getCList_1">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="getCList_1"
              style="cursor: pointer;"
            ></i>
          </el-input>
        </li>
      </ul>
      <ul v-else-if="activeName==='2'" class="tabs-query">
        <li>
          <el-button size="small" @click="showDialog({type:'添加索引'})">添加索引</el-button>
        </li>
      </ul>
      <ul v-else-if="activeName==='3'" class="tabs-query">
        <li>
          <el-button size="small" @click="showDialog({type:'添加关联关系'})">添加关联关系</el-button>
        </li>
      </ul>
      <ul v-else-if="activeName==='4'" class="tabs-query">
        <li>
          <el-button size="small" @click="showDialog({type:'新增数据分类'})">新增数据分类</el-button>
        </li>
      </ul>
      <ul v-else-if="activeName==='5'" class="tabs-query">
        <li>
          <label for>粒度：</label>
          <el-select v-model="levelVal" clearable filterable placeholder="请选择要查询的粒度" size="small">
            <el-option
              v-for="item in levelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-date-picker
            type="datetimerange"
            size="small"
            v-model="dateVal"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </li>
        <li>
          <el-button type="primary" size="small" @click="logFn">查询</el-button>
        </li>
      </ul>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs-area">
        <el-tab-pane label="字段信息" name="1" class="tabs-area-pane">
          <TableDefault
            TId="1"
            :TAlign="TAlign_1"
            :TLoading="TLoading"
            :TTitle="tableTitle_1"
            :TEdit="TEdit_1"
            :TData="tableData_1"
            :TIsShowPage="true"
            :TTotal="total_1"
            :TCurrentPage="current_1"
            :TPageSize="pageSize_1"
            :TClickItem="TClickItem_1"
            :TSort="TSort_1"
            @clickCell="lickCell"
            @changePage="changePage_1"
            @editBtnCb="editBtnCb"
          ></TableDefault>
        </el-tab-pane>
        <el-tab-pane label="索引信息" name="2" class="tabs-area-pane">
          <TableDefault
            TId="2"
            :TAlign="TAlign_2"
            :TLoading="TLoading"
            :TTitle="tableTitle_2"
            :TEdit="TEdit_2"
            :TData="tableData_2"
            :TIsShowPage="true"
            :TTotal="total_2"
            :TCurrentPage="current_2"
            :TPageSize="pageSize_2"
            :TClickItem="TClickItem_2"
            :TSort="TSort_2"
            @clickCell="lickCell"
            @changePage="changePage_2"
            @editBtnCb="editBtnCb"
          ></TableDefault>
        </el-tab-pane>
        <el-tab-pane label="关联信息" name="3" class="tabs-area-pane">
          <TableDefault
            TId="3"
            :TAlign="TAlign_3"
            :TLoading="TLoading"
            :TTitle="tableTitle_3"
            :TEdit="TEdit_3"
            :TData="tableData_3"
            :TIsShowPage="true"
            :TTotal="total_3"
            :TCurrentPage="current_3"
            :TPageSize="pageSize_3"
            :TClickItem="TClickItem_3"
            :TSort="TSort_3"
            @clickCell="lickCell"
            @changePage="changePage_3"
            @editBtnCb="editBtnCb"
          ></TableDefault>
        </el-tab-pane>
        <el-tab-pane label="数据编辑(字典表)" name="4" class="tabs-area-pane">
          <div class="tabs-area-pane-1">
            <TableDefault
              TId="4-1"
              :TAlign="TAlign_4_1"
              :TLoading="TLoading"
              :TIsShowIndex="TIsShowIndex"
              :THeight="450"
              :TMaxHeight="450"
              :TTitle="tableTitle_4"
              :TEdit="TEdit_4"
              :TData="tableData_4"
              :TIsShowPage="true"
              :TTotal="total_4"
              :TCurrentPage="current_4"
              :TPageSize="pageSize_4"
              :TClickItem="TClickItem_4"
              :TSort="TSort_4"
              @clickCell="lickCell"
              @changePage="changePage_4"
              @editBtnCb="editBtnCb"
              @clickRow="clickRow"
            ></TableDefault>
          </div>
          <p class="fold" @click="flod = !flod">
            <i
              :class="flod ? 'el-icon-arrow-up':'el-icon-arrow-down'"
              style="position: relative;top: -6px;"
            ></i>
          </p>
          <div class="tabs-area-pane-2" v-if="flod">
            <div class="pane-title">
              <div>{{table_4_title.table}}的"{{table_4_title.type}}"的枚举值：</div>
              <el-button
                v-if="!!dictionaryValItem"
                size="medium"
                @click="DictionarySimpleList"
              >新增枚举值</el-button>
            </div>
            <TableDefault
              TId="4-2"
              :TLoading="TLoadingDicVal"
              :TIsShowIndex="TIsShowIndex"
              :THeight="540"
              :TMaxHeight="540"
              :TTitle="tableTitle_4_2"
              :TEdit="TEdit_4_2"
              :TData="tableData_4_2"
              :TIsShowPage="true"
              :TTotal="total_4_2"
              :TCurrentPage="current_4_2"
              :TPageSize="pageSize_4_2"
              :TClickItem="TClickItem_4_2"
              :TSort="TSort_4_2"
              @clickCell="lickCell"
              @changePage="changePage_4_2"
              @editBtnCb="editBtnCb"
            ></TableDefault>
          </div>
        </el-tab-pane>
        <el-tab-pane label="变更历史" name="5" class="tabs-area-pane">
          <TableDefault
            TId="5"
            :TAlign="TAlign_5"
            :TLoading="TLoading"
            :TTitle="tableTitle_5"
            :TData="tableData_5"
            :TIsShowPage="true"
            :TTotal="total_5"
            :TCurrentPage="current_5"
            :TPageSize="pageSize_5"
            :TSort="TSort_5"
            @clickCell="lickCell"
            @changePage="changePage_5"
            @editBtnCb="editBtnCb"
          ></TableDefault>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹出框 -->
    <FormDialog
      :FDId="FDId"
      :FDVisible="FDVisible"
      :FDTitle="FDTitle"
      FDWidth="500"
      :FDForm="FDForm"
      :FDIsLook="FDIsLook"
      :FDFoot="FDFoot"
      :FDRules="FDRules"
      @editBtnCb="editBtnCb"
      @handleChangeCb="handleChangeCb"
      @FDhandlerSelect="handlerSelect"
      @checkBoxCb="checkBoxCb"
    ></FormDialog>
    <!-- 表格弹出框 -->
    <TableDialog
      :TableDigVisible="isShowTableDig"
      :TableDigTitle="tableViewName"
      :TableDigWidth="800"
      :TableData="tableViewData"
      :TableTitle="tableViewTitle"
      :TableDigLoading="isShowTableLoading"
      :TabledigHeight="400"
      :TableDigPage="tableViewPage"
      :TableDigFoot="tableViewFoot"
      :TableDigFootInfo="tableViewFootInfo"
      @editBtnCb="editBtnCb"
    ></TableDialog>
    <!-- 添加关联关系-弹出框 -->
    <el-dialog
      :title="addRelationDigTitle"
      :visible.sync="addRelationDig"
      width="700px"
      class="glgx_dialog"
      :close-on-click-modal="false"
    >
      <el-form size="medium">
        <el-form-item label label-width="120px">
          <ul class="input-n">
            <li>
              <label for>项目：</label>
              <el-select
                filterable
                v-model="AddRelation_projectId"
                placeholder="请选择项目"
                style="120px"
              >
                <el-option
                  v-for="(item, i) in projectOption"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
            <li>
              <label for>类型：</label>
              <el-select filterable v-model="relationTypeVal" placeholder="请选择关联类型" style="120px">
                <el-option
                  v-for="(item, i) in relationType"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="关联编号：" label-width="120px">
          <el-input style="120px" v-model="relationName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关联描述：" label-width="120px">
          <el-input
            style="120px"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 2}"
            placeholder
            v-model="relationNameRemark"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>
        <el-form-item label label-width="120px">
          <ul class="input-n">
            <li>
              <label for>主表：</label>
              <el-select filterable v-model="primaryTableDb" placeholder="主表数据库" style="120px">
                <el-option
                  v-for="(item, i) in tableDb"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
            <li>
              <el-select filterable v-model="primaryTableId" placeholder="主表数据表" style="120px">
                <el-option
                  v-for="(item, i) in primaryTable"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label label-width="120px">
          <ul class="input-n">
            <li>
              <label for>关联表：</label>
              <el-select filterable v-model="relatedTableDb" placeholder="关联表数据库" style="120px">
                <el-option
                  v-for="(item, i) in tableDb"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
            <li>
              <el-select filterable v-model="relatedTableId" placeholder="关联表数据表" style="120px">
                <el-option
                  v-for="(item, i) in relatedTable"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
          </ul>
        </el-form-item>
        <!-- 匹配字段 -->
        <el-form-item
          label
          label-width="120px"
          style="text-align: center;max-height: 120px;overflow-y: auto;"
        >
          <template v-for="(item, index) in addRelationArea">
            <div class="area-type" :key="index">
              <el-form-item label-width="120px" :label="`匹配字段${index+1}：`">
                <el-select v-model="item.primaryTableColumnId" placeholder class="area-type-list">
                  <el-option
                    v-for="items in primaryTableColumn"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value"
                  ></el-option>
                </el-select>
                <span class="area-type-">——</span>
                <el-select v-model="item.relatedTableColumnId" placeholder class="area-type-list">
                  <el-option
                    v-for="items in relatedTableColumn"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value"
                  ></el-option>
                </el-select>
                <i class="el-icon-circle-close area-type-icon-del" @click="areaEdit('del',index)"></i>
                <i
                  class="el-icon-circle-plus-outline area-type-icon-add"
                  v-if="((addRelationArea.length-1) ===index)"
                  @click="areaEdit('add',index)"
                ></i>
              </el-form-item>
            </div>
          </template>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="备注：" label-width="120px">
          <el-input
            style="120px"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder
            v-model="AddRelation_remark"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="RelationAdd">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api";
import { ResDatas, projectDbTable, reqFormatDic } from "utils/res-format";
import { openUrl } from "utils/jump";
import TableDialog from "@/components/dialog/table-dialog";
export default {
  mixins: [mixin],
  components: {
    TableDialog,
  },
  data() {
    return {
      // 添加关联关系-弹出框
      addRelationDigTitle: "",
      addRelationDig: false,
      AddRelation_projectId: "",
      relationTypeVal: "",
      relationType: [],
      relationName: "",
      relationNameRemark: "",
      primaryTableDb: "",
      primaryTableId: "",
      relatedTableDb: "",
      relatedTableId: "",
      primaryTable: [],
      relatedTable: [],
      tableDb: [],
      AddRelation_remark: "",
      addRelationArea: [{ primaryTableColumnId: "", relatedTableColumnId: "" }],
      isUpdate: false, //是否为编辑
      // 主表字段列表
      primaryTableColumn: [],
      // 关联表字段列表
      relatedTableColumn: [],
      /*  */
      flod: true,
      // 下拉
      // 项目、数据库、数据表
      projectOption: [],
      projectVal: "",
      dbOption: [],
      dbVal: "",
      tableOption: [],
      tableVal: "",
      projectDbTableOption: [],
      projectDbTableVal: [],
      dicOption: [],
      dicVal: "",
      columnOption: [],
      columnVal: [],
      // 输入要查询的值
      inputVal: "",
      TLoading: false,
      TIsShowIndex: {
        show: true,
        fixed: false,
      },
      TAlign_1: [
        {
          key: "left",
          item: [
            "projectName",
            "remark",
            "columnNameRemark",
            "dataStandardFieldName",
          ],
        },
      ],
      TAlign_2: [
        {
          key: "left",
          item: ["projectName", "remark", "indexNameRemark"],
        },
      ],
      TAlign_3: [
        {
          key: "left",
          item: ["projectName", "remark"],
        },
      ],
      TAlign_4_1: [
        {
          key: "left",
          item: ["projectName", "remark"],
        },
      ],
      TAlign_5: [
        {
          key: "left",
          item: [
            "projectName",
            "remark",
            "columnNameRemark",
            "dataStandardFieldName",
          ],
        },
      ],
      // 排序
      TSort_1: {
        default: {
          prop: "gmtCreate",
          order: "descending",
        },
        sortArr: [
          {
            prop: "dbName",
          },
          {
            prop: "tableName",
          },
          {
            prop: "columnName",
          },
          {
            prop: "dataType",
          },
          {
            prop: "dataLength",
          },
          {
            prop: "dataFloat",
          },
        ],
      },
      TSort_2: {
        default: {
          prop: "gmtCreate",
          order: "descending",
        },
        sortArr: [
          {
            prop: "dbName",
          },
          {
            prop: "tableName",
          },
        ],
      },
      TSort_3: {
        default: {
          prop: "gmtCreate",
          order: "descending",
        },
        sortArr: [
          {
            prop: "primaryDbName",
          },
          {
            prop: "primaryTableName",
          },
          {
            prop: "relatedDbName",
          },
          {
            prop: "relatedTableName",
          },
          {
            prop: "relationDetail",
          },
        ],
      },
      TSort_4: {
        default: {
          prop: "gmtCreate",
          order: "descending",
        },
        sortArr: [
          {
            prop: "dbName",
          },
          {
            prop: "tableName",
          },
        ],
      },
      TSort_4_2: {
        default: {
          prop: "gmtCreate",
          order: "descending",
        },
      },
      TSort_5: {
        default: {
          prop: "gmtCreate",
          order: "descending",
        },
      },
      // 表格1
      tableTitle_1: [
        { prop: "projectName", label: "所属项目" },
        { prop: "dbName", label: "库名称" },
        { prop: "tableName", label: "表名" },
        { prop: "columnName", label: "字段名" },
        { prop: "columnNameRemark", label: "中文名称" },
        { prop: "dataType", label: "数据类型" },
        { prop: "dataLength", label: "数据长度" },
        { prop: "dataFloat", label: "数据精度" },
        { prop: "dictionaryName", label: "关联字典表" },
        { prop: "isPrimaryStr", label: "是否主键" },
        { prop: "isForeignStr", label: "是否外键" },
        { prop: "isNotNullStr", label: "是否必填" },
        { prop: "dataStandardFieldName", label: "关联数据标准属性" },
        { prop: "remark", label: "备注" },
        { prop: "gmtCreate", label: "创建时间" },
      ],
      TEdit_1: {
        show: true,
        title: "操作",
        fixed: "right",
        width: 150,
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
          },
        ],
      },
      tableData_1: [],
      total_1: 0,
      current_1: 1,
      pageSize_1: 10,
      TClickItem_1: [
        {
          type: "dialog",
          cells: ["dictionaryName"],
          cb: (form) => {
            const { dictionaryId } = form.row;
            if (dictionaryId && dictionaryId !== -1) {
              this.showTableDialog({ type: "字段信息-关联字典表-查看" });
              this.DictionaryValPreview(dictionaryId);
            }
          },
        },
      ],
      columnType: [], // 字段类型
      // 表格2
      tableTitle_2: [
        { prop: "projectName", label: "所属项目" },
        { prop: "dbName", label: "库名" },
        { prop: "tableName", label: "表名" },
        { prop: "indexName", label: "索引编码" },
        { prop: "indexNameRemark", label: "索引中文名" },
        { prop: "indexColumns", label: "对应字段（多个逗号隔开）" },
        { prop: "isUniqueStr", label: "是否唯一索引" },
        { prop: "remark", label: "备注" },
        { prop: "gmtCreate", label: "创建时间" },
      ],
      TEdit_2: {
        show: true,
        title: "操作",
        fixed: "right",
        width: 150,
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
          },
        ],
      },
      tableData_2: [],
      total_2: 0,
      current_2: 1,
      pageSize_2: 10,
      TClickItem_2: [],
      // 表格3
      tableTitle_3: [
        { prop: "relationTypeStr", label: "关联类型" },
        { prop: "relationName", label: "关联编号" },
        { prop: "relationNameRemark", label: "关联描述" },
        { prop: "projectName", label: "所属项目" },
        { prop: "primaryDbName", label: "主表所在库" },
        { prop: "primaryTableName", label: "主表名称" },
        { prop: "relatedDbName", label: "关联表所在库" },
        { prop: "relatedTableName", label: "关联表名称" },
        { prop: "relationDetail", label: "匹配关系" },
        { prop: "remark", label: "备注" },
        { prop: "gmtCreate", label: "创建时间" },
      ],
      TEdit_3: {
        show: true,
        title: "操作",
        fixed: "right",
        width: 150,
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
          },
        ],
      },
      tableData_3: [],
      total_3: 0,
      current_3: 1,
      pageSize_3: 10,
      TClickItem_3: [],
      // 表格4
      tableTitle_4: [
        { prop: "projectName", label: "所属项目" },
        { prop: "dbName", label: "所属库" },
        { prop: "tableName", label: "对应表" },
        { prop: "category", label: "分类" },
        { prop: "remark", label: "备注" },
        { prop: "gmtCreate", label: "创建时间" },
      ],
      TEdit_4: {
        show: true,
        title: "操作",
        // fixed: "right",
        width: 180,
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
          },
          {
            label: "预览数据",
            css: "text",
          },
        ],
      },
      tableData_4: [],
      total_4: 0,
      current_4: 1,
      pageSize_4: 10,
      TClickItem_4: [],
      remark_4: "",
      // 表4-详情
      tableTitle_4_2: [
        {
          label: "值",
          prop: "dictValue",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "创建时间",
          prop: "gmtCreate",
        },
      ],
      TEdit_4_2: {
        show: true,
        title: "操作",
        // fixed: "right",
        width: 100,
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
          },
        ],
      },
      tableData_4_2: [],
      total_4_2: 0,
      current_4_2: 1,
      pageSize_4_2: 10,
      TClickItem_4_2: [],
      TLoadingDicVal: false,
      table_4_title: {
        table: "",
        type: "",
      },
      dictionaryValItem: "", //获取点击的字典(行)
      // 表格5
      tableTitle_5: [
        { prop: "levelCode", label: "粒度" },
        { prop: "operateTypeCode", label: "操作" },
        { prop: "operateDetail", label: "操作详情" },
        { prop: "belong", label: "归属" },
        { prop: "manager", label: "操作者" },
        { prop: "gmtCreate", label: "创建时间" },
      ],
      tableData_5: [],
      total_5: 0,
      current_5: 1,
      pageSize_5: 10,
      // 弹出框
      FDFoot: {
        button: [],
      },
      FDVisible: false,
      FDTitle: "",
      FDIsLook: false,
      FDForm: [], // 弹出框配置
      FDId: "form_dialog_1",
      FDRules: {},
      activeName: "1", // 选择的标签页
      // 表格-弹出框
      isShowTableDig: false,
      tableViewName: "",
      isShowTableLoading: false,
      tableViewTitle: [],
      tableViewData: [],
      tableViewPage: {
        show: false,
        currentPage: 1,
        pageSize: 100000,
      },
      tableViewFoot: {
        show: false,
        data: [],
      },
      tableViewFootInfo: {
        show: true,
        type: "textarea",
        disabled: true,
        placeholder: "",
        model: "asdfsdf",
      },
      /* 变更历史 */
      dateVal: [],
      levelOption: [],
      levelVal: "",
      tableId_: "", // 临时获取点击的行信息对象
    };
  },
  watch: {
    projectVal: function (newVal) {
      if (newVal) {
        this.getDb(newVal);
      } else {
        this.dbOption = [];
        this.dbVal = "";
      }
      this.searchFn();
    },
    dbVal: function (newVal) {
      if (newVal) {
        this.getTable(newVal);
      } else {
        this.tableOption = [];
        this.tableVal = "";
      }
      this.searchFn();
    },
    tableVal() {
      this.searchFn();
    },
    activeName: function (newVal) {
      switch (newVal) {
        case "1":
          this.getCList_1();
          this.getColumnTyps();
          return;
        case "2":
          {
            this.getIList();
          }
          return;
        case "3":
          {
            this.getRelationType();
            this.RelationList();
          }
          return;
        case "4":
          this.DictionaryList();
          return;
        case "5":
          {
            this.getLevel();
            this.logFn();
          }
          return;
        default:
          break;
      }
    },
    AddRelation_projectId: function (newVal) {
      // this.primaryTableDb = "";
      // this.relatedTableDb = "";
      if (newVal) {
        this.getRDb({ id: newVal });
      }
    },
    primaryTableDb: function (newVal) {
      // this.primaryTableId = "";
      if (newVal) {
        this.getRTable({ type: "primary", id: newVal });
      }
    },
    relatedTableDb: function (newVal) {
      // this.relatedTableId = "";
      if (newVal) {
        this.getRTable({ type: "related", id: newVal });
      }
    },
    primaryTableId: function (newVal) {
      if (this.addRelationArea.length) {
        this.addRelationArea.forEach((item) => {
          // item.primaryTableColumnId = "";
        });
      }
      if (newVal) {
        this.getRColumn({ type: "primary", tableId: newVal });
      }
    },
    relatedTableId: function (newVal) {
      if (this.addRelationArea.length) {
        this.addRelationArea.forEach((item) => {
          // item.relatedTableColumnId = "";
        });
      }
      if (newVal) {
        this.getRColumn({ type: "related", tableId: newVal });
      }
    },
  },
  methods: {
    // 区域类型操作(自定义)
    areaEdit(type, i) {
      if (type === "del") {
        if (this.addRelationArea.length) {
          if (this.addRelationArea.length - 1 !== 0) {
            this.addRelationArea.splice(i, 1);
          }
        }
      } else {
        let dom = { primaryTableColumnId: "", relatedTableColumnId: "" };
        this.addRelationArea.push(dom);
      }
    },
    // 表格-回调
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.FDVisible = editItem.close;
        this.isShowTableDig = editItem.close;
        this.FDForm = [];
      } else if (text === "删除") {
        switch (this.activeName) {
          case "1":
            this.del_1({ id: row.id });
            return;
          case "2":
            this.del_2({ id: row.id });
            return;
          case "3":
            this.RelationDel(row.id);
            return;
          case "4":
            if (tid === "4-1") {
              this.DictionaryDel({ id: row.id });
            } else {
              this.DictionaryValDel({ id: row.id });
            }
            return;
          default:
            break;
        }
      }
    },
    // 复选框-级联
    checkBoxCb({ type, value, form }) {
      if (type.key === "isPrimary") {
        this.FDForm.forEach((item) => {
          if (item.type === "cascader") {
            item.defaultModel = form[item.key];
          } else if (item.type === "input-2") {
            let arr = item.inputItem;
            arr.forEach((ele) => {
              ele.input.defaultModel = form[ele.input.key];
            });
          } else if (item.type == "checkbox") {
            let checkbox = item.option;
            checkbox.forEach((ite) => {
              ite.defaultModel = form[ite.key];
            });
          } else {
            if (item.key) {
              item.defaultModel = form[item.key];
            }
          }
        });
        if (value) {
          this.$set(this.FDForm[5].option[1], `show`, true);
          this.$set(this.FDForm[5].option[3], `defaultModel`, true);
        } else {
          this.$set(this.FDForm[5].option[1], `show`, false);
        }
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      switch (type) {
        case "添加字段":
          {
            this.FDTitle = "新增字段";
            this.FDVisible = true;
            let projectName_dbId_tableId = projectDbTable(
              this.projectDbTableOption,
              {
                projectId: this.projectVal,
                dbId: this.dbVal,
                tableId: this.tableVal,
              }
            );
            this.FDForm = [
              {
                type: "cascader",
                label: {
                  name: "项目/数据库/数据表",
                  width: "170",
                },
                key: "projectName_dbId_tableId",
                width: "280",
                clearable: false,
                defaultModel: projectName_dbId_tableId,
                placeholder: "请选择项目、数据库及数据表",
                options: this.projectDbTableOption,
              },
              {
                type: "input",
                label: {
                  name: "字段名",
                  width: "170",
                },
                key: "columnName",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "中文名",
                  width: "170",
                },
                key: "columnNameRemark",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "数据类型",
                  width: "170",
                },
                key: "dataType",
                width: "280",
                defaultModel: "",
                placeholder: "",
                option: this.columnType,
              },
              {
                type: "input-2",
                label: {
                  name: "",
                  width: "",
                },
                width: "280",
                inputItem: [
                  {
                    label: "数据长度",
                    input: {
                      type: "number",
                      disabled: false,
                      width: "100",
                      key: "dataLength",
                      defaultModel: 0,
                      placeholder: "",
                    },
                  },
                  {
                    label: "数据精度",
                    input: {
                      type: "number",
                      disabled: false,
                      width: "100",
                      key: "dataFloat",
                      defaultModel: 0,
                      placeholder: "",
                    },
                  },
                ],
              },
              {
                type: "checkbox",
                label: {
                  name: "",
                  width: "",
                },
                width: "280",
                option: [
                  {
                    show: true,
                    key: "isPrimary",
                    defaultModel: false,
                    label: "是否主键",
                  },
                  {
                    show: false,
                    defaultModel: true,
                    key: "isAutoIncrement",
                    label: "是否自动递增",
                  },
                  {
                    show: true,
                    defaultModel: false,
                    key: "isForeign",
                    label: "是否外键",
                  },
                  {
                    show: true,
                    key: "isNotNull",
                    defaultModel: false,
                    label: "是否必填",
                  },
                ],
              },
              {
                type: "select",
                label: {
                  name: "关联主表/字典表",
                  width: "170",
                },
                key: "dictionaryId",
                width: "200",
                defaultModel: -1,
                placeholder: "",
                option: [],
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "170",
                },
                key: "remark",
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.FDRules = {
              projectName_dbId_tableId: [
                {
                  required: true,
                  message: "请选择项目、数据库及数据表",
                  trigger: "change",
                },
              ],
              columnName: [
                { required: true, message: "请输入字段名", trigger: "blur" },
              ],
              dataType: [
                { required: true, message: "请选择类型", trigger: "change" },
              ],
            };
            if (this.activeName === "1") {
              this.getDic(
                {
                  projectId: this.projectVal,
                  dbId: this.dbVal,
                  tableId: this.tableVal,
                },
                false
              );
            }
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.add_1({
                        ...form,
                        projectId: this.projectVal,
                        dbId: this.dbVal,
                        tableId: this.tableVal,
                      });
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "字段编辑":
          {
            this.FDTitle = "编辑字段";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "cascader",
                label: {
                  name: "项目/数据库/数据表",
                  width: "170",
                },
                key: "projectName_dbId_tableId",
                width: "280",
                clearable: false,
                defaultModel: initDig.projectName_dbId_tableId,
                placeholder: "请选择项目、数据库及数据表",
                options: this.projectDbTableOption,
              },
              {
                type: "input",
                label: {
                  name: "字段名",
                  width: "170",
                },
                key: "columnName",
                width: "280",
                defaultModel: initDig.columnName,
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "中文名",
                  width: "170",
                },
                key: "columnNameRemark",
                width: "280",
                defaultModel: initDig.columnNameRemark,
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "数据类型",
                  width: "170",
                },
                key: "dataType",
                width: "280",
                defaultModel: initDig.dataType,
                placeholder: "",
                option: this.columnType,
              },
              {
                type: "input-2",
                label: {
                  name: "",
                  width: "",
                },
                width: "280",
                inputItem: [
                  {
                    label: "数据长度",
                    input: {
                      type: "number",
                      disabled: false,
                      width: "100",
                      key: "dataLength",
                      defaultModel: initDig.dataLength,
                      placeholder: "",
                    },
                  },
                  {
                    label: "数据精度",
                    input: {
                      type: "number",
                      disabled: false,
                      width: "100",
                      key: "dataFloat",
                      defaultModel: initDig.dataFloat,
                      placeholder: "",
                    },
                  },
                ],
              },
              {
                type: "checkbox",
                label: {
                  name: "",
                  width: "",
                },
                width: "280",
                option: [
                  {
                    show: true,
                    key: "isPrimary",
                    defaultModel: initDig.isPrimary ? true : false,
                    label: "是否主键",
                  },
                  {
                    show: initDig.isAutoIncrement ? true : false,
                    defaultModel: true,
                    key: "isAutoIncrement",
                    label: "是否自动递增",
                  },
                  {
                    show: true,
                    defaultModel: initDig.isForeign ? true : false,
                    key: "isForeign",
                    label: "是否外键",
                  },
                  {
                    show: true,
                    key: "isNotNull",
                    defaultModel: initDig.isNotNull ? true : false,
                    label: "是否必填",
                  },
                ],
              },
              {
                type: "select",
                label: {
                  name: "关联主表/字典表",
                  width: "170",
                },
                key: "dictionaryId",
                width: "200",
                defaultModel: initDig.dictionaryId,
                placeholder: "",
                option: this.dicOption,
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "170",
                },
                key: "remark",
                width: "280",
                defaultModel: initDig.remark,
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            if (this.activeName === "1") {
              this.getDic(
                {
                  projectId: initDig.projectId,
                  dbId: initDig.dbId,
                  tableId: initDig.tableId,
                },
                true
              );
            }
            this.FDRules = {
              projectName_dbId_tableId: [
                {
                  required: true,
                  message: "请选择项目、数据库及数据表",
                  trigger: "change",
                },
              ],
              columnName: [
                { required: true, message: "请输入字段名", trigger: "blur" },
              ],
              dataType: [
                { required: true, message: "请选择类型", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      const { projectName_dbId_tableId } = form;
                      let projectName_dbId_tableId_ = projectName_dbId_tableId[2].split(
                        "-"
                      );
                      this.update_1({
                        ...form,
                        projectId: Number(projectName_dbId_tableId_[0]),
                        dbId: Number(projectName_dbId_tableId_[1]),
                        tableId: Number(projectName_dbId_tableId_[2]),
                      });
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "添加索引":
          {
            this.FDTitle = "新增索引";
            this.FDVisible = true;
            let projectName_dbId_tableId = projectDbTable(
              this.projectDbTableOption,
              {
                projectId: this.projectVal,
                dbId: this.dbVal,
                tableId: this.tableVal,
              }
            );
            this.FDForm = [
              {
                type: "cascader",
                label: {
                  name: "项目/数据库/数据表",
                  width: "170",
                },
                key: "projectName_dbId_tableId",
                width: "280",
                clearable: false,
                defaultModel: projectName_dbId_tableId,
                placeholder: "请选择项目、数据库及数据表",
                options: this.projectDbTableOption,
              },
              {
                type: "input",
                label: {
                  name: "索引名",
                  width: "170",
                },
                width: "280",
                key: "indexName",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "中文名",
                  width: "170",
                },
                width: "280",
                key: "indexNameRemark",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "对应字段",
                  width: "170",
                },
                width: "200",
                multiple: {
                  show: true,
                  collapseTags: true,
                },
                defaultModel: [],
                placeholder: "",
                key: "indexColumnIds",
                option: [],
              },
              {
                type: "checkbox",
                label: {
                  name: "",
                  width: "",
                },
                width: "280",
                option: [
                  {
                    show: true,
                    key: "isUnique",
                    defaultModel: false,
                    label: "是否唯一索引",
                  },
                ],
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "170",
                },
                width: "280",
                key: "remark",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.FDRules = {
              projectName_dbId_tableId: [
                {
                  required: true,
                  message: "请选择项目、数据库及数据表",
                  trigger: "change",
                },
              ],
              indexName: [
                { required: true, message: "请输入索引名", trigger: "blur" },
              ],
              indexColumnIds: [
                { required: true, message: "请选择字段", trigger: "change" },
              ],
            };
            if (this.tableVal) {
              this.getColumn(this.tableVal, true);
            }
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.add_2({
                        ...form,
                        projectId: this.projectVal,
                        dbId: this.dbVal,
                        tableId: this.tableVal,
                      });
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "索引-编辑":
          {
            this.FDTitle = "编辑索引";
            this.FDVisible = true;
            const {
              projectName_dbId_tableId,
              indexName,
              indexNameRemark,
              indexColumnIds,
              isUnique,
              remark,
            } = initDig;
            this.FDForm = [
              {
                type: "cascader",
                label: {
                  name: "项目/数据库/数据表",
                  width: "170",
                },
                key: "projectName_dbId_tableId",
                width: "280",
                clearable: false,
                defaultModel: projectName_dbId_tableId,
                placeholder: "请选择项目、数据库及数据表",
                options: this.projectDbTableOption,
              },
              {
                type: "input",
                label: {
                  name: "索引名",
                  width: "170",
                },
                width: "280",
                key: "indexName",
                defaultModel: indexName,
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "中文名",
                  width: "170",
                },
                width: "280",
                key: "indexNameRemark",
                defaultModel: indexNameRemark,
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "对应字段",
                  width: "170",
                },
                width: "200",
                multiple: {
                  show: true,
                  collapseTags: true,
                },
                defaultModel: indexColumnIds,
                placeholder: "",
                key: "indexColumnIds",
                option: this.columnOption,
              },
              {
                type: "checkbox",
                label: {
                  name: "",
                  width: "",
                },
                width: "280",
                option: [
                  {
                    show: true,
                    key: "isUnique",
                    defaultModel: isUnique ? true : false,
                    label: "是否唯一索引",
                  },
                ],
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "170",
                },
                width: "280",
                key: "remark",
                defaultModel: remark,
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.FDRules = {
              projectName_dbId_tableId: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
              indexName: [
                { required: true, message: "请输入索引名", trigger: "blur" },
              ],
              indexColumnIds: [
                { required: true, message: "请选择字段", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      const { projectName_dbId_tableId } = form;
                      let projectName_dbId_tableId_ = projectName_dbId_tableId[2].split(
                        "-"
                      );
                      this.update_2({
                        ...form,
                        projectId: Number(projectName_dbId_tableId_[0]),
                        dbId: Number(projectName_dbId_tableId_[1]),
                        tableId: Number(projectName_dbId_tableId_[2]),
                      });
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "字典-编辑":
          {
            this.FDTitle = "编辑数据类型";
            this.FDVisible = true;
            const { projectName_dbId_tableId, category, remark } = initDig;
            this.FDForm = [
              {
                type: "cascader",
                label: {
                  name: "项目/数据库/数据表",
                  width: "170",
                },
                key: "projectName_dbId_tableId",
                width: "280",
                clearable: false,
                defaultModel: projectName_dbId_tableId,
                placeholder: "请选择项目、数据库及数据表",
                options: this.projectDbTableOption,
              },
              {
                type: "input",
                label: {
                  name: "分类名称",
                  width: "170",
                },
                width: "280",
                key: "category",
                defaultModel: category,
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "170",
                },
                width: "280",
                key: "remark",
                defaultModel: remark,
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.FDRules = {
              category: [
                { required: true, message: "请输入名称", trigger: "blur" },
              ],
              projectName_dbId_tableId: [
                {
                  required: true,
                  message: "请选择项目、数据库及数据表",
                  trigger: "change",
                },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      const { projectName_dbId_tableId } = form;
                      let projectName_dbId_tableId_ = projectName_dbId_tableId[2].split(
                        "-"
                      );
                      this.DictionaryUpdate({
                        ...form,
                        projectId: Number(projectName_dbId_tableId_[0]),
                        dbId: Number(projectName_dbId_tableId_[1]),
                        tableId: Number(projectName_dbId_tableId_[2]),
                      });
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "新增数据分类":
          {
            this.FDTitle = "新增数据分类";
            this.FDVisible = true;
            let projectName_dbId_tableId = projectDbTable(
              this.projectDbTableOption,
              {
                projectId: this.projectVal,
                dbId: this.dbVal,
                tableId: this.tableVal,
              }
            );
            this.FDForm = [
              {
                type: "cascader",
                label: {
                  name: "项目/数据库/数据表",
                  width: "170",
                },
                key: "projectName_dbId_tableId",
                width: "280",
                clearable: false,
                defaultModel: projectName_dbId_tableId,
                placeholder: "请选择项目、数据库及数据表",
                options: this.projectDbTableOption,
              },
              {
                type: "input",
                label: {
                  name: "分类名称",
                  width: "170",
                },
                width: "280",
                key: "category",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "170",
                },
                width: "280",
                key: "remark",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.FDRules = {
              category: [
                { required: true, message: "请输入名称", trigger: "blur" },
              ],
              projectName_dbId_tableId: [
                {
                  required: true,
                  message: "请选择项目、数据库及数据表",
                  trigger: "change",
                },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.DictionaryAdd({
                        ...form,
                        projectId: this.projectVal,
                        dbId: this.dbVal,
                        tableId: this.tableVal,
                      });
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "添加关联关系":
          {
            this.addRelationDigTitle = "添加关联关系";
            this.addRelationDig = true;
            this.isUpdate = false;
            // 清除数据
            this.AddRelation_projectId = this.projectVal;
            this.relationName = "";
            this.relationTypeVal = "";
            this.relationNameRemark = "";
            this.primaryTableDb = this.dbVal;
            this.primaryTableId = this.tableVal;
            this.relatedTableDb = this.dbVal;
            this.relatedTableId = this.tableVal;
            this.primaryTable = [];
            this.relatedTable = [];
            this.tableDb = this.dbOption;
            this.AddRelation_remark = "";
            this.addRelationArea = [
              { primaryTableColumnId: "", relatedTableColumnId: "" },
            ];
            this.primaryTableColumn = [];
            this.relatedTableColumn = [];
          }
          return;
        case "查看":
          if (this.activeName === id) {
            this.lookTableId({ id });
          }
          break;
        default:
          return;
      }
    },
    showTableDialog({ type, initDig = null }) {
      switch (type) {
        case "预览数据":
          {
            this.tableViewName = "数据预览";
            this.tableViewFoot = {
              show: false,
              data: [],
            };
            this.tableViewFootInfo = {
              show: true,
              type: "textarea",
              disabled: true,
              placeholder: "",
              model: "",
            };
            this.isShowTableDig = true;
            this.tableViewTitle = [
              {
                label: "id",
              },
              {
                label: "code(编码)",
              },
              {
                label: "name(名称)",
              },
              {
                label: "ord(顺序)",
              },
            ];
            this.tableViewData = [];
          }
          return;
        case "新增枚举值":
          {
            this.tableViewName = "新增数据枚举值";
            this.tableViewFootInfo = {
              show: true,
              type: "textarea",
              disabled: false,
              placeholder: "",
              model: "",
            };
            this.isShowTableDig = true;
            this.tableViewTitle = [
              {
                label: "字段名称",
                prop: "name",
              },
              {
                label: "字段值",
                prop: "value",
                type: "input",
              },
            ];
            this.tableViewData = initDig.data;
            this.$set(this.tableViewFoot, `show`, true);
            this.$set(this.tableViewFoot, `data`, [
              {
                type: "ok",
                label: "确定",
                classType: "primary",
                cb: (form) => {
                  this.DictionaryValAdd(form);
                },
              },
            ]);
          }
          return;
        case "字典值-编辑":
          {
            this.tableViewName = "编辑数据枚举值";
            this.tableViewFootInfo = {
              show: true,
              type: "textarea",
              disabled: false,
              placeholder: "",
              model: initDig.remark,
            };
            this.tableViewTitle = [
              {
                label: "字段名称",
                prop: "name",
              },
              {
                label: "字段值",
                prop: "value",
                type: "input",
              },
            ];
            this.isShowTableDig = true;
            this.tableViewData = initDig.data;
            this.$set(this.tableViewFoot, `show`, true);
            this.$set(this.tableViewFoot, `data`, [
              {
                type: "ok",
                label: "确定",
                classType: "primary",
                cb: (form) => {
                  this.DictionaryValUpdate(form);
                },
              },
            ]);
          }
          return;
        case "字段信息-关联字典表-查看":
          {
            this.tableViewName = "查看关联字典表";
            this.tableViewFoot = {
              show: false,
              data: [],
            };
            this.tableViewFootInfo = {
              show: true,
              type: "textarea",
              disabled: true,
              placeholder: "",
              model: "",
            };
            this.isShowTableDig = true;
            this.tableViewTitle = [
              {
                label: "id",
              },
              {
                label: "code(编码)",
              },
              {
                label: "name(名称)",
              },
              {
                label: "ord(顺序)",
              },
            ];
            this.tableViewData = [];
          }
          return;
        default:
          break;
      }
    },
    // 分页操作
    changePage_1({ pageSize, currentPage }) {
      this.current_1 = currentPage;
      this.pageSize_1 = pageSize;
      this.getCList_1();
    },
    changePage_2({ pageSize, currentPage }) {
      this.current_2 = currentPage;
      this.pageSize_2 = pageSize;
      this.getIList();
    },
    changePage_3({ pageSize, currentPage }) {
      this.current_3 = currentPage;
      this.pageSize_3 = pageSize;
      this.RelationList();
    },
    changePage_4({ pageSize, currentPage }) {
      this.current_4 = currentPage;
      this.pageSize_4 = pageSize;
      this.DictionaryList();
    },
    changePage_4_2({ pageSize, currentPage }) {
      this.current_4_2 = currentPage;
      this.pageSize_4_2 = pageSize;
      if (this.dictionaryValItem) {
        this.DictionaryValList(this.dictionaryValItem);
      }
    },
    changePage_5({ pageSize, currentPage }) {
      this.current_5 = currentPage;
      this.pageSize_5 = pageSize;
      this.logFn();
    },
    async lickCell({ row, column, id }) {
      this.tableId_ = row;
      const {
        projectId,
        dbName,
        dbNameRemark,
        remark,
        dataStandardName,
        dbId,
        tableId,
      } = row;
      switch (column.label) {
        case "编辑":
          {
            if (this.activeName === "2") {
              await this.getColumn(tableId, false);
            } else if (this.activeName == "3") {
              const {
                projectId,
                relationType,
                relationName,
                relationNameRemark,
                primaryTableId,
                relatedTableId,
                remark,
                relationColumnList,
                relatedDbId,
                primaryDbId,
              } = row;
              this.AddRelation_projectId = projectId;
              this.relationTypeVal = relationType;
              this.relationName = relationName;
              this.relationNameRemark = relationNameRemark;
              this.primaryTableId = primaryTableId;
              this.relatedTableId = relatedTableId;
              this.AddRelation_remark = remark;
              this.addRelationArea = relationColumnList;
              this.primaryTableDb = primaryDbId;
              this.relatedTableDb = relatedDbId;
            }
            await this.editTableId(row, { tid: id });
          }
          return;
        case "预览数据":
          {
            this.showTableDialog({ type: "预览数据" });
            this.DictionaryValPreview(row.id);
          }
          return;
        default:
          break;
      }
    },
    clickRow({ row, column, id }) {
      this.dictionaryValItem = row;
      this.DictionaryValList(row);
    },
    // 查询
    searchFn() {
      if (this.dbVal) {
        if (this.projectVal) {
          this.init();
        } else {
          this.$message({
            message: "请首选选择项目",
            type: "warning",
          });
        }
      } else {
        this.init();
      }
    },
    // 切换标签页
    handleClick(tab, event) {
      //   console.log(tab, event);
    },
    // 判断是哪个标签页下的编辑按钮
    editTableId(row, tableObj) {
      switch (this.activeName) {
        case "1": // 字段信息
          {
            const {
              tableId,
              projectId,
              dbId,
              columnName,
              columnNameRemark,
              remark,
              isPrimary,
              isForeign,
              isNotNull,
              dataType,
              dataLength,
              dataFloat,
              dictionaryId,
              isAutoIncrement,
            } = row;
            let projectName_dbId_tableId = projectDbTable(
              this.projectDbTableOption,
              {
                projectId,
                dbId,
                tableId,
              }
            );
            this.showDialog({
              type: "字段编辑",
              initDig: {
                columnName,
                columnNameRemark,
                remark,
                isPrimary,
                isForeign,
                isNotNull,
                dataType,
                dataLength,
                dataFloat,
                dictionaryId,
                projectName_dbId_tableId,
                projectId,
                dbId,
                tableId,
                isAutoIncrement,
              },
            });
          }
          return;
        case "2": // 索引信息
          {
            const {
              projectId,
              dbId,
              tableId,
              indexName,
              indexNameRemark,
              indexColumnIds,
              isUnique,
              remark,
            } = row;
            let projectName_dbId_tableId = projectDbTable(
              this.projectDbTableOption,
              {
                projectId,
                dbId,
                tableId,
              }
            );
            this.showDialog({
              type: "索引-编辑",
              initDig: {
                indexName,
                indexNameRemark,
                indexColumnIds,
                isUnique,
                remark,
                projectName_dbId_tableId,
              },
            });
          }
          return;
        case "3": //关联信息
          {
            this.addRelationDig = true;
            this.isUpdate = true;
          }
          return;
        case "4": // 字典信息
          {
            if (tableObj.tid === "4-1") {
              const { tableId, projectId, dbId, category, remark } = row;
              let projectName_dbId_tableId = projectDbTable(
                this.projectDbTableOption,
                {
                  projectId,
                  dbId,
                  tableId,
                }
              );
              this.showDialog({
                type: "字典-编辑",
                initDig: {
                  category,
                  remark,
                  projectName_dbId_tableId,
                },
              });
            } else {
              let arr_ = [];
              let isTrue = true;
              let obj = "";
              try {
                obj = JSON.parse(row.dictValue);
              } catch (error) {
                isTrue = false;
              }
              if (isTrue && obj) {
                for (const key in obj) {
                  if (obj.hasOwnProperty(key)) {
                    arr_.push({
                      name: key,
                      value: obj[key],
                    });
                  }
                }
              } else {
                console.error("json解析错误");
              }
              this.showTableDialog({
                type: "字典值-编辑",
                initDig: {
                  data: arr_,
                  remark: row.remark,
                },
              });
            }
          }
          return;
        case "5":
          return;
        default:
          break;
      }
    },
    // 判断是哪个标签页下的查看按钮
    lookTableId({ id }) {
      switch (id) {
        case "3":
          {
            // TODO 赋值
            this.FDTitle = "查看关联关系";
            this.FDVisible = true;
            this.FDIsLook = true;
            this.FDForm = [
              {
                type: "input-2",
                label: {
                  name: "",
                  width: "",
                },
                width: "280",
                inputItem: [
                  {
                    label: "项目",
                    input: {
                      type: "select",
                      width: "100",
                      defaultVal: "",
                      placeholder: "",
                      option: [
                        {
                          label: "海淀",
                          value: "haidian",
                        },
                      ],
                    },
                  },
                  {
                    label: "类型",
                    input: {
                      type: "select",
                      width: "100",
                      defaultVal: "",
                      placeholder: "",
                      option: [
                        {
                          label: "海淀",
                          value: "haidian",
                        },
                      ],
                    },
                  },
                ],
              },
              {
                type: "input",
                label: {
                  name: "关联编号",
                  width: "120",
                },
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "关联描述",
                  width: "120",
                },
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
              {
                type: "input-2",
                label: {
                  name: "主表",
                  width: "120",
                },
                width: "280",
                inputItem: [
                  {
                    label: "",
                    input: {
                      type: "select",
                      width: "100",
                      defaultVal: "",
                      placeholder: "",
                      option: [
                        {
                          label: "海淀",
                          value: "haidian",
                        },
                      ],
                    },
                  },
                  {
                    label: "",
                    input: {
                      type: "select",
                      width: "100",
                      defaultVal: "",
                      placeholder: "",
                      option: [
                        {
                          label: "海淀",
                          value: "haidian",
                        },
                      ],
                    },
                  },
                ],
              },
              {
                type: "input-2",
                label: {
                  name: "关联表",
                  width: "120",
                },
                width: "280",
                inputItem: [
                  {
                    label: "",
                    input: {
                      type: "select",
                      width: "100",
                      defaultVal: "",
                      placeholder: "",
                      option: [
                        {
                          label: "海淀",
                          value: "haidian",
                        },
                      ],
                    },
                  },
                  {
                    label: "",
                    input: {
                      type: "select",
                      width: "100",
                      defaultVal: "",
                      placeholder: "",
                      option: [
                        {
                          label: "海淀",
                          value: "haidian",
                        },
                      ],
                    },
                  },
                ],
              },
              {
                type: "area-type",
                label: {
                  name: "",
                  width: "",
                },
                list: [
                  {
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
                  },
                ],
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120",
                },
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
          }
          return;

        default:
          return;
      }
    },
    // 弹出框级联请求
    handleChangeCb(obj, form) {
      const { projectId, dbId, tableId } = obj;
      switch (this.activeName) {
        case "1":
          {
            this.FDForm.forEach((item) => {
              if (item.type === "cascader") {
                item.defaultModel = form[item.key];
              } else if (item.type === "input-2") {
                let arr = item.inputItem;
                arr.forEach((ele) => {
                  ele.input.defaultModel = form[ele.input.key];
                });
              } else if (item.type == "checkbox") {
                let checkbox = item.option;
                checkbox.forEach((ite) => {
                  ite.defaultModel = form[ite.key];
                });
              } else {
                if (item.key) {
                  item.defaultModel = form[item.key];
                }
              }
            });
            this.getDic({ projectId, dbId, tableId }, false);
          }
          break;
        case "2":
          {
            this.FDForm.forEach((item) => {
              if (item.type === "cascader") {
                item.defaultModel = form[item.key];
              } else if (item.type === "input-2") {
                let arr = item.inputItem;
                arr.forEach((ele) => {
                  ele.input.defaultModel = form[ele.input.key];
                });
              } else if (item.type == "checkbox") {
                let checkbox = item.option;
                checkbox.forEach((ite) => {
                  ite.defaultModel = form[ite.key];
                });
              } else {
                if (item.key) {
                  item.defaultModel = form[item.key];
                }
              }
            });
            this.getColumn(tableId, false);
          }
          break;
        default:
          break;
      }
    },
    // 下拉选择
    handlerSelect({ item, val, form }) {
      this.FDForm.forEach((item) => {
        if (item.type === "cascader") {
          item.defaultModel = form[item.key];
        } else if (item.type === "input-2") {
          let arr = item.inputItem;
          arr.forEach((ele) => {
            ele.input.defaultModel = form[ele.input.key];
          });
        } else if (item.type == "checkbox") {
          let checkbox = item.option;
          checkbox.forEach((ite) => {
            ite.defaultModel = form[ite.key];
          });
        } else {
          if (item.key) {
            item.defaultModel = form[item.key];
          }
        }
      });
      if (item.key === "dataType") {
        this.$set(this.FDForm[3], `defaultModel`, val);
        switch (val) {
          case "varchar":
            {
              this.$set(this.FDForm[4].inputItem[0].input, `disabled`, false);
              this.$set(this.FDForm[4].inputItem[0].input, `defaultModel`, 255);
              this.$set(this.FDForm[4].inputItem[1].input, `disabled`, true);
              this.$set(this.FDForm[4].inputItem[1].input, `defaultModel`, 0);
            }
            return;
          case "char":
            {
              this.$set(this.FDForm[4].inputItem[0].input, `disabled`, false);
              this.$set(this.FDForm[4].inputItem[0].input, `defaultModel`, 1);
              this.$set(this.FDForm[4].inputItem[1].input, `disabled`, true);
              this.$set(this.FDForm[4].inputItem[1].input, `defaultModel`, 0);
            }
            return;
          case "text":
            {
              this.$set(this.FDForm[4].inputItem[0].input, `disabled`, true);
              this.$set(this.FDForm[4].inputItem[0].input, `defaultModel`, -1);
              this.$set(this.FDForm[4].inputItem[1].input, `disabled`, true);
              this.$set(this.FDForm[4].inputItem[1].input, `defaultModel`, 0);
            }
            return;
          case "integer":
            {
              this.$set(this.FDForm[4].inputItem[0].input, `disabled`, false);
              this.$set(this.FDForm[4].inputItem[0].input, `defaultModel`, 11);
              this.$set(this.FDForm[4].inputItem[1].input, `disabled`, false);
              this.$set(this.FDForm[4].inputItem[1].input, `defaultModel`, 0);
            }
            return;
          case "long":
            {
              this.$set(this.FDForm[4].inputItem[0].input, `disabled`, false);
              this.$set(this.FDForm[4].inputItem[0].input, `defaultModel`, 20);
              this.$set(this.FDForm[4].inputItem[1].input, `disabled`, false);
              this.$set(this.FDForm[4].inputItem[1].input, `defaultModel`, 0);
            }
            return;
          case "decimal":
            {
              this.$set(this.FDForm[4].inputItem[0].input, `disabled`, false);
              this.$set(this.FDForm[4].inputItem[0].input, `defaultModel`, 20);
              this.$set(this.FDForm[4].inputItem[1].input, `disabled`, false);
              this.$set(this.FDForm[4].inputItem[1].input, `defaultModel`, 6);
            }
            return;
          case "date":
            {
              this.$set(this.FDForm[4].inputItem[0].input, `disabled`, true);
              this.$set(this.FDForm[4].inputItem[0].input, `defaultModel`, -1);
              this.$set(this.FDForm[4].inputItem[1].input, `disabled`, true);
              this.$set(this.FDForm[4].inputItem[1].input, `defaultModel`, 0);
            }
            return;
          case "datetime":
            {
              this.$set(this.FDForm[4].inputItem[0].input, `disabled`, true);
              this.$set(this.FDForm[4].inputItem[0].input, `defaultModel`, -1);
              this.$set(this.FDForm[4].inputItem[1].input, `disabled`, true);
              this.$set(this.FDForm[4].inputItem[1].input, `defaultModel`, 0);
            }
            return;

          default:
            break;
        }
      }
    },

    /* 请求 */
    // 总开关
    init() {
      switch (this.activeName) {
        case "1":
          this.getCList_1();
          this.getColumnTyps();
          return;
        case "2":
          this.getIList();
          return;
        case "3":
          {
            this.getRelationType();
            this.RelationList();
          }
          return;
        case "4":
          this.DictionaryList();
          return;
        case "5":
          {
            this.getLevel();
            this.logFn();
          }
          return;
        default:
          break;
      }
    },
    // 获取 项目、数据库、表
    getProject() {
      API._publicTree({ level: 1 }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        });
        let arr = [];
        if (Res.init() && Res.init().length) {
          Res.init().forEach((item) => {
            arr.push({
              label: item.nodeName,
              value: item.projectId,
            });
          });
        }
        this.projectOption = arr;
      });
    },
    getDb(id) {
      API._publicDataBase({ projectId: id }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        });
        let arr = [];
        if (Res.init() && Res.init().length) {
          Res.init().forEach((item) => {
            arr.push({
              label: item.nodeName,
              value: item.dbId,
            });
          });
        }
        this.dbOption = arr;
      });
    },
    getTable(id) {
      API._publicDataTable({ dbId: id }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        });
        let arr = [];
        if (Res.init() && Res.init().length) {
          Res.init().forEach((item) => {
            arr.push({
              label: item.nodeName,
              value: item.tableId,
            });
          });
        }
        this.tableOption = arr;
      });
    },
    getDic({ projectId, dbId, tableId }, isTrue) {
      API._publicDictionary({ projectId, dbId, tableId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        let dic = [];
        if (Res.length) {
          Res.forEach((item) => {
            dic.push({
              label: item.dictName,
              value: item.dictId,
            });
          });
          if (!isTrue) {
            this.$set(this.FDForm[6], `defaultModel`, dic[0].value);
          }
        }
        this.dicOption = dic;
        this.$set(this.FDForm[6], `option`, dic);
      });
    },
    // 索引信息-获取对应字段列表
    getColumn(id, isTrue) {
      API._publicColumn({ tableId: id }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        let col = [];
        if (Res.length) {
          Res.forEach((item) => {
            col.push({
              label: item.columnName,
              value: item.columnId,
            });
          });
        }
        this.columnOption = col;
        if (isTrue) {
          this.$set(this.FDForm[3], `defaultModel`, []);
        }
        this.$set(this.FDForm[3], `option`, col);
      });
    },
    /* 字段管理 */
    // 字段类型列表
    getColumnTyps() {
      API._publicColumnTypeList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
          error: "获取字段类型失败!",
        }).init();
        let columnTypeArr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            columnTypeArr.push({
              label: item.name,
              value: item.code,
            });
          });
        }
        this.columnType = columnTypeArr;
      });
    },
    // 获取
    getCList_1() {
      this.TLoading = true;
      API.CList({
        projectId: this.projectVal,
        dbId: this.dbVal,
        tableId: this.tableVal,
        columnName: this.inputVal,
        pageNo: this.current_1,
        pageSize: this.pageSize_1,
      })
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total",
                pageSize: "pageSize",
                index: "pageNo",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize, index } = Res.formatData();
            this.tableTitle_1 = title;
            this.tableData_1 = data;
            this.total_1 = total;
            this.pageSize_1 = pageSize;
            this.current_1 = index;
          } else {
            this.tableData_1 = [];
            this.total_1 = 0;
            this.current_1 = 1;
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    add_1(req) {
      const {
        tableId,
        columnName,
        columnNameRemark,
        remark,
        isPrimary,
        isForeign,
        isNotNull,
        dataType,
        dataLength,
        dataFloat,
        dictionaryId,
      } = req;
      API.CAdd({
        tableId,
        columnName,
        columnNameRemark,
        remark,
        isPrimary: isPrimary ? 1 : 0,
        isForeign: isForeign ? 1 : 0,
        isNotNull: isNotNull ? 1 : 0,
        dataType,
        dataLength,
        dataFloat,
        dictionaryId,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getCList_1();
      });
    },
    del_1({ id }) {
      API.CDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getCList_1();
      });
    },
    update_1(req) {
      const {
        columnName,
        columnNameRemark,
        remark,
        isPrimary,
        isForeign,
        isNotNull,
        dataType,
        dataLength,
        dataFloat,
        dictionaryId,
        tableId,
      } = req;
      API.CUpdate({
        id: this.tableId_.id,
        tableId,
        columnName,
        columnNameRemark,
        remark,
        isPrimary: isPrimary ? 1 : 0,
        isForeign: isForeign ? 1 : 0,
        isNotNull: isNotNull ? 1 : 0,
        dataType,
        dataLength,
        dataFloat,
        dictionaryId,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getCList_1();
      });
    },
    /* 索引管理 */
    getIList() {
      this.TLoading = true;
      API.IList({
        projectId: this.projectVal,
        dbId: this.dbVal,
        tableId: this.tableVal,
        indexName: "",
        pageNo: this.current_2,
        pageSize: this.pageSize_2,
      })
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total",
                pageSize: "pageSize",
                index: "pageNo",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize, index } = Res.formatData();
            this.tableTitle_2 = title;
            this.tableData_2 = data;
            this.total_2 = total;
            this.pageSize_2 = pageSize;
            this.current_2 = index;
          } else {
            this.tableData_2 = [];
            this.total_2 = 0;
            this.current_2 = 1;
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    add_2(req) {
      const {
        tableId,
        indexName,
        indexNameRemark,
        indexColumnIds,
        isUnique,
        remark,
      } = req;
      API.IAdd({
        tableId,
        indexName,
        indexNameRemark,
        indexColumnIds,
        isUnique: isUnique ? 1 : 0,
        remark,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getIList();
      });
    },
    del_2({ id }) {
      API.IDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getIList();
      });
    },
    update_2(req) {
      const {
        tableId,
        indexName,
        indexNameRemark,
        indexColumnIds,
        isUnique,
        remark,
      } = req;
      API.IUpdate({
        id: this.tableId_.id,
        tableId,
        indexName,
        indexNameRemark,
        indexColumnIds,
        isUnique: isUnique ? 1 : 0,
        remark,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getIList();
      });
    },
    /* 关联信息 */
    //根据项目获取库
    getRDb({ id }) {
      API._publicDataBase({ projectId: id }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        });
        let arr = [];
        if (Res.init() && Res.init().length) {
          Res.init().forEach((item) => {
            arr.push({
              label: item.nodeName,
              value: item.dbId,
            });
          });
        }
        this.tableDb = arr;
      });
    },
    // 根据数据库获取对应表
    getRTable({ type, id }) {
      API._publicDataTable({ dbId: id }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        });
        let arr = [];
        if (Res.init() && Res.init().length) {
          Res.init().forEach((item) => {
            arr.push({
              label: item.nodeName,
              value: item.tableId,
            });
          });
        }
        if (type === "primary") {
          this.primaryTable = arr;
        } else {
          this.relatedTable = arr;
        }
      });
    },
    // 根据表获取对应字段
    getRColumn({ type, tableId }) {
      API._publicColumn({ tableId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        let arr_ = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            arr_.push({
              label: item.columnName,
              value: item.columnId,
            });
          });
        }
        if (type === "primary") {
          this.primaryTableColumn = arr_;
        } else {
          this.relatedTableColumn = arr_;
        }
      });
    },
    // 关联类型列表
    getRelationType() {
      API._publicRelationTypeList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
          error: "获取关联类型列表失败!",
        }).init();
        let relationArr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            relationArr.push({
              label: item.name,
              value: item.code,
            });
          });
        }
        this.relationType = relationArr;
      });
    },
    // 获取
    RelationList() {
      this.TLoading = true;
      API.RelationList({
        pageNo: this.current_3,
        pageSize: this.pageSize_3,
        projectId: this.projectVal,
      })
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total",
                pageSize: "pageSize",
                index: "pageNo",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize, index } = Res.formatData();
            this.tableTitle_3 = title;
            this.tableData_3 = data;
            this.total_3 = total;
            this.pageSize_3 = pageSize;
            this.current_3 = index;
          } else {
            this.tableData_3 = [];
            this.total_3 = 0;
            this.current_3 = 1;
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 添加、编辑-添加关联关系
    RelationAdd() {
      if (this.isUpdate) {
        if (
          this.tableId_.id &&
          this.relationTypeVal &&
          this.relationName &&
          this.AddRelation_projectId &&
          this.primaryTableId &&
          this.relatedTableId &&
          this.addRelationArea.length
        ) {
          API.RelationUpdate({
            id: this.tableId_.id,
            projectId: this.AddRelation_projectId,
            relationType: this.relationTypeVal,
            relationName: this.relationName,
            relationNameRemark: this.relationNameRemark,
            primaryTableId: this.primaryTableId,
            relatedTableId: this.relatedTableId,
            relationColumnList: this.addRelationArea,
            remark: this.AddRelation_remark,
          }).then((res) => {
            new ResDatas({
              res,
              code: 0,
            }).state();
            this.addRelationDig = false;
            this.RelationList();
          });
        } else {
          this.$message({
            message:
              "请检查关联类型、编码、项目、主表、关联表、字段列表是否选择",
            type: "warning",
          });
        }
      } else {
        if (
          this.relationTypeVal &&
          this.relationName &&
          this.AddRelation_projectId &&
          this.primaryTableId &&
          this.relatedTableId &&
          this.addRelationArea.length
        ) {
          API.RelationAdd({
            projectId: this.AddRelation_projectId,
            relationType: this.relationTypeVal,
            relationName: this.relationName,
            relationNameRemark: this.relationNameRemark,
            primaryTableId: this.primaryTableId,
            relatedTableId: this.relatedTableId,
            relationColumnList: this.addRelationArea,
            remark: this.AddRelation_remark,
          }).then((res) => {
            new ResDatas({
              res,
              code: 0,
            }).state();
            this.addRelationDig = false;
            this.RelationList();
          });
        } else {
          this.$message({
            message:
              "请检查关联类型、编码、项目、主表、关联表、字段列表是否选择",
            type: "warning",
          });
        }
      }
    },
    // 删除
    RelationDel(id) {
      API.RelationDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.RelationList();
      });
    },
    /* 字典表管理 */
    DictionaryList() {
      this.TLoading = true;
      let req = reqFormatDic({
        projectId: this.projectVal,
        dbId: this.dbVal,
        tableId: this.tableVal,
        pageNo: this.current_4,
        pageSize: this.pageSize_4,
      });
      API.DictionaryList(req)
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total",
                pageSize: "pageSize",
                index: "pageNo",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize, index } = Res.formatData();
            this.tableTitle_4 = title;
            this.tableData_4 = data;
            this.total_4 = total;
            this.pageSize_4 = pageSize;
            this.current_4 = index;
            // 默认值取值 第一个
            this.dictionaryValItem = data[0];
            this.DictionaryValList(data[0]);
          } else {
            this.tableData_4 = [];
            this.total_4 = 0;
            this.current_4 = 1;
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    DictionaryAdd(req) {
      const { tableId, category, remark } = req;
      API.DictionaryAdd({ tableId, category, remark }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.DictionaryList();
      });
    },
    DictionaryDel({ id }) {
      API.DictionaryDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.DictionaryList();
      });
    },
    DictionaryUpdate(req) {
      const { tableId, category, remark } = req;
      API.DictionaryUpdate({
        tableId,
        category,
        remark,
        id: this.tableId_.id,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.DictionaryList();
      });
    },
    DictionaryValPreview(dictId) {
      this.isShowTableLoading = true;
      API.DictionaryValPreview({ dictId }).then((res) => {
        if (res && res.data.code === 0) {
          let resData = res.data.data;
          this.tableViewTitle = resData.title;
          this.tableViewData = resData.data;
          this.remark_4 = resData.ext.remark;
          this.$set(this.tableViewFootInfo, `model`, this.remark_4);
        } else {
          this.tableViewData = [];
        }
        this.isShowTableLoading = false;
      });
    },
    /* 字典值 */
    // 获取枚举值key列表
    DictionarySimpleList() {
      if (this.dictionaryValItem) {
        API._publicColumn({ tableId: this.dictionaryValItem.tableId }).then(
          (res) => {
            let Res = new ResDatas({
              res,
              code: 0,
            }).init();
            let arr_ = [];
            if (Res && Res.length) {
              Res.forEach((item) => {
                arr_.push({
                  name: item.columnName,
                  value: "",
                });
              });
            }
            this.showTableDialog({
              type: "新增枚举值",
              initDig: { data: arr_ },
            });
          }
        );
      }
    },
    // 获取
    DictionaryValList(req) {
      this.TLoadingDicVal = true;
      this.table_4_title = {
        table: req.tableName,
        type: req.category,
      };
      API.DictionaryValList({
        dictId: req.id,
        pageNo: this.current_4_2,
        pageSize: this.pageSize_4_2,
      })
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total",
                pageSize: "pageSize",
                index: "pageNo",
              },
            },
            "TLoadingDicVal",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize, index } = Res.formatData();
            this.tableData_4_2 = data;
            this.total_4_2 = total;
            this.pageSize_4_2 = pageSize;
            this.current_4_2 = index;
          } else {
            this.tableData_4_2 = [];
            this.total_4_2 = 0;
            this.current_4_2 = 1;
          }
        })
        .catch((error) => {
          this.TLoadingDicVal = false;
          console.error(error);
        });
    },
    DictionaryValAdd(form) {
      if (
        form.TableData &&
        form.TableData.length &&
        this.dictionaryValItem &&
        this.dictionaryValItem.id
      ) {
        // 数据解析
        let reqObj = {};
        form.TableData.forEach((item) => {
          reqObj[item.name] = item.value;
        });
        API.DictionaryValAdd({
          dictId: this.dictionaryValItem.id,
          dictValue: JSON.stringify(reqObj),
          remark: form.FootInfo,
        }).then((res) => {
          new ResDatas({
            res,
            code: 0,
          }).state();
          this.isShowTableDig = false;
          this.DictionaryValList(this.dictionaryValItem);
        });
      } else {
        this.$message({
          message: "请选择字典并输入字典值",
          type: "warning",
        });
      }
    },
    DictionaryValDel({ id }) {
      API.DictionaryValDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.DictionaryValList(this.dictionaryValItem);
      });
    },
    DictionaryValUpdate(req) {
      const { FootInfo, TableData } = req;
      const { dictId, id } = this.tableId_;
      let dictValue = {};
      if (TableData.length) {
        TableData.forEach((item) => {
          dictValue[item.name] = item.value;
        });
      }
      API.DictionaryValUpdate({
        id,
        dictId,
        dictValue: JSON.stringify(dictValue),
        remark: FootInfo,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.isShowTableDig = false;
        this.DictionaryValList(this.dictionaryValItem);
      });
    },
    /* 变更历史 */
    // 获取粒度列表
    getLevel() {
      API._publicLevelTypeList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
          error: "获取粒度列表失败!",
        }).init();
        let levelArr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            levelArr.push({
              label: item.name,
              value: item.code,
            });
          });
        }
        this.levelOption = levelArr;
      });
    },
    // 历时表格
    logFn() {
      let startTime = "";
      let endTime = "";
      if (this.dateVal && this.dateVal.length) {
        startTime = this.dateVal[0];
        endTime = this.dateVal[1];
      }
      this.TLoading = true;
      API.getHistoryList({
        pageNo: this.current_5,
        pageSize: this.pageSize_5,
        projectId: this.projectVal,
        level: this.levelVal,
        startTime,
        endTime,
      })
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total",
                pageSize: "pageSize",
                index: "pageNo",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize, index } = Res.formatData();
            this.tableData_5 = data;
            this.tableTitle_5 = title;
            this.total_5 = total;
            this.pageSize_5 = pageSize;
            this.current_5 = index;
          } else {
            this.tableData_5 = [];
            this.total_5 = 0;
            this.current_5 = 1;
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
  },
  mounted() {
    API._publicTree({ level: 3 }).then((res) => {
      let Res = new ResDatas({
        res,
        code: 0,
        fieldKey: {
          label: "nodeName",
          value: "nodeId",
          children: "subList",
        },
      });
      let arr = [];
      if (Res.init() && Res.init().length) {
        arr = Res.formatCascader(Res.init());
      }
      this.projectDbTableOption = arr;
    });
    this.getProject();
    if (this.$route.query && this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      if (!paramsUrl.projectId) {
        // 来自项目
        this.projectVal = paramsUrl.id;
        this.searchFn();
      } else if (!paramsUrl.dbId) {
        // 来自库
        this.projectVal = paramsUrl.projectId;
        this.dbVal = paramsUrl.id;
        this.searchFn();
      } else {
        // 来自表
        this.projectVal = paramsUrl.projectId;
        this.dbVal = paramsUrl.dbId;
        this.tableVal = paramsUrl.id;
        this.searchFn();
      }
    } else {
      this.searchFn();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.table-info {
  height: 100%;
  &-edit-area {
    overflow: hidden;
    &-btn {
      float: left;
      overflow: hidden;
      li {
        float: left;
        margin: 2px 15px;
      }
    }
    &-select {
      float: left;
      overflow: hidden;
      margin: 4px 55px;
      li {
        float: left;
        margin-right: 20px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  &-table {
    position: relative;
    margin: 20px 0;
    height: calc(100% - 80px);
  }
  // 标签页查询条件
  .tabs-query {
    position: absolute;
    right: 0;
    z-index: 1;
    overflow: hidden;
    margin-right: 15px;
    li {
      float: left;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
    /deep/ .el-range-editor--medium.el-input__inner {
      height: 32px;
    }
  }
  .tabs-area {
    height: 100%;
    /deep/ .el-tabs__content {
      height: calc(100% - 40px);
      box-sizing: border-box;
    }
    &-pane {
      height: calc(100% - 10px);
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: auto;
      .fold {
        height: 25px;
        font-size: 30px;
        position: relative;
        top: -3px;
        width: 100%;
        text-align: center;
        cursor: pointer;
        background: #dadada;
      }
      &-1 {
        height: 540px;
        box-sizing: border-box;
        flex: 1;
        .T-table {
          height: 100%;
          /deep/ .el-table {
            height: calc(100% - 70px) !important;
            max-height: none !important;
          }
        }
      }
      &-2 {
        // height: 540px;
        box-sizing: border-box;
        .pane-title {
          padding-left: 20px;
          height: 90px;
          overflow: hidden;
          div {
            height: 45px;
            line-height: 45px;
            font-size: 14px;
          }
        }
      }
    }
  }
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
  /deep/ .el-table th {
    padding: 2px 0 !important;
  }
}
.glgx_dialog {
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
