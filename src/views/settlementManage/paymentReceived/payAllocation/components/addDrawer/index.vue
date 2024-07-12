<template>
  <div>
    <ComDrawer
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComForm ref="formRef" :formConfig="getFormConfig()" v-if="isInt">
          <template v-slot:ids="slotProps">
            <AutoComplete
              ref="idsRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                handle: getTableData,
                selectTitWidth: '100%',
              }"
              :additionalParam="{
                currencyCode: slotProps.formModel.currencyCode,
                dealingsCompany: slotProps.formModel.dealingsCompany,
                deptBy: slotProps.formModel.businessCompany,
                isJoinBs: slotProps.formModel.isJoinBs,
                statusIn: '50,55',
                isMainBillList: [0],
              }"
            />
          </template>
          <template v-slot:table="slotProps">
            <ComTable
              ref="tableRef"
              :tableHeight="tableConfig.tableHeight[drawerType]"
              :columnConfig="getColumnConfig()"
              :columnData="tableConfig.columnData"
              :rowOperationBtnListFn="() => tableConfig.statusList"
            >
            </ComTable>
            <div class="grand-total" v-if="tableConfig.columnData.length">
              <template v-for="(tItem, i) in tableSubtotal">
                <span :key="`t_${i}`">
                  <span>{{ tItem.totalLabel }}：</span>
                  <span>{{ tItem.totalNum }}</span>
                </span>
              </template>
            </div>
          </template>
          <template v-slot:uploadWater="slotProps">
            <UploadFiles
              :fileData="{
                ...slotProps.formModel,
              }"
              :uploadFileModel="uploadFileModel"
              @attachIdList="getAttachIdList"
            >
            </UploadFiles>
          </template>
        </ComForm>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { getFormConfig, getTableConfig } from "./model.js";
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
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest,
        successFunction: this.handleSuccess,
        size: "small",
        labelWidth: "100px",
        isAttachFileId: true,
        uploadFormConfig: {
          type: "picture-card",
          className: "card-uploader",
          limit: 5,
          accept: ".jpg,.png",
        },
      },
      tableConfig: {
        tableHeight: {
          WEB_outMerge: "calc(100vh - 370px)",
          WEB_uploadWaterBillMerge: "calc(100vh - 640px)",
          WEB_paymentMerge: "calc(100vh - 370px)",
        },
        columnData: [],
        totalMoney: {},
        statusList: [
          {
            text: "移 除",
            handleClick: (row, index) => {
              this.handleDelete(row);
            },
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
      attachId:[]
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
          totalNum: `${rmb}RMB` || "0RMB",
        },
      ];
      return total;
    },
  },
  methods: {
    async show(row, type) {
      this.isInt = false;
      const drawerTitle = {
        WEB_outMerge: "付款分配",
        WEB_paymentMerge: "付款登记",
        WEB_uploadWaterBillMerge: "上传水单",
      };
      this.drawerType = type;
      this.drawerConfig.title = drawerTitle[type];
      if (type == "WEB_outMerge") {
        await this.isintOutMerge(row);
      } else if (type == "WEB_paymentMerge") {
        await this.isintpaymentMerge(row);
      } else if (type == "WEB_uploadWaterBillMerge") {
        await this.isintWaterBillMerge(row);
      }
      this.$refs.myDrawer.show();
      this.isInt = true;
    },
    getAttachIdList(row) {
      this.attachId=row
    },
    isintOutMerge({ selectionRows, isJoinBs }) {
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
        isJoinBs,
      };
      this.getTableData(ids);
    },
    async isintpaymentMerge({ selectionRows }) {
      const ids = selectionRows.map((e) => e.id);
      await cashierPaymentCheck(ids).then((res) => {
        const { data } = res;
        this.formConfig.formModel = {
          ...data,
          ids,
        };
        this.getTableData(selectionRows);
      });
    },
    async isintWaterBillMerge({ selectionRows }) {
      const ids = selectionRows.map((e) => e.id);
      await cashierPaymentCheck(ids).then((res) => {
        const { data } = res;
        this.formConfig.formModel = {
          ...data,
          id: selectionRows[0]?.id,
        };
        this.getTableData(selectionRows);
      });
    },
    getTableData(rows) {
      const params = {
        id: rows.map((e) => e.id),
      };
      getPaymentTaskList(params).then((res) => {
        this.tableConfig.columnData = res.rows || [];
        this.tableConfig.totalMoney = res.data || {};
        this.$refs.tableRef.setNewTableData(this.tableConfig.columnData);
      });
    },
    submitFormRequest(formModel) {
      if (this.drawerType == "WEB_outMerge") {
        //付款待分配,合并分配
        const { table, ids, ...obj } = formModel;
        const params = {
          ...obj,
          ids: ids.map((e) => e.id),
        };
        return comSaveRepeatedRequest(postPaymentAllocationBatch, params);
      } else if (this.drawerType == "WEB_paymentMerge") {
        //付款任务单，主子单付款登记
        const { ids, bankReceiptCheckBy, remark, accountId } = formModel;
        const params = {
          id: ids,
          bankReceiptCheckBy,
          remark,
          accountId,
        };
        return comSaveRepeatedRequest(paymentCheck, params);
      } else if (this.drawerType == "WEB_uploadWaterBillMerge") {
        const { remark, attachId, verificationBy, id } = formModel;
        console.log('this.this.attachId',this.attachId)
        if(this.attachId.length==0){
          this.msgError(`请上传附件`);
          return
        }
        const params = {
          id,
          remark,
          attachId:this.attachId.join(','),
          verificationBy,
        };
        return comSaveRepeatedRequest(cashierPaymentUploadBankReceipt, params);
      }
    },
    handleDelete(row) {
      const tableData = this.tableConfig.columnData.filter((e) => {
        if (e.id == row.id) {
          return false;
        } else {
          return true;
        }
      });
      const ids = tableData.map((e) => {
        return {
          id: e.id,
        };
      });
      this.$refs.formRef?.setFormModel({
        ids,
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
    getFormConfig() {
      const { lists, formRules } = getFormConfig({
        drawerType: this.drawerType,
      });
      const formConfig = {
        ...this.formConfig,
        lists,
        formRules,
      };
      return formConfig;
    },
    getColumnConfig() {
      return getTableConfig({
        drawerType: this.drawerType,
      });
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    //   UploadFile: () =>
    // import(
    //   "@/views/settlementManage/statementManage/billManage/edit/components/UploadFile/index.vue"
    // ),
    UploadFiles: () =>
      import("@/views/operateManage/components/uploadFiles/index.vue"),
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
}
</style>
