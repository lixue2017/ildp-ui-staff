<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <div class="tips-class">
        * 已添加费用之后：海外代理类型 不可修改，且类型为堡森时
        海外代理不可修改；
      </div>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        @handleChange="handleChange"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:agent="slotProps">
          <AutoComplete
            ref="agentRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              refreshRequest: agentRefreshRequest,
              disabled:
                slotProps.formModel.agentType == 0 &&
                !!slotProps.formModel.costCount,
              handle: (val) => handleChange(val, slotProps.fieldItem.id),
            }"
            :additionalParam="{
              typeList: slotProps.formModel.agentType == 0 ? '0' : '3',
              isOverseasAgentTow:
                slotProps.formModel.agentType == 0 ? 1 : undefined,
            }"
          />
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import { mapState } from "vuex";
import { formConfig } from "./model";
import {
  getDirecrClearanceInfo,
  clearanceRegistration,
} from "@/api/operateRecord/customsClearance";
import { getClearanceGenerateNumber } from "@/api/performance/record.js";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      customDialogConfig: {
        title: "清关登记",
        width: "850px",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "保存",
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
        labelWidth: "93px",
        lists: formConfig().lists, // 表单渲染列表
        formRules: formConfig().formRules, // 表单校验规则
      },
      agentRefreshRequest: false,
      deliverAgentRefreshRequest: false,
    };
  },
  methods: {
    getDetails(id) {
      return getDirecrClearanceInfo(id).then(({ data }) => {
        const {
          directClearanceOrderDetail: {
            agent,
            agentName,
            agentType,
            costCount,
            customsBroker,
            customsBrokerName,
            reachTime,
            departureTime,
            pdo,
            pod,
            declareTime,
            mblNum,
            registerNo,
            remark,
          },
          warehouseOrderDetailVo,
          bailorPeopleId,
          bailorPeopleName,
          businessUnit,
          businessUnitName,
          id,
          nlCode,
          overseasOperator,
          overseasOperatorName,
        } = data;
        this.freightType = warehouseOrderDetailVo
          ? warehouseOrderDetailVo.packingMethod
          : undefined;
        this.overseasAgencyType = agentType
        return {
          agent,
          agentName,
          agentType: this.typeConversion(agentType),
          costCount,
          customsBroker,
          customsBrokerName,
          bailorPeopleId,
          bailorPeopleName,
          businessUnit,
          businessUnitName,
          id,
          nlCode,
          overseasOperator,
          overseasOperatorName,
          reachTime,
          departureTime,
          pdo: this.typeConversion(pdo),
          pod: this.typeConversion(pod),
          declareTime,
          mblNum,
          registerNo,
          remark,
        };
      });
    },
    getClearanceGenerateNumber(agent) {
      const param = {
        overseasAgencyType: this.overseasAgencyType,
        overseasAgency: agent,
        freightType: this.freightType,
      };
      getClearanceGenerateNumber(param).then(({ data }) => {
        this.$refs.dialogForm.setFormModel({
          nlCode: data.nlCode,
        });
      });
    },
    submitFormRequest(formModel) {
      console.log(formModel);
      return clearanceRegistration(formModel);
    },
    show(row) {
      this.getDetails(row.id).then((data) => {
        const { costCount } = data;
        this.formConfig.lists = formConfig(costCount).lists;
        this.formConfig.formModel = { ...data };
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleChange(val, prop) {
      const param = {};
      switch (prop) {
        case "agentType":
          param.agent = "";
          param.agentName = "";
          param.nlCode = "";
          this.overseasAgencyType = val
          this.agentRefreshRequest = !this.agentRefreshRequest;
          break;
        case "agent":
          if (val) {
            this.getClearanceGenerateNumber(val);
          } else {
            param.nlCode = "";
          }
          break;
        default:
          break;
      }
      if (Object.keys(param).length) {
        this.$refs.dialogForm.setFormModel(param);
      }
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.tips-class {
  padding: 0 20px 20px;
  color: #3179ef;
}
</style>
