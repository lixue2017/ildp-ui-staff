<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :setColumnParams="mixinColumnSetParams"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :rowOperationBtnListFn="(row) => getStatusList(row, 'status')"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'number'">
                  <template v-if="slotProps.row.status != 45">
                    <span
                      class="primary-text-btn"
                      @click="handleView(slotProps.row)"
                    >
                      {{ slotProps.row.number }}
                    </span>
                    <i
                      @click="handleCopyText(slotProps.row.number)"
                      class="el-icon-document-copy primary-text-color"
                    />
                  </template>
                  <span v-else>{{ slotProps.row.number }}</span>
                </template>
                <template v-if="slotProps.prop === 'inlandExportParam'">
                  <span
                    :class="[
                      'isComplete',
                      slotProps.row.inlandExportParam
                        ? 'text-success-color'
                        : 'text-danger-color',
                    ]"
                  >
                    <i
                      :class="
                        slotProps.row.inlandExportParam
                          ? 'el-icon-circle-check'
                          : 'el-icon-warning-outline'
                      "
                    ></i>
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <!-- <template v-if="slotProps.prop === 'repulse'">
                <span
                  class="primary-text-btn"
                  @click="repulseView(slotProps.row)"
                >
                  {{ slotProps.row.repulse }}
                </span>
              </template> -->
                <!-- <template v-if="slotProps.prop === 'backNum'">
                  <span
                    class="primary-text-btn"
                    @click="repulseView(slotProps.row)"
                  >
                    {{ slotProps.row.backNum }}
                  </span>
                </template> -->
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDlgRef">
      <template v-slot:tip-bottom>
        <div class="dialog-tip" v-if="repulseType === 2">{{ dialogTip }}</div>
      </template>
    </ConfirmDialog>
    <OrderReceiving ref="orderReceiving" @handleSuccess="mixinkeepTable" />
    <OrderSubmit ref="OrderSubmit" @handleSuccess="mixinkeepTable" />
    <LogistTrackDialog ref="LogistTrackDialog" />
    <Logistics ref="LogisticsRef" :activities="{}" />
    <BusinessSubmit
      ref="businessSubmitRef"
      @handleSuccess="mixinkeepTable"
      @handleError="businessSubmitErr"
    />
  </div>
</template>

<script>
import {
  getOrderECList,
  businessSubmitGather,
  businessRepulse,
  exportQTOrderList,
  getOrderConfigList,
} from "@/api/order/firstTransport.js";
import { mapActions, mapState, mapGetters } from "vuex";
import { searchColumns, tableColumns } from "./model";
// import{download} from "@/api/download/download.js"
import { downloadTest } from "@/utils/ruoyi.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import mixinOrder from "../components/mixinOrder";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "ECommerce",
  mixins: [mixinColsConf, mixinOrder],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    OrderReceiving: () => import("./components/orderReceive"),
    OrderSubmit: () => import("../components/OrderSubmit"),
    LogistTrackDialog: () => import("./components/logistTrackDialog"),
    Logistics: () => import("./components/logistTrackDialog/logistics.vue"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "电商头程运输", // 订单管理
            name: "1",
          },
        ],
        btnArr: [
          // {
          //   table: "批量分配",
          //   handleClick: () => this.handleReceiving(),
          // },
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => this.handleExport(),
          },
        ],
      },
      searchFromData: {},
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
        labelWidth: "98px",
        // residueCols: [2],
        searchColsHeight: true,
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
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getOrderECList,
        // columnConfig: tableColumns,
      },
      mixinTableColArr: [tableColumns],
    };
  },
  computed: {
    ...mapState(["dictionary"]),
    ...mapGetters(["salesmanId", "salesmanName"]),
  },
  methods: {
    ...mapActions([
      "dictionary/getDictionary",
      "operateDetails/storeUrlTempParam",
    ]),
    handleExport() {
      const params = {
        ...this.searchFromData,
        isDataFil: 1,
      };
      comFileDownload(this, exportQTOrderList, params);
    },
    searchDictionary() {
      this.searchFormConfig.formModel = {
        ...this.searchFormConfig.formModel,
        salesmanName: this.salesmanId,
        salesman: this.salesmanName,
      };
      this.searchFromData = {
        ...this.searchFromData,
        salesmanName: this.salesmanId,
      };
      this["dictionary/getDictionary"]("eCommerceTypeEn").then(() => {
        this.showSearchForm = true;
      });
    },
    handleCommand(cb, row) {
      cb && cb(row);
    },
    getList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const [beginTime, endTime] = createTime || [];
      this.searchFromData = {
        ...searchObj,
        beginTime,
        endTime,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      return { ...this.searchFromData, isDataFil: 1 };
    },
    // 接单
    handleReceiving(row, type) {
      if (type) {
        if (type === "operationSubmit") {
          //操作提单
          this.$refs.OrderSubmit.show(row, type, "2");
        } else if (type === "businessSubmit") {
          //业务提交
          const { isMainBill } = row;
          if (isMainBill !== 9) {
            this.$refs.businessSubmitRef?.show(row);
          } else {
            businessSubmitGather("2", row.id)
              .then((res) => {
                this.mixinkeepTable();
              })
              .catch((error) => {
                const {msg}=error
                this.$message.error(msg);
                this["operateDetails/storeUrlTempParam"]({
                  pageTab: "30",
                });
                this.handleView(row);
              });
          }
        }
      } else {
        // headTransportMode 3=空运;4=快递
        const { id, orderType } = row;
        getOrderConfigList(id, 1).then((res) => {
          const dicts = res.data || {};
          row.operationOrderType = [3, 4].includes(row.headTransportMode)
            ? 1
            : 0; // 1是空运，0是海运
          row.bailorPeople = row.companyNameCn;
          if (row.operationOrderType && +row.encasementWay) {
            row.proxyType = 1;
          }
          this.$refs.orderReceiving.show(row, `3-${row.encasementWay}`, {
            proxyTypeDicts: dicts,
          }); //encasementWay-装箱方式   0为整柜FCL    1为散货LCL
        });
      }
    },
    businessRepulse({ id }) {
      businessRepulse({
        id,
        type: 2,
      }).then(() => {
        this.mixinkeepTable();
      });
    },
    getOperationBtn(row = {}) {},
    handleView(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: "/newOrderManage/eCommerceDetails",
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    repulseView(rows) {
      this.$refs.LogistTrackDialog.show(rows);
    },
    download() {
      downloadTest("test1.xls");
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../components/common.scss";
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
    // margin-top: 7px;
    .btn-list {
      display: flex;
    }
    .operate-icon {
      display: flex;
      align-items: center;
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
