<template>
  <div class="app-container" v-if="showDetail && formData.id">
    <ComDetailTop
      title="ODA服务"
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
    <ComForm ref="formRef" :formConfig="formConfig" class="detail-form" />
    <TableInfo :formData="formData" />
  </div>
</template>

<script>
import { formColumns } from "./model.js";
import { getCostOdaSettingsInfo } from "@/api/oneConsignmentPlan/saleSpecialCost";
import { FullscreenLoading } from "@/utils/loading";
import { mapActions, mapState } from "vuex";
export default {
  name: "OdaSetDetail",
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    TableInfo: () => import("../components/TableInfo"),
  },
  data() {
    return {
      fullscreenLoading: new FullscreenLoading(),
      formData: {},
      formConfig: {
        formModel: {}, // 表单数据
        httpRequest: this.searchList,
        size: "small",
        labelWidth: "110px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: formColumns,
                  },
                ],
              },
            ],
          },
        ],
        formRules: {},
      },
      showDetail: false,
      stateObj: {},
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this.fullscreenLoading.show();
    this.getDictionary();
    this.getDetails();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDictionary() {
      this["dictionary/getDictionary"]("odaConfig").then(() => {
        const { costSpecialChargesRuleState = [] } =
          this.dictionary.dicsData || {};
        costSpecialChargesRuleState.forEach((item) => {
          this.stateObj[item.value] = item;
        });
        this.showDetail = true;
      });
    },
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
      getCostOdaSettingsInfo(id)
        .then((res) => {
          this.fullscreenLoading.hide();
          res.data.createBy = res.data.createUserName;
          const { costOdaAreaList, ...data } = res.data;
          this.formConfig.formModel = data;
          this.formData = res.data;
        })
        .catch(() => {
          this.fullscreenLoading.hide();
        });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails(id);
      }
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
.detail-form {
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 6px;
    }
  }
}
/deep/ {
  .el-form {
    margin-bottom: 17px;
  }
}
</style>
