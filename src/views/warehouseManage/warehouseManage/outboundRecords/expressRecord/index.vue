<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchFormConfig"
              @searchHeight="searchHeight"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="mixinTableColArr[tab.name - 1]"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableQueryParams"
              :rowOperationBtnListFn="(r) => tableBtnList(r)"
              @handleTableView="(r) => handleDetails(r)"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <GoodsVerifyDialog ref="goodsVerifyRef" />
    <ExpressBatchDialog ref="batchExpressRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { customMessageBox } from "@/utils/confirmBox.js";
import {
  getExpressInfoPageList,
  delExpressInfo,
  exportExpressList,
  getTruckCheckOrderState,
} from "@/api/warehouse/process";
import {
  putExpressDeliveryCompleted,
  putBatchDeliveryRegistration,
  getDeliveryDetails,
} from "@/api/warehouse/manage";
import { simpleTimeCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import { searchColumns, tableColumns, seeDlgFormCols } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getStreamFileDownload } from "@/utils/zipdownload";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "ExpressOutboundRecord",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.kd_info_bm("快递信息"),
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "批量导出",
            disabled: true,
            handleClick: () => {
              if (this.selectionRows.length) {
                const { expressCompanyId } = this.selectionRows[0];
                const isEvery = this.selectionRows.every(
                  (r) => expressCompanyId === r.expressCompanyId
                );
                if (isEvery) {
                  comFileDownload(
                    this,
                    exportExpressList,
                    this.selectionRows.map((e) => e.id)
                  );
                } else {
                  this.msgError("选择的快递公司不相同，不能进行批量导出");
                }
              }
            },
          },
          {
            table: "批量出库登记",
            disabled: true,
            handleClick: () => {
              if (this.selectionRows.length) {
                const isEvery = this.selectionRows.every(
                  (r) => [0].includes(r.state) && [2].includes(r.freightState)
                );
                if (isEvery) {
                  this.handleRegistration(this.selectionRows);
                } else {
                  this.msgError(
                    "选择的快递信息，货物状态不为待出库，状态不为已登记，不能进行批量出库登记操作"
                  );
                }
              }
            },
          },
          {
            table: "批量派送完成",
            disabled: true,
            handleClick: () => {
              if (this.selectionRows.length) {
                const isEvery = this.selectionRows.every(
                  (r) => [1].includes(r.state) && [2].includes(r.freightState)
                );
                if (isEvery) {
                  this.handleDispatch(this.selectionRows);
                } else {
                  this.msgError(
                    "选择的快递信息，货物状态不为待出库，状态不为派送中，不能进行批量派送完成操作"
                  );
                }
              }
            },
          },
          {
            table: "批量打印快递面单",
            disabled: true,
            handleClick: () => this.handleBatch(),
          },
        ],
      },
      showSearchForm: false,
      searchFromData: {},
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "95px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        fold: true,
        searchForm: true,
        searchColsHeight: true,
        lists: searchColumns(),
      },
      mixinTableColArr: [tableColumns()],
      tableConfig: {
        httpRequest: getExpressInfoPageList,
        statusBtnList: [
          {
            text: this.overseaLangObj.tz_jh || "调整计划",
            showStatus: [0], // 快递状态
            goodsStatus: [1], // 货物状态
            handleClick: (r) => this.handleAdjustPlan(r),
          },
          {
            text: this.overseaLangObj.cf_dj || "出库登记",
            showStatus: [0],
            goodsStatus: [2],
            handleClick: (row) => this.handleRegistration([row]),
          },
          {
            text: this.overseaLangObj.ps_wc || "派送完成",
            showStatus: [1],
            goodsStatus: [2, 3],
            handleClick: (row) => this.handleDispatch([row]),
          },
          {
            text: this.overseaLangObj.bj_edit("修改"),
            showStatus: [0],
            goodsStatus: [0, 1, 2],
            handleClick: this.handleEditDlg,
          },
          {
            text: this.overseaLangObj.yc_delete("删除"),
            color: "#FF6767",
            showStatus: [0],
            goodsStatus: [0, 1, 2],
            handleClick: this.handleDelete,
          },
        ],
      },
      selectionRows: [],
    };
  },
  methods: {
    handleAdjustPlan(row) {
      this.$refs.goodsVerifyRef.showVerify(
        {
          ...row,
          id: row.planId,
        },
        {
          editSuccess: () => this.mixinkeepTable(),
        }
      );
    },
    handleEditDlg(row = {}) {
      this.$refs.batchExpressRef.editShow(
        {
          ...row,
          webPageLocation: 2,
        },
        {
          editSuccess: () => this.mixinkeepTable(),
        }
      );
    },
    handleDispatch(rows) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: simpleTimeCols({
          title: this.overseaLangObj.ps_wc || "派送完成",
          label: `${this.overseaLangObj.sj_dd_sj("实际到达时间")}：`,
          isRemark: true,
        }),
        formModel: {},
        httpRequest: (param) => {
          return putExpressDeliveryCompleted({
            idList: rows.map((e) => e.id),
            actualReachTime: param.time,
            remark: param.remark,
          });
        },
        successFunction: () => this.mixinkeepTable(),
      });
    },
    async handleRegistration(rows) {
      await getTruckCheckOrderState({
        type: 2,
        idList: rows.map((e) => e.id),
      });
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: simpleTimeCols({
          title: this.overseaLangObj.cf_dj || "出库登记",
          label: `${this.overseaLangObj.sj_fc_sj("实际出库时间")}：`,
          isRemark: true,
        }),
        formModel: {},
        httpRequest: (param) => {
          return putBatchDeliveryRegistration({
            idList: rows.map((e) => e.id),
            actualTime: param.time,
            remark: param.remark,
          });
        },
        successFunction: () => this.mixinkeepTable(),
      });
    },
    handleDelete(row = {}) {
      customMessageBox(
        this,
        {
          msgTitle: this.overseaLangObj.ts_tip("删除提示"),
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delExpressInfo(row.id),
        },
        () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("删除成功"));
          this.mixinkeepTable();
        }
      );
    },
    getTableList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      const [createTimeGe, createTimeLe] = createTime || [];
      this.searchFromData[activeName] = {
        ...searchObj,
        createTimeGe,
        createTimeLe,
      };
      this.mixinkeepTable(true);
    },
    tableQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
      };
    },
    async handleDetails(row) {
      this.$refs.batchExpressRef.editShow(
        {
          ...row,
          webPageLocation: 2,
          isWebSee: true, // 查看
        },
        {
          editSuccess: () => this.mixinkeepTable(),
        }
      );
      // const opt = {
      // 	id: row.id,
      // 	pageLocation: 2
      // }
      // const formModel = (await getDeliveryDetails(opt)).data || row;
      // this.$refs.customDialogRef.showCustomDialog({
      //   customFormConfig: seeDlgFormCols(),
      //   formModel,
      // });
    },
    handleBatch() {
      getStreamFileDownload(
        "urlDownloadDeliveryNote",
        {
          distributionType: 2, // 1=卡车；2=快递；3=自提
          infoIdList: this.selectionRows.map((e) => e.id),
        },
        {
          method: "post",
          customFileName: "attach.zip",
        }
      ).then(() => {
        this.mixinkeepTable();
      });
    },
    selectionRowEvt() {
      return true;
    },
    onTableSelectionChange(rows) {
      this.selectionRows = rows || [];
      // this.$refs[
      //   `tableRef${this.tabsConfig.activeName}`
      // ][0]?._toggleRowSelectionMixin({
      //   newCheckRows: this.selectionRows,
      // });
    },
    tableBtnList(row) {
      return this.tableConfig.statusBtnList.filter((e) => {
        return (
          (e.showStatus || []).includes(row.state) &&
          (e.goodsStatus || []).includes(row.freightState)
        );
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "destinationType",
      "distributionPlanState",
      "distributionPlanKdState",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    ExpressBatchDialog: () =>
      import(
        "@/views/warehouseManage/warehouseManage/outboundDelivery/express/exBatchDlg.vue"
      ),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    GoodsVerifyDialog: () =>
      import(
        "@/views/warehouseManage/warehouseManage/outboundDelivery/truck/components/goodsVerifyDlg.vue"
      ),
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.tabsConfig.btnArr.forEach((ele, idx) => {
        this.$set(this.tabsConfig.btnArr[idx], "disabled", !sLen);
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
