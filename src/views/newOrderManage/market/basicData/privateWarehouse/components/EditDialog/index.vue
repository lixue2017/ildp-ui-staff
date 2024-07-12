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
import { updateWarehouse } from "@/api/basicInfo/warehouse.js";
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
            text: "确定",
            type: "primary",
            handleClick: () => {
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
      nationId: undefined,
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const {
        id,
        dataStatus,
        warehouseId,
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
        id,
        dataStatus,
        warehouseId,
      };
      params.cusWarehouse = {
        warehouseName,
        nationId: typeof nationId === "string" ? this.nationId : nationId,
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
      return updateWarehouse(params);
    },
    show(row) {
      const {
        id,
        dataStatus,
        warehouseId,
        warehouseCode,
        platformType,
        nationTwoCode,
        nationName,
        cusWarehouse: {
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
        },
      } = row;
      const nation = nationTwoCode && `${nationTwoCode}[${nationName}]`;
      this.nationId = nationId;
      this.formConfig.formModel = {
        id,
        dataStatus,
        warehouseId,
        warehouseCode,
        warehouseName,
        nationId: nationId ? nation : nationId,
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
        platformType: platformType.toString(),
      };
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