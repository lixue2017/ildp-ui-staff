<template>
  <div class="top-form">
    <ComForm ref="formRef" :formConfig="formConfig" />
  </div>
</template>
<script>
import { formColumns, bookingColumns } from "./model";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    isBooking: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formConfig: {
        formModel: this.formData || {},
        size: "small",
        labelWidth: "113px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: !this.isBooking ? formColumns : bookingColumns,
                  },
                ],
              },
            ],
          },
        ],
        formRules: {},
      },
    };
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .el-form-item--small.el-form-item {
    margin-bottom: 6px;
  }
}
.top-form {
  padding-bottom: 7px;
  border-bottom: 1px solid #e2e2e2;
}
</style>
