<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        >
          <template v-slot:remark="slotProps">
            <div v-if="slotProps.formModel.remark">
              <el-tooltip class="item" effect="light" placement="top">
                <template v-slot:content>
                  <div v-html="slotProps.formModel.remark"></div>
                </template>
                <span class="text-theme-color cursorPointer">查看</span>
              </el-tooltip>
            </div>
            <span v-else>--</span>
          </template>
        </ComForm>
      </template>
    </ComDialog>
    <FollowUpDialog
      ref="followUpDialogRef"
      @handleSuccess="handleSuccess"
      appendToBody
    />
  </div>
</template>
<script>
import { followFormColumns } from "./model";
import { customMessageBox } from "@/utils/confirmBox.js";
import { getFollowInfo, delFollow } from "@/api/clueManage/followUpRecords.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
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
    FollowUpDialog: () =>
      import("@/views/clueManage/components/FollowUpDialog"),
  },
  data() {
    return {
      customDialogConfig: {
        title: "跟进详情",
        width: "600px",
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "编辑跟进",
            type: "primary",
            hasPermission: ["clueManage:followUpRecords:edit"],
            handleClick: () => {
              this.$refs.followUpDialogRef.show(this.formConfig.formModel);
            },
          },
          {
            text: "删除跟进",
            type: "danger",
            plain: true,
            hideBusinessType: [2],
            hasPermission: ["clueManage:followUpRecords:delete"],
            handleClick: this.handleDelete,
          },
        ],
      },
      formConfig: {
        formModel: {},
        size: "small",
        labelWidth: "100px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: followFormColumns,
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
  methods: {
    handleBtn(btnList) {
      return btnList.filter(
        (btn) => !btn.hasPermission || hasBtnPermits(btn.hasPermission)
      );
    },
    show(formData) {
      getFollowInfo(formData.id).then((res) => {
        this.formConfig.formModel = res.data;
        const { businessType } = formData;
        const { footer } = this.customDialogConfig;
        this.customDialogConfig.footer = footer.filter(
          (btn) =>
            (!btn.hideBusinessType ||
              !btn.hideBusinessType.includes(businessType)) &&
            (!btn.hasPermission || hasBtnPermits(btn.hasPermission))
        );
        this.$refs.customDialog.show();
      });
    },
    handleDelete() {
      const { id } = this.formConfig.formModel;
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delFollow({ id }),
        },
        () => {
          this.msgSuccess("删除成功");
          this.handleSuccess();
        }
      );
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
/deep/ {
  .el-dialog--center .el-dialog__body {
    padding: 13px 50px 23px;
  }
}
.form-class {
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 6px;
    }
  }
}
</style>
