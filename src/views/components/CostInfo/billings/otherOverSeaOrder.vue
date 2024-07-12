<template>
  <!-- 清关详情应收应付tab -->
  <div class="e-commerce-warehouse">
    <BillingHead
      ref="headRef"
      :bill-info-list="dataObj.billInfoList"
      :selection-rows="selectionRows"
      :head-form-data="formModel"
      :parent-event-obj="headEventObj"
      :show-btn-arr="showBtnArr"
      :headTableColumnSet="{
        tableColumns: overSeaBillingTable,
      }"
      :extraSlotSet="{
        ISPROFITSLOT: ISPROFITSLOT?ISPROFITSLOT:false,
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
        :filterOpnBtnArr="[]"
        :columnData="null"
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
          v-for="(aItem, aIdx) in ['costName', 'currency']"
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
        <template v-slot:dealingsCompanyName="{ slotProps }">
          <template v-if="!slotProps.row.rBtnUpdate">
            {{ slotProps.row.dealingsCompanyName }}
          </template>
          <template v-else>
            <AutoComplete
              :formModel="slotProps.row"
              :fieldItem="{
                id: 'dealingsCompany',
                size: 'mini',
                selectLabelKey: 'dealingsCompanyName',
                placeholder: '往来单位',
                searchParamName: 'name',
                httpRequest: (row) => getforeclose(accMain.id, row),
                defaultProp: {
                  value: 'id',
                  label: 'nameCn',
                },
              }"
              :additionalParam="{
                addCostFlag:true
              }"
              defaultKey="id"
            />
          </template>
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
          orderId: formModel.id,
          businessType: additionalParams.businessType,
          billingMain: additionalParams.billingMain,
          currencyIdConfig:formModel.currencyIdConfig,
          convertCurrencyIdConfig:formModel.convertCurrencyIdConfig,
        }"
        @getTotalList="getTotalList"
        :profitRequest="profitRequest"
      />
    </div>
    <EcCostTempDlg ref="EcCostTempDlgRef" />
  </div>
</template>

<script>
import {
  addSettleAccounts,
  getBillProfitStatementNew,
  settleAccountsOrderListNew,
} from "@/api/settlementManage/statementManage";
import { overSeaBillingTable } from "../model";
import { mixinHeadContent } from "./headContentMixin";
import { getforeclose } from "@/api/common";
export default {
  mixins: [mixinHeadContent],
  props: {
    showBtnArr: {
      type: Array,
      default: () => [20, 26, 30, 70, 40, 50, 63], //外部如果需要区分按钮列表，需要在外部自行判断后再传入，如果不传入则默认6个按钮
    },
    needCheckAccount: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      getforeclose,
      overSeaBillingTable: overSeaBillingTable(),
      profitRequest: getBillProfitStatementNew,
      accMain: {},
      billInfoTotalList: [],
    };
  },
  inject: {
    ISPROFITSLOT: {//是否使用动态币种
      from: 'ISPROFITSLOT',
      default:false
    }
  },
  methods: {
    tableColumns() {
      return this.$refs.headRef?.childTableColumnConfig();
    },
    getTotalList(row = {}) {
      //上方的币别利润折合只需要从下方的合计利润中取前两个折合币种集合，不再从接口获取了
      const { equivalentProfitList={}, filterEquivalentCURRList=[] } = row;
      this.billInfoTotalList = [];
      (filterEquivalentCURRList||[]).map((e) => {
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
      jobNo,
      businessType = 3,
      billingMain,
      orderType,
      operationMain,
      customerId,
      customerName,
    } = this.formModel;
    this.accMain = {
      id: operationMain,
    };
    if (!bailorPeopleId) {
      return;
    }
    this.additionalParams = {
      businessType, // 清关
      billingMain,
    };
    // 新增账单保存附带参数
    this.addRowParam = {
      orderNum: jobNo,
      businessType,
      dealingsCompany: customerId, // 添加属性，防止操作单带出值时无法更新
      dealingsCompanyName: customerName,
      temp_bs_key: "", // 临时属性，用于更新模板
      orderType,
      billingMain,
    };
    this.saveHttpObj.addHttp = addSettleAccounts; // 新增保存接口
    this.saveHttpObj.listHttp = settleAccountsOrderListNew; // 查询账单列表-海外其他（直清、直派）
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
