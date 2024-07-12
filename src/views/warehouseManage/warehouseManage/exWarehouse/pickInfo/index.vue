<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <template slot="label">
            <TabSearchColumn
              :searchFormData="mixinSearchFormData"
              :tabName="tab.name"
            />
          </template>
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="getSearchFormConfig(tab.name)"
              @searchHeight="searchHeight"
              v-if="showSearchForm && mixinSearchConfParams.countType"
            >
              <template v-slot:logisticsProductId="slotProps">
                <AutoComplete
                  :formModel="slotProps.formModel"
                  :fieldItem="slotProps.fieldItem"
                  :additionalParam="{
                    idIn: searchExtra.logisticsIdIn,
                  }"
                />
              </template>
              <template v-slot:customerId="slotProps">
                <AutoComplete
                  :formModel="slotProps.formModel"
                  :fieldItem="slotProps.fieldItem"
                  :additionalParam="{
                    idIn: searchExtra.customerIdIn,
                  }"
                />
              </template>
              <template v-slot:productId="slotProps">
                <AutoComplete
                  :formModel="slotProps.formModel"
                  :fieldItem="slotProps.fieldItem"
                  :additionalParam="{
                    idIn: searchExtra.skuIdIn,
                  }"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="
                tableConfig.columnConfig({
                  active: mixinSearchConfParams.countType,
                })
              "
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :isMountedRequest="false"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
              selectionKey="orderId"
              v-if="showSearchForm"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="handleWarehouseTableMixin" />
      </template>
      <!-- <template v-slot:btnOptions="{ slotProps }">
        <template v-for="(bItem, bIndex) in tabBtnArr">
          <el-button v-if="bItem.showCountType.includes(mixinSearchConfParams.countType)" :key="bIndex" @click="bItem.handleClick">
            {{ bItem.table }}
          </el-button>
        </template>
      </template>-->
    </ComTabs>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { searchForm, tableColumns } from "./model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import {
  GETSystemPickingOrderAllList,
  GETPickingOrderAllProductIds,
  GETPickingOrderAllCustomerIds,
  GETPickingOrderAllLogisticsProductIds,
  PUTPartPickingOrder,
} from "@/api/common.js";
import { msgBox } from "@/utils/confirmBox.js";
export default {
  name: "PickInfo",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        className: "slot-label-state",
        isTabStateCount: true,
        handleTabsClick: () => {},
        searchColumnParams: {},
        tabs: [
          {
            label: "拣货单信息",
            name: "1",
          },
        ],
        btnArr: [],
      },
      btnArr: [
        {
          table: "去拣货",
          disabled: true,
          showCountType: [520, "520"],
          handleClick: () => {
            this.handlePickGoods();
          },
        },
        {
          table: "拣货完成",
          disabled: true,
          showCountType: [521, "521"],
          handleClick: () => {
            this.handlePickInfo();
          },
        },
      ],
      // tabBtnArr: [
      //   {
      //     table: "去拣货",
      //     showCountType: ["520",520],
      //     handleClick: (rows) => {
      //       this.handlePickGoods()
      //     },
      //   },
      // ],
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        searchColsHeight: true,
        residueCols: [2],
        labelWidth: "105px",
        // lists: searchForm,
      },
      tableConfig: {
        columnConfig: tableColumns,
        httpRequest: GETSystemPickingOrderAllList,
        // httpRequest: (formModel) => {
        //   return new Promise((resolve) => {
        //     resolve({ rows: [{ id: 1 }] });
        //   });
        // },
      },
      showSearchForm: false,
      searchFromData: {},
      selectionRows: [],
      searchExtra: {},
    };
  },
  mounted() {},
  created() {
    this["dictionary/getDictionary"]([
      "pickingType",
      "labelingBusinessType",
      "outStorageStatus",
      "pickingStatus",
      "outWarehouseNumberType",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  // watch: {
  //   selectionRows: {
  //     immediate:true,
  //     handler: function (newVal) {
  //       // const { countType } = this.mixinSearchConfParams;
  //       if(this.tabsConfig?.btnArr.length){
  //         this.tabsConfig.btnArr[0].disabled=newVal.length>0?false:true
  //       }
  //     },
  //   },
  // },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      const { value = undefined } = this.curWarehouseObj;
      return {
        ...this.searchFromData[activeName],
        warehouseId: value,
        ...this.mixinSearchConfParams,
      };
    },
    getSearchList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        startCreateTime: createTime && createTime[0],
        endCreateTime: createTime && createTime[1],
      };
      this.mixinkeepTable(true);
    },
    handleWarehouseTableMixin(row = {}, type) {
      const { warehouseMainId } = row;
      this.curWarehouseObj = {
        ...row,
      };
      this.tabsConfig.searchColumnParams = {
        warehouseId: warehouseMainId,
      };
      if (type == "WEB_HANDLESET") {
        this.mixinkeepTable(true, {
          isTableSearch: true,
        });
        this.switchCallBack();
      }
    },
    getSearchFormConfig(row) {
      return {
        ...this.searchFormConfig,
        ...searchForm(this.mixinSearchConfParams),
      };
    },
    switchCallBack() {
      this.searchExtra = {};
      const { countType } = this.mixinSearchConfParams;
      const { value = undefined } = this.curWarehouseObj;
      const arr = this.btnArr.filter((e) => {
        return e.showCountType ? e.showCountType.includes(countType) : true;
      });
      this.$set(this.tabsConfig, "btnArr", arr);
      const params = {
        countType,
        warehouseId: value,
      };
      Promise.all([
        GETPickingOrderAllProductIds(params), //sku
        GETPickingOrderAllCustomerIds(params), //客户ID
        GETPickingOrderAllLogisticsProductIds(params), //物流产品
      ]).then(([skuData, customerData, logisticsData]) => {
        this.onTableSelectionChange([]);
        const { data: skuIdIn } = skuData || {};
        const { data: customerIdIn } = customerData || {};
        const { data: logisticsIdIn } = logisticsData || {};
        this.searchExtra = {
          skuIdIn,
          customerIdIn,
          logisticsIdIn,
        };
      });
    },
    handlePickGoods() {
      if (this.selectionRows.length > 0) {
        const { orderType, outType, pickingStatus } = this.selectionRows[0] || {};
        const onOrderIds = this.selectionRows.map((e) => e.orderId);
        const { warehouseCode, warehouseMainId, warehouseName } =
          this.curWarehouseObj;
        this.$router.push({
          path: `/warehouseManage/exWarehouse/pickingEdit`,
          query: {
            onOrderIds: onOrderIds.join(","),
            orderType,
            pickingStatus,
						pickingType: outType,
            warehouseCode,
            warehouseName,
            warehouseId: warehouseMainId,
						backPath: this.$route.path,
          },
        });
      } else {
        return;
      }
    },
    handlePickInfo() {
      const title = "确认提示";
      const className = "el-icon-success text-success";
      const msg = "拣货完成后不可撤销,请确认是否进行当前操作！";
      msgBox(this, { title, className, msg, showCancelButton: true }, () => {
        const params = this.selectionRows.map((e) => {
          return {
            orderId: e.orderId,
            orderType: e.orderType,
          };
        });
        PUTPartPickingOrder(params).then((res) => {
          this.mixinkeepTable(true);
        });
      });
    },
    selectionRowEvt(row) {
      const { countType } = this.mixinSearchConfParams;
      if (countType == 520) {
        if (this.selectionRows.length > 0) {
          const { orderType, outType } = this.selectionRows[0] || {};
          return (
            orderType == row.orderType &&
            outType == row.outType &&
            !row.pickingNumber
          );
        } else {
          return !row.pickingNumber;
        }
      } else if (countType == 521) {
        return true;
      }
    },
    onTableSelectionChange(rows = []) {
      const { countType } = this.mixinSearchConfParams;
      if (countType == 520) {
        const fRow = rows[0] || {};
        this.selectionRows = rows.filter((e) => {
          return (
            fRow.orderType === e.orderType &&
            fRow.outType == e.outType &&
            !e.pickingNumber
          );
        });
      } else if (countType == 521) {
        this.selectionRows = rows;
      }
      if (this.tabsConfig.btnArr?.length > 0) {
        this.tabsConfig.btnArr[0].disabled =
          this.selectionRows.length > 0 ? false : true;
      }
      this.$refs[`tableRef${this.tabsConfig.activeName}`] &&
        this.$refs[
          `tableRef${this.tabsConfig.activeName}`
        ][0]?._toggleRowSelectionMixin({
          newCheckRows: this.selectionRows,
        });
    },
  },
  watch: {
    "mixinSearchConfParams.countType"() {
      this.switchCallBack();
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    TabSearchColumn: () => import("_comp/ComColumnConf/SearchColumn"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .el-tabs__nav {
    width: calc(100% - 600px) !important;
  }
}
</style>
