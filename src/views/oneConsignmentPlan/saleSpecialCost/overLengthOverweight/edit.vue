<template>
  <div class="app-container">
    <ComDetailTop ref="detailTopRef" title="超长超重(编辑)" :config="{}" />
    <template v-if="showForm && showPage">
      <TopForm
        ref="formRef"
        :formData="formData"
        @getFormData="getFormData"
        @handleChangeParams="handleChangeParams"
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
  saveOrUpdateSpecialRule,
  getSpecialRuleInfo,
  getCostSpecialChargesRuleCopy
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
      formData: {},
      footerBtn: [
        {
          text: "保存并启用",
          state: 1,
          handleClick: this.handleSave,
        },
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
      this["dictionary/getDictionary"]("odaConfig").then(() => {
        this.showForm = true;
      });
    },
    getInfo() {
      const { id, copyId } = this.$route.query;
      if (!id && !copyId) return;
      this.showPage = false;
      const req = id ? getSpecialRuleInfo : getCostSpecialChargesRuleCopy;
      req(id || copyId).then((res) => {
        const {
          fastening,
          customerNotification,
          channelSupport,
          logicalOperationType,
          ruleType,
          ...data
        } = res.data;
        const multiSelect = [];
        if (fastening) multiSelect.push(1);
        if (customerNotification) multiSelect.push(2);
        if (channelSupport) multiSelect.push(3);
        this.formData = {
          ...data,
          multiSelect,
          logicalOperationType: this.typeConversion(logicalOperationType),
          ruleType: this.typeConversion(ruleType),
        };
        this.showPage = true;
      });
    },
    handleChangeParams(params) {
      this.$refs.tableInfoRef.getWeightSectionTempList(params);
    },
    handleSave(btn) {
      this.state = btn.state;
      this.$refs.formRef.handleSummit();
    },
    getFormData(formData) {
      const { multiSelect, ...data } = formData;
      const costSpecialChargesRuleDetailList =
        this.$refs.tableInfoRef.getChargingTableList();
      const customerIds =
        this.$refs.tableInfoRef.getRelatedCustomersTableList();
      if (!costSpecialChargesRuleDetailList) return;
      const params = {
        ...data,
        fastening: (multiSelect || []).includes(1) ? 1 : 0,
        customerNotification: (multiSelect || []).includes(2) ? 1 : 0,
        channelSupport: (multiSelect || []).includes(3) ? 1 : 0,
        type: 0, // 0=超长超重规则，1=ODA偏远地区规则
        state: this.state,
        costSpecialChargesRuleDetailList,
        customerIds,
      };
      saveOrUpdateSpecialRule(params).then(() => {
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
