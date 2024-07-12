<template>
  <ComDrawer
    class="add-drawer"
    ref="myDrawer"
    :customDrawer="drawerConfig"
    :confirmClose="false"
  >
    <template v-slot:content>
      <div>
        <h5>
          {{ ["付", "收"][munType] }}款记录
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

                  <div class="time-content">
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

                    <div v-if="nItem.relatedBillNo" class="related-bill-no">
                      <!-- 水单认领 -->
                      {{ ["付", "收"][munType] }}款单号：{{
                        nItem.relatedBillNo
                      }}
                    </div>
                    <div v-if="nItem.state === 100">
                      <ComForm
                        :formConfig="{
                          formModel: nItem,
                          className: 'detail-see-form',
                          labelWidth: '90px',
                          lists: timeFormCols(),
                        }"
                      />
                    </div>
                  </div>
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
</template>

<script>
import {
  getCashierPRLog,
  putBankReceiptState,
} from "@/api/settlementManage/statementManage";
import { timeFormCols } from "./model";

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
      // basicFormConfig: {

      // },
      timeFormCols,
      payInfos: [],
      munType: 0,
      formData: {},
    };
  },
  methods: {
    timeImage(state) {
      /** 0-付款： 
					80 上传水单
					100 财务核销

				1-收款：
					65 水单认领
					100 财务核销
			*/
      if (this.munType === 0) {
        return state === 80;
      } else {
        return state === 65;
      }
    },
    handleView(row) {
      const pathObj = {
        0: "/settlementManagement/paymentReceived/taskInfo",
        1: "/settlementManagement/paymentReceived/collectionTaskInfo",
      };
      this.hide();
      this.$router.push({
        path: pathObj[this.munType],
        query: {
          id: row.id,
          backPath: this.$route.fullPath,
          type: this.munType === 0 ? undefined : "view",
        },
      });
    },
    show(id, mun_type, isWaterBillClaim, row) {
      //查询收/付款记录 0: 付款 1: 收款(收付款管理)
      this.munType = mun_type;
      this.formData = {};
      const footer = [
        {
          text: "关 闭",
          plain: true,
          handleClick: this.hide,
        },
      ];
      if (isWaterBillClaim) {
        this.formData = row;
        const { status, bankReceiptState, serialStaus } = row;
        if (
          [20, 30].includes(status) &&
          [0].includes(bankReceiptState) &&
          serialStaus >= 70
        ) {
          footer.unshift({
            text: "水单认领",
            type: "primary",
            handleClick: () => this.handleClaim(1),
            // hasPermission: ["settlementManagement:payment:waterBillClaim"],
          });
        } else if ([80, 100].includes(serialStaus)) {
          footer.unshift({
            text: "取消认领",
            type: "primary",
            handleClick: () => this.handleClaim(0),
            // hasPermission: [
            //   "settlementManagement:payment:cancelWaterBillClaim",
            // ],
          });
        }
      }
      this.drawerConfig.footer = footer;
      getCashierPRLog(id, mun_type).then((res) => {
        this.payInfos = res.data || [];
        this.$refs.myDrawer.show();
      });
    },
    hide() {
      this.$refs.myDrawer.hide();
    },
    handleClaim(bankReceiptState) {
      const { id } = this.formData;
      putBankReceiptState({
        bankReceiptState,
        id,
      }).then(() => {
        this.msgSuccess(bankReceiptState ? "水单认领成功" : "取消水单认领成功");
        this.$emit("handleClaimSuccess");
        this.hide();
      });
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
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
  .related-bill-no {
    background-color: #66a5ff1a;
    padding-left: 20px;
    line-height: 32px;
  }
}
</style>
