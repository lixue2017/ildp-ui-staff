<template>
  <div class="cost-table">
    <div class="top">
      <div class="tabs">
        <template v-for="item in tabsConfig.columns">
          <el-button
            size="small"
            :key="item.key"
            class="tabs-change"
            :type="item.key === tabsConfig.active ? 'activation' : ''"
            plain
            @click="changeTabs(item.key)"
            v-if="
              !item.showBindAllCustomer ||
              item.showBindAllCustomer.includes(bindAllCustomer)
            "
          >
            {{ item.label }}
          </el-button>
        </template>
        <div class="customer-tip" v-if="tabsConfig.active === 2">
          * 未选择客户时默认适用所有客户
        </div>
      </div>
      <div class="tabs-btn">
        <template v-for="item in tabsConfig.btnArr">
          <el-button
            size="mini"
            :key="item.key"
            :disabled="item.disabled"
            class="btn"
            type="primary"
            :class="item.className"
            :icon="item.icon"
            :round="item.round === false ? false : true"
            @click="item.handleClick(item)"
            v-if="item.showTabName === tabsConfig.active"
            >{{ item.label }}</el-button
          >
        </template>
      </div>
    </div>
    <ChargingInfo
      ref="chargingInfoRef"
      :formData="formData"
      :isDetail="isDetail"
      v-show="tabsConfig.active === 1"
    />
    <template v-if="!bindAllCustomer">
      <RelatedCustomers
        ref="relatedCustomersRef"
        :businessType="2"
        :formData="formData"
        v-show="tabsConfig.active === 2"
        @handleSelection="handleSelection"
      />
    </template>
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
    RelatedCustomers: () =>
      import("@/views/oneConsignmentPlan/components/RelatedCustomers"),
    OperationRecord: () =>
      import("@/views/oneConsignmentPlan/components/OperationRecord"),
  },
  data() {
    return {
      bindAllCustomer: this.formData.bindAllCustomer,
      tabsConfig: {
        active: 1,
        columns: [
          {
            label: "计费规则",
            key: 1,
          },
          {
            label: "关联客户",
            key: 2,
            showBindAllCustomer: [false],
          },
          ...(this.isDetail
            ? [
                {
                  label: "操作记录",
                  key: 3,
                },
              ]
            : []),
        ],
        btnArr: [
          ...(this.isDetail
            ? []
            : [
                {
                  label: "新增",
                  className: "btn-type-add",
                  icon: "el-icon-plus",
                  round: false,
                  handleClick: () => {
                    this.$refs.chargingInfoRef?.handleAdd();
                  },
                  showTabName: 1,
                },
              ]),
          {
            label: "批量移除",
            type: "delete",
            handleClick: this.handleDelete,
            showTabName: 2,
            disabled: true,
          },
          {
            label: "维护客户",
            handleClick: () => {
              this.$refs.relatedCustomersRef.drawerShow();
            },
            showTabName: 2,
          },
        ],
      },
    };
  },
  watch: {
    "formData.bindAllCustomer"(val) {
      this.bindAllCustomer = val;
      if (val && this.tabsConfig.active === 2) {
        this.tabsConfig.active = 1;
      }
    },
  },
  methods: {
    changeTabs(key) {
      this.tabsConfig.active = key;
    },
    getChargingTableList() {
      return this.$refs.chargingInfoRef.getTableList();
    },
    getRelatedCustomersTableList() {
      return this.$refs.relatedCustomersRef.getTableList();
    },
    resetCustomersTable() {
      this.$refs.relatedCustomersRef?.resetTableData();
    },
    handleSelection(row) {
      const index = this.tabsConfig.btnArr.findIndex(
        (item) => item.showTabName === 2 && item.type === "delete"
      );
      if (index < 0) return;
      if (row.length) {
        this.selectList = row.map((item) => item.id || item.customerId);
        this.tabsConfig.btnArr[index].disabled = false;
      } else {
        this.tabsConfig.btnArr[index].disabled = true;
      }
    },
    handleDelete() {
      this.$refs.relatedCustomersRef.handleDelete(this.selectList);
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
    align-items: center;
    justify-content: flex-start;
    border-bottom: none;
  }
  .tabs-btn {
    white-space: nowrap;
    padding-top: 16px;

    .btn {
      padding: 5.5px 12px;
    }
  }
  .customer-tip {
    color: #5094ff;
    margin-left: 15px;
  }
}
</style>
