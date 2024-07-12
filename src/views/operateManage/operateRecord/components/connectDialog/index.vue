<template>
  <!-- 清关交接审核与清关交接专用 -->
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
          <template v-slot:freightType="slotProps">
            <span class="tag-blue-color" style="margin-right: 5px">
              {{ slotProps.dicsData.nameCn || "--" }}
            </span>
            <span class="tag-green-color">
              {{ ["海运", "空运"][slotProps.formModel.operationOrderType]
              }}{{
                getDictObj(dictType, slotProps.formModel.orderBusinessType)
              }}
            </span>
          </template>
          <template v-slot:overseasAgency="slotProps">
            <AutoComplete
              ref="overseasAgencyRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                className:
                  slotProps.formModel.overseasAgencyType == '2'
                    ? 'auto-dis-no-icon auto-dis-search'
                    : '',
                disabled: slotProps.formModel.overseasAgencyType == '2',
                handle: (val) => getHttpRequest(val, slotProps.formModel),
              }"
              :additionalParam="{
                isOverseasAgent: [1][slotProps.formModel.overseasAgencyType],
                typeList: [0, 3][slotProps.formModel.overseasAgencyType],
              }"
            />
          </template>
        </ComForm>
      </template>
    </ComDialog>

    <SendEmail
      ref="emailRef"
      :paramObj="{
        // customerId: 1481,
        // kaIdList: [998],
        operationOrderId: formConfig.formModel.operationOrderId,
        webMailTag: 'clearance_qg',
      }"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getFormConfig, getSeeFormConfig, formRulesLists } from "./model.js";
import {
  // clearanceToCustomseEid,
  popClearancePost,
  popTwoClearancePost,
  getclearanceInfoList,
  getClearanceGenerateNumber,
  getClearanceEmailRecipient,
} from "@/api/performance/record.js";
import { getMailMsg, postSendMail } from "@/api/messageService";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    SendEmail: () => import("_comp/ComLogistTrack/components/SendEmail"),
  },
  computed: {
    ...mapState({
      dictType: (state) => state.dictionary.dicsData.orderBusinessType,
    }),
  },
  data() {
    return {
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "106px",
        formRules: {}, // 表单校验规则
      },
      customDialogConfig: {
        title: "",
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
      tempObj: {},
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const {
        remark,
        overseasAgencyType,
        overseasAgency,
        overseasOperator,
        csOperator,
        orderType,
        operationOrderId,
        // operationOrderNum1,
        mblId,
        mblNum,
        ontainerSno,
        nlCode,
        customsClearanceStatus,
        expectWarehouseType,
        reachTime,
        registerNo,
        is_send_mail,
      } = formModel;
      Object.assign(this.tempObj, {
        is_send_mail,
        operationOrderId,
      });
      //清关交接
      let params = {
        agentType: overseasAgencyType, //海外代理类型
        agent: overseasAgency, //海外代理
        overseasOperator, //海外操作员
        csOperator, //长沙操作员
        mblId,
        mblNum,
        boxSn: ontainerSno,
        nlCode,
        expectWarehouseType,
        tootId: operationOrderId,
        orderType,
        remark,
        reachTime,
        registerNo,
      };
      if (orderType === 2 && customsClearanceStatus === 1) {
        // 电商二审
        return popTwoClearancePost(params);
      }
      return popClearancePost(params).then(() => {
				if (orderType === 2) {
					popTwoClearancePost(params);
				}
			});
    },
    async show(row) {
      const desInfo =
        (await getclearanceInfoList(row.operationOrderId)).data || {};
      const {
        orderType,
        customsClearanceStatus,
        operationOrderType,
        proxyTypeId,
        overseasAgency,
      } = desInfo;
      const { isWebHandoverSee } = row || {};
      this.tempObj = {
        // vType: orderType === 2 ? "ecLists" : "tradLists",
      };
      const overseasAgencyType = this.typeConversion(
        desInfo.overseasAgencyType || 0
      );
      const isOverseasAgencyMail = [4, 563, "4", "563"].includes(
        overseasAgency
      ); // 海外代理为荷兰与湖南堡森发送邮件
      const modelCols = isWebHandoverSee ? getSeeFormConfig : getFormConfig;
      const { lists, formRules } = modelCols({
        overseasAgencyType,
        orderType,
        customsClearanceStatus,
        operationOrderType, //订单类型   0是海运  1是空运
        proxyTypeId, //头程代理类型    0是堡森  1是同行
      });
      const is_send_mail =
        isOverseasAgencyMail &&
        !(orderType === 2 && customsClearanceStatus === 1);
      this.formConfig = {
        ...this.formConfig,
        lists,
        formRules,
        formModel: {
          ...desInfo,
          is_send_mail,
          expectWarehouseType: this.typeConversion(desInfo.expectWarehouseType),
          overseasAgencyType,
        },
      };
      this.customDialogConfig.title =
        orderType === 2
          ? `电商${["一审", "二审"][customsClearanceStatus || 0] || ""}交接`
          : "传统清关交接";
      this["dictionary/getDictionary"]([
        "freightType",
        "clearanceReservationWarehouse",
        "orderBusinessType",
      ]).then(() => {
        if (isWebHandoverSee) {
          this.$set(this.customDialogConfig, "footer", [
            {
              text: "取消",
              plain: true,
              handleClick: () => this.hide(),
            },
          ]);
        } else {
          this.handleChangeOverseasAgency(overseasAgency);
        }

        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleMailPreview(resRecipientStr) {
      this.$refs.emailRef?.show({ resRecipientStr });
    },
    handleChange(val, id) {
      if (id === "overseasAgencyType") {
        const ruleValide = ["0", "1"].includes(val)
          ? {
              overseasAgency: formRulesLists["overseasAgency"],
            }
          : {};
        const removeRule = val === "2" ? ["overseasAgency"] : [];
        this.$refs.overseasAgencyRef?.changeFocusRequest({
          isDefaultChange: true,
        });
        this.$refs.dialogFormRef?.setFormRules(ruleValide, removeRule); //根据用户的选择新增与删除校验
      }
    },
    getHttpRequest(val, formModel) {
      this.handleChangeOverseasAgency(val);
      if (val) {
        const {
          operationOrderId,
          freightType,
          overseasAgencyType,
          overseasAgency,
        } = formModel;
        const params = {
          operationOrderId,
          freightType,
          overseasAgencyType,
          overseasAgency,
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
    handleSuccess() {
      const { operationOrderId, isEmailPreview, is_send_mail } =
        this.tempObj || {};
      if (isEmailPreview || is_send_mail) {
        getClearanceEmailRecipient({
          isOverseaOrders: 0, // 0-电商/传统 1-海外
          businessId: operationOrderId,
        }).then((eRes) => {
          if (isEmailPreview) {
            this.handleMailPreview(eRes.data);
          } else if (is_send_mail) {
            getMailMsg({
              tag: "MSG-TEMP-240001", // 模板标识
              id: operationOrderId, // 操作单ID
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
      this.hide();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style lang="scss" scoped></style>
