<template>
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="updateFormConfig"
        class="dialog-form"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:exportType="slotProps">
          <div class="flex">
            <span class="tag-green-color">{{
              slotProps.dicsData.nameCn || "--"
            }}</span>
            <span class="tag-blue-color">{{
              busTypeFind(slotProps.formModel.busType)
            }}</span>
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
// 报关信息(编辑)
import {
  popCusPost,
  popCusOperationOrderId,
  popCusUpdateStatus,
} from "@/api/performance/record";
import { BUS_TYPE } from "@/utils/mixin";
import { formatDate } from "@/utils/index.js";
import { trailerDialogForm } from "./model";
export default {
  data() {
    return {
      // status: 0,
      customDialogConfig: {
        width: "727px",
        title: "报关信息",
        useFooter: "footer",
      },
      footerBtnSave: [
        {
          text: "保存",
          type: "primary",
          handleClick: (row) => {
            // this.status = 0;
            this.$refs.dialogForm.submitForm();
          },
        },
      ],
      footerBtnDeclare: [
        {
          text: "保存并申报",
          type: "primary",
          handleClick: () => {
            this.status = 2;
            this.$refs.dialogForm.submitForm();
          },
        },
      ],
      footerBtnCancel: [
        {
          text: "取消",
          plain: true,
          handleClick: () => {
            this.$refs.customDialog.handleClose();
          },
        },
      ],
      updateFormConfig: {
        formModel: {},
        httpRequest: this.addOrEditTrailerInfo, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        isAttachFileId: true,
        size: "small",
        labelWidth: "90px",
        formRules: {},
      },
    };
  },
  methods: {
    addOrEditTrailerInfo(formModel) {
      // const { status } = formModel;
      let params = {
        ...formModel,
        // status: status ? status : this.status, // 区分保存 与 申报
      };
      if (params.id) {
        return popCusUpdateStatus(params);
      }
      return popCusPost(params);
    },
    handleSuccess() {
      this.$refs.customDialog.hide();
      this.$emit("handleSuccess");
    },
    async show(row = {}, isRelease, title = "报关信息") {
      // this.status = row.status;
      this.$set(this.customDialogConfig, "title", title);
      if (row.declareBtnState === 1) {
        // 操作单详情报关
        delete row.declareBtnState;
        this.$set(this.customDialogConfig, "footer", [
          ...this.footerBtnDeclare,
          ...this.footerBtnCancel,
        ]);
      } else if (row.declareBtnState === 2) {
        // 操作单详情报关
        delete row.declareBtnState;
        this.$set(this.customDialogConfig, "footer", [
          ...this.footerBtnSave,
          ...this.footerBtnCancel,
        ]);
      } else {
        this.$set(this.customDialogConfig, "footer", [
          ...this.footerBtnSave,
          // ...this.footerBtnDeclare,
          ...this.footerBtnCancel,
        ]);
      }

      this.$set(this.updateFormConfig, "lists", [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: trailerDialogForm(isRelease).columns,
                },
              ],
            },
          ],
        },
      ]);
      this.$set(
        this.updateFormConfig,
        "formRules",
        trailerDialogForm(isRelease).formRules
      );
      if (row.editDetailsId) {
        // 是否调接口获取编辑详情
        const boxOpt = {
          operationOrderId: row.toonId,
        };
        if (row.sortBoxId) {
          boxOpt.sortBoxId = row.sortBoxId;
        }
        const desData = await popCusOperationOrderId(boxOpt);
        const {
          freightType,
          exportType,
          busType,
          operationOrderNum,
          registerNo,
        } = desData.data;
        this.updateFormConfig.formModel = {
          freightType,
          exportType,
          busType,
          // busType: 1,
          operationOrderNum,
          registerNo,
          operationOrderId: row.toonId,
					status: row.status,
          sortBoxId: row.sortBoxId,
          declareTime: formatDate(new Date()), // 申报日期默认当天
        };
      } else {
        if (row.cusBId) {
          row.cusBId = Number(row.cusBId);
        }
        this.updateFormConfig.formModel = {
          ...row,
        };
      }
      this.$refs.customDialog.show();
    },
    busTypeFind(val) {
      const obj = BUS_TYPE.find((e) => e.value == val) || {};
      return obj.label || "--";
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tag-green-color {
  margin: 0 5px;
}
</style>
