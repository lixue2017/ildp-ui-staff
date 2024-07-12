<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      class="email-dialog"
    >
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        />
      </template>
    </ComDialog>
  </div>
</template>


<script>
import { FORM_COLS_1, FORM_COLS_2, FORM_COLS_3 } from "./model";
import { getContactsInfo } from "@/api/customerManage/customerList";
import { sendMail } from "@/api/messageService";
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
      confirmClose: false,
      customDialogConfig: {
        title: "发送账单",
        width: "379px",
        center: false,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取 消",
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "确 认",
            type: "primary",
            loading: false,
            handleClick: () => {
              this.customDialogConfig.footer[1].loading = true;
              this.customDialogConfig.footer[1].text = "发送中";
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: (row) => {
          return sendMail({ ...row, sendTemplate: "M2" });
        }, // 表单提交接口
        successFunction: this.handleFormSuccess, // 表单提交成功回调
        errorFunction: this.handleFormError, // 表单提交失败回调
        size: "small",
        labelWidth: "65px",
        formRules: {
          receiveMailNoList: [
            { required: true, message: "请选择收件人邮箱", trigger: "change" },
          ],
        },
      },
    };
  },
  methods: {
    handleFormSuccess() {
      this.customDialogConfig.footer[1].loading = false;
      this.customDialogConfig.footer[1].text = "确 认";
      this.hide();
      this.$emit("handleSuccess");
    },
    handleFormError() {
      this.customDialogConfig.footer[1].loading = false;
      this.customDialogConfig.footer[1].text = "确 认";
    },
    async show(row) {
      const { dealingsCompany: id, ...params } = row;
      this.comRepeatedRequest(this, getContactsInfo, {
        id,
      }).then((res) => {
        const emailOptions = [];
        res.rows.forEach((item) => {
          if (item.email) {
            emailOptions.push({
              label: item.email,
              value: item.email,
            });
          }
        });
        const options = [...new Set(emailOptions)];
        if (options.length) {
          this.formConfig.formModel = {
            receiveMailNoList: [options[0].value],
            ccMailNoList: [options[0].value],
            ...params,
          };
        }
        this.formConfig.lists = [
          {
            fieldList: [
              {
                title: "邮箱",
                rows: [
                  {
                    cols: [
                      {
                        ...FORM_COLS_1,
                        options,
                      },
                      {
                        ...FORM_COLS_2,
                        options,
                      },
                    ],
                  },
                ],
              },
              {
                title: "发送账单模板",
                rows: [
                  {
                    cols: [FORM_COLS_3],
                  },
                ],
              },
            ],
          },
        ];
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.email-dialog {
  /deep/ .form-title {
    border: none;
    padding-left: 0;
    margin-bottom: 15px;
  }
}
</style>
