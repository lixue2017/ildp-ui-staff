<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:accountId="slotProps">
          <AutoComplete
            ref="accountIdRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle:changeAccountId,
            }"
            :additionalParam="{
              customerId: slotProps.formModel.businessCompany || undefined,
            }"
          />
        </template>
        <template v-slot:shipCompanyId="slotProps">
          <AutoComplete
            ref="shipCompanyIdRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: (row) => changeShipCompanyId(row),
            }"
          />
        </template>
        <template v-slot:startPortId="slotProps">
          <AutoComplete
            ref="startPortIdRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: (row) => changeStartPortId(row),
            }"
          />
        </template>
        <template v-slot:endPortId="slotProps">
          <AutoComplete
            ref="endPortIdRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: (row) => changeEndPortId(row),
            }"
          />
        </template>
        <template v-slot:TABLE_SLOT="slotProps">
          <div class="slotTableSpace">
            <el-button
              @click="addTableData"
              type="primary"
              size="small"
              :disabled="addDisabled"
              >新增行</el-button
            >
          </div>
          <ComTable
            ref="tableRef"
            :tableHeight="tableHeight"
            :columnConfig="tableConfig.columnConfig"
            :columnData="tableConfig.columnData"
            :rowOperationBtnListFn="() => tableConfig.statusList"
            @getResult="getResult"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'costId'">
                <AutoComplete
                  size="mini"
                  :formModel="slotProps.row"
                  :fieldItem="slotProps.column.fieldItem"
                />
              </template>
              <template v-if="slotProps.prop === 'currencyId'">
                <AutoComplete
                  size="mini"
                  :formModel="slotProps.row"
                  :fieldItem="{
                    ...slotProps.column.fieldItem,
                    handle: (val) => changeCurr(val, slotProps.row),
                  }"
                />
              </template>
              <template v-if="slotProps.prop === 'unitPrice'">
                <el-input-number
                  v-model="slotProps.row.unitPrice"
                  v-input-number-limit="2"
                  @change="(val) => changePriceNum(val, slotProps.row)"
                  :controls="false"
                  size="mini"
                />
              </template>
              <template v-if="slotProps.prop === 'num'">
                <el-input-number
                  v-model="slotProps.row.num"
                  v-input-number-limit="3"
                  :min="0"
                  @change="(val) => changePriceNum(val, slotProps.row)"
                  :controls="false"
                  size="mini"
                />
              </template>
              <template v-if="slotProps.prop === 'totalMoney'">
                <el-input-number
                  v-model="slotProps.row.totalMoney"
                  :controls="false"
                  size="mini"
                />
              </template>
              <template v-if="slotProps.prop === 'remark'">
                <el-input
                  v-model="slotProps.row.remark"
                  size="mini"
                />
              </template>
            </template>
            <template v-slot:bottomTotal>
              <div
                class="grand-total"
                v-if="
                  isitTotalData &&
                  isitTotalData[0] &&
                  isitTotalData[0].subtotal.length > 0
                "
              >
                <template v-for="gross in totalData">
                  <div class="total-class" :key="gross.prop">
                    <span class="title">{{ gross.key }}</span>
                    <template v-for="item in gross.subtotal">
                      <span class="value">{{
                        `${item.label}：${item.value}`
                      }}</span>
                    </template>
                  </div>
                </template>
                <template v-for="gross in isitTotalData">
                  <div class="total-class" :key="gross.prop">
                    <span class="title">{{ gross.key }}</span>
                    <template v-for="item in gross.subtotal">
                      <span class="value">{{
                        `${item.label}：${item.value}`
                      }}</span>
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </ComTable>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import {
  takeOrders,
  GETBillPreviewView,
  POSTBillPreviewView,
} from "@/api/operateManage/common.js";
import { mapState } from "vuex";
import { dialogConfig, tableColumns } from "./model.js";
import { httpGetUserByDept } from "@/comModel/httpSelect.js";
import { multiplicationFn, accumulationFn } from "@/utils/instructions";
import { comSaveRepeatedRequest } from "@/api/common";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComTable: () => import("_comp/ComTable"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      httpGetUserByDept,
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
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
              this.submitBrfore();
            },
          },
        ],
      },
      tableConfig: {
        columnConfig: tableColumns(),
        columnData: [],
        statusList: [
          {
            text: "删除",
            handleClick: (row) => {
              this.deleteTableData(row);
            },
          },
        ],
      },
      totalData: [], //动态变化的总金额
      isitTotalData: [], //初始化的总金额
      isitEnd: false, //初始化获取数据是否完毕
      addDisabled: false,
    };
  },
  computed: {
    tableHeight() {
      const { columnData = [] } = this.tableConfig;
      let height = 0;
      if (columnData.length == 0) {
        height = 53 + 49 * 3;
      } else if (columnData.length < 5) {
        height = 53 + 49 * columnData.length;
      } else {
        height = 53 + 49 * 5;
      }
      return `${height}px`;
    },
  },
  methods: {
    submitBrfore() {
      //提交前做校验
      const submitUnitPrice = this.tableConfig.columnData.some(
        (e) => e.totalMoney === 0
      );
      console.log("submitUnitPrice", submitUnitPrice);
      if (submitUnitPrice) {
        this.msgError("金额不能为0，请检查数据后再进行提交。");
        return;
      }
      const { subtotal = [] } = (this.totalData && this.totalData[0]) || {};
      const { subtotal: isitSubtotal = [] } =
        (this.isitTotalData && this.isitTotalData[0]) || {};
      let isEqual = true;
      isitSubtotal.map((e) => {
        const {
          value = undefined,
          currencyId = undefined,
        } = e || {};
        const data = subtotal.find((e) => e.currencyId == currencyId);
        if (currencyId != data?.currencyId || value != data?.value) {
          isEqual = false;
        }
      });
      if (!isEqual) {
        this.msgError(
          "当前金额总计与初始金额总计不相等，请核实金额信息后再进行提交。"
        );
        return;
      }
      this.$refs.dialogForm.submitForm();
    },
    submitFormRequest(formModel) {
      const { UNCHARTED_COLS_SLOT,TABLE_SLOT, ...obj } = formModel;
      const { accountName, shipCompany, startPort, endPort } =
      this.$refs.dialogForm?.getFormModelVal();
      const params = {
        ...obj,
        var: this.tableConfig.columnData, //后端需要用VAR，虽然是不可用做变量名
        accountName, //开户行
        shipCompany, //船公司
        startPort, //启运港
        endPort, //目的港
      };
      return comSaveRepeatedRequest(POSTBillPreviewView, params);
    },
    async show(row = {}) {
      this.isthis = false;
      const { id: billId, businessCompany } = row;
      const { data } = await GETBillPreviewView({ billId });
      const { var: tableList = [], typeId, ...obj } = data;
      this.addDisabled = tableList.length > 0 ? false : true;
      this.tableConfig.columnData = tableList
      const { lists, formRules, title, width } = dialogConfig();
      this.formConfig = {
        ...this.formConfig,
        formModel: {
          ...obj,
          typeId: this.typeConversion(typeId),
          billId: row?.id || undefined,
          businessCompany,
          openingBank:(data?.openingBank||[]).join(','),
          bankAccount:(data?.bankAccount||[]).join(','),
        },
        lists: lists,
        formRules: formRules,
      };
      this.$refs.dialogForm?.setFormModel(this.formConfig.formModel,true);
      this.customDialogConfig.title = title;
      this.customDialogConfig.width = width;
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.msgSuccess("提交成功");
      this.$emit("handleSuccess");
      this.hide();
    },
    addTableData() {
      // const { columnData } = this.tableConfig;
      const newObj = [
        {
          currencyId: 1,
          // unitPrice:1,
          // num:1,
          // totalMoney:1,
          currencyCode: "RMB",
          // remark: '',
        },
      ];
      this.tableConfig.columnData = [...newObj, ...this.tableConfig.columnData];
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
    },
    deleteTableData(row = {}) {
      const { id } = row;
      const index = this.tableConfig.columnData.findIndex((e) => e.id == id);
      this.tableConfig.columnData.splice(index, 1);
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
      this.$refs.tableRef?.refreshTable();
    },
    changeCurr(val, row = {}) {
      this.$refs.tableRef?.refreshTable();
    },
    changePriceNum(val = 0, row = {}) {
      const { unitPrice = 0, num = 0 } = row;
      row.totalMoney = multiplicationFn([unitPrice, num], 2);
      this.$refs.tableRef?.refreshTable();
    },
    changeAccountId(rows=[]) {
      const id=rows.map((e)=>e.id)
      const accountName=(rows.map((e)=>e.accountName))
      const openingBank=(rows.map((e)=>e.openingBank)||[]).join(',')
      const bankAccount=(rows.map((e)=>e.bankAccount)||[]).join(',')
      // const {
      //   openingBank = "",
      //   bankAccount = "",
      //   accountName = "",
      //   id: accountId = "",
      // } = row;
      this.$refs.dialogForm?.setFormModel({
        openingBank,
        bankAccount,
        accountName,
        accountId:id,
      });
    },
    changeShipCompanyId(row = {}) {
      const { label: shipCompany = "", id: shipCompanyId = "" } = row;
      this.$refs.dialogForm?.setFormModel({
        shipCompany,
        shipCompanyId,
      });
    },
    changeStartPortId(row = {}) {
      const { label: startPort = "", id: startPortId = "" } = row;
      this.$refs.dialogForm?.setFormModel({
        startPort,
        startPortId,
      });
    },
    changeEndPortId(row = {}) {
      const { label: endPort = "", id: endPortId = "" } = row;
      this.$refs.dialogForm?.setFormModel({
        endPort,
        endPortId,
      });
    },
    getResult(row = {}) {
      const { tableData = [] } = row;
      const currencyIds = [...new Set(tableData.map((e) => e.currencyId))];
      this.totalData = [
        {
          key: "当前金额总计：",
          subtotal: currencyIds.map((e) => {
            const { currencyCode, currencyId } = tableData.find(
              (someE) => someE.currencyId == e
            );
            return {
              label: currencyCode,
              currencyId,
              value: accumulationFn(
                tableData.map((sE) => {
                  if (e == sE.currencyId) {
                    return sE.totalMoney;
                  }
                })
              ),
            };
          }),
        },
      ];
      if (!this.isitEnd) {
        // this.isitTotalData = JSON.parse(JSON.stringify(this.totalData));
        this.isitTotalData = [
          {
            key: "初始金额总计：",
            subtotal: currencyIds.map((e) => {
              const { currencyCode, currencyId } = tableData.find(
                (someE) => someE.currencyId == e
              );
              return {
                label: currencyCode,
                currencyId,
                value: accumulationFn(
                  tableData.map((sE) => {
                    if (e == sE.currencyId) {
                      return sE.totalMoney;
                    }
                  })
                ),
              };
            }),
          },
        ];
        this.isitEnd = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.form-class .form-title {
  margin: 6px 0 6px;
}
.slotTableSpace {
  text-align: right;
  margin-bottom: 6px;
}
.grand-total {
  display: flex;
  // justify-content: flex-start;
  justify-content: space-between;
  .title {
    margin-right: -30px;
    font-size: 14px;
    font-weight: bold;
  }
  .value {
    margin-left: 30px;
  }
}
</style>
