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
        <template v-slot:table="slotProps">
          <div>
            <span>{{ title }}</span>
          </div>
          <div>
            <ComTable
              ref="tableConfig"
              :columnConfig="tableConfig.columnConfig"
              :columnData="tableConfig.columnData"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'type'">
                  <span
                    :style="{
                      color: slotProps.dicsList.color,
                    }"
                  >
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'matched'">
                  <span v-if="slotProps.row.matched == 0">
                    ×{{ slotProps.dicsList.nameCn }}
                  </span>
                  <span v-else> √{{ slotProps.dicsList.nameCn }} </span>
                </template>
                <template v-if="slotProps.prop === 'dealingsCompany'">
                  <div>
                    <div v-if="slotProps.row.type == 1">
                      <AutoComplete
                        :formModel="slotProps.row"
                        :fieldItem="{
                          ...slotProps.column.putFieldItem,
                        }"
                        :additionalParam="{
                          customerIdList : formConfig.formModel.operateMain ? [formConfig.formModel.operateMain] : [],
                        }"
                      />
                    </div>
                    <div v-else-if="slotProps.row.type == 0">
                      <div
                        v-if="
                          slotProps.row.isMainBill == 1 ||
                          slotProps.row.isMainBill == 9
                        "
                      >
                        <span>{{
                          slotProps.row.dealingsCompany.customerName || "--"
                        }}</span>
                      </div>
                      <div v-else>
                        <AutoComplete
                          :formModel="slotProps.row"
                          :fieldItem="{
                            ...slotProps.column.payFieldItem,
                          }"
                        :additionalParam="{
                          customerIdList : formConfig.formModel.operateMain ? [formConfig.formModel.operateMain] : [],
                        }"
                        />
                      </div>
                    </div>
                  </div>
                </template>
                <!-- <template v-if="slotProps.prop === 'unitPrice'">
                  <el-input
                    v-model="slotProps.row.unitPrice"
                    @input.native="
                      handleDecimal(
                        slotProps.row,
                        'unitPrice',
                        slotProps.column.decimal
                      )
                    "
                  ></el-input>
                </template> -->
                <template v-if="slotProps.prop === 'price'">
                  <el-input-number
                    v-model="slotProps.row.price"
                    v-input-number-limit="slotProps.column.decimal"
                    :controls="false"
                    :placeholder="slotProps.column.placeholder"
                    @change="getUnitPrice(slotProps.row)"
                  ></el-input-number>
                  <!-- <el-input
                    v-model="slotProps.row.price"
                    :placeholder="slotProps.column.placeholder"
                    @change="getUnitPrice(slotProps.row)"
                    @input.native="
                      handleDecimal(
                        slotProps.row,
                        'price',
                        slotProps.column.decimal
                      )
                    "
                  ></el-input> -->
                </template>
                <template v-if="slotProps.prop === 'quantity'">
                  <el-input-number
                    v-model="slotProps.row.quantity"
                    v-input-number-limit="slotProps.column.decimal"
                    :controls="false"
                    :placeholder="slotProps.column.placeholder"
                    @change="getUnitPrice(slotProps.row)"
                  ></el-input-number>
                  <!-- <el-input
                    v-model="slotProps.row.quantity"
                    :placeholder="slotProps.column.placeholder"
                    @change="getUnitPrice(slotProps.row)"
                    @input.native="
                      handleDecimal(
                        slotProps.row,
                        'quantity',
                        slotProps.column.decimal
                      )
                    "
                  ></el-input> -->
                </template>
                <template v-if="slotProps.prop === 'currencyId'">
                  <AutoComplete
                    :formModel="slotProps.row"
                    :fieldItem="{
                      ...slotProps.column.fieldItem,
                    }"
                  />
                </template>
              </template>
            </ComTable>
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
// import { takeOrders } from "@/api/operateManage/common.js";
// import { mapState } from "vuex";
import { costTrialForm, costTrialTabel } from "./model.js";
// import { handleDecimal } from "@/utils/validate";
import { getSchemeTrial } from "@/api/costScheme/index.js";
import { multiplicationFn, interceptNum } from "@/utils/instructions";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      title: "试算结果规则(开始值<X≤结束值)",
      formConfig: {
        formModel: {},
        // httpRequest: this.submitFormRequest, // 表单提交接口
        // successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
      },
      customDialogConfig: {
        title: "",
        width: "830px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "保 存",
            type: "primary",
            handleClick: () => {
              // this.$refs.dialogForm.submitForm();
              this.handleSuccess();
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
      tableConfig: {
        httpRequest: () => {
          return new Promise((resolve) => {
            resolve();
          });
        },
        columnConfig: costTrialTabel,
        columnData: [],
      },
    };
  },
  methods: {
    // handleDecimal,
    // submitFormRequest(formModel) {
    //   return takeOrders(params);
    // },
    show(row={}) {
      const { operateMain = undefined } = row
      const { id } = this.$route.query;
      const { title, width, lists, formRules, labelWidth } = costTrialForm;
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
      getSchemeTrial(id).then((res) => {
        const { number, totalVolume, totalWeight, warehouseCode, billInfos } =
          res.data;
        this.formConfig.formModel = {
          number,
          totalVolume,
          totalWeight,
          warehouseCode,
          operateMain
        };
        const tableLists = billInfos?.map((e) => {
          const {
            currencyCode,
            currencyId,
            dealingsCompany,
            dealingsCompanyName,
            matched,
            type,
            unitPrice,
            isMainBill,
            price, //单价
            quantity, //数量
            billUnitName, //计费单位
            costId,
            costName
          } = e;
          return {
            type,
            matched,
            isMainBill,
            unitPrice: unitPrice || 0,
            dealingsCompany: dealingsCompany
              ? {
                  customerId: dealingsCompany,
                  customerName: dealingsCompanyName,
                }
              : "",
            dealingsCompanyName: dealingsCompanyName || undefined,
            currencyId: currencyId
              ? {
                  id: currencyId,
                  nameCn: currencyCode,
                }
              : "",
            currencyName:currencyCode,
            price, //单价
            quantity: interceptNum(quantity, 2), //数量
            billUnitName, //计费单位
            costId,
            costName
          };
        });
        this.tableConfig.columnData = tableLists;
        this.$refs.customDialog.show();
      });
    },
    getUnitPrice(row) {
      const { price, quantity } = row;
      const totalMoney = multiplicationFn([price, quantity]);
      row.unitPrice = totalMoney;
    },
    getQueryParams() {},
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess", this.tableConfig.columnData);
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped></style>
