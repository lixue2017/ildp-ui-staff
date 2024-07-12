<template>
  <!-- 经查询此菜单已停用，如有使用请备注 -->
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(tab.name)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="model[tab.name].tableColumns"
              :httpRequest="tableConfig.httpRequest[tab.name]"
              :getQueryParams="() => getQueryParams(tab.name)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'joinRouteCode'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.joinRouteCode }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'code'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.code }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'shippingRouteStatus'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor: slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operate-btn-list">
                    <div
                      class="btn"
                      v-for="(item, index) in tableConfig.statusList"
                      :key="index"
                    >
                      <el-button
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="small"
                        type="text"
                        @click="item.handleClick(slotProps.row)"
                      >
                        {{ item.text }}
                      </el-button>
                    </div>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <CheckInDialog ref="checkInDialog" @submitSuccess="mixinkeepTable" />
    <AddEditDialog ref="dialog" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { getForBookingList } from "@/api/marketManage/airline";
import { mapActions, mapState } from "vuex";
import {
  forBookingSearchCols,
  bookedSearchCols,
  forBookingTableCols,
  bookedTableCols,
} from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "ForBooking",
  mixins: [mixinColsConf],
  components: {
    CheckInDialog: () => import("./components/CheckInDialog"),
    AddEditDialog: () =>
      import(
        "@/views/marketManage/airlineFlight/components/AddEditDialog/index.vue"
      ),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          if (this.tabsConfig.activeName === "1") {
            this.searchFromData["1"].status = 0;
          } else {
            this.searchFromData["2"].status = 1;
          }
          this.$nextTick(() => {
            this.mixinkeepTable();
          });
        },
        tabs: [
          {
            label: "待订舱",
            name: "1",
          },
          {
            label: "已订舱",
            name: "2",
          },
        ],
      },
      model: {
        1: {
          searchColumns: forBookingSearchCols,
          tableColumns: forBookingTableCols,
        },
        2: {
          searchColumns: bookedSearchCols,
          tableColumns: bookedTableCols,
        },
      },
      searchFromData: {
        1: {
          status: 0,
          // type:2
        },
        2: {
          status: 1,
          // type:2
        },
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getForBookingList(formModel);
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
          1: getForBookingList,
          2: getForBookingList,
        },
        statusList: [
          {
            text: "订舱登记",
            handleClick: this.handleCheckIn,
          },
        ],
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("marketManage").then((res) => {
      this.showSearchForm = true;
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchFormConfig(tab) {
      return {
        ...this.searchFormConfig,
        ...this.model[tab].searchColumns,
      };
    },
    getForBookingList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchFrom,
        startTime: searchFrom.receiveDate && searchFrom.receiveDate[0],
        endTime: searchFrom.receiveDate && searchFrom.receiveDate[1],
        startDate: searchFrom.createTime && searchFrom.createTime[0],
        endDate: searchFrom.createTime && searchFrom.createTime[1],
        shippingStartTime:
          searchFrom.shippingRouteTime && searchFrom.shippingRouteTime[0],
        shippingEndTime:
          searchFrom.shippingRouteTime && searchFrom.shippingRouteTime[1],
        statusList: searchFrom.statusList && searchFrom.statusList.join(","),
        status: this.tabsConfig.activeName - 1,
      };
      delete this.searchFromData[this.tabsConfig.activeName].receiveDate;
      delete this.searchFromData[this.tabsConfig.activeName].createTime;
      delete this.searchFromData[this.tabsConfig.activeName].shippingRouteTime;
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      return this.searchFromData[tab];
    },
    handleView(row) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.id);
      this.$router.push({
        path: "/marketManage/airlineFlightDetails",
        query: {
          id: row.routeNoId,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleCheckIn(row) {
      const {
        type,
        boxModelId,
        joinOrder,
        id,
        orderType,
        orderId,
        operationOrderId,
        boxModel,
        boxNum,
      } = row;
      const params = {
        type,
        routeId: "",
        boxModelId,
        boxModel,
        boxNum,
        orderType,
        orderId,
        orderNo: joinOrder,
        id,
        operationOrderIds: operationOrderId,
        operationType: "operation",
      };
      // this.$refs.checkInDialog.show(params);
      this.$refs.dialog.show(params);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/.hideFold {
  .el-button--primary.is-plain {
    display: none;
  }
}
</style>
