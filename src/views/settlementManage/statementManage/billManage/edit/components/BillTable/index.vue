<template>
  <div class="bill-table">
    <div class="base-flex-between table-title">
      <div style="font-weight: 600">账单明细</div>
      <div class="rightBtn">
        <template v-if="basicConfig.activeTab === '3'">
          <div>
            <div class="bill-class">
              <el-button @click="previewEdit" type="primary" size="small"
                >编 辑</el-button
              >
              <el-button @click="sendExport" type="primary" size="small"
                >导 出</el-button
              >
              <el-button @click="sendMail" type="primary" size="small"
                >发送邮箱</el-button
              >
              <template v-for="(item, index) in billLists">
                <PreviewOrDownload
                  :key="index"
                  :btnTxt="item.label"
                  :previewDownloadConf="previewDownloadConfig(item.type)"
                />
              </template>
            </div>
            <div class="tips-class">
              <span> 账单附件：多单号默认显示最新的订单对应信息 </span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <ComTable
      ref="billDetails"
      :tableHeight="tableAutoHeight"
      :columnConfig="billTable.columnConfig"
      :httpRequest="billTable.httpRequest"
      :getQueryParams="getQueryParams"
      :selectionRow="selectionRowEvt"
      :pagination="basicConfig.activeTab == 3 ? true : false"
      @onSelectionChange="onTableSelectionChange"
      @handleTableView="handleUpdate"
      @getResult="handleGetResult"
      :paginationConfig="{
        limit: tableLimit,
        total: 50,
        pageSizes: [50, 100, pageTotal],
      }"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'operation'">
          <div class="operate-btn-list">
            <div class="btn">
              <el-button
                class="operate-icon"
                size="small"
                type="text"
                @click="handleDelete(slotProps.row)"
                :disabled="columnData.length === 1"
              >
                移除
              </el-button>
            </div>
          </div>
        </template>
      </template>
      <template v-slot:bottomTotal>
        <div class="grand-total">
          <span class="title">小计：</span>
          <span>{{ subtotalMoney }}</span>
        </div>
      </template>
    </ComTable>

    <div class="operate-bottom" v-if="!this.basicConfig.display">
      <el-button
        class="operate-icon add-btn"
        @click="handleAdd"
        type="primary"
        :disabled="addDisabled"
      >
        <i class="el-icon-plus"></i>
        添加
      </el-button>
    </div>

    <slot name="historySlot" />
    <slot name="fileSlot" />

    <template v-if="!this.basicConfig.display">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <el-button
          class="operate-icon"
          type="primary"
          @click="handleSaveAndSubmit"
          v-throttle
        >
          保存并提交
        </el-button>
        <el-button
          class="operate-icon"
          v-throttle
          type="primary"
          @click="handleSave"
        >
          保 存
        </el-button>
        <el-button class="operate-icon" type="info" @click="back">
          取 消
        </el-button>
      </div>
    </template>
    <PreviewEdit ref="PreviewEditRef" />
    <AddDrawer ref="addDrawer" @handleSuccess="addRows" />
    <SendEmail
      ref="emailRef"
      :paramObj="{
        billId: billFormData.id,
        customerId: billFormData.dealingsCompany,
        salesmanId: billFormData.salesman,
        billStrIds: (columnData || []).map((e) => e.id),
        kaIdList: billFormData.kaIdList,
        billTootIds: (columnData || [])
          .filter((e) => [0, '0'].includes(e.businessType))
          .map((e) => e.jumpId)
          .join(','),
        webMailTag: 'bill_zd',
      }"
    />
  </div>
</template>

<script>
import { settleAccountsList } from "@/api/settlementManage/statementManage";
import {
  uploadSettleBill,
  getAccountsSubtotal,
  POSTExportListAndGoods,
} from "@/api/common";
import { mapActions, mapState } from "vuex";
import { accumulationFn } from "@/utils/instructions";
import { billColumns, operation, jumpPageParams } from "./model";
import { comFileDownload } from "@/utils/download.js";
export default {
  props: {
    basicConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    billFormData: {
      type: Object,
      default: () => ({}),
    },
    columnList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    formModel: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AddDrawer: () =>
      import(
        "@/views/settlementManage/statementManage/billManage/components/AddDrawer"
      ),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    SendEmail: () => import("_comp/ComLogistTrack/components/SendEmail"),
    PreviewEdit: () => import("../previewEdit"),
  },
  computed: {
    ...mapState({
      billPageDict: (state) => state.dictionary.dicsData.billPageNo,
    }),
    tableAutoHeight() {
      const tableLen = this.columnData.length;
      return tableLen > 7 ? "390px" : undefined;
    },
  },
  data() {
    let tableColumns = [];
    if (this.basicConfig.display) {
      tableColumns = [...billColumns(this.formModel.type)];
    } else {
      tableColumns = [
        ...billColumns(this.formModel.type).filter(
          (e) => e.type !== "selection"
        ),
        operation,
      ];
    }
    return {
      // isChecking: true,
      formData: {},
      addDisabled: true,
      billTable: {
        columnConfig: tableColumns,
        // httpRequest: (e) => settleAccountsList(e),
        httpRequest: (e) => {
          return new Promise((resolve) => {
            settleAccountsList(e).then((res) => {
              this.addDisabled = false; //解决详情明细接口未响应完毕用户就去添加明细，导致没有获取已有明细IDS接口查询数据异常的问题
              resolve(res);
            });
          });
        },
      },
      tableLimit: 50,
      pageTotal: 120,
      columnData: [],
      subtotalMoney: 0,
      selectionRows: [],
      billLists: [
        { label: "中文账单", type: "0" },
        { label: "香港账单", type: "1" },
        { label: "英文账单", type: "2" },
      ],
    };
  },
  mounted() {
    // this.settleAccountsList();
  },
  watch: {
    columnList: {
      deep: true,
      handler: function (newVal, oldVal) {
        //详情翻页
        // this.settleAccountsList();
        this.$refs.billDetails.refreshTable(true);
      },
    },
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    calcTotal(list = []) {
      let moneyArr = [];
      // 新增时从列表获取类型
      const viewType =
        this.basicConfig.activeTab === "1" ? list[0].type : this.formModel.type;
      list.forEach((e) => {
        const curIndex = moneyArr.findIndex(
          (m) => m.currencyCode === e.currencyCode
        );
        // const tMoney = e.type !== viewType ? -e.totalMoney : +e.totalMoney;
        const tMoney = +e.totalMoney; //对账单核销之前只会出现一种类型的账单明细，不会再出现应收应付混合需要判断计算相减
        if (curIndex > -1) {
          // 不同类型相减
          moneyArr[curIndex].totalMoney = accumulationFn([
            moneyArr[curIndex].totalMoney,
            tMoney,
          ]);
        } else {
          moneyArr.push({
            currencyCode: e.currencyCode,
            totalMoney: tMoney,
          });
        }
      });
      this.subtotalMoney = moneyArr
        .map((e) => this.formatMoney(e.totalMoney) + e.currencyCode)
        .join(" + ");
    },
    handleDelete(row) {
      const rows = this.columnData.filter((e) => e.id !== row.id);
      this.$set(this, "columnData", rows);
      this.calcTotal(rows);
      this.$refs.billDetails?.setNewTableData(rows);
    },
    handleAdd() {
      this.$refs.addDrawer.show(this.columnData);
    },
    addRows(rows) {
      this.columnData.push(...rows);
      this.$refs.billDetails?.setNewTableData(this.columnData);
      this.calcTotal(this.columnData);
    },
    back() {
      this.$emit("goBack");
    },
    handleSave() {
      const { count, standardCurrency, assistCurrency } = this.formData;
      this.$emit("handleSave", {
        rows: this.columnData,
        total: {
          billNum: count,
          convertBaseMoney: standardCurrency,
          convertHelpMoney: assistCurrency,
        },
      });
    },
    handleSaveAndSubmit() {
      //保存并提交
      const { count, standardCurrency, assistCurrency } = this.formData;
      this.$emit("handleSave", {
        rows: this.columnData,
        total: {
          billNum: count,
          convertBaseMoney: standardCurrency,
          convertHelpMoney: assistCurrency,
          status: 1,
        },
      });
    },
    // 账单预览、下载参数与接口
    previewDownloadConfig(viewType) {
      // const idStr = this.selectionRows.map((e) => e.id).join(",");
      const { id } = this.formModel;
      const { businessCompany } = this.billFormData;
      let orderType = undefined;
      if (this.selectionRows.length) {
        orderType = this.selectionRows[0].orderType;
      }
      return {
        previewParam: {
          // idStr,
          billId: id,
          viewType,
          businessCompany,
          orderType,
        },
        downloadBeforeFn: () => {
          const noLen = !this.selectionRows.length;
          if (noLen) {
            this.msgError("请先勾选费用");
          }
          return !noLen;
        },
        previewHttp: uploadSettleBill,
      };
    },
    previewBill(command) {},
    selectionRowEvt(row) {
      return true; // 可选
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = JSON.parse(JSON.stringify(rows));
      this.$refs.billDetails._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    async handleUpdate(row, col) {
      const orderId = row["orderId"] || undefined;
      const joinOrderId = row["joinOrderId"] || undefined;
      if (col.prop === "contactsBankNo") {
        const path =
          row.type == 0
            ? "/settlementManagement/statementManage/payMentBillManage"
            : "/settlementManagement/statementManage/collectionBillManage";
        this.$router.push({
          path,
          query: {
            params: JSON.stringify({
              // contactsBillIdList: row.contactsBillIdList,
              bankReceiptNo: row.contactsBankNo,
            }),
          },
        });
      } else if (col.cPageNoKey == "pageNo") {
        if (row[col.cPageNoKey] && row[col.cPageNoKey] == -1 && !orderId) {
          return this.$message.error("未关联单号 ，请先去关联确认");
        } else if (
          !row[col.cPageNoKey] ||
          row[col.cPageNoKey] == 0 ||
          !orderId
        ) {
          return this.$message.error("无法跳转");
        }
      } else if (col.cPageNoKey == "joinPageNo") {
        if (row[col.cPageNoKey] && row[col.cPageNoKey] == -1 && !joinOrderId) {
          return this.$message.error("未关联单号 ，请先去关联确认");
        } else if (
          !row[col.cPageNoKey] ||
          row[col.cPageNoKey] == 0 ||
          !joinOrderId
        ) {
          return this.$message.error("无法跳转");
        }
      }
      await this["dictionary/getDictionary"](["billPageNo", "billType"]);
      // console.log('billPageDict==', this.billPageDict)
      const pageObj = this.billPageDict.find(
        (e) => e.value == row[col.cPageNoKey]
      );
      if (!pageObj) {
        return;
      }
      //isBussiness 仅仓租日账单使用
      let isBussiness =
        row[col.cPageNoKey] == 111 && col.cPageNoKey == "pageNo"
          ? row.isBussiness
          : row[col.cPageNoKey] == 111 && col.cPageNoKey == "joinPageNo"
          ? row.joinIsBussiness
          : undefined;
      const orderType = [202, 203, "202", "203"].includes(row[col.cPageNoKey])
        ? row[col.cOrderType]
        : undefined;
      const id =
        [111, 204].includes(row[col.cPageNoKey]) &&
        ["pageNo", "joinPageNo"].includes(col.cPageNoKey)
          ? row.orderId
          : row[col.cOrderIdKey];
      const { nameCn: path, expandVal: activeMenu = undefined } = pageObj;
      this.$router.push({
        path,
        query: {
          id,
          orderType, // 传统与其他订单详情
          isBussiness,
          backPath: this.$route.fullPath,
          activeMenu,
        },
      });
    },
    sendExport() {
      const params = {
        ...this.getQueryParams(),
      };
      comFileDownload(this, POSTExportListAndGoods, params);
    },
    previewEdit() {
      this.$refs.PreviewEditRef?.show(this.formModel);
    },
    sendMail() {
      // const orderIdList = this.selectionRows.map((e) => e.id);
      // const {
      //   businessCompany,
      //   dealingsCompany,
      //   id: orderId,
      // } = this.billFormData;
      // {
      //   orderId,
      //   orderIdList,
      //   businessCompany,
      //   viewType: "0",
      //   dealingsCompany,
      // }
      this.$refs.emailRef.show();
    },
    getQueryParams() {
      const {
        idRows: idsrc,
        id: reconciliationId,
        bsStatus,
      } = this.$route.query;
      return {
        idsrc,
        bsStatus,
        reconciliationId,
      };
    },
    handleGetResult({ tableData, total }) {
      this.pageTotal = total > 100 ? total : 120;
      const { limit = 50 } = this.$refs.billDetails?.getPaging() || {};
      this.tableLimit = limit;
      //初始化汇总接口返回，根据全账单数据计算汇总而不是分页数据
      const { id } = this.formModel;
      const { activeTab } = this.basicConfig;
      // const { idRows: idsrc } = this.$route.query;
      const ids = tableData.map((e) => e.id);
      const params = {
        reconciliationId: id,
        // ids: idsrc?.split(","),
        ids,
      };
      this.columnData = tableData; //用于新增修改时候的添加账单明细
      this.$emit("getFriDetail", this.columnData[0]);
      if (activeTab === "3" && !this.isInitTableSelect) {
        this.isInitTableSelect = true;
        this.onTableSelectionChange(this.columnData); // 默认全选
      }
      getAccountsSubtotal(params).then((res) => {
        this.subtotalMoney = res.data
          .map((e) => this.formatMoney(e.money) + e.currencyCode)
          .join(" + ");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bill-table {
  .table-title {
    margin-top: 10px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .title {
    margin-right: -30px;
    font-size: 14px;
    font-weight: bold;
  }
  .operate-bottom {
    float: right;
    margin-top: 17px;
    .add-btn {
      background: #ff813d;
      box-shadow: 0px 3px 6px 0px rgba(255, 104, 22, 0.2);
      border-color: #ff813d;
      border-radius: 2px;
    }
  }
  .grand-total {
    display: flex;
    justify-content: flex-start;
  }
  .rightBtn {
    display: flex;
    align-items: center;
    /deep/.dropdown {
      margin-left: 15px;
    }
    /deep/ .bill-class {
      margin-left: 15px;
      & > span {
        margin-left: 15px;
      }
    }
    .tips-class {
      margin-left: 15px;
      margin-top: 5px;
      color: #ff6767;
      font-size: 12px;
    }
  }
}
</style>
