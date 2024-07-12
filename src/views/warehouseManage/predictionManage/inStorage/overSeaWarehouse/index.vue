<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs || []">
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
              :isMountedRequest="false"
              :selectionRow="selectionRowEvt"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="tableStatusList"
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
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { searchForm, tableColumns } from "./model.js";
import {
  getWahouseClearancePrediction,
  postOverseasQuickReceipt,
} from "@/api/warehouse/prediction";
import { customMessageBox } from "@/utils/confirmBox.js";
import { hostCurrentEnv, formatDate } from "@/utils/index.js";
import { simpleTimeCols } from "_comp/ConfirmDialog/customFormDialog/model.js";

export default {
  name: "OverSeaWarehouse",
  mixins: [curWarehouseMixin, mixinColsConf],
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    return {
      showSearchForm: false,
      searchFromData: {},
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.hw_rc_yb,
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
          this.overseaLangObj.yu_yan_lang === "en-us" ? "136px" : "100px",
        lists: searchForm,
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getWahouseClearancePrediction,
      },
      tableBtnList: [
        {
          text: "预排库",
          isWarehouseBtn: true,
          btnType: [4],
          handleClick: ({ id }) => {
            this.$router.push({
              path: "/warehouseManage/expectedReceipt",
              query: {
                id,
                ywType: 4, // 4-海外
                backPath: this.$route.fullPath,
              },
            });
          },
        },
        {
          text: this.overseaLangObj.sh_receipt("收货"),
          handleClick: (row) => this.handleUpdate(row),
          btnType: [4],
        },
        // {
        //   text: "收货详情",
        //   handleClick: (row) => this.handleUpdate(row, 1),
        // },
      ],
      selectionRows: [],
      mixinTableColArr: [tableColumns],
    };
  },
  created() {
    this["dictionary/getDictionary"]("predictionManage").then(() => {
      this.showSearchForm = true;
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(searchFrom = {}) {
      const { createTime, actualityDevannTime, ...nSearchFrom } = searchFrom;
      this.searchFromData = {
        createStartTime: createTime && createTime[0],
        createEndTime: createTime && createTime[1],
        startActualityDevannTime: actualityDevannTime && actualityDevannTime[0],
        endActualityDevannTime: actualityDevannTime && actualityDevannTime[1],
        ...nSearchFrom,
      };
      this.mixinkeepTable(true);
    },
    handleView(row, item) {
      const { cPageNoKey, cOrderIdKey } = item;
      console.log("row[cOrderIdKey]", row[cOrderIdKey]);
      if (!row[cOrderIdKey]) {
        return;
      }
      sessionStorage.removeItem("tabActive");
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item[cOrderIdKey]);
      this.$router.push({
        path: cPageNoKey,
        query: {
          id: row[cOrderIdKey],
          pageType: 3, //与海外入仓订单一致，默认为3
          pageSign: idList.join(","),
          backPath: this.$route.fullPath,
        },
      });
    },
    getQueryParams(tab) {
      return {
        ...this.searchFromData,
        warehouseId: this.curWarehouseObj.value,
      };
    },
    handleUpdate(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData
        .map((item) => {
          const { warehouseStatus, id } = item;
          return warehouseStatus == 4 ? id : undefined;
        })
        .filter((e) => e !== undefined);
      this.$router.push({
        path: "/warehouseManage/inStorage/overSeaReceiptPage",
        query: {
          id: row.id,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    tableStatusList(row) {
      return this.tableBtnList.filter((e) => {
        return (
          (e.btnType ? e.btnType.includes(row.warehouseStatus) : true) &&
          (e.isWarehouseBtn ? this.isWarehouseRole : true)
        );
      });
    },

    handleBatchReceiving() {
      if (this.selectionRows.length) {
        const idList = this.selectionRows.map((e) => e.id);
        this.$refs.customDialogRef?.showCustomDialog({
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
            return postOverseasQuickReceipt({
              idList,
              wmsId: this.curWarehouseObj.value,
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
        //       postOverseasQuickReceipt({
        //         idList,
        //         wmsId: this.curWarehouseObj.value,
        //       }),
        //   },
        //   () => {
        //     this.msgSuccess("操作成功");
        //     this.mixinkeepTable();
        //   }
        // );
      }
    },
    onTableSelectionChange(rows) {
      this.selectionRows = (rows || []).filter((e) =>
        [4].includes(e.warehouseStatus)
      );
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt(row) {
      if (![4].includes(row.warehouseStatus)) {
        return false;
      }
      return true;
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
