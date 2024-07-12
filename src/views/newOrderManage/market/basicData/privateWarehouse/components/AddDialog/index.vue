<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      />
    </template>
  </ComDialog>
</template>


<script>
import { addWarehouse } from "@/api/basicInfo/warehouse.js";
import { config } from "./model";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      customDialogConfig: {
        title: "FBA仓库信息",
        width: "750px",
        dataStatus: 0,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "保存并启用",
            plain: true,
            type: "primary",
            handleClick: () => {
              this.customDialogConfig.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "暂存",
            plain: true,
            type: "primary",
            handleClick: () => {
              this.customDialogConfig.dataStatus = 0;
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "100px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.lists,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const {
        platformType,
        warehouseCode,
        warehouseName,
        nationId,
        contacts,
        postCode,
        province,
        city,
        area,
        street,
        detailAddress,
        company,
        phone,
        email,
        remark,
      } = formModel;
      const params = {
        warehouseCode,
        platformType,
        dataStatus: this.customDialogConfig.dataStatus,
      };
      params.cusWarehouse = {
        warehouseName,
        nationId,
        contacts,
        postCode,
        province,
        city,
        area,
        street,
        detailAddress,
        company,
        phone,
        email,
        remark,
      };
      return addWarehouse(params);
    },
    show() {
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