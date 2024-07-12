<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="{ ...formConfig, ...followUpTaskConfig(attendance) }"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        @handleChange="handleChange"
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
                httpRequest: (params) =>
                  getClueList(params, slotProps.formModel.businessType),
                getCustomData,
                refreshRequest,
                disabled: businessDisable,
              }"
              defaultKey="id"
            />
          </div>
        </template>
        <template v-slot:address="slotProps">
          <!-- <div class="text-theme-color address">
            <span v-if="slotProps.formModel.address">{{
              slotProps.formModel.address
            }}</span>
            <i class="el-icon-location"></i><span>选择</span>
          </div> -->
          <location
            @handleSelect="handleLocationSelect"
            :formData="slotProps.formModel"
          />
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { followUpTaskConfig } from "./model";
import { getTaskInfo, saveOrUpdateTask } from "@/api/clueManage/taskRecord.js";
import { getSalesLeads } from "@/api/clueManage/salesClue.js";
import { getSalesLeadsContact } from "@/api/clueManage/contacts.js";
import { mapState } from "vuex";
import { getAllUser } from "@/api/common";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    Location: () => import("./location"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
      followUpTaskConfig,
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "80px",
      },
      refreshRequest: false,
      businessDisable: false,
      attendance: true,
    };
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    submitFormRequest(formModel) {
      const { attendance, ...params } = formModel;
      return saveOrUpdateTask({
        ...params,
        attendance: attendance ? 1 : 0,
        type: 1, // 任务类型 0：普通；1：跟进
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
        urgent,
        businessType,
        remindWays,
        reminder,
        attendance,
        latitude,
        longitude,
        participantUsers,
        ...obj
      } = data;
      this.attendance = [false, 0].includes(attendance) ? false : true;
      this.formConfig.formModel = {
        ...obj,
        latitude,
        longitude,
        chargeUserId: this.curUserInfo?.userId,
        chargeUserName: this.curUserInfo?.userName,
        urgent: this.typeConversion(urgent),
        businessType: this.typeConversion(businessType),
        reminder: this.typeConversion(reminder || 1),
        remindWays: (remindWays || [1]).map((i) => this.typeConversion(i)),
        attendance: this.attendance,
        participantUserIds: (participantUsers || []).map((item) => item.userId),
        participantUsers,
      };
      this.customDialogConfig.title = row.id ? "编辑任务" : "新增任务";
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
    handleChange(val, type) {
      if (type === "businessType") {
        this.refreshRequest = !this.refreshRequest;
      } else if (type === "attendance") {
        this.attendance = val;
        this.$nextTick(() => {
          this.$refs.dialogForm.renewForm();
        });
      }
    },
    handleLocationSelect(item) {
      this.$refs.dialogForm.setFormModel({
        address: item.address,
        latitude: item.lat,
        longitude: item.lng,
      });
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
.address {
  cursor: pointer;
  i {
    font-size: 16px;
  }
}
</style>
