<template>
  <div class="app-table">
    <div class="app-table-title">
      <div class="title-tab">对账单信息</div>
      <div class="title-content">
        <div v-for="(item, index) in getTitleInfo(formData.payType)" :key="index">
            <span>
              {{ item.label }}
            </span>
            <span :style="{ color: item.color ? item.color : '#515151' }"
              >{{ `${formData[item.value] || 0}${formData[item.unit] || ""}` }}
            </span>
        </div>
      </div>
    </div>
    <div>
      <ComTable
        ref="tableConfig"
        :columnConfig="tableConfig.columnConfig"
        :columnData="tableConfig.columnData"
        :pagination="false"
        :rowOperationBtnListFn="() => tableConfig.statusList"
      >
        <template v-slot:customRow="{ slotProps }"> </template>
        <template v-slot:bottomTotal>
          <div class="grand-total">
            <template v-for="(tItem, i) in tableSubtotal">
              <span :key="`t_${i}`">
                <span>{{ tItem.totalLabel }}：</span>
                <span
                  >{{ tItem.totalNum || "--"
                  }}{{ tItem.totalNum ? tItem.totalUnit : "" }}</span
                >
              </span>
            </template>
          </div>
        </template>
      </ComTable>
    </div>
  </div>
</template>

<script>
import { comTableConfig } from "./model.js";
import { accumulationFn,subtractFn } from "@/utils/instructions";
export default {
  props: {
    WEBType: {
      type: String,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    const { columnConfig } = comTableConfig({ WEBType: this.WEBType });
    return {
      tableConfig: {
        columnConfig,
        columnData: [],
      },
      titleInfo: [
        {
          label: "水单金额：",
          value: "originalMoney",
          unit: "bankReceiptCurrencyCode",
          color: "#63A103",
          showType: [0, 1],
        },
        {
          label: "剩余金额：",
          value: "surplusMoney",
          unit: "bankReceiptCurrencyCode",
          color: "#FF0000",
          showType: [1],
        },
      ],
    };
  },
  computed: {
    tableSubtotal() {
      const {
        statementInfos,
        serviceCharge,
        exchangeLoss,
        bankReceiptCurrencyCode,
        serviceChargeCurrencyCode,
        payType,
      } = this.formData;
      const waterMoney=this.getAmountSummary(statementInfos)
      return [
        {
          totalLabel: "手续费",
          totalNum: accumulationFn([serviceCharge],2),
          totalUnit: serviceChargeCurrencyCode,
          showType: [0, 1],
        },
        {
          totalLabel: "汇兑损益",
          totalNum: accumulationFn([exchangeLoss],2),
          totalUnit: bankReceiptCurrencyCode,
          showType: [1],
        },
        {
          totalLabel: "合计（水单币别）",
          totalNum: waterMoney,
          showType: [0, 1],
        },
      ].filter((e) => e.showType.includes(payType));
    },
  },
  created() {
    this.setTable();
  },
  methods: {
    setTable() {
      const { statementInfos } = this.formData;
      this.tableConfig.columnData = statementInfos;
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
    },
    getTitleInfo(type){
      return this.titleInfo.filter((e)=>e.showType.includes(type))
    },
    getAmountSummary(rows) {
      //不同币种金额汇总，最终结果为字符串
      const {payType,bankReceiptCurrencyCode}=this.formData
      let waterMoney = []
      rows.map((e) => {
        const {type}=e
        const index = waterMoney.findIndex(
          (wRow) => wRow.currencyId == e.currencyId
        );
        if (index == -1) {
          const  bankReceiptVerificationMoney=payType==type?
          this.toFixedNum(e.bankReceiptVerificationMoney,2):
          -(this.toFixedNum(e.bankReceiptVerificationMoney,2))
          waterMoney.push({
            bankReceiptVerificationMoney,
            currencyCode: e.currencyCode,
            currencyId: e.currencyId,
          });
        } else {
          if(payType==type){
            waterMoney[index].bankReceiptVerificationMoney = accumulationFn(
            [
              waterMoney[index].bankReceiptVerificationMoney,
              e.bankReceiptVerificationMoney,
            ],
            2
          );
          }else{
            waterMoney[index].bankReceiptVerificationMoney = subtractFn(
            [
              waterMoney[index].bankReceiptVerificationMoney,
              e.bankReceiptVerificationMoney,
            ],
            2
          );
          }
        }
      });
      const strWaterMoney=accumulationFn((waterMoney||[]).map((e) => e.bankReceiptVerificationMoney))+bankReceiptCurrencyCode||undefined;
      return strWaterMoney;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-table {
  .app-table-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title-tab {
      font-size: 14px;
      font-weight: bold;
      padding: 14px 0 11px;
      color: #515151;
    }
    .title-content {
      display: flex;
      div {
        &:not(:first-child) {
          margin-left: 40px;
        }
      }
    }
  }
}
</style>
