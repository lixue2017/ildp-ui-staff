<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchTabForm(tab.name)"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${[324, 264][tab.name - 1]}px)`"
              :columnConfig="mixinTableColArr[tab.name - 1]"
              :httpRequest="tableConfig.httpRequest[tab.name - 1]"
              :getQueryParams="() => tableQueryParams(tab.name)"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="(r) => tableBtnList(r, tab.name)"
              @handleTableView="(r) => handleDetails(r)"
            >
              <template v-slot:bottomTotal>
                <div class="grand-total" v-if="tabsConfig.activeName == 1">
                  <template v-for="(tItem, i) in tableSubtotal">
                    <span :key="`t_${i}`">
                      <span>{{ tItem.totalLabel }}：</span>
                      <span>{{ tItem.totalNum }}</span>
                    </span>
                  </template>
                </div>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <div
          style="margin-right: 10px; max-width: 700px"
          class="primary-text-color"
          v-show="tabsConfig.activeName === '1'"
        >
          {{ overseaLangObj.sm_platoon }}
        </div>
      </template>
    </ComTabs>

    <!-- <ConfirmDialog ref="confirmDialogRef" /> -->
    <ComCustomDialog ref="customDialogRef" />
    <GoodsVerifyDialog ref="goodsVerifyRef" />
    <TruckVerifyDialog ref="truckVerifyRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getTruckDeliveryList } from "@/api/warehouse/manage";
import { accumulationFn, subtractFn } from "@/utils/instructions";
import { getStreamFileDownload } from "@/utils/zipdownload";
import { searchColumns, tableColumns, seeDlgFormCols } from "./model";
import { changePlanDistributionType } from "@/api/warehouse/process";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";

export default {
  name: "TruckOutbound",
  mixins: [mixinColsConf],
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
            label: this.overseaLangObj.dpc_platoon || "待排车",
            name: "1",
          },
          {
            label: this.overseaLangObj.ypc_platoon || "已排车",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.pl_pc || "批量派车",
            disabled: true,
            showTabName: "1",
            handleClick: () => {
              if (this.selectionEveryRow()) {
                this.handleEditPage(null);
              } else {
                this.msgError(
                  "目的地类型不一致、目的仓或收件地址不一致，不可批量派车"
                );
              }
            },
          },
          {
            table: this.overseaLangObj.zh_kd || "转快递",
            disabled: true,
            showTabName: "1",
            handleClick: () => this.handleChangeStatus(null, 2),
          },
          {
            table: this.overseaLangObj.zh_zt || "转自提",
            disabled: true,
            showTabName: "1",
            handleClick: () => this.handleChangeStatus(null, 3),
          },
        ],
      },
      selectionRows: [],
      searchFromData: {},
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "122px" : "98px",
        formModel: {},
        residueCols: [2],
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        searchForm: true,
      },
      mixinTableColArr: [tableColumns("1"), tableColumns("2")],
      tableConfig: {
        httpRequest: [getTruckDeliveryList, getTruckDeliveryList],
        statusBtnList: [
          {
            text: this.overseaLangObj.kc_ps || "卡车派送",
            btnStatus: [0, 2],
            btnShowTabs: ["1"],
            handleClick: (r) => this.handleEditPage([r]),
          },
          {
            text: this.overseaLangObj.zh_kd || "转快递",
            btnStatus: [0, 2],
            btnShowTabs: ["1"],
            // noBusType: [5], // 海外提派无转快递
            handleClick: (row) => this.handleChangeStatus([row.id], 2),
          },
          {
            text: this.overseaLangObj.zh_zt || "转自提",
            btnStatus: [0, 2],
            btnShowTabs: ["1"],
            handleClick: (row) => this.handleChangeStatus([row.id], 3),
          },
          {
            text: this.overseaLangObj.hs_hw_jh || "核实货物计划",
            btnStatus: [1],
            handleClick: (row) => this.handleVerifyGoods(row),
          },
          {
            text: "卡车拣货单",
            btnShowTabs: ["2"],
            handleClick: (r) => {
              getStreamFileDownload(
                `/distributionTruckInfo/exportTruckPickingList/${r.distributionInfoId}`
              );
            },
          },
          // {
          //   text: "调整卡车",
          //   btnStatus: [1],
          // 	btnShowTabs: ['2'],
          //   handleClick: (row) => this.handleVerifyTruck(row),
          // },
        ],
      },
    };
  },
  methods: {
    handleVerifyGoods(row) {
      this.$refs.goodsVerifyRef.showVerify(row, {
        editSuccess: this.mixinkeepTable,
      });
    },
    handleVerifyTruck(row) {
      this.$refs.truckVerifyRef.showVerify(row);
    },
    handleChangeStatus(idList, distributionType) {
      const cOpt = {
        distributionType,
        idList: idList ? idList : (this.selectionRows || []).map((e) => e.id),
      };
      this.comRepeatedRequest(this, changePlanDistributionType, cOpt).then(
        () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("操作成功"));
          this.onTableSelectionChange();
          this.mixinkeepTable();
        }
      );
    },
    handleEditPage(rows) {
      this.$router.push({
        path: "/warehouseManage/deliveryPlan/truckOutboundEdit",
        query: {
          id: (rows || this.selectionRows)
            .map((e) => e.idList.join(","))
            .join(","),
          pageLocation: 1, // 1=卡车出库；2=派卡车信息
          backPath: this.$route.path,
        },
      });
    },
    selectionEveryRow() {
      const row = this.selectionRows[0];
      return this.selectionRows.every(
        (e) =>
          e.destinationType === row.destinationType &&
          ((e.destinationType == 1 && e.destinationId === row.destinationId) ||
            (e.destinationType == 2 &&
              e.receivingAddress === row.receivingAddress))
      );
    },
    // 表格多选
    onTableSelectionChange(rows = []) {
      // 初始全选时需要过滤不同条件表格行
      this.selectionRows = rows;
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]._toggleRowSelectionMixin({ newCheckRows: this.selectionRows });
    },
    // 不同类型不可同时选择
    selectionRowEvt(row) {
      return true; // 可选
    },
    getTableList(searchFrom = {}) {
      const { createTime, statusList, destinationId, thTime, ...searchObj } =
        searchFrom;
      const [createTimeGe, createTimeLe] = createTime || [];
      const [pickupTimeGe, pickupTimeLe] = thTime || [];
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        destinationId,
        destinationType: destinationId ? 1 : undefined,
        statusList: statusList?.length ? statusList : undefined,
        createTimeGe,
        createTimeLe,
        pickupTimeGe,
        pickupTimeLe,
      };
      this.mixinkeepTable(true);
    },
    tableQueryParams(tName) {
      return {
        ...this.searchFromData[tName],
        distributionType: 1, // 字典：distributionType 1=卡车；2=快递；3=自提
        tab: tName - 1,
      };
    },
    handleDetails(row = {}) {
      // this.$refs.customDialogRef.showCustomDialog({
      //   customFormConfig: seeDlgFormCols(),
      //   formModel: row,
      // });
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e.distributionInfoId);
      this.$router.push({
        path: "/warehouseManage/deliveryPlan/deliveryRecord/seeTruckOutboundRecord",
        query: {
          id: row.distributionInfoId,
          pageLocation: 2,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          backPath: this.$route.fullPath,
        },
      });
      // const { businessType } = row;
      // const pathObj = {
      //   3: `/warehouseManage/outStorage/wholeSaleDetails`, // 一件代发详情
      //   2: `/warehouseManage/outStorage/fbaWarehouseDetails`, // FBA订单详情
      //   1: `/warehouseManage/inStorage/buttOrderDetails`, // 中转出库/大货中转 -> 电商头程详情
      // };
      // const idList = this.$refs[
      //   `tableRef${this.tabsConfig.activeName}`
      // ][0].tableData
      //   .map((e) => {
      //     if (e.businessType == businessType) {
      //       return e.id;
      //     }
      //   })
      //   .filter((result) => typeof result !== "undefined");
      // this.$router.push({
      //   path: pathObj[businessType],
      //   query: {
      //     id: row.id,
      //     backPath: this.$route.path,
      //     pageSign: idList.join(","), // 详情显示上一页/下一页
      //   },
      // });
    },
    handleTruckView(row = {}) {
      // const idList = [
      //   ...new Set(
      //     this.$refs[`tableRef${+this.tabsConfig.activeName}`][0].tableData.map(
      //       (e) => e.truckId
      //     )
      //   ),
      // ];
      // this.$router.push({
      //   path: "/warehouseManage/process/editTruckRecord",
      //   query: {
      //     id: row.truckId,
      //     backPath: this.$route.fullPath,
      //     pageSign: idList.join(","), // 详情显示上一页/下一页
      //   },
      // });
    },
    tableBtnList(r, tName) {
      return this.tableConfig.statusBtnList.filter((btn) => {
        const btnTab = btn.btnShowTabs ? btn.btnShowTabs.includes(tName) : true;
        if (btnTab) {
          return (
            (btn.btnStatus ? btn.btnStatus.includes(r.state) : true) &&
            (btn.noBusType ? !btn.noBusType.includes(r.businessType) : true)
          );
        }
        return false;
      });
    },
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        fold: true,
        lists: searchColumns(tName),
      };
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "distributionType",
      "distributionBusinessType",
      "destinationType",
      "distributionPlanState",
      "customsClearanceMode",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  watch: {
    selectionRows: {
      deep: true,
      handler: function (newVal) {
        this.tabsConfig.btnArr.map((e) => {
          const { showTabName } = e;
          if (showTabName == 1) {
            this.$set(e, "disabled", !newVal.length);
          }
        });
      },
    },
  },
  computed: {
    tableSubtotal() {
      const arr = this.selectionRows || [];
      return [
        {
          totalLabel: this.overseaLangObj.xz_row || "选择行",
          totalNum: arr.length,
        },
        {
          totalLabel: this.overseaLangObj.zxs_total("总箱数/件数"),
          totalNum: accumulationFn(
            arr.map((e) =>
              e.verificationNum
                ? e.verificationNum
                : subtractFn([e.forecastNum, e.registrationNum])
            )
          ),
        },
        {
          totalLabel: this.overseaLangObj.total_weight("总重量(KG)"),
          totalNum: accumulationFn(
            arr.map((e) => e.totalWeight),
            2
          ),
        },
        {
          totalLabel: this.overseaLangObj.total_volume("总体积(m³)"),
          totalNum: accumulationFn(
            arr.map((e) => e.totalVolume),
            2
          ),
        },
        {
          totalLabel: this.overseaLangObj.z_plt_num || "总PLT数",
          totalNum: accumulationFn(arr.map((e) => e.trayCount)),
        },
      ];
    },
  },
  components: {
    // ConfirmDialog: () => import("_comp/ConfirmDialog"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    GoodsVerifyDialog: () => import("./components/goodsVerifyDlg"),
    TruckVerifyDialog: () => import("./components/truckVerifyDlg"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
