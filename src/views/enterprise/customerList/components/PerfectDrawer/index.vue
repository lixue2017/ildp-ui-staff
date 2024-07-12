<template>
  <ComDrawer ref="customDrawer"   class="drawer-content" :customDrawer="customDrawerConfig">
    <template v-slot:content>
      <ComForm
        :formConfig="formConfig"
        ref="drawerForm"
        v-if="$refs && $refs.customDrawer && $refs.customDrawer.drawerVisible"
        :dictionary="dictionary"
      />
    </template>
  </ComDrawer>
</template>

<script>
import { perfectCustomer } from "@/api/customerManage/customerList.js";
import { customer, supplier } from "./model";

export default {
  props: {
    dictionary: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDrawer: () => import("_comp/ComDrawer"),
  },
  data() {
    return {
      customDrawerConfig: {
        title: "客户信息完善",
        width: "920px",
        footer: [
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDrawer.hide();
            },
          },
          {
            text: "确 认",
            plain: true,
            type: "primary",
            handleClick: () => {
              this.$refs.drawerForm.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.perfectCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "125px",
        lists: [], // 表单渲染列表
        formRules: [], // 表单校验规则
      },
    };
  },
  methods: {
    perfectCustomer(form) {
      const params = {};
      for (let key in form) {
        const arr = key.split("_");
        if (key !== "id" && arr.length === 2) {
          if (!params[arr[0]]) {
            params[arr[0]] = {};
            params[arr[0]].customerId = form.id;
          }

          if (key === "customerInfoExtend_otherSelect") {
            form[key].includes(1) && (params.customerInfoExtend.isLocus = 1);
            form[key].includes(2) && (params.customerInfoExtend.isEmail = 1);
            form[key].includes(3) && (params.customerInfoExtend.isChannel = 1);
          } else if (arr[1] === "isDefault") {
            params[arr[0]][arr[1]] = form[key] ? 1 : 0;
          } else if (arr[1] === "isPrintInvoice") {
            params[arr[0]][arr[1]] = form[key] ? 1 : 0;
          } else {
            params[arr[0]][arr[1]] = form[key];
          }
        } else {
          params[key] = form[key];
        }
      }
      params.id && delete params.id;
      this.formConfig.formModel = params;
      return perfectCustomer(params);
    },
    show(formModel, type) {
      const lists = {
        2: {
          lists: customer.lists,
          formRules: customer.formRules,
        },
        3: {
          lists: supplier.lists,
          formRules: supplier.formRules,
        },
      };
      this.customDrawerConfig.title =
        type == "2" ? "客户信息完善" : "供应商信息完善";
      this.formConfig.lists = lists[type].lists;
      this.formConfig.formRules = lists[type].formRules;
      this.formConfig.formModel = {
        id: formModel.id,
        customerInfoExtend_isPrintInvoice: true,
        customerInfoExtend_otherSelect: [],
      };

      this.$refs.customDrawer.show();
    },
    hide() {
      this.$refs.customDrawer.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../style.scss";
/deep/{
  .form-column-list {
    margin-top:30px;
    flex-wrap: wrap;
  }
}
</style>
