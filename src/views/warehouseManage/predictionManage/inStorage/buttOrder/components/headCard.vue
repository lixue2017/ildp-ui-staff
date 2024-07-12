<template>
  <!-- 对接头程详情 -->
  <div class="flex-space-between head-card-ul">
    <div
      v-for="(item, i) in cardList"
      :key="i"
      class="card-li base-flex-align"
      :style="`background-color: ${item.bgColor}; width: ${
        100 / cardList.length
      }%`"
    >
      <div
        v-if="item.icon"
        :class="`iconfont ${item.icon}`"
        :style="`color: ${item.valueColor}`"
      ></div>

      <div :style="`color: ${item.valueColor}`">
        <div class="txt-top">
          <span :style="`color: ${item.valueColor}cc`">{{
            item.labelTit
          }}</span>
        </div>
        <template>
          <div class="txt-top">
            <span :style="`color: ${item.valueColor}cc`">{{
              item.labelTop
            }}</span>
            <span>{{ formatMoney(infoData[item.topValue], item.decimal) }}</span>
          </div>
          <div>
            <span :style="`color: ${item.valueColor}cc`">{{
              item.labelBottom
            }}</span>
            <template v-if="item.bottomSlot">
              <template v-if="item.bottomProp === 'transportMode'">
                <span
                  >{{ infoData.headTransportModeName }}-{{
                    infoData.outWarehouseWayName
                  }}</span
                >
              </template>
            </template>
            <span v-else>{{
              formatMoney(infoData[item.bottomValue], item.decimal)
            }}</span>
          </div>
        </template>
      </div>
    </div>
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
          labelTop: `${this.overseaLangObj.mdg_country || "目的国"}：`,
          valueColor: "#5094FF",
          bottomSlot: true,
          topValue: "countryName",
          bottomProp: "transportMode",
        },
        {
          labelTop: `${this.overseaLangObj.gz_dh || "工作单号"}：`,
          labelBottom: `${this.overseaLangObj.nl_no || "NL单号"}：`,
          bgColor: "#FFF3EC",
          valueColor: "#FF813D",
          topValue: "operationOrderNum",
          bottomValue: "nlCode",
        },
        {
          labelTit: "合计应收/应付(RMB)",
          labelTop: "应收：",
          labelBottom: "应付：",
          bgColor: "#ECECFF",
          valueColor: "#7676FF",
          topValue: "totalReceiveRMB",
          bottomValue: "totalPayRMB",
          decimal: 2,
        },
        {
          labelTit: "合计实收/实付(RMB)",
          labelTop: "实收：",
          labelBottom: "实付：",
          bgColor: "#D2F1FF",
          valueColor: "#13B5FF",
          topValue: "totalRealityReceiveRMB",
          bottomValue: "totalRealityPayRMB",
          decimal: 2,
        },
      ],
    };
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.head-card-ul {
  margin-bottom: 12px;
  .card-li {
    // display: flex;
    padding: 19px 26px 19px 12px;
    margin-right: 24px;
    overflow: hidden;
    border-radius: 4px;
    &:last-child {
      margin-right: 0;
    }
    .iconfont {
      font-size: 35px;
      margin-right: 10px;
    }
    .txt-top {
      margin-bottom: 8px;
    }
    .tit-value {
      padding-top: 6px;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>