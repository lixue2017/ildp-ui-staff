<template>
  <ComForm :formConfig="formConfig" @handleClickSkip="handleClickSkip">
    <template v-slot:attachTable>
      <AttachTable
        ref="attachTableRef"
        :formData="formData"
        attentmentType="crmTask"
      />
    </template>
    <template v-slot:taskTable>
      <Dynamic ref="dynamicRef" :formData="formData" />
    </template>
  </ComForm>
</template>

<script>
import { formConfig } from "./model";
import qs from "qs";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    Dynamic: () => import("../dynamic"),
    AttachTable: () => import("@/views/clueManage/components/AttachTable"),
  },
  data() {
    return {
      formConfig: {
        formModel: this.formData,
        size: "small",
        labelWidth: "90px",
        ...formConfig,
        formRules: {},
      },
    };
  },
  methods: {
    refreshTable() {
      this.$refs.attachTableRef?.refreshTable();
    },
    refreshDynamic() {
      this.$refs.dynamicRef?.getOperationRecord();
    },
    handleClickSkip() {
      debugger;
      const { query } = this.$route;
      this.$router.push({
        path: "/clueManage/salesClueDetail",
        query: {
          id: this.formData.businessId,
          backPath: this.$route.path,
          data: encodeURI(qs.stringify(query)),
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.form-class {
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .form-title {
      padding: 0;
      border-left: none;
      margin: 21px 0 10px;
    }
    .form-rows-box {
      padding-bottom: 14px;
      border-bottom: 1px solid #e2e2e2;
      .form-title {
        margin-top: 0px;
      }
    }
  }
}
</style>
