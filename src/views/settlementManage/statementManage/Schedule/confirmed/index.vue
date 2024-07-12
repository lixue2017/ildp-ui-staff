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
              :selectionTableRow="[...selectionRows]"
              :selectionRow="selectionRowEvt"
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
          * 记账主体 往来单位一致，工作单号一致才可批量确认
        </div>
      </template>
    </ComTabs>
    <ComCustomDialog
      ref="customDialogRef"
      :slotDlgFormIds="['tips', 'orderId']"
    >
      <template v-slot:tips="slotProps">
        <div class="introduce-title">
          <span> *确认之后当前操作时间为记账时间 </span>
        </div>
      </template>
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
  getSettleAccountsCheckBsList,
  submitSettleAccountsCheck,
  submitSettleAccountsTransfer,
  submitSettleAccountsCallback,
} from "@/api/settlementManage/statementManage.js";
import { typeConversion } from "@/utils/index"; // 数据类型转换
import {
  confirmedFormConfig,
  confirmedTableConfig,
  confirmedDialogCols,
  transmitDialogCols,
  rejectDialogCols,
} from "../model.js";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getFirstInitData } from "@/utils/index.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
export default {
  name: "Confirmed",
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
        handleTabsClick: () => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "待确认明细",
            name: "1",
          },
          {
            label: "已确认明细",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "批量确认",
            showTabName: "1",
            disabled: true,
            handleClick: (row) => {
              const ids = this.selectionRows.map((e) => e.id);
              const num = this.selectionRows.length;
              this.handleBatchConfirmation({
                ...this.selectionRows[0],
                ids,
                num,
              });
            },
          },
          {
            table: "转交确认人",
            showTabName: "1",
            disabled: true,
            handleClick: (row) => {
              const ids = this.selectionRows.map((e) => e.id);
              const num = this.selectionRows.length;
              this.handleConfirmedBy({ ...this.selectionRows[0], ids, num });
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
        formRules: {}, // 表单校验规则
        residueCols: [2],
      },
      tableConfig: {
        tableHeight: {
          1: "calc(100vh - 264px)",
          2: "calc(100vh - 264px)",
        },
        httpRequest: getSettleAccountsCheckBsList,
        statusList: [
          //确认状态 10待关联  20待确认  30已确认  50已驳回
          {
            text: "确认",
            statusShow: [20],
            handleClick: (row) => {
              this.handleBatchConfirmation({ ...row, ids: [row.id] });
            },
          },
          {
            text: "转交",
            statusShow: [20],
            handleClick: (row) => {
              this.handleConfirmedBy({ ...row, ids: [row.id] });
            },
          },
          {
            text: "驳回",
            statusShow: [20],
            color: "#FF6767",
            handleClick: (row) => {
              this.handleReject({ ...row, ids: [row.id] });
            },
          },
        ],
      },
      mixinTableColArr: [confirmedTableConfig(1), confirmedTableConfig(2)],
      showSearchForm: false,
      searchFromData: {},
      selectionRows: [],
      checkType: null, //1批量确认  2批量转交
      totalData: [],
    };
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  watch: {
    selectionRows(rows) {
      // const length = rows.length;
      // this.tabsConfig.btnArr.map((e, index) => {
      //   if (length == 0) {
      //     e.disabled = true;
      //   } else if (length == 1) {
      //     e.disabled = false;
      //   } else if (length > 1) {
      //     if (index == this.checkType) {
      //       e.disabled = false;
      //     } else {
      //       e.disabled = true;
      //     }
      //   }
      // });
      const nRow = rows[0] || {};
      const status = rows.every(
        (e) =>
          nRow.checkStatus === e.checkStatus &&
          nRow.businessCompany === e.businessCompany &&
          nRow.dealingsCompany === e.dealingsCompany &&
          nRow.orderNo === e.orderNo
      );
      if (rows.length > 0) {
        if (status) {
          this.tabsConfig.btnArr[0].disabled = false;
          this.tabsConfig.btnArr[1].disabled = false;
        } else {
          this.tabsConfig.btnArr[0].disabled = true;
          this.tabsConfig.btnArr[1].disabled = false;
        }
      } else {
        this.tabsConfig.btnArr[0].disabled = true;
        this.tabsConfig.btnArr[1].disabled = true;
      }
      this.getTotalData(rows);
    },
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
      //       checkId: this.curUserInfo?.userId,
      //       checkName: this.curUserInfo?.userName,
      //       checkStatus: e.name == 1 ? "20" : undefined,
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
        lists: confirmedFormConfig(tName),
        formModel: {},
      };
    },
    getQueryParams(tName) {
      //确认状态 10待关联  20待确认  30已确认  50已驳回
      const { checkStatus, businessCompanyName, checkName, ...nObj } =
        this.searchFromData[tName] || {};
      return {
        ...nObj,
        checkStatus: checkStatus
          ? checkStatus.split(",")
          : tName == 1
          ? [20, 50]
          : [30],
      };
    },
    getStatuLists(row) {
      const { checkStatus } = row;
      let status = checkStatus;
      return this.tableConfig.statusList.filter((rBtn) => {
        return rBtn.statusShow.includes(status);
      });
    },
    onTableSelectionChange(rows = []) {
      //确认状态 10待关联  20待确认  30已确认  50已驳回
      const nRows = rows.filter((e) => [20].includes(e.checkStatus));
      this.selectionRows = nRows;
      // this.checkType = null;
      // if (nRows.length > 1) {
      //   const rowFirst = nRows[0] || {};
      //   const rowSecend = nRows[1] || {};
      //   if (
      //     rowFirst.checkStatus === rowSecend.checkStatus &&
      //     rowFirst.businessCompany === rowSecend.businessCompany &&
      //     rowFirst.dealingsCompany === rowSecend.dealingsCompany &&
      //     rowFirst.orderNo === rowSecend.orderNo
      //   ) {
      //     this.checkType = 0;
      //     this.selectionRows = nRows.filter(
      //       (e) =>
      //         e.checkStatus === rowFirst.checkStatus && //来源工作号
      //         e.businessCompany === rowFirst.businessCompany && //记账主体
      //         e.dealingsCompany === rowFirst.dealingsCompany &&//往来单位
      //         e.orderNo === rowSecend.orderNo//工作单号
      //     );
      //   } else{
      //     this.checkType = 1;
      //     this.selectionRows = nRows;
      //   }
      // } else {
      //   this.selectionRows = nRows;
      // }
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]._toggleRowSelectionMixin({ newCheckRows: this.selectionRows });
    },
    selectionRowEvt(row) {
      //确认状态 10待关联  20待确认  30已确认  50已驳回
      const { checkStatus } = row;
      return [20].includes(checkStatus);
      // let rSome = true;
      // if (this.selectionRows.length == 1) {
      //   rSome = this.selectionRows;
      // } else if (this.selectionRows.length > 1) {
      //   if (this.checkType == 0) {
      //     rSome = this.selectionRows.some(
      //       (e) =>
      //         e.checkStatus === row.checkStatus && //来源工作号
      //         e.businessCompany === row.businessCompany && //往来单位
      //         e.dealingsCompany === row.dealingsCompany &&
      //         e.orderNo === row.orderNo
      //     );
      //   } else if (this.checkType == 1) {
      //     rSome = this.selectionRows;
      //   }
      // }
      // if ((this.selectionRows?.length && !rSome) || row.checkStatus != 20) {
      //   return false; // 禁止选择
      // }
      // return true;
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
    handleBatchConfirmation(row) {
      //批量确认
      const { businessType, joinBusinessType, joinOrderNo, orderId, ...obj } =
        row;
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
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: confirmedDialogCols({
          businessChange: () => {
            this.$refs.orderIdRef?.changeFocusRequest();
          },
        }),
        formModel,
        httpRequest: (formModel) => {
          const { ids, orderId, remark, businessType } = formModel;
          const params = {
            id: ids,
            // businessType: orderId.isBussiness,
            businessType,
            orderId: orderId.orderId,
            orderNo: orderId.orderNum,
            remark,
          };
          return submitSettleAccountsCheck(params);
        },
        successFunction: this.handleWarehousingSuccess,
      });
    },
    handleConfirmedBy(row) {
      //转交确认人
      const { businessType, joinBusinessType, joinOrderNo, ...obj } = row;
      const formModel = {
        ...obj,
        sourceJoinBusinessType: joinBusinessType,
        sourceJoinOrderNo: joinOrderNo,
      };
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: transmitDialogCols({}),
        formModel,
        httpRequest: (formModel) => {
          const { ids, checkId, remark } = formModel;
          const params = {
            id: ids,
            checkId, //指定确认人
            remark, //备注
          };
          return submitSettleAccountsTransfer(params);
        },
        successFunction: this.handleWarehousingSuccess,
      });
    },
    handleReject(row) {
      const formModel = {
        ...row,
        remark: "",
      };
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: rejectDialogCols({}),
        formModel,
        httpRequest: (formModel) => {
          const { ids, remark } = formModel;
          const params = {
            id: ids,
            remark,
          };
          return submitSettleAccountsCallback(params);
        },
        successFunction: this.handleWarehousingSuccess,
      });
    },
    handleWarehousingSuccess() {
      this.mixinkeepTable(true);
    },
  },
};
</script>
<style lang="scss" scoped>
.introduce-title {
  color: #3179ef;
}
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
