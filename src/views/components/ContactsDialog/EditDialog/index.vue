<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
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
import { updateContacts, getContactsDetail } from "@/api/basicInfo/contacts.js";
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
            text: "确定",
            type: "primary",
            handleClick: () => {
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
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const countryId = formModel.country.id
        ? formModel.country.id
        : formModel.countryId;
      const countryName = formModel.country.label
        ? formModel.country.label
        : formModel.countryName;
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
        detailsAddr,
        contactsType,
        dataStatus,
        street,
        isDefault,
        id,
        cusContactsId,
      } = formModel;
      const params = {
        id,
        cusContactsId,
        dataStatus,
        isDefault: !dataStatus ? 0 : isDefault ? 1 : 0,
        contactsType,
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
        detailsAddr,
        street,
      };
      this.editParams = params;
      return updateContacts(params);
    },
    show({ id }) {
      return getContactsDetail(id).then((res) => {
        const data = res.data || {};
        this.formConfig.formModel = {
          ...(data.cusContacts || {}),
          ...(data || {}),
          country: data.cusContacts.countryName,
          countryId: data.cusContacts.countryId,
          isDefault: data.isDefault ? true : false,
          contactsType: data && data.contactsType ? 1 : 0,
          contactsName: data && data.contactsType ? "提单发件人" : "提单收件人",
          taxIdType: data.cusContacts.taxIdType?.toString(),
        };
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess(res) {
      const { cusContactsId } = this.editParams;
      this.$emit("handleSuccess", {
        ...this.editParams,
        cusContactsId: res.data || cusContactsId,
      });
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../index.scss";
</style>
