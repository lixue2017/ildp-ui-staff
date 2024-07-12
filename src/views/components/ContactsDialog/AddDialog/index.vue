<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <div class="tip text-danger-color">
        * 此模块数据为提单、箱单发票页面所用，不支持中文输入！
      </div>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:taxId="slotProps">
          <div class="flex input-slot">
            <el-select
              slot="prepend"
              v-model="slotProps.formModel.taxIdType"
              placeholder="税号类型"
              class="input-slot-left"
            >
              <el-option
                v-for="selectItem in slotProps.dicsList"
                :key="selectItem.value"
                :label="selectItem.label"
                :value="selectItem.value"
              ></el-option>
            </el-select>
            <el-input
              v-model="slotProps.formModel.taxId"
              placeholder="税号"
              class="input-slot-right"
            />
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { addContactsStaff } from "@/api/basicInfo/contacts.js";
import { TAX_ID_OPTION } from "@/utils/mixin.js";
import { config } from "./model";

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
    paramObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      taxIdOption: TAX_ID_OPTION,
      customDialogConfig: {
        title: "提单联系人信息",
        width: "750px",
        dataStatus: 0,
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "保存并启用",
            type: "primary",
            handleClick: () => {
              this.customDialogConfig.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "暂存",
            type: "primary",
            hide: this.appendToBody,
            handleClick: () => {
              this.customDialogConfig.dataStatus = 0;
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "100px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
      addData: {},
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const countryId = formModel.country.id;
      const countryName = formModel.country.label;
      const {
        contacts,
        phone,
        company,
        email,
        taxId,
        taxIdType,
        postCode,
        province,
        city,
        area,
        street,
        detailsAddr,
        contactsType,
        customerId=undefined
      } = formModel;
      const params = {
        dataStatus: this.customDialogConfig.dataStatus,
        isDefault: formModel.isDefault ? 1 : 0,
        contactsType,
        ...(this.paramObj || {}),
        customerId: customerId,
      };
      params.cusContacts = {
        contacts,
        phone,
        company,
        email,
        taxId,
        taxIdType,
        countryId,
        countryName,
        postCode,
        province,
        city,
        area,
        street,
        detailsAddr,
      };
      if (params.dataStatus === 0) params.isDefault = 0;
      this.addData = params;
      return addContactsStaff(params);
    },
    show({ contactsType,customerId }) {
      if (!contactsType) {
        //校验已经被删除
        // this.$set(
        //   this.formConfig.formRules,
        //   "postCode",
        //   config.formRules.postCode
        // );
      } else {
        delete this.formConfig.formRules.postCode;
      }
      console.log(this.formConfig);
      this.formConfig.formModel = {
        contactsType: contactsType ? 1 : 0,
        contactsName: contactsType ? "提单发件人" : "提单收件人",
        taxIdType: "0",
        isDefault: true,
        customerId
      };
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess(res = {}) {
      this.$emit("handleSuccess", res.data);
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../index.scss";
.tip {
  padding-left: 20px;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
