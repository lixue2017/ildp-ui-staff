<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <div class="tip">*至少填写一项</div>
      <ComForm
        ref="dialogForm"
        :formConfig="{
          ...formConfig,
          ...config(
            followTask,
            formConfig.formModel.id,
            formConfig.formModel.isCustomer
          ),
        }"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        @handleChange="handleChange"
      >
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { config } from "./model";
import { saveOrUpdateSalesLeads } from "@/api/clueManage/salesClue.js";
import { mapState } from "vuex";

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
      customDialogConfig: {
        title: "添加线索",
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
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "82px",
      },
      followTask: false,
    };
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    submitFormRequest(formModel) {
      const {
        followTime,
        followContext,
        followUserId,
        reminder,
        remindWays,
        ...obj
      } = formModel;
      let params = obj;
      if (obj.followTask) {
        params = {
          ...obj,
          followTime,
          followContext,
          followUserId,
          reminder,
          remindWays,
        };
      }
      return saveOrUpdateSalesLeads(params);
    },
    show(row = {}) {
      const {
        leadSource,
        state,
        honorific,
        role,
        reminder,
        remindWays,
        followTask,
        ownershipUserId,
        ownershipUserName,
        ...obj
      } = row;
      this.formConfig.formModel = {
        ...obj,
        followTask: !!followTask,
        leadSource: this.typeConversion(leadSource),
        state: this.typeConversion(state),
        honorific: this.typeConversion(honorific) || "2",
        role: this.typeConversion(role),
        reminder: this.typeConversion(reminder || 1),
        remindWays: (remindWays || [1]).map((i) => this.typeConversion(i)),
        ownershipUserId: ownershipUserId || this.curUserInfo?.userId,
        ownershipUserName: ownershipUserId
          ? ownershipUserName
          : this.curUserInfo?.userName,
      };
      this.customDialogConfig.title = row.id ? "编辑线索" : "添加线索";
      this.followTask = !!followTask;
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    handleChange(val, type) {
      if (type === "followTask") {
        this.followTask = val;
        this.$nextTick(() => {
          this.$refs.dialogForm.renewForm();
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .el-dialog--center .el-dialog__body {
    padding: 20px 25px 10px;
  }
}
.tip {
  padding-left: 2px;
  padding-bottom: 20px;
  line-height: 18px;
  color: #f26079;
}
</style>
