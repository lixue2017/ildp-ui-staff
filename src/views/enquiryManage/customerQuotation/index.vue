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
            />
          </keep-alive>
          <keep-alive>
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableConfig.tableColumns"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :rowOperationBtnListFn="rowOperationBtnListFn"
              @handleTableView="handleView"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'startPortCode'">
                  <TooltipOver
                    :content="`${slotProps.row.startPortName || '--'} → ${
                      slotProps.row.endPortName || '--'
                    }`"
                    :textLineClamp="2"
                    v-if="
                      slotProps.row.startPortName || slotProps.row.endPortName
                    "
                  />
                  <span v-else>--</span>
                </template>
                <template v-if="slotProps.prop === 'priceMap'">
                  <div class="price-map">
                    <template
                      v-for="key in Object.keys(slotProps.row.priceMap || {})"
                    >
                      <div class="" :key="`${slotProps.rowIndex}-${key}`">
                        <div class="label">{{ key }}</div>
                        <div
                          :class="`value ${
                            slotProps.row.priceMap[key] && 'text-warning-color'
                          }`"
                        >
                          {{ slotProps.row.priceMap[key] }}
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <CustomDialog ref="confirmDlgRef" />
    <SetSingleDialog ref="singleQuotationRef" @handleSuccess="mixinkeepTable" />
    <SetBatchDialog ref="batchQuotationRef" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns, relatedOrdersConfig } from "./model.js";
import {
  getQuotationSheetList,
  overseaOrderRelated,
} from "@/api/enquiryManage/customerQuotation";
import { handleCopyText } from "@/utils/confirmBox.js";
import { mapActions } from "vuex";
export default {
  name: "CustomerQuotation",
  mixins: [mixinColsConf],
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
    CustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    SetSingleDialog: () =>
      import(
        "@/views/enquiryManage/customerQuotation/components/SetSingleDialog"
      ),
    SetBatchDialog: () =>
      import(
        "@/views/enquiryManage/customerQuotation/components/SetBatchDialog"
      ),
  },
  data() {
    return {
      pageType: 1,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "客户报价记录",
            name: "1",
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.searchList(formModel);
            resolve();
          });
        },
        searchForm: true,
        searchNum: searchColumns.length,
        labelWidth: "106px",
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
        ],
        formRules: {},
      },
      tableConfig: {
        httpRequest: getQuotationSheetList,
        getQueryParams: this.getQueryParams,
        tableColumns,
      },
      mixinTableColArr: [tableColumns],
      searchFromData: {},
      statusList: [
        {
          statusArr: [6],
          text: "编辑",
          type: "edit",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [6],
          text: "分享报价",
          type: "share",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [6],
          text: "确认报价",
          type: "confirmQuotation",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [7],
          text: "关联订单",
          type: "relatedOrders",
          handleClick: this.handleBtnClick,
        },
      ],
    };
  },
  created() {
    this.searchDictionary();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchDictionary() {
      this["dictionary/getDictionary"]("customerQuotation").then(() => {
        this.showSearchForm = true;
      });
    },
    rowOperationBtnListFn(row) {
      const bArr = [...this.statusList];
      return bArr.filter((e) => e.statusArr?.includes(row.state));
    },
    handleView({ id }) {
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e.id);
      this.$router.push({
        path: "/enquiryManage/customerQuotationDetail",
        query: {
          id,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","),
        },
      });
    },
    getQueryParams() {
      return this.searchFromData;
    },
    searchList(searchFrom) {
      const { createTime, ...searchObj } = searchFrom;
      const [createTimeGe, createTimeLe] = createTime || [];
      this.searchFromData = {
        ...searchObj,
        createTimeGe,
        createTimeLe,
      };
      this.mixinkeepTable(true);
    },
    handleBtnClick(row, btn = {}) {
      switch (btn.type) {
        case "relatedOrders":
          this.relatedOrdersDlg(row);
          break;
        case "confirmQuotation":
          this.handleView(row);
          break;
        case "share":
          this.handleShare(row.id);
          break;
        case "edit":
          this.handleSetQuotation(row);
          break;
        default:
          break;
      }
    },
    handleSetQuotation(row) {
      const { id: quotationSheetId, inquirySheetId } = row;
      if (inquirySheetId) {
        this.$refs.singleQuotationRef.show({
          inquirySheetId,
          quotationSheetId,
        });
      } else {
        this.$refs.batchQuotationRef.show({
          quotationSheetId,
        });
      }
    },
    handleShare(id) {
      handleCopyText(
        `您好，感谢贵司的咨询，根据您的需求，我们为您精心制定了一份详细的报价单，请随时与我们联系，谢谢 点击链接查阅： ${window.location.origin}/shareQuotation?id=${id}&type=1`,
        this,
        "已复制分享链接"
      );
    },
    relatedOrdersDlg(row) {
      const {
        id: quotationSheetId,
        packingMode,
        shippingMode,
        customerId: customerIdEq,
        startPortId: portOfDeparture,
        endPortId: portOfDestination,
        cabinProxyId,
        sameIndustryProxyId,
        inquirySheetType,
      } = row;
      this.$refs.confirmDlgRef?.showCustomDialog({
        formModel: {
          operationOrderId: "",
        },
        httpRequest: (opt) => {
          const {
            relatedOrder: { id: orderId, operationOrderType: orderType },
          } = opt;
          return overseaOrderRelated({ orderId, orderType, quotationSheetId });
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
        customFormConfig: relatedOrdersConfig({
          isBookingSpace: 0,
          pageLocation: packingMode ? 2 : 1,
          typeOfShipping: shippingMode === 1 ? 0 : 3,
          customerIdEq,
          portOfDeparture: portOfDeparture || undefined,
          portOfDestination: portOfDestination || undefined,
          cabinProxyId,
          sameIndustryProxyId,
          inquirySheetType,
        }),
      });
    },
    getPort(row) {
      const { startPortName, endPortName } = row;
      const ports = [];
      startPortName && ports.push(startPortName);
      endPortName && ports.push(endPortName);
      return ports.join(" → ");
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/ {
    .drawer-title {
      display: flex;

      & > span:first-child {
        margin-right: 30px;
      }
    }
  }

  .price-map {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    & > div {
      padding: 3px 6px 3px 0;

      .label {
        font-weight: bold;
        margin-bottom: 3px;
        white-space: nowrap;
      }

      .value {
      }
    }
  }
}
</style>
