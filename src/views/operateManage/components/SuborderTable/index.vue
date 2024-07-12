<template>
  <div>
    <div class="title">
      <div class="title-left">
        <span class="label-txt">子单信息</span>
        <span class="primary-text-color"
          >* 同一客户同一VAT、子单且只有1个HBL单才能进行合并提单</span
        >
      </div>
      <div class="title-right">
        <template v-for="(btn, i) in rightBtnList()">
          <el-dropdown
            v-if="btn.btnType === 'dropdown'"
            :key="`dropdown-${i}`"
            trigger="click"
            placement="bottom"
          >
            <el-button
              :type="btn.type || 'primary'"
              :size="btn.size || 'small'"
              :plain="btn.plain || false"
              round
              :class="btn.className"
              @click="btn.handleDropdown && btn.handleDropdown()"
            >
              {{ btn.label }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" :class="btn.dropdownClassName">
              <el-dropdown-item
                v-for="dItem in btn.dropdownArr"
                :key="dItem.value"
                @click.native="btn.handleClick && btn.handleClick(btn, dItem)"
                >{{ dItem.name }}</el-dropdown-item
              >
              <div class="dropdown-no-data" v-if="!btn.dropdownArr.length">
                无数据
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-else
            v-debounce="btn.banDebounce"
            :key="`btn-${i}`"
            type="primary"
            size="small"
            :plain="btn.plain || false"
            round
            :class="btn.className"
            :disabled="btn.isCheck ? !(selectionRows.length > 1) : false"
            @click="btn.handleClick && btn.handleClick()"
            >{{ btn.label }}</el-button
          >
        </template>
      </div>
    </div>
    <!-- formModel.canSplitOrder && formModel.isMainBill === 3 -->
    <ComTable
      ref="tableRef"
      :httpRequest="tableConfig.httpRequest"
      :columnConfig="tableConfig.tableColumns()"
      :getQueryParams="tableConfig.getQueryParams"
      :selectionRow="selectionRowEvt"
      @onSelectionChange="onTableSelectionChange"
      :selectionTableRow="[...selectionRows]"
      :rowOperationBtnListFn="getOperationBtn"
      :pagination="false"
      @handleTableView="handleView"
      @getResult="getResult"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="['meansNum', 'declareNum'].includes(slotProps.prop)">
          <div
            :class="[
              'operation-content',
              `${
                slotProps.row[slotProps.prop]
                  ? 'wanzheng-tip-color'
                  : 'queshi-tip-color'
              }`,
            ]"
          >
            <i
              :class="[
                'iconfont',
                `${slotProps.row[slotProps.prop] ? 'wanzheng2' : 'queshi2'}`,
              ]"
            />
            <span>{{ slotProps.dicsList.nameCn || "缺失" }}</span>
          </div>
        </template>
      </template>
      <template v-slot:bottomTotal>
        <div class="grand-total">
          <span>合计：</span>
          <span>
            <span>{{ tableTotal }}</span>
          </span>
        </div>
      </template>
    </ComTable>
    <ComUpload
      style="display: none"
      ref="productUploadRef"
      :uploadConfig="{
        ...productUploadConfig,
        uploadData: {
          importType,
          operationOrderId: originOperationOrderId || operationOrderId,
          customerId: formModel.customerId,
        },
      }"
      @handleSuccess="(res) => uploadSuccess(res)"
      @handleError="handleImportErr"
      @handleUploading="handleUploading"
    />
  </div>
</template>

<script>
import {
  defaultParams,
  importClearanceProductInvoice,
  INVOICE_EC_IMPORT_TEMPLATE,
} from "_comp/ComUpload/model";
import {
  exportClearanceInvoice,
  clearanceMerge,
} from "@/api/operateRecord/clearanceGoods.js";
import { customMessageBox, msgBox } from "@/utils/confirmBox.js";
import { comFileDownload } from "@/utils/download.js";
import { tableColumns } from "./model.js";
import {
  cancelSplitOrder,
  getSplitOrderList,
  deleteSplitOrder,
  copySplitOrder,
} from "@/api/operateManage/common";
import { mixinImportConf } from "@/views/operateManage/components/mixinImportConf.js";
import qs from "qs";
export default {
  name: "SuborderTable",
  mixins: [mixinImportConf],
  props: {
    formModel: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComUpload: () => import("_comp/ComUpload"),
  },
  data() {
    return {
      operationOrderId: undefined,
      originOperationOrderId: undefined,
      importType: 5,
      btnRight: [
        {
          btnType: "dropdown",
          label: "新增子单",
          round: true,
          dropdownArr: [
            {
              name: "箱单发票导入",
              value: 1,
            },
            {
              name: "新增",
              value: 2,
            },
          ],
          handleClick: this.handleAdd,
        },
        {
          label: "取消拆单",
          round: true,
          plain: true,
          handleClick: this.handleCancel,
        },
        {
          label: "合并清关",
          round: true,
          plain: true,
          isCheck: true, // 选中2个按钮才可操作
          // banDebounce: true,
          handleClick: this.handleMerge,
        },
      ],
      tableTotal: 0,
      tableConfig: {
        tableColumns,
        httpRequest: getSplitOrderList,
        getQueryParams: this.getQueryParams,
      },
      tableBtnList: [
        {
          text: "维护箱单",
          handleClick: (row) => this.handleMaintainGoods(row.id),
        },
        {
          text: "箱单发票导入",
          handleClick: this.handleImportBefore,
        },
        {
          text: "复制子单",
          handleClick: (row) => this.handleMaintainGoods(row.id, true),
        },
        {
          text: "箱单导出",
          isAllShow: true,
          handleClick: (r) => this.handleBoxInvoice(r),
        },
        {
          text: "删除子单",
          handleClick: this.handleDelete,
        },
        {
          text: "导出合并箱单",
          hideMergeColumns: true,
          handleClick: (r) => this.handleBoxInvoice(r, true),
        },
        {
          text: "解除合并清关",
          hideMergeColumns: true,
          handleClick: (r) => this.handleReleaseMerge(r),
        },
      ],
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
      selectionRows: [],
      tableData: [],
    };
  },
  methods: {
    mixinKeepTable() {
      this.$refs.tableRef && this.$refs.tableRef.refreshTable(true);
    },
    getOperationBtn(r) {
      return this.tableBtnList.filter(
        (e) =>
          e.isAllShow ||
          (e.hideMergeColumns
            ? !!r.mergeColumn
            : this.formModel.canSplitOrder && this.formModel.isMainBill === 3)
      );
    },
    getQueryParams() {
      const { operationOrderId } = this.formModel;
      return {
        operationOrderId,
      };
    },
    handleView(row) {
      const query = this.$route.query;
      query.tabsActive = 13;
      this.$router.push({
        path: `/operateManage/ecOperateDetails`,
        query: {
          id: row.id, // 操作单ID
          backPath: this.$route.fullPath,
          data: qs.stringify(query),
        },
      });
    },
    getResult({ total, tableData }) {
      this.tableData = tableData;
      this.tableTotal = total;
    },
    handleAdd(btn, dItem) {
      const { operationOrderId, headTransportMode } = this.formModel;
      switch (dItem.value) {
        case 1:
          this.operationOrderId = undefined;
          this.originOperationOrderId = operationOrderId;
          this.handleImport();
          break;
        case 2:
          this.operationOrderId = undefined;
          this.originOperationOrderId = operationOrderId;
          this.goImportInvoiceCustomer({
            invoiceEcVo: {
              headTransportMode,
              encasementWay: 1,
              originOperationOrderId: operationOrderId,
            },
          });
          break;

        default:
          break;
      }
    },
    handleCancel() {
      const { operationOrderId } = this.formModel;
      let html = `<div>
      	<div class="base-flex-align">
      		<i class="el-icon-warning-outline text-orange""></i>
      		<span class="text-info">取消拆单之后的选中<span class="text-default">${this.tableTotal}</span>条子单货物同步到原单</span>
      	</div>
      	<div class="text-orange" style="margin: 5px 0 31px 18px;">(取消拆单之后不可恢复)</div>
      	<div class="margin-left text-weight">是否确定继续？</div>
      </div>`;
      msgBox(
        this,
        {
          title: "提示",
          customClass: "confirm-box__new",
          html,
          confirmButtonText: "继 续",
          showCancelButton: true,
        },
        () => {
          cancelSplitOrder({
            operationOrderId,
          }).then((res) => {
            this.$emit("cancelSplitOrderSuccess");
          });
        }
      );
      customMessageBox(
        this,
        {
          customHtml: html,
          type: "",
          customClass: "confirm-box__new",
          httpMsgRequest: () =>
            cancelSplitOrder({
              operationOrderId,
            }),
        },
        () => {
          this.$emit("cancelSplitOrderSuccess");
        }
      );
    },
    handleImportBefore(row = {}) {
      this.operationOrderId = row.id;
      this.originOperationOrderId = undefined;
      this.handleImport();
    },
    // 导出箱单
    handleBoxInvoice(row, isMerge) {
      let list = [row];
      if (isMerge && row.mergeColumn) {
        list = this.tableData.filter((e) => e.mergeColumn === row.mergeColumn);
      }
      comFileDownload(this, exportClearanceInvoice, {
        operationOrderId: row.id,
        importType: 5,
        operationOrderIdList: list.map((e) => e.id),
      });
    },
    // 清关合并
    handleMerge() {
      if (this.selectionRows.length > 1) {
        const params = {
          operationOrderIdList: this.selectionRows.map((e) => e.id),
          isMergeColumn: 1,
        };
        clearanceMerge(params).then(() => {
          this.onTableSelectionChange();
          this.mixinKeepTable();
        });
      } else {
        this.msgError("至少选中2个才可合并");
      }
    },
    // 解除清关合并
    handleReleaseMerge(row) {
      const list = this.tableData.filter(
        (e) => e.mergeColumn === row.mergeColumn
      );
      const params = {
        operationOrderIdList: list.map((e) => e.id),
        isMergeColumn: 0,
      };
      clearanceMerge(params).then(() => {
        this.mixinKeepTable();
      });
    },
    onTableSelectionChange(rows = []) {
      const nRows = rows.filter((e) => e.canMerge === 1);
      const row = nRows[0] || {};
      this.selectionRows = nRows.filter(
        (e) =>
          e.userShortName === row.userShortName &&
          e.eoriNo === row.eoriNo &&
          e.vatNo === row.vatNo
      );
      this.$refs.tableRef?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt(row) {
      const isCanMerge = row.canMerge === 1 && !row.mergeColumn; // 是否能合并（只有一个Hbl的时候才能合并）
      if (this.selectionRows.length) {
        const rSome = this.selectionRows.some(
          (e) =>
            e.userShortName === row.userShortName &&
            e.eoriNo === row.eoriNo &&
            e.vatNo === row.vatNo // 委托人与VAT和EORI相同可合并
        );
        return isCanMerge && rSome;
      }
      return isCanMerge;
    },
    handleDelete(row = {}) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () =>
            deleteSplitOrder({
              operationOrderId: row.id,
            }),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinKeepTable();
        }
      );
    },
    rightBtnList() {
      if (this.formModel.canSplitOrder && this.formModel.isMainBill === 3) {
        return this.btnRight;
      }
      return this.btnRight.filter((e) => e.isCheck);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .title-left {
    margin: 18px 0 12px;
    .label-txt {
      color: #515151;
      font-size: 14px;
      font-weight: bold;
      margin-right: 10px;
    }
  }
  .title-right {
    align-self: center;
  }
  /deep/ {
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
