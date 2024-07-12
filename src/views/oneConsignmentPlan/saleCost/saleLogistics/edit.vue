<template>
  <div class="app-container">
    <ComDetailTop
      ref="detailTopRef"
      title="销售物流费价格(编辑)"
      :config="{}"
    />
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
import { mapActions } from "vuex";
import {
  getCostLogisticsInfo,
  addOrUpdSaleLogistics,
  getCostSaleLogisticsPriceCopy
} from "@/api/oneConsignmentPlan/saleCost";
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
          text: "保存并提交",
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
      this["dictionary/getDictionary"]("saleLogistics").then(() => {
        this.showForm = true;
      });
    },
    getInfo() {
      const { id, key = "", label = "",isCopy=false } = this.$route.query;
      if (id) {
        this.showPage = false;
        const getIsitHttpRequest=isCopy?getCostSaleLogisticsPriceCopy:getCostLogisticsInfo
        getIsitHttpRequest(id).then((res) => {
          const {
            weightCarry,
            fallbackEmail,
            goodsPackType,
            priceGrade,
            wmsCode,
            wmsName,
            ...data
          } = res.data;
          const fallbackWeightCarry = [];
          weightCarry && fallbackWeightCarry.push(1);
          fallbackEmail && fallbackWeightCarry.push(2);
          this.formData = {
            ...data,
            fallbackWeightCarry,
            goodsPackType: this.typeConversion(goodsPackType),
            priceGrade: this.typeConversion(priceGrade),
            wmsCode: `${wmsCode}/${wmsName}`,
          };
          this.showPage = true;
        });
      } else {
        const [wmsId, logisticsProductId, priceGrade] = key.split(",");
        const [wmsCode, logisticsProductName] = label.split(",");
        this.formData = {
          wmsId,
          logisticsProductId,
          priceGrade,
          wmsCode,
          logisticsProductName,
        };
      }
    },
    handleChangeParams(params) {
      this.$refs.tableInfoRef.getWeightSectionTempList(params);
    },
    handleSave(btn) {
      this.state = btn.state;
      this.$refs.formRef.handleSummit();
    },
    getFormData(formData) {
      const { fallbackWeightCarry, ...data } = formData;
      const itemList = this.$refs.tableInfoRef.getChargingTableList();
      const params = {
        ...data,
        state: this.state || 0,
        weightCarry: (fallbackWeightCarry || []).includes(1) ? true : false,
        fallbackEmail: (fallbackWeightCarry || []).includes(2) ? true : false,
        itemList,
      };
      addOrUpdSaleLogistics(params).then(() => {
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
  margin-bottom: 100px;
  /deep/ {
    .com-detail-top {
      margin: 0 0 15px;
      padding: 0;
    }
  }
}
</style>
