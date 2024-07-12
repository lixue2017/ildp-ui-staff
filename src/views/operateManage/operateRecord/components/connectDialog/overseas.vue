<template>
  <div>
    <ComDialog ref="customDialog" :customDialog="customDialogConfig">
      <template v-slot:content>
        <ComForm
          ref="dialogFormRef"
          :formConfig="formConfig"
          class="dialog-form content-padding-20"
          @handleChange="handleChange"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        >
          <template v-slot:agent="slotProps">
            <AutoComplete
              ref="overseasAgencyRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                handle: (val) => getHttpRequest(val, slotProps.formModel),
              }"
              :additionalParam="{
                isQueryFirstDept: [1, 1][slotProps.formModel.agentType],
                isOverseasAgentTow: [1, undefined][
                  slotProps.formModel.agentType
                ],
                typeList: [0, 3][slotProps.formModel.agentType],
              }"
            />
          </template>
        </ComForm>
      </template>
    </ComDialog>

    <SendEmail
      ref="emailRef"
      :paramObj="{
        operationOrderId: tempObj.id,
        webMailTag: 'clearance_hw_qg',
      }"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getCustomsClearanceInfo,
  POSTSecondInstance,
  getClearanceGenerateNumber,
  POSTFirstInstance,
  getClearanceEmailRecipient,
} from "@/api/performance/record.js";
import { getMailMsg, postSendMail } from "@/api/messageService";
import { customOverseasDialogCols } from "./model.js";

export default {
  data() {
    return {
      customDialogConfig: {
        title: "清关交接",
        width: "990px",
        appendToBody: true,
        footer: [],
      },
      oneFooterBtn: [
        {
          text: "确定",
          type: "primary",
          handleClick: () => {
            this.tempObj.isEmailPreview = false;
            this.$refs.dialogFormRef.submitForm();
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
      twoFooterBtn: [
        {
          text: "确定并预览邮件",
          type: "primary",
          handleClick: () => {
            this.tempObj.isEmailPreview = true;
            this.$refs.dialogFormRef.submitForm();
          },
        },
      ],
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "106px",
        formRules: {}, // 表单校验规则
      },
      tempObj: {},
    };
  },
  methods: {
    async show(row) {
      const { data } = (await getCustomsClearanceInfo(row.id)) || {};
      const { overallStatus, ...nData } = data || {};
      const isOverseasAgencyMail = [4, 563, "4", "563"].includes(nData.agent); // 海外代理为荷兰与湖南堡森发送邮件
      const is_send_mail = isOverseasAgencyMail && [14].includes(overallStatus);
      this.tempObj = {
        id: nData.id,
      };
      const { isWebHandoverSee } = row || {};
      const { lists, formRules } = customOverseasDialogCols({
        overallStatus,
        isWebHandoverSee,
      });
      this.formConfig = {
        ...this.formConfig,
        lists,
        formRules,
        formModel: {
          ...(data || {}),
          is_send_mail,
          agentType: this.typeConversion(data.agentType || 0),
          expectWarehouseType: this.typeConversion(data.expectWarehouseType),
        },
      };

      this.customDialogConfig.title = `海外${
        ["一审", "二审", ""][
          overallStatus === 14 ? 0 : overallStatus === 17 ? 1 : 2
        ]
      }交接`;

      this["dictionary/getDictionary"]([
        "freightType",
        "clearanceReservationWarehouse",
      ]).then(() => {
        if (isWebHandoverSee) {
          this.$set(this.customDialogConfig, "footer", [
            {
              text: "取消",
              plain: true,
              handleClick: () => {
                this.$refs.customDialog.hide();
              },
            },
          ]);
        } else {
          this.handleChangeOverseasAgency(nData.agent);
        }
        this.$refs.customDialog.show();
      });
    },
    handleChange(val, key) {
      if (key === "agentType") {
        this.$refs.overseasAgencyRef?.changeFocusRequest({
          isDefaultChange: true,
        });
      }
    },
    getHttpRequest(val, formModel) {
      this.handleChangeOverseasAgency(val);
      if (val) {
        const { operationOrderId, freightType, agentType, agent } = formModel;
        const params = {
          operationOrderId,
          freightType,
          overseasAgencyType: agentType, //返回值与传参字段不一致，海外代理类型
          overseasAgency: agent, //海外代理
        };
        getClearanceGenerateNumber(params).then((res) => {
          const { mblId, mblNum, ontainerSno, nlCode, remark } = res.data;
          this.$refs.dialogFormRef?.setFormModel({
            mblId,
            mblNum,
            ontainerSno,
            nlCode,
            // remark,
          });
        });
      } else {
        this.$refs.dialogFormRef?.setFormModel({
          nlCode: "",
          mblNum: "",
          ontainerSno: "",
        });
      }
    },
    handleChangeOverseasAgency(val) {
      const isOverseasAgencyMail = [4, 563, "4", "563"].includes(val);
      const mailFind = this.formConfig.lists[0].fieldList[0].rows[0].cols.find(
        (e) => e.id === "is_send_mail"
      );
      this.$set(
        this.customDialogConfig,
        "footer",
        mailFind && isOverseasAgencyMail
          ? [...this.twoFooterBtn, ...this.oneFooterBtn]
          : this.oneFooterBtn
      );
      if (mailFind) {
        Object.assign(mailFind, {
          colItemHide: !isOverseasAgencyMail,
          colKey: Math.random() + "",
        });
        this.$refs.dialogFormRef?.setFormModel({
          is_send_mail: isOverseasAgencyMail,
        });
      }
    },
    submitFormRequest(formModel) {
      const { overallStatus, is_send_mail, ...nFormModel } = formModel || {};
      Object.assign(this.tempObj, {
        is_send_mail,
      });
      if (overallStatus === 14) {
        // 14-海外一审
        return POSTFirstInstance(nFormModel).then(() => {
					POSTSecondInstance(nFormModel)
				});
      }
      return POSTSecondInstance(nFormModel); // 17-海外二审
    },
    handleMailPreview(resRecipientStr) {
      this.$refs.emailRef?.show({ resRecipientStr });
    },
    handleSuccess() {
      const { id, isEmailPreview, is_send_mail } = this.tempObj || {};
      if (isEmailPreview || is_send_mail) {
        getClearanceEmailRecipient({
          isOverseaOrders: 1, // 0-电商/传统 1-海外
          businessId: id,
        }).then((eRes) => {
          if (isEmailPreview) {
            this.handleMailPreview(eRes.data);
          } else if (is_send_mail) {
            getMailMsg({
              tag: "MSG-TEMP-240002", // 模板标识
              id, // 清关ID
              ccRecipientFromBusinessIdList: [],
            }).then((res) => {
              const { defaultCcRecipient, content, subject } = res.data || {};
              postSendMail({
                recipient: eRes.data, // 收件人邮箱
                ccRecipient: defaultCcRecipient,
                content,
                subject,
                attachList: [],
              });
            });
          }
        });
      }
      this.$emit("handleSuccess");
      this.$refs.customDialog.hide();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    SendEmail: () => import("_comp/ComLogistTrack/components/SendEmail"),
  },
};
</script>

<style lang="scss" scoped></style>
