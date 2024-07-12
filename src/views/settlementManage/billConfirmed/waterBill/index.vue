<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchTabForm(tab.name)"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            >
              <template v-slot:form-submit>
                <ComColumnConf
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
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="statusBtnListFn"
              :spanMethod="spanMethod"
              :tree-props="{
                children: 'children',
                hasChildren: 'WEB_HAVECHILDREN',
              }"
              :customSort="{
                prop: ['dealDate', 'claimTime'][tab.name - 1],
                order: 'descending',
              }"
              :treeLazyLoad="{
                lazy: true,
                load: (row, treeNode, resolve) =>
                  getColsChildren(row, treeNode, resolve),
              }"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'serialCode'">
                  <span v-if="[0, 9].includes(slotProps.row.isMainBill)">
                    {{ slotProps.row.serialCode }}</span
                  >
                  <span
                    class="primary-text-btn"
                    @click="handleUpdate(slotProps.row, 'claimDialog', 'view')"
                    v-else
                  >
                    {{ slotProps.row.serialCode }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'dealDate'">
                  <div>
                    <div
                      v-if="[0, 9].includes(slotProps.row.isMainBill)"
                      class="content-spacing"
                    >
                      <!-- 子单 -->
                      <template v-for="(item, index) in suborder">
                        <span :key="index">{{
                          `${item.label}：${
                            item.value ? slotProps.row[item.value] : "--"
                          }${
                            item.unitValue ? slotProps.row[item.unitValue] : ""
                          }`
                        }}</span>
                      </template>
                    </div>
                    <div v-else>{{ slotProps.row.dealDate }}</div>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor: slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <AuditDialog ref="auditDialog" />
    <ClaimDialog ref="claimDialog" @handleSuccess="mixinkeepTable" />
    <RecordDrawer ref="recordRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  searchColumns,
  tableColumns,
  suborder,
  waterClaimDialogCols,
} from "./model";
import {
  getReceiptClaimList,
  postBankCallback,
} from "@/api/settlementManage/paymentReceived.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
import { permissionJump } from "@/utils/index.js";
import {
  getCashierList,
  POSTReceiptCzrl,
  GETReceiptClaimExport,
} from "@/api/settlementManage/paymentReceived.js";
import { comFileDownload } from "@/utils/download.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
export default {
  name: "WaterBill",
  mixins: [mixinColsConf],
  components: {
    AuditDialog: () =>
      import(
        "@/views/settlementManage/paymentReceived/waterBill/components/AuditDialog"
      ),
    ClaimDialog: () =>
      import(
        "@/views/settlementManage/paymentReceived/waterBill/components/ClaimDialog"
      ),
    RecordDrawer: () => import("./recordDrawer/index.vue"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    const tabBtnArr = [
      {
        table: "导出",
        icon: "iconfont daochu",
        hasPermission: ["settlementManage:waterBillClaim:export"],
        handleClick: () => this.handleExport(),
      },
    ];
    const btnArr = tabBtnArr.filter((e) => {
      const { hasPermission } = e;
      return hasPermission ? hasBtnPermits(hasPermission) : true;
    });
    return {
      suborder,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.initMixinColumnConf();
          });
        },
        tabs: [
          {
            label: "待认领水单",
            name: "1",
          },
          {
            label: "已认领水单",
            name: "2",
          },
        ],
        btnArr: btnArr || [],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getForBookingList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        labelWidth: "100px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: (formModel) => {
          return this.WEB_GetReceiptClaimList(formModel);
        },
        statusBtnList: [
          {
            text: "认领",
            showStatus: [0],
            hasPermi: ["settlementManage:billConfirmed:waterBillClaim:list"],
            handleClick: (row, Item) => {
              const { hasPermi } = Item;
              const tips = "没有访问水单认领的权限，请联系管理员添加权限";
              permissionJump({ hasPermi, tips }).then((res) => {
                this.handleClaim(row, "add");
              });
            },
          },
          {
            text: "编辑",
            showStatus: [1, 9],
            isTab: "2",
            hideTaskStatus: [80, 100], // 和撤回按钮保持一致
            hasPermi: ["settlementManage:billConfirmed:waterBillClaim:list"],
            handleClick: (row, Item) => {
              const { hasPermi } = Item;
              const tips = "没有访问水单编辑的权限，请联系管理员添加权限";
              permissionJump({ hasPermi, tips }).then((res) => {
                this.handleClaim(row, "edit");
              });
            },
          },
          {
            text: "认领记录",
            showStatus: [1, 2, 9],
            handleClick: (row) => {
              this.$refs.recordRef.show(row);
            },
          },
          {
            text: "充值认领",
            showStatus: [0],
            handleClick: (row) => {
              this.rechargeClaim(row);
            },
          },
          {
            text: "撤回",
            color: "#FF6767",
            showStatus: [1, 9],
            isTab: "2",
            hideTaskStatus: [80, 100], // 任务单待核销、已核销不可撤回
            handleClick: (row) => this.handleRepulse(row),
          },
        ],
      },
      mixinTableColArr: [tableColumns("1"), tableColumns("2")],
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
      // getFirstInitData({
      //   httpRequest: logisticsCustomerInfo,
      // }).then((res) => {
      //   this.tabsConfig.tabs.map((e) => {
      //     this.searchFromData[e.name] = {
      //       companyBy: res.id,
      //       companyByName: `${res.code}[${res.shortName}]`,
      //     };
      //   });
      //   this.showSearchForm = true;
      // });
    },
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(tName),
        // formModel: {
        //   ...this.searchFromData[tName],
        // },
      };
    },
    handleRepulse(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "撤回",
          label: "备注：",
        }),
        formModel: {
          id: [row.id],
        },
        httpRequest: postBankCallback,
        successFunction: () => this.mixinkeepTable(),
      });
    },
    WEB_GetReceiptClaimList(row = {}) {
      const { activeName } = this.tabsConfig;
      return new Promise((resolve) => {
        getReceiptClaimList(row).then((res) => {
          const { rows } = res || {};
          const params = {
            ...res,
            rows: rows.map((e) => {
              return {
                ...e,
                WEB_HAVECHILDREN: activeName == 1 ? false : true, //TRUE为有主子单，可以展开，FALSE为常规单，不必处理
              };
            }),
          };
          resolve(params);
        });
      });
    },
    getColsChildren(row = {}, treeNode, resolve) {
      const { id } = row;
      const params = {
        bankReceiptId: id,
        type: 1,
        isMainBillList: [0, 9],
      };
      getCashierList(params).then((res) => {
        const data = (res?.rows || []).map((e) => {
          const { checkNo, invoiceWater } = e;
          const WEB_invoice = `${invoiceWater || ""}${
            invoiceWater && checkNo ? `(${checkNo})` : checkNo || ""
          }`;
          return {
            ...e,
            WEB_invoice,
          };
        });
        resolve(data);
      });
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      const { activeName } = this.tabsConfig;
      const length = this.mixinTableColArr[activeName - 1].length;
      if ([0, 9].includes(row.isMainBill)) {
        if (columnIndex == 2) {
          return [1, length - 5];
        } else if (columnIndex == 15) {
          return [1, 2];
        } else if (
          [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16].includes(columnIndex)
        ) {
          return [0, 0];
        }
      }
    },
    getForBookingList(searchFrom = {}) {
      const { auditTime, claimTime, statusList, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        startDealDate: auditTime && auditTime[0],
        endDealDate: auditTime && auditTime[1],
        // startClaimTime: claimTime && claimTime[0],
        // endClaimTime: claimTime && claimTime[1],
        // statusList: statusList?.length && statusList.join(","),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      const { ...nObj } = this.searchFromData[tab] || {};
      return {
        ...nObj,
        status: tab == 1 ? 0 : "1,2,9",
      };
    },
    tableTabConfig(tName) {
      return tableColumns(tName);
    },
    handleView(row) {},
    handleDelete() {},
    handleUpdate(row, type, operationType) {
      const { activeName } = this.tabsConfig;
      if (activeName == 1) {
        this.$refs[type].show(row, type, operationType);
      } else {
        const { id } = row;
        const idList = this.$refs[
          `tableRef${+this.tabsConfig.activeName}`
        ][0].tableData.map((e) => e.id);
        this.$router.push({
          path: "/settlementManagement/billConfirmed/waterDetail",
          query: {
            id,
            backPath: this.$route.path,
            pageSign: idList.join(","), // 详情显示上一页/下一页
          },
        });
      }
    },
    handleClaim(row, type) {
      const { id } = row;
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e.id);
      this.$router.push({
        path: "/settlementManagement/billConfirmed/waterBillClaim",
        query: {
          id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          operationType: type,
          timer: new Date().getTime(),
        },
      });
    },
    statusBtnListFn(row) {
      return this.tableConfig.statusBtnList.filter((e) => {
        return (
          (e.showStatus ? e.showStatus.includes(row.status) : true) &&
          (e.hideTaskStatus
            ? !e.hideTaskStatus.includes(row.taskStatus)
            : true) &&
          (e.isTab ? e.isTab === this.tabsConfig.activeName : true)
        );
      });
    },
    rechargeClaim(row) {
      const {
        receiptPaymentBankAccount,
        receiptPaymentAccountName,
        bankAccount,
        accountName,
        money,
        currencyCode,
        remark,
        id,
        dealingsCompany,
      } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: waterClaimDialogCols(),
        formModel: {
          id,
          receiptPaymentBankAccount,
          receiptPaymentAccountName,
          bankAccount,
          accountName,
          remark,
          money,
          currencyCode,
          customerId: dealingsCompany,
        },
        httpRequest: (formModel) => {
          const { id, customerId, remark } = formModel;
          const params = {
            sdId: id,
            customerId,
            remark,
          };
          return POSTReceiptCzrl(params);
        },
        successFunction: this.mixinkeepTable,
      });
    },
    handleExport() {
      const { activeName } = this.tabsConfig;
      const params = {
        ...this.getQueryParams(activeName),
      };
      comFileDownload(this, GETReceiptClaimExport, params);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .content-spacing {
    span {
      &:not(:first-child) {
        margin-left: 100px;
      }
    }
  }
}
</style>
