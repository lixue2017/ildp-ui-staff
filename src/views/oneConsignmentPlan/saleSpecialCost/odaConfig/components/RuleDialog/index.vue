<template>
  <ComDialog
    ref="customDialog"
    :confirmClose="!isDetail"
    :customDialog="customDialogConfig"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        v-if="
          $refs &&
          $refs.customDialog &&
          $refs.customDialog.dialogVisible &&
          dialogVisible
        "
      >
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { formConfig } from "./model.js";
import {
  saveOrUpdateSpecialRule,
  getSpecialRuleInfo,
  getCostSpecialChargesRuleCopy
} from "@/api/oneConsignmentPlan/saleSpecialCost";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      state: 0,
      customDialogConfig: {
        title: "ODA偏远地区规则",
        width: "850px",
      },
      footerBtn: [
        {
          text: "保存并启用",
          type: "primary",
          isDetail: false,
          handleClick: () => {
            this.state = 1;
            this.$refs.dialogForm.submitForm();
          },
        },
        {
          text: "保 存",
          type: "primary",
          isDetail: false,
          handleClick: () => {
            this.state = 0;
            this.$refs.dialogForm.submitForm();
          },
        },
        {
          text: "取 消",
          plain: true,
          isDetail: false,
          handleClick: () => {
            this.$refs.customDialog.handleClose();
          },
        },
        {
          text: "修 改",
          type: "primary",
          isDetail: true,
          showState: [0],
          handleClick: this.handleEdit,
        },
        {
          text: "关 闭",
          plain: true,
          isDetail: true,
          handleClick: this.hide,
        },
      ],
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "105px",
      },
      isDetail: false,
      dialogVisible: true,
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const { multiSelect, ...data } = formModel;
      const params = {
        ...data,
        fastening: (multiSelect || []).includes(1) ? 1 : 0,
        customerNotification: (multiSelect || []).includes(2) ? 1 : 0,
        channelSupport: (multiSelect || []).includes(3) ? 1 : 0,
        type: 1, // 0=超长超重规则，1=ODA偏远地区规则
        state: this.state,
      };
      return saveOrUpdateSpecialRule(params);
    },
    async show(row = {}, isDetail = false) {
      this.isDetail = isDetail;
      const { id,copyId } = row;
      this.formConfig = {
        ...this.formConfig,
        ...formConfig(isDetail),
      };
      let data = {};
      if (id||copyId) {
        const httpRequest=id?getSpecialRuleInfo:getCostSpecialChargesRuleCopy
        const res = await httpRequest(id||copyId);
        const { fastening, customerNotification, channelSupport, ...params } =
          res.data || {};
        const multiSelect = [];
        if (fastening) multiSelect.push(1);
        if (customerNotification) multiSelect.push(2);
        if (channelSupport) multiSelect.push(3);
        data = {
          ...params,
          multiSelect,
        };
        this.formConfig.formModel = data;
      } else {
        this.formConfig.formModel = {};
      }
      this.customDialogConfig.footer = this.footerBtn.filter(
        (btn) =>
          btn.isDetail === isDetail &&
          (!btn.showState || btn.showState.includes(data.state))
      );
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleEdit(row) {
      this.dialogVisible = false;
      this.formConfig = {
        ...this.formConfig,
        ...formConfig(),
      };
      this.customDialogConfig.footer = this.footerBtn.filter(
        (btn) => btn.isDetail === false
      );
      this.$nextTick(() => {
        this.dialogVisible = true;
      });
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
  margin-left: 5px;
  width: 70px;
}
/deep/ {
  .time-tip {
    .el-form-item__content {
      display: flex;
    }
  }
}
</style>
