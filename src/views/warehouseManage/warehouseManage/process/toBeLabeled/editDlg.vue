<template>
  <ComDialog
    ref="editDialogRef"
    :customDialog="editDialogConfig"
    :confirmClose="modeType !== 1"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        class="dialog-form"
        v-if="$refs && $refs.editDialogRef && $refs.editDialogRef.dialogVisible"
        @handleChange="handleFormChange"
      >
        <template v-slot:markStatus="slotProps">
          <div class="base-flex-align ellipsis-text">
            <TooltipOver
              :content="`${slotProps.formModel.number || '--'}`"
              refName="tooltipOver"
              :style="{ width: 'calc(100% - 80px)', flex: 1 }"
            />
            <span class="tag-blue-color">{{
              slotProps.dicsData.nameCn || "--"
            }}</span>
          </div>
        </template>

        <template
          v-for="(item, sIdx) in ['stickerCarton', 'stickerSku']"
          v-slot:[item]="slotProps"
        >
          <div class="flex" :key="sIdx">
            <span v-if="slotProps.fieldItem.disable">{{
              slotProps.formModel[item]
            }}</span>
            <el-input
              v-else
              :placeholder="slotProps.fieldItem.placeholder"
              v-model="slotProps.formModel[item]"
              v-input-limit="{
                value: 0,
                FnLimt: (val) => {
                  $refs && $refs.dialogFormRef.setFormModel({ [item]: val });
                },
              }"
            />
            <span style="width: 15px"></span>
            <el-checkbox
              :disabled="slotProps.fieldItem.disable"
              v-model="slotProps.formModel[slotProps.fieldItem.orderKey]"
              >按顺序贴</el-checkbox
            >
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { fbaFreightPost } from "@/api/warehouse/process";
import { editDlgFormCols } from "./model";
export default {
  data() {
    return {
      editDialogConfig: {},
      cancelFooter: [
        {
          text: this.overseaLangObj.qx_cancel(),
          plain: true,
          handleClick: () => {
            this.$refs.editDialogRef.handleClose();
          },
        },
      ],
      submitFooter: [
        {
          text: this.overseaLangObj.qr_confirm(),
          type: "primary",
          handleClick: () => {
            this.$refs.dialogFormRef.submitForm();
          },
        },
      ],
      editFormConfig: {
        formModel: {},
        httpRequest: this.editDlgRequest, // 表单提交接口
      },
      modeType: 0,
    };
  },
  methods: {
    editShow(
      row,
      {
        editSuccess,
        mode_type = 0, // 0: 编辑 1: 查看
      }
    ) {
      this.modeType = mode_type;
      this.editFormConfig = {
        ...this.editFormConfig,
        isAttachFileId: mode_type === 1,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us"
            ? "142px"
            : ["105px", "80px"][mode_type],
        formModel: {
          ...row,
          // attachId: "11,12"
        },
        successFunction: (res) => {
          editSuccess && editSuccess(res);
          this.msgSuccess(this.overseaLangObj.cg_tip("保存成功"));
          this.$refs.editDialogRef.hide();
        },
        afterMounted: () => {
          this.handleFormChange(row.stickerType, "stickerType");
        },
      };
      this.editDialogConfig = {
        useFooter: "footer",
        footer:
          mode_type === 1
            ? this.cancelFooter
            : [...this.submitFooter, ...this.cancelFooter],
        width: ["600px", "800px"][mode_type],
        title: this.overseaLangObj.tb_info || "贴标信息",
      };
      const dlgFormConfig = editDlgFormCols(mode_type);
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
    handleFormChange(e, type) {
      if (type === "stickerType") {
        // 更换表单模板
        const tempFormCols = editDlgFormCols(this.modeType).columns;
        let nCols = [];
        const filterKey = ["stickerSku", "stickerCarton"];
        if (e == -1) {
          nCols = tempFormCols.filter((c) => !filterKey.includes(c.id));
        } else {
          nCols = tempFormCols.filter((c) => c.id !== filterKey[e]);
        }
        this.$set(
          this.editFormConfig.lists[0].fieldList[0].rows[0],
          "cols",
          nCols
        );
        this.$refs.dialogFormRef?.$refs.myForm?.clearValidate(filterKey);
      }
    },
    editDlgRequest(formOpt) {
      const { id, stickerType, stickerCarton, stickerSku, markStatus, isSort } =
        formOpt;
      const opt = {
        id,
        stickerType,
        stickerCarton,
        stickerSku,
        markStatus,
        isSort: isSort ? 0 : 1,
      };
      return fbaFreightPost(opt);
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ComDialog: () => import("_comp/ComDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
