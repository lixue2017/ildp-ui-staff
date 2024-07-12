<template>
  <div class="mixin-table">
    <ComTabs :tabsConfig="tabsConfig" :beforeLeave="beforeLeave">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane
          :label="tab.label"
          :name="tab.name"
          :key="tab.name"
          v-if="
            (formModel.isHomeDelivery || tab.name !== '2') &&
            (formModel.freightType === 1 || tab.name !== '3')
          "
        >
          <FreightInfo
            ref="freightInfo"
            :formData="{
              id: pageId,
              orderType,
            }"
            :freightType="Number(formModel.freightType)"
            v-if="tab.name == 1"
          />
          <TakeGoods
            ref="takeGoods"
            :formData="{
              id: pageId,
              orderType,
            }"
            :freightType="Number(formModel.freightType)"
            :customerId="formModel.customerId || 0"
            v-if="tab.name == 2"
          />
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <!-- <el-radio-group
          v-model="formModel.freightType"
          class="radio"
          @change="typeChange"
        >
          <el-radio key="0" label="0"> FCL整柜 </el-radio>
          <el-radio key="1" label="1"> LCL散货 </el-radio>
        </el-radio-group> -->
        <el-checkbox v-model="formModel.isHomeDelivery" class="checkbox">
          上门提货
        </el-checkbox>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDialog"> </ConfirmDialog>
  </div>
</template>

<script>
const ORDER_TYPE = "4"; //3是海运，4是空运
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    formModel: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    TakeGoods: () => import("@/views/newOrderManage/components/TakeGoods"),
    FreightInfo: () => import("@/views/newOrderManage/components/FreightInfo"),
  },
  data() {
    return {
      form: {
        type: 1,
        isPickUp: true,
      },
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        isBtnPane: true,
        handleTabsClick: this.handleTabsClick,
        tabs: [
          {
            label: "货物信息",
            name: "1",
            refName: "freightInfo",
            fn: "getFreightList",
          },
          {
            label: "提货信息",
            name: "2",
            refName: "takeGoods",
            fn: "getFreightTakeList",
          },
        ],
        rightBtn: {
          1: [
            {
              table: "新增货物",
              handleClick: this.addGoodsTable,
            },
          ],
          2: [
            {
              table: "新增提货地址",
              plain: true,
              handleClick: this.addPickingAddress,
            },
          ],
        },
      },
      pageId: this.$route.query.id,
      orderType: ORDER_TYPE,
    };
  },
  watch: {
    formModel: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (!newVal.isHomeDelivery && this.tabsConfig.activeName === "2") {
          this.tabsConfig.activeName = "1";
        }
      },
    },
  },
  created() {},
  methods: {
    // 切换tab前回调
    beforeLeave(activeName, oldActiveName) {
      const { tabs } = this.tabsConfig;
      const refNames = {
        1: tabs[0].refName,
        2: tabs[1].refName,
      };
      const isSave = this.$refs[refNames[oldActiveName]][0].judgeAllSave();
      if (!isSave && this.formModel.isHomeDelivery) {
        this.msgWarning("请先保存列表数据！");
      }
      return isSave || !this.formModel.isHomeDelivery;
    },
    handleTabsClick() {
      const { tabs, activeName: tabName } = this.tabsConfig;
      const tab = tabs.find((item) => item.name === tabName);
      if (tab.refName && this.$refs[tab.refName]) {
        this.$refs[tab.refName][0][tab.fn]();
      }
    },
    handleSaveCheck() {
      return this.beforeLeave(
        this.tabsConfig.activeName,
        this.tabsConfig.activeName
      );
    },
    // 新增货物
    addGoodsTable() {
      this.$refs.freightInfo && this.$refs.freightInfo[0]?.handleAddLine();
    },
    // 新增货物
    addPickingAddress() {
      this.$refs.takeGoods && this.$refs.takeGoods[0]?.handleAddLine();
    },
    typeChange(e) {
      console.log(e);
      //点击切换时的传参
      this.$refs.freightInfo && this.$refs.freightInfo[0]?.getFreightList();
      this.$refs.takeGoods && this.$refs.takeGoods[0]?.getFreightTakeList();
    },
    isHaveData() {
      const haveFreight = this.$refs.freightInfo[0].columnData.length > 0;
      let haveTake = true;
      if (
        this.$refs.takeGoods &&
        this.$refs.takeGoods[0]?.columnData.length === 0
      ) {
        haveTake = false;
      }
      return {
        freight: haveFreight,
        take: haveTake,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.radio {
  font-size: 13px;
  .el-radio {
    margin-right: 6px;
  }
  /deep/ .el-radio__label {
    padding-left: 0;
  }
}
.checkbox {
  font-size: 13px;
  padding: 0 35px;
  /deep/ .el-checkbox__label {
    padding-left: 0;
  }
}
.isComplete {
  i {
    font-size: 16px;
    vertical-align: middle;
    margin-top: -2px;
  }
}
</style>
