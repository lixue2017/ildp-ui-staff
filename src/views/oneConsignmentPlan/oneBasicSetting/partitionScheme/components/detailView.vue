<template>
  <div class="app-container">
    <ComDetailTop
      :title="`分区方案（${pageViewType === 'edit' ? '编辑' : '查看'}）`"
      ref="detailTopRef"
      :formModel="detailResData"
      @handleClick="handleTopClick"
      :class="pageViewType === 'edit' ? `detail-top-right-none` : ''"
    />
    <div class="des-content-box" v-if="isInitRes">
      <div class="partition-left">
        <LeftFormTable
          ref="leftContentRef"
          :leftData="detailResData"
          @curLeftTableRow="curLeftTableRow"
          @editSuccess="leftEditSuccess"
          @onLeftTableDataArr="onLeftTableDataArr"
        />
      </div>

      <div class="partition-right">
        <ComForm ref="formRightRef" :formConfig="rightFormConfig">
          <template v-slot:form-submit v-if="pageViewType === 'edit'">
            <el-button type="text" @click="importUrlXlsx"> 模板下载 </el-button>
            <el-button
              @click="handleImport"
              type="primary"
              size="small"
              :disabled="leftEditState || rightEditState"
            >
              批量上传
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              class="btn-type-add"
              @click="handleAddPostal"
              v-if="curLeftRow.id"
              :disabled="leftEditState"
            >
              新增
            </el-button>

            <ComUpload
              style="display: none"
              ref="uploadSchemeRef"
              :uploadConfig="uploadSchemeConfig"
              @handleSuccess="uploadSuccess"
            />
          </template>
        </ComForm>

        <ComTable
          :ref="`tableRightRef`"
          :httpRequest="tableRightConfig.httpRequest"
          :columnConfig="detailTableRightColumns()"
          :isMountedRequest="false"
          :rowOperationBtnListFn="
            () => {
              return leftEditState ? [] : mixinTableRowBtnArr();
            }
          "
          :colShowBtnFn="
            (btnItem, row) => btnItem.btnUpdate === (row.rBtnUpdate || false)
          "
          @getResult="getRightTableResult"
          :getQueryParams="tableRightQueryParams"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="['countryName'].includes(slotProps.prop)">
              <template v-if="!slotProps.row.rBtnUpdate">
                {{
                  `${slotProps.row.countryCode}(${slotProps.row.countryName})` ||
                  "--"
                }}
              </template>
              <template v-else>
                <AutoComplete
                  :formModel="slotProps.row"
                  :fieldItem="slotProps.column.fieldItem"
                />
              </template>
            </template>
            <template v-if="['type'].includes(slotProps.prop)">
              <FormSingle
                :formData="slotProps.row"
                :fieldItem="{
                  id: slotProps.column.prop,
                  placeholder: slotProps.column.label,
                  ...slotProps.column.fieldItem,
                }"
                :dictionary="{ dicsData }"
                :disabled="!slotProps.row.rBtnUpdate"
              />
            </template>
            <template
              v-if="
                [
                  'province',
                  'city',
                  'postalDeliveryArea',
                  'startPostalCode',
                  'endPostalCode',
                ].includes(slotProps.prop)
              "
            >
              <template v-if="!slotProps.row.rBtnUpdate">
                {{ slotProps.row[slotProps.prop] || "--" }}
              </template>
              <template v-else>
                <el-input
                  type="text"
                  size="mini"
                  v-model="slotProps.row[slotProps.prop]"
                  :placeholder="slotProps.column.label"
                  :maxlength="slotProps.column.maxLength || 20"
                />
              </template>
            </template>
          </template>
        </ComTable>
      </div>
    </div>

    <template v-if="isInitRes">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <slot name="footerBtn" :btnInfo="detailResData" />
        <template v-for="(btn, index) in footBtnListFn()">
          <el-button
            @click="btn.handleClick"
            :key="index"
            :loading="btn.footBtnLoading && isBtnLoading"
          >
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getCostPartitionSchemeInfo,
  putCostPartitionScheme,
  costPartitionDetailList,
  saveCostPartitionDetail,
  delCostPartitionDetail,
  costBatchPartitionDetailList,
} from "@/api/warehouse/basic";
import { mixinTableOperationRow } from "_comp/ComTable/tableOperation/rowOperationMixin.js";
import {
  defaultTextParams,
  importCostPartition,
  IMPORT_COST_PARTITION_TEMPLATE,
} from "_comp/ComUpload/model";
import { download } from "@/utils/download";
import { comSaveRepeatedRequest } from "@/api/common";
import { detailRightFormCols, detailTableRightCols } from "../model.js";

export default {
  mixins: [mixinTableOperationRow],
  props: {
    pageViewType: {
      type: String,
      default: () => "", // 区分编辑与详情页
    },
  },
  data() {
    return {
      detailResData: {},
      rightFormConfig: {
        formModel: {},
        searchForm: true,
        lists: detailRightFormCols(),
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getRightTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
      },
      uploadSchemeConfig: {
        ...defaultTextParams,
        url: importCostPartition,
        name: "multipartFile",
        showFileList: false,
        accept: ".xlsx,.xls",
        uploadData: {},
      },
      tableRightConfig: {
        httpRequest: costPartitionDetailList,
      },
      footBtnList: [
        {
          statusBtnArr: [0],
          text: "保 存",
          showPage: ["edit"],
          footBtnLoading: true,
          handleClick: this.handleBatchSave,
        },
        {
          statusBtnArr: [0, 2],
          text: "启 用",
          footBtnLoading: true,
          handleClick: this.handleEnable,
        },
        {
          text: "关 闭",
          isBtnAll: true,
          handleClick: this.reBack,
        },
      ],
      mixinTableRef: "tableRightRef",
      mixinFilterOpnBtnArr: [],
      mixinOperationObj: {
        editCallBack: (row) => {},
        copyParamFn: (row) => ({ copyId: row.id }),
        httpSaveRequest: (row) => this.handleRightRowSave(row),
        saveCallBack: () => this.tableMixinRefresh(),
        delMsgBox: true,
        httpDelRequest: (row) => delCostPartitionDetail(row.id),
        delCallBack: () => this.tableMixinRefresh(),
        saveTableAllRequest: (eItems) => {
          const optBatch = eItems.map((e) => {
            return {
              ...e,
              costPartitionInfoId: this.curLeftRow.id,
            };
          });
          return costBatchPartitionDetailList(optBatch);
        },
      },
      curLeftRow: {},
      leftEditState: false,
      rightEditState: false,
      isInitRes: false,
      rRuleObj: {
        ruleMsg: {
          countryId: "国家",
          type: "类型",
          // province: "省/州",
          // startPostalCode: "开始邮编",
          // endPostalCode: "结束邮编",
        },
      },
    };
  },
  methods: {
    handleRightRowSave(rRow) {
      const { temp_secondId, rBtnUpdate, countryName, ...nRow } = rRow || {};
      const rOpt = {
        ...nRow,
        costPartitionInfoId: this.curLeftRow.id,
      };
      return this.handleMixinRowSave(
        rOpt,
        saveCostPartitionDetail,
        this.rRuleObj
      );
    },
    handleBatchSave() {
      if (this.leftEditState) {
        this.$refs.leftContentRef?.handleLeftBatchSave();
      } else if (this.rightEditState) {
        this.handleMixinSaveAll(this.rRuleObj);
      }
    },
    handleAddPostal() {
      this.mixinAddTableOpnData([
        {
          costPartitionInfoName: this.curLeftRow.nameCn || "",
          city: "",
          countryId: "",
          endPostalCode: "",
          postalDeliveryArea: "",
          province: "",
          startPostalCode: "",
          isNewAdd: true,
          rBtnUpdate: true,
        },
      ]);
    },
    importUrlXlsx() {
      download(IMPORT_COST_PARTITION_TEMPLATE);
    },
    handleImport() {
      this.uploadSchemeConfig.uploadData = {
        costPartitionSchemeId: this.detailResData.id,
      };
      this.$refs.uploadSchemeRef?.handleUploadClick();
    },
    uploadSuccess(res) {
      // 上传后更新表格数据
      this.isInitRes = false;
      this.$nextTick(() => {
        this.isInitRes = true;
      });
    },
    curLeftTableRow(lRow) {
      this.curLeftRow = lRow || {};
      // this.$refs.formRightRef?.setFormModel({
      //   nameLike: "",
      // });
      // this.rightFormConfig.formModel = {}; // 切换时清空查询值;
      this.mixinTableDataArr = [];
      if (lRow.id) {
        this.$refs.tableRightRef.refreshTable(); // 刷新右侧分区邮编列表
      } else {
        this.$refs.tableRightRef.setNewTableData([]);
      }
    },
    leftEditSuccess() {
      this.getDetailInfo();
    },
    getRightTableList(searchData) {
      // this.rightFormConfig.formModel = searchData || {};
      if (this.curLeftRow.id) {
        this.$refs.tableRightRef.refreshTable();
      }
    },
    getRightTableResult({ tableData }) {
      this.mixinChangeTableDataFn(tableData);
    },
    tableRightQueryParams() {
      const param = this.$refs.formRightRef?.getFormParams();
      return {
        costPartitionInfoIdEq: this.curLeftRow.id,
        ...(param || {}),
      };
    },
    detailTableRightColumns() {
      return detailTableRightCols({ isSee: this.pageViewType !== "edit" });
    },
    onLeftTableDataArr(arr) {
      // 判断左侧是否为编辑状态
      this.leftEditState = (arr || []).some((e) => e.rBtnUpdate);
    },

    handleEnable() {
      if (this.leftEditState || this.rightEditState) {
        // 暂时没做批量保存接口
        this.$message({
          message: "当前页面存在编辑数据，请先保存编辑数据",
          type: "warning",
        });
        return;
      }
      comSaveRepeatedRequest(
        putCostPartitionScheme,
        this.detailResData.id
      ).then(() => {
        this.msgSuccess("更新成功");
        this.getDetailInfo();
        this.handleDetails({ id: this.detailResData.id });
      });
    },
    handleDetails({ id }) {
      this["tagsView/delView"](this.$route).then(() => {
        // 返回时关闭当前页面，防止反复保存
        this.$router.replace({
          path: "/oneConsignmentPlan/oneBasicSetting/detailPartitionScheme",
          query: {
            id,
          },
        });
      });
    },
    getDetailInfo() {
      this.isInitRes = false;
      const { id } = this.$route.query;
      getCostPartitionSchemeInfo(id).then((res) => {
        const { createUserName, ...nRes } = res.data || {};
        this.detailResData = {
          ...nRes,
          createBy: createUserName,
          webViewType: this.pageViewType, // 区分编辑与详情页
        };
        this.isInitRes = true;
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetailInfo();
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack({
        isBackTip:
          this.pageViewType === "edit" &&
          (this.leftEditState || this.rightEditState),
      });
    },
    footBtnListFn() {
      const { state } = this.detailResData;
      return this.footBtnList.filter(
        (e) =>
          (e.showPage ? e.showPage.includes(this.pageViewType) : true) &&
          (e.statusBtnArr ? e.statusBtnArr.includes(state) : e.isBtnAll)
      );
    },
    ...mapActions(["dictionary/getDictionary", "tagsView/delView"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "matchingMethod",
      "matchingType",
      "status",
      "costPartitionDetailType",
    ]);
  },
  watch: {
    mixinTableDataArr: {
      deep: true,
      handler: function (rNewVal) {
        // 新增/复制/编辑状态
        this.rightEditState = (rNewVal || []).some((e) => e.rBtnUpdate);
        this.$refs.leftContentRef?.onRightTableDataArr(rNewVal || []);
      },
    },
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
      dicsData: (state) => state.dictionary.dicsData,
    }),
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComUpload: () => import("_comp/ComUpload"),
    LeftFormTable: () => import("./left"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  padding: 0;
  .des-content-box {
    padding: 0 20px 15px;
    display: flex;
    .partition-left {
      flex: 0 1 465px;
      margin-right: 20px;
      overflow: hidden;
    }
    .partition-right {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
