<template>
  <!-- 清关详情应收应付tab -->
  <div class="e-commerce-warehouse" v-if="isInitTabRes">
    <BillingHead
      ref="headRef"
      :bill-info-list="dataObj.billInfoList"
      :selection-rows="selectionRows"
      :head-form-data="formModel"
      :parent-event-obj="headEventObj"
      :show-btn-arr="[20, 30, 70, 40, 50, 63]"
      :headTableColumnSet="{
        tableColumns: customsBillCols(),
        tabName: customerIsBs ? '2' : '1',
      }"
      :extraSlotSet="{
        ISPROFITSLOT: formModel.ISPROFITSLOT ? formModel.ISPROFITSLOT : false,
      }"
    >
      <template v-slot:PROFITSLOT="{ slotProps }">
        <div v-if="billInfoTotalList.length" class="bill-item-box">
          <template v-for="(bItem, bIdx) in billInfoTotalList">
            <p class="conversion-txt1" :key="bIdx">{{ bItem.label }}：</p>
            <p class="conversion-txt2" :key="bIdx">
              {{ formatMoney(bItem.value, 4) }}
            </p>
          </template>
        </div>
        <div
          v-for="(bItem, bIdx) in slotProps.billInfoList"
          :key="bIdx"
          class="bill-item-box"
        >
          <template>
            <p class="bill-item-txt1">{{ bItem.currency }}</p>
            <p class="bill-item-txt2">
              应收：<span>{{ formatMoney(bItem.paymentMoney, 2) }}</span>
            </p>
            <p class="bill-item-txt2">
              应付：<span>{{ formatMoney(bItem.payeeMoney, 2) }}</span>
            </p>
            <p class="bill-item-txt2">
              利润：<span>{{ formatMoney(bItem.profitMoney, 2) }}</span>
            </p>
          </template>
        </div>
      </template>
    </BillingHead>

    <div class="billing-content">
      <!-- v-if="!$refs.headRef || $refs.headRef.mixinShowTable" -->
      <TableOperation
        v-if="showColsHide($refs.headRef)"
        :ref="`receiptTableRef`"
        :columnOpnConf="tableColumns()"
        :tOperationObj="operationObj"
        :selectionRow="selectionRowEvt"
        :showOpnBtnFn="showBillOpnBtn"
        :columnData="null"
        :httpTableRequest="initDataRequest"
        :onSelectionChange="onTableSelectionChange"
      >
        <!--   -->
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
            'bsNo',
            'dealingsCompanyName',
            'costName',
            'currency',
          ]"
          v-slot:[aItem]="{ slotProps }"
        >
          <!-- 操作单号、往来单位、费用名称、币别 -->
          <div :key="`a_${aIdx}_${slotProps.row.temp_bs_key}`">
            <AutoComplete
              v-if="showSelectRequest(slotProps.row, aItem)"
              :formModel="slotProps.row"
              :fieldItem="{
                ...slotProps.column.fieldItem,
                handle: (val) => handleAuto(val, aItem, slotProps.row),
              }"
              :additionalParam="{
                mainId: 1, // 往来单位参数
                clearanceId: aItem === 'bsNo' ? formModel.id : undefined,
                addCostFlag: aItem == 'dealingsCompanyName' ? true : undefined,
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
              :max="slotProps.column.max"
              :precision="slotProps.column.precision"
              :controls="false"
              :placeholder="slotProps.column.label"
              @change="(val) => handleMoney(slotProps.row, val, nItem)"
            />
            <!-- <span v-else-if="nItem === 'unitPrice'">{{
              formatMoney(slotProps.row[nItem], slotProps.column.decimal)
            }}</span> -->
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
          orderId: formModel.id,
          businessType: additionalParams.businessType,
          billingMain: formModel.businessUnit || undefined,
          currencyIdConfig: formModel.currencyIdConfig,
          convertCurrencyIdConfig: formModel.convertCurrencyIdConfig,
        }"
        @getTotalList="getTotalList"
      />
    </div>
  </div>
</template>

<script>
import { getCustomerDetail } from "@/api/customerManage/customerList.js";
import { addSettleAccounts } from "@/api/settlementManage/statementManage";
import { customsClearanceCols } from "../model";
import { mixinHeadContent } from "./headContentMixin";

export default {
  mixins: [mixinHeadContent],
  data() {
    return {
      customerIsBs: false,
      isInitTabRes: false,
      billInfoTotalList: [],
    };
  },
  methods: {
    handleAuto(sVal, prop, row) {
      if (prop === "bsNo") {
        row.dealingsCompany = sVal.customerId;
        row.dealingsCompanyName = sVal.customerName;
        row.temp_bs_key = sVal ? `${sVal.value}` : "";
      }
    },
    showSelectRequest(row, sItem) {
      return (
        // row.rBtnUpdate && (sItem !== "dealingsCompanyName" || !row.bsId)
        row.rBtnUpdate
      ); /* 选择“工作单号”自动带出“往来单位”，不可修改 */
    },
    customsBillCols() {
      const { orderType } = this.formModel;
      return customsClearanceCols({ isBs: this.customerIsBs, orderType });
    },
    tableColumns() {
      return this.$refs.headRef?.childTableColumnConfig();
    },
    getTotalList(row = {}) {
      //上方的币别利润折合只需要从下方的合计利润中取前两个折合币种集合，不再从接口获取了
      const { equivalentProfitList = {}, filterEquivalentCURRList = [] } = row;
      this.billInfoTotalList = [];
      (filterEquivalentCURRList || []).map((e) => {
        const { code } = e;
        if (this.billInfoTotalList.length < 2) {
          this.billInfoTotalList.push({
            label: `利润折合${code}`,
            value: equivalentProfitList[`equivalentProfit${code}`],
          });
        }
      });
    },
  },
  created() {
    const {
      bailorPeopleId,
      nlCode,
      deptId,
      businessType = 3,
      joinOrderId,
      operationOrderNo,
      bailorPeopleName,
    } = this.formModel;
    if (!bailorPeopleId) {
      return;
    }
    this.additionalParams = {
      businessType, // 清关
    };
    getCustomerDetail(bailorPeopleId).then((res) => {
      const { clientIdentity = "" } = res.data?.customerInfo || {};
      // 委托人包含“堡森”身份时，多一列“操作单”栏
      this.customerIsBs = clientIdentity.includes("0");
      this.isInitTabRes = true;
    });
    // 新增账单保存附带参数
    this.addRowParam = {
      orderNum: nlCode,
      businessType,
      dealingsCompany: "", // 添加属性，防止操作单带出值时无法更新
      dealingsCompanyName: "",
      temp_bs_key: "", // 临时属性，用于更新模板
      targetType: 0, // 业务类型 默认0
      deptId,
      bsId: joinOrderId, //初始化带出操作单号和往来单位
      bsNo: operationOrderNo,
      dealingsCompany: bailorPeopleId,
      dealingsCompanyName: bailorPeopleName,
    };
    this.saveHttpObj.addHttp = addSettleAccounts; // 新增保存接口
    this.operationObj.httpSaveRequest = (params) => {
      const { temp_bs_key, bsId = "", ...opt } = params;
      return this.handleRowSave({
        ...opt,
        bsId: bsId && bsId.value ? bsId.value : bsId, // 清关详情账单选择的操作单ID，编辑没有改变时为数字ID
      });
    };
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
