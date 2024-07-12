<template>
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    class="airline-dialog"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import { mapState } from "vuex";
import { config } from "./model.js";
import { editDetain } from "@/api/operateRecord/DOCManage.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  // props: {
  //   appendToBody: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      customDialogConfig: {
        title: "放 货",
        width: "500px",
        dataStatus: 0,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "确 认",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
        type: "",
      },
      formConfig: {
        formModel: {},
        httpRequest: this.editDetain, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "120px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    hide() {
      this.$refs.customDialog.hide();
    },
    show(row,type) {
      this.formConfig.formModel = {
        id:row.id,
        operationOrderId:row.operationOrderId
      };
      this.$refs.customDialog.show();
    },
    editDetain(form) {
      const params = {
        remark: form.remark,
        id: form.id,
        status: "1",
        state: form.state,
        remark: form.remark,
        operationOrderId:form.operationOrderId
      };
      return editDetain(params);
    },
    handleSuccess(res = {}) {
      this.$emit("handleSuccess", res.data);
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
