<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
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
              handle: (val) => handleChange(val, slotProps.fieldItem.id),
            }"
            :additionalParam="{
              typeList: slotProps.formModel.agentType == 0 ? '0' : '3',
              isOverseasAgentTow:
                slotProps.formModel.agentType == 0 ? 1 : undefined,
            }"
          />
        </template>
        <template v-slot:deliverAgent="slotProps">
          <AutoComplete
            ref="deliverAgentRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              refreshRequest: deliverAgentRefreshRequest,
            }"
            :additionalParam="{
              typeList: slotProps.formModel.delivertAgentType == 0 ? '0' : '3',
              isOverseasAgentTow:
                slotProps.formModel.delivertAgentType == 0 ? 1 : undefined,
            }"
          />
        </template>
        <template v-slot:warehouseId="slotProps">
          <AutoComplete
            ref="warehouseRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
            }"
            :additionalParam="{
              salesman: slotProps.formModel.salesman,
            }"
          />
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { mapState } from "vuex";
import { config } from "./model";
import { orderBusinessAccept } from "@/api/order/overSeaOther";
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
        title: "业务接单",
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
        labelWidth: "105px",
        lists: [], // 表单渲染列表
        formRules: config().formRules, // 表单校验规则
      },
      agentRefreshRequest: false,
      deliverAgentRefreshRequest: false,
    };
  },
  methods: {
    submitFormRequest(formModel) {
      console.log(formModel);
      return orderBusinessAccept(formModel);
    },
    show(row) {
      const {
        id,
        jobNo,
        overseaBusinessTypes,
        freightType,
        warehouseId,
        warehouseName,
        warehousingTime,
        salesman,
      } = row;
      const params = {
        id,
        jobNo,
        warehouseId,
        warehouseName,
        warehousingTime,
        packingMethod: this.typeConversion(freightType),
        salesman,
      };
      const [type1, type2] = overseaBusinessTypes || [2]; //overseaBusinessTypes 1+2清关  1清关  2派送  3入仓单
      const obj1 = {
        1: "仅清关",
        2: "仅派送",
      };
      const obj2 = {
        2: "清关+派送",
        3: "清关+入仓",
      };
      params.overseaBusinessTypesName = obj2[type2] || obj1[type1];
      if ([type1, type2].includes(2)) params.delivertAgentType = "0";
      if (type2 || type1 === 1) params.agentType = "0";
      this.overseasAgencyType = params.agentType;
      this.formConfig.lists = config(type1, type2, overseaBusinessTypes).lists;
      this.formConfig.formModel = params;
      this.freightType = freightType;
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
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
    handleChange(val, prop) {
      const param = {};
      switch (prop) {
        case "agentType":
          param.agent = "";
          param.agentName = "";
          param.nlCode = "";
          this.overseasAgencyType = val;
          this.agentRefreshRequest = !this.agentRefreshRequest;
          break;
        case "agent":
          if (val) {
            this.getClearanceGenerateNumber(val);
          } else {
            param.nlCode = "";
          }
          break;
        case "delivertAgentType":
          param.deliverAgent = "";
          param.deliverAgentName = "";
          this.deliverAgentRefreshRequest = !this.deliverAgentRefreshRequest;
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
.tag-margin-5 {
  margin-left: 5px;
}
.space-nowrap {
  white-space: nowrap;
}
.Warehouse {
  width: 160px;
  margin-left: 10px;
}
/deep/ {
  .form-tips {
    color: #3179ef;
  }
}
</style>
