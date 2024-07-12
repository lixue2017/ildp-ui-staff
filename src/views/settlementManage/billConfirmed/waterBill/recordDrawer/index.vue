<template>
  <div>
    <ComDrawer
      class="add-drawer"
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <div>
          <h5>
            <!-- 水单认领记录抽屉 -->
            认领记录
            <span class="primary-text-color">{{ payInfos.length }}</span>
          </h5>
        </div>
        <div class="form-content">
          <div class="interval" v-for="(item, idx) in payInfos" :key="idx">
            <div class="base-flex-between">
              <div>
                <span class="primary-text-btn" @click="handleView(item)">
                  {{ item.serialCode }}
                </span>

                <span class="tag-blue-color" style="marginleft: 5px">
                  {{ item.stateName || "--" }}
                </span>
              </div>
              <span>
                <span class="grey-text-color">核销金额：</span>
                <span class="money-code"
                  >{{ formatMoney(item.verificationMoney)
                  }}{{ item.coinCode }}</span
                >
              </span>
            </div>

            <el-timeline :reverse="false">
              <template v-for="(nItem, i) in item.prNodeVOList">
                <el-timeline-item :key="`n_${i}`" size="normal" color="#bcbcbc">
                  <div>
                    <div class="base-flex-between">
                      <span class="time-name">{{ nItem.name }}</span>
                      <span class="time-name">{{ nItem.optName || "--" }}</span>
                      <span class="time-name">{{ nItem.optTime || "--" }}</span>
                    </div>

                    <!-- <div class="time-content">
                    <div
                      v-if="timeImage(nItem.state)"
                      class="custom-preview-image"
                    >
                      <template v-for="(sItem, sIndex) in nItem.imgList">
                        <el-image
                          v-if="sItem"
                          :src="sItem"
                          :key="`s_${sIndex}`"
                          :preview-src-list="nItem.imgList"
                        >
                        </el-image>
                      </template>
                    </div>

                    <div v-if="nItem.state === 4">
                      <ComForm :formConfig="basicFormConfig" />
                    </div>
                  </div> -->
                    <TooltipOver
                      v-if="nItem.remark"
                      :textLineClamp="2"
                      :content="`备注信息：${nItem.remark}`"
                      class="grey-tip-color line-remark"
                    />
                  </div>
                </el-timeline-item>
              </template>
            </el-timeline>
          </div>
        </div>
      </template>
    </ComDrawer>
    <ClaimDialog ref="claimDialog" />
  </div>
</template>

<script>
// import { getCashierPRLog } from "@/api/settlementManage/statementManage";
import { timeFormCols } from "./model";
import { getReceiptPRLog } from "@/api/settlementManage/paymentReceived.js";
export default {
  props: {},
  data() {
    return {
      drawerConfig: {
        title: "slot",
        width: "600px",
        size: "small",
        showClose: false,
        footer: [
          {
            text: "关 闭",
            plain: true,
            handleClick: this.hide,
          },
        ],
      },
      basicFormConfig: {
        formModel: {},
        className: "detail-see-form",
        labelWidth: "90px",
        lists: timeFormCols(),
      },
      payInfos: [],
      // munType: 0,
    };
  },
  methods: {
    // timeImage(state) {
    //   if (this.munType === 0) {
    //     return state === 3;
    //   } else {
    //     return state === 1;
    //   }
    // },
    handleView(row) {
      this.$refs?.claimDialog.show(row, "", "view");
    },
    show(row) {
      // 0: 付款 1: 收款
      const { type, id } = row;
      getReceiptPRLog(id, 1).then((res) => {
        this.payInfos = res.data || [];
        this.$refs.myDrawer.show();
      });
    },
    hide() {
      this.$refs.myDrawer.hide();
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ClaimDialog: () =>
      import(
        "@/views/settlementManage/paymentReceived/waterBill/components/ClaimDialog"
      ),
  },
};
</script>

<style lang="scss" scoped>
.add-drawer {
  /deep/ {
    .el-drawer__header {
      display: none;
    }
    .el-timeline {
      padding: 25px 0 0 12px;
      .el-timeline-item__tail {
        border-left: 1px #bcbcbc dashed;
      }
      .el-timeline-item__node--normal {
        left: 0px;
        width: 9px;
        height: 9px;
      }
    }
    .form-class {
      background-color: #66a5ff1a;
      padding: 10px 0;
    }
  }
  .interval {
    margin-bottom: 20px;
    .money-code {
      font-weight: 600;
    }
  }
  .time-name {
    flex: 1;
    &:last-child {
      text-align: right;
    }
  }
  .time-content {
    margin-top: 10px;
    .custom-preview-image {
      margin-bottom: 0;
    }
  }
  .line-remark {
    margin-right: 30px;
  }
}
</style>
