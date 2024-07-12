<template>
  <div class="app-container">
    <ComDetailTop
      ref="detailTopRef"
      title="销售操作费价格(编辑)"
      :config="{}"
    />
    <template v-if="showForm && showPage">
      <TopForm
        ref="formRef"
        :formData="formData"
        @getFormData="getFormData"
        @reNewFormData="reNewFormData"
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
import { mapActions } from "vuex";
import {
  addOrUpdSaleOptPrice,
  getSaleOptPriceInfo,
  copySaleOptPrice,
} from "@/api/oneConsignmentPlan/saleCost";
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
      this["dictionary/getDictionary"]("saleSpecialCost").then(() => {
        this.showForm = true;
      });
    },
    getInfo() {
      const { id, copyId } = this.$route.query;
      if (!id && !copyId) return;
      this.showPage = false;
      const req = id ? getSaleOptPriceInfo : copySaleOptPrice;
      req(id || copyId).then((res) => {
        const { wmsCode, wmsName, bindAllCustomer, ...data } = res.data;
        this.formData = {
          ...data,
          bindAllCustomer: !!bindAllCustomer,
          wmsName: `${wmsCode || "--"}/${wmsName}`,
        };
        this.showPage = true;
      });
    },
    handleSave(btn) {
      this.state = btn.state;
      this.$refs.formRef.handleSummit();
    },
    getFormData(formData) {
      const renewalFee = this.$refs.tableInfoRef.renewalFee;
      const itemList = this.$refs.tableInfoRef.getChargingTableList();
      let customerIdList = [];
      if (!formData.bindAllCustomer) {
        customerIdList = this.$refs.tableInfoRef.getRelatedCustomersTableList();
        if (!customerIdList || !customerIdList.length) {
          this.$message.error("至少有一个客户！");
          return;
        }
      }
      if (!itemList) return;
      const params = {
        ...formData,
        renewalFee,
        state: this.state || 0,
        itemList,
        customerIdList,
      };
      addOrUpdSaleOptPrice(params).then(() => {
        this.reBack();
      });
    },
    reNewFormData(obj) {
      this.formData = {
        ...this.formData,
        ...obj,
      };
      this.$refs.tableInfoRef.resetCustomersTable();
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
