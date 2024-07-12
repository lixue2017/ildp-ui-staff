<template>
  <!-- 收、付款信息详情tabs -->
  <div class="bill-table">
    <ComTabs class="details-tabs-btn" :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <template
            v-if="
              ['2', '3', '6'].includes(tab.name) &&
              tab.name === tabsConfig.activeName
            "
          >
            <div class="tab-tit-box" v-if="['2', '3'].includes(tab.name)">
              <div class="table-tab-title">
                <span>{{ billTable[`title_${tab.name}`] }}</span>
              </div>

              <div class="merge-info" v-if="tab.name === '3'">
                <div v-for="(mItem, mIdx) in mergeInfoArr" :key="`m_${mIdx}`">
                  <span>{{ mItem.mName }}</span>
                  <span>{{ mItem.mKey }}</span>
                </div>
              </div>
            </div>

            <ComTable
              :ref="`tableDesRef${tab.name}`"
              :columnConfig="tableCols(tab.name)"
              :httpRequest="tabsTableHttpRequest"
              :getQueryParams="getQueryParams"
              :pagination="tabsConfig.activeName == 2 ? true : false"
              :isMountedRequest="false"
              @handleTableView="handleUpdate"
              @getResult="handleGetResult(tab.name)"
            >
              <template v-slot:bottomTotal>
                <div class="grand-total" v-if="tab.name === '2'">
                  <span>
                    <span class="label">小计：</span>
                    <span class="value">{{ totalMoney }}</span>
                  </span>
                </div>
              </template>
            </ComTable>
          </template>
          <template
            v-if="tab.name === '4' && tab.name === tabsConfig.activeName"
          >
            <BillHistoryTable
              :historyModel="formData"
              :httpRequest="getBankReceiptRecord"
            />
          </template>

          <template
            v-if="tab.name === '5' && tab.name === tabsConfig.activeName"
          >
            <!-- <ComAttachTable ref="attachTableRef" /> -->
            <UploadFile
              :fileData="{
                type: formData.type,
                ...formData,
                isSee: true,
              }"
              :fileUploadConfig="getFileUploadConfig()"
              @seeUploadFn="seeUploadFn"
            />
          </template>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  billColumns,
  taskPayColumns,
  mergeTableCols,
  resultsTableCols,
  uploadFilesType
} from "./model";
import {
  getOperatorInfo,
  getBankReceiptRecord,
} from "@/api/settlementManage/paymentReceived";
import { getAccountsSubtotal } from "@/api/common.js";
import { settleAccountsList } from "@/api/settlementManage/statementManage.js";
import { POSTCashierUploadPaymentInvoice } from "@/api/settlementManage/statementManage";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComTable: () => import("_comp/ComTable"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
    BillHistoryTable: () =>
      import(
        "@/views/settlementManage/statementManage/billManage/edit/components/BillTable/historyBill.vue"
      ),
    UploadFile: () =>
      import(
        "@/views/settlementManage/paymentReceived/financeCostExpenses/components/uploadFile.vue"
      ),
  },
  computed: {
    ...mapState({
      billPageDict: (state) => state.dictionary.dicsData.billPageNo,
    }),
  },
  data() {
    let name = "收款";
    if (this.formData.type === 0) {
      name = "付款";
    }
    return {
      getBankReceiptRecord,
      tabsConfig: {
        activeName: "2",
        slotTabs: true,
        handleTabsClick: () => {
          setTimeout(() => {
            this.handleTabsChange(this.tabsConfig.activeName);
          });
          // this.changeColumnData(this.tabsConfig.activeName);
        },
        tabs: [
          // {
          //   label: "相关付款单",
          //   name: "1",
          // },
          {
            label: "账单明细",
            name: "2",
          },
          // {
          //   label: "合并付款信息",
          //   name: "3",
          // },
          {
            label: `历史${name}记录`,
            name: "4",
          },
          {
            label: "附件信息",
            name: "5",
          },
          {
            label: "操作记录",
            name: "6",
          },
        ],
      },
      billTable: {
        title_2: `${name}账单明细`,
        title_3: `本次合并${name}信息`,
      },
      mergeInfoArr: [
        {
          mName: "关联水单：",
          mKey: "xx_merge_1",
        },
        {
          mName: "水单交易：",
          mKey: "xx_merge_2",
        },
        {
          mName: "付款账号：",
          mKey: "xx_merge_3",
        },
        {
          mName: "账号开户行：",
          mKey: "xx_merge_4",
        },
      ],
      totalMoney: 0,
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary");
  },
  mounted() {
    // this.initializationData();
    const { activeName } = this.tabsConfig;
    console.log("formData", this.formData);
    setTimeout(() => {
      this.handleTabsChange(activeName);
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleTabsChange(tName) {
      switch (tName) {
        // case "5":
        //   this.$refs.attachTableRef[0]?.setFileList(
        //     this.formData.attachList || []
        //   );
        //   break;
        case "3":
          this.$refs[`tableDesRef${tName}`][0].setNewTableData(
            this.formData.batchTaskAccount || []
          );
          break;
        case "2":
          this.$refs[`tableDesRef${+tName}`][0].refreshTable(true);
          // this.$refs[`tableDesRef${tName}`][0].setNewTableData(
          //   this.formData.costDetail
          // );
          break;
        case "6":
          this.$refs[`tableDesRef${+tName}`][0].refreshTable(true);
          // getOperatorInfo({ id: this.formData.id }).then((res) => {
          //   this.$refs[`tableDesRef${tName}`][0].setNewTableData(res.rows);
          // });
          break;
        default:
          break;
      }
    },
    getFileUploadConfig(row) {
      const obj = uploadFilesType(this.formData);
      const fileUploadConfig={
        ...obj,
        submitHttpRequest:this.submitUploadFile
      }
      return fileUploadConfig;
    },
    submitUploadFile(row){
      const { id }=this.formData
      const {attachIds}=row
      const params={
        id,
        attachId:attachIds.join(',')
      }
      return POSTCashierUploadPaymentInvoice(params)
    },
    seeUploadFn() {
      this.$emit("detailUploadFn");
    },
    // initializationData() {
    //   //初始化数据
    //   this.getMoneyTotal(this.formData.costDetail);
    //   setTimeout(() => {
    //     this.$refs[
    //       `tableDesRef${this.tabsConfig.activeName}`
    //     ][0].setNewTableData(this.formData.costDetail);
    //   });
    // },
    // changeColumnData(active) {
    //   if (active === "1") {
    //     this.billTable.columnData = this.formData.batchTaskAccount;
    //   } else if (active === "2") {
    //     this.billTable.columnData = this.formData.costDetail;
    //   }
    // },
    tableCols(tName) {
      const col = {
        1: taskPayColumns,
        2: billColumns,
        3: mergeTableCols,
        6: resultsTableCols,
      };
      return col[tName] || [];
    },
    getMoneyTotal(list = []) {
      let moneyArr = [];
      list.forEach((e) => {
        const curIndex = moneyArr.findIndex((m) => m.currency === e.currency);
        if (curIndex > -1) {
          // 不同类型相减
          moneyArr[curIndex].totalMoney +=
            e.type !== this.formData.type ? -e.totalMoney : +e.totalMoney;
        } else {
          moneyArr.push({
            currency: e.currency,
            totalMoney:
              e.type !== this.formData.type ? -e.totalMoney : +e.totalMoney,
          });
        }
      });
      this.totalMoney = moneyArr
        .map((e) => this.formatMoney(e.totalMoney) + e.currency)
        .join(" + ");
    },
    async handleUpdate(row, col) {
      const orderId=row['orderId']||undefined
      const joinOrderId=row['joinOrderId']||undefined
      if(col.cPageNoKey=='pageNo'){
        if(row[col.cPageNoKey]&&row[col.cPageNoKey]==-1&&!orderId){
          return this.$message.error("未关联单号 ，请先去关联确认");
        }else if(!row[col.cPageNoKey]||row[col.cPageNoKey]==0||!orderId){
          return this.$message.error("无法跳转");
        }
      }else if (col.cPageNoKey=='joinPageNo'){
        if(row[col.cPageNoKey]&&row[col.cPageNoKey]==-1&&!joinOrderId){
          return this.$message.error("未关联单号 ，请先去关联确认");
        }else if(!row[col.cPageNoKey]||row[col.cPageNoKey]==0||!joinOrderId){
          return this.$message.error("无法跳转");
        }
      }
      await this["dictionary/getDictionary"](["billPageNo"]);
      // console.log('billPageDict==', this.billPageDict)
      const pageObj = this.billPageDict.find(
        (e) => e.value == row[col.cPageNoKey]
      );
      if (!pageObj) {
        return;
      }
      const orderType = [202, 203, "202", "203"].includes(row[col.cPageNoKey])
        ? row[col.cOrderType]
        : undefined;
        const {nameCn:path,expandVal:activeMenu=undefined}=pageObj
      this.$router.push({
        path,
        query: {
          id: row[col.cOrderIdKey],
          orderType, // 传统与其他订单详情
          backPath: this.$route.fullPath,
          activeMenu
        },
      });
    },
    tabsTableHttpRequest(e) {
      const { activeName } = this.tabsConfig;
      const httpRequest = {
        2: settleAccountsList,
        6: getOperatorInfo,
      };
      return httpRequest[activeName](e);
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      const { id } = this.formData;
      let params = {};
      if (activeName == 2) {
        //账单明细
        params = {
          taskBillId: id,
        };
      } else if (activeName == 6) {
        //操作记录
        params = {
          id,
        };
      }
      return params;
    },
    handleGetResult(tName) {
      //账单明细后台返回，根据当前任务单总明细数据计算所得，非分页数据计算所得
      const { id } = this.formData;
      if (tName == 2) {
        const params = {
          taskBillId: id,
        };
        getAccountsSubtotal(params).then((res) => {
          this.totalMoney = res.data
            .map((e) => this.formatMoney(e.money) + e.currencyCode)
            .join(" + ");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bill-table {
  .subtotal-txt {
    margin-right: -30px;
    font-size: 14px;
    font-weight: bold;
  }
  .enclosure-content {
    margin-top: 10px;
  }
  .details-tabs-btn {
    /deep/ .el-tabs__header {
      margin-bottom: 0;
    }
  }
  .tab-tit-box {
    display: flex;
    .merge-info {
      flex: 1;
      display: flex;
      margin-left: 30px;
      line-height: 20px;
      padding: 14px 15px;
      background: #e8f0ff;
      & > div:not(:first-child) {
        margin-left: 30px;
      }
    }
  }
  .table-tab-title {
    margin: 15px 0 10px;
    font-weight: bold;
    color: #515151;
    line-height: 20px;
    font-size: 14px;
  }
}
</style>
