<template>
  <div>
    <template v-for="tab in handleTabs()">
      <div class="clearance-table" :key="tab.type">
        <div class="table-title">
          <div class="title">{{ tab.name }}</div>
          <div class="operation">
            <template v-for="(item, index) in operationBtn">
              <el-button
                :key="index"
                size="small"
                type="primary"
                round
                @click="item.handleClick(tab.type)"
                :disabled="item.type === 'isMerge' && selectionRows.length < 2"
                v-if="
                  handleShowOperation(
                    {
                      source,
                      type: tab.type,
                      customsClearanceStatus: formData.customsClearanceStatus,
                      canOperation: formData.canOperation,
                    },
                    item
                  )
                "
                >{{ item.text }}</el-button
              >
            </template>
            <!-- <span @click="item.handleClick(formData)">{{ item.text }}</span> -->
          </div>
        </div>
        <ComTable
          :ref="`tableRef${tab.type}`"
          :tableHeight="
            tableData[tab.type] && tableData[tab.type].length > 10
              ? '560px'
              : null
          "
          :columnConfig="
            tableColumns({
              source,
              type: tab.type,
              customsClearanceStatus: formData.customsClearanceStatus,
              canOperation: formData.canOperation,
            })
          "
          :httpRequest="tableConfig.httpRequest"
          :getQueryParams="() => getQueryParams(tab.type)"
          :rowOperationBtnListFn="(r) => tableStatusList(r, tab.type)"
          @getResult="(data) => getResult(data, tab.type)"
          :selectionTableRow="[...selectionRows]"
          @onSelectionChange="(rows) => onSelectionChange(rows, tab.type)"
          :selectionRow="selectionRowEvt"
          selectionKey="temp_secondId"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'UNCHARTED_TABLE_12'">
              <PreviewOrDownload
                btnTxt="资料下载"
                :btnConf="{ btnType: 'primary', plain: true, round: true }"
                :previewDownloadConf="
                  previewDownloadConfig(slotProps.row, tab.type)
                "
              />
            </template>
            <template v-if="slotProps.prop === 'UNCHARTED_TABLE_13'">
              <PreviewOrDownload
                btnTxt="资料下载"
                :btnConf="{ btnType: 'primary', plain: true, round: true }"
                :previewDownloadConf="
                  previewDownloadConfig(slotProps.row, tab.type, 'HBL')
                "
              />
            </template>
          </template>
        </ComTable>
      </div>
    </template>
    <ComUpload
      style="display: none"
      ref="productUploadRef"
      :uploadConfig="{
        ...productUploadConfig,
        fragmentationUpload: false,
        uploadData: { operationOrderId: currImportParam.operationOrderId },
      }"
      @handleSuccess="(res) => uploadSuccess(res)"
      @handleError="handleImportErr"
      @handleUploading="handleUploading"
    />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import {
  previewDownloadHblList,
  batchExportZipDownloadEC,
  postClearanceItemRemark,
  getExportClearanceVerify,
} from "@/api/performance/record.js";
import { download, comFileDownload } from "@/utils/download.js";
import {
  exportClearanceInvoice,
  getClearanceInfos,
  clearanceMerge,
} from "@/api/operateRecord/clearanceGoods.js";
import { getBillDetailPreview } from "@/api/operateRecord/BOLManage.js";
import {
  defaultParams,
  importClearanceProductInvoice,
  INVOICE_EC_IMPORT_TEMPLATE,
} from "_comp/ComUpload/model";
import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import { mixinImportConf } from "@/views/operateManage/components/mixinImportConf.js";
import { tableColumns } from "./model";
import { mapActions } from "vuex";
import qs from "qs";
export default {
  mixins: [mixinImportConf],
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    source: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComUpload: () => import("_comp/ComUpload"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    return {
      tableColumns,
      tableConfig: {
        httpRequest: getClearanceInfos,
      },
      tableData: {
        3: [],
        4: [],
      },
      productUploadConfig: {
        ...defaultParams,
        url: importClearanceProductInvoice,
        type: "text",
        className: "text-uploader",
        name: "file",
        showFileList: false,
        fileList: [],
        accept: ".xlsx,.xls",
        uploadData: {},
        successTip: false,
        limit: undefined,
        isPrediction: false,
      },
      operationBtn: [
        {
          text: "派送表导出",
          type: "ps_export",
          handleClick: () => {
            const { id } = this.formData;
            comFileDownload(this, getExportClearanceVerify, { id });
          },
        },
        {
          text: "清关合并",
          type: "isMerge",
          handleClick: this.handleMerge,
        },
        {
          text: "箱单发票 批量下载",
          handleClick: this.packHblDownload,
        },
        {
          text: "HBL资料 批量下载",
          handleClick: (type) => this.packHblDownload(type, "HBL"),
        },
      ],
      tableBtnList: [
        {
          text: "维护货物信息",
          handleClick: this.handleMaintainGoods,
        },
        {
          text: "维护地址",
          handleClick: this.handleMaintainAddress,
        },
        {
          text: "数据模板导出",
          handleClick: this.handleBoxInvoice,
        },
        {
          text: "货物导入",
          handleClick: this.handleImport,
        },
        {
          text: "解除合并清关",
          hideMergeColumns: true,
          handleClick: this.handleReleaseMerge,
        },
        {
          text: "备注",
          isAllShow: true,
          handleClick: this.handleEditRemark,
        },
      ],
      currImportParam: {},
      selectionRows: [],
    };
  },
  methods: {
    ...mapActions(["dataImport/setECommerceImport"]),
    handleTabs() {
      const { customsClearanceStatus, viewSource } = this.formData;
      const tabs = [];
      let hideTabs = [0];
      if (viewSource === "hw_clearance_tab") {
        hideTabs = [];
      }
      if (!hideTabs.includes(customsClearanceStatus)) {
        tabs.push({
          type: 4,
          name: "核实清关信息",
        });
      }
      tabs.push({
        type: 3,
        name: "预报清关信息",
      });
      return tabs;
    },
    getQueryParams(importType) {
      const { id } = this.formData;
      return {
        operationOrderId: id,
        importType,
      };
    },
    getResult(data, importType) {
      this.tableData[importType] = data.tableData;
    },
    handleShowOperation(
      { source, type, customsClearanceStatus, canOperation },
      btn
    ) {
      if (btn.type !== "isMerge") {
        if (btn.type === "ps_export") {
          return type === 4 && this.formData.viewSource === "gn_shjj_clearance";
        }
        return true;
      }
      return (
        !source &&
        ((type === 3 && [0].includes(customsClearanceStatus)) ||
          (type === 4 && ![0].includes(customsClearanceStatus) && canOperation))
      );
    },
    handleMaintainAddress(row, btnItem) {
      this.$emit("handleMaintainAddress", {
        ...row,
        importType: btnItem.importType,
      });
    },
    tableStatusList(r, importType) {
      if (![1, 3].includes(r.isMainBill)) {
        if (r.mergeColumns) {
          return this.tableBtnList.map((item) => ({ ...item, importType }));
        } else {
          return this.tableBtnList
            .filter((item) => !item.hideMergeColumns)
            .map((item) => ({ ...item, importType }));
        }
      }
      return this.tableBtnList
        .filter((e) => e.isAllShow)
        .map((item) => ({ ...item, importType }));
    },
    /** 箱单发票/HBL资料 预览与下载 */
    previewDownloadConfig(row, importType, btnType) {
      if (btnType == "HBL") {
        const { id, orderType } = this.formData;
        // const params = {
        //   operationOrderId: id,
        //   type: 0,
        //   tdisType: 2,
        //   importType,
        // };
        // return { previewParam: params, previewHttp: getBillDetailPreview };
        return {
          previewParam: {
            type: 1,
            idList: [row.operationOrderId],
            importType,
            orderType,
            fileExportType: 1, // 1-单个
          },
          previewHttp: previewDownloadHblList,
        };
      } else {
        const { operationOrderId, mergeColumns } = row;
        let list = [row];
        if (mergeColumns) {
          list = this.tableData[importType].filter(
            (item) => item.mergeColumns === mergeColumns
          );
        }
        return {
          previewParam: {
            operationOrderId,
            importType,
            operationOrderIdList: list.map((item) => item.operationOrderId),
          },
          previewHttp: exportClearanceInvoice,
        };
      }
    },
    /** 批量下载 */
    packHblDownload(importType, btnType) {
      let params = {
        type: 1,
        idList: this.tableData[importType].map((item) => item.operationOrderId),
        importType,
      };
      if (btnType === "HBL") {
        const { orderType } = this.formData;
        Object.assign(params, {
          orderType,
          fileExportType: 2, // 2-批量
        });
      }
      const downloadZipHttp =
        btnType === "HBL" ? previewDownloadHblList : batchExportZipDownloadEC;
      comFileDownload(this, downloadZipHttp, params);
    },
    // 清关合并
    handleMerge(importType) {
      const params = {
        operationOrderIdList: this.selectionRows.map(
          (item) => item.operationOrderId
        ),
        isMergeColumn: 1,
      };
      clearanceMerge(params).then(() => {
        console.log(this.$refs[`tableRef${importType}`]);
        this.$refs[`tableRef${importType}`] &&
          this.$refs[`tableRef${importType}`][0].refreshTable();
        this.selectionRows = [];
        this.$refs[`tableRef${importType}`][0]._toggleRowSelectionMixin({
          newCheckRows: this.selectionRows,
        });
      });
    },
    // 解除清关合并
    handleReleaseMerge(row, btnItem) {
      const { mergeColumns } = row;
      const list = this.tableData[btnItem.importType].filter(
        (item) => item.mergeColumns === mergeColumns
      );
      const params = {
        operationOrderIdList: list.map((item) => item.operationOrderId),
        isMergeColumn: 0,
      };
      clearanceMerge(params).then(() => {
        this.$refs[`tableRef${btnItem.importType}`] &&
          this.$refs[`tableRef${btnItem.importType}`][0].refreshTable();
      });
    },
    // 维护货物信息
    handleMaintainGoods(row, btnItem) {
      this.handleView({
        path: "/operateManage/onLineImport",
        operationOrderId: row.operationOrderId,
        importType: btnItem.importType,
        isImport: true,
      });
    },
    handleView({ path, ...query }) {
      this.$router.push({
        path,
        query: {
          ...query,
          data: qs.stringify(this.$route.query),
        },
      });
    },
    // 数据模板导出
    handleBoxInvoice(row, btnItem) {
      const { operationOrderId, mergeColumns } = row;
      let list = [row];
      if (mergeColumns) {
        list = this.tableData[btnItem.importType].filter(
          (item) => item.mergeColumns === mergeColumns
        );
      }
      comFileDownload(this, exportClearanceInvoice, {
        operationOrderId,
        importType: btnItem.importType,
        operationOrderIdList: list.map((item) => item.operationOrderId),
      });
    },
    // 货物导入
    handleImport({ operationOrderId }, btnItem) {
      this.currImportParam = {
        operationOrderId,
        importType: btnItem.importType,
      };
      // this.isPrediction = !!isPrediction;
      this.$refs.productUploadRef?.handleUploadClick();
    },
    uploadSuccess(res) {
      this.fullscreenLoading.hide();
      console.log("res, row===uploadSuccess", res);
      const { otherInfo = {} } = res.data;
      if (
        otherInfo.requiredInfo ||
        otherInfo.matchingInfo ||
        otherInfo.templateInfo ||
        otherInfo.checkInfo
      ) {
        this.handleImportErr(otherInfo);
        return;
      }
      this.goImportInvoice(res.data);
    },
    goImportInvoice(data) {
      this["dataImport/setECommerceImport"](data);
      const query = {
        ...this.currImportParam,
        data: qs.stringify(this.$route.query),
      };
      this.$router.push({
        path: "/operateManage/onLineImport",
        query,
      });
    },
    handleEditRemark(row, btnItem) {
      this.$refs.customDialogRef?.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "编辑备注",
          label: "备注：",
          rulesKey: "not_required",
          labelWidth: "60px",
        }),
        formModel: {
          type: [0, 1][btnItem.importType - 3], // 0-预报；1-核实
          isOverseaOrders: 0,
          businessId: row.operationOrderId,
          remark:
            btnItem.importType == "4" ? row.rowDccRemark : row.rowYbDccRemark,
        },
        httpRequest: postClearanceItemRemark,
        successFunction: () => {
          this.$refs[`tableRef${btnItem.importType}`][0]?.refreshTable();
        },
      });
    },
    importUrlXlsx() {
      download(INVOICE_EC_IMPORT_TEMPLATE);
    },
    selectionRowEvt(row) {
      // 列表条件选择，不满足条件置灰
      if (row.isMainBill === 1 || row.mergeColumns) {
        //ZJB 不可选
        return false;
      }
      const rSome = this.selectionRows.some(
        (e) => e.eoriNo === row.eoriNo && e.vatNo === row.vatNo // VAT和EORI相同可合并
      );
      if (this.selectionRows.length && !rSome) {
        return false;
      }
      return true;
    },
    onSelectionChange(rows = [], importType) {
      const nRows = rows.filter(
        // (e) => e.isGenerateStatement !== 1 && !e.isUpdate && !e.lockOrder
        (e) => e.isMainBill !== 1 && !e.mergeColumns
      );
      // this.selectionRows = nRows;
      const row = nRows[0] || {};
      this.selectionRows = nRows.filter(
        (e) => e.eoriNo === row.eoriNo && e.vatNo === row.vatNo // VAT和EORI相同可合并
      );
      this.$refs[`tableRef${importType}`][0]._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.clearance-table {
  .table-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 17px 0 7px;

    .title {
      font-size: 14px;
      font-weight: bold;
    }
    /deep/ {
      .el-button--small.is-round {
        padding: 5px 12px;
      }
    }
  }
  /deep/ {
    .tableData .operation-btn-box .el-dropdown {
      margin-left: 0;
    }
    .el-checkbox {
      margin-right: 0;
    }
  }
}
</style>
