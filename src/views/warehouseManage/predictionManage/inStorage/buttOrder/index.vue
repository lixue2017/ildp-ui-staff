<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchFormConfig"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="
                    (cols) =>
                      setColumnMixinConf(cols, { mountedNoRequest: true })
                  "
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :rowOperationBtnListFn="tableStatusList"
              :colShowBtnFn="operationBtn"
              :isMountedRequest="false"
              :selectionRow="selectionRowEvt"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              @handleTableView="handleView"
              v-if="tabsConfig.activeName === tab.name"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse
          v-if="mixinInitTableCols"
          @setCurWarehouse="getWarehouseTableMixin"
        />
      </template>
    </ComTabs>
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import {
  getForecastList,
  postEcQuickReceipt,
} from "@/api/warehouse/prediction";
import { mapActions, mapState } from "vuex";
import { forecastSearchCols, forecastTableCols } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { hostCurrentEnv, formatDate } from "@/utils/index.js";
import { simpleTimeCols } from "_comp/ConfirmDialog/customFormDialog/model.js";

export default {
  name: "ButtOrder",
  // mixins: [wareHouseMixin],
  mixins: [curWarehouseMixin, mixinColsConf], //curWarehouseMixin为当前所在仓选择文件    mixinColsConf为列设置文件与初始化
  components: {
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.ds_tc_hwc || "电商头程(海外仓)",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.ks_sh("快速收货"),
            disabled: true,
            handleClick: () => this.handleBatchReceiving(),
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        fold: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "132px" : "100px",
        lists: forecastSearchCols.lists,
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getForecastList,
      },
      tableBtnList: [
        {
          text: "预排库",
          isWarehouseBtn: true,
          btnType: ["0", 0],
          handleClick: ({ orderOperationId }) => {
            this.$router.push({
              path: "/warehouseManage/expectedReceipt",
              query: {
                id: orderOperationId,
                ywType: 2, // 2-电商
                backPath: this.$route.fullPath,
              },
            });
          },
        },
        {
          text: this.overseaLangObj.sh_receipt("收货"),
          handleClick: (row) => this.handleUpdate(row),
          btnType: ["0", 0],
        },
        // {
        //   text: "收货详情",
        //   handleClick: (row) => this.handleUpdate(row, 1),
        //   btnType: [1, 2, 3, 4],
        // },
      ],
      selectionRows: [],
      mixinTableColArr: [forecastTableCols],
    };
  },
  created() {
    this["dictionary/getDictionary"]("predictionManage").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(searchFrom = {}) {
      const { createTime, actualTime, statusList, ...nSearchFrom } = searchFrom;
      this.searchFromData = {
        ...nSearchFrom,
        beginTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
        actualBeginTime: actualTime && actualTime[0],
        actualEndTime: actualTime && actualTime[1],
        statusList: statusList && statusList.join(","),
      };
      this.mixinkeepTable(true);
    },
    tableStatusList(row) {
      return this.tableBtnList.filter((e) => {
        return (
          (e.btnType ? e.btnType.includes(row.warehouseStatus) : true) &&
          (e.isWarehouseBtn ? this.isWarehouseRole : true)
        );
      });
    },
    getQueryParams(tab) {
      return {
        ...this.searchFromData,
        warehouseId: this.curWarehouseObj.value,
      };
    },
    handleView(row = {}, col = {}) {
      const { cPageNoKey } = col;
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData
        .filter(
          (e) => row.isMainBill === e.isMainBill || e.isMainBill !== 7 // 7-子单
        )
        .map((item) => item[col.cOrderIdKey]);
      this.$router.push({
        path: cPageNoKey,
        query: {
          id: row[col.cOrderIdKey],
          pageSign: idList.join(","), // 详情显示上一页/下一页
          backPath: this.$route.path,
        },
      });
    },
    handleUpdate(row) {
      localStorage.setItem("eCommerceCols", JSON.stringify(row));
      this.$router.push({
        path: "/warehouseManage/inStorage/takeDelivery",
        query: {
          type: "eCommerce",
          backPath: this.$route.fullPath,
        },
      });
    },
    handleBatchReceiving() {
      if (this.selectionRows.length) {
        let idList = [];
        let operationOrderIdList = [];
        this.selectionRows.forEach((e) => {
          e.orderEcId && idList.push(e.orderEcId);
          e.orderOperationId && operationOrderIdList.push(e.orderOperationId);
        });

        this.$refs.customDialogRef.showCustomDialog({
          formModel: {
            time: formatDate(new Date(), "-", "date"),
          },
          customFormConfig: simpleTimeCols({
            title: "批量收货",
            label: "收货时间：",
            valueFormat: "yyyy-MM-dd",
            dateType: "date",
            timeRules: "notRequired",
            itemCols: [
              {
                span: 24,
                id: "tipTxt",
                type: "txt",
                labelWidth: "30px",
                textLineClamp: 3,
                render: () =>
                  "* 批量收货不可逆，一个订单的货物会收货到独立新的一个托盘上，请确认是否要批量收货？",
              },
            ],
          }),
          httpRequest: (param) => {
            return postEcQuickReceipt({
              idList,
              operationOrderIdList,
              deliveryTime: param.time,
            });
          },
          successFunction: () => {
            this.msgSuccess(this.overseaLangObj.cg_tip("操作成功"));
            this.mixinkeepTable();
          },
        });

        // customMessageBox(
        //   this,
        //   {
        //     msgTitle: "批量收货不可逆",
        //     msgTxt1: "一个订单的货物会收货到独立新的一个托盘上",
        //     msgTxt2: "，请确认是否要批量收货？",
        //     httpMsgRequest: () =>
        //       postEcQuickReceipt({ idList, operationOrderIdList }),
        //   },
        //   () => {
        //     this.msgSuccess(this.overseaLangObj.cg_tip("操作成功"));
        //     this.mixinkeepTable();
        //   }
        // );
      }
    },
    onTableSelectionChange(rows) {
      this.selectionRows = (rows || []).filter((e) =>
        [0].includes(e.warehouseStatus)
      );
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt(row) {
      if (![0].includes(row.warehouseStatus)) {
        return false;
      }
      return true;
    },
    operationBtn(bItem, row) {
      // 0-待拆柜 1-已拆柜
      // 0-待入库,1-待上架，2-已上架，3-部分上架，4-已完结
      return bItem.btnType.includes(row.warehouseStatus);
    },
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
    },
  },
  computed: {
    isWarehouseRole() {
      const envStr = hostCurrentEnv();
      const roleObj =
        this.warehouseIdOneByOne.find(
          (e) => e.nameCn.includes(envStr) && e.nameEn === "YPKW"
        ) || {};
      return roleObj.value?.includes(this.curWarehouseObj.value);
    },
    ...mapState({
      warehouseIdOneByOne: (state) =>
        state.dictionary.dicsData.roleIdOneByOne || [],
    }),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
