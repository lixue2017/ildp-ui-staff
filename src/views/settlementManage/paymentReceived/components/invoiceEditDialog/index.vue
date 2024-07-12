<template>
  <!-- 暂时废弃，2个月内如果没启用再删除 -->
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      class="audit-dialog"
    >
      <template v-slot:content>
        <div>
          <ComForm ref="dialogForm" :formConfig="formConfig">
            <template v-slot:tableData>
              <div class="table-title">
                <span>费用明细</span>
              </div>
              <div>
                <ComTable
                  ref="tableRef"
                  :columnConfig="tableConfig.columnConfig"
                  :columnData="tableConfig.columnData"
                  :tableHeight="tableAutoHeight"
                >
                </ComTable>
                <!-- <div class="grand-total" v-if="subtotalMoney">
                  <span class="title">小计：</span>
                  <span>{{ subtotalMoney }}</span>
                </div>
                <div
                  class="required"
                  v-if="noBillList && !tableConfig.columnData.length"
                >
                  {{ reqText }}
                </div> -->
              </div>
            </template>
            <template v-slot:uploadFile>
              <UploadFile
                :fileData="{
                  ...formConfig.formModel,
                  isSee: true,
                }"
                :fileUploadConfig="{
                  isUploadBtn: false,
                }"
              />
            </template>
          </ComForm>
        </div>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { formLists, formRules, tableColumns } from "./model.js";
import { POSTApplyInvoice } from "@/api/settlementManage/paymentReceived.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    UploadFile: () =>
      import(
        "@/views/settlementManage/paymentReceived/financeCostExpenses/components/uploadFile.vue"
      ),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    expenseInit: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      confirmClose: false,
      customDialogConfig: {
        title: "财务报销单(编辑)",
        width: "1100px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "保存",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm?.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitData, // 表单提交接口
        size: "small",
        labelWidth: "92px",
        formRules, // 表单校验规则
        lists: formLists(),
      },
      tableConfig: {
        columnData: [],
        columnConfig: tableColumns(),
      },
    };
  },
  computed: {
    tableAutoHeight() {
      const tableLength=this.tableConfig.columnData.length
      return tableLength > 4 ? "270px" : `${ tableLength* 39 + 53}px`;
    },
  },
  created() {},
  mounted() {},
  methods: {
    editShowDlg(row = {},{ editSuccess }) {
      const { billInfoList=[],...formModel } = row;
      this.formConfig = {
        ...this.formConfig,
        formModel,
        successFunction: (res) => {
          editSuccess && editSuccess(res)
          this.msgSuccess('保存成功');
          this.$refs.customDialog?.hide();
        },
      };
      this.tableConfig.columnData = billInfoList;
      this.$refs.dialogForm?.setFormModel(this.formConfig.formModel)
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData)
      this.$refs.customDialog?.show();
    },
    hide() {
      this.$refs.customDialog?.hide();
    },
    handleFormSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    submitData(formModel) {
      const { invoiceMoney, invoiceNumber, id } = formModel;
      const params = {
        id: [id],
        invoiceMoney,
        invoiceNumber,
      };
      return POSTApplyInvoice(params);
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.audit-dialog {
  .table-title {
    color: #515151;
    font-weight: bold;
    margin-bottom: 8px;
  }
}
/deep/ {
  .form-column-list {
    flex-direction: column;
    .cols-tabs-info {
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
  .invoice-col {
    display: flex !important;
  }
  .invoice-cols-left {
    flex: 1;
    margin-right: 10px;
  }
  .invoice-cols-right {
    flex: 0.5;
    margin-left: 10px;
    margin-top: 10px;
    .right-bottom {
      background-color: #f0f6e6;
      border-left: 2px solid #63a103;
    }
  }
}
</style>
