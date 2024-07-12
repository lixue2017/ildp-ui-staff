<template>
  <div>
    <div class="detail-card">
      <template v-for="card in cardConfig">
        <div
          :style="`background-color: ${card.bgColor}; width: ${
            100 / cardConfig.length
          }%`"
          :key="card.prop"
        >
          <div
            :class="`iconfont ${card[initInfo.viewSource] || card.icon}`"
            :style="`color: ${card.valueColor}`"
          ></div>
          <div class="card-addr" v-if="card.type === 'slot'">
            <div class="label" :style="`color: ${card.labelColor}`">
              <TooltipOver
                :content="
                  [2].includes(initInfo.orderType)
                    ? transportType()
                    : initInfo.countryName
                "
                class="card-tooltipOver"
              />
            </div>

            <template v-if="card.prop === 'addr'">
              <div class="value" :style="`color: ${card.valueColor}`">
                <TooltipOver
                  :content="getAddrLabel()"
                  class="card-tooltipOver"
                />
              </div>
            </template>
          </div>

          <div v-else>
            <div class="label" :style="`color: ${card.labelColor}`">
              <!-- {{ card.label }} -->
              <TooltipOver
                :content="card.label"
                class="card-tooltipOver"
                refName="tooltipOver"
              />
            </div>
            <div class="value" :style="`color: ${card.valueColor}`">
              <!-- {{ initInfo[card.prop] || "--" }} -->
              <TooltipOver
                :content="initInfo[card.prop]"
                :numDecimal="card.numDecimal"
                class="card-tooltipOver"
                refName="tooltipOver"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
    <ComForm
      class="basic-info"
      ref="basicInfoForm"
      :formConfig="{
        ...basicConfig,
        formModel: initInfo,
        lists:
          initInfo.orderType === 2
            ? ecBasicConfig(initInfo)
            : [3, 4].includes(initInfo.orderType)
            ? tranditionBasicConfig(initInfo)
            : otherBasicConfig,
      }"
      v-if="initInfo.id"
    >
      <template v-slot:freightType="slotProps">
        <div class="base-flex-align">
          <span class="freight-type">{{
            slotProps.dicsData.nameCn || "--"
          }}</span>
          <span class="tag-green-color" v-if="initInfo.isMainBill === 3"
            >已拆单</span
          >
          <el-button
            v-if="
              initInfo.canSplitOrder === 1 &&
              initInfo.isMainBill === 0 &&
              !initInfo.relevanceId &&
              slotProps.formModel.freightType == 0
            "
            type="primary"
            size="mini"
            plain
            round
            v-throttle
            @click="handleSplitOrder"
            >拆客户子单</el-button
          >
        </div>
      </template>
      <template v-slot:bookingSpaceProxyName="slotProps">
        <div class="base-flex-between booking-agent">
          <TooltipOver
            :content="slotProps.formModel.bookingSpaceProxyName || '--'"
            :style="{ width: 'calc(100% - 72px)', flex: 1 }"
          />
          <el-button
            v-if="initInfo.replaceBookingAgentShow && initInfo.isMainBill !== 7"
            type="primary"
            size="mini"
            plain
            round
            v-throttle
            @click="bookingEvt"
            >更换订舱代理</el-button
          >
        </div>
      </template>
    </ComForm>

    <BookingConfirmDlg
      ref="bookingConfirmRef"
      :slotDlgFormIds="['tipsTxt', 'bookingSpaceProxy']"
    >
      <template v-slot:tipsTxt>
        <span class="grey-text-color"
          >* 头程代理类型切换，对应物流节点会变更</span
        >
      </template>
      <template v-slot:bookingSpaceProxy="slotProps">
        <AutoComplete
          ref="agentRef"
          :formModel="slotProps.formModel"
          :fieldItem="slotProps.fieldItem"
          :additionalParam="{
            ...(slotProps.formModel.isPublic == 1
              ? {
                  freightType: slotProps.formModel.freightType,
                  orderId: slotProps.formModel.orderId,
                  orderType: slotProps.formModel.orderType,
                }
              : {
                  ids: slotProps.formModel.ids,
                }),
            typeList: slotProps.formModel.isPublic == 1 ? 3 : undefined,
          }"
        />
      </template>
    </BookingConfirmDlg>
  </div>
</template>

<script>
import {
  getOperationBookingInfo,
  postOperationBookingChange,
} from "@/api/marketManage/airline.js";
import {
  cardConfig,
  ecBasicConfig,
  tranditionBasicConfig,
  otherBasicConfig,
  bookingConfirmForm,
} from "./model";
import {
  getOrderConfigList,
  getOperationOrderConfigList,
} from "@/api/order/firstTransport.js";
import { splitOrder } from "@/api/operateManage/common";
import { mapActions, mapState } from "vuex";
import { customMessageBox } from "@/utils/confirmBox.js";
export default {
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    BookingConfirmDlg: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  props: {
    initInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      cardConfig,
      ecBasicConfig,
      tranditionBasicConfig,
      otherBasicConfig,
      basicConfig: {
        formModel: {},
        httpRequest: () => {}, // 表单提交接口
        successFunction: () => {}, // 表单提交成功回调
        labelWidth: "80px",
        visibleAll: true,
      },
      resConfig: [], //动态配置节点
    };
  },
  methods: {
    async bookingEvt() {
      const { id, orderId, orderType, freightType } = this.initInfo;
      let isPublic = null;
      let ids = "";
      const { data } =
        (await this.comRepeatedRequest(this, getOperationBookingInfo, {
          id,
        })) || {};
      const { proxyType, bookingSpaceProxy, isEuropeanUnionOrBritain } =
        data || {};
      if (orderType == 2) {
        //电商操作单
        // const httpRequest = orderId
        //   ? getOrderConfigList(orderId, 1)
        //   : getOperationOrderConfigList(id);
        const configData = await getOperationOrderConfigList(id);
        this.resConfig = configData.data.map((e) => {
          if (e.value == proxyType) {
            isPublic = e.value;
            ids = e.customerIds;
          }
          if (e.value == 2 && !isEuropeanUnionOrBritain) {
            return {
              ...e,
              disabled: true,
            };
          } else {
            return e;
          }
        });
      }
      this.$refs.bookingConfirmRef?.showCustomDialog({
        customFormConfig: bookingConfirmForm({ resConfig: this.resConfig }),
        handleFormChange: (v, k) => {
          if (k === "proxyType") {
            if (v == 1) {
            }
            const { isPublic, customerIds } =
              this.resConfig.filter((e) => e.value == v)[0] || {};
            this.$refs.bookingConfirmRef?.setDlgFormModel({
              bookingSpaceProxy: "",
              ids: customerIds,
              isPublic,
            });
            this.$refs.agentRef?.changeFocusRequest();
          }
        },
        httpRequest: (fData) => {
          const { proxyType, bookingSpaceProxy } = fData;
          return postOperationBookingChange({
            id,
            proxyType,
            bookingSpaceProxy: proxyType == 1 ? undefined : bookingSpaceProxy,
            sameIndustryProxy: proxyType == 1 ? bookingSpaceProxy : undefined,
          });
        },
        formModel: {
          proxyType: this.typeConversion(proxyType, "number"),
          bookingSpaceProxy,
          orderId,
          orderType,
          freightType,
          isPublic,
          ids,
        },
        successFunction: () => {
          this.$emit("handleSuccess");
        },
      });
    },
    getAddrLabel() {
      const { initInfo: r } = this;
      if ([3, 4].includes(r.orderType)) {
        // 传统
        if (r.orderType === 4) {
          // 空运
          return `${r.startPortCode || r.startPortEnName || "--"} - ${
            r.endPortCode || r.endPortEnName || "--"
          }`;
        }
        return `${r.startPortEnName || "--"} - ${r.endPortEnName || "--"}`;
      }
      if ([2].includes(r.orderType) && r.isMainBill !== 7) {
        // 电商
        return `${r.startPortName || r.transactionWarehouseCode || "--"} - ${
          r.endPortName || r.destinationWarehouseName || r.countryName || "--"
        }`;
      }
      return `${r.startPortName || "--"} - ${r.endPortName || "--"}`;
    },
    transportType() {
      const { headTransportModeName, outWarehouseWayName } = this.initInfo;
      return `${headTransportModeName || ""}-${outWarehouseWayName || ""}`;
      // const orderBusinessType = this.initInfo.orderBusinessType == 1
      // 	? "进口"
      // 	: "出口"
      // const operationOrderType = this.initInfo.operationOrderType == 1
      // 	? "空运"
      // 	: "海运"
      // return `${operationOrderType}${orderBusinessType}`
    },
    handleSplitOrder() {
      customMessageBox(
        this,
        {
          msgTitle: "拆客户子单",
          msgTxt1: "",
          msgTxt2: "拆单之后，默认会生成1个子单，货物预报信息会同步到子单中；",
          type: "",
          customClass: "confirm-box__new",
          httpMsgRequest: () =>
            splitOrder({
              operationOrderId: this.initInfo.id,
            }),
        },
        () => {
          this.$emit("handleSplitOrderSuccess");
        }
      );
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["headTransportMode"]);
  },
};
</script>

<style lang="scss" scoped>
.detail-card {
  display: flex;
  justify-content: space-between;
  & > div {
    display: flex;
    align-items: center;
    padding: 19px 26px 19px 12px;
    margin-right: 13px;
    overflow: hidden;
    .iconfont {
      font-size: 35px;
      margin-right: 10px;
    }
    .card-tooltipOver {
      width: 100%;
    }
    .label {
      line-height: 17px;
      font-size: 12px;
      margin-bottom: 2px;
    }
    .value {
      line-height: 22px;
      font-size: 14px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  & > div:nth-of-type(1),
  & > div:nth-of-type(2) {
    padding-right: 12px;
  }
  .card-addr {
    width: calc(100% - 45px);
    font-size: 15px;
    .value {
      display: flex;
      width: 100%;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
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
}
.basic-info {
  margin-top: 12px;
  .freight-type {
    margin-right: 7px;
  }
  .booking-agent {
    padding-right: 10px;
  }
}
</style>
