<template>
  <!-- 此组件目前仅电商/传统/其他订单详情侧边栏引用 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr">
      <template v-slot:slideCard>
        <template>
          <div class="operate-status">
            <span>{{ overseaLangObj.zt_status || "状态" }}</span>
            <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
              {{ getDictObj(crmTaskState, formData.state) || formData.state }}
            </div>
          </div>

          <div class="operate-btn">
            <OperationButton
              :btnList="btnList(formData)"
              :operateDetail="formData"
              :nameArr="[]"
              @handleBtnClick="handleBtnClick"
            >
            </OperationButton>
          </div>
        </template>
        <div class="title">备注记录</div>
        <div class="task-remark-list">
          <template v-for="taskRemark in taskRemarkList">
            <div class="remark-item" :key="taskRemark.id">
              <div class="base-flex-between">
                <div>{{ taskRemark.createUserName }}</div>
                <div class="text-info-color">{{ taskRemark.createTime }}</div>
              </div>
              <div class="text-info-color">{{ taskRemark.context }}</div>
            </div>
          </template>
          <div class="align-right">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="输入备注信息"
              maxlength="300"
              v-model="remark"
            >
            </el-input>
            <el-button type="primary" size="small" @click="handleSave"
              >保存备注</el-button
            >
          </div>
        </div>
      </template>
    </OperateSidebarCard>
    <ConfirmDialog ref="confirmDialog" />
    <FollowUpDialog ref="followUpDialogRef" @handleSuccess="handleSuccess" />
    <FollowUpOrdinaryDialog
      ref="followUpOrdinaryDialogRef"
      @handleSuccess="handleSuccess"
    />
    <TaskDialog ref="taskDialogRef" @handleSuccess="handleSuccess" />
    <TaskFollowUpDialog
      ref="taskFollowUpDialogRef"
      @handleSuccess="handleSuccess"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { btnList } from "./model.js";
import { uploadFileForm } from "@/views/clueManage/components/model.js";
import { batchEditRemark } from "@/api/clueManage/common.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import {
  completeTask,
  archiveTask,
  repulseTask,
  getTaskRemarkList,
  saveTaskRemark,
} from "@/api/clueManage/taskRecord.js";

export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    OperateSidebarCard: () => import("_comp/ComOperate/components/operateCard"),
    OperationButton: () =>
      import("_comp/ComOperate/components/operateCard/operationButton.vue"), // 操作按钮
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    FollowUpDialog: () =>
      import("@/views/clueManage/components/FollowUpDialog"),
    FollowUpOrdinaryDialog: () =>
      import("@/views/clueManage/components/FollowUpDialog/ordinary"),
    TaskDialog: () => import("@/views/clueManage/components/TaskDialog"),
    TaskFollowUpDialog: () =>
      import("@/views/clueManage/components/TaskDialog/followUp"),
  },
  data() {
    return {
      btnList,
      showBarTabArr: [
        {
          isTabShow: false,
          tabKey: "OrderTrackBar",
          name: "状态",
        },
      ],
      taskRemarkList: [],
      remark: "",
    };
  },
  computed: {
    ...mapState({
      crmTaskState: (state) => state.dictionary.dicsData.crmTaskState,
    }),
  },
  created() {
    this.getTaskRemarkList();
  },
  methods: {
    getTaskRemarkList() {
      const { id } = this.formData || {};
      getTaskRemarkList(id).then((res) => {
        this.taskRemarkList = res.rows || [];
      });
    },
    handleBtnClick(row) {
      const { id } = row;
      switch (id) {
        case "uploadAttach":
          this.$refs.confirmDialog.handleFormDialog("customConfirmModel", {
            dialogTitle: "上传附件",
            formModel: {},
            customFormConfig: uploadFileForm({
              attentmentType: "crmTask",
              customerId: this.formData.id,
              addType: 3,
            }),
            httpRequest: (data) => {
              // console.log(1111, data);
              const { attachId, remark } = data;
              return batchEditRemark({
                ids: attachId.split(","),
                remark,
              });
            },
            successFunction: () => {
              this.$emit("handleUploadSuccess");
            },
          });
          break;
        case "cancelTask":
          this.handleCancel();
          break;
        case "editTask":
          this.handleAddTask();
          break;
        case "followTask":
          this.handleFollowUp();
          break;
        case "completeTask":
          this.handleConfirm(1);
          break;
        case "archiveTask":
          this.handleConfirm(2);
          break;
        case "repulseTask":
          this.handleConfirm(3);
          break;

        default:
          break;
      }
    },
    handleSuccess() {
      this.$emit("handleSuccess");
    },
    handleAddTask() {
      const { type } = this.formData;
      if (type === 0) {
        this.$refs.taskDialogRef.show(this.formData, true);
      } else {
        this.$refs.taskFollowUpDialogRef.show(this.formData, true);
      }
    },
    handleFollowUp() {
      const { id, type, businessId, businessName } = this.formData;
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
      this.$refs.followUpOrdinaryDialogRef.show(this.formData, true);
    },
    handleConfirm(type) {
      let msgTxt1 = "";
      let req = "";
      const params = { id: this.formData.id };
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
    handleSave() {
      const { id } = this.formData || {};
      saveTaskRemark({
        id,
        remark: this.remark,
      }).then(() => {
        this.remark = "";
        this.getTaskRemarkList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.operate-status {
  display: flex;
  font-size: 14px;
  height: 34px;
  line-height: 34px;
  border-radius: 4px;
  border: 1px solid #5094ff;
  margin-top: 44px;
  text-align: center;
  overflow: hidden;

  & > span:nth-child(1) {
    width: 74px;
    height: 34px;
    line-height: 34px;
    background: #5094ff;
    color: #fff;
  }
  /deep/ .el-select {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-color: transparent;
    }
  }
}
.title {
  font-size: 14px;
  font-weight: bold;
  margin: 25px 0 10px;
  color: #515151;
}

.operate-btn {
  .title {
    font-size: 14px;
    font-weight: 700;
    margin: 25px 0 10px;
    color: #515151;
  }
  .el-button {
    width: 100%;
    margin-bottom: 10px;
    color: #515151;
    border-color: transparent;
    box-shadow: 0px 0px 3px 0px rgba(203, 203, 203, 0.7);
    border-radius: 4px;
    &:hover {
      color: #5094ff;
      border-color: #5094ff;
    }
  }
  .preview-btn {
    /deep/ .el-button {
      width: 100%;
      margin-bottom: 10px;
      color: #515151;
      border-color: transparent;
      box-shadow: 0px 0px 3px 0px rgba(203, 203, 203, 0.7);
      border-radius: 4px;
      &:hover {
        background: #fff;
        color: #5094ff;
        border-color: #5094ff;
      }
    }
  }

  .operate-data {
    padding: 10px 0 30px;
    .operate-data-item:not(:last-child) {
      margin-bottom: 5px;
    }
    .label {
      color: #8b8b8b;
    }
    .label-item {
      color: #515151;
    }
  }
}
.task-remark-list {
  padding: 10px 15px 20px;
  background: #f8f8f8;
  border-radius: 2px;
  line-height: 18px;
  .remark-item {
    padding-bottom: 11px;
    border-bottom: 1px solid #e2e2e2;
    & > div:nth-child(1) {
      margin-bottom: 5px;
      & > div:nth-child(1) {
        font-weight: bold;
      }
    }
  }
  .align-right {
    text-align: right;
    margin-top: 10px;
    .el-textarea {
      margin-bottom: 10px;
    }
  }
}
</style>
