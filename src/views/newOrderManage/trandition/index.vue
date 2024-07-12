<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm :formConfig="getSearchFormConfig(tab.name)"
              @searchHeight="getSearchHeight"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive>
            <ComTable
              :ref="`tableConfig${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="model[tab.name].tableColumns"
              :httpRequest="tableConfig.httpRequest[tab.name]"
              :getQueryParams="() => getQueryParams(tab.name)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'orderNum'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.orderNum }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'backNum'">
                  <span
                    class="primary-text-btn"
                    @click="repulseView(slotProps.row)"
                  >
                    {{ slotProps.row.backNum }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'orderStatus'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <div
                    class="operation-content"
                    v-if="slotProps.row.orderStatus === 1"
                  >
                    <div class="btn">
                      <el-button
                        class="operate-icon"
                        size="small"
                        type="text"
                        icon="el-icon-edit-outline"
                        @click="handleReceiving(slotProps.row)"
                      >
                        业务接单
                      </el-button>
                    </div>
                  </div>
                  <div
                    class="operation-content"
                    v-else-if="slotProps.row.orderStatus === 2"
                  >
                    <div class="btn">
                      <el-button
                        class="operate-icon"
                        size="small"
                        type="text"
                        icon="el-icon-edit-outline"
                        @click="handleReceiving(slotProps.row, 'businessSubmit')"
                      >
                        业务提交
                      </el-button>
                    </div>
                  </div>
                  <div
                    class="operation-content"
                    v-else-if="slotProps.row.orderStatus === 3"
                  >
                    <div class="btn">
                      <el-button
                        class="operate-icon"
                        size="small"
                        type="text"
                        icon="el-icon-edit-outline"
                        @click="handleReceiving(slotProps.row, 'operationSubmit')"
                      >
                        操作接单
                      </el-button>
                    </div>
                  </div>
                  <span v-else>--</span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <OrderReceiving
      ref="orderReceiving"
      @handleSuccess="keepTableList"
    />
    <OrderSubmit ref="OrderSubmit" @handleSuccess="keepTableList" />
    <LogistTrackDialog ref="LogistTrackDialog" />
  </div>
</template>

<script>
import { FullscreenLoading } from "@/utils/loading.js";
import { getTraditionListAll } from "@/api/trandition/index"; //传统订单
import { getOceanTraditionList } from "@/api/trandition/oceanModel"; //海运订单
import { getAirTraditionList } from "@/api/trandition/airModel"; //空运订单
import { getOrderOtherList } from "@/api/trandition/otherModel"; //其他订单
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns } from "./model";
import {
  businessSubmitGather,
} from "@/api/order/firstTransport";
import {
  searchColumns as oceanSearchColumns,
  tableColumns as oceanTableColumns,
} from "./oceanModel";
import {
  searchColumns as airSearchColumns,
  tableColumns as airTableColumns,
} from "./airModel";
import {
  searchColumns as otherSearchColumns,
  tableColumns as otherTableColumns,
} from "./otherModel";
export default {
  name: "Trandition",
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    OrderReceiving: () => import("./components/orderReceive"),
    OrderSubmit: () => import("../components/OrderSubmit"),
    LogistTrackDialog: () => import("./components/logistTrackDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      fullscreenLoading: new FullscreenLoading(),
      dataStatus: [
        {
          label: "草稿",
          value: 0,
          color: "#FAAD14",
        },
        {
          label: "已预报",
          value: 1,
          color: "#52C41A",
        },
      ],
      model: {
        1: {
          searchColumns,
          tableColumns,
        },
        2: {
          searchColumns: oceanSearchColumns,
          tableColumns: oceanTableColumns,
        },
        3: {
          searchColumns: airSearchColumns,
          tableColumns: airTableColumns,
        },
        4: {
          searchColumns: otherSearchColumns,
          tableColumns: otherTableColumns,
        },
      },
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.keepTableList(false)
          })
        },
        tabs: [
          {
            label: "传统订单",
            name: "1",
          },
          {
            label: "海运订单",
            name: "2",
          },
          {
            label: "空运订单",
            name: "3",
          },
          {
            label: "其他订单",
            name: "4",
          },
        ],
        // btnArr: [
        //   {
        //     table: "批量分配",
        //     handleClick: () => this.handleReceiving(),
        //   },
        // ],
      },
      searchFromData: {
        // 1: { orderType: 3 },
        2: { orderType: 3 },
        3: { orderType: 4 },
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
        expansion: false,
        size: "small",
        labelWidth: "85px",
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: {
          1: getTraditionListAll,
          2: getOceanTraditionList,
          3: getAirTraditionList,
          4: getOrderOtherList,
        },
      },
      showSearchForm: false
    };
  },
  created() {
    this["dictionary/getDictionary"]("tranditionTypeEn").then(() => {
      this.showSearchForm = true
    });
  },
  activated() {
    this.keepTableList(false);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchHeight(height) {
      this.tableConfig.tableHeight = `calc(100vh - ${height + 211}px)`;
    },
    handleCommand(cb, row) {
      cb && cb(row);
    },
    getSearchFormConfig(tab) {
      return {
        ...this.searchFormConfig,
        ...this.model[tab].searchColumns,
        isDataFil: 1, //数据隔离
      };
    },
    getList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchFrom,
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        dataStatus: searchFrom.dataStatus && searchFrom.dataStatus.join(","),
        contactsType: this.tabsConfig.activeName - 1,
        tradeClauseSearch:
          searchFrom.tradeClauseSearch &&
          searchFrom.tradeClauseSearch.join(","),
        transportModeSearch:
          searchFrom.transportModeSearch &&
          searchFrom.transportModeSearch.join(","),
        orderBusinessTypeSearch:
          searchFrom.orderBusinessTypeSearch &&
          searchFrom.orderBusinessTypeSearch.join(","),
        freightType: searchFrom.freightType && searchFrom.freightType.join(","),
        statusSearch:
          searchFrom.statusSearch && searchFrom.statusSearch.join(","),
      };
      this.$refs[`tableConfig${+this.tabsConfig.activeName}`][0].refreshTable();
    },
    getQueryParams(tab) {
      return { ...this.searchFromData[tab], isDataFil: 1 }; //数据隔离;
    },
    handleReceiving(row, type) {
      if (type) {
        if (type === "operationSubmit") {
          //操作提单
          this.$refs.OrderSubmit.show(row, type);
        } else if (type === "businessSubmit") {
          //业务提交
          businessSubmitGather(row.orderType, row.id).then(() => {
            this.keepTableList(false);
          });
        }
      } else {
        // console.log(row);
        let type = 4; // 接单：传统-其他
        if ([3, 4].includes(row.orderType)) {
          if (row.freightType == 0) {
            type = 1; // 接单：传统-整柜
          } else {
            type = 2; // 接单：传统-散货
          }
          if (row.orderType === 3) {
            row.operationOrderType = 0; // 海运操作单
          } else {
            row.operationOrderType = 1; // 空运操作单
          }
        } else {
          row.operationOrderType = 2; // 其他操作单
        }
        row.bailorPeople = row.customerName;
        this.$refs.orderReceiving.show(row, type);
      }
    },
    keepTableList(isRefreshPage = true) {
      const { activeName } = this.tabsConfig
      this.$refs[`tableConfig${activeName}`] && this.$refs[`tableConfig${activeName}`][0]?.refreshKeepTable(isRefreshPage, activeName);
    },
    handleView(row) {
      // console.log(row);
      const idList = this.$refs[
        `tableConfig${this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.id);
      this.$router.push({
        path: "/newOrderManage/tranditionDetails",
        query: {
          id: row.id,
          orderType: row.orderType,
          backPath: this.$route.fullPath,
          pageSign: idList.join(',')
        },
      });
    },
    handleCopy(row) {
      console.log("复制");
      console.log(row);
    },
    handleDelete(row) {
      console.log("删除");
      console.log(row);
    },
    repulseView() {
      this.$refs.LogistTrackDialog.show();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.white-space-nowrap {
  white-space: nowrap;
}
.operation-header {
  // padding: 0 20px;
  span {
    &:nth-child(1) {
      width: 40%;
    }
    &:nth-child(2) {
      width: 60%;
    }
    display: inline-block;
    text-align: center;
  }
}
.operation-content {
  // padding: 0 20px;
  .operate-status {
    span {
      &:nth-child(1) {
        width: 40%;
      }
      &:nth-child(2) {
        width: 60%;
      }
      display: inline-block;
      text-align: center;
    }
  }
  .btn {
    display: flex;
    // justify-content: flex-end;
    .btn-list {
      display: flex;
    }
    .operate-icon {
      display: flex;
      align-items: center;
      margin-right: 14px;
      padding: 0;
      &.operate-icon-info {
        color: #606060;
      }
      /deep/ span {
        font-size: 12px;
      }
    }
  }
}
</style>
