<template>
  <div class="app-container" v-if="formData.id">
    <ComDetailTop
      title="销售物流费价格"
      :formModel="formData"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{ formData.code ? `(${formData.code})` : "" }}
        </span>
      </template>
    </ComDetailTop>
    <div
      v-if="getTagState()"
      class="tag-state"
      :style="{
        color: getTagState().color,
        backgroundColor: `${getTagState().color}1A`,
      }"
    >
      {{ getTagState().nameCn }}
    </div>
    <TopForm :isDetail="true" :formData="formData" />
    <TableInfo :isDetail="true" :formData="formData" />
    <div class="order-footer">
      <template v-for="(btn, index) in footerBtn">
        <el-button
          :type="btn.type"
          @click="() => btn.handleClick(formData, btn)"
          :key="index"
          v-if="
            !btn.statusShow ||
            (btn.statusShow && btn.statusShow.includes(formData.state))
          "
        >
          {{ btn.text }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { getCostLogisticsInfo } from "@/api/oneConsignmentPlan/saleCost";
import { mapActions, mapState } from "vuex";
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
          statusShow: [0],
          text: "修 改",
          handleClick: this.handleEdit,
        },
        {
          text: "关 闭",
          handleClick: this.reBack,
        },
      ],
      stateObj: {},
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("saleLogistics").then(() => {
      const { costSaleLogisticsPriceState = [] } =
        this.dictionary.dicsData || {};
      costSaleLogisticsPriceState.forEach((item) => {
        this.stateObj[item.value] = item;
      });
      this.getDetails();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getTagState() {
      const { state } = this.formData;
      return this.stateObj[state];
    },
    getDetails(newId) {
      this.formData = {};
      let id = newId;
      if (!id) {
        id = this.$route.query.id;
      }
      getCostLogisticsInfo(id).then((res) => {
        const {
          weightCarry,
          fallbackEmail,
          goodsPackType,
          priceGrade,
          createUserName,
          wmsCode,
          wmsName,
          ...data
        } = res.data;
        const fallbackWeightCarry = [];
        weightCarry && fallbackWeightCarry.push(1);
        fallbackEmail && fallbackWeightCarry.push(2);
        this.formData = {
          ...data,
          createBy: createUserName,
          fallbackWeightCarry,
          goodsPackType: this.typeConversion(goodsPackType),
          priceGrade: this.typeConversion(priceGrade),
          wmsCode: `${wmsCode}/${wmsName}`,
        };
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails(id);
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleEdit() {
      const { id } = this.formData;
      this.$router.push({
        path: "/oneConsignmentPlan/saleCost/editSaleLogistics",
        query: {
          id: id,
          backPath: this.$route.fullPath,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  margin-bottom: 100px;
  /deep/ {
    .com-detail-top {
      margin: 0 0 15px;
      padding: 0;
    }
  }
  .tag-state {
    position: absolute;
    top: 60px;
    right: 30px;
    height: 21px;
    line-height: 21px;
    border-radius: 12px;
    text-align: center;
    padding: 0 15px;
  }
}
</style>
