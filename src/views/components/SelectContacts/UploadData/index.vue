<template>
  <div>
    <el-button
      type="primary"
      size="small"
      plain
      @click="handleEdit"
      v-if="contactsData.clearanceCustoms"
    >
      上传资料
    </el-button>
    <ComDialog
      v-if="dialogShow"
      ref="myDialog"
      :customDialog="dialogConfig"
      @onClose="handleClose"
      :confirmClose="false"
    >
      <template v-slot:content>
        <div :class="formConfig.className">
          <ComForm :formConfig="formConfig" ref="myComForm" />
        </div>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { msgBox } from "@/utils/confirmBox.js";
import { dialogOptions } from "./model";

export default {
  props: {},
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      dialogShow: false,
      dialogConfig: {
        title: "上传资料",
        width: "456px",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.myDialog.hide();
              this.dialogShow = false;
            },
          },
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.myComForm.submitForm();
            },
          },
        ],
      },
      formConfig: {},
    };
  },
  methods: {
    handleClose() {
      this.dialogShow = false;
    },
    handleFormDialog(
      type,
      {
        httpRequest = () => {},
        successFunction,
        formModel = {},
        successMessage,
      }
    ) {
      if (!dialogOptions[type]) return;
      const config = dialogOptions[type];
      this.dialogConfig.title = config.title;
      this.dialogConfig.width = config.width;
      this.formConfig = {
        size: config.size || "small",
        formModel,
        httpRequest,
        successFunction: () => {
          successFunction && successFunction();
          this.$refs.myDialog.hide();
          this.dialogShow = false;
        },
        successMessage,
        className: config.className,
        labelWidth: config.labelWidth || "85px",
        lists: config.lists,
        formRules: config.formRules,
      };
      this.dialogShow = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.myDialog.show();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>