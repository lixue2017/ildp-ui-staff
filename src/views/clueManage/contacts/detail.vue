<template>
  <div class="app-container">
    <ComDetailTop
      title="联系人详情"
      :formModel="formData"
      :titConfig="leftTopConfig"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    />

    <div class="detail-content base-flex" v-if="isInitRes">
      <div class="detail-left">
        <div class="top-detail">
          <div class="title">{{ formData.contactName }}</div>
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
            @handleFollowUp="handleFollowUp"
          />
        </template>
        <template v-if="['20'].includes(tabs.active)">
          <FollowUpDynamic
            ref="followUpDynamicRef"
            :formData="formData"
            :businessType="4"
          />
        </template>
        <template v-if="['30'].includes(tabs.active)">
          <OperationTable :formData="formData" />
        </template>
      </div>

      <div>
        <ContactsTrajectory
          :formData="formData"
          @handleFollowUp="handleFollowUp"
          @handleDelSuccess="handleDelSuccess"
          @handleEdit="handleEdit"
        />
      </div>
    </div>
    <FollowUpDialog ref="followUpDialogRef" @handleSuccess="changeRecords" />
    <ContactsDialog
      ref="contactsDialogRef"
      @handleSuccess="getDetails(formData.id)"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getSalesLeadsContactInfo } from "@/api/clueManage/contacts.js";
export default {
  name: "ClueContactsDetail",
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
    ContactsTrajectory: () =>
      import("@/views/clueManage/contacts/components/contactsTrajectory"),
    ContactsDialog: () =>
      import("@/views/clueManage/components/contactsDialog"),
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
          label: "关联客户：",
          prop: "customerName",
        },
        {
          label: "手机号码：",
          prop: "phone",
        },
        {
          label: "下次跟进：",
          prop: "nextFollowTime",
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
          label: "操作日志",
          key: "30",
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
    ]).then(() => {
      const { id } = this.$route.query;
      this.getDetails(id);
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDetails(id) {
      this.isInitRes = false;
      getSalesLeadsContactInfo(id).then((res) => {
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
      this.$refs.contactsDialogRef.show(this.formData);
    },
    changeTabs(tab) {
      this.tabs.active = tab;
    },
    handleFollowUp() {
      const { id: businessId, contactName } = this.formData;
      this.$refs.followUpDialogRef.show({
        businessId,
        businessName: contactName,
        type: 0, // 0:普通跟进(不含签到)；
        businessType: 4, // 1:线索；4：联系人
      });
    },
    changeRecords() {
      this.$refs.dynamicRef?.getContactDynamicPage();
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
