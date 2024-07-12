<template>
  <ConfirmDialog ref="confirmDialog" />
</template>

<script>
import { followUpTask, cancelTask } from "@/api/clueManage/taskRecord.js";
import { ordinaryFollowUp } from "./model.js";
export default {
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  data() {
    return {};
  },
  methods: {
    show(row, isCancel) {
      const { id } = row;
      this.$refs.confirmDialog.handleFormDialog("customConfirmModel", {
        dialogTitle: "跟进任务",
        formModel: {},
        customFormConfig: ordinaryFollowUp({
          attentmentType: "crmTask",
          customerId: id,
        }),
        httpRequest: (formData) => {
          // console.log(1111, formData);
          const { attachId, remark } = formData;
          if (remark || (attachId && attachId.length)) {
            const params = {
              id,
              attachId,
              remark,
            };
            return isCancel ? cancelTask(params) : followUpTask(params);
          } else {
            this.msgError("内容为空,请填写内容");
            return Promise.reject();
          }
        },
        successFunction: () => {
          this.$emit("handleSuccess");
        },
      });
    },
  },
};
</script>
