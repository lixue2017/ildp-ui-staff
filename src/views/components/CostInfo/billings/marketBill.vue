<template>
  <!-- 市场管理/航次信息详情账单信息tab -->
  <div class="e-commerce-warehouse">
    <BillingHead
      ref="headRef"
      :bill-info-list="dataObj.billInfoList"
      :selection-rows="selectionRows"
      :head-form-data="formModel"
      :parent-event-obj="headEventObj"
      :tab-btn-arr="headAddBtnArr"
      :show-btn-arr="formModel.orderId ? [10, 20, 31, 70, 40, 50, 63] : [63]"
      :headTableColumnSet="{
        tableColumns: marketTableCols(),
      }"
      :extraSlotSet="{
        ISPROFITSLOT: true,
      }"
    >
      <template v-slot:PROFITSLOT="{ slotProps }">
        <div v-if="billInfoTotalList.length" class="bill-item-box">
          <template v-for="(bItem, bIdx) in billInfoTotalList">
            <p class="conversion-txt1" :key="bIdx">{{ bItem.label }}：</p>
            <p class="conversion-txt2" :key="`c_${bIdx}`">
              {{ formatMoney(bItem.value, 4) }}
            </p>
          </template>
        </div>
        <div
          v-for="(bItem, bIdx) in slotProps.billInfoList"
          :key="`f_${bIdx}`"
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
      <TableOperation
        :ref="`receiptTableRef`"
        v-if="showColsHide($refs.headRef)"
        :columnOpnConf="tableColumns()"
        :tOperationObj="operationObj"
        :selectionRow="selectionRowEvt"
        :showOpnBtnFn="showBillOpnBtn"
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
              v-if="slotProps.row.rBtnUpdate && tItem !== 'type'"
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
          v-for="(aItem, aIdx) in ['dealingsCompanyName', 'currency']"
          v-slot:[aItem]="{ slotProps }"
        >
          <!-- 往来单位、费用名称、币别 -->
          <div :key="`a_${aIdx}`">
            <AutoComplete
              v-if="
                slotProps.row.rBtnUpdate &&
                (aItem !== 'dealingsCompanyName' ||
                  slotProps.row.costId ===
                    180) /*中转费可编辑,其他费用不能修改*/
              "
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

        <template v-slot:costName="{ slotProps }">
          <!-- 费用名称 -->
          {{ slotProps.row.costName || "--" }}
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
          billingMain: formModel.operateMain || undefined,
          currencyIdConfig:formModel.currencyIdConfig,
          convertCurrencyIdConfig:formModel.convertCurrencyIdConfig,
        }"
        @getTotalList="getTotalList"
      />
    </div>
  </div>
</template>

<script>
import {
  addSettleAccounts,
  getVoyageDefault,
  getVoyageCostType,
} from "@/api/settlementManage/statementManage";
import { marketTableCols } from "../model";
import { mixinHeadContent } from "./headContentMixin";

export default {
  mixins: [mixinHeadContent],
  data() {
    return {
      marketTableCols,
      headAddBtnArr: [], // 新增类型
      editIdRows: [],
      additionalParams: {
        businessType: 1, // 航次账单查询
      },
      voyageDefaultObj: {}, // 新增行的默认值
      billInfoTotalList: [],
    };
  },
  methods: {
    addVoyageBill() {
      this.headEventObj.addBill();
    },
    voyageRefreshBill() {
      this.initDataRequest();
    },
    // 新增行
    async addBill(addTypeObj) {
      const { voyageId, businessCompany, businessCompanyName } = this.formModel;
      if (!this.voyageDefaultObj.data) {
        this.voyageDefaultObj = await getVoyageDefault({ id: voyageId });
      }
      const { shipCompany, shipCompanyName, szscbcompany, szscbcompanyName } =
        this.voyageDefaultObj.data;
      const addVoyageDefault = {
        costName: addTypeObj.cnName,
        costId: addTypeObj.id,
        billingMain: businessCompany, // 记账主体
        billingMainName: businessCompanyName,
        type: 0, // 默认应付不可修改
        timeStampCognateKey: new Date().getTime() + "", // 同一类型,同时保存、删除
      };
      let addRows = [
        {
          ...this.addDefaultRow(),
          ...addVoyageDefault,
          dealingsCompany: szscbcompany,
          dealingsCompanyName: szscbcompanyName,
          ...(addTypeObj.webCopyRows ? addTypeObj.webCopyRows[0] || {} : {}),
          temp_add_id: `1_${addVoyageDefault.timeStampCognateKey}`,
        },
      ];
      if (addTypeObj.id !== 180 && addTypeObj.cnName !== "中转费") {
        addRows.push({
          ...this.addDefaultRow(),
          ...addVoyageDefault,
          dealingsCompany: shipCompany,
          dealingsCompanyName: shipCompanyName,
          ...(addTypeObj.webCopyRows ? addTypeObj.webCopyRows[1] || {} : {}),
          temp_add_id: `2_${addVoyageDefault.timeStampCognateKey}`,
        });
      }
      this.$refs[`receiptTableRef`]?.addTableOpnData(addRows);
    },
    opnVoyageRows(row, eventName) {
      // 同步操作多行
      const eAllData = this.$refs[`receiptTableRef`]?.tableDataArr;
      this.editIdRows.push(row.id || row.temp_add_id);
      const eTableDataArr = eAllData.filter(
        (e) => row.timeStampCognateKey === e.timeStampCognateKey
      );
      for (let [i, ele] of eAllData.entries()) {
        if (row.timeStampCognateKey === ele.timeStampCognateKey) {
          if (!this.editIdRows.includes(ele.id || ele.temp_add_id)) {
            this.$refs[`receiptTableRef`][eventName](ele, i);
            break;
          }
        }
      }
      // 数组长度一样再清空，防止回调有异步接口时，先清空了数据，陷入死循环
      if (this.editIdRows.length === eTableDataArr.length) {
        this.editIdRows = [];
        if (["handleSave", "handleAirlineDel"].includes(eventName)) {
          this.initDataRequest(); // 删除后刷新
        }
      }
      if (row.temp_add_id && ["handleCancel"].includes(eventName)) {
        // 新增取消时，是直接删除当前行再执行回调，无法计算当前行，所以要加1
        if (this.editIdRows.length === eTableDataArr.length + 1) {
          this.editIdRows = [];
        }
      }
    },
    handleVoyageRowSave(row) {
      return new Promise((resolve, reject) => {
        // 先全部校验，再循环保存
        const allData = this.$refs[`receiptTableRef`].tableDataArr;
        let editRows = [];
        let filArr = [];
        for (let [i, ele] of allData.entries()) {
          if (
            row.timeStampCognateKey === ele.timeStampCognateKey &&
            ele.rBtnUpdate
          ) {
            filArr.push(i);
            const isLoop = this.editSaveRules(ele, i + 1, (opt) => {
              editRows.push(opt);
            });
            if (!isLoop) break;
          }
        }
        // 有编辑行，并且全部校验通过
        if (filArr.length === editRows.length) {
          this.handleRowSave(row).then(() => {
            resolve();
          });
        }
      });
    },
    showBillOpnBtn(row = {}) {
      if (!this.formModel.orderId) {
        return false;
      }
      // 同源数据行已生成对账单、已锁单不可操作
      if (row.lockOrder || this.timeStampObj[row.timeStampCognateKey]) {
        return false;
      }
      return true;
    },
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
    getVoyageCostType().then((res) => {
      this.headAddBtnArr = res.rows || [];
    });
    // console.log('this.formModel==', this.formModel)
    const { orderId, orderNum, sono, deptId } = this.formModel;
    this.addRowParam = {
      bsId: orderId,
      bsNo: orderNum,
      orderNum: sono,
      businessType: 1,
      targetType: 0, // 业务类型 默认0
      deptId,
    };

    this.operationObj.cancelCallBack = (row) => {
      this.opnVoyageRows(row, "handleCancel");
    };

    this.operationObj.editCallBack = (row) => {
      this.resetEditSelect(row);
      this.opnVoyageRows(row, "handleEdit");
    };

    this.saveHttpObj.addHttp = addSettleAccounts; // 新增保存接口
    this.operationObj.httpSaveRequest = this.handleVoyageRowSave; // 保存事件
    this.operationObj.saveCallBack = (row) => {
      this.opnVoyageRows(row, "handleSave");
    };

    this.operationObj.isCopyNoRequest = false;
    this.operationObj.copyCallBack = (row) => {
      // 复制相同类型
      const voyageBillList = this.$refs[`receiptTableRef`]?.tableDataArr || [];
      const cRows =
        voyageBillList.filter(
          (e) => e.timeStampCognateKey === row.timeStampCognateKey
        ) || [];
      this.addBill({
        id: row.costId,
        cnName: row.costName,
        webCopyRows: cRows.map((e) => {
          const { id, temp_secondId, timeStampCognateKey, ...ele } = e;
          return ele;
        }),
      });
    };

    this.operationObj.delCallBack = (row) => {
      this.opnVoyageRows(row, "handleAirlineDel");
    };
  },
  computed: {
    timeStampObj() {
      // 一行生成对账单，与该行同源的行不可操作
      const voyageBillList = this.$refs[`receiptTableRef`]?.tableDataArr || [];
      return voyageBillList.reduce((obj, item) => {
        if (!obj[item.timeStampCognateKey]) {
          obj[item.timeStampCognateKey] = item.isGenerateStatement;
        }
        return obj;
      }, {});
    },
  },
  mounted() {},
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
