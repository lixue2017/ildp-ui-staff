<template>
  <div class="card-Content">
    <div v-for="(item, index) in totalLists" :key="index" class="card-index">
      <div>
        <span>{{ item.currName }}</span>
        <span>{{ item.currCode }}</span>
      </div>
      <div class="spacing">
        <span>总额度：{{ formatMoney(item.balance || 0) }}</span>
      </div>
      <div class="money-detail spacing">
        <TooltipOver
          :content="`可用：${formatMoney(item.usableBalance || 0)}`"
        />
        <TooltipOver
          :content="`余额：${formatMoney(item.accountBalance || 0)}`"
        />
        <TooltipOver :content="`锁定：${formatMoney(item.lockBalance || 0)}`" />
        <TooltipOver
          :content="`授信额：${formatMoney(item.creditLimit || 0)}`"
        />
        <!-- <span>可用：{{ formatMoney(item.usableBalance || 0) }}</span>
        <span>余额：{{ formatMoney(item.accountBalance || 0) }}</span>
        <span>锁定：{{ formatMoney(item.lockBalance || 0) }}</span>
        <span>授信额：{{ formatMoney(item.creditLimit || 0) }}</span> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getCustomerWalletInfo } from "@/api/customerManage/customerList.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      totalLists: [],
    };
  },
  mounted() {},
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      const { customerId } = this.formData;
      getCustomerWalletInfo(customerId).then((res) => {
        this.totalLists = res.data || [];
      });
    },
  },
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card-Content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 237px));
  grid-gap: 12px;
  margin-bottom: 15px;
  .card-index {
    border-radius: 4px;
    border: 1px solid hsla(0, 0%, 73.7%, 0.5);
    background: hsla(0, 0%, 73.7%, 0.1);
    padding: 10px 13px;
    .money-detail {
      display: flex;
      flex-wrap: wrap;
      div {
        width: 50%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:nth-of-type(n + 3) {
          margin-top: 5px;
        }
        &:nth-child(1) {
          color: #3179ef;
        }
      }
    }
    .spacing{
      margin-top:10px
    }
    // div {
      // &:not(:first-child) {
      //   margin-top: 10px;
      // }
    // }
  }
}
</style>
