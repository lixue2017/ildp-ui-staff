<template>
  <ComDialog
    ref="dialogRef"
    :customDialog="customDialogConfig"
    :dialogBoxCenter="true"
    :confirmClose="false"
  >
    <template v-slot:content>
      <div v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible">
        <ComForm :formConfig="searchTabForm()">
          <template v-slot:slotRowsLeng>
            {{ selectionRows.length }}
          </template>
        </ComForm>
        <ComTable
          class="copy-dlg-table"
          ref="tableRef"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableTabConfig()"
          :getQueryParams="getTableQueryParams"
          :httpRequest="tableConfig.httpRequest"
          @onSelectionChange="onTableSelectionChange"
          :isMountedRequest="false"
          :paginationConfig="{
            limit:
              formConf.formModel.webViewSource === 'webMarketVoyage'
                ? 9999
                : 50, //航次需要同时选中相同项，不能做分页
          }"
          :selectionRowConfig="{
            isSameSelection:
              formConf.formModel.webViewSource === 'webMarketVoyage',
          }"
          :selectionKey="
            formConf.formModel.webViewSource === 'webMarketVoyage'
              ? 'timeStampCognateKey'
              : 'id'
          "
        />
      </div>
    </template>
  </ComDialog>
</template>

<script>
import { copyFormCols, copyTableCols } from "./model";
import {
  getAccountsBillList,
  getMarketAccountsBillList,
  copyMarketAccountsBill,
  postBatchOperate,
} from "@/api/settlementManage/statementManage";
import { comSaveRepeatedRequest } from "@/api/common";
export default {
  props: {},
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      customDialogConfig: {
        width: "850px",
        dlgClassName: "dialog-body-table",
        title: "复制账单",
        footer: [
          {
            text: "确定",
            type: "primary",
            handleClick: () => this.handleBatchOperate(),
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.dialogRef.handleClose();
            },
          },
        ],
      },
      formConf: {
        formModel: {}, // 表单数据
        labelWidth: "92px",
      },
      tempObj: {},
      selectionRows: [],
      tableConfig: {},
    };
  },
  methods: {
    editShow(
      row,
      {
        //businessType 0:操作单 1订舱单  3:清关单(直清)  4:一件代发   5:FBA出库    7:第三方出库    12:清关派送单 ，取值来源于数据字典：settlementBusinessType
        //webViewSource  webMarketVoyage:市场订舱     order:直清直派订单     orderReceiving:第三方订单     webOrderOutbound:一件代发 FBA订单   ecTradOther电商传统其他  取值于各列表跳转详情传参
        editSuccess,
      }
    ) {
      this.tempObj = {
        editSuccess,
      };
      this.tableConfig = {
        tableHeight: "calc(100vh - 324px)",
        httpRequest:
          row.webViewSource === "webMarketVoyage"
            ? getMarketAccountsBillList
            : getAccountsBillList,
      };
      this.formConf.formModel = row || {};
      this.selectionRows = [];
      this.$refs.dialogRef.show();
    },
    onTableSelectionChange(rows = []) {
      // console.log('rows==', rows)
      this.selectionRows = rows || [];
    },
    handleBatchOperate() {
      if (this.selectionRows.length) {
        const {
          customerId,
          id,
          sono,
          isBussiness,
          orderType,
          number,
          orderNum,
          operationOrderNum,
          webViewSource,
          businessType,
          orderSn,
          jobNo,
          WEB_isBussiness,
        } = this.formConf.formModel;
        let opt = {};
        if (webViewSource == "webMarketVoyage") {
          opt = {
            businessType: 1, // 市场航次
            orderId: id,
            orderNum: sono,
            idList: this.selectionRows.map((s) => s.id),
          };
        } else if (
          ["order", "orderReceiving", "webOrderOutbound"].includes(
            webViewSource
          )
        ) {
          opt = {
            orderId: id,
            orderNum: number || orderSn || jobNo,
            businessType,
            isBussiness:
              webViewSource == "order" ? isBussiness : WEB_isBussiness,
            idList: this.selectionRows.map((s) => s.id),
          };
        } else {
          opt = {
            orderId: id,
            orderType,
            orderNum:
              isBussiness === 1
                ? orderType === 2
                  ? number
                  : orderNum
                : operationOrderNum,
            businessType: 0,
            isBussiness, // 1-订单 0-操作单
            idList: this.selectionRows.map((s) => s.id),
          };
        }
        // const copyRequest = webViewSource === 'webMarketVoyage' ? copyMarketAccountsBill : postBatchOperate;
        comSaveRepeatedRequest(copyMarketAccountsBill, opt).then(() => {
          this.$refs.dialogRef.handleClose();
          this.tempObj.editSuccess();
        });
      } else {
        this.msgError("请选择账单");
      }
    },
    getTableQueryParams() {
      const { businessType, webViewSource,operationMain,isBussiness,operateMain } = this.formConf.formModel;
      if (webViewSource == "webMarketVoyage") {
        return {
          businessType: 1, // 1-订舱单
          isBussiness: 0,
          routeSonoId: this.tempObj.orderId,
        };
      } else if (
        ["order", "orderReceiving", "webOrderOutbound"].includes(webViewSource)
      ) {
        return {
          orderId: this.tempObj.orderId,
          businessType: businessType,
          billingMain:webViewSource=='order'?operationMain:undefined,
          isBsContactsJoinNull:webViewSource=='order'?1:undefined
        };
      }
      return {
        orderId: this.tempObj.orderId,
        businessType: 0,
        billingMain:webViewSource=="ecTradOther"&&isBussiness==0?operateMain:undefined,
        isBsContactsJoinNull:webViewSource=="ecTradOther"&&isBussiness==0?1:undefined,

      };
    },
    tableTabConfig() {
      return copyTableCols();
    },
    searchTabForm() {
      const { orderType, webViewSource, businessType,isBussiness,salesman } =
        this.formConf.formModel;
      return {
        ...this.formConf,
        lists: copyFormCols({
          params: {
            orderType,
            businessType, //只有订单的复制账单用到这个字段
            salesman:isBussiness==0&&webViewSource=="ecTradOther"?salesman:undefined//电商传统其他操作单
          },
          webViewSource,
          handle: (val) => {
            this.tempObj.orderId = val;
            this.$refs.tableRef?._toggleRowSelectionMixin({
              newCheckRows: [],
            });
            this.selectionRows = [];
            this.$refs.tableRef?.refreshTable();
          },
        }), // 搜索表单渲染列表
      };
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.copy-dlg-table {
  margin-top: 10px;
}
</style>
