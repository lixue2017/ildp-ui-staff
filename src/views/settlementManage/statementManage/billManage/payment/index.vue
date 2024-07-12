<template>
  <div class="app-container">
    <ComTabs
      :tabsConfig="tabsConfig"
      :class="mixinSearchConfParams.countType === '1000' && 'com-tab-search'"
    >
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <template slot="label">
            <TabSearchColumn
              :searchFormData="mixinSearchFormData"
              :tabName="tab.name"
            />
          </template>
          <keep-alive>
            <ComForm
              :ref="`formRef${tab.name}`"
              :formConfig="getSearchFormConfig()"
              @searchHeight="searchHeight"
              @handleChange="handleChange"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="
                    (r) => setColumnMixinConf(r, { mountedNoRequest: true })
                  "
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :httpRequest="tableConfig.httpRequest"
              :columnConfig="
                mixinSearchConfParams.countType !== '320' &&
                mixinSearchConfParams.countType !== '1000' &&
                mixinSearchConfParams.countType !== '350'
                  ? tableMixinConfig(tab.name)
                      .slice(0, 1)
                      .concat(tableMixinConfig(tab.name).slice(2))
                  : tableMixinConfig(tab.name)
              "
              :getQueryParams="getQueryParams"
              :selectionRow="selectionRowEvt"
              :isMountedRequest="false"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="getOperationBtnFn"
              @handleRowBtnClick="handleClick"
              @handleTableView="
                (row, col) => handleUpdate(row, 'detail', col.prop)
              "
            />
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <div
          class="button-check-box base-flex-align"
          v-if="mixinSearchConfParams.countType == 1000"
        >
          <template>
            <el-radio v-model="isBatchDownloadRadio" label="1"
              >批量下载</el-radio
            >
            <el-button
              type="primary"
              size="small"
              :disabled="isBatchDownloadRadio !== '1' || !selectionRows.length"
              @click="() => handleBillBatchPayment()"
            >
              付款申请单
            </el-button>
            <el-divider direction="vertical"></el-divider>

            <el-radio v-model="isBatchDownloadRadio" label="2"
              >批量下载</el-radio
            >
            <template v-for="(item, index) in billDownloadLists">
              <el-button
                :key="index"
                type="primary"
                size="small"
                :disabled="
                  isBatchDownloadRadio !== '2' || !selectionRows.length
                "
                @click="() => handleBillBatchDownload(item.type)"
              >
                {{ item.label }}
              </el-button>
            </template>
            <!-- <el-divider direction="vertical"></el-divider>
            <el-radio v-model="isBatchDownloadRadio" label="3">批量</el-radio> -->
          </template>
        </div>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDialog" />
    <ComCustomDialog ref="customDialogRef" />
    <RecordDrawer ref="recordRef" @handleClaimSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { customMessageBox } from "@/utils/confirmBox.js";
import {
  getBillNewList,
  putBankReceiptState,
  batchUpdBankReceiptState,
} from "@/api/settlementManage/statementManage";
import { searchColumns, tableColumns } from "../components/model";
import { mapActions } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
import { mixinPayment } from "../collection/mixinCollection.js";
import { singleEmitEvents } from "@/utils/emit-events";
export default {
  name: "PayMentBillManage",
  mixins: [mixinColsConf, mixinPayment],
  components: {
    TabSearchColumn: () => import("_comp/ComColumnConf/SearchColumn"),
    ComDialog: () => import("_comp/ComDialog"),
    ConfirmDialog: () => import("@/views/components/ConfirmDialog"), // 审核弹窗
    RecordDrawer: () => import("../components/recordDrawer"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        isTabStateCount: true,
        handleTabsClick: () => {},
        isMultiple: true,
        tabs: [
          {
            label: "应付对账单",
            name: "1",
          },
          // {
          //   label: "已核销",
          //   name: "2",
          // },
        ],
        btnArr: [
          {
            table: "批量提交",
            disabled: true,
            banDebounce: true,
            hideTabBtn: false,
            handleClick: () => {
              const params = {
                id: this.selectionRows.map((e) => e.id).join(","),
              };
              this.handleSubmit(params);
            },
          },
          {
            table: "批量认领",
            disabled: true,
            banDebounce: true,
            hideTabBtn: false,
            handleClick: () => {
              const params = {
                ids: this.selectionRows.map((e) => e.id),
              };
              this.handleClaimBatch(params);
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {
          createBy: "",
        }, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        residueCols: [2],
        isGetSearchAll: true,
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
        columnConfig: tableColumns.payMentLists,
      },
      mixinTableColArr: [tableColumns.payMentLists],
      selectionRows: [],
      isBatchDownloadRadio: "3",
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getInitialData();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitialData() {
      this.showSearchForm = true;
      setTimeout(() => {
        this.$nextTick(() => {
          this.searchFormConfig.formModel.bankReceiptNo = undefined;
        });
      });
    },
    getSearchFormConfig() {
      const { activeName } = this.tabsConfig;
      return {
        ...this.searchFormConfig,
        lists: searchColumns({ type: 0, activeName }), // 表单渲染列表
        searchColsHeight: true,
      };
    },
    getList(searchFrom = {}) {
      const {
        createTime,
        lastDate,
        auditTime,
        statusList = [],
        webAllSearchFormData,
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
      this.mixinkeepTable(true, {
        isTableSearch: true,
        webAllSearchFormData,
      });
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      const {
        businessCompanyName,
        // statusList = [0, 1, 2, 4, 11, 20],
        ...nObj
      } = this.searchFromData[activeName] || {};
      if (this.mixinSearchConfParams.countType === "350") {
        nObj.bankReceiptState =
          (
            this.$refs[
              `formRef${this.tabsConfig.activeName}`
            ][0].getFormParams() || {}
          ).bankReceiptState || undefined;
      }
      return {
        ...(this.mixinSearchConfParams || {}),
        ...nObj,
        isDataFil: 0,
        type: 0,
        // statusList: activeName == 2 ? [30] : statusList,
      };
    },
    handleChange(val, prop) {
      if (
        prop === "createBy" &&
        this.mixinSearchConfParams.countType === "350"
      ) {
        this.mixinSearchConfParams[prop] = val;
      }
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
          this.$refs.recordRef?.show(
            row.id,
            0,
            this.mixinSearchConfParams.countType == 350,
            row
          );
          break;
        case "cancelSubmit":
          this.cancelSubmission(row);
          break;
        case "editReviewedBy":
          this.handleReviewedBy(row);
          break;
        case "editInvoice":
          this.handleEditInvoice(row);
          break;
        case "paymentReceiptClaim":
          this.handleClaim(row, 1);

          // if (row.bankReceiptState === 0) {
          //   this.handleClaim(row);
          // }
          // if (row.bankReceiptState === 1) {
          //   this.handleCancelClaim(row);
          // }
          break;
        case "paymentCancelReceiptClaim":
          this.handleClaim(row, 0);

          // if (row.bankReceiptState === 0) {
          //   this.handleClaim(row);
          // }
          // if (row.bankReceiptState === 1) {
          //   this.handleCancelClaim(row);
          // }
          break;
      }
    },
    handleClaim({ id }, bankReceiptState) {
      putBankReceiptState({
        bankReceiptState,
        id,
      }).then(() => {
        this.msgSuccess(bankReceiptState ? "水单认领成功" : "取消水单认领成功");
        this.mixinkeepTable();
      });
      // 水单认领
      // this.$refs.customDialogRef.showCustomDialog({
      //   customFormConfig: remarkDialogCols({
      //     title: "水单认领",
      //     label: "备注说明：",
      //     rulesKey: "not_required",
      //     maxlength: 200,
      //   }),
      //   httpRequest: ({ remark }) => {
      //     return putBankReceiptState({
      //       bankReceiptState: 1,
      //       id,
      //       remark,
      //     });
      //   },
      //   successFunction: () => {
      //     this.mixinkeepTable();
      //   },
      // });
    },
    handleClaimBatch({ ids }) {
      // 批量水单认领
      batchUpdBankReceiptState({
        bankReceiptState: 1,
        ids,
      }).then(() => {
        this.msgSuccess("水单认领成功");
        this.mixinkeepTable();
      });
      // this.$refs.customDialogRef.showCustomDialog({
      //   customFormConfig: remarkDialogCols({
      //     title: "水单认领",
      //     label: "备注说明：",
      //     rulesKey: "not_required",
      //     maxlength: 200,
      //   }),
      //   httpRequest: ({ remark }) => {
      //     return batchUpdBankReceiptState({
      //       bankReceiptState: 1,
      //       ids,
      //       remark,
      //     });
      //   },
      //   successFunction: () => {
      //     this.mixinkeepTable();
      //   },
      // });
    },
    handleCancelClaim({ id }) {
      putBankReceiptState({
        bankReceiptState: 0,
        id,
      }).then(() => {
        this.msgSuccess("取消水单认领成功");
        this.mixinkeepTable();
      });
      // 取消水单认领
      // customMessageBox(
      //   this,
      //   {
      //     msgTitle: "水单认领取消之后不可恢复",
      //     msgTxt1: "",
      //     msgTxt2: "你还要继续吗？",
      //     httpMsgRequest: () =>
      //       putBankReceiptState({
      //         bankReceiptState: 0,
      //         id,
      //       }),
      //   },
      //   () => {
      //     this.mixinkeepTable();
      //   }
      // );
    },
    onTableSelectionChange(rows = []) {
      if (
        this.isBatchDownloadRadio === "2" ||
        this.mixinSearchConfParams.countType === "350"
      ) {
        this.selectionRows = rows || [];
      } else if (this.isBatchDownloadRadio === "1") {
        this.selectionRows = rows.filter((e) => ![0, 4].includes(e.status));
      } else {
        this.selectionRows = rows.filter((e) => e.status == 0 || e.status == 4);
      }
      this.$refs[`tableRef${this.tabsConfig.activeName}`] &&
        this.$refs[
          `tableRef${this.tabsConfig.activeName}`
        ][0]._toggleRowSelectionMixin({ newCheckRows: this.selectionRows });
    },
    selectionRowEvt(row) {
      if (
        this.isBatchDownloadRadio === "2" ||
        this.mixinSearchConfParams.countType === "350"
      ) {
        return true;
      }
      if (this.isBatchDownloadRadio === "1") {
        return ![0, 4].includes(row.status);
      }
      return [0, 4].includes(row.status);
    },
    getOperationBtnFn(row) {
      const list = this.getOperationBtn(row, "付");
      return list.filter((item) =>
        this.mixinSearchConfParams.countType === "350"
          ? [
              "paymentReceiptClaim",
              "paymentCancelReceiptClaim",
              "collectRecord",
            ].includes(item.type)
          : ![
              "paymentReceiptClaim",
              "paymentCancelReceiptClaim",
              "collectRecord",
            ].includes(item.type)
      );
    },
  },
  watch: {
    "selectionRows.length"(sLen) {
      // if (["1", "2"].includes(this.isBatchDownloadRadio)) {
      //   this.$set(this.tabsConfig.btnArr[0], "disabled", true);
      //   return;
      // }
      if (this.mixinSearchConfParams.countType == 320) {
        this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
      }
      if (this.mixinSearchConfParams.countType == 350) {
        this.$set(this.tabsConfig.btnArr[1], "disabled", !sLen);
      }
    },
    isBatchDownloadRadio(isRadio) {
      if (isRadio !== "2") {
        this.onTableSelectionChange();
      }
    },
    "mixinSearchConfParams.countType"(v) {
      if (v == 320) {
        this.isBatchDownloadRadio = "3";
      }
      this.mixinShowTable = false;
      this.$set(this.tabsConfig.btnArr[0], "hideTabBtn", v !== "320");
      this.$set(this.tabsConfig.btnArr[1], "hideTabBtn", v !== "350");
      const { createBy } = this.mixinSearchConfParams || {};
      let params = {
        createBy,
        ...this.$refs[
          `formRef${this.tabsConfig.activeName}`
        ][0].getFormParams(),
      };
      if (params.createBy && !params.createBy_name) {
        params.createBy_name = params.createBy;
      }
      if (v === "350") {
        params.bankReceiptState =
          (this.searchFromData[this.tabsConfig.activeName] || {})
            .bankReceiptState || "0";
      } else {
        params.bankReceiptState = (
          this.searchFromData[this.tabsConfig.activeName] || {}
        ).bankReceiptState;
        params.createBy = (
          this.searchFromData[this.tabsConfig.activeName] || {}
        ).createBy;
        if (!params.createBy) {
          params.createBy_name = undefined;
        }
      }
      this.$refs[`formRef${this.tabsConfig.activeName}`][0].setFormModel(
        params,
        true
      );
      this.$nextTick(() => {
        this.mixinShowTable = true;
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.button-check-box {
  .el-radio {
    margin-right: 5px;
    .el-radio__label {
      padding-left: 5px;
    }
  }
  .el-divider--vertical {
    margin: 0 12px;
    height: 26px;
  }
}
.com-tab-search {
  /deep/ {
    .el-tabs__nav-scroll {
      width: calc(100% - 530px);
      &::after {
        width: calc(100% + 530px);
      }
    }
  }
}
/deep/ {
  .el-tabs__nav-scroll {
    overflow: initial;
    height: 46px;
    width: calc(100% - 100px);

    &::after {
      width: calc(100% + 100px);
    }

    .el-tabs__nav,
    .el-tabs__item {
      width: 100%;
    }
    .search-state-tabs {
      max-width: calc(100% - 215px);
    }
  }
  .el-tabs__active-bar {
    display: none;
  }
  .com-tabs .tabs-right-btn {
    top: 3px;
  }
}
</style>
