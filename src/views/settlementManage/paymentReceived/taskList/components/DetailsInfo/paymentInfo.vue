<template>
  <div class="pay-detail-box">
    <div class="bill-bg-box base-flex-align">
      <template v-for="(rItem, rIndex) in processRecords">
        <div
          class="bill-bg-content"
          :style="{
            backgroundImage: `url(${
              rIndex === 0
                ? billBg1
                : rItem.rStatus.includes(formConfig.formModel.status)
                ? billBg2
                : billBg3
            })`,
          }"
          :key="rItem.rKey"
        >
          <div class="records-label">
            <span
              class="label-tag"
              :style="{
                background: rItem.rStatus.includes(formConfig.formModel.status)
                  ? '#66A5FF'
                  : '#FF6767',
              }"
            ></span
            >{{ rItem.rLabel }}
          </div>
          <div class="records-name">
            <span class="grey-text-color">{{ rItem.rName }}</span
            >{{ formConfig.formModel[rItem.rKey] || "--" }}
          </div>
        </div>
      </template>
    </div>

    <ComForm class="left-info" ref="basicInfoForm" :formConfig="formConfig">
      <template v-slot:slotRelevance="slotProps">
        <span
          v-if="slotProps.formModel.joinTaskBillNo"
          class="primary-text-btn"
          @click="handleDetails(slotProps.formModel.joinTaskBillId)"
        >
          {{ slotProps.formModel.joinTaskBillNo }}
        </span>
        <span v-else>--</span>
      </template>
    </ComForm>
  </div>
</template>

<script>
import billBg1 from "@/assets/image/collection_payment_bg1.svg";
import billBg2 from "@/assets/image/collection_payment_bg2.svg";
import billBg3 from "@/assets/image/collection_payment_bg3.svg";

export default {
  props: {
    formConfig: {
      type: Object,
      default: () => ({}),
    },
    processRecords: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      billBg1,
      billBg2,
      billBg3,
    };
  },
  methods: {
    handleDetails(id) {
      const { type } = this.formConfig.formModel || {};
      console.log(this.formConfig);
      let path = "/settlementManagement/paymentReceived/collectionTaskInfo";
      if (type === 1) {
        path = "/settlementManagement/paymentReceived/taskInfo";
      }
      this.$router.push({
        path,
        query: {
          id,
        },
      });
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pay-detail-box {
  width: 801px;
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
