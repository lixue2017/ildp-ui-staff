<template>
  <div>
    <ComDrawer
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComForm
          ref="formRef"
          :formConfig="{
            ...formConfig,
            ...outMergeFormConfig({
              drawerType,
              isBxVerification,
              isCollection,
            }),
          }"
          @handleChange="handleChange"
          v-if="isInt"
        >
          <template v-slot:ids="slotProps">
            <AutoComplete
              ref="idsRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                handle: (val) => getTableData(val, true),
                selectTitWidth: '100%',
              }"
              :additionalParam="{
                currencyCode: slotProps.formModel.currencyCode,
                dealingsCompany: slotProps.formModel.dealingsCompany,
                deptBy: slotProps.formModel.businessCompany,
                isJoinBs: 0,
                statusIn: '50,65',
                costType: 1,
                isMainBillList: [0],
              }"
            />
          </template>
          <template v-slot:cwIds="slotProps">
            <AutoComplete
              ref="idsRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                handle: (val) => getTableData(val, true),
                selectTitWidth: '100%',
              }"
              :additionalParam="{
                currencyCode: slotProps.formModel.currencyCode,
                dealingsCompany: slotProps.formModel.dealingsCompany,
                deptBy: slotProps.formModel.businessCompany,
                isJoinBs: 0,
                statusIn: '50,55',
                costType: 0,
                isMainBillList: [0],
              }"
            />
          </template>
          <template v-slot:table>
            <ComTable
              ref="tableRef"
              :tableHeight="`calc(100vh - ${
                drawerType === 2 ? '486' : '370'
              }px)`"
              :columnConfig="outMergeTableConfig"
              :columnData="tableConfig.columnData"
              :rowOperationBtnListFn="() => tableConfig.statusList"
            >
            </ComTable>
            <div class="grand-total" v-if="tableConfig.columnData.length">
              <template v-for="(tItem, i) in tableSubtotal">
                <span :key="`t_${i}`">
                  <span>{{ tItem.totalLabel }}</span>
                  <span>{{ tItem.totalNum }}</span>
                </span>
              </template>
            </div>
          </template>
        </ComForm>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { outMergeFormConfig, outMergeTableConfig } from "./model.js";
import {
  getPaymentTaskList,
  postPaymentAllocationBatch,
  getCashierList,
  paymentCheck, //付款登记
  cashierPaymentCheck,
  cashierPaymentUploadBankReceipt,
} from "@/api/settlementManage/paymentReceived.js";
import { comSaveRepeatedRequest } from "@/api/common";
export default {
  // props: {
  //   drawerType: {
  //     type: String,
  //     required: true,
  //   },
  // },
  data() {
    return {
      drawerConfig: {
        title: "付款分配",
        width: "1000px",
        footer: [
          {
            text: "确 认",
            type: "primary",
            handleClick: () => {
              this.$refs.formRef?.submitForm();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      outMergeFormConfig,
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest,
        successFunction: this.handleSuccess,
        size: "small",
        labelWidth: "100px",
      },
      outMergeTableConfig,
      tableConfig: {
        tableHeight: "calc(100vh - 370px)",
        columnData: [],
        totalMoney: {},
        statusList: [
          {
            text: "移 除",
            handleClick: this.handleDelete,
          },
        ],
      },
      isInt: false, //初始化清除数据
      drawerType: "",
      uploadFileModel: {
        fileTypeArr: [
          {
            label: "应付账单合同",
            fBtnParam: {
              type: "124",
            },
          },
        ],
      },
      attachId: [],
      isBxVerification: false,
      isCollection: false,
    };
  },
  computed: {
    tableSubtotal() {
      const { pop, rmb, subtotal } = this.tableConfig.totalMoney || {};
      const total = [
        {
          totalLabel: "合计：",
          totalNum: pop || 0,
        },
        {
          totalLabel: "合计金额：",
          totalNum: subtotal || 0,
        },
        {
          totalLabel: "折合RMB：",
          totalNum: `${rmb || 0}RMB`,
        },
      ];
      return total;
    },
  },
  methods: {
    async show(selectionRows, type) {
      this.isInt = false;
      this.drawerType = type;
      if (type === 2) {
        this.isBxVerification = true;
      } else {
        this.isBxVerification = false;
      }
      const nRow = selectionRows && selectionRows[0];
      const ids = (selectionRows || []).map((e) => {
        return {
          id: e.id,
        };
      });
      this.formConfig.formModel = {
        ids,
        currencyCode: nRow?.currencyCode,
        dealingsCompany: nRow?.dealingsCompany,
        businessCompany: nRow?.businessCompany,
        isBxVerification: this.isBxVerification,
      };

      this.getTableData(ids);
      this.$refs.myDrawer.show();
      this.$nextTick(() => {
        this.isInt = true;
      });
    },
    handleChange(val, prop) {
      this.formConfig.formModel[prop] = val;
      if (prop === "isBxVerification") {
        this.isBxVerification = val;
        this.formConfig.formModel.isBxVerification = val;
        this.$nextTick(() => {
          this.$refs.formRef.renewForm();
        });
      }
    },
    getTableData(rows, bol) {
      const { ids, cwIds } = this.$refs.formRef?.getFormParams() || {};
      let id = rows.map((e) => e.id);
      if (bol) {
        if (ids && ids.length) {
          id = ids.map((e) => e.id);
        }
        if (cwIds && cwIds.length) {
          id.push(...cwIds.map((e) => e.id));
        }
      }
      const params = {
        id,
        costType: 1,
      };
      getPaymentTaskList(params).then((res) => {
        this.tableConfig.columnData = res.rows || [];
        this.tableConfig.totalMoney = res.data || {};
        this.isCollection = false;
        if (res.data?.rmb > 0) {
          this.isCollection = true;
        }
        this.$refs.tableRef.setNewTableData(this.tableConfig.columnData);
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.formRef?.renewForm();
          });
        });
      });
    },
    submitFormRequest(formModel) {
      //付款待分配,合并分配
      const { table, ids, cwIds, bxType, bxMoney, ...obj } = formModel;
      if ((ids && ids.length) || (cwIds && cwIds.length)) {
        const listId = (ids || []).map((e) => e.id);
        listId.push(...(cwIds || []).map((e) => e.id));
        const params = {
          ...obj,
          ...(obj.isBxVerification ? { bxType, bxMoney } : {}),
          ids: listId,
          isJoinBs: 0,
          costType: 1,
        };
        return comSaveRepeatedRequest(postPaymentAllocationBatch, params);
      }
      this.$message.error("至少一条单据！");
      return Promise.reject();
    },
    handleDelete(row) {
      const tableData = this.tableConfig.columnData.filter(
        (e) => e.id !== row.id
      );
      let ids = [];
      let cwIds = [];
      tableData.map((e) => {
        if (e.costType) {
          ids.push({
            id: e.id,
          });
        } else {
          cwIds.push({
            id: e.id,
          });
        }
      });
      this.$refs.formRef?.setFormModel({
        ids,
        cwIds,
      });
      this.getTableData(ids);
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    hide() {
      this.$refs.myDrawer.hide();
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .card-uploader {
    .el-upload--picture-card,
    .el-upload-list--picture-card .el-upload-list__item {
      width: 80px;
      height: 80px;
      line-height: 85px;
      margin: 0 18px 0 0;
    }
  }
  .table-class {
    .el-form-item__error {
      display: none;
    }
  }
}
</style>
