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
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :isMountedRequest="false"
              :rowOperationBtnListFn="(r) => tableStatusList(r)"
              @handleTableView="(r) => handleView(r)"
            >
              <template v-slot:isSelectBtns="{ slotProps }">
                <el-dropdown trigger="click">
                  <el-button size="small" type="text"
                    >{{ slotProps.item.text }}<i class="el-icon-arrow-down"
                  /></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="cItem in platformOrderExportCurrencyLists"
                      :key="cItem.value"
                      @click.native="
                        slotProps.item.handleClick(cItem, slotProps.row)
                      "
                    >
                      {{ cItem.nameCn }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="handleSelectCurWarehouse" />
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>

<script>
import {
  getWholeSaleList,
  editTrackNo,
  putWholeSaleApiInfo,
  POSTOrderPlatformExportFees,
} from "@/api/warehouse/prediction";
import { comSaveRepeatedRequest } from "@/api/common";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "Wholesale",
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
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
            label: this.overseaLangObj.yj_df || "一件代发",
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
            this.getWholeSaleList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getWholeSaleList,
        columnConfig: tableColumns,
        statusList: [
          {
            text: "修改跟踪号",
            handleClick: (r) => this.handleUpdate(r),
          },
        ],
      },
      tableBtnList: [
        {
          text: "导出账单",
          btnType: [1, 2, 3, 4, 5, 6, 7],
          isSelectBtns: true,
          handleClick: ({ nameCn }, { id }) => {
            comFileDownload(this, POSTOrderPlatformExportFees, {
              id,
              queryType: 2,
              currencyCode: nameCn,
            });
          },
        },
      ],
    };
  },
  created() {
    this["dictionary/getDictionary"]("custTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleSelectCurWarehouse(obj) {
      // 海外仓出库
      const dropdownArr = this.platformOrderExportCurrencyLists.map((e) => ({
        name: e?.nameCn,
        value: e?.value,
      }));
      const headBtnArr = [
        {
          table: "导出费用",
          btnType: "dropdown",
          dropdownArr,
          handleClick: (_, { name }) => {
            const { pageNum, pageSize, ...obj } = this.getQueryParams();
            comFileDownload(this, POSTOrderPlatformExportFees, {
              ...obj,
              trackingSnList: obj.trackingSnList?.split(" "),
              businessType: 35,
              queryType: 2,
              currencyCode: name,
            });
          },
        },
      ];
      if (!obj.apiId) {
        this.tabsConfig.btnArr = headBtnArr;
      } else {
        this.tabsConfig.btnArr = [
          ...headBtnArr,
          {
            table: this.overseaLangObj.tb_order_info("同步订单信息"),
            tabBtnLoading: true,
            handleClick: () => this.handleSynchronize(),
          },
        ];
      }
      this.getWarehouseTableMixin(obj);
    },
    getWholeSaleList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        // deliveryWarehouseid: searchFrom.deliveryWarehouseid || 0,
        deliveryChannelid: searchFrom.deliveryChannelid || undefined,
        contacts: searchFrom.contacts || undefined,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { state, ...searchObj } = this.searchFromData || {};
      return {
        ...searchObj,
        state: state?.length ? state.join(",") : "1,2,3,4,5,6,7,11",
        warehouseId: this.curWarehouseObj.value,
      };
    },
    handleView(row) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.id);
      this.$router.push({
        path: `/warehouseManage/outStorage/wholeSaleDetails`,
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleUpdate(row) {
      const { id, traceNumber } = row;
      this.$refs.confirmDialog.handleFormDialog("changeTrackNo", {
        formModel: {
          traceNumber,
        },
        httpRequest: (formData) => {
          const { traceNumber } = formData;
          const params = {
            id,
            traceNumber,
          };
          return editTrackNo(params);
        },
        successFunction: () => {
          this.msgSuccess("修改成功");
          this.mixinkeepTable();
        },
      });
    },
    handleSynchronize() {
      comSaveRepeatedRequest(putWholeSaleApiInfo, {
        wmsId: this.curWarehouseObj.value,
      }).then(() => {
        this.mixinkeepTable();
      });
    },
    tableStatusList(row) {
      const btnExport = this.tableBtnList.filter((e) =>
        e.btnType.includes(row.status)
      );
      if (!!this.curWarehouseObj.apiId) {
        return btnExport;
      }
      if ([1].includes(row.status)) {
        return [...btnExport, ...this.tableConfig.statusList];
      }
      return btnExport;
    },
  },
  computed: {
    ...mapState({
      platformOrderExportCurrencyLists: (state) =>
        state.dictionary.dicsData.platformOrderExportCurrency,
    }),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
