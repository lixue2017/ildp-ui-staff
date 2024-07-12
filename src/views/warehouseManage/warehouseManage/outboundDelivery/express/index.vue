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
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="mixinTableColArr[tab.name - 1]"
              :httpRequest="tableConfig.httpRequest[tab.name - 1]"
              :getQueryParams="() => tableQueryParams(tab.name)"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows[tab.name]]"
              :rowOperationBtnListFn="(r) => tableBtnList(r, tab.name)"
              @handleTableView="(r) => handleDetails(r)"
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
  getExpressDeliveryList,
  putExpressDeliveryCompleted,
  putDeliveryRegistration,
} from "@/api/warehouse/manage";
import {
  changePlanDistributionType,
  delExpressInfo,
  getTruckCheckOrderState,
} from "@/api/warehouse/process";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { simpleTimeCols } from "_comp/ConfirmDialog/customFormDialog/model.js";

export default {
  name: "ExpressOutbound",
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
            label: this.overseaLangObj.kd_ck || "快递出库",
            name: "1",
          },
          {
            label: this.overseaLangObj.ydj_registered || "已登记",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.pl_xd || "批量下单",
            disabled: true,
            showTabName: "1",
            handleClick: () => {
              if (this.selectionEveryRow()) {
                this.handleBatchDlg(null);
              } else {
                this.msgError(
                  "目的地类型不一致、目的仓或收件地址不一致，不可批量下单"
                );
              }
            },
          },
          {
            table: this.overseaLangObj.zg_kc || "转卡车",
            disabled: true,
            showTabName: "1",
            handleClick: () => this.handleStatusChange(null, 1),
          },
          {
            table: this.overseaLangObj.zh_zt || "转自提",
            disabled: true,
            showTabName: "1",
            handleClick: () => this.handleStatusChange(null, 3),
          },
          {
            table: this.overseaLangObj.pl_ps || "批量派送",
            disabled: true,
            showTabName: "2",
            handleClick: () => this.handleDispatch(null),
          },
        ],
      },
      selectionRows: {
        1: [],
        2: [],
      },
      searchFromData: {},
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "122px" : "92px",
        formModel: {},
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
        tableHeight: "calc(100vh - 264px)",
        httpRequest: [getExpressDeliveryList, getExpressDeliveryList],
        statusBtnList: [
          {
            text: this.overseaLangObj.kd_xd || "快递下单",
            btnShowTabs: ["1"],
            handleClick: (row) => this.handleBatchDlg([row]),
          },
          {
            text: this.overseaLangObj.zg_kc || "转卡车",
            btnShowTabs: ["1"],
            handleClick: (row) => this.handleStatusChange([row?.id], 1),
          },
          {
            text: this.overseaLangObj.zh_zt || "转自提",
            btnShowTabs: ["1"],
            handleClick: (row) => this.handleStatusChange([row?.id], 3),
          },
          {
            text: this.overseaLangObj.hs_hw_jh || "核实货物计划",
            showStatus: [0], // 快递状态
            goodsStatus: [1], // 货物状态
            btnShowTabs: ["2"],
            handleClick: (row) => this.handleVerifyGoods(row),
          },
          // {
          //   text: "调整卡车",
          //   showStatus: [0],
          // 	goodsStatus: [1],
          //   btnShowTabs: ['2'],
          //   handleClick: (row) => {},
          // },
          {
            text: this.overseaLangObj.ps_wc || "派送完成",
            showStatus: [1],
            goodsStatus: [2, 3],
            btnShowTabs: ["2"],
            handleClick: (row) => this.handleDispatch([row]),
          },
          {
            text: this.overseaLangObj.cf_dj || "出库登记",
            showStatus: [0],
            goodsStatus: [2],
            btnShowTabs: ["2"],
            handleClick: (row) => this.handleRegistration(row),
          },
          {
            text: this.overseaLangObj.bj_edit("修改"),
            showStatus: [0],
            goodsStatus: [0, 1, 2],
            btnShowTabs: ["2"],
            handleClick: (r) => this.handleModifyDlg(r),
          },
          {
            text: this.overseaLangObj.yc_delete("删除"),
            color: "#FF6767",
            showStatus: [0],
            goodsStatus: [0, 1, 2],
            btnShowTabs: ["2"],
            handleClick: (r) => this.handleDelete(r),
          },
        ],
      },
    };
  },
  methods: {
    handleDispatch(rows) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: simpleTimeCols({
          title: "派送完成",
          label: "实际到达时间：",
          isRemark: true,
        }),
        httpRequest: (param) => {
          return putExpressDeliveryCompleted({
            idList: (
              rows || this.selectionRows[this.tabsConfig.activeName]
            ).map((e) => e.distributionInfoId),
            actualReachTime: param.time,
            remark: param.remark,
          });
        },
        successFunction: () => {
          this.onTableSelectionChange();
          this.mixinkeepTable();
        },
      });
    },
    handleVerifyGoods(row) {
      this.$refs.goodsVerifyRef.showVerify(row, {
        editSuccess: this.mixinkeepTable,
      });
    },
    handleBatchDlg(rows) {
      const addRows = rows || this.selectionRows[1];
      this.$refs.batchExpressRef.editShow(
        {
          addRows,
          id: addRows[0].id,
          webPageLocation: 1,
        },
        {
          editSuccess: this.mixinkeepTable,
        }
      );
    },
    selectionEveryRow() {
      const row = this.selectionRows[1][0];
      return this.selectionRows[1].every(
        (e) =>
          e.destinationType === row.destinationType &&
          ((e.destinationType == 1 && e.destinationId === row.destinationId) ||
            (e.destinationType == 2 &&
              e.receivingAddress === row.receivingAddress))
      );
    },
    // 表格多选
    onTableSelectionChange(rows = []) {
      const { activeName } = this.tabsConfig;
      const nRows = rows.filter((r) => {
        if (activeName === "2") {
          return [1].includes(r.infoState) && [2].includes(r.state);
        }
        return true;
      });

      this.selectionRows[activeName] = nRows;
      this.$refs[`tableRef${activeName}`][0]._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows[activeName],
      });
    },
    selectionRowEvt(r) {
      if (this.tabsConfig.activeName === "2") {
        return [1].includes(r.infoState) && [2].includes(r.state);
      }
      return true;
    },
    handleStatusChange(idList, distributionType) {
      const { activeName } = this.tabsConfig;
      const cOpt = {
        distributionType,
        idList: idList
          ? idList
          : (this.selectionRows[activeName] || []).map((e) => e.id),
      };
      this.comRepeatedRequest(this, changePlanDistributionType, cOpt).then(
        () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("操作成功"));
          this.onTableSelectionChange();
          this.mixinkeepTable();
        }
      );
    },
    handleModifyDlg(row = {}) {
      this.$refs.batchExpressRef.editShow(
        {
          ...row,
          id: row.distributionInfoId,
          webPageLocation: 2,
        },
        {
          editSuccess: this.mixinkeepTable,
        }
      );
    },
    async handleRegistration(row) {
      await getTruckCheckOrderState({
        type: 2,
        idList: [row.distributionInfoId],
      });
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: simpleTimeCols({
          title: "出库登记",
          label: "实际出库时间：",
          isRemark: true,
        }),
        httpRequest: (param) => {
          return putDeliveryRegistration({
            id: row.distributionInfoId,
            actualTime: param.time,
            remark: param.remark,
          });
        },
        successFunction: this.mixinkeepTable,
      });
    },
    handleDelete(row = {}) {
      customMessageBox(
        this,
        {
          msgTitle: this.overseaLangObj.ts_tip("删除提示"),
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delExpressInfo(row.distributionInfoId),
        },
        () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("删除成功"));
          this.mixinkeepTable();
        }
      );
    },
    handleDetails(row) {
      this.$refs.batchExpressRef.editShow(
        {
          id: row.distributionInfoId,
          webPageLocation: 2,
          isWebSee: true, // 查看
        },
        {
          editSuccess: this.mixinkeepTable,
        }
      );
      // const { type } = row;
      // const pathObj = {
      //   1: `/warehouseManage/outStorage/wholeSaleDetails`, // 一件代发详情
      //   0: `/warehouseManage/outStorage/fbaWarehouseDetails`, // FBA订单详情
      //   2: `/warehouseManage/inStorage/buttOrderDetails`, // 中转出库/大货中转 -> 电商头程详情
      // };
      // const idList = this.$refs[
      //   `tableRef${+this.tabsConfig.activeName}`
      // ][0].tableData.map((e) => {
      //   if (type == e.type) {
      //     return e.id;
      //   }
      // }) .filter((result) => typeof result !== "undefined");;
      // this.$router.push({
      //   path: pathObj[type],
      //   query: {
      //     id: row.id,
      //     pageSign: idList.join(","), // idList.join(','), // 详情显示上一页/下一页
      //     backPath: this.$route.path,
      //   },
      // });
    },
    getTableList(searchFrom = {}) {
      const { createTime, destinationId, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      const [createTimeGe, createTimeLe] = createTime || [];
      this.searchFromData[activeName] = {
        ...searchObj,
        destinationId,
        destinationType: destinationId ? 1 : undefined,
        createTimeGe,
        createTimeLe,
      };
      this.mixinkeepTable(true);
    },
    tableQueryParams(tName) {
      return {
        ...this.searchFromData[tName],
        distributionType: 2, // 字典：distributionType 1=卡车；2=快递；3=自提
        tab: tName - 1,
      };
    },
    tableBtnList(row, tName) {
      const tabBtnList = this.tableConfig.statusBtnList.filter((btn) => {
        return btn.btnShowTabs.includes(tName);
      });
      if (tName === "2") {
        return tabBtnList.filter((e) => {
          return (
            (e.showStatus || []).includes(row.infoState) &&
            (e.goodsStatus || []).includes(row.state)
          );
        });
      }
      return tabBtnList;
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        fold: true,
        lists: searchColumns(index),
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
      "distributionPlanKdState",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  watch: {
    selectionRows: {
      deep: true,
      handler: function (newVal) {
        const { activeName } = this.tabsConfig;
        this.tabsConfig.btnArr.map((e) => {
          this.$set(
            e,
            "disabled",
            !newVal[activeName].length && activeName === e.showTabName
          );
        });
      },
    },
  },
  components: {
    ExpressBatchDialog: () => import("./exBatchDlg"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    GoodsVerifyDialog: () => import("../truck/components/goodsVerifyDlg"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
