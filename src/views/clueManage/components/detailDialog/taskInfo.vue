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
          @handleClickSkip="handleClickSkip"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        >
          <template v-slot:followRecord>
            <el-button type="text" @click="handleView">查看</el-button>
          </template>
        </ComForm>
      </template>
    </ComDialog>
    <FollowUpDialog
      ref="followUpDialogRef"
      @handleSuccess="handleSuccess"
      appendToBody
    />
    <FollowUpOrdinaryDialog
      ref="followUpOrdinaryDialogRef"
      @handleSuccess="handleSuccess"
      appendToBody
    />
    <TaskDialog
      ref="taskDialogRef"
      @handleSuccess="handleSuccess"
      appendToBody
    />
    <TaskFollowUpDialog
      ref="taskFollowUpDialogRef"
      @handleSuccess="handleSuccess"
      appendToBody
    />
    <FollowDetailDialog
      ref="followDetailDialogRef"
      @handleSuccess="handleSuccess"
      appendToBody
    />
    <MapView ref="mapViewRef" appendToBody />
  </div>
</template>
<script>
import { taskFormConfig } from "./model";
import { customMessageBox } from "@/utils/confirmBox.js";
import {
  getTaskInfo,
  exportTask,
  completeTask,
  archiveTask,
  repulseTask,
  delTask,
} from "@/api/clueManage/taskRecord.js";
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
    FollowUpOrdinaryDialog: () =>
      import("@/views/clueManage/components/FollowUpDialog/ordinary"),
    TaskDialog: () => import("@/views/clueManage/components/TaskDialog"),
    TaskFollowUpDialog: () =>
      import("@/views/clueManage/components/TaskDialog/followUp"),
    FollowDetailDialog: () =>
      import("@/views/clueManage/components/detailDialog/followInfo"),
    MapView: () => import("@/views/clueManage/components/MapView"),
  },
  data() {
    return {
      customDialogConfig: {
        title: "任务详情",
        width: "600px",
        center: true,
        appendToBody: this.appendToBody,
        footer: [],
      },
      operationList: [
        {
          text: "编辑任务",
          type: "primary",
          statusArr: [0],
          handleClick: this.handleAddTask,
          hasPermission: ["clueManage:taskRecord:edit"],
        },
        {
          text: "任务跟进",
          type: "primary",
          statusArr: [0],
          showType: [0],
          handleClick: this.handleFollowUp,
          hasPermission: ["clueManage:taskRecord:followUp"],
        },
        {
          text: "任务完成",
          type: "primary",
          statusArr: [1],
          handleClick: () => this.handleConfirm(1),
          hasPermission: ["clueManage:taskRecord:complete"],
        },
        {
          text: "取消任务",
          type: "danger",
          plain: true,
          statusArr: [0, 1],
          handleClick: this.handleCancel,
          hasPermission: ["clueManage:taskRecord:cancel"],
        },
        {
          text: "归档任务",
          type: "primary",
          statusArr: [3],
          handleClick: () => this.handleConfirm(2),
          hasPermission: ["clueManage:taskRecord:placeOnFile"],
        },
        {
          text: "打回任务",
          type: "primary",
          statusArr: [3],
          handleClick: () => this.handleConfirm(3),
          hasPermission: ["clueManage:taskRecord:repulse"],
        },
        {
          text: "删除任务",
          type: "danger",
          plain: true,
          statusArr: [0],
          handleClick: this.handleDelete,
          hasPermission: ["clueManage:taskRecord:delete"],
        },
      ],
      formConfig: {
        formModel: {},
        size: "small",
        labelWidth: "67px",
        ...taskFormConfig(),
      },
    };
  },
  methods: {
    show(formData) {
      getTaskInfo(formData.id).then((res) => {
        const { state, attendance, crmFollowId } = res.data;
        this.customDialogConfig.footer = this.operationList.filter(
          (item) =>
            item.statusArr.includes(state) &&
            (!item.showType || !attendance) && // 签到任务隐藏任务跟进
            (!item.hasPermission || hasBtnPermits(item.hasPermission))
        );
        this.formConfig = {
          formModel: res.data || {},
          size: "small",
          labelWidth: "67px",
          ...taskFormConfig(crmFollowId),
        };
        this.$refs.customDialog.show();
      });
    },
    handleAddTask() {
      const { type } = this.formConfig.formModel;
      if (type === 0) {
        this.$refs.taskDialogRef.show(this.formConfig.formModel, true);
      } else {
        this.$refs.taskFollowUpDialogRef.show(this.formConfig.formModel, true);
      }
    },
    handleFollowUp() {
      const { id, type, businessId, businessName } = this.formConfig.formModel;
      if (type) {
        this.$refs.followUpDialogRef.show(
          {
            id,
            type,
            businessName,
            businessId,
          },
          "task"
        );
      } else {
        this.$refs.followUpOrdinaryDialogRef.show({ id });
      }
    },
    handleCancel() {
      this.$refs.followUpOrdinaryDialogRef.show(
        this.formConfig.formModel,
        true
      );
    },
    handleConfirm(type) {
      let msgTxt1 = "";
      let req = "";
      const { id } = this.formConfig.formModel;
      const params = { id };
      switch (type) {
        case 1: // 任务完成
          msgTxt1 = "任务完成";
          req = completeTask;
          break;
        case 2: // 任务归档
          msgTxt1 = "任务归档";
          req = archiveTask;
          break;
        case 3: // 任务打回
          msgTxt1 = "任务打回";
          req = repulseTask;
          break;

        default:
          break;
      }
      customMessageBox(
        this,
        {
          msgTitle: "确认提示",
          msgTxt1,
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => req(params),
        },
        () => {
          this.msgSuccess(`${msgTxt1}成功`);
          this.handleSuccess();
        }
      );
    },
    handleDelete() {
      const { id } = this.formConfig.formModel;
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delTask({ id }),
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
    handleView() {
      const { id } = this.formConfig.formModel;
      this.$refs.followDetailDialogRef.show({ id });
    },
    handleClickSkip(fieldItem) {
      if (fieldItem.id === "address") {
        this.$refs.mapViewRef.show(this.formConfig.formModel);
      }
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
    .form-title {
      padding: 0;
      border-left: none;
      margin: 21px 0 10px;
    }
  }
}
</style>
