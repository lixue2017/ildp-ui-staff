<template>
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
              :tableHeight="tableConfig.tableHeight[tab.name]"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="getStatuLists"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
              v-if="tabsConfig.activeName === tab.name"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'checkStatus'">
                  <div>
                    <i
                      v-if="slotProps.column.dotColor"
                      class="status-dot"
                      :style="{
                        backgroundColor: slotProps.dicsList.color,
                      }"
                    />
                    <span
                      :title="
                        slotProps.row.checkStatus == 50
                          ? slotProps.row.remark
                          : undefined
                      "
                    >
                      {{ slotProps.dicsList.nameCn }}</span
                    >
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <div class="tabs-tips" v-if="tabsConfig.activeName == 1">
          * 记账主体 往来单位一致，才可批量关联
					<!-- 来源工作单号一致 -->
        </div>
      </template>
    </ComTabs>
    <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['orderId']">
      <template v-slot:orderId="slotProps">
        <AutoComplete
          ref="orderIdRef"
          :formModel="slotProps.formModel"
          :fieldItem="slotProps.fieldItem"
          :additionalParam="{
            businessCompany: slotProps.formModel.businessCompany,
            businessType: slotProps.formModel.businessType,
            orderId:
              slotProps.formModel.orderId &&
              slotProps.formModel.orderId.orderId,
          }"
        />
      </template>
    </ComCustomDialog>
    <div
      class="grand-total"
      v-if="totalData.length > 0 && tabsConfig.activeName == 1"
    >
      <span class="title">合 计：</span>
      <div class="total-data">
        <div v-for="(item, index) in totalData" :key="index">
          <span class="total-code">{{ item.label }}</span>
          <template>
            <span class="total-collection">应收：</span>
            <span>{{ formatMoney(item.collectionValue || 0) }}</span>
            <span class="total-pay">应付：</span>
            <span>{{ formatMoney(item.payValue || 0) }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSettleAccountsRelevancyBsList,
  submitSettleAccountsRelevancy,
} from "@/api/settlementManage/statementManage.js";
import { typeConversion } from "@/utils/index"; // 数据类型转换
import {
  associatedFormConfig,
  associatedtableConfig,
  associatedCustomDialogCols,
} from "../model.js";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getFirstInitData, duplicateRemoval } from "@/utils/index.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
export default {
  name: "Associated",
  mixins: [mixinColsConf],
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: (row) => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "进行中明细",
            name: "1",
          },
          {
            label: "已完结明细",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "批量关联",
            showTabName: "1",
            disabled: true,
            handleClick: (row) => {
              //批量传第一个选取的数据
              const length = this.selectionRows.length;
              const ids = this.selectionRows.map((e) => e.id);
							const joinOrderNos = this.selectionRows.map((e) => e.joinOrderNo);
              const model = {
                ...this.selectionRows[0],
								joinOrderNo: duplicateRemoval(joinOrderNos).join(","),
                num: length,
                ids,
              };
              this.handleAssociation(model, 2);
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.onTableSelectionChange([]);
            this.searchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "95px",
        residueCols: [2],
      },
      tableConfig: {
        tableHeight: {
          1: "calc(100vh - 264px)",
          2: "calc(100vh - 264px)",
        },
        httpRequest: getSettleAccountsRelevancyBsList,
        statusList: [
          //确认状态 10待关联  20待确认  30已确认  50已驳回
          //双向类型 10自动确认  20自动关联  21手动关联  100其他
          {
            text: "去关联",
            statusShow: ["10", "30"],
            handleClick: (row) => {
              this.handleAssociation({ ...row, ids: [row.id] }, 0);
            },
          },
          {
            text: "修改",
            statusShow: ["2021", "30", "50"],
            handleClick: (row) => {
              this.handleAssociation({ ...row, ids: [row.id] }, 1);
            },
          },
        ],
      },
      mixinTableColArr: [associatedtableConfig(1), associatedtableConfig(2)],
      showSearchForm: false,
      searchFromData: {},
      selectionRows: [],
      totalData: [], //汇总数据
    };
  },
  watch: {
    selectionRows(rows) {
      const length = rows.length;
      this.$set(this.tabsConfig.btnArr[0], "disabled", !length);
      this.getTotalData(rows);
    },
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  mounted() {
    this["dictionary/getDictionary"]([
      "settlementBusinessType",
      "settleBsType",
      "settleAccountBillCheckStatus",
      "trueOrFalse",
      "billType",
    ]).then(() => {
      this.getInitialData();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitialData() {
      this.showSearchForm = true;
      // getFirstInitData({
      //   httpRequest: logisticsCustomerInfo,
      // }).then((res) => {
      //   this.tabsConfig.tabs.map((e) => {
      //     this.searchFromData[e.name] = {
      //       createId: this.curUserInfo?.userId,
      //       createName: this.curUserInfo?.userName,
      //       businessCompany: res.id,
      //       businessCompanyName: `${res.code}[${res.shortName}]`,
      //     };
      //   });
      //   this.showSearchForm = true;
      // });
    },
    searchList(searchFrom = {}) {
      const { activeName } = this.tabsConfig;
      const { createTime, accountingTime, ...searchObj } = searchFrom;
      this.searchFromData[activeName] = {
        ...searchObj,
        startTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
        startAccountingTime: accountingTime && accountingTime[0],
        endAccountingTime: accountingTime && accountingTime[1],
      };
      this.mixinkeepTable(true);
    },
    getSearchFormConfig(tName) {
      return {
        ...this.searchFormConfig,
        formModel: {},
        lists: associatedFormConfig(tName),
      };
    },
    getQueryParams(tName) {
      const { checkStatus, createName, businessCompanyName, ...nObj } =
        this.searchFromData[tName] || {};
      return {
        ...nObj,
        checkStatus: checkStatus
          ? checkStatus.split(",")
          : tName == 1
          ? [10, 20, 50]
          : [30],
      };
    },
    getStatuLists(row) {
      const { bsType, checkStatus } = row;
      let status =
        checkStatus == 20 && bsType == 21
          ? "" + checkStatus + bsType
          : checkStatus + "";
      return this.tableConfig.statusList.filter((rBtn) => {
        return rBtn.statusShow.includes(status);
      });
    },
    handleBatchAssociation(row) {
      //批量关联
    },
    onTableSelectionChange(rows = []) {
      //确认状态 10待关联  20待确认  30已确认  50已驳回
      const nRows = rows.filter((e) => e.checkStatus === 10);
      const row = nRows[0] || {};
      this.selectionRows = nRows.filter(
        (e) =>
          e.dealingsCompany === row.dealingsCompany && //往来单位
          e.businessCompany === row.businessCompany
      );
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]._toggleRowSelectionMixin({ newCheckRows: this.selectionRows });
      // this.$set(this.tabBtnArr[0], "disabled", !this.selectionRows.length);
    },
    selectionRowEvt(row) {
      //确认状态 10待关联  20待确认  30已确认  50已驳回
      const rSome = this.selectionRows.some(
        (e) =>
          e.dealingsCompany === row.dealingsCompany && //往来单位
          e.businessCompany === row.businessCompany //记账主体
      );
      if ((this.selectionRows?.length && !rSome) || row.checkStatus !== 10) {
        return false; // 禁止选择
      }
      return true;
    },
    handleAssociation(row, type) {
      const { businessType, joinBusinessType, joinOrderNo, orderId, ...obj } =
        row;
      console.log("orderId", orderId);
      const title = {
        0: "双向费用关联",
        1: "双向费用修改",
        2: "双向费用关联(批量)",
      };

      const formModel = {
        ...obj,
        businessType:
          businessType == 1 || businessType == 2
            ? null
            : typeConversion(businessType),
        sourceJoinBusinessType: joinBusinessType,
        sourceJoinOrderNo: joinOrderNo,
        orderId: orderId
          ? {
              orderId: orderId,
            }
          : undefined,
      };
      // delete formModel.orderId;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: associatedCustomDialogCols({
          title: title[type],
          type,
          businessChange: () => {
            this.$refs.orderIdRef?.changeFocusRequest();
          },
        }),
        formModel,
        httpRequest: (formModel) => {
          const { ids, checkId, businessType, orderId, remark, num } =
            formModel;
          console.log("orderId", orderId);
          const params = {
            id: ids,
            checkId, //指定确认人
            businessType, //关联业务类型
            orderId: orderId.orderId, //关联工作单号
            orderNo: orderId.orderNum,
            remark, //备注
            num,
            isBussiness: orderId.isBussiness,
          };
          return submitSettleAccountsRelevancy(params);
        },
        successFunction: () => this.mixinkeepTable(),
      });
    },
    getTotalData(rows) {
      this.totalData = [];
      rows.map((e) => {
        const { totalMoney, currencyCode, type } = e; //type 1应收   0应付
        const value = type ? "collectionValue" : "payValue";
        const otherValue = type ? "payValue" : "collectionValue";
        if (this.totalData.length == 0) {
          this.totalData.push({
            label: currencyCode,
            [value]: totalMoney,
            [otherValue]: 0,
          });
        } else {
          const a = this.totalData.find((item) => item.label == currencyCode);
          if (a) {
            if (type) {
              a.collectionValue += totalMoney;
            } else {
              a.payValue += totalMoney;
            }
            // a.value += totalMoney;
          } else {
            this.totalData.push({
              label: currencyCode,
              [value]: totalMoney,
              [otherValue]: null,
            });
          }
        }
      });
      const length = this.totalData.length;
      const { activeName } = this.tabsConfig;
      this.tableConfig.tableHeight[activeName] =
        length == 0
          ? "calc(100vh - 264px)"
          : `calc(100vh - ${314 + 20 * (length - 1)}px)`;
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  .grand-total {
    justify-content: flex-start;
    .total-data {
      text-align: left;
      .total-code {
        margin-right: 15px;
      }
      .total-collection {
        color: #53c88a;
      }
      .total-pay {
        margin-left: 15px;
        color: #ff6767;
      }
    }
  }
  .tabs-tips {
    margin-right: 20px;
    color: #3179ef;
  }
}
</style>
