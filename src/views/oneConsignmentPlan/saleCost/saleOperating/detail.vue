<template>
  <div class="app-container" v-if="formData.id">
    <ComDetailTop
      title="销售操作费价格"
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
import { getSaleOptPriceInfo } from "@/api/oneConsignmentPlan/saleCost";
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
          text: "修改",
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
    this["dictionary/getDictionary"]("saleSpecialCost").then(() => {
      const { costSaleOptPriceState = [] } = this.dictionary.dicsData || {};
      costSaleOptPriceState.forEach((item) => {
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
      getSaleOptPriceInfo(id).then((res) => {
        const {
          wmsCode,
          wmsName,
          createUserName: createBy,
          ...data
        } = res.data;
        this.formData = {
          ...data,
          createBy,
          wmsName: `${wmsCode || "--"}/${wmsName}`,
        };
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails(id);
        sessionStorage.removeItem("tabActive");
        this.tabActive = 1;
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleEdit() {
      const { id } = this.formData;
      this.$router.push({
        path: "/oneConsignmentPlan/saleCost/editSaleOperating",
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
