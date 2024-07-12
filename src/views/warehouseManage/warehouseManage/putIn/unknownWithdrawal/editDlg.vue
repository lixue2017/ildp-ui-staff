<template>
  <ComDialog
    ref="editDialogRef"
    :customDialog="editDialogConfig"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        class="dialog-form"
        v-if="$refs && $refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      >
        <template v-slot:namePhone="slotProps">
          {{ slotProps.fieldItem.isStart }}
        </template>

        <template v-slot:takeFreightNum="slotProps">
          <el-input
            :placeholder="slotProps.fieldItem.placeholder"
            v-model="slotProps.formModel.takeFreightNum"
            v-input-limit="{
              value: 0,
              FnLimt: (val) => {
                $refs &&
                  $refs.dialogFormRef.setFormModel({ takeFreightNum: val });
              },
            }"
          />
        </template>

        <template v-slot:slotWtr="slotProps">
          {{ slotProps.fieldItem.isStart }}
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { unKnownReturnPut } from "@/api/warehouse/manage";
import { editDlgFormCols } from "./model";
export default {
  data() {
    return {
      editDialogConfig: {
        useFooter: "footer",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.editDialogRef.handleClose();
            },
          },
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogFormRef.submitForm();
            },
          },
        ],
      },
      editFormConfig: {
        formModel: {},
        httpRequest: this.editDlgRequest, // 表单提交接口
        size: "small",
        labelWidth: "95px",
      },
      modeType: 0,
    };
  },
  methods: {
    editShow(row, { editSuccess, mode_type = 0 }) {
      this.modeType = mode_type;
      this.editDialogConfig = {
        ...this.editDialogConfig,
        width: ["506px", "506px"][mode_type],
        title: ["关联客户", "货物信息"][mode_type],
      };
      this.editFormConfig = {
        ...this.editFormConfig,
        formModel:
          mode_type === 0
            ? { id: row.id }
            : {
                ...row,
              },
        successFunction: (res) => {
          editSuccess && editSuccess(res);
          if (mode_type !== 1) {
            this.msgSuccess("保存成功");
          }
          this.$refs.editDialogRef.hide();
        },
      };
      const dlgFormConfig = editDlgFormCols(mode_type, (row = {}) => {
        if (mode_type === 1) {
          this.$refs.dialogFormRef?.setFormModel({
            length: row.cusProduct?.productLength,
            width: row.cusProduct?.productWidth,
            height: row.cusProduct?.productHigh,
            hsCode: row.customsCode,
            productNameCn: row.productNameCn,
          });
        }
      });
      this.editFormConfig = {
        ...this.editFormConfig,
        formRules: dlgFormConfig.formRules,
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: dlgFormConfig.columns,
                  },
                ],
              },
            ],
          },
        ],
      };
      this.$refs.editDialogRef.show();
    },
    editDlgRequest(formOpt) {
      const opt = {
        ...this.editFormConfig.formModel,
        ...formOpt,
      };
      if (this.modeType === 1) {
        return new Promise((resolve, reject) => {
          resolve(opt);
        });
      } else {
        return unKnownReturnPut(opt);
      }
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComDialog: () => import("_comp/ComDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
</style>