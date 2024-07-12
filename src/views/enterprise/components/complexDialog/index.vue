<template>
  <!-- 清关交接专用 -->
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:titleTips>
          <div class="tip text-danger-color">
            <span>* 此模块数据为提单、箱单发票页面所用，不支持中文输入！</span>
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import {
  addMainContacts,
  updateMainContacts,
} from "@/api/customerManage/customerList.js";
import { mapState, mapGetters } from "vuex";
import { mainContactsForm } from "./model.js";
import { typeConversion } from "@/utils/index"; // 数据类型转换
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  computed: {
    ...mapState(["dictionary"]),
    ...mapGetters(["userId"]),
  },
  data() {
    return {
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        formRules: {}, // 表单校验规则
      },
      customDialogConfig: {
        appendToBody: this.appendToBody,
        useFooter: "stagFooter",
        footer: [
          {
            text: "确 定",
            type: "primary",
            handleClick: () => {
              this.dataStatus = 1;
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
        stagFooter: [
          {
            text: "保存并启用",
            type: "primary",
            handleClick: () => {
              this.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "暂 存",
            type: "primary",
            handleClick: () => {
              this.dataStatus = 0;
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
      config: {
        mainContacts: {
          formConfig: mainContactsForm,
          addHttpRequest: addMainContacts,
          updateHttpRequest: updateMainContacts,
        },
      },
      dataStatus: "", //暂存还是保存并提交
      type: "",
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const customerId = typeConversion(this.$route.query.id);
      const {
        id,
        country: { id: countryId, label: countryName },
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
        isDefault,
      } = formModel;
      const params = {
        cusContacts: {
          countryId,
          countryName,
          contacts,
          phone,
          company,
          email,
          taxId,
          taxIdType: "0",
          postCode,
          province,
          city,
          area,
          street,
          detailsAddr,
          customerId,
        },
        id,
        countryId,
        countryName,
        company,
        customerId,
        contactsType, //收件人或联系人
        dataStatus: this.dataStatus, //是否暂存
        isDefault: isDefault ? 1 : 0, //是否默认
      };
      if (id) {
        return this.config[this.type].updateHttpRequest(params);
      } else {
        return this.config[this.type].addHttpRequest(params);
      }
    },
    show(type, rows) {
      this.type = type;
      const { lists, formRules, width, labelWidth, title } =
        this.config[type].formConfig;
      const { id, cusContacts, contactsType } = rows;
      if (id) {
        this.formConfig.formModel = {
          ...cusContacts,
          contactsType,
          id,
          country: {
            id: cusContacts.countryId,
          },
        };
        this.customDialogConfig.useFooter="footer"
      } else {
        this.formConfig.formModel = {};
        this.customDialogConfig.useFooter="stagFooter"
      }
      this.formConfig = {
        ...this.formConfig,
        lists,
        formRules,
        labelWidth,
      };
      this.customDialogConfig = {
        ...this.customDialogConfig,
        title,
        width,
      };
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess", this.type);
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
