<template>
  <div class="cost-table">
    <div class="top">
      <div class="title" v-if="!isDetail">价格信息</div>
      <div class="tabs" v-else>
        <el-button
          size="small"
          plain
          v-for="item in tabsConfig.columns"
          :key="item.key"
          class="tabs-change"
          :type="item.key === tabsConfig.active ? 'activation' : ''"
          @click="changeTabs(item.key)"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
    <ChargingInfo
      ref="chargingInfoRef"
      :isDetail="isDetail"
      :formData="formData"
      v-if="!isDetail || tabsConfig.active === 1"
    />
    <CustomerPrice :formData="formData" v-if="tabsConfig.active === 2" />
    <OperationRecord v-if="tabsConfig.active === 3" />
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ChargingInfo: () => import("../ChargingInfo"),
    CustomerPrice: () =>
      import("@/views/oneConsignmentPlan/components/CustomerPrice"),
    OperationRecord: () =>
      import("@/views/oneConsignmentPlan/components/OperationRecord"),
  },
  data() {
    return {
      tabsConfig: {
        active: 1,
        columns: [
          {
            label: "计费信息",
            key: 1,
          },
          {
            label: "客户价格",
            key: 2,
          },
          {
            label: "操作记录",
            key: 3,
          },
        ],
      },
    };
  },
  methods: {
    changeTabs(key) {
      this.tabsConfig.active = key;
    },
    getWeightSectionTempList(params) {
      this.$refs.chargingInfoRef.getWeightSectionTempList(params);
    },
    getChargingTableList() {
      return this.$refs.chargingInfoRef.getTableList();
    },
  },
};
</script>

<style lang="scss" scoped>
.cost-table {
  border-top: 1px solid #e2e2e2;
}
.top {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .btn {
    padding: 24px 0 15px;
  }
  .tabs {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    border-bottom: none;
  }
}
</style>