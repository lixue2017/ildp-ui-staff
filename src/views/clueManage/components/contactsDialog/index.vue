<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="{
          ...formConfig,
          ...config(followTask, formConfig.formModel.id, isSalesLeads),
        }"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        @handleChange="handleChange"
      >
        <!-- <template v-slot:address="slotProps">
          <el-cascader
            :options="addressOptions"
            v-model="slotProps.prop"
            placeholder="选择地区"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </template> -->
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { config } from "./model";
import { mapState } from "vuex";
import { saveOrUpdateContact } from "@/api/clueManage/contacts.js";
import { getAddressTree } from "@/api/basicData/index.js";

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
        title: "添加联系人",
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
        labelWidth: "90px",
      },
      followTask: false,
      addressOptions: [],
      isSalesLeads: false,
    };
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    submitFormRequest(formModel) {
      return saveOrUpdateContact(formModel);
    },
    show(row = {}, type) {
      const {
        remindWays,
        followTask,
        honorific,
        followUserId,
        followUserName,
        ...obj
      } = row;
      if (type === "salesLeads") {
        // 关联线索不可编辑
        this.isSalesLeads = true;
      }
      this.followTask = !!followTask;
      this.customDialogConfig.title = row.id ? "编辑联系人" : "添加联系人";
      this.formConfig.formModel = {
        ...obj,
        followTask: !!followTask,
        remindWays: remindWays || [],
        honorific: this.typeConversion(honorific) || "2",
        followUserId,
        followUserName,
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
    handleChange(val, type) {
      if (type === "followTask") {
        this.followTask = val;
        if (val) {
          this.$refs.dialogForm.setFormModel({
            followUserId: this.curUserInfo?.userId,
            followUserName: this.curUserInfo?.userName,
          });
        }
        this.$nextTick(() => {
          this.$refs.dialogForm.renewForm();
        });
      }
    },
  },
};
</script>
