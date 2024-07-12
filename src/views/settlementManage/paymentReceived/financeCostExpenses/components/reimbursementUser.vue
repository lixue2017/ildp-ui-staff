<template>
  <div class="pay-detail-box">
    <div class="bill-bg-box base-flex-align">
      <template v-for="(rItem, rIndex) in processRecords">
        <div
          class="bill-bg-content"
          :style="{
            backgroundImage: `url(${
              rIndex === 0 ? billBg1 : rItem.auditTime ? billBg2 : billBg3
            })`,
          }"
          :key="rItem.rKey"
        >
          <div class="records-label">
            <span
              class="label-tag"
              :style="{ background: rItem.auditTime ? '#66A5FF' : '#FF6767' }"
            ></span
            >{{ rItem.statusName }}
          </div>
          <div class="records-name">
            <span class="grey-text-color" v-if="rItem.nodeName"
              >{{ rItem.nodeName }}：</span
            >{{ rItem.auditByName || "--" }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {
  getSettleTaskFlow,
  getSettleExpenseFlow,
} from "@/api/settlementManage/paymentReceived";
import billBg1 from "@/assets/image/collection_payment_bg1.svg";
import billBg2 from "@/assets/image/collection_payment_bg2.svg";
import billBg3 from "@/assets/image/collection_payment_bg3.svg";

export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    webViewSource: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      processRecords: [],
      billBg1,
      billBg2,
      billBg3,
    };
  },
  methods: {},
  components: {},
  created() {
    const req = ["receiptsDetails", "paymentDetails"].includes(
      this.webViewSource
    )
      ? getSettleTaskFlow(this.formData.taskBillId)
      : getSettleExpenseFlow(this.formData.id);
    req.then((res) => {
      (res.rows || []).forEach((e) => {
        this.processRecords.push(...e);
      });
    });
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pay-detail-box {
  min-width: 801px;
  .bill-bg-box {
    margin-bottom: 25px;
    padding-right: 30px;
    .bill-bg-content {
      width: 174px;
      height: 65px;
      padding-top: 9px;
      background-repeat: no-repeat;
      color: #515151;
      &:first-child {
        padding-left: 18px;
        width: 175px;
      }
      &:not(:first-child) {
        margin-left: -24px;
        padding-left: 36px;
      }
      .records-label {
        margin-bottom: 9px;
        font-weight: bold;
        line-height: 20px;
        font-size: 14px;
        .label-tag {
          display: inline-block;
          width: 3px;
          height: 10px;
          border-radius: 2px;
          margin-right: 5px;
        }
      }
      .records-name {
        line-height: 18px;
      }
    }
  }
}
</style>
