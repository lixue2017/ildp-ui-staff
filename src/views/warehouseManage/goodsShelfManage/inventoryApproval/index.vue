<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(tab.name)"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:locationId="slotProps">
                <AutoComplete
                  ref="agentRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="slotProps.fieldItem"
                  :additionalParam="{
                    warehouseId: curWarehouseObj.value,
                  }"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableConfig.columnConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="(r) => tableStatusList(r)"
              :isMountedRequest="false"
              @handleTableView="(r, col) => handleChangeRoute(r, col)"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="changeCurWarehouseTable" />
      </template>
    </ComTabs>
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import {
  getStockApprovalList,
  postStockApprovalReject,
  delStockApproval,
  postStockApprovalEdit,
  postStockApprovalSave,
  exportBatchInventory,
} from "@/api/goodsShelf/batchInventory";
import { mapActions } from "vuex";
import { searchColumns, tableColumns } from "./model";
import {
  inventoryAdjustmentCols,
  inventoryApproveCols,
} from "../batchInventory/model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { comFileDownload } from "@/utils/download.js";
import { customMessageBox } from "@/utils/confirmBox.js";
export default {
  name: "InventoryApproval",
  components: {
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.mixinkeepTable();
          });
        },
        tabs: [
          {
            label: "库存审批",
            name: "1",
          },
          {
            label: "已审批",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.dc_export("导出"),
            icon: "iconfont daochu",
            handleClick: () => {
              comFileDownload(
                this,
                exportBatchInventory,
                this.getQueryParams(this.tabsConfig.activeName)
              );
            },
          },
        ],
      },
      searchFromData: {
        1: {},
        2: {},
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        searchColsHeight: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "118px" : "80px",
      },
      tableConfig: {
        httpRequest: getStockApprovalList,
        columnConfig: tableColumns,
      },
      tableBtnList: [
        {
          text: "修改",
          btnStatus: [11],
          handleClick: (row) => this.handleInventoryAdjustment(row),
        },
        {
          text: "删除",
          color: "#FF6767",
          btnStatus: [11],
          handleClick: (row) => {
            customMessageBox(
              this,
              {
                msgTitle: "删除提示",
                msgTxt1: "删除不可逆",
                msgTxtColor: "#FF6767",
                httpMsgRequest: () => delStockApproval(row.applyId),
              },
              () => {
                this.msgSuccess("操作成功");
                this.mixinkeepTable();
              }
            );
          },
        },
        {
          text: "确认",
          btnStatus: [1],
          handleClick: (row) => this.handleInventoryApprove(row),
        },
        {
          text: "打回",
          btnStatus: [1],
          color: "#FF6767",
          handleClick: (row) => {
            customMessageBox(
              this,
              {
                msgTitle: "打回提示",
                msgTxt1: "打回不可逆",
                httpMsgRequest: () =>
                  postStockApprovalReject({ id: row.applyId }),
              },
              () => {
                this.msgSuccess("操作成功");
                this.mixinkeepTable();
              }
            );
          },
        },
      ],
      mixinTableColArr: [tableColumns("1"), tableColumns("2")],
    };
  },
  methods: {
    changeCurWarehouseTable(curObj) {
      this.getWarehouseTableMixin(curObj);
      this.$refs.agentRef && this.$refs.agentRef[0]?.changeFocusRequest();
    },
    handleInventoryAdjustment(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: inventoryAdjustmentCols(),
        formModel: {
          ...row,
          adjustReason: this.typeConversion(row.adjustReason),
        },
        httpRequest: (opt) => {
          const {
            applyId,
            receiptType,
            adjustReason,
            applyRemark,
            applyResultNum,
            reviewedUserId,
          } = opt;
          return postStockApprovalEdit({
            applyId,
            receiptType,
            applyData: row,
            adjustReason,
            applyRemark,
            applyResultNum,
            // reviewedUserId,
            wmsId: this.curWarehouseObj.value,
          });
        },
        successFunction: () => this.mixinkeepTable(),
      });
    },
    handleInventoryApprove(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: inventoryApproveCols(),
        formModel: { ...row },
        httpRequest: (opt) => {
          const { remark } = opt;
          return postStockApprovalSave({
            id: opt.applyId,
            currentInventory: row.surplusNum,
            remark,
          });
        },
        successFunction: () => this.mixinkeepTable(),
      });
    },
    getSearchFormConfig(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(),
      };
    },
    getList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchFrom,
      };
      this.mixinkeepTable(true);
    },
    handleChangeRoute(row, col) {
      const { storageId, traySn } = row;
      this.$router.push({
        path: "/warehouseManage/goodsShelfManage/batchLog",
        query: {
          storageId,
          traySn,
          tName: ["2", "1"][row.receiptType - 1], // 箱=1；sku=2
        },
      });
    },
    getQueryParams(tName) {
      return {
        stateList: tName === "2" ? [2] : [1, 11],
        ...this.searchFromData[tName],
        warehouseId: this.curWarehouseObj.value,
      };
    },
    tableStatusList(r) {
      return this.tableBtnList.filter(
        (e) =>
          e.btnStatus.includes(r.applyState) &&
          (r.applyState === 1 ? r.wmsAdminFlag : true)
      );
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "stockAdjustApplyState",
      "warehousingSource",
      "stockAdjustReason",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
