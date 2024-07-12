<template>
  <div class="app-container">
    <ComDetailTop
      ref="detailTopRef"
      title="销售特殊费价格(编辑)"
      :config="{}"
    />
    <template v-if="showForm && showPage">
      <TopForm
        ref="formRef"
        :formData="formData"
        @getFormData="getFormData"
        @handleChange="handleChange"
      />
      <TableInfo ref="tableInfoRef" :formData="formData" />
    </template>
    <div class="order-footer">
      <template v-for="(btn, index) in footerBtn">
        <el-button
          :type="btn.type"
          @click="() => btn.handleClick(btn)"
          :key="index"
        >
          {{ btn.text }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import {
  saveOrUpdateChargesPrice,
  getChargesPriceInfo,
  copyChargesPriceInfo,
} from "@/api/oneConsignmentPlan/saleSpecialCost";
import { mapActions } from "vuex";
export default {
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    TopForm: () => import("./components/TopForm"),
    TableInfo: () => import("./components/TableInfo"),
  },
  data() {
    return {
      formData: {
        bindAllCustomer: true,
        logisticsProductId: "",
        warehouseId: "",
      },
      footerBtn: [
        // {
        //   text: "保存并启用",
        //   state: 1,
        //   handleClick: this.handleSave,
        // },
        {
          text: "保 存",
          state: 0,
          handleClick: this.handleSave,
        },
        {
          text: "取 消",
          handleClick: this.reBack,
        },
      ],
      showForm: false,
      showPage: true,
    };
  },
  created() {
    this.getInfo();
    this.searchDictionary();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchDictionary() {
      this["dictionary/getDictionary"]("costPartitionScheme").then(() => {
        this.showForm = true;
      });
    },
    getInfo() {
      const { id, copyId } = this.$route.query;
      if (!id && !copyId) return;
      this.showPage = false;
      const req = id ? getChargesPriceInfo : copyChargesPriceInfo;
      req(id || copyId).then((res) => {
        const { logisticsProductCode, bindAllCustomer, ...data } = res.data;
        this.formData = {
          ...data,
          bindAllCustomer: !!bindAllCustomer,
          logisticsProductCode: logisticsProductCode
            ? logisticsProductCode.split(",")
            : [],
        };
        this.showPage = true;
      });
    },
    handleChange(params) {
      const { bindAllCustomer, warehouseId, logisticsProductId } = params;
      this.formData.bindAllCustomer = bindAllCustomer;
      this.formData.warehouseId = warehouseId;
      this.formData.logisticsProductId = logisticsProductId;
      this.$refs.tableInfoRef.resetCustomersTable();
    },
    handleSave(btn) {
      this.state = btn.state;
      this.$refs.formRef.handleSummit();
    },
    getFormData(formData) {
      const costSpecialChargesPriceRuleList =
        this.$refs.tableInfoRef.getChargingTableList();
      let customerIds = [];
      if (!formData.bindAllCustomer) {
        customerIds = this.$refs.tableInfoRef.getRelatedCustomersTableList();
        if (!customerIds || !customerIds.length) {
          this.$message.error("至少有一个客户！");
          return;
        }
      }
      if (!costSpecialChargesPriceRuleList) return;
      const params = {
        ...formData,
        state: this.state || 0,
        costSpecialChargesPriceRuleList,
        customerIds,
      };
      saveOrUpdateChargesPrice(params).then(() => {
        this.reBack();
      });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  /deep/ {
    .com-detail-top {
      margin: 0 0 15px;
      padding: 0;
    }
  }
}
</style>
