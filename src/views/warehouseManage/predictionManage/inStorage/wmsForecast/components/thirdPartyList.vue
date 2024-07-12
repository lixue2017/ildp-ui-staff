<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="
                    (cols) =>
                      setColumnMixinConf(cols, { mountedNoRequest: true })
                  "
                /> </template
            ></ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="httpTableRequest()"
              :getQueryParams="() => tableQueryParams()"
              :extraConfig="{ multiline: true }"
              :isMountedRequest="
                ['orderReceiving', 'operationReceiving'].includes(pageType)
              "
              :selectionRow="selectionRowEvt"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="(r) => tableStatusList(r)"
              @handleTableView="(r) => handleView(r)"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template
        v-slot:slotTabsRight
        v-if="![1, 2].includes(this.isPerformance)"
      >
        <CurrentWhereWarehouse
          v-if="mixinInitTableCols"
          @setCurWarehouse="handleSelectCurWarehouse"
        />
      </template>
    </ComTabs>
    <OrderReceiving
      ref="dialog"
      @handleSuccess="handleSuccess"
      v-if="![1].includes(this.isPerformance)"
    />

    <ComCustomDialog ref="mCustomDialogRef" />
  </div>
</template>

<script>
import {
  getThirdPartyOrderList,
  getPerformancePageList,
  getThirdPartyWmsList,
  postOrderThirdPartyRepulse,
  postThirdQuickReceipt,
  putThirdApiInfo,
} from "@/api/warehouse/prediction";
import { comSaveRepeatedRequest } from "@/api/common";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns } from "../model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  remarkDialogCols,
  simpleTimeCols,
} from "_comp/ConfirmDialog/customFormDialog/model.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { hostCurrentEnv, formatDate } from "@/utils/index.js";
import { PutThirdPartyOrderWmsRepulse } from "@/api/warehouse/prediction.js";
export default {
  props: {
    pageType: {
      type: String,
      default: () => "",
    },
    isPerformance: {
      type: Number,
      default: 0, // 海外仓第三方入库显示操作列
    },
    isWms: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    OrderReceiving: () => import("../OrderReceiving"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.dsf_rkd || "第三方入库单",
            name: "1",
          },
        ],
        btnArr: [],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getWmsForecast(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        residueCols: [2],
        fold: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "123px" : "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns(this.pageType),
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        statusList: [
          {
            text: "接单",
            viewType: ["orderReceiving"],
            btnType: [1],
            handleClick: (row) => {
              this.$refs.dialog?.show(row);
            },
          },
          {
            text: "预排库",
            isWarehouseBtn: true,
            btnType: [2],
            handleClick: ({ id }) => {
              this.$router.push({
                path: "/warehouseManage/expectedReceipt",
                query: {
                  id,
                  ywType: 1, // 1-第三方
                  backPath: this.$route.fullPath,
                },
              });
            },
          },
          {
            text: this.overseaLangObj.sh_receipt("收货"),
            handleClick: (row) => this.handleUpdate(row),
            btnType: [2],
          },
          {
            text: "打回",
            color: "#FF6767",
            viewType: ["orderReceiving", "warehouseReceiving"],
            btnType: {
              orderReceiving: [1],
              warehouseReceiving: [2],
            }[this.pageType],
            handleClick: (row) => {
              if (this.pageType == "orderReceiving") {
                //订单
                this.handleRepulse(row);
              } else if (this.pageType == "warehouseReceiving") {
                //海外仓
                this.handleWarehouseRepulse(row);
              }
            },
          },
          // {
          //   text: "收货详情",
          //   handleClick: (row) => this.handleUpdate(row, 1),
          //   btnType: [3, 4, 5, 6],
          // },
        ],
      },
      selectionRows: [],
      mixinTableColArr: [tableColumns(this.pageType)],
    };
  },
  mounted() {
    this["dictionary/getDictionary"]("predictionManage").then(() => {
      this.showSearchForm = true;
      if ([1, 2].includes(this.isPerformance)) {
        setTimeout(() => {
          // 详情刷新后返回时，先加载表格
          this.initMixinColumnConf();
        });
      }
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleSelectCurWarehouse(obj) {
      if (this.pageType === "warehouseReceiving") {
        // 海外仓入库
        if (!obj.apiId) {
          this.tabsConfig.btnArr = [
            {
              table: this.overseaLangObj.ks_sh("快速收货"),
              disabled: true,
              handleClick: () => this.handleBatchReceiving(),
            },
          ];
        } else {
          this.tabsConfig.btnArr = [
            {
              table: this.overseaLangObj.tb_order_info("同步订单信息"),
              tabBtnLoading: true,
              handleClick: () => this.handleSynchronize(),
            },
          ];
        }
      }
      this.getWarehouseTableMixin(obj);
    },
    httpTableRequest() {
      switch (this.isPerformance) {
        case 1:
          return getPerformancePageList;
        case 2:
          return getThirdPartyOrderList;
        default:
          const httpRequest = [getThirdPartyOrderList, getThirdPartyWmsList];
          return httpRequest[this.pageType === "orderReceiving" ? 0 : 1];
      }
    },
    handleRepulse({ id }) {
      this.$refs.mCustomDialogRef?.showCustomDialog({
        customFormConfig: remarkDialogCols(),
        formModel: {
          id,
        },
        httpRequest: postOrderThirdPartyRepulse,
        errorFunction: (err) => {
          if (err.code === 1002) {
            customMessageBox(
              this,
              {
                msgTitle: err.msg,
                msgTxt1: "如需打回",
                msgTxt2: "，请先删除费用信息！",
                msgTxtColor: "#FF6767",
                showCancelButton: false,
                confirmButtonText: "关闭",
              },
              () => {
                this.$refs.mCustomDialogRef.customDialogHide();
              }
            );
          }
        },
        successFunction: () => this.mixinkeepTable(),
      });
    },
    handleWarehouseRepulse(row) {
      const { id } = row;
      customMessageBox(
        this,
        {
          msgTitle: "打回提示",
          msgTxt1: "打回不可逆",
          httpMsgRequest: () => PutThirdPartyOrderWmsRepulse(id),
        },
        () => {
          this.msgSuccess("操作成功");
          this.mixinkeepTable();
        }
      );
    },
    getWmsForecast(searchFrom = {}) {
      const { beginTime, statusSearch, warehousingSource, ...searchObj } =
        searchFrom;
      this.searchFromData = {
        ...searchObj,
        createTimeBegin: beginTime && beginTime[0],
        createTimeEnd: beginTime && beginTime[1],
        orderState: statusSearch?.length ? statusSearch.join(",") : undefined,
        warehousingSource: warehousingSource?.length
          ? warehousingSource.join(",")
          : undefined,
      };
      this.initMixinColumnConf();
      // this.$refs[`tableRef${+this.tabsConfig.activeName}`][0].refreshTable();
    },
    tableQueryParams() {
      let { orderState, statusSearch, ...nSearchFrom } = this.searchFromData;
      let defaultState = "2,3,4,5";
      if (this.pageType === "orderReceiving") {
        defaultState = "0,1,2,3,4,5";
      }
      if (this.pageType === "warehouseReceiving") {
        defaultState = "2,3,4,5,11";
      }
      if (statusSearch && Array.isArray(statusSearch)) {
        orderState = statusSearch.join(",");
      }
      return {
        ...nSearchFrom,
        // orderType: 1,
        orderStateIn: orderState || defaultState,
        warehouseId: [1, 2].includes(this.isPerformance)
          ? undefined
          : this.curWarehouseObj.value,
      };
    },
    handleView(row) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.id);
      const query = {
        id: row.id,
        // pageType: this.pageType,
        pageSign: idList.join(","), // 详情显示上一页/下一页
        backPath: this.$route.path,
        // orderSource: this.isPerformance, //0仓库  1操作单 2订单
      };
      if (this.isWms) query.isWms = 1;
      [1].includes(this.isPerformance) && (query.isPerformance = true);
      const pathObj = {
        operationReceiving: "operationThirdParty", // 操作单
        warehouseReceiving: "warehouseThirdParty", // 仓库
        orderReceiving: "orderThirdParty", // 订单
      };
      this.$router.push({
        path: `/warehouseManage/inStorage/${pathObj[this.pageType]}`,
        query,
      });
    },
    handleUpdate(row) {
      this.$router.push({
        path: "/warehouseManage/inStorage/receiptPage",
        query: {
          id: row.id,
          modelType: "wms",
          backPath: this.$route.fullPath,
          // isSee,
        },
      });
    },
    handleSuccess() {
      this.initMixinColumnConf();
    },
    tableStatusList(row) {
      if (this.isWarehouseApiId || row.orderState < 1) {
        return [];
      }
      if (this.pageType === "orderReceiving") {
        return this.tableConfig.statusList.filter(
          (e) =>
            (e.viewType || []).includes(this.pageType) &&
            e.btnType.includes(row.orderState)
        ); // 订单操作
      }
      return this.tableConfig.statusList.filter(
        (e) =>
          e.btnType.includes(row.orderState) &&
          (e.isWarehouseBtn ? this.isWarehouseRole : true)
      );
    },

    /** 海外仓库管理入库 */
    handleBatchReceiving() {
      if (this.selectionRows.length) {
        const idList = this.selectionRows.map((e) => e.id);
        this.$refs.mCustomDialogRef?.showCustomDialog({
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
            return postThirdQuickReceipt({
              idList,
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
        //     httpMsgRequest: () => postThirdQuickReceipt({ idList }),
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
        [2].includes(e.orderState)
      );
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt(row) {
      if (![2].includes(row.orderState) || this.isWarehouseApiId) {
        return false;
      }
      return true;
    },
    handleSynchronize() {
      comSaveRepeatedRequest(putThirdApiInfo, {
        wmsId: this.curWarehouseObj.value,
      }).then(() => {
        this.mixinkeepTable();
      });
    },
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
    },
  },
  computed: {
    isWarehouseApiId() {
      // 海外仓入库
      return (
        this.pageType === "warehouseReceiving" && !!this.curWarehouseObj.apiId
      );
    },
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
