<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="{
          ...formConfig,
          ...config({
            attentmentType: 'crmTask',
            ...(formData.id ? { customerId: formData.id } : {}),
          }),
        }"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:participantUserIds="slotProps">
          <AutoComplete
            ref="autoCompleteRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              httpRequest: (params) =>
                getUserList(params, slotProps.fieldItem.httpRequest),
            }"
          />
        </template>
        <template v-slot:businessType="slotProps">
          <div class="base-flex-between">
            <el-select
              v-model="slotProps.formModel[slotProps.fieldItem.id]"
              placeholder="选择业务类型"
              style="margin-right: 10px"
              :disabled="businessDisable"
              @change="(val) => handleChange(val, 'businessType')"
            >
              <el-option
                v-for="selectItem in slotProps.dicsList"
                :key="selectItem.value"
                :label="selectItem.label"
                :value="selectItem.value"
              />
            </el-select>
            <AutoComplete
              ref="autoCompleteRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                id: 'businessId',
                selectLabelKey: 'businessName',
                ...httpGetSalesLeadsSelectPage(),
                refreshRequest,
                disabled: businessDisable,
              }"
              :additionalParam="{
                businessType: slotProps.formModel.businessType,
              }"
              defaultKey="businessId"
            />
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { config } from "./model";
import { getTaskInfo, saveOrUpdateTask } from "@/api/clueManage/taskRecord.js";
import { getSalesLeads } from "@/api/clueManage/salesClue.js";
import { getSalesLeadsContact } from "@/api/clueManage/contacts.js";
import { mapState } from "vuex";
import { httpGetSalesLeadsSelectPage } from "@/comModel/httpSelect";
import { getAllUser } from "@/api/common";
import { getAttachPage } from "@/api/clueManage/common.js";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      httpGetSalesLeadsSelectPage,
      customDialogConfig: {
        title: "新建任务",
        width: "750px",
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "提 交",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      config,
      formConfig: {
        formModel: {},
        isAttachFileId: true,
        getListReq: getAttachPage,
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "80px",
      },
      refreshRequest: false,
      businessDisable: false,
      formData: {},
    };
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    submitFormRequest(formModel) {
      const { createTime, ...params } = formModel;
      const [startTime, endTime] = createTime;
      return saveOrUpdateTask({
        ...params,
        startTime,
        endTime,
        type: 0, // 任务类型 0：普通；1：跟进
      });
    },
    // businessEditable 关联业务是否可编辑
    async show(row, businessDisable) {
      let data = row || {};
      if (row.id) {
        data = (await getTaskInfo(row.id)).data || {};
      }
      this.businessDisable = !!businessDisable;
      const {
        chargeUserId,
        chargeUserName,
        startTime,
        endTime,
        urgent,
        businessType,
        remindWays,
        reminder,
        participantUsers,
        ...obj
      } = data;
      this.formConfig.formModel = {
        ...obj,
        createTime: startTime && endTime ? [startTime, endTime] : [],
        chargeUserId: this.curUserInfo?.userId,
        chargeUserName: this.curUserInfo?.userName,
        urgent: this.typeConversion(urgent),
        businessType: this.typeConversion(businessType),
        reminder: this.typeConversion(reminder || 1),
        remindWays: (remindWays || [1]).map((i) => this.typeConversion(i)),
        participantUserIds: (participantUsers || []).map((item) => item.userId),
        participantUsers,
      };
      this.formData = this.formConfig.formModel;
      this.formConfig.listParams = {
        ids: obj.attachId,
      };
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    getUserList(params, httpRequest) {
      if (params.userId) {
        return Promise.resolve({
          rows: this.formConfig.formModel.participantUsers || [],
          total: (this.formConfig.formModel.participantUsers || []).length,
        });
      }
      return httpRequest(params);
    },
    handleChange() {
      this.refreshRequest = !this.refreshRequest;
    },
    getClueList(params, i) {
      if (!i) return Promise.resolve({});
      const reqs = {
        1: getSalesLeads,
        4: getSalesLeadsContact,
      };
      return reqs[i]({ ...params, countType: 1000 });
    },
    getCustomData(item) {
      return {
        key: item.id,
        label: `${item.code}[${item.name || item.customerName}]`,
        value: item.id,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .accessory-tips {
    margin-top: 7px;
  }
}
</style>
