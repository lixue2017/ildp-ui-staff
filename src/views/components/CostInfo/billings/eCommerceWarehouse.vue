<template>
  <!-- 电商入仓，第三方订单/操作单/入库单，FBA订单/操作单/出库单  一件代发订单/操作单/出库单  的账单tab正在使用这个组件 -->
  <div class="e-commerce-warehouse">
    <BillingHead
      ref="headRef"
      :bill-info-list="dataObj.billInfoList"
      :selection-rows="selectionRows"
      :head-form-data="formModel"
      :parent-event-obj="headEventObj"
      :show-btn-arr="showBtnArr"
      :add-row-param="addRowParam"
      :headTableColumnSet="{
        tableColumns: billingTable(),
      }"
    />
    <div class="billing-content">
      <TableOperation
        :ref="`receiptTableRef`"
        v-if="showColsHide($refs.headRef)"
        :columnOpnConf="tableColumns()"
        :tOperationObj="operationObj"
        :selectionRow="selectionRowEvt"
        :showOpnBtnFn="showBillOpnBtn"
        :columnData="null"
        :filterOpnBtnArr="[]"
        :isMountedRequest="![1, 2, 3].includes(formModel.orderHandleType)"
        :httpTableRequest="initDataRequest"
        :onSelectionChange="onTableSelectionChange"
      >
        <template
          v-for="(tItem, tIdx) in ['type', 'prepaidCollect']"
          v-slot:[tItem]="{ slotProps }"
        >
          <!-- 类型、到付预付 -->
          <div :key="`t_${tIdx}`">
            <el-select
              v-if="slotProps.row.rBtnUpdate"
              size="mini"
              v-model="slotProps.row[tItem]"
              style="width: 100%"
              :clearable="false"
            >
              <el-option
                v-for="selectItem in dictArr(tItem)"
                :key="Number(selectItem.value || 0)"
                :label="selectItem.nameCn"
                :value="Number(selectItem.value || 0)"
              />
            </el-select>

            <span
              v-else
              :style="{
                color: slotProps.dicsList && slotProps.dicsList.color,
              }"
              >{{ slotProps.dicsList.nameCn }}</span
            >
          </div>
        </template>

        <template
          v-for="(aItem, aIdx) in [
            'dealingsCompanyName',
            'costName',
            'currency',
          ]"
          v-slot:[aItem]="{ slotProps }"
        >
          <!-- 往来单位、费用名称、币别 -->
          <div :key="`a_${aIdx}`">
            <AutoComplete
              v-if="slotProps.row.rBtnUpdate"
              :formModel="slotProps.row"
              :fieldItem="slotProps.column.fieldItem"
              :additionalParam="{
                mainId: 1,
              }"
            />
            <span v-else>{{
              slotProps.row[aItem === "currency" ? "currencyCode" : aItem] ||
              "--"
            }}</span>
          </div>
        </template>

        <template
          v-for="(nItem, nIdx) in ['unitPrice', 'num', 'taxRate']"
          v-slot:[nItem]="{ slotProps }"
        >
          <!-- 单价、数量、税率% -->
          <div :key="`n_${nIdx}`">
            <el-input-number
              v-if="slotProps.row.rBtnUpdate"
              size="mini"
              v-model="slotProps.row[nItem]"
              v-input-number-limit="slotProps.column.decimal"
              :precision="slotProps.column.precision"
              :controls="false"
              :placeholder="slotProps.column.label"
              @change="(val) => handleMoney(slotProps.row, val, nItem)"
            />
            <span v-else>{{
              formatMoney(
                slotProps.row[nItem],
                slotProps.column.decimal,
                slotProps.column.colFormat
              )
            }}</span>
          </div>
        </template>

        <template v-slot:isIncludeTax="{ slotProps }">
          <template v-if="!slotProps.row.rBtnUpdate">
            <i
              class="el-icon-circle-check"
              v-if="slotProps.row.isIncludeTax"
            ></i>
            <span v-else>--</span>
          </template>
          <template v-else>
            <el-checkbox
              :true-label="1"
              :false-label="0"
              v-model="slotProps.row.isIncludeTax"
            />
          </template>
        </template>

        <template v-slot:remark="{ slotProps }">
          <template v-if="!slotProps.row.rBtnUpdate">
            {{ slotProps.row.remark || "--" }}
          </template>
          <template v-else>
            <el-input
              type="text"
              size="mini"
              v-model="slotProps.row.remark"
              :placeholder="slotProps.column.label"
              maxlength="200"
            />
          </template>
        </template>

        <template v-slot:billNo="{ slotProps }">
          <span
            class="primary-text-btn"
            @click="handleDetail(slotProps.row)"
            v-if="slotProps.row.billNo"
          >
            {{ slotProps.row.billNo }}
          </span>
          <span v-else>--</span>
        </template>
      </TableOperation>
      <ProfitTable
        ref="profitRef"
        :profitData="{
          orderId: formModel.customCostInfoId || formModel.id,
          businessType: additionalParams.businessType,
          orderSource: formModel.webOrderSource || undefined,
        }"
      />
    </div>
  </div>
</template>

<script>
/**
 * 结算业务类型 - 字典词: settlementBusinessType
 */
import {
  getGenerateMoneyInfo,
  getGenerateWmsMoneyInfo,
  getBillIsBussiness,
} from "@/api/warehouse/prediction";
import { billingTable } from "../model";
import { mixinHeadContent } from "./headContentMixin";
import {
  postWmsAddSettleAccounts,
  postFbaAddSettleAccounts,
  wmsFbaUpdateSettleAccounts,
  postBatchWmsAddOperate,
  postBatchFbaAddOperate,
  postBatchEcAddOperate,
  ecUpdateSettleAccounts,
  postPlatformAddAccounts,
  postPlatformUpdateAccounts,
  postPlatformBatchAccounts,
} from "@/api/settlementManage/statementManage";
export default {
  mixins: [mixinHeadContent],
  props: {
    showBtnArr: {
      type: Array,
      default: () => [20, 26, 30, 70, 40, 50, 63], //外部如果需要区分按钮列表，需要在外部自行判断后再传入，如果不传入则默认4个按钮
    },
  },
  data() {
    return {
      billingTable,
    };
  },
  methods: {},
  created() {
    const { popClearanceCheckId, orderHandleType } = this.formModel;
    if ([1, 2, 3].includes(orderHandleType)) {
      this.initWarehousingBill();
    } else {
      this.saveHttpObj.editHttp = ecUpdateSettleAccounts;
      this.additionalParams = {
        businessType: 6, // 对接头程订单
      };
      getGenerateMoneyInfo(popClearanceCheckId).then((res) => {
        this.addRowParam = res.data || {}; // 新增账单保存附带参数
      });
    }

    this.operationObj.isCopyNoRequest = false;
    this.operationObj.copyCallBack = (row) => {
      // 复制后保存
      const {
        id,
        temp_secondId,
        createBy,
        createTime,
        accountingTime,
        status,
        lockOrder,
        ...cRow
      } = row;
      this.$refs.receiptTableRef.handleSave({ ...cRow, isCopy: 1 });
    };
  },
  mounted() {},
  methods: {
    async initWarehousingBill() {
      const {
        id: orderId,
        orderHandleType,
        position,
        customerId,
        customerName,
        pageType,
      } = this.formModel;
      const params = {
        orderType: orderHandleType, // 1=第三方入库单 2=FBA订单 3 = 一件代发订单
        position, // 0-履约 1=预报
        orderId,
      };
      const addHttp = {
        1: postWmsAddSettleAccounts, //第三方入库单新增账单接口
        2: postFbaAddSettleAccounts, //FBA新增账单接口
        3: postPlatformAddAccounts, // 一件代发出库账单新增
      };
      const editHttp = {
        3: postPlatformUpdateAccounts, // 一件代发出库账单编辑
      };
      this.saveHttpObj.addHttp = addHttp[orderHandleType];
      this.saveHttpObj.editHttp =
        editHttp[orderHandleType] || wmsFbaUpdateSettleAccounts;
      this.additionalParams = {
        isBussiness: position,
        businessType: [7, 5, 4][orderHandleType - 1],
      };
      // 订单详情账单，获取接口返回值作为参数
      if ([1, 2, 3].includes(orderHandleType)) {
        if (pageType === "orderReceiving") {
          const opt = {
            businessType: this.additionalParams.businessType,
            orderId,
          };
          this.additionalParams.isBussiness = (
            await getBillIsBussiness(opt)
          ).data;
        }
        setTimeout(() => {
          // 先渲染DOM
          this.$refs[`receiptTableRef`]?.tableOpnRefresh();
        });
      }
      getGenerateWmsMoneyInfo(params).then((res) => {
        this.addRowParam = {
          ...res.data,
        };
        if (pageType === "operationReceiving" && orderHandleType === 1) {
          this.addRowParam.dealingsCompany = customerId;
          this.addRowParam.dealingsCompanyName = customerName;
        }
      });
    },
    saveAllRequest(editRows) {
      const { orderHandleType } = this.formModel;
      if ([1, 2, 3].includes(orderHandleType)) {
        const Http = {
          1: postBatchWmsAddOperate, // 第三方入库单全部保存接口
          2: postBatchFbaAddOperate, // FBA账单全部保存接口
          3: postPlatformBatchAccounts, // 一件代发账单全部保存接口
        };
        return Http[orderHandleType](editRows);
      }
      return postBatchEcAddOperate(editRows); // 头程入库
    },
    independentTableData(arr = []) {
      // console.log("this.addRowParam", this.addRowParam);
      const newArr = arr.map((e) => {
        return {
          ...e,
          ...this.addRowParam,
          dealingsCompany: e.dealingsCompany,
          dealingsCompanyName: e.dealingsCompanyName,
        };
      });
      this._tableData(newArr);
    },
    tableColumns() {
      return this.$refs.headRef?.childTableColumnConfig();
    },
  },
};
</script>

<style lang="scss" scoped>
.e-commerce-warehouse {
  .el-icon-circle-check {
    font-size: 16px;
    color: #53c88a;
  }
}
</style>
