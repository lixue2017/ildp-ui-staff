<template>
  <div>
    <ComDialog ref="customDialog" :customDialog="customDialogConfig">
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        />
        <div class="tip">
          <i class="el-icon-warning-outline"></i>
          <span>是否确认领取所选择的线索？</span>
        </div>
      </template>
    </ComDialog>
  </div>
</template>
<script>
import { getSalesClaimLead } from "@/api/clueManage/salesClue.js";
export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
  },
  data() {
    return {
      customDialogConfig: {
        title: "确认提示",
        width: "385px",
        center: true,
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
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: getSalesClaimLead, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "77px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: [
                      {
                        span: 24,
                        id: "state",
                        label: "线索状态：",
                        placeholder: "请选择线索状态",
                        type: "select",
                        basicType: "crmSalesLeadsState",
                        hideList: [2],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        formRules: {
          state: [
            { required: true, message: "请选择线索状态", trigger: "change" },
          ],
        },
      },
    };
  },
  methods: {
    show(salesLeadsIds) {
      this.formConfig.formModel = { salesLeadsIds };
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.tip {
  margin-top: 10px;
  i {
    color: #f9ae8a;
    font-size: 15px;
    margin-right: 4px;
  }
  span {
    font-weight: bold;
  }
}
</style>
