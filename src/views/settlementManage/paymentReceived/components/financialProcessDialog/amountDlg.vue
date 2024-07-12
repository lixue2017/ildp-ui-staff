<template>
  <!-- 弹窗右侧金额 -->
  <div class="amount-box">
    <div class="content-verification" v-if="amountData.isRemainingPayment">
      <div class="balance-description">
        剩余金额 = 待付款金额 - 核销金额 / 购汇汇率
      </div>
      <div>预计剩余付款金额</div>
      <div>
        <span>{{ amountData.currencyCode }}：</span>
        <span style="color: #ff0000">{{
          formatMoney(amountData.remainingPayment, 4)
        }}</span>
      </div>
    </div>

    <div class="content-verification">
      <div>
        <p>待核销金额</p>
        <span>{{ amountData.currencyCode }}：</span>
        <span>{{ formatMoney(amountData.surplusMoney) }}</span>
      </div>
    </div>

    <div class="content-verification">
      <span>小计金额</span>
      <div v-for="(item, index) in amountData.subtotalList" :key="`a_${index}`">
        <span>{{ item.currencyCode }}：</span>
        <span>{{ formatMoney(item.money) }}</span>
      </div>
    </div>

    <div
      class="content-verification"
      v-if="amountData.bxType !== null && amountData.bxMoney"
    >
      <span>佰信核销金额-{{ amountData.bxType == 1 ? "应收" : "应付" }}</span>
      <div>
        <span>{{ amountData.currencyCode }}：</span>
        <span>{{ formatMoney(amountData.bxMoney) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    amountData: {
      type: Object,
      default: () => ({
        amount: [],
      }),
    },
    // amountList: {
    // 	type: Array,
    // 	default: () => []
    // }
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
  components: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.amount-box {
  flex: 0 0 270px;
  padding-left: 40px;
  margin-left: 40px;
  border-left: 1px solid #e2e2e2;
}
.content-verification {
  width: 100%;
  background: rgba(80, 148, 255, 0.05);
  box-shadow: 0px 0px 3px 0px rgba(20, 69, 147, 0.25);
  border-radius: 10px;
  padding-left: 25px;
  padding-right: 5px;
  margin-bottom: 20px;
  line-height: 32px;
  .balance-description {
    line-height: 18px;
    color: #63a103;
    padding-top: 7px;
  }
}
</style>
