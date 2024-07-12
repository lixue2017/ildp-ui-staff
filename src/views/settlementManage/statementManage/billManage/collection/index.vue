<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig()"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :ref="`formRef${tab.name}`"
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="(row) => getOperationBtn(row, '收')"
              @handleRowBtnClick="handleClick"
              @handleTableView="
                (row, col) => handleUpdate(row, 'detail', col.prop)
              "
            >
              <template v-slot:bottomTotal>
                <div class="totalData" v-if="Object.keys(totalData).length">
                  <span class="title">明细小计：</span>
                  <div
                    v-for="(value, key) in totalData"
                    :index="key"
                    class="item-space"
                  >
                    <span>{{ value }}</span>
                    <span>{{ key }}</span>
                  </div>
                </div>
                <div v-else></div>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <div class="button-check-box base-flex-align">
          <el-checkbox v-model="isBatchDownloadChecked">批量下载</el-checkbox>
          <template v-for="(item, index) in billDownloadLists">
            <el-button
              :key="index"
              type="primary"
              size="small"
              :disabled="!isBatchDownloadChecked || !selectionRows.length"
              @click="() => handleBillBatchDownload(item.type)"
            >
              {{ item.label }}
            </el-button>
          </template>
          <el-divider direction="vertical"></el-divider>
        </div>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDialog" />
    <ComCustomDialog ref="customDialogRef" />
    <RecordDrawer ref="recordRef" />
  </div>
</template>

<script>
import { getBillNewList } from "@/api/settlementManage/statementManage";
import { searchColumns, tableColumns } from "../components/model";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinPayment } from "./mixinCollection.js";
import { duplicateRemoval, getFirstInitData } from "@/utils/index.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
import { accumulationFn } from "@/utils/instructions";
import { customMessageBox } from "@/utils/confirmBox.js";

export default {
  name: "CollectionBillManage",
  mixins: [mixinColsConf, mixinPayment],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ConfirmDialog: () => import("@/views/components/ConfirmDialog"), // 审核弹窗
    RecordDrawer: () => import("../components/recordDrawer"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.totalData = {};
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "应收对账单",
            name: "1",
          },
          {
            label: "已核销",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "新增发票",
            disabled: true,
            handleClick: () => {
              if (!this.selectionRows.length) {
                return;
              }
              let waitList = [];
              this.selectionRows.forEach((ele) => {
                if (ele.status === 1) {
                  waitList.push(ele.billNo);
                }
              });
              if (waitList.length) {
                customMessageBox(
                  this,
                  {
                    msgTxt1: `对账单 ${waitList.join("、")} 未确认，`,
                    msgTxt2: "是否要继续开票",
                  },
                  () => {
                    this.createInvoice();
                  }
                );
              } else {
                this.createInvoice();
              }
            },
          },
          {
            table: "批量提交",
            disabled: true,
            banDebounce: true,
            handleClick: () => {
              const params = {
                id: this.selectionRows.map((e) => e.id).join(","),
              };
              this.handleSubmit(params);
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        residueCols: [2],
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "90px",
      },
      tableConfig: {
        httpRequest: getBillNewList,
      },
      selectionRows: [],
      mixinTableColArr: [
        tableColumns.collectionLists,
        tableColumns.collectionLists,
      ],
      totalData: {},
    };
  },
  watch: {
    selectionRows: {
      deep: true,
      handler: function (newVal) {
        this.totalData = {};
        newVal.map((e) => {
          (e.billSubtotal || []).split(",").map((cRes) => {
            // const value = /(\d+(\.\d+)?)/.exec(cRes)[0];
            const value = cRes.match(/[a-zA-Z]+|[^a-zA-Z]+/g)[0];
            const label = cRes.replace(/[^a-z]/gi, "");
            this.totalData[label] = accumulationFn(
              [this.totalData[label], value],
              2
            );
          });
        });
        if (this.isBatchDownloadChecked) {
          this.$set(this.tabsConfig.btnArr[0], "disabled", true);
          this.$set(this.tabsConfig.btnArr[1], "disabled", true);
          return;
        }
        if (newVal.length > 0) {
          //0草稿        4待认领
          const { status } = newVal[0];
          const index = [0, 4].includes(status) ? 1 : 0;
          this.$set(this.tabsConfig.btnArr[index], "disabled", !newVal.length);
        } else {
          this.$set(this.tabsConfig.btnArr[0], "disabled", !newVal.length);
          this.$set(this.tabsConfig.btnArr[1], "disabled", !newVal.length);
        }
      },
    },
    isBatchDownloadChecked(isChecked) {
      console.log("isChecked", isChecked);
      if (!isChecked) {
        this.onTableSelectionChange();
      }
    },
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getInitialData();
    });
  },
  deactivated() {
    if (this.selectionRows) {
      this.selectionRows = [];
      this.onTableSelectionChange();
    }
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitialData() {
      this.showSearchForm = true;
      // getFirstInitData({
      //   httpRequest: logisticsCustomerInfo,
      // }).then((res) => {
      //   this.searchFromData = {
      //     businessCompany: res.id,
      //     businessCompanyName: `${res.code}[${res.shortName}]`,
      //   };
      //   this.showSearchForm = true;
      // });
    },
    getSearchFormConfig() {
      const { activeName } = this.tabsConfig;
      return {
        ...this.searchFormConfig,
        lists: searchColumns({ type: 1, activeName }),
        searchColsHeight: true,
      };
    },
    getList(searchFrom = {}) {
      const {
        createTime,
        lastDate,
        auditTime,
        statusList = [],
        ...searchObj
      } = searchFrom;
      if (searchObj.accountingStatusList) {
        searchObj.accountingStatusList =
          searchObj.accountingStatusList.split(",");
      } else {
        delete searchObj.accountingStatusList;
      }
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        startTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
        lastStartDate: lastDate && lastDate[0],
        lastEndDate: lastDate && lastDate[1],
        startDate: auditTime && auditTime[0],
        endDate: auditTime && auditTime[1],
        statusList: statusList.length ? statusList : undefined,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      const {
        businessCompanyName,
        statusList = [0, 1, 2, 4, 11, 20],
        ...nObj
      } = this.searchFromData[activeName] || {};
      return {
        ...nObj,
        type: 1,
        statusList: activeName == 2 ? [30] : statusList,
      };
    },
    handleUpdate(row, type, propKey) {
      if (propKey === "joinBillNo") {
        this.handleDetails(row.joinBillId, "", type);
      } else {
        const { activeName } = this.tabsConfig;
        const idList = this.$refs[`tableRef${activeName}`][0].tableData.map(
          (e) => e.id
        );
        this.handleDetails(row.id, idList.join(","), type);
      }
    },
    handleDetails(id, pageSign, type, toReview) {
      this.$router.push({
        path: "/settlementManagement/statementManage/editBillManage",
        query: {
          id,
          toReview, // 不显示账单审核
          activeTab: type === "detail" ? "3" : "2", // 1为新增，2为修改，3为详情
          backPath: this.$route.fullPath,
          pageSign, // 详情显示上一页/下一页
        },
      });
    },
    handleClick(row, btnObj) {
      // submit:提交  edit:编辑  delete：删除
      switch (btnObj.type) {
        case "submit":
          this.handleSubmit(row);
          break;
        case "edit":
          this.handleUpdate(row);
          break;
        case "delete":
          this.handleDelete(row);
          break;
        case "collectRecord":
          this.$refs.recordRef?.show(row.id, 1);
          break;
        case "cancelSubmit":
          this.cancelSubmission(row);
          break;
        case "editReviewedBy":
          this.handleReviewedBy(row);
          break;
      }
    },
    onTableSelectionChange(rows = []) {
      if (this.isBatchDownloadChecked) {
        this.selectionRows = rows || [];
      } else {
        const nRows = rows.filter((e) =>
          [1, 2, 20, 30, 11, 0, 4].includes(e.status)
        ); //待对账，复核中，待核销，已核销，待认领，草稿，已驳回
        const row = nRows[0] || {};
        this.selectionRows = nRows.filter((e) => {
          if ([0, 4].includes(row.status)) {
            //草稿已驳回
            return [0, 4].includes(e.status);
          }
          return (
            ![0, 4].includes(e.status) &&
            e.businessCompany === row.businessCompany &&
            e.invoiceStatus !== 30
          );
        });
      }
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]._toggleRowSelectionMixin({ newCheckRows: this.selectionRows });
    },
    selectionRowEvt(row) {
      if (this.isBatchDownloadChecked) {
        return true;
      }
      const stateSome = this.selectionRows.some(
        (ele) => [0, 4].includes(ele.status) // 草稿与驳回
      );
      if (stateSome) {
        return [0, 4].includes(row.status);
      }
      const rSome = this.selectionRows.some(
        (e) => e.businessCompany === row.businessCompany
      );
      if (
        (this.selectionRows.length &&
          (!rSome || [0, 4].includes(row.status))) || row.invoiceStatus == 30
      ) {
        return false;
      }
      return true;
    },
    createInvoice() {
      const { businessCompany } = this.selectionRows[0];
      const dCArr = this.selectionRows.map((e) => e.dealingsCompany);
      this.$router.push({
        path: "/settlementManagement/invoice/editInvoice",
        query: {
          businessCompany, // 业务单位
          dealingsCompany: duplicateRemoval(dCArr).join(","), // 往来单位
          billIds: this.selectionRows.map((e) => e.id).join(","),
          backPath: this.$route.fullPath,
        },
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.button-check-box {
  .el-checkbox {
    margin-right: 5px;
  }
  .el-divider--vertical {
    margin: 0 12px;
    height: 26px;
  }
}
/deep/ {
  .bottom-pagination {
    display: flex;
    justify-content: space-between;
  }
}
.totalData {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  line-height: 20px;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .item-space {
    margin-right: 20px;
  }
}
</style>
