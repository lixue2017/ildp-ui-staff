<template>
  <div class="chart-wrapper">
    <TitleTop title="货物时效" />
    <div class="goods-gauge">
      <GaugeChart
        width="148px"
        height="168px"
        title="电商订单"
        :max="20"
        :value="12"
      />
      <GaugeChart
        width="148px"
        height="168px"
        title="传统订单"
        :max="31"
        :value="10"
        progressColor="#D099FB"
      />
      <GaugeChart
        width="148px"
        height="168px"
        title="其他订单"
        :max="31"
        :value="7"
        progressColor="#7EB9FD"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    TitleTop: () => import("@/views/dashboard/components/TitleTop"),
    GaugeChart: () => import("@/views/dashboard/GaugeChart"),
  },
};
</script>

<style lang="scss" scoped>
.goods-gauge {
  display: flex;
  justify-content: space-around;
  padding: 20px 0 30px;
}
</style>