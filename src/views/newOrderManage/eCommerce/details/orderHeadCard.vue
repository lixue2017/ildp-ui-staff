<template>
  <!-- 订单详情 -->
  <div class="flex-space-between head-card-ul">
    <template v-for="card in cardList">
      <div
        :style="`background-color: ${card.bgColor}; width: ${
          100 / cardList.length
        }%`"
        :key="card.prop"
      >
        <div
          :class="`iconfont ${card[infoData.viewSource] || card.icon}`"
          :style="`color: ${card.valueColor}`"
        ></div>

        <div class="card-addr" v-if="card.prop === 'addr'">
          <div class="label" :style="`color: ${card.labelColor}`">
            <TooltipOver :content="getAddrTitle()" class="card-tooltipOver" />
          </div>

          <template>
            <div class="value" :style="`color: ${card.valueColor}`">
              <!-- <TooltipOver
                :content="`${
                  ([2].includes(infoData.orderType)
                    ? '深圳'
                    : infoData.portOfLoading) || '--'
                } - ${
                  ([2].includes(infoData.orderType)
                    ? infoData.country
                    : infoData.destinationPort) || '--'
                }`"
                class="card-tooltipOver"
              /> -->
              <TooltipOver :content="getAddrLabel()" class="card-tooltipOver" />
            </div>
          </template>
        </div>

        <div v-else>
          <div
            :class="[
              'label',
              card.tag && infoData.quickOrder === 1 && 'base-flex-align',
            ]"
            :style="`color: ${card.labelColor}`"
          >
            <TooltipOver
              :content="card.label"
              class="card-tooltipOver"
              refName="tooltipOver"
              :style="{ maxWidth: '180px', width: 'auto' }"
            />
            <el-tag
              color="#ff813d1A"
              :style="{ color: '#ff813d' }"
              size="mini"
              :hit="false"
              class="form-tag"
              v-if="card.tag && infoData.quickOrder === 1"
              >快速下单</el-tag
            >
          </div>
          <div class="value" :style="`color: ${card.valueColor}`">
            <TooltipOver
              :content="infoData[card.prop]"
              :numDecimal="card.numDecimal"
              class="card-tooltipOver"
              refName="tooltipOver"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    infoData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      cardList: [
        {
          bgColor: "#ECF3FF",
          icon: "yunshu1",
          airTransport: "kongyun",
          oceanShipping: "haiyun",
          prop: "addr",
          labelColor: "#80B1FF",
          valueColor: "#5094FF",
        },
        {
          bgColor: "#FFF3EC",
          icon: "yundanhao",
          label: "工作单号",
          prop: "orderNum",
          labelColor: "#FF985C",
          valueColor: "#FF813D",
          tag: true,
        },
        {
          bgColor: "#ECECFF",
          icon: "icon-zhongliang",
          label: "核实重量(KG)",
          prop: "totalBillingWeight",
          labelColor: "#B1B1FF",
          valueColor: "#7676FF",
          numDecimal: 2,
        },
        {
          bgColor: "#D2F1FF",
          icon: "icon-tiji",
          label: "核实体积(CBM)",
          prop: "totalBillingVolume",
          labelColor: "#64CFFF",
          valueColor: "#13B5FF",
          numDecimal: 2,
        },
      ],
    };
  },
  methods: {
    getAddrTitle() {
      const {
        orderType,
        countryName,
        startPort,
        headTransportModeName,
        outWarehouseWayName,
        tradeClause,
      } = this.infoData || {};
      if ([2].includes(orderType)) {
        // 电商
        // if (startPort) {
        //   return "装运港-目的港";
        // }
        return `${headTransportModeName || "--"}-${
          outWarehouseWayName || "--"
        }`;
      }
      if ([3, 4].includes(orderType)) {
        return `贸易条款：${this.getDictObj("tradeClause", tradeClause)}`;
      }
      return countryName;
    },
    getAddrLabel() {
      const {
        orderType,
        country,
        portOfLoading,
        destinationPort,
        startPortName,
        endPortName,
        transportMode,
        startCountryName,
        countryName,
        startPortEnName,
        endPortEnName,
        startPortCode,
        endPortCode,
        transactionWarehouseCode,
        destinationWarehouseName,
      } = this.infoData || {};
      if ([3, 4].includes(orderType)) {
        // 传统
        if (orderType === 4) {
          // 空运
          return `${startPortCode || startPortEnName || "--"} - ${
            endPortCode || endPortEnName || "--"
          }`;
        }
        return `${startPortEnName || "--"} - ${endPortEnName || "--"}`;
      }
      if ([2].includes(orderType)) {
        // 电商
        // if (startPortName) {
        //   return `${startPortName || ""}-${endPortName || "--"}`;
        // }
        // return `${"深圳"}-${country}`;
        const { infoData: r } = this;
        return `${startPortName || transactionWarehouseCode || "--"} - ${
          endPortName || destinationWarehouseName || countryName || "--"
        }`;
      }

      if (transportMode == 4) {
        return `${startCountryName || "--"} - ${countryName || "--"}`;
      }
      return `${portOfLoading || "--"} - ${destinationPort || "--"}`;
    },
    // transportType() {
    //   const { headTransportModeName, outWarehouseWayName } = this.infoData;
    //   return `${headTransportModeName || ""}-${outWarehouseWayName || ""}`;
    // },
  },
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.head-card-ul {
  margin-bottom: 12px;
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
  }
  .form-tag {
    height: 21px;
    line-height: 21px;
    border: none;
    border-radius: 12px;
    padding: 0 13px;
    margin-left: 5px;
  }
}
</style>
