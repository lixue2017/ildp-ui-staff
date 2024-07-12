<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:customerId="slotProps">
          <AutoComplete
            ref="shipperObjRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: changeCustomerId,
            }"
          />
        </template>
        <template v-slot:tableSlot="slotProps">
          <ComTable
            ref="tableRef"
            :columnConfig="tableConfig.columnConfig"
            :columnData="tableConfig.columnData"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'settleModel'">
                <el-radio-group v-model="slotProps.row.settleModel">
                  <el-radio :disabled="!slotProps.row.disabled" :label="1"
                    >赊账模式</el-radio
                  >
                  <el-radio :disabled="!slotProps.row.disabled" :label="2"
                    >余额模式</el-radio
                  >
                </el-radio-group>
              </template>
            </template>
          </ComTable>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { mapState } from "vuex";
import { takeOrders } from "@/api/operateManage/common.js";
import { getFormConfig, dialogTableConfig } from "./model.js";
import {
  GETSaveBusinessConfigListParam,
  GETOrderSettleSaveParam,
  POSTOrderSettleSubmit,
} from "@/api/customerManage/customerList.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
        formRules: {}, // 表单校验规则
      },
      customDialogConfig: {
        title: "",
        width: "830px",
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
      tableConfig: {
        tableHeight: "calc(100vh - 320px)",
        columnConfig: dialogTableConfig,
        columnData: [],
      },
      keyList: {
        0: "operationSettleMode", //操作单
        20: "thirdPartySettleMode", //第三方
        25: "wmsReturnSettleMode", //WMS
        30: "overseasFBASettleMode", //整箱出库
        35: "overseasPlatformSettleMode", //一件代发
        40: "monthlyBillSettleMode", //仓租费用
        45: "overseasDeliverySettleMode", //海外派送
        50: "overseasClearanceSettleMode", //海外清关
      },
    };
  },
  computed: {
    ...mapState({
      settlementBusinessType: (state) =>
        state.dictionary.dicsData.settlementBusinessType,
    }),
  },
  methods: {
    submitFormRequest(formModel) {
      const { customerId } = formModel;
      let obj = {};
      this.tableConfig.columnData.map((e) => {
        const { submitKey, settleModel } = e;
        this.$set(obj, `${submitKey}`, settleModel);
      });
      const params = {
        customerId,
        ...obj,
      };
      return POSTOrderSettleSubmit(params);
    },
    async show(row = {}) {
      const { customerId=undefined,customerName=undefined } = row;
      await this.getColumnData({ customerId });
      const { lists, formRules, title } = getFormConfig();
      this.formConfig = {
        ...this.formConfig,
        lists: lists,
        formRules: formRules,
        formModel: {
          customerId,
          customerName
        },
      };
      this.customDialogConfig.title = title;
      this.$refs.customDialog.show();
    },
    async getColumnData(row = {}) {
      const { customerId = undefined } = row;
      let dataList={};
      if (customerId) {
        const { data } = await GETOrderSettleSaveParam(customerId);//获取企业绑定回款类型,每次切换企业信息 就查一次最新的绑定信息
        dataList = data;
      }
      const { data: disabledList } = await GETSaveBusinessConfigListParam();//获取回款类型置灰集合,打开弹窗只查询一次
      let columnData = [];
      //弹窗table从数据字典取的数据,后端没写接口返回,需要自行定义数组结构
      this.settlementBusinessType.map((e) => {
        const { value, nameCn } = e;
        if (!["1", "2", "3"].includes(value)) {
          columnData.push({
            disabled: disabledList.map(String).includes(value),//当前行回款类型是否禁用,(展示)
            orderType: nameCn,//业务类型,(展示)
            submitKey: this.keyList[value],//用于保存提交时的KEY值,(提交必备)
            settleModel: dataList?.customerId//当前绑定回款类型,(选取)
              ? dataList[this.keyList[value]]
              : undefined,
          });
        }
      });
      this.tableConfig.columnData = columnData;
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    changeCustomerId(val=undefined) {
      this.getColumnData({ customerId:val });
    },
    getQueryParams() {
      return {};
    },
  },
};
</script>

<style lang="scss" scoped></style>
