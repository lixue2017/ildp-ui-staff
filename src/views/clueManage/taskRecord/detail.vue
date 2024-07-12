<template>
  <div class="app-container">
    <ComDetailTop
      title="任务详情"
      :formModel="formData"
      :titConfig="leftTopConfig"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    />

    <div class="detail-content base-flex" v-if="isInitRes">
      <div class="detail-left">
        <FormTop ref="formTopRef" :formData="formData" />
      </div>

      <div>
        <TaskTrajectory
          :formData="formData"
          @handleUploadSuccess="handleUploadSuccess"
          @handleSuccess="getDetails(formData.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getTaskInfo } from "@/api/clueManage/taskRecord.js";
export default {
  name: "TaskRecordDetail",
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    FormTop: () => import("./components/formTop"),
    TaskTrajectory: () =>
      import("@/views/clueManage/taskRecord/components/TaskTrajectory"),
  },
  data() {
    return {
      formData: {},
      leftTopConfig: {
        columnConfig: [
          // 标题左侧label，数据取值formModel
          {
            label: "负责人员",
            prop: "chargeUserName",
          },
          {
            label: "创建人",
            prop: "createUserName",
          },
          {
            label: "创建时间",
            prop: "createTime",
          },
        ],
      },
      isInitRes: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]([
      "crmTaskType",
      "crmTaskUrgent",
      "crmRemind",
      "crmRemindWay",
      "crmTaskState",
      "crmSalesLeadsState",
    ]).then(() => {
      const { id } = this.$route.query;
      this.getDetails(id);
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDetails(id) {
      this.isInitRes = false;
      getTaskInfo(id).then((res) => {
        const { data } = res;
        this.formData = {
          ...data,
          remindWays: (data.remindWays || []).join(","),
        };
        this.isInitRes = true;
      });
    },
    handleTopClick({ type, id }) {
      if (["pre", "next"].includes(type)) {
        this.getDetails(id);
      }
    },
    changeRecords() {
      this.$refs.formTopRef?.refreshDynamic();
    },
    handleUploadSuccess() {
      this.$refs.formTopRef?.refreshTable();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/ {
    .com-detail-top {
      padding: 0;
      margin: 0 0 15px;
    }
  }
  .top-detail {
    padding: 15px 20px;
    background: #f5f5f5;
    border-radius: 2px;
    border: 1px solid #e2e2e2;

    .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .label {
      font-size: 12px;
      color: #8b8b8b;
    }
    .value {
      margin-right: 30px;
    }
  }
  .detail-left {
    min-width: 900px;
    flex: 0 1 100%;
    padding: 0 10px 20px 0;
  }
}
</style>
