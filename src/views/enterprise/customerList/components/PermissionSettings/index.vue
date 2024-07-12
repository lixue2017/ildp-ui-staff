<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:formTip="slotProps">
          <span class="text-info-color">
            {{ slotProps.fieldItem.tipText }}
          </span>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { mapState } from "vuex";
import {
  getCusRoleList,
  updateCusRole,
  getRoleList,
} from "@/api/customerManage/customerList.js";
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
    extendParams: {
      type: Object,
      default: () => ({}),
    },
    roleList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      customDialogConfig: {
        title: "权限设置",
        width: "450px",
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "保存",
            type: "primary",
            hide: this.appendToBody,
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "30px",
        lists: [], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      roleObj: {},
    };
  },
  mounted() {
    const cols = this.roleList.map((item) => {
      this.roleObj[item.roleKey] = item.roleId;
      return {
        span: 24,
        id: item.roleKey,
        text: item.roleName,
        type: "singleCheckbox",
        tip: "formTip",
        tipText: item.remark,
        disabled: item.tag === 8,
      };
    });
    this.formConfig.lists = [
      {
        fieldList: [
          {
            rows: [
              {
                cols,
              },
            ],
          },
        ],
      },
    ];
  },
  methods: {
    submitFormRequest(formModel) {
      const { customerInfoId, ...obj } = formModel;
      const roleIds = Object.keys(obj)
        .filter((key) => obj[key])
        .map((key) => this.roleObj[key]);
      return updateCusRole({
        customerInfoId,
        roleIds,
      });
    },
    show(row) {
      getCusRoleList(row.id).then((res) => {
        const formData = { customerInfoId: row.id };
        this.roleList.forEach(({ roleId, roleKey }) => {
          if (res.data.includes(roleId)) {
            formData[roleKey] = true;
          } else {
            formData[roleKey] = false;
          }
        });
        this.formConfig.formModel = formData;
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
  },
};
</script>
