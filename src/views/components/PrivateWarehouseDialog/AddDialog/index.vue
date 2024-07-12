<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:nationId="slotProps">
          <AutoComplete
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              className: tempRow.nationId ? 'auto-dis-search' : '',
              isDisabled: !!tempRow.nationId,
            }"
          />
        </template>
      </ComForm>
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
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      customDialogConfig: {
        title: "私人仓库地址信息",
        width: "750px",
        dataStatus: 0,
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "暂存",
            type: "primary",
            hide: this.appendToBody,
            handleClick: () => {
              this.customDialogConfig.dataStatus = 0;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "保存并启用",
            type: "primary",
            handleClick: () => {
              this.customDialogConfig.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
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
      tempRow: {},
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const {
        customerId,
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
        phone,
        email,
        remark,
      } = formModel;
      const params = {
        customerId,
        warehouseCode,
        platformType: 4,
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
        phone,
        email,
        remark,
      };
      return addWarehouse(params);
    },
    show(row) {
      this.formConfig.formModel = row || {};
      this.tempRow = row || {};
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
