<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:isWarehousing="slotProps">
          <el-radio-group v-model="slotProps.formModel.isWarehousing" disabled>
            <el-radio :key="1" :label="1">是</el-radio>
            <el-radio :key="0" :label="0">否</el-radio>
          </el-radio-group>
          <el-input
            class="Warehouse"
            v-model="transactionWarehouseCodeName"
            disabled
            :title="transactionWarehouseCodeName"
          ></el-input>
        </template>
        <template v-slot:operationOrderNum="slotProps">
          <div class="space-nowrap">
            {{ slotProps.formModel.operationOrderNum }}
            <el-tag
              type="success"
              size="mini"
              color="#35D06F1A"
              :style="{
                color: '#35D06F',
              }"
              v-if="slotProps.formModel.operationOrderType !== 2"
              >{{ orderType[slotProps.formModel.operationOrderType].nameCn
              }}{{
                Number(slotProps.formModel.orderBusinessType) === 1
                  ? "进口"
                  : "出口"
              }}</el-tag
            >
            <el-tag
              type="success"
              size="mini"
              color="#66A5FF1A"
              :style="{
                color: '#66A5FF',
              }"
              class="tag-margin-5"
              v-if="slotProps.dicsData.nameCn"
              >{{ slotProps.dicsData.nameCn }}</el-tag
            >
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import { takeOrders, getSalesman } from "@/api/operateManage/common.js";
import { config } from "@/views/newOrderManage/components/OrderReceiving/model.js";
import { mapState } from "vuex";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      orderType: [
        {
          color: "#35D06F",
          nameCn: "海运",
        },
        {
          color: "#35D06F",
          nameCn: "空运",
        },
      ],
      type: 1,
      extraData: {},
      customDialogConfig: {
        title: "接单",
        width: "750px",
        dataStatus: 0,
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
              this.customDialogConfig.dataStatus = 1;
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
        labelWidth: "90px",
        lists: [], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      transactionWarehouseCodeName: "",
    };
  },
  methods: {
    submitFormRequest(formModel) {
      if (typeof formModel.salesman === "string") {
        formModel.salesman = formModel.salesmanId;
      }
      delete formModel.salesmanId;
      formModel.operationOrderNum && delete formModel.operationOrderNum;
      const params = {
        ...formModel,
        customsClearanceType:
          formModel.customsClearanceType || formModel.customsClearanceType === 0
            ? formModel.customsClearanceType
            : null,
      };
      return takeOrders(params);
    },
    show(row, type, typeOrder) {
      var order;
      if (typeOrder === "ec") {
        order = [2];
      } else {
        order = [2, 3];
      }
      this.type = type;
      this.extraData = row;
      const {
        id: orderId,
        orderType,
        orderNum,
        number,
        orderBusinessType = type != 4 ? 0 : "",
        encasementWay,
        freightType,
        operationOrderType,
        customsClearanceType,
        tradeClause,
        bailorPeople,
        proxyType,
        createBy: orderCreateBy,
        putWarehouseTime,
        countryId,
        customerId, // 客户id
        deptId, // 部门id
        insuredAmount,
        insuranceAmount,
        transactionWarehousePlatformType,
        transactionWarehouseCode,
        transactionWarehouseName,
      } = row;
      getSalesman({
        orderId,
        orderType: orderType || 2,
      }).then((res) => {
        const lists = [...config[type].lists];
        if (orderType === 6) {
          lists[0].span = 12;
          lists.splice(2, 1);
        } else if (orderType === 5) {
          lists[0].span = 24;
        }
        this.transactionWarehouseCodeName =
          transactionWarehouseCode + "/" + transactionWarehouseName; //拼接交货仓CODE和NAME
        this.formConfig = {
          ...this.formConfig,
          formModel: {
            orderId,
            orderType: orderType || 2,
            operationOrderNum: `${type}`.indexOf("3") > -1 ? number : orderNum,
            orderBusinessType,
            freightType:
              `${type}`.indexOf("3") > -1 ? encasementWay : freightType,
            ...(config[type].defaultModel || {}),
            salesman: res.data.userName,
            salesmanId: res.data.userId,
            operationOrderType,
            customsClearanceType,
            tradeClause,
            bailorPeople,
            putWarehouseTime,
            orderCreateBy,
            country: countryId, // 国家
            customerId,
            deptId,
            transactionWarehousePlatformType, //交货仓拼接好字段
            transactionWarehouseCode,
            transactionWarehouseName,
            insuredAmount: insuredAmount || insuranceAmount,
          },
          lists: [
            {
              fieldList: [
                {
                  rows: [
                    {
                      cols: lists,
                    },
                  ],
                },
              ],
            },
          ],
          formRules: config[type].formRules,
        };
        if (typeof this.formConfig.formModel.proxyType === "number") {
          this.formConfig.formModel.proxyType = JSON.stringify(
            this.formConfig.formModel.proxyType
          );
        }
        if ((orderType == 2 || !orderType) && proxyType) {
          this.formConfig.formModel.proxyType = proxyType;
        }
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
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
  width: 90px;
  margin-left: 10px;
}
</style>
