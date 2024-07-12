<template>
  <div class="app-container">
    <ComDetailTop
      title="线索详情"
      :formModel="formData"
      :titConfig="leftTopConfig"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    />

    <div class="detail-content base-flex" v-if="isInitRes">
      <div class="detail-left">
        <div class="top-detail">
          <div class="title">{{ formData.name }}</div>
          <div>
            <template v-for="item in topList">
              <span class="label" :key="item.prop">{{ item.label }}</span>
              <span class="value" :key="`value_${item.prop}`">{{
                formData[item.prop] || "--"
              }}</span>
            </template>
          </div>
        </div>
        <div class="custom-tabs-btn">
          <template v-for="tItem in btnTabsList">
            <el-button
              size="small"
              plain
              :key="tItem.key"
              @click="changeTabs(tItem.key)"
              :type="tItem.key === tabs.active ? 'activation' : ''"
              >{{ tItem.label }}</el-button
            >
          </template>
        </div>
        <template v-if="['10'].includes(tabs.active)">
          <FormTop :formData="formData" />
          <Dynamic
            ref="dynamicRef"
            :formData="formData"
            :isCommunal="formData.state === 2 || formData.communal"
            @handleFollowUp="handleFollowUp"
          />
        </template>
        <template v-if="['20'].includes(tabs.active)">
          <FollowUpDynamic
            ref="followUpDynamicRef"
            :formData="formData"
            :businessType="1"
            :isCommunal="formData.state === 2 || formData.communal"
          />
        </template>
        <template v-if="['30'].includes(tabs.active)">
          <ContactsTable
            :formData="formData"
            :isCommunal="formData.state === 2 || formData.communal"
          />
        </template>
        <template v-if="['40'].includes(tabs.active)">
          <TaskTable
            ref="taskTableRef"
            :formData="formData"
            @handleAddTask="handleAddTask"
            :isCommunal="formData.state === 2 || formData.communal"
          />
        </template>
        <template v-if="['50'].includes(tabs.active)">
          <AttachTable
            ref="attachTableRef"
            :formData="formData"
            attentmentType="crmSalesLeads"
            :isCommunal="formData.state === 2 || formData.communal"
          />
        </template>
        <template v-if="['60'].includes(tabs.active)">
          <OperationTable :formData="formData" :businessType="1" />
        </template>
      </div>

      <div>
        <SalesClueTrajectory
          :formData="formData"
          @handleAddTask="handleAddTask"
          @handleFollowUp="handleFollowUp"
          @handleEdit="handleEdit"
          @handleConvertCustomer="handleConvertCustomer"
          @handleReceiveClueSuccess="getDetails(formData.id)"
        />
      </div>
    </div>
    <FollowUpDialog ref="followUpDialogRef" @handleSuccess="changeRecords" />
    <TaskDialog ref="taskDialogRef" @handleSuccess="getDetails(formData.id)" />
    <TaskFollowUpDialog
      ref="taskFollowUpDialogRef"
      @handleSuccess="getDetails(formData.id)"
    />
    <ClueDialog ref="clueDialogRef" @handleSuccess="getDetails(formData.id)" />
    <ConvertCustomer
      ref="convertCustomerRef"
      @handleSuccess="getDetails(formData.id)"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getSalesLeadsInfo } from "@/api/clueManage/salesClue.js";
export default {
  name: "SalesClueDetail",
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    FormTop: () => import("./components/formTop"),
    Dynamic: () => import("./components/dynamic"),
    OperationTable: () =>
      import("@/views/clueManage/components/operationTable"),
    FollowUpDynamic: () =>
      import("@/views/clueManage/components/followUpDynamic"),
    FollowUpDialog: () =>
      import("@/views/clueManage/components/FollowUpDialog"),
    SalesClueTrajectory: () =>
      import("@/views/clueManage/salesClue/components/salesClueTrajectory"),
    ClueDialog: () => import("@/views/clueManage/components/ClueDialog"),
    AttachTable: () =>
      import("@/views/clueManage/components/AttachTable/salesLeads"),
    ContactsTable: () => import("@/views/clueManage/components/ContactsTable"),
    TaskTable: () => import("@/views/clueManage/components/TaskTable"),
    TaskDialog: () => import("@/views/clueManage/components/TaskDialog"),
    TaskFollowUpDialog: () =>
      import("@/views/clueManage/components/TaskDialog/followUp"),
    ConvertCustomer: () =>
      import("@/views/clueManage/components/ConvertCustomer"),
  },
  data() {
    return {
      formData: {},
      leftTopConfig: {
        columnConfig: [
          // 标题左侧label，数据取值formModel
          {
            label: "业务员",
            prop: "salesmanName",
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
      topList: [
        {
          label: "线索归属：",
          prop: "ownershipUserName",
        },
        {
          label: "联系人姓名：",
          prop: "contactName",
        },
        {
          label: "下次跟进：",
          prop: "nextFollowTime",
        },
        {
          label: "最新订单：",
          prop: "latestFollowTime",
        },
      ],
      tabs: {
        active: "10",
      },
      btnTabsList: [
        {
          label: "概况信息",
          key: "10",
        },
        {
          label: "跟进记录",
          key: "20",
        },
        {
          label: "联系人",
          key: "30",
        },
        {
          label: "任务记录",
          key: "40",
        },
        {
          label: "相关附件",
          key: "50",
        },
        {
          label: "操作日志",
          key: "60",
        },
      ],
      isInitRes: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]([
      "crmHonorific",
      "crmRole",
      "crmFollowType",
      "crmSalesLeadsState",
      "crmRemind",
      "crmRemindWay",
      "crmTaskState",
      "crmTaskUrgent",
      "crmLeadBusinessType",
      "clientCategory",
      "crmCustomerLevel",
      "crmSource",
      "crmBusinessType",
      "crmTaskType",
      "crmLeadSource",
    ]).then(() => {
      const { id } = this.$route.query;
      this.getDetails(id);
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDetails(id) {
      this.isInitRes = false;
      getSalesLeadsInfo(id).then((res) => {
        const { data } = res;
        this.formData = data;
        this.isInitRes = true;
      });
    },
    handleTopClick({ type, id }) {
      if (["pre", "next"].includes(type)) {
        this.getDetails(id);
      }
    },
    handleDelSuccess() {
      this.$refs?.detailTopRef.comReBack({
        isBackRefresh: true,
      });
    },
    handleEdit() {
      this.$refs.clueDialogRef.show(this.formData);
    },
    handleConvertCustomer() {
      this.$refs.convertCustomerRef.show(this.formData);
    },
    changeTabs(tab) {
      this.tabs.active = tab;
    },
    handleFollowUp() {
      const { id: businessId, name } = this.formData;
      this.$refs.followUpDialogRef.show({
        businessId,
        businessName: name,
        type: 0, // 0:普通跟进(不含签到)；
        businessType: 1, // 1:线索；4：联系人
      });
    },
    handleTaskSuccess() {
      this.$refs.taskTableRef?.refreshTable();
    },
    handleAddTask(type) {
      if (type === "ordinaryTask") {
        const { id: businessId, code, name } = this.formData;
        this.$refs.taskDialogRef.show(
          {
            businessId,
            businessName: `${code}[${name}]`,
            businessType: 1,
          },
          true
        );
      } else {
        const { id: businessId, code, name } = this.formData;
        this.$refs.taskFollowUpDialogRef.show(
          {
            businessId,
            businessName: `${code}[${name}]`,
            businessType: 1,
          },
          true
        );
      }
    },
    changeRecords() {
      this.$refs.dynamicRef?.getSalesLeadsDynamicPage();
      this.$refs.followUpDynamicRef?.getFollowPage();
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
