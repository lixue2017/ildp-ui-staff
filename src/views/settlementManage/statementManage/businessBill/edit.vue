<template>
  <div class="app-content-container">
    <ComDetailTop
      title="业务对账单"
      class="title-sides-margin-none"
      ref="detailTopRef"
      :config="{}"
    />
    <div class="top-box">
      <div class="detail-card">
        <template v-for="card in cardConfig">
          <div
            :style="`background-color: ${card.bgColor}`"
            class="card-tags"
            :key="card.prop"
          >
            <div :style="`color: ${card.valueColor}`" class="order-no">
              <div>
                <span class="order-label">{{ card.labelArr[0] }}</span>
                <span v-if="card.valueNumArr">
                  ￥{{ formatMoney(initInfo[card.valueArr[0]]) }} ({{
                    initInfo[card.valueNumArr[0]]
                  }}票)
                </span>
                <span v-else>{{ initInfo[card.valueArr[0]] }}</span>
              </div>
              <div style="margin-top: 5px">
                <span class="order-label">{{ card.labelArr[1] }}</span>
                <span v-if="card.valueNumArr">
                  ￥{{ formatMoney(initInfo[card.valueArr[1]]) }} ({{
                    initInfo[card.valueNumArr[1]]
                  }}票)
                </span>
                <span v-else>
                  <template v-if="card.valueArr[1] === 'businessType'">{{
                    sBusinessType &&
                    sBusinessType[initInfo["businessType"]] &&
                    sBusinessType[initInfo["businessType"]].nameCn
                  }}</template>
                  <template v-else>{{ initInfo[card.valueArr[1]] }}</template>
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="btn-box">
        <el-button type="primary" size="small" plain @click="billStatistics">
          账单统计
        </el-button>
      </div>
    </div>
    <BillDetails :basicConfig="billDetailsConfig" />
    <BillStatistics ref="statisticsDialog" />
  </div>
</template>
<script>
import { getBusinessList } from "@/api/settlementManage/statementManage";
import { cardConfig } from "./editModel";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    BillDetails: () => import("../../components/BillDetails"),
    BillStatistics: () => import("./BillStatistics"),
  },
  computed: {
    ...mapState({
      sBusinessType: (state) =>
        state.dictionary.dicsData?.settlementBusinessType,
    }),
  },
  data() {
    return {
      cardConfig,
      initInfo: {},
      billDetailsConfig: {
        showCheckbox: true,
        type: "business",
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary");
  },
  mounted() {
    this.getInitDetail();
  },
  methods: {
    getInitDetail() {
      const {
        id: orderId,
        businessType,
        billingMain,
        dealingsCompany,
      } = this.$route.query;
      getBusinessList({
        orderId,
        businessType,
        billingMain,
        dealingsCompany,
      }).then((res) => {
        if (res.rows?.length) {
          this.initInfo = res.rows[0] || {};
        } else {
          this.$refs.detailTopRef?.comReBack();
        }
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
    billStatistics() {
      this.$refs.statisticsDialog.show();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 80px);
  .top-box {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 15px;
    .detail-card {
      display: flex;
      flex: 1;
      justify-content: space-between;
      & > div {
        display: flex;
        align-items: center;
        padding: 19px 26px 19px 12px;
        margin-right: 13px;
        .iconfont {
          font-size: 35px;
          margin-right: 10px;
        }
        .label {
          font-size: 12px;
          margin-bottom: 6px;
        }
        .value {
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .card-addr {
        flex: 1;
        font-size: 15px;
        .value {
          display: flex;
          width: 100%;
          justify-content: flex-start;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
        }
        .line {
          width: 21px;
          height: 1px;
          border-bottom: 1px #5094ff dashed;
          margin: 0 5px;
        }
        .order-no {
          display: flex;
          flex-direction: column;
        }
        .order-label {
          font-size: 12px;
        }
      }
      .card-tags {
        flex: 1;
      }
    }
    .basic-info {
      padding-left: 80px;
      padding-top: 5px;
      /deep/.el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
// }
</style>
