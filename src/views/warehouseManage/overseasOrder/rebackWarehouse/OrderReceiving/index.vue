<template>
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    class="dialog"
    :confirmClose="false"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <div class="tabs">
        <el-button
          :class="[
            'tabs-btn',
            item.key === tabsConfig.active ? 'isActive' : '',
          ]"
          size="small"
          plain
          v-for="item in tabsConfig.columns"
          :key="item.key"
          @click="changeTabs(item.key)"
        >
          {{ item.label }}
        </el-button>
      </div>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import { orderReceiving } from "@/api/warehouse/prediction";
import { config, tabsConfig } from "./model";
import { mapState } from "vuex";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      status: 0,
      customDialogConfig: {
        title: "接单",
        width: "365px",
        // appendToBody: this.appendToBody,
        useFooter: "footer",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "确定",
            type: "primary",
            hide: this.appendToBody,
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
        type: "",
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "68px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
        visibleAll: true,
      },
      tabsConfig,
      orderId: 0,
      orderType: 0,
    };
  },
  created() {},
  methods: {
    submitFormRequest(formModel) {
      const { active } = this.tabsConfig;
      let params = {
        ...formModel,
        id: this.orderId,
        orderType: this.orderType,
        orderStatus: active == 1 ? 2 : 6,
      };
      console.log("params", params);
      return orderReceiving(params);
    },
    show(row) {
      const { id, orderType } = row;
      this.orderId = id;
      this.orderType = orderType;
      this.tabsConfig.active = 1;
      this.formConfig.lists = config.lists;
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess(res = {}) {
      this.$emit("handleSuccess", res.data);
      this.hide();
    },
    changeTabs(key) {
      this.tabsConfig.active = key;
      this.formConfig.lists = key === 1 ? config.lists : config.refuseLists;
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog {
  /deep/ {
    .el-dialog__body {
      padding: 20px 40px;
    }
  }
  .tabs {
    padding-bottom: 15px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e2e2e2;
    .tabs-btn {
      color: #515151;
      &:hover,
      &:focus {
        color: #5094ff;
      }
      &.isActive {
        color: #5094ff;
        border-color: #5094ff;
      }
    }
  }
}
</style>