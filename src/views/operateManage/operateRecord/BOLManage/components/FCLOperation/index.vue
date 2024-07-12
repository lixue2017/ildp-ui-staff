<template>
  <div class="table-tag">
    <div class="title">
      <div>
        {{ formConfig.title && formConfig.title }}
      </div>
      <div class="titleBtn">
        <el-button
          v-for="(item, index) in formConfig.titleBtn[formConfig.formModel.isHblOrMblStatus]"
          :key="index"
          @click="item.handleClick"
          size="small"
          round
          >{{ item.label }}</el-button
        >
      </div>
    </div>
    <div class="content">
      <ComForm :formConfig="formConfig" ref="myForm">
        <template v-slot:DCDL="slotProps">
          <div class="flex">
            {{ slotProps.formModel.DCDL }}
            <div class="green tab-form">
              <el-tag
                :style="{
                  color: `${
                    slotProps.dicsData && slotProps.dicsData.color
                      ? slotProps.dicsData.color
                      : '#35D06F'
                  }`,
                }"
                size="mini"
                :color="`${
                  slotProps.dicsData && slotProps.dicsData.color
                    ? `${slotProps.dicsData.color}1A`
                    : '#35D06F1A'
                }`"
                >{{
                  slotProps.dicsData
                    ? slotProps.dicsData.nameCn
                    : slotProps.formModel.importExportType
                }}</el-tag
              >
            </div>
          </div>
        </template>
      </ComForm>
    </div>
  </div>
</template>

<script>
import noDataImg from "@/assets/image/noData.png";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
  props: {
    formConfig: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableData: [],
      noDataImg,
      tableActive: "",
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("BLinfoTypeEn");
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  padding-left: 14px;
  padding-right: 14px;
}
.table-tag {
  font-size: 13px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .tag-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tag-top {
    justify-content: space-between;
    padding: 0 14px;
    .title {
      font-size: 14px;
    }
  }
  .content {
  }
}
</style>
