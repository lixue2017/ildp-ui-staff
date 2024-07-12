<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="{ ...searchFormConfig, ...searchColumns[tab.name] }"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig[tab.name]"
              :httpRequest="tableConfig.httpRequest[tab.name]"
              :getQueryParams="() => tableConfig.getQueryParams(tab.name)"
              @getResult="getResult"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'operationOrderNum'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.operationOrderNum }}
                  </span>
                </template>
                <!-- 0-待入仓，1已入仓-->
                <template v-if="slotProps.prop === 'operation'">
                  <div
                    class="operate-btn-list"
                    v-if="/0|1/.test(slotProps.row.warehousingStatus)"
                  >
                    <div
                      class="btn"
                      v-for="(item, index) in tableConfig.statusList"
                      :key="index"
                    >
                      <el-button
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="mini"
                        type="text"
                        @click="item.handleClick(slotProps.row)"
                      >
                        {{ item.text }}
                      </el-button>
                    </div>
                  </div>
                  <div v-else>--</div>
                </template>
              </template>
              <template v-slot:bottomTotal>
                <div class="grand-total view-table-total">
                  <span>合计： </span>
                  <template v-for="gross in grossTotal[tab.name]">
                    <span :key="gross.prop">
                      <span class="label">{{ gross.label }}</span>
                      <span class="value">{{ gross.total }}</span>
                    </span>
                  </template>
                </div>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <WarehousingDialog
      ref="warehousingDialog"
      @handleSuccess="mixinkeepTable"
      :againVerify="againVerify"
    />
  </div>
</template>

<script>
import { getECommerceList, getVerifiedList } from "@/api/warehouse/prediction";
import { mapActions, mapState } from "vuex";
import {
  searchConfig,
  searchConfigDone,
  tableColumns,
  tableColumnsDone,
} from "./model";
import {
  getFreightList,
  getEcFreightList,
  exportOperationTransportation,
} from "@/api/order/firstTransport.js";
import { DateCompute } from "@/utils/index.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "InStorageVerify",
  mixins: [mixinColsConf],
  components: {
    WarehousingDialog: () =>
      import("_comp/ComOperate/components/WarehousingDialog"), // 入仓（散货）核实
  },
  // computed: {
  //   ...mapState(["dictionary"]),
  // },
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
            label: "待入库核实",
            name: "1",
          },
          {
            label: "已核实货物",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => {
              this.handleExport();
            },
          },
        ],
      },
      searchFromData: {
        1: {},
        2: {},
      },
      searchColumns: {
        1: searchConfig,
        2: searchConfigDone,
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        searchForm: true,
        expansion: false,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getECommerceList(formModel);
            resolve();
          });
        }, // 表单提交接口
        size: "small",
        labelWidth: "100px",
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 312px)",
        getQueryParams: this.getQueryParams,
        httpRequest: { 1: getECommerceList, 2: getVerifiedList },
        columnConfig: {
          1: tableColumns.tableLists,
          2: tableColumnsDone.tableLists,
        },
        statusList: [
          {
            text: "收货核实",
            handleClick: this.handleUpdate,
          },
        ],
      },
      againVerify: false,
      grossTotal: {
        1: tableColumns.grossTotal,
        2: tableColumnsDone.grossTotal,
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("predictionManage").then((res) => {
      this.showSearchForm = true;
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getECommerceList(searchFrom = {}) {
      const params = {
        ...searchFrom,
        ...this.handleTime(
          searchFrom.warehousingTime,
          "warehousingTimeBegin",
          "warehousingTimeEnd"
        ),
        ...this.handleTime(
          searchFrom.realWarehousingTime,
          "realWarehousingTimeBegin",
          "realWarehousingTimeEnd"
        ),
      };
      params.warehousingTime && delete params.warehousingTime;
      params.realWarehousingTime && delete params.realWarehousingTime;
      delete params.undefined;
      this.searchFromData[this.tabsConfig.activeName] = params;
      // console.log("this.searchFromData", this.searchFromData);
      this.mixinkeepTable(true);
    },
    handleTime(time, begin, end) {
      const obj = {};
      if (time) {
        this.$set(obj, begin, time[0]);
        this.$set(obj, end, DateCompute(time[1], 1));
      }
      return obj;
    },
    getQueryParams(tab) {
      let statusObj = {
        1: [0],
        2: [1, 2, 3, 4],
      };
      let warehousingStatusList = statusObj[tab];
      if (this.searchFromData[tab].warehousingStatusList) {
        warehousingStatusList = [
          Number(this.searchFromData[tab].warehousingStatusList),
        ];
      }
      return {
        ...this.searchFromData[tab],
        warehousingStatusList,
      };
    },
    handleView(row) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.id);
      this.$router.push({
        path: "/domesticWarehouse/verifyDetails",
        query: {
          id: row.id,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          backPath: this.$route.path,
        },
      });
    },
    async handleUpdate(row) {
      if (row.warehousingStatus > 0) {
        this.againVerify = true;
      } else {
        this.againVerify = false;
      }
      const {
        customerName: bailorPeople,
        id: operationOrderId,
        operationOrderNum,
        createTime,
        orderId,
        warehousingStatus,
        headTransportModeName,
        outWarehouseWayName,
        isMainBill,
      } = row;
      let res = {};
      if (isMainBill !== 5)
        if (warehousingStatus === 1) {
          res = await this.comRepeatedRequest(this, getEcFreightList, {
            operationOrderId,
            isVerified: 1,
            isCheckGoods: 1,
          });
        } else {
          res = await this.comRepeatedRequest(this, getFreightList, {
            orderEcId: orderId,
          });
        }
      const params = {
        operationId: operationOrderId,
        orderId,
        orderType: 2,
        freightType: 1,
        operationOrderNum,
        bailorPeople,
        createTime,
        headTransportModeName,
        outWarehouseWayName,
        isMainBill,
        lists: res,
      };
      this.$refs.warehousingDialog.show(params, "inStorage", true);
    },
    getResult(rows) {
      //计算货物总数
      const { activeName } = this.tabsConfig;
      const { resultData } = rows;
      if (resultData.code === 200) {
        this.grossTotal[activeName].map((item) => {
          let total = 0;
          resultData.rows.map((result) => {
            if (item.compute) {
              total +=
                result[item.factor[0].prop] * result[item.factor[1].prop];
            } else if (result[item.prop]) {
              total += result[item.prop];
            }
          });
          if (item.decimal) {
            this.$set(item, "total", total.toFixed(item.decimal));
          } else {
            this.$set(item, "total", total);
          }
        });
      }
    },
    handleExport() {
      const { activeName } = this.tabsConfig;
      const { limit, start } =
        this.$refs[`tableRef${+activeName}`][0].getPaging();
      const params = {
        ...this.getQueryParams(activeName),
        pageNum: start,
        pageSize: limit,
      };
      comFileDownload(this, exportOperationTransportation, params);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .view-table-total {
    span {
      &:nth-child(1) {
        font-weight: bold;
      }
      &:nth-child(2) {
        padding-left: 0px;
      }
    }
  }
}
</style>
