<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
        ref="dialogForm"
        :formConfig="{
          ...formConfig,
          ...formConfigModel({
            operationType: formConfig.formModel.operationType,
            operationAgent: formConfig.formModel.operationAgent,
            proxyTypeDicts,
          }),
        }"
        @handleChange="handleChange"
      >
        <template v-slot:proxy="slotProps">
          <AutoComplete
            ref="routeRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              refreshRequest: refreshRequestRoute,
            }"
            :additionalParam="{
              ...proxyAdditionalParam,
            }"
          />
        </template>
        <template v-slot:operationAgent="slotProps">
          <AutoComplete
            ref="routeRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle:(val)=>handleChange(val,'operationAgent')
            }"
            :additionalParam="{
              idsNotIn:slotProps.formModel.operateMain
            }"
          />
          </template>


      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { formConfig } from "./model";
import {
  billBusinessSubmit,
  getTypeByOperationList,
} from "@/api/order/firstTransport.js";
import { settleAccountsOrderList } from "@/api/settlementManage/statementManage";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      customDialogConfig: {
        title: "业务提交",
        width: "500px",
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
        httpRequest: (params) =>
          billBusinessSubmit({ ...params, remark: params.businessRemark }), // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        errorFunction: this.handleError, // 表单提交失败回调
        labelWidth: "95px",
      },
      formConfigModel: formConfig,
      formData: {},
      proxyAdditionalParam: {},
      proxyTypeDicts: [],
      proxyTypeDictsObj: {},
      refreshRequestRoute: false,
    };
  },
  methods: {
    show(row) {
      const { id: orderId, orderType, number, orderNum, businessRemark,operateMain } = row;
      settleAccountsOrderList({
        orderId,
        orderType,
        number: number || orderNum,
        isBussiness: 1,
        pageNum: 1,
        pageSize: 1,
      }).then((res) => {
        const { billList = [] } = res.data || {};
        if (billList && billList.length) {
          this.formData = row;
          const operationType = "0";
          this.formConfig = {
            ...this.formConfig,
            formModel: {
              orderId,
              orderType,
              businessRemark,
              operationType,
              proxyType: "",
              operateMain
            },
            ...formConfig({ operationType }),
          };
          this.$refs.customDialog.show();
        } else {
          this.$message.error("请先补充账单信息之后再业务提交");
          this.$emit("handleError", row, { code: 1002 });
        }
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleChange(val, prop) {
      console.log(val, prop);
      switch (prop) {
        case "operationType":
          this.formConfig.formModel.operationType = val;
          this.$nextTick(() => {
            this.$refs.dialogForm.renewForm();
          });
          break;
        case "operationAgent":
          this.getProxyType(val).then(() => {
            this.$nextTick(() => {
              this.$refs.dialogForm.renewForm();
            });
          });
          break;
        case "proxyType":
          this.changeProxyType(val);
          break;

        default:
          break;
      }
    },
    getProxyType(operationAgent) {
      return new Promise((resolve, reject) => {
        this.formConfig.formModel.operationAgent = operationAgent;
        if (operationAgent) {
          getTypeByOperationList(operationAgent).then((res) => {
            const proxyTypeDicts = res.data;
            const proxyTypeDictsObj = {};
            proxyTypeDicts.forEach((item) => {
              proxyTypeDictsObj[item.value] = item;
            });
            this.proxyTypeDicts = proxyTypeDicts;
            this.proxyTypeDictsObj = proxyTypeDicts;
            if (proxyTypeDicts && proxyTypeDicts.length) {
              const proxyType = proxyTypeDicts[0].value;
              this.formConfig.formModel.proxyType = proxyType;
              this.$refs.dialogForm.setFormModel({
                proxyType,
              });
              this.changeProxyType(proxyType);
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    changeProxyType(val) {
      const { isPublic, customerIds } = this.proxyTypeDictsObj[val] || {};
      if (isPublic) {
        const { id: orderId, orderType, freightType } = this.formData;
        this.proxyAdditionalParam = {
          typeList: "3",
          isQueryFirstDept: 1,
          orderId,
          orderType,
          freightType,
        };
      } else {
        this.proxyAdditionalParam = {
          typeList: undefined,
          ids: customerIds,
        };
      }
      this.$refs.dialogForm.setFormModel({
        proxy: "",
      });
      this.refreshRequestRoute = !this.refreshRequestRoute;
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    handleError(err) {
      if (err?.code === 1002) {
        this.msgError(err.msg || "");
      }
      this.$emit("handleError", this.formData, err);
      this.hide();
    },
  },
};
</script>
