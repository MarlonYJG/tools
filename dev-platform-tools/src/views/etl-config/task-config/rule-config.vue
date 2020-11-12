<!--
 * @Author: yangjianguo
 * @Date: 2019-09-09 11:24:17
 * @LastEditors: Marlon
 * @LastEditTime: 2020-04-21 14:28:13
 * @Description: 转换规则配置
 -->
<template>
  <div class="rule-config">
    <!-- 表1 -->
    <div class="info1">
      <div class="info-head">
        <el-select v-model="taskName" placeholder="请选择" @change="changeVal">
          <el-option
            v-for="(item,index) in jobList"
            :key="index"
            :label="item.jobName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="addTarget">添加目标数据集</el-button>
        <el-button type="primary" @click="transRule">转换规则</el-button>
        <el-button type="primary" @click="detailShow">字段搜索</el-button>
        <!-- 批量效验 -->
        <el-badge
          :value="batchEfficacy"
          class="item"
          style="position: relative;top: -2px;left: 9px;"
        >
          <!-- <el-button type="primary" @click="batchEfficacyFn">批量效验</el-button> -->
        </el-badge>
      </div>
      <div class="info-content">
        <el-table
          style="width: 100%;"
          height="300"
          ref="singleTable"
          border
          highlight-current-row
          :data="tableDataList"
          :header-cell-class-name="tableRowClassName"
          @row-click="handleCurrentChange"
        >
          <el-table-column label="序号" type="index" width="64" align="center"></el-table-column>
          <el-table-column label="目标数据集" prop="targetTableName" align="center"></el-table-column>
          <el-table-column label="类别" width="100" prop="sourceTypeName" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.sourceType | typename}}</p>
            </template>
          </el-table-column>
          <el-table-column label="源数据集" prop="sourceContent" align="center"></el-table-column>
          <el-table-column align="center" label="操作" width="650px">
            <template slot-scope="scope">
              <!-- <el-tooltip content="编辑" placement="top">
                <el-button @click="editInfo(scope.row)" type="text" size="small">
                  <i class="el-icon-edit"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="text"
                  size="small"
                  @click.native.stop="deleteRow(scope.$index,tableDataList,scope.row)"
                >
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="转换规则配置" placement="top">
                <el-button
                  type="text"
                  size="small"
                  @click.native.stop="transferRuleSet(scope.$index,tableDataList,scope.row)"
                >
                  <i class="el-icon-eleme"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="清洗规则配置" placement="top">
                <el-button
                  type="text"
                  size="small"
                  @click.native.stop="cleanRuleSet(scope.$index,tableDataList,scope.row)"
                >
                  <i class="el-icon-setting"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="单表执行" placement="top">
                <el-button
                  type="text"
                  size="small"
                  @click.native.stop="startSingleTableJob(scope.$index,tableDataList,scope.row)"
                >
                  <i class="el-icon-zhihang"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="串联执行" placement="top">
                  <el-button
                    type="text"
                    size="small"
                    @click.native.stop="startJobInSeries(scope.$index,tableDataList,scope.row)"
                  >
                    <i class="el-icon-zhihang"></i>
                  </el-button>
              </el-tooltip>-->

              <el-button type="primary" plain size="small" @click="editInfo(scope.row)">编辑</el-button>
              <el-button
                type="danger"
                plain
                size="small"
                @click="deleteRow(scope.$index,tableDataList,scope.row)"
              >删除</el-button>
              <el-button
                type="primary"
                plain
                size="small"
                @click="transferRuleSet(scope.$index,tableDataList,scope.row)"
              >转换规则配置</el-button>
              <el-button
                type="success"
                plain
                size="small"
                @click="cleanRuleSet(scope.$index,tableDataList,scope.row)"
              >清洗规则配置</el-button>
              <el-button
                type="primary"
                plain
                size="small"
                @click="startSingleTableJob(scope.$index,tableDataList,scope.row)"
              >单表执行</el-button>
              <el-button
                type="success"
                plain
                size="small"
                @click="startJobInSeries(scope.$index,tableDataList,scope.row)"
              >串联执行</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="数据预览" width="250px">
            <template slot-scope="scope">
              <!-- 原表预览 -->
              <!-- <el-tooltip content="原表预览" placement="top">
                <el-button
                  type="text"
                  size="small"
                  @click.native.stop="sourceDatasView(scope.$index,tableDataList,scope.row)"
                >
                  <i class="el-icon-document"></i>
                </el-button>
              </el-tooltip>-->

              <!-- 转换数据预览 -->
              <!-- <el-tooltip content="转换数据预览" placement="top">
                <el-button
                  type="text"
                  size="small"
                  @click.native.stop="changeDatasView(scope.$index,tableDataList,scope.row)"
                >
                  <i class="el-icon-document"></i>
                </el-button>
              </el-tooltip>-->
              <el-button
                type="primary"
                plain
                size="small"
                @click="sourceDatasView(scope.$index,tableDataList,scope.row)"
              >原表预览</el-button>
              <el-button
                type="success"
                plain
                size="small"
                @click="changeDatasView(scope.$index,tableDataList,scope.row)"
              >转换数据预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 表2 -->
    <el-collapse value="1" class="own-collapse">
      <el-collapse-item name="1">
        <div class="info2">
          <div class="info-head">
            <el-button type="primary" class="add" @click="addExamine">添加</el-button>
            <div class="title">数据集字段校验明细</div>
            <el-button
              type="primary"
              class="add"
              style="float:right"
              @click="addFieldRemarkInfo"
            >保存备注信息</el-button>
          </div>
          <div class="info-content" v-show="isShowTable">
            <el-table
              style="width: 100%;"
              border
              height="350"
              :data="checkDetailed"
              :header-cell-class-name="tableRowClassName"
            >
              <el-table-column label="序号" type="index" width="64" align="center"></el-table-column>
              <el-table-column label="目标字段" prop="tagrtField" align="center"></el-table-column>
              <el-table-column label="源字段" prop="sourceField" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.sourceField"
                    filterable
                    placeholder="请选择"
                    style="width:100%"
                    @change="updateFiled(scope.row)"
                  >
                    <el-option
                      v-for="(item,index) in scope.row.sourceFieldList"
                      :key="index"
                      :label="item.datasetNames"
                      :value="item.datasetName"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="目标字段备注" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="textarea"
                    rows="1"
                    v-model="scope.row.comment"
                    placeholder
                    style="line-height: normal"
                  ></el-input>
                </template>
              </el-table-column>
              <!-- <el-table-column label="备注" prop="beizhu" align="center"></el-table-column> -->
              <el-table-column align="center" fixed="right" label="操作" width="350">
                <template slot-scope="scope">
                  <!-- <el-button @click="editRule(scope.row,scope.$index)" type="text" size="small">
                    <i class="el-icon-edit"></i>
                  </el-button>-->
                  <!-- <el-tooltip content="转换规则配置" placement="top">
                    <el-button
                      type="text"
                      size="small"
                      @click.native.stop="fieldTransferRuleSet(scope.$index,tableDataList,scope.row)"
                    >
                      <i class="el-icon-eleme"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="清洗规则配置" placement="top">
                    <el-button
                      type="text"
                      size="small"
                      @click.native.stop="fieldTransferRuleSets(scope.$index,tableDataList,scope.row)"
                    >
                      <i class="el-icon-setting"></i>
                    </el-button>
                  </el-tooltip>
                  <el-button
                    type="text"
                    size="small"
                    @click.native.prevent="deleteRow2(scope.$index,checkDetailed,scope.row)"
                  >
                    <i class="el-icon-delete"></i>
                  </el-button>-->
                  <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="fieldTransferRuleSet(scope.$index,tableDataList,scope.row)"
                  >转换规则配置</el-button>
                  <el-button
                    type="success"
                    plain
                    size="small"
                    @click="fieldTransferRuleSets(scope.$index,tableDataList,scope.row)"
                  >清洗规则配置</el-button>
                  <el-button
                    type="danger"
                    plain
                    size="small"
                    @click="deleteRow2(scope.$index,checkDetailed,scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- <el-button type="primary" @click="confirm">确 定</el-button> -->
    <!-- 添加目标数据集 弹框 -->

    <el-dialog
      :visible.sync="targetDialog"
      :close-on-click-modal="false"
      title="选择数据集"
      class="target-dialog"
      @close="closeDialog('targetDialog','targetGatherInfo')"
    >
      <div class="data-gather">
        <el-form
          :model="targetGatherForm"
          :rules="targetGatherRules"
          ref="targetGatherInfo"
          class="rule-convert clear"
        >
          <el-form-item prop="checkList">
            <el-checkbox
              :indeterminate="targetIsIndeterminate"
              v-model="targetCheckAll"
              @change="targetHandleCheckAllChange"
            >全选</el-checkbox>
            <el-checkbox-group
              v-model="targetGatherForm.checkList"
              class="checkGroup"
              @change="targetChange"
            >
              <el-checkbox
                :key="index"
                :label="item.datasetName"
                v-for="(item,index) in targetData"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('targetDialog','targetGatherInfo')">取 消</el-button>
        <el-button type="primary" @click="saveTarget('targetDialog','targetGatherInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑表1 弹框 -->
    <el-dialog :visible.sync="selDataDialog" :close-on-click-modal="false" class="selData-dialog">
      <div class="data-gather">
        <el-form
          :model="selDataForm"
          :rules="selDataRules"
          ref="selDataInfo"
          class="rule-convert clear"
        >
          <el-tabs v-model="activeName2" type="card" @tab-click="changeTab">
            <el-tab-pane label="选择数据集" name="first">
              <el-form-item prop="dataList">
                <el-select
                  v-model="selDataForm.dataList"
                  filterable
                  placeholder="请选择"
                  class="selected"
                >
                  <el-option
                    v-for="(item,index) in dataMuster"
                    :key="index"
                    :label="item.datasetNames"
                    :value="item.datasetName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="添加sql数据集" name="second">
              <el-form-item prop="textarea">
                <el-input type="textarea" v-model="selDataForm.textarea"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selDataDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDataGather('selDataInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择审核字段 弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="选择需要审核的字段："
      @close="closeDialog('dialogExamine','examineDataInfo')"
      :visible.sync="dialogExamine"
      class="examine-field"
    >
      <div>
        <el-form :model="examineDataForm" :rules="examineDataRules" ref="examineDataInfo">
          <el-form-item prop="examineDataList">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <el-checkbox-group
              v-model="examineDataForm.examineDataList"
              class="checkGroup"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                :key="index"
                :label="item.datasetName"
                v-for="(item,index) in examineData"
              >{{item.datasetName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('dialogExamine','examineDataInfo')">取 消</el-button>
        <el-button type="primary" @click="confirmExamine('examineDataInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑表2 弹框 TODO -->
    <el-dialog :visible.sync="selDictionary" :close-on-click-modal="false" class="sel-Dictionary">
      <el-form
        :model="fieldDetails"
        :rules="fieldDataRules"
        :inline="true"
        ref="fieldInfo"
        class="rule-convert clear"
      >
        <!-- <div class="rule-left">
          <p>选择字段转换规则：</p>
          <div class="radioVal">
             <el-select v-model="fieldDetails.radioVal" placeholder="请选择">
                <el-option
                  v-for="(item,index) in ruleTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="fieldDetails.dataType" placeholder="请选择">
                <el-option
                  v-for="(item,index) in dictionaryType"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
             </el-select>
            <el-form-item prop="radioVal">
              <el-radio v-model="fieldDetails.radioVal" 
                        :key="index"
                        :label="item" 
                        v-for="(item,index) in dictionary">{{item}}</el-radio>
            </el-form-item>
          </div> 
        </div>
        <div class="rule-right">
          <p>选择项：{{currItem}}</p>
          <div>规则说明：将源日期转换为目标日期</div>
          <div class="rule-input">
            <el-form-item prop="parameter" label="参数">
              <el-input maxlength="50" v-model="fieldDetails.parameter"></el-input>
            </el-form-item>
          </div>
        </div>-->

        <p class="ruleTitle">
          <span style="float:left">选择项：</span>
          <span>{{currItem}}</span>
        </p>
        <div class="selectItem">
          <el-form-item prop="ruleType" label="规则类型">
            <el-select v-model="fieldDetails.ruleType" @change="changeRule" placeholder="请选择">
              <el-option
                v-for="(item,index) in ruleTypeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ruleItem">
            <el-select v-model="fieldDetails.ruleItem" @change="changeRuleItem" placeholder="请选择">
              <el-option
                v-for="(item,index) in ruleItemList"
                :key="index"
                :label="item.ruleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <p class="ruleExplain">规则说明：{{ruleExplain}}</p>
        <div class="textarea">
          <el-form-item prop="textarea" label="参数">
            <el-input type="textarea" v-model="fieldDetails.textarea" style="width:600px;"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selDictionary = false">取 消</el-button>
        <el-button type="primary" @click="ruleConfirm('fieldInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 转换规则 弹框 -->
    <el-dialog
      title="选择需要转换的规则"
      :close-on-click-modal="false"
      :visible.sync="isShowTransRule"
      width="30%"
    >
      <div class="own-check">
        <el-checkbox-group v-model="addType">
          <el-checkbox :label="addChecked.type">{{addChecked.name}}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="delType">
          <el-checkbox :label="delChecked.type">{{delChecked.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowTransRule = false">取 消</el-button>
        <el-button type="primary" @click="saveRule">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 提示信息 -->
    <el-dialog title="提示" :visible.sync="tipDialog" width="30%">
      <span>{{tipInfo}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipDialog = false">取 消</el-button>
        <el-button type="primary" @click="tipDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 转换规则 弹框 -->
    <el-dialog
      :title="tableTitle"
      :visible.sync="isShotTableRule"
      @opened="handleClick"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form :inline="true">
        <el-form-item label="逻辑类型：">
          <el-radio-group v-model="ruleForm.ruleLogicType">
            <el-radio
              v-for="(item, index) in ruleForm.ruleLogicTypes"
              :key="index"
              :label="item.code"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="规则类型：">
          <el-select v-model="ruleForm.ruleType" placeholder="请选择">
            <el-option
              v-for="(item,index) in ruleForm.ruleTypes"
              :key="index"
              :label="item.ruleTypeName"
              :value="item.ruleType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="作用域类型：">
          <el-radio-group v-model="ruleForm.scopeType">
            <el-radio
              v-for="(item, index) in ruleForm.scopeTypes"
              :label="item.code"
              :key="index"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="执行时机：">
          <el-radio-group v-model="ruleForm.executeLocation">
            <el-radio
              v-for="(item, index) in ruleForm.executeLocations"
              :label="item.code"
              :key="index"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item style="margin-left: 30px;">
          <el-button type="primary" @click="queryRuleRepositoryInfo">查询</el-button>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="addRule">添加</el-button>

      <el-input
        v-model="ruleForm.searchField"
        placeholder="规则名称"
        style="width: 150px; float: right;"
      ></el-input>

      <el-table
        style="width: 100%;"
        border
        :data="ruleForm.dataList"
        :header-cell-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="序号" prop="seq" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
        <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
        <el-table-column label="规则说明" prop="incrId" align="center"></el-table-column>
        <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
        <el-table-column label="规则类型名称" prop="ruleBusinessTypeName" align="center"></el-table-column>
        <el-table-column label="作用域类型" prop="exceptionInfo" align="center"></el-table-column>
        <el-table-column label="功能类型" prop="functionType" align="center"></el-table-column>
        <el-table-column label="执行时机" prop="executeLocation" align="center"></el-table-column>
        <el-table-column label="规则参数" prop="ruleParamInfo" align="center"></el-table-column>
        <el-table-column label="规则类名" prop="ruleClassName" align="center"></el-table-column>
        <el-table-column label="规则方法名" prop="ruleMethodName" align="center"></el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChangeRule"
          @current-change="handleCurrentChangeRule"
          :current-page="ruleForm.currentPage"
          :page-size="ruleForm.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ruleForm.total"
        ></el-pagination>
      </div>

      <el-tabs tab-position="top" v-model="ruleActive" @tab-click="handleClick">
        <el-tab-pane label="表规则转换" name="1">
          <el-table
            style="width: 100%;"
            border
            id="rule_1"
            :data="ruleA"
            :header-cell-class-name="tableRowClassName"
            row-key="id"
          >
            <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
            <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
            <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
            <el-table-column label="规则参数" prop="ruleParam" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button @click="ruleUpdate(scope.row,1)">编辑</el-button>
                <el-button @click="ruleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="行规则转换前置" name="2">
          <el-table
            style="width: 100%;"
            border
            id="rule_2"
            :data="ruleB"
            :header-cell-class-name="tableRowClassName"
            row-key="id"
          >
            <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
            <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
            <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
            <el-table-column label="规则参数" prop="ruleParam" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button @click="ruleUpdate(scope.row,1)">编辑</el-button>
                <el-button @click="ruleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="行规则转换后置" name="3">
          <el-table
            style="width: 100%;"
            border
            id="rule_3"
            :data="ruleC"
            :header-cell-class-name="tableRowClassName"
            row-key="id"
          >
            <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
            <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
            <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
            <el-table-column label="规则参数" prop="ruleParam" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button @click="ruleUpdate(scope.row,1)">编辑</el-button>
                <el-button @click="ruleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="isShotTableRule = false">取 消</el-button>
        <el-button type="primary" @click="tableruleConfirm('tablefieldInfo')">确 定</el-button>
      </div>-->
    </el-dialog>
    <!-- 字段转换规则 弹框 -->
    <el-dialog
      :title="tableTitle"
      :visible.sync="isFieldShotTableRule"
      @opened="fieldSortable"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form :inline="true">
        <!-- <el-form-item label="逻辑类型：">
          <el-radio-group v-model="ruleForm.ruleLogicType">
            <el-radio
              v-for="(item, index) in ruleForm.ruleLogicTypes"
              :key="index"
              :label="item.code"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>-->

        <el-form-item label="规则类型：">
          <el-select v-model="ruleForm.ruleType" placeholder="请选择">
            <el-option
              v-for="(item,index) in ruleForm.ruleTypes"
              :key="index"
              :label="item.ruleTypeName"
              :value="item.ruleType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="作用域类型：">
          <el-radio-group v-model="ruleForm.scopeType">
            <el-radio
              v-for="(item, index) in ruleForm.scopeTypes"
              :label="item.code"
              :key="index"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="执行时机：">
          <el-radio-group v-model="ruleForm.executeLocation">
            <el-radio
              v-for="(item, index) in ruleForm.executeLocations"
              :label="item.code"
              :key="index"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>-->

        <el-form-item style="margin-left: 30px;">
          <el-button type="primary" @click="queryRuleRepositoryInfo">查询</el-button>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="addField">添加</el-button>
      <!-- 清洗规则设置-弹出框 -->
      <el-input
        v-model="ruleForm.searchField"
        placeholder="规则名称"
        style="width: 150px; float: right;"
      ></el-input>

      <el-table
        style="width: 100%;"
        border
        :data="ruleForm.dataList"
        :header-cell-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="序号" prop="seq" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
        <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
        <el-table-column label="规则说明" prop="incrId" align="center"></el-table-column>
        <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
        <el-table-column label="规则类型名称" prop="ruleBusinessTypeName" align="center"></el-table-column>
        <el-table-column label="作用域类型" prop="exceptionInfo" align="center"></el-table-column>
        <el-table-column label="功能类型" prop="functionType" align="center"></el-table-column>
        <el-table-column label="执行时机" prop="executeLocation" align="center"></el-table-column>
        <el-table-column label="规则参数" prop="ruleParamInfo" align="center"></el-table-column>
        <el-table-column label="规则类名" prop="ruleClassName" align="center"></el-table-column>
        <el-table-column label="规则方法名" prop="ruleMethodName" align="center"></el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChangeRule"
          @current-change="handleCurrentChangeRule"
          :current-page="ruleForm.currentPage"
          :page-size="ruleForm.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ruleForm.total"
        ></el-pagination>
      </div>

      <el-tabs tab-position="top" v-model="fileActive">
        <el-tab-pane label="转换" name="1">
          <el-table
            style="width: 100%;"
            border
            id="rule_7"
            :data="ruleF"
            :header-cell-class-name="tableRowClassName"
            row-key="id"
          >
            <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
            <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
            <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
            <el-table-column label="规则参数" prop="ruleParam" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button @click="ruleUpdate(scope.row,3)">编辑</el-button>
                <el-button @click="fieldDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="isShotTableRule = false">取 消</el-button>
        <el-button type="primary" @click="tableruleConfirm('tablefieldInfo')">确 定</el-button>
      </div>-->
    </el-dialog>
    <!-- 清洗规则 弹框 -->
    <el-dialog
      :title="tableTitle"
      :visible.sync="isShotTableRules"
      @opened="handleClicks"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form :inline="true">
        <el-form-item label="逻辑类型：">
          <el-radio-group v-model="ruleForm.ruleLogicType">
            <el-radio
              v-for="(item, index) in ruleForm.ruleLogicTypes"
              :key="index"
              :label="item.code"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="规则类型：">
          <el-select v-model="ruleForm.ruleType" placeholder="请选择">
            <el-option
              v-for="(item,index) in ruleForm.ruleTypes"
              :key="index"
              :label="item.ruleTypeName"
              :value="item.ruleType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="作用域类型：">
          <el-radio-group v-model="ruleForm.scopeType">
            <el-radio
              v-for="(item, index) in ruleForm.scopeTypes"
              :label="item.code"
              :key="index"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="执行时机：">
          <el-radio-group v-model="ruleForm.executeLocation">
            <el-radio
              v-for="(item, index) in ruleForm.executeLocations"
              :label="item.code"
              :key="index"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item style="margin-left: 30px;">
          <el-button type="primary" @click="queryRuleRepositoryInfo">查询</el-button>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="addRow">添加</el-button>

      <el-input
        v-model="ruleForm.searchField"
        placeholder="规则名称"
        style="width: 150px; float: right;"
      ></el-input>

      <el-table
        style="width: 100%;"
        border
        ref="ruleTable"
        :data="ruleForm.dataList"
        :header-cell-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="序号" prop="seq" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
        <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
        <el-table-column label="规则说明" prop="incrId" align="center"></el-table-column>
        <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
        <el-table-column label="规则类型名称" prop="ruleBusinessTypeName" align="center"></el-table-column>
        <el-table-column label="作用域类型" prop="exceptionInfo" align="center"></el-table-column>
        <el-table-column label="功能类型" prop="functionType" align="center"></el-table-column>
        <el-table-column label="执行时机" prop="executeLocation" align="center"></el-table-column>
        <el-table-column label="规则参数" prop="ruleParamInfo" align="center"></el-table-column>
        <el-table-column label="规则类名" prop="ruleClassName" align="center"></el-table-column>
        <el-table-column label="规则方法名" prop="ruleMethodName" align="center"></el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChangeRule"
          @current-change="handleCurrentChangeRule"
          :current-page="ruleForm.currentPage"
          :page-size="ruleForm.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ruleForm.total"
        ></el-pagination>
      </div>

      <el-tabs tab-position="top" v-model="ruleActives" @tab-click="handleClicks">
        <el-tab-pane label="表清洗" name="1">
          <el-table
            style="width: 100%;"
            border
            id="rules_1"
            :data="ruleD"
            :header-cell-class-name="tableRowClassName"
            row-key="id"
          >
            <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
            <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
            <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
            <el-table-column label="规则参数" prop="ruleParam" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button @click="ruleUpdate(scope.row,2)">编辑</el-button>
                <el-button @click="rowDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="行清洗" name="2">
          <el-table
            style="width: 100%;"
            border
            id="rules_2"
            :data="ruleE"
            :header-cell-class-name="tableRowClassName"
            row-key="id"
          >
            <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
            <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
            <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
            <el-table-column label="规则参数" prop="ruleParam" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button @click="ruleUpdate(scope.row,2)">编辑</el-button>
                <el-button @click="rowDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="isShotTableRule = false">取 消</el-button>
        <el-button type="primary" @click="tableruleConfirm('tablefieldInfo')">确 定</el-button>
      </div>-->
    </el-dialog>
    <!-- 字段清洗规则 弹框 -->
    <el-dialog
      :title="tableTitle"
      :visible.sync="isFieldShotTableRules"
      @opened="fieldSortables"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form :inline="true">
        <!-- <el-form-item label="逻辑类型：">
          <el-radio-group v-model="ruleForm.ruleLogicType">
            <el-radio
              v-for="(item, index) in ruleForm.ruleLogicTypes"
              :key="index"
              :label="item.code"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>-->

        <el-form-item label="规则类型：">
          <el-select v-model="ruleForm.ruleType" placeholder="请选择">
            <el-option
              v-for="(item,index) in ruleForm.ruleTypes"
              :key="index"
              :label="item.ruleTypeName"
              :value="item.ruleType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="作用域类型：">
          <el-radio-group v-model="ruleForm.scopeType">
            <el-radio
              v-for="(item, index) in ruleForm.scopeTypes"
              :label="item.code"
              :key="index"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item style="margin-left: 30px;">
          <el-button type="primary" @click="queryRuleRepositoryInfo">查询</el-button>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="addFields">添加</el-button>

      <el-input
        v-model="ruleForm.searchField"
        placeholder="规则名称"
        style="width: 150px; float: right;"
      ></el-input>

      <el-table
        style="width: 100%;"
        border
        ref="ruleTable"
        :data="ruleForm.dataList"
        :header-cell-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="序号" prop="seq" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
        <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
        <el-table-column label="规则说明" prop="incrId" align="center"></el-table-column>
        <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
        <el-table-column label="规则类型名称" prop="ruleBusinessTypeName" align="center"></el-table-column>
        <el-table-column label="作用域类型" prop="exceptionInfo" align="center"></el-table-column>
        <el-table-column label="功能类型" prop="functionType" align="center"></el-table-column>
        <el-table-column label="执行时机" prop="executeLocation" align="center"></el-table-column>
        <el-table-column label="规则参数" prop="ruleParamInfo" align="center"></el-table-column>
        <el-table-column label="规则类名" prop="ruleClassName" align="center"></el-table-column>
        <el-table-column label="规则方法名" prop="ruleMethodName" align="center"></el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChangeRule"
          @current-change="handleCurrentChangeRule"
          :current-page="ruleForm.currentPage"
          :page-size="ruleForm.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ruleForm.total"
        ></el-pagination>
      </div>

      <el-tabs tab-position="top" v-model="fileActive">
        <el-tab-pane label="清洗" name="1">
          <el-table
            style="width: 100%;"
            border
            id="rule_8"
            :data="ruleH"
            :header-cell-class-name="tableRowClassName"
            row-key="id"
          >
            <el-table-column label="规则编码" prop="ruleCode" align="center"></el-table-column>
            <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
            <el-table-column label="规则类型" prop="ruleType" align="center"></el-table-column>
            <el-table-column label="规则参数" prop="ruleParam" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button @click="ruleUpdate(scope.row,4)">编辑</el-button>
                <el-button @click="fieldDetele(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="isShotTableRule = false">取 消</el-button>
        <el-button type="primary" @click="tableruleConfirm('tablefieldInfo')">确 定</el-button>
      </div>-->
    </el-dialog>
    <!-- 数据预览 -->
    <el-dialog
      :visible.sync="isShowTableData"
      :close-on-click-modal="true"
      class="sel-Dictionary"
      width="75%"
      :title="viewDataTitle"
    >
      <template>
        <el-table :data="viewTable.tableData" height="600" border style="width: 100%">
          <template v-for="(item) in viewTable.tableTitle">
            <el-table-column
              fixed
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              v-if="item.prop=='id'"
              :show-overflow-tooltip="true"
              :width="item.width? item.width :null"
            ></el-table-column>
            <el-table-column
              v-else
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              :show-overflow-tooltip="true"
              :width="item.width? item.width :null"
            ></el-table-column>
          </template>
        </el-table>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="isUpdateAry"
      :close-on-click-modal="true"
      class="sel-Dictionary"
      width="50%"
      :title="viewDataTitle"
    >
      <div id="jsonTableEdit">
        <!-- <p>表规则转换编辑</p> -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="JSON" name="1">
            <div id="jsoneditor_1" style="width:100%;height:400px;margin:0 auto;"></div>
          </el-tab-pane>
          <el-tab-pane label="TEXT" name="2">
            <div id="jsoneditor_2">
              <div class="title"></div>
              <el-input
                type="textarea"
                class="a"
                placeholder="请输入内容"
                v-model="jsoneditor_2"
                style="height: 361px;"
              ></el-input>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-button type="primary" @click="updateSave" style="margin-top: 15px;">保存</el-button>
      <el-button @click="isUpdateAry=false">取消</el-button>
    </el-dialog>
  </div>
</template>

<script>
import api from "api";
import Sortable from "sortablejs";

export default {
  components: {
    Sortable
  },
  props: {},
  // watch:{
  //   addType(val){
  //     console.log(val)
  //   }
  // },
  data() {
    return {
      isSave: true,
      activeName: "1",
      jsoneditor_2: "",
      taskName: "", //下拉select选中id
      jobList: [], //下拉selcet循环数据
      targetDialog: false, //控制添加目标数据集弹窗是否显示隐藏
      targetData: [], //添加目标数据集弹窗内多选数据
      targetGatherForm: {
        //目标数据集from
        checkList: []
      },
      targetIsIndeterminate: false, //是否全选形态
      targetCheckAll: false, //是否全选
      checkAllList: [], //全选数据集
      isShowTransRule: false, //控制转换规则显示隐藏
      dataMuster: [], //编辑时下拉数据
      ruleAry: [], //转换规则选中数据
      ruleActive: "1",
      ruleActives: "1",
      fileActive: "1",
      ruleA: [], //表规则转换列表
      ruleB: [], //行规则转换前置
      ruleC: [], //行规则转换后置
      ruleD: [], //表清洗
      ruleE: [], //行清洗
      ruleF: [], //字段转换规则
      ruleH: [], //字段清洗规则
      isUpdateAry: false, //控制编辑是否隐藏
      ruleFrom: {}, //编辑
      ruleFormAry: [], //编辑数组
      isShotTableRule: false, //控制转换规则弹窗
      isShotTableRules: false, //控制清洗规则弹窗
      isFieldShotTableRule: false, //字段转换规则弹窗
      isFieldShotTableRules: false, //字段清洗规则弹窗
      functionType: 1,
      checkDetailed: [], //表2数据
      ruleForm: {
        ruleLogicType: "",
        ruleLogicTypes: [
          {
            code: "",
            value: "全部"
          },
          {
            code: "2",
            value: "行级"
          },
          {
            code: "3",
            value: "表级"
          }
        ],
        ruleType: "",
        ruleTypes: [],
        executeLocation: "",
        executeLocations: [
          {
            code: "",
            value: "全部"
          },
          {
            code: "1",
            value: "前置规则"
          },
          {
            code: "2",
            value: "后置规则"
          }
        ],
        scopeType: "",
        scopeTypes: [
          {
            code: "",
            value: "全部"
          },
          {
            code: "1",
            value: "通用规则"
          },
          {
            code: "2",
            value: "业务规则"
          }
        ],
        dataList: [],
        searchField: "",
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 数据表规则
      formInline: {
        tableName: "",
        tableComment: "",
        columnName: "",
        columnComment: ""
      },

      tablefieldDetails: {
        ruleType: "",
        ruleItem: "",
        textarea: ""
      },
      tablefieldDataRules: {
        ruleType: [
          {
            required: true,
            message: "请选择规则类别",
            trigger: "change"
          }
        ],
        ruleItem: [
          {
            required: true,
            message: "请选择规则",
            trigger: "change"
          }
        ],
        textarea: [
          {
            required: true,
            message: "请填写参数",
            trigger: "blur"
          }
        ]
      },
      tableCurrItem: "",
      tableRuleTypeList: [
        {
          name: "表日期转换",
          id: "1"
        },
        {
          name: "表字典转换",
          id: "2"
        },
        {
          name: "表币种转换",
          id: "3"
        },
        {
          name: "表字符字典转换",
          id: "4"
        }
      ],
      tableRuleItemList: [],
      tableRuleExplain: "",
      //
      tipInfo: "",
      activeName2: "first",
      addChecked: {
        name: "增量导入",
        type: 1
      },
      delChecked: {
        name: "裁剪",
        type: 1
      },
      addType: [],
      delType: [],
      checkAll: false,
      isIndeterminate: false,
      tableDataList: [],

      taskOptions: [],

      dataList: "",
      tipDialog: false,

      dialogEdit: false,
      selDataDialog: false,
      isShowTable: true,
      selDictionary: false,
      dialogExamine: false,
      examineData: [],
      category: 0,
      currTabLineData: {},
      ruleExplain: "",
      ruleTypeList: [
        {
          name: "日期转换",
          id: "1"
        },
        {
          name: "字典转换",
          id: "2"
        },
        {
          name: "币种转换",
          id: "3"
        },
        {
          name: "字符字典转换",
          id: "4"
        }
      ],
      ruleItemList: [],
      fieldDetails: {
        ruleType: "",
        ruleItem: "",
        textarea: ""
      },
      fieldDataRules: {
        ruleType: [
          {
            required: true,
            message: "请选择规则类别",
            trigger: "change"
          }
        ],
        ruleItem: [
          {
            required: true,
            message: "请选择规则",
            trigger: "change"
          }
        ],
        textarea: [
          {
            required: true,
            message: "请填写参数",
            trigger: "blur"
          }
        ]
      },

      targetGatherRules: {
        checkList: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个目标数据集",
            trigger: "change"
          }
        ]
      },
      selDataForm: {
        dataList: "",
        textarea: ""
      },
      selDataRules: {
        dataList: [
          {
            required: true,
            message: "请选择数据集",
            trigger: "change"
          }
        ],
        textarea: [
          {
            required: true,
            message: "请填写sql语句",
            trigger: "blur"
          }
        ]
      },
      examineDataForm: {
        examineDataList: []
      },
      examineDataRules: {
        examineDataList: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个审核字段",
            trigger: "change"
          }
        ]
      },
      testId: "",
      isChangeVal: false,
      isUpdate: false,
      currItem: "",
      radioVal: "",
      currSelVal: {},
      editForm: {
        parameter: ""
      },
      copyTabVal: {},
      tmp: [],
      // 原表预览
      batchEfficacy: "",
      isShowTableData: false,
      viewTable: {
        tableTitle: [],
        tableData: []
      },
      viewDataTitle: "",
      tableTitle: ""
    };
  },
  computed: {},
  created() {
    let queryData = this.$route.query;
    api.getJobRepoOnlyRule({}).then(res => {
      this.jobList = res.data.data;
      // 判断 地址是否有传参， 如果有从地址中取，否则默认第一个
      if (queryData.jobName && queryData.keyID) {
        this.taskName = queryData.jobName;
        this.testId = queryData.keyID;
      } else {
        this.taskName = this.jobList[0].jobName;
        this.testId = this.jobList[0].id;
      }
      // 根据 id 初始化表1
      this.initJobRepoTable();
    });
  },
  filters: {
    typename(data) {
      return data == 0 ? "表" : "sql";
    }
  },
  methods: {
    // 初始化
    initJobRepoTable() {
      let currId = this.currId();
      api
        .initJobRepoTable({
          jobId: currId
        })
        .then(res => {
          this.tableDataList = res.data.data;
          if (this.tableDataList.length) {
            this.$refs.singleTable.setCurrentRow(this.tableDataList[0]);
            this.handleCurrentChange(this.tableDataList[0]);
            // 确定库中是否有数据
            this.isUpdate = true;
          }
        });
    },
    // 选中表1行时请求表2
    handleCurrentChange(val) {
      if (!val) {
        this.checkDetailed = [];
        return;
      }
      this.currSelVal = val;
      let Id = val && val.id ? val.id : "";
      let currId = this.currId();
      // 通过点击 获取第二个表的 初始化数据，并且将数据处理成表格的参数形式
      api
        .initJobRepoTableRelation({
          jobJd: currId,
          jobTableId: Id,
          targetTableName: this.currSelVal.targetTableName,
          sourceType: this.currSelVal.sourceType,
          sourceContent: this.currSelVal.sourceContent
        })
        .then(res => {
          let resData = res.data.data;
          console.log(resData);
          let tmpData = [];
          resData.sourceFieldList.forEach(item => {
            item.datasetNames = item.datasetName + "         " + item.comment;
          });
          for (let i = 0; i < resData.tableFieldList.length; i++) {
            let tmpObj = {};
            tmpObj.sourceField = resData.tableFieldList[i].sourceColumnName;
            tmpObj.tagrtField = resData.tableFieldList[i].targetColumnName;
            tmpObj.ruleParam = resData.tableFieldList[i].ruleParam;
            tmpObj.ruleId = resData.tableFieldList[i].ruleId;
            tmpObj.ruleName = resData.tableFieldList[i].ruleName;
            tmpObj.sourceFieldList = resData.sourceFieldList;
            tmpObj.id = resData.tableFieldList[i].id;
            if (
              resData.tableFieldList[i].remark != null &&
              resData.tableFieldList[i].remark != ""
            ) {
              tmpObj.comment = resData.tableFieldList[i].remark;
            } else {
              if (
                resData.tableFieldList[i].comment != null &&
                resData.tableFieldList[i].comment != ""
              ) {
                tmpObj.comment =
                  "<<" + resData.tableFieldList[i].comment + ">>";
              } else {
                tmpObj.comment = "";
              }
            }

            // tmpObj.beizhu = resData.tableFieldList[i].id; // TODO 添加备注信息
            tmpData.push(tmpObj);
          }
          this.checkDetailed = tmpData;
        });
    },
    // 添加目标数据集
    addTarget() {
      this.targetDialog = true;
      let currId = this.currId();

      api
        .getDatasets({
          jobId: currId,
          operFlag: "target"
        })
        .then(res => {
          this.targetData = res.data.data;
          this.checkAllList = this.targetData.map(item => item.datasetName);
        });
    },
    // 转换规则
    transRule() {
      let currId = this.currId();
      this.isShowTransRule = true;
      api
        .queryJobRepoInfo({
          param: currId
        })
        .then(res => {
          let resData = res.data.data;
          this.$set(this.addType, 0, resData.incrFlag);
          this.$set(this.delType, 0, resData.truncateFlag);
        });
    },
    // 保存规则
    saveRule() {
      let currId = this.currId();
      let addType, delType;
      if (this.addType.length <= 1) {
        addType =
          this.addType.length === 0
            ? (addType = 0)
            : (addType = this.addType[0]);
      } else {
        addType = this.addType[1];
      }
      if (this.delType.length <= 1) {
        delType =
          this.delType.length === 0
            ? (delType = 0)
            : (delType = this.delType[0]);
      } else {
        delType = this.delType[1];
      }
      let params = {
        id: currId,
        incrFlag: addType,
        truncateFlag: delType
      };
      api.updateJobRepoInfo(params).then(res => {
        this.isShowTransRule = false;
        this.$message({
          message: "恭喜你，保存成功",
          type: "success",
          duration: 2000
        });
      });
    },
    //字段搜索
    detailShow() {
      let path = "/menuNav1/ruleConfigDetail";
      let url = this.$router.resolve({
        path,
        query: {
          id: this.currId()
        }
      });
      window.open(url.href, "_blank");
    },
    //数据集全选
    targetHandleCheckAllChange(val) {
      this.targetGatherForm.checkList = val ? this.checkAllList : [];
      this.targetIsIndeterminate = false;
    },
    //数据集点击单个复选框
    targetChange(val) {
      let checkedCount = val.length;
      this.targetCheckAll = checkedCount === this.checkAllList.length;
      this.targetIsIndeterminate =
        checkedCount > 0 && checkedCount < this.checkAllList.length;
    },
    //保存数据集合
    saveTarget(dialogName, formName) {
      this.$refs[formName].validate(valid => {
        let params = this.targetGatherForm.checkList.map(item => {
          return {
            jobRepositoryId: this.currId(),
            targetTableName: item
          };
        });
        if (valid) {
          api
            .saveInBatch(params)
            .then(res => {
              console.log(res);
              this.$refs[formName].resetFields();
              this[dialogName] = false;
              this.initJobRepoTable();
            })
            .catch(err => err);
        } else {
          return false;
        }
      });
    },
    // 编辑 表1
    editInfo(val) {
      // 初始化表单
      this.selDataDialog = true;
      this.selDataForm.textarea = "";
      this.currTabLineData = val;
      let currId = this.currId();
      if (val.sourceType == 0) {
        this.activeName2 = "first";
        this.category = 0;
        this.selDataForm.id = val.id;
        this.selDataForm.dataList = val.sourceContent;
      } else {
        this.activeName2 = "second";
        this.category = 1;
        this.selDataForm.id = val.id;
        this.selDataForm.textarea = val.sourceContent;
      }
      api
        .getDatasets({
          jobId: currId,
          operFlag: "source"
        })
        .then(res => {
          res.data.data.forEach(item => {
            item.datasetNames = item.datasetName + "   " + item.comment;
          });
          this.dataMuster = res.data.data;
        });
    },
    // 关闭弹窗
    closeDialog(dialogName, formName) {
      this.$refs[formName].resetFields();
      switch (dialogName) {
        case "dialogExamine":
          this.dialogExamine = false;
          this.checkAll = false;
          break;
        case "targetDialog":
          this.targetDialog = false;
          this.targetIsIndeterminate = false;
          this.targetCheckAll = [];
          break;
      }
    },
    // 确定编辑 表1的信息
    addDataGather(formName) {
      this.$refs[formName].validate(valid => {
        let selDataForm = this.selDataForm;
        let sourceType, sourceContent;
        if (selDataForm.dataList || selDataForm.textarea) {
          if (+this.category === 0) {
            sourceType = "0";
            sourceContent = selDataForm.dataList;
          } else {
            sourceType = "1";
            sourceContent = selDataForm.textarea;
          }
          let params = {
            id: this.selDataForm.id,
            sourceType,
            sourceContent: sourceContent
          };
          api
            .updateInBatch(params)
            .then(res => {
              this.$refs[formName].resetFields();
              this.selDataDialog = false;
              this.initJobRepoTable();
            })
            .catch(err => {
              err;
            });
        } else {
          return false;
        }
      });
    },
    // 删除 表1
    deleteRow(currIndex, currData, rowVal) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteHandle1(currIndex, currData, rowVal);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //请求表1删除接口
    deleteHandle1(currIndex, currData, rowVal) {
      api
        .deteleInBatch({
          tableId: rowVal.id
        })
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.initJobRepoTable();
        })
        .catch(err => {
          this.$message.error("删除失败");
        });
    },
    // 数据表规则
    transferRuleSet(currIndex, currData, rowVal) {
      // 表名
      this.tableTitle = rowVal.targetTableName + " 转换规则设置";
      this.rowValId = rowVal.id;
      this.isShotTableRule = true;
      this.functionType = 1;
      this.ruleForm.ruleLogicType = "";
      api
        .listRuleType({
          functionType: 1,
          type: "table"
        })
        .then(res => {
          this.ruleForm.ruleTypes = res.data.data;
          this.ruleForm.ruleTypes.unshift({
            ruleType: "",
            ruleTypeName: "全部"
          });
        });
      this.listRuleRepositoryInfoPage();
      let params = {
        functionType: 1,
        id: rowVal.id,
        type: "table"
      };
      this.getRulesList(params);
    },
    //点击转换规则复选框
    handleSelectionChange(val) {
      this.ruleAry = val;
    },
    //添加转换规则(数据处理)
    addRule() {
      let rule = [],
        ruleB = [],
        ruleC = [];
      let filterAry = this.ruleAry.map(item => {
        return {
          id: "",
          relationId: this.rowValId,
          ruleId: item.id,
          ruleLogicType: item.ruleLogicType,
          functionType: item.functionType,
          executeLocation: item.executeLocation,
          ruleParam: item.ruleParamInfo
        };
      });
      filterAry.forEach(item => {
        if (item.ruleLogicType == 3) {
          rule.push(item);
        } else {
          if (item.executeLocation == 1) {
            ruleB.push(item);
          } else if (item.executeLocation == 2) {
            ruleC.push(item);
          }
        }
      });
      let rule1 = this.changeList(this.ruleA);
      let rule2 = this.changeList(this.ruleB);
      let rule3 = this.changeList(this.ruleC);
      rule = rule1.concat(rule);
      ruleB = rule2.concat(ruleB);
      ruleC = rule3.concat(ruleC);
      rule = this.addOrderd(rule);
      ruleB = this.addOrderd(ruleB);
      ruleC = this.addOrderd(ruleC);
      let ruleAry = [...rule, ...ruleB, ...ruleC];
      this.saveRules(ruleAry);
    },
    //转换数据处理
    changeList(list) {
      let aryList = list.map(item => {
        return {
          id: item.id,
          relationId: this.rowValId,
          ruleId: item.ruleId,
          ruleLogicType: item.ruleLogicType,
          functionType: item.functionType,
          executeLocation: item.executeLocation
        };
      });
      return aryList;
    },
    //转换规则保存
    saveRules(params) {
      api
        .saveRules(params)
        .then(res => {
          let param = {
            functionType: 1,
            id: this.rowValId,
            type: "table"
          };
          this.getRulesList(param);
          this.$refs.ruleTable.clearSelection();
          this.ruleAry = [];
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //请求转换规则
    getRulesList(params) {
      api
        .getRulesList(params)
        .then(res => {
          let rule = [],
            ruleB = [],
            ruleC = [];
          let resData = res.data.data;
          resData.forEach(item => {
            if (item.ruleLogicType == 3) {
              rule.push(item);
            } else {
              if (item.executeLocation == 1) {
                ruleB.push(item);
              } else if (item.executeLocation == 2) {
                ruleC.push(item);
              }
            }
          });
          this.ruleA = rule;
          this.ruleB = ruleB;
          this.ruleC = ruleC;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 转换规则编辑
    ruleUpdate(row, num) {
      let that = this;
      console.log(row, num);
      this.ruleFormAry = [];
      this.ruleFrom = {};
      let ruleForm;
      let ruleJson;
      let ruleText = "";
      // 数据类型
      if (row.ruleParam != null) {
        this.updateId = row.id;
        this.num = num;
        this.isUpdateAry = true;
        try {
          // 如果能解析，则为JSON
          ruleForm = JSON.parse(row.ruleParam);
          ruleForm = JSON.parse(JSON.stringify(JSON.parse(row.ruleParam)));
          ruleJson = ruleForm;
          ruleText = "";
          this.activeName = "1";
        } catch (error) {
          // TEXT
          ruleJson = "";
          ruleText = row.ruleParam;
          this.activeName = "2";
        } finally {
          setTimeout(() => {
            // JSON
            this.ruleFrom = ruleJson;
            let container_1 = document.getElementById("jsoneditor_1");
            container_1.innerHTML = "";
            let editor_1 = new this.$jsoneditor(
              container_1,
              {
                languages: "zh-CN",
                mode: "code",
                indentation: 2,
                search: false,
                escapeUnicode: false,
                sortObjectKeys: false,
                onChange: function() {
                  try {
                    // 如果报错，则提示请检查JSON格式，无法保存
                    that.ruleFrom = editor_1.get();
                    that.isSave = true;
                  } catch (error) {
                    that.isSave = false;
                  }
                }
              },
              ruleJson
            );
            // TEXT
            this.jsoneditor_2 = ruleText;
          }, 0);
        }
      } else {
        this.$message({
          type: "info",
          message: "无数据",
          duration: 1500
        });
      }
    },
    // 转换规则配置——》编辑
    updateSave() {
      if (!this.isSave) {
        this.$message({
          type: "error",
          message: "请检查JSON格式!",
          duration: 1500
        });
        return;
      }
      let ruleParam;
      // 获取选择的类型
      if (this.activeName === "1") {
        // JSON
        ruleParam = JSON.stringify(this.ruleFrom);
      } else {
        // TEXT
        ruleParam = this.jsoneditor_2;
      }
      let params = {
        id: this.updateId,
        ruleParam
      };
      api
        .ruleRelationUpdate(params)
        .then(res => {
          this.isUpdateAry = false;
          let param;
          switch (this.num) {
            case 1:
              param = {
                functionType: 1,
                id: this.rowValId,
                type: "table"
              };
              this.getRulesList(param);
              break;
            case 2:
              param = {
                functionType: 2,
                id: this.rowValIds,
                type: "table"
              };
              this.getRulesLists(param);
              break;
            case 3:
              param = {
                functionType: 1,
                id: this.rowValId,
                type: "field"
              };

              this.getFieldList(param);
              break;
            case 4:
              param = {
                functionType: 2,
                id: this.rowValId,
                type: "field"
              };
              this.getFieldLists(param);
              break;
            default:
              break;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //转换规则删除
    ruleDelete(row) {
      console.log(row);
      api
        .deleteRules({ id: row.id })
        .then(res => {
          let param = {
            functionType: 1,
            id: this.rowValId,
            type: "table"
          };
          this.getRulesList(param);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加orderd
    addOrderd(list) {
      if (list.length) {
        list.forEach((item, index) => {
          item.orderd = index;
        });
        return list;
      } else {
        return [];
      }
    },
    //切换转换规则TAB
    handleClick(tab, event) {
      let selcetName;
      switch (this.ruleActive) {
        case "1":
          selcetName = "#rule_1";
          break;
        case "2":
          selcetName = "#rule_2";
          break;
        case "3":
          selcetName = "#rule_3";
          break;
        default:
          selcetName = "#rule_1";
          break;
      }
      this.sortable(selcetName);
      console.log(this.ruleActive);
      // this.ruleActive = tab._props.name
      // console.log(tab, event)
    },
    //转换规则排序
    sortable(selcetName) {
      // 表格拖拽事件的添加
      let el = document.querySelectorAll(`${selcetName} tbody`)[0];
      console.log(el);
      let selfName = "";
      switch (selcetName) {
        case "#rule_1":
          selfName = "ruleA";
          break;
        case "#rule_2":
          selfName = "ruleB";
          break;
        case "#rule_3":
          selfName = "ruleC";
          break;
        default:
          break;
      }
      let self = this;
      Sortable.create(el, {
        // 拖拽结束后的操作
        onEnd({ newIndex, oldIndex }) {
          // 修改data中的数组，
          let targetRow = self[selfName].splice(oldIndex, 1)[0];
          self[selfName].splice(newIndex, 0, targetRow);
          let rule = self.changeList(self.ruleA);
          let ruleB = self.changeList(self.ruleB);
          let ruleC = self.changeList(self.ruleC);
          rule = self.addOrderd(rule);
          ruleB = self.addOrderd(ruleB);
          ruleC = self.addOrderd(ruleC);
          let ruleAry = [...rule, ...ruleB, ...ruleC];
          self.saveRules(ruleAry);
        }
      });
    },
    //清晰规则设置弹出
    cleanRuleSet(currIndex, currData, rowVal) {
      // 表名
      this.tableTitle = rowVal.targetTableName + " 清洗规则设置";
      this.rowValIds = rowVal.id;
      this.isShotTableRules = true;
      this.functionType = 2;
      this.ruleForm.ruleLogicType = "";
      api
        .listRuleType({
          functionType: 2,
          type: "table"
        })
        .then(res => {
          console.log(res, "清洗规则");
          this.ruleForm.ruleTypes = res.data.data;
          this.ruleForm.ruleTypes.unshift({
            ruleType: "",
            ruleTypeName: "全部"
          });
        });
      this.listRuleRepositoryInfoPage();
      let params = {
        functionType: 2,
        id: rowVal.id,
        type: "table"
      };
      this.getRulesLists(params);
    },
    //添加清洗规则(数据处理)
    addRow() {
      let rule = [],
        ruleB = [];
      let filterAry = this.ruleAry.map(item => {
        return {
          id: "",
          relationId: this.rowValIds,
          ruleId: item.id,
          ruleLogicType: item.ruleLogicType,
          functionType: item.functionType,
          executeLocation: item.executeLocation,
          ruleParam: item.ruleParamInfo
        };
      });
      filterAry.forEach(item => {
        if (item.ruleLogicType == 3) {
          rule.push(item);
        } else {
          ruleB.push(item);
        }
      });
      let rule1 = this.changeList(this.ruleD);
      let rule2 = this.changeList(this.ruleE);
      rule = rule1.concat(rule);
      ruleB = rule2.concat(ruleB);
      rule = this.addOrderd(rule);
      ruleB = this.addOrderd(ruleB);
      let ruleAry = [...rule, ...ruleB];
      if (ruleAry.length) {
        ruleAry.forEach(item => {
          item["relationId"] = this.rowValIds;
        });
      }
      console.log(ruleAry, "请求参数");
      this.saveRow(ruleAry);
    },
    //清洗规则保存
    saveRow(params) {
      api
        .saveRules(params)
        .then(res => {
          let param = {
            functionType: 2,
            id: this.rowValIds,
            type: "table"
          };
          this.getRulesLists(param);
          this.$refs.ruleTable.clearSelection();
          this.ruleAry = [];
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //请求清洗规则
    getRulesLists(params) {
      api
        .getRulesList(params)
        .then(res => {
          let rule = [],
            ruleB = [];
          let resData = res.data.data;
          resData.forEach(item => {
            if (item.ruleLogicType == 3) {
              rule.push(item);
            } else {
              ruleB.push(item);
            }
          });
          this.ruleD = rule;
          this.ruleE = ruleB;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //清洗转换规则TAB
    handleClicks(tab, event) {
      let selcetName;
      switch (this.ruleActives) {
        case "1":
          selcetName = "#rules_1";
          break;
        case "2":
          selcetName = "#rules_2";
          break;
        default:
          selcetName = "#rules_1";
          break;
      }
      this.sortables(selcetName);
      console.log(this.ruleActive);
      // this.ruleActive = tab._props.name
      // console.log(tab, event)
    },
    //清洗规则排序
    sortables(selcetName) {
      // 表格拖拽事件的添加
      let el = document.querySelectorAll(`${selcetName} tbody`)[0];
      console.log(el);
      let selfName = "";
      switch (selcetName) {
        case "#rules_1":
          selfName = "ruleD";
          break;
        case "#rules_2":
          selfName = "ruleE";
          break;
        default:
          break;
      }
      let self = this;
      Sortable.create(el, {
        // 拖拽结束后的操作
        onEnd({ newIndex, oldIndex }) {
          // 修改data中的数组，
          let targetRow = self[selfName].splice(oldIndex, 1)[0];
          self[selfName].splice(newIndex, 0, targetRow);
          let rule = self.changeList(self.ruleD);
          let ruleB = self.changeList(self.ruleE);
          rule = self.addOrderd(rule);
          ruleB = self.addOrderd(ruleB);
          let ruleAry = [...rule, ...ruleB];
          self.saveRow(ruleAry);
        }
      });
    },
    //清洗规则删除
    rowDelete(row) {
      console.log(row);
      api
        .deleteRules({ id: row.id })
        .then(res => {
          let param = {
            functionType: 2,
            id: this.rowValIds,
            type: "table"
          };
          this.getRulesLists(param);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 字段转换规则
    fieldTransferRuleSet(currIndex, currData, rowVal) {
      // 表名
      this.tableTitle = " 转换规则设置";
      this.rowValId = rowVal.id;
      this.isFieldShotTableRule = true;
      this.functionType = 1;
      this.ruleForm.ruleLogicType = 1;
      api
        .listRuleType({
          functionType: 1,
          type: "field"
        })
        .then(res => {
          this.ruleForm.ruleTypes = res.data.data;
          this.ruleForm.ruleTypes.unshift({
            ruleType: "",
            ruleTypeName: "全部"
          });
        });
      this.listRuleRepositoryInfoPage();
      let params = {
        functionType: 1,
        id: rowVal.id,
        type: "field"
      };
      this.getFieldList(params);
    },
    //请求字段转换规则
    getFieldList(params) {
      api
        .getRulesList(params)
        .then(res => {
          let resData = res.data.data;
          this.ruleF = resData;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //字段转换规则排序
    fieldSortable() {
      // 表格拖拽事件的添加
      let el = document.querySelectorAll(`#rule_7 tbody`)[0];
      console.log(el);
      let self = this;
      Sortable.create(el, {
        // 拖拽结束后的操作
        onEnd({ newIndex, oldIndex }) {
          // 修改data中的数组，
          let targetRow = self.ruleF.splice(oldIndex, 1)[0];
          self.ruleF.splice(newIndex, 0, targetRow);
          let rule = self.changeList(self.ruleF);
          rule = self.addOrderd(rule);
          let ruleAry = [...rule];
          self.saveField(ruleAry);
        }
      });
    },
    //添加字段转换规则(数据处理)
    addField() {
      let rule = [];
      let filterAry = this.ruleAry.map(item => {
        return {
          id: "",
          relationId: this.rowValId,
          ruleId: item.id,
          ruleLogicType: item.ruleLogicType,
          functionType: item.functionType,
          executeLocation: item.executeLocation,
          ruleParam: item.ruleParamInfo
        };
      });

      let rule1 = this.changeList(this.ruleF);
      rule = rule1.concat(filterAry);
      rule = this.addOrderd(rule);
      let ruleAry = [...rule];
      this.saveField(ruleAry);
    },
    //字段转换规则保存
    saveField(params) {
      api
        .saveRules(params)
        .then(res => {
          let param = {
            functionType: 1,
            id: this.rowValId,
            type: "field"
          };
          this.getFieldList(param);
          this.ruleAry = [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除字段转换规则
    fieldDelete(row) {
      api
        .deleteRules({ id: row.id })
        .then(res => {
          let param = {
            functionType: 1,
            id: this.rowValId,
            type: "field"
          };
          this.getFieldList(param);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 字段清洗规则
    fieldTransferRuleSets(currIndex, currData, rowVal) {
      // 表名
      this.tableTitle = " 清洗规则设置";
      this.rowValId = rowVal.id;
      this.isFieldShotTableRules = true;
      this.functionType = 2;
      this.ruleForm.ruleLogicType = 1;
      api
        .listRuleType({
          functionType: 2,
          type: "field"
        })
        .then(res => {
          this.ruleForm.ruleTypes = res.data.data;
          this.ruleForm.ruleTypes.unshift({
            ruleType: "",
            ruleTypeName: "全部"
          });
        });
      this.listRuleRepositoryInfoPage();
      let params = {
        functionType: 2,
        id: rowVal.id,
        type: "field"
      };
      this.getFieldLists(params);
    },
    //请求字段清洗规则
    getFieldLists(params) {
      let self = this;
      api
        .getRulesList(params)
        .then(res => {
          let resData = res.data.data;
          self.ruleH = resData;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加字段清洗规则(数据处理)
    addFields() {
      let rule = [];
      let filterAry = this.ruleAry.map(item => {
        return {
          id: "",
          relationId: this.rowValId,
          ruleId: item.id,
          ruleLogicType: item.ruleLogicType,
          functionType: item.functionType,
          executeLocation: item.executeLocation,
          ruleParam: item.ruleParamInfo
        };
      });
      let rule1 = this.changeList(this.ruleH);
      rule = rule1.concat(filterAry);
      rule = this.addOrderd(rule);
      let ruleAry = [...rule];
      this.saveFields(ruleAry);
    },
    //字段清洗规则保存
    saveFields(params) {
      api
        .saveRules(params)
        .then(res => {
          let param = {
            functionType: 2,
            id: this.rowValId,
            type: "field"
          };
          this.getFieldLists(param);
          this.ruleAry = [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除字段转换规则
    fieldDetele(row) {
      api
        .deleteRules({ id: row.id })
        .then(res => {
          let param = {
            functionType: 2,
            id: this.rowValId,
            type: "field"
          };
          this.getFieldLists(param);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //字段清洗规则排序
    fieldSortables() {
      // 表格拖拽事件的添加
      let el = document.querySelectorAll(`#rule_8 tbody`)[0];
      console.log(el);
      let self = this;
      Sortable.create(el, {
        // 拖拽结束后的操作
        onEnd({ newIndex, oldIndex }) {
          // 修改data中的数组，
          let targetRow = self.ruleH.splice(oldIndex, 1)[0];
          self.ruleH.splice(newIndex, 0, targetRow);
          let rule = self.changeList(self.ruleH);
          rule = self.addOrderd(rule);
          let ruleAry = [...rule];
          self.saveFields(ruleAry);
        }
      });
    },
    //列表数据
    listRuleRepositoryInfoPage(pageSize, pageNum) {
      api
        .listRuleRepositoryInfoPage({
          pageSize: pageSize,
          pageNum: pageNum,
          ruleLogicType: this.ruleForm.ruleLogicType,
          ruleType: this.ruleForm.ruleType,
          scopeType: this.ruleForm.scopeType,
          executeLocation: this.ruleForm.executeLocation,
          searchField: this.ruleForm.searchField,
          functionType: this.functionType
        })
        .then(res => {
          console.log(res, "列表");
          this.ruleForm.total = res.data.data.totalCount;
          this.ruleForm.dataList = res.data.data.list;
        });
    },
    //更新原字段
    updateFiled(row) {
      let params = {
        id: row.id,
        sourceColumnName: row.sourceField
      };
      api
        .updateField(params)
        .then(res => {
          this.handleCurrentChange(this.currSelVal);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 全选
    handleCheckAllChange(val) {
      let examineData = this.examineData;
      let tmpArr = [];
      for (let i = 0; i < examineData.length; i++) {
        tmpArr.push(examineData[i].datasetName);
      }
      this.examineDataForm.examineDataList = val ? tmpArr : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.examineData.length;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.examineData.length;
    },
    startSingleTableJob(currIndex, currData, rowVal) {
      var id = rowVal.id;
      this.$confirm("是否立即执行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .startSingleTableJob({
              taskId: id
            })
            .then(res => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
            duration: 1500
          });
        });
    },
    startJobInSeries(currIndex, currData, rowVal) {
      var id = rowVal.id;
      this.$confirm("是否立即执行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .startJobInSeries({
              taskId: id
            })
            .then(res => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
            duration: 1500
          });
        });
    },
    //删除字段
    deleteRow2(currIndex, currData, rowVal) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteHandle2(currIndex, currData, rowVal);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //请求删除字段数据接口
    deleteHandle2(currIndex, currData, rowVal) {
      let currSelVal = this.currSelVal;
      api
        .delJobRepoTableRelation({
          id: rowVal.id
        })
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.handleCurrentChange(currSelVal);
        });
    },
    // TODO 数据表二级规则列表
    tablechangeRule(val) {
      api
        .getRuleNameList({
          ruleType: val
        })
        .then(res => {
          this.tableRuleItemList = res.data.data;
          let fieldDetails = this.tablefieldDetails;
          if (!(this.tableRuleItemList.length === 0)) {
            let id = this.tableRuleItemList[0].id;
            fieldDetails.ruleItem = id;
            this.tablechangeRuleItem(id);
          } else {
            fieldDetails.ruleItem = "";
            this.tableRuleExplain = "";
          }
        });
    },
    // TODO 具体规则规范信息
    tablechangeRuleItem(id) {
      api
        .getRuleNameList({
          id: id
        })
        .then(res => {
          let resData = res.data.data;
          let fieldDetails = this.tablefieldDetails;
          this.tableRuleExplain = resData[0].ruleInfo;
          fieldDetails.textarea = resData[0].ruleParamInfo;
        });
    },
    // TODO 数据表规则提交
    tableruleConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let ruleType = this.tablefieldDetails.ruleType;
          let ruleItem = this.tablefieldDetails.ruleItem;
          let textarea = this.tablefieldDetails.textarea;
          console.log(ruleType, ruleItem, textarea);
          // api
          //   .editRuleRepoInfo({
          //     ruleType: ruleType,
          //     id: this.copyTabVal.id,
          //     ruleId: ruleItem,
          //     ruleParamInfo: textarea
          //   })
          //   .then(res => {
          //     let resData = res.data.data;
          //     this.copyTabVal.ruleName = resData.ruleName;
          //     this.copyTabVal.ruleId = resData.id;
          //     this.copyTabVal.ruleParam = textarea;
          //     this.isShotTableRule = false;
          //     // 清空单选框
          //     this.$refs[formName].resetFields();
          //   });
        } else {
          return false;
        }
      });
    },
    // 保存
    // save() {
    //   let checkDetailed = this.checkDetailed
    //   let sourceContent = this.currSelVal.sourceContent
    //   let currSelVal = JSON.stringify([this.currSelVal])
    //   let tmpArr = []
    //   // 过滤不必要的数据
    //   for (let i = 0; i < checkDetailed.length; i++) {
    //     let tmpObj = {}
    //     tmpObj.id = checkDetailed[i].id
    //     tmpObj.ruleName = checkDetailed[i].ruleName
    //     tmpObj.sourceColumnName = checkDetailed[i].sourceField
    //     tmpObj.targetColumnName = checkDetailed[i].tagrtField
    //     tmpObj.ruleId = checkDetailed[i].ruleId
    //     tmpObj.sourceTableName = sourceContent
    //     tmpObj.ruleParam = checkDetailed[i].ruleParam
    //     tmpArr.push(tmpObj)
    //   }
    //   tmpArr = JSON.stringify(tmpArr)
    //   if (currSelVal === '[]' || tmpArr === '[]') {
    //     this.tipInfo = '请填写信息'
    //     this.tipDialog = true
    //     return
    //   }
    //   let operFlag = this.isUpdate ? 'edit' : 'add'
    //   api
    //     .saveJobRepoTableAndMapper({
    //       tableMapperList: currSelVal,
    //       fieldMapperList: tmpArr,
    //       operFlag: operFlag
    //     })
    //     .then(res => {
    //       let resData = res.data.data
    //       if (resData && resData.flag && resData.flag === 'fail') {
    //         Message({
    //           showClose: true,
    //           message: resData.msg,
    //           type: 'error'
    //         })
    //       } else {
    //         this.$message({
    //           message: '恭喜你，保存成功',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       }
    //       this.initJobRepoTable()
    //     })
    // },
    // 当下拉框发生改变时
    changeVal() {
      this.isChangeVal = true;
      this.initJobRepoTable();
      this.handleCurrentChange();
    },
    // 更换规则
    changeRule(val) {
      api
        .getRuleNameList({
          ruleType: val
        })
        .then(res => {
          this.ruleItemList = res.data.data;
          let fieldDetails = this.fieldDetails;
          if (!(this.ruleItemList.length === 0)) {
            let id = this.ruleItemList[0].id;
            fieldDetails.ruleItem = id;
            this.changeRuleItem(id);
          } else {
            fieldDetails.ruleItem = "";
            this.ruleExplain = "";
          }
        });
    },
    changeRuleItem(id) {
      api
        .getRuleNameList({
          id: id
        })
        .then(res => {
          let resData = res.data.data;
          let fieldDetails = this.fieldDetails;
          this.ruleExplain = resData[0].ruleInfo;
          fieldDetails.textarea = resData[0].ruleParamInfo;
        });
    },
    // 判断 作业列表下拉框 选中的id
    currId() {
      let currId = "";
      if (this.isChangeVal) {
        currId = this.taskName;
      } else {
        currId = this.testId;
      }
      return currId;
    },
    // 给表头 添加样式
    tableRowClassName() {
      return "warning-row";
    },
    // 添加审核
    addExamine() {
      let currSelVal = this.currSelVal;
      if (currSelVal.sourceContent === "" || !Object.keys(currSelVal).length) {
        this.tipInfo = "请选择类别和源数据集";
        this.tipDialog = true;
        return;
      }
      this.dialogExamine = true;
      let currId = this.currId();
      api
        .getTargetTableFields({
          jobId: currId,
          targetTableName: currSelVal.targetTableName
        })
        .then(res => {
          let resData = res.data.data;
          this.examineData = resData;
        });
    },
    //保存字段映射的备注信息
    addFieldRemarkInfo() {
      var tempData = [];
      this.checkDetailed.forEach(item => {
        tempData.push({ id: item.id, remark: item.comment });
      });
      console.log(tempData);
      api
        .saveFieldMapperRemark({
          tableRelationStr: JSON.stringify(tempData)
        })
        .then(res => {})
        .catch(error => {
          console.log(error);
        });
    },
    // 确认添加的目标集信息
    addTableData(formName) {
      // console.log(this.$refs.singleTable)
      // let element = this.$refs.singleTable;
      // element.scrollTop = element.scrollHeight;
      // element.scrollIntoView(false);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let checkList = this.targetGatherForm.checkList;
          let tmpArr = [];
          let tableDataList = this.tableDataList;
          let currId = this.currId();
          // 防止添加重复字段
          if (tableDataList.length === 0) {
            for (let i = 0; i < checkList.length; i++) {
              let tmpObj = {};
              tmpObj.jobRepositoryId = currId;
              tmpObj.targetTableName = checkList[i];
              tmpObj.sourceContent = "";
              tmpObj.sourceType = "";
              tmpObj.isAutoAdd = true;
              tmpArr.push(tmpObj);
            }
          } else {
            // 对比 下拉框中的字段和 表单中已有的字段名
            for (let i = 0; i < checkList.length; i++) {
              for (let j = 0; j < tableDataList.length; j++) {
                if (tableDataList[j].targetTableName === checkList[i]) {
                  this.tipInfo = "请不要添加重复字段";
                  this.tipDialog = true;
                  return;
                }
              }
              let tmpObj = {};
              tmpObj.jobRepositoryId = currId;
              tmpObj.targetTableName = checkList[i];
              tmpObj.sourceContent = "";
              tmpObj.sourceType = "";
              tmpObj.isAutoAdd = true;
              tmpArr.push(tmpObj);
            }
          }
          this.tableDataList = this.tableDataList.concat(tmpArr);
          this.targetDialog = false;
          // 清空选项
          this.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
    },
    // 确定选择的审核字段
    confirmExamine(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tmpArr = [];
          let resData = [];
          let examineDataList = this.examineDataForm.examineDataList;
          let checkDetailed = this.checkDetailed;
          let examineData = this.examineData;
          let currSelVal = this.currSelVal;
          let currId = this.currId();
          // 防止添加重复字段
          // 对比 下拉框中的字段和 表单中已有的字段名
          for (let i = 0; i < examineDataList.length; i++) {
            for (let j = 0; j < checkDetailed.length; j++) {
              if (checkDetailed[j].tagrtField === examineDataList[i]) {
                this.tipInfo = "请不要添加重复字段";
                this.tipDialog = true;
                return;
              }
            }
          }
          api
            .getTargetSourceRelation({
              jobId: currId,
              sourceType: currSelVal.sourceType,
              tableId: currSelVal.id,
              sourceContent: currSelVal.sourceContent,
              targetFields: examineDataList.join(",")
            })
            .then(res => {
              this.dialogExamine = false;
              this.checkAll = false;
              // 清空数据
              this.$refs[formName].resetFields();
              this.handleCurrentChange(currSelVal);
            });
        } else {
          return false;
        }
      });
    },
    // 编辑 表2
    editRule(val, index) {
      //存储当前选中表格的值 方便其他地方使用
      this.copyTabVal = val;
      this.currItem = val.tagrtField;
      this.selDictionary = true;
      let currId;
      if (val.ruleId) {
        currId = val.ruleId;
      } else {
        currId = "";
      }
      // 初始化规则数据
      api
        .initEditRuleRepoInfo({
          id: this.copyTabVal.id
        })
        .then(res => {
          let resData = res.data.data;
          let fieldDetails = this.fieldDetails;
          // 初始化 弹窗的值

          let ruleType = resData && resData.ruleType ? resData.ruleType : "";
          this.ruleExplain =
            resData && resData.ruleInfo ? resData.ruleInfo : "";
          fieldDetails.ruleType = ruleType;
          fieldDetails.textarea =
            resData && resData.ruleParamInfo ? resData.ruleParamInfo : "";
          fieldDetails.ruleItem = resData && resData.id ? resData.id : "";
          api
            .getRuleNameList({
              ruleType: ruleType
            })
            .then(res => {
              this.ruleItemList = res.data.data;
            });
        });
    },
    // 切换tab栏
    changeTab(val) {
      this.category = val.index;
    },
    // 确定编辑 表2的信息
    ruleConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let ruleType = this.fieldDetails.ruleType;
          let ruleItem = this.fieldDetails.ruleItem;
          let textarea = this.fieldDetails.textarea;
          api
            .editRuleRepoInfo({
              ruleType: ruleType,
              id: this.copyTabVal.id,
              ruleId: ruleItem,
              ruleParamInfo: textarea
            })
            .then(res => {
              let resData = res.data.data;
              this.copyTabVal.ruleName = resData.ruleName;
              this.copyTabVal.ruleId = resData.id;
              this.copyTabVal.ruleParam = textarea;
              this.selDictionary = false;
              // 清空单选框
              this.$refs[formName].resetFields();
            });
        } else {
          return false;
        }
      });
    },
    // TODO 原表预览
    sourceDatasView(index, tableDataList, scope) {
      this.$set(this.viewTable, `tableTitle`, []);
      this.$set(this.viewTable, `tableData`, []);
      // TODO 构建数据
      api
        .getTableInfo({
          taskId: scope.id,
          type: 2,
          pageNum: 1,
          pageSize: 10
        })
        .then(res => {
          console.log(res);
          let resData = res.data.data;
          let aryList;
          if (resData.list.length) {
            aryList = Object.keys(resData.list[0]);
            aryList = aryList.map(item => {
              return {
                label: item,
                prop: item,
                width: 200
              };
            });
          }
          console.log(aryList);
          this.$set(this.viewTable, `tableTitle`, aryList);
          this.$set(this.viewTable, `tableData`, resData.list);
        });

      this.viewDataTitle = "原表数据预览";
      this.isShowTableData = true;
    },
    // TODO 转化数据预览
    changeDatasView(index, tableDataList, scope) {
      api
        .getTableInfo({
          taskId: scope.id,
          type: 3
        })
        .then(res => {
          console.log(res);
          let resData = res.data.data;
          let aryList;
          if (resData.list.length) {
            aryList = Object.keys(resData.list[0]);
            aryList = aryList.map(item => {
              return {
                label: item,
                prop: item,
                width: 200
              };
            });
          }
          console.log(aryList);
          this.$set(this.viewTable, `tableTitle`, aryList);
          this.$set(this.viewTable, `tableData`, resData.list);
        });
      this.viewDataTitle = "转化数据预览";
      this.isShowTableData = true;
    },
    // TODO 批量效验
    batchEfficacyFn() {
      if (Object.keys(this.currSelVal).length) {
        // let baseUrl = window.location.host
        let baseUrl = process.env.RES_URL ? process.env.RES_URL : "";
        const elink = document.createElement("a");
        elink.href =
          baseUrl +
          "/check/checkSimpleTableColumn" +
          "?" +
          "taskId=" +
          this.currSelVal.id;
        console.log(elink.href);
        elink.click();
      } else {
        this.$message({
          type: "info",
          message: "请选择一个表"
        });
      }
    },
    handleSizeChangeRule(val) {
      this.ruleForm.pageSize = val;
      this.listRuleRepositoryInfoPage(val, 1);
    },
    handleCurrentChangeRule(val) {
      this.ruleForm.currentPage = val;
      this.listRuleRepositoryInfoPage(this.ruleForm.pageSize, val);
    },
    queryRuleRepositoryInfo() {
      this.listRuleRepositoryInfoPage(10, 1);
    }
  },

  mounted() {}
};
</script>
<style lang="scss" scoped>
// element-ui
.rule-config {
  .target-dialog,
  .examine-field {
    /deep/ .el-dialog__header {
      border-bottom: 1px solid #ccc;

      .el-dialog__title {
        font-size: 16px;
      }
    }
  }

  .selData-dialog {
    /deep/ .el-dialog__body {
      padding: 0;
    }

    /deep/ .el-textarea {
      width: 95%;

      .el-textarea__inner {
        min-height: 120px !important;
      }
    }
  }

  .el-checkbox-group {
    overflow-x: hidden;
    overflow-y: auto;
    height: 200px;
  }

  .info-head {
    /deep/ .el-button {
      padding: 7px 20px;
    }
  }

  /deep/ .own-check {
    .el-checkbox-group {
      height: auto;
      overflow-y: hidden;
    }
  }

  /deep/ .own-collapse {
    .el-collapse-item__header {
      height: 30px;
      line-height: 30px;
      background: #ccc;
    }

    .el-collapse-item__arrow {
      margin: 0 auto;
      font-size: 26px !important;
      transform: rotate(90deg);
    }

    .el-collapse-item__content {
      margin-bottom: 0;
    }

    .el-collapse-item__arrow.is-active {
      transform: rotate(-90deg);
    }
  }

  /deep/ .el-table__body tr.current-row > td {
    background-color: #f19944 !important;
  }

  /deep/ .el-table .cell {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  /deep/ .el-input__icon {
    line-height: 32px;
  }

  /deep/ .el-table {
    td {
      padding: 3px 0;
    }
  }

  /deep/ .el-checkbox {
    line-height: 22px;
    display: block;
  }

  /deep/ .el-dialog__close {
    font-size: 22px;
  }

  /deep/ .el-tabs__content {
    padding-left: 20px;
  }
}

// 页面样式
.rule-config {
  position: relative;
  height: 100%;

  .info-head {
    margin: -2px 4px 5px 0;
  }

  .own-collapse {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 100;

    .info-head {
      position: relative;
      height: 40px;

      .add {
        margin: 4px 0 0 5px;
        padding: 8px 15px;
      }

      .title {
        display: inline-block;
        margin-left: 80px;
        font-size: 14px;
      }
    }
  }

  .sel-Dictionary {
    .rule-convert {
      .ruleTitle {
        margin: 0 0 20px 15px;
        font-size: 16px;
      }

      .ruleExplain {
        margin: 0 0 20px 7px;
      }

      .textarea {
        margin-left: 24px;
      }
    }
  }

  .pagination {
    /* width: 100%; */
    width: 500px;
    margin: 20px auto;

    /deep/ .el-input {
      width: 100px;
    }
  }
  // JSON编辑器样式(第三方)
  /deep/ .jsoneditor-sort {
    display: none;
  }
  /deep/ .jsoneditor-transform {
    display: none;
  }
  /deep/ .jsoneditor-repair {
    display: none;
  }
  /deep/ .jsoneditor-poweredBy {
    display: none;
  }
  #jsoneditor_2 {
    width: 100%;
    height: 400px;
    margin: 0 auto;
    color: rgb(26, 26, 26);
    border: thin solid rgb(56, 131, 250);
    box-sizing: border-box;
    .title {
      padding-top: 35px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: white;
      background-color: #3883fa;
    }
  }
  /deep/ .a {
    textarea {
      height: 363px;
      border-radius: 0;
      resize: none;
      box-sizing: border-box;
    }
  }
}
</style>
