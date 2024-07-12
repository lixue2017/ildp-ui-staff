<template>
  <div class="pay-detail-box" :class="processRecords.length === 6 ? 'pay-detail-width-box' : ''">
    <div class="bill-bg-box base-flex-align">
      <template v-for="(rItem, rIndex) in processRecords">
        <div
          class="bill-bg-content"
          :style="{ backgroundImage: `url(${rIndex === 0 ? billBg1 : bgStatus(rItem) ? billBg2 : billBg3})` }"
          :key="rItem.rKey"
        >
          <div class="records-label">
            <span
              class="label-tag"
              :style="{ background: bgStatus(rItem) ? '#66A5FF' : '#FF6767' }"
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

    <ComForm class="detail-see-form" :formConfig="formConfig">
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
			billBg3
		};
  },
  methods: {
		bgStatus(rItem) {
			const { taskStatus } = this.formConfig.formModel;
			return rItem.rStatus ? rItem.rStatus.includes(taskStatus) : this.formConfig.formModel[rItem.rKey];
		}
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pay-detail-box {
  max-width: 805px;
	&.pay-detail-width-box {
		max-width: 955px;
		// .bill-bg-box {
		// 	.bill-bg-content {
		// 		&:not(:first-child) {
		// 			margin-left: -32px;
		// 		}
		// 	}
		// }
	}
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