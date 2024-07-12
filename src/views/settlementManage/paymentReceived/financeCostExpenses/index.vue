<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchTabForm(tab.name)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
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
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => tableConfig.getQueryParams(tab.name)"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="(row) => operationBtn(row)"
              :tree-props="{
                children: 'children',
                hasChildren: 'WEB_HAVECHILDREN',
              }"
              :treeLazyLoad="{
                lazy: true,
                load: getColsChildren,
              }"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'serialCode'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row, 'id', 'paymentDetails')"
                  >
                    {{ slotProps.row.serialCode }}
                  </span>
                </template>
                <!-- <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content-btn">
                    <template v-for="(bItem, index) in tableConfig.statusList">
                      <el-button
                        :key="`b_${index}`"
                        size="small"
                        type="text"
                        v-if="operationBtn(bItem, slotProps.row)"
                        @click="bItem.handleClick(slotProps.row)"
                        >{{ bItem.text }}</el-button
                      >
                    </template>
                  </div>
                </template> -->
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>

    <DistributionDialog ref="distributionRef" />
    <RegisterDialog ref="registerRef" />
    <WaterBillDialog ref="waterBillRef" />
    <WriteOffDialog ref="writeOffRef" />
    <ComCustomDialog ref="customDialogRef" />
    <AddDrawer ref="addDrawer" @handleSuccess="mixinkeepTable" />
    <!-- <InvoiceEditDialog ref="InvoiceEditDialogRef" /> -->
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { financeCostExpenses } from "@/views/settlementManage/paymentReceived/components/model.js";
import mixinExpenses from "@/views/settlementManage/paymentReceived/components/mixinExpenses.js";
import { getCashierList } from "@/api/settlementManage/paymentReceived";
import { mixinPaymentExpenses } from "./mixinCostExpenses.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
export default {
  name: "FinanceCostExpenses",
  mixins: [mixinColsConf, mixinExpenses, mixinPaymentExpenses],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: this.initMixinColumnConf,
        tabs: [
          {
            label: "待处理", //财务付款
            name: "1",
          },
          {
            label: "已处理",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "合并分配",
            disabled: true,
            showTabName: ["1"],
            handleClick: () => this.handleAllocation(false, 1),
          },
          {
            table: "多业务付款",
            disabled: true,
            showTabName: ["1"],
            handleClick: () => this.handleAllocation(false, 2),
          },
        ],
      },
      searchFormConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          const { activeName } = this.tabsConfig;
          const { taskByName, taskBy, ...nObj } = formModel;
          const params = {
            ...nObj,
            taskBy: activeName == 1 ? taskBy : undefined,
          };
          return new Promise((resolve) => {
            this.getList(params);
            resolve();
          });
        }, // 表单提交接口
        residueCols: [2],
        searchColsHeight: true,
        searchForm: true,
        fold: true,
        size: "small",
        labelWidth: "85px",
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: (params) => {
          return new Promise((resolve, reject) => {
            getCashierList(params)
              .then((res) => {
                resolve({
                  ...res,
                  rows: res.rows.map((e) => {
                    return {
                      ...e,
                      WEB_HAVECHILDREN:
                        e.isMainBill == 1 || e.isMainBill == 2 ? true : false,
                    };
                  }),
                });
              })
              .catch(() => {
                reject();
              });
          });
        },
      },
      mixinTableColArr: [
        financeCostExpenses.OTcolumnConfig,
        financeCostExpenses.TTcolumnConfig,
      ],
      selectionRows: [],
    };
  },
  // mounted() {
  //   this.searchFromData[1] = {
  //     ...(this.searchFromData[1] || {}),
  //     taskBy: this.curUserInfo?.userId,
  //     taskByName: this.curUserInfo?.userName,
  //   };
  // },
  methods: {
    getInitialData() {
      this.searchFromData[1] = {
        taskBy: this.curUserInfo?.userId,
      };
      this.searchFormConfig.formModel = {
        taskBy: this.curUserInfo?.userId,
        taskByName: this.curUserInfo?.userName,
      };
      this.showSearchForm = true;
      // getFirstInitData({
      //   httpRequest: logisticsCustomerInfo,
      // }).then((res) => {
      //   this.tabsConfig.tabs.map((e) => {
      //     this.searchFromData[e.name] = {
      //       taskBy: e.name == 1 ? this.curUserInfo?.userId : undefined,
      //       taskByName: e.name == 1 ? this.curUserInfo?.userName : undefined,
      //       businessCompany: res.id,
      //       businessCompanyName: `${res.code}[${res.shortName}]`,
      //     };
      //   });
      //   this.showSearchForm = true;
      // });
    },
    getQueryParams(tName) {
      const { status, type, ...params } = this.searchFromData[tName] || {};
      return {
        ...params,
        statusIn:
          this.tabsConfig.activeName === "2"
            ? "100,99"
            : status?.length
            ? status.join(",")
            : "60,70,80,50",
        typeList: type?.length ? type : [0, 1, 2],
        auditStatus: tName - 1,
        costType: 1,
        isMainBillList: [0, 1, 2],
      };
    },
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        lists: [financeCostExpenses.OTSearch, financeCostExpenses.TTSearch][
          tName - 1
        ],
      };
    },
    operationBtn(row) {
      const { applicant } = row;
      const { userId } = this.curUserInfo;
      const btnArr = this.rowStatusList.filter((e) => {
        const { statusBtnArr, isHideStatusArr, hasPermission, isCostType } = e;
        if (statusBtnArr.includes("btnBack")) {
          // 待分配状态只有第一次分配才可打回
          return (
            (row.serialCode.includes("-1") ||
              statusBtnArr.includes(row.status)) &&
            !isHideStatusArr.includes(row.status)
          );
        }
        return (
          statusBtnArr.includes(row.status) &&
          ((hasPermission ? hasBtnPermits(hasPermission) : true) ||
            applicant == userId) &&
          (isCostType ? isCostType.includes(row.costType) : true)
        );
      });
      return btnArr;
    },
    onTableSelectionChange(rows = []) {
      const { activeName } = this.tabsConfig;
      const nRows = rows.filter((e) => [50].includes(e.status));
      const row = nRows[0] || {};
      this.selectionRows = nRows.filter(
        (e) =>
          e.currencyCode === row.currencyCode &&
          e.dealingsCompany === row.dealingsCompany &&
          e.businessCompany === row.businessCompany &&
          e.status === 50
      );
      this.$set(
        this.tabsConfig.btnArr[0],
        "disabled",
        !this.selectionRows.length
      );
      this.$set(
        this.tabsConfig.btnArr[1],
        "disabled",
        !this.selectionRows.length
      );
      this.$refs[`tableRef${activeName}`] &&
        this.$refs[`tableRef${activeName}`][0]?._toggleRowSelectionMixin({
          newCheckRows: this.selectionRows,
        });
    },
    selectionRowEvt(row) {
      if (this.selectionRows.length) {
        const nRow = this.selectionRows[0] || {};
        return (
          nRow.dealingsCompany === row.dealingsCompany &&
          nRow.currencyCode === row.currencyCode &&
          nRow.businessCompany === row.businessCompany &&
          row.status === 50 &&
          row.costType !== 2
        );
      }
      return [50].includes(row.status) && row.costType !== 2;
    },
    getColsChildren(row, treeNode, resolve) {
      const { id } = row;
      const params = {
        parentId: id,
      };
      getCashierList(params).then((res) => {
        resolve(
          (res.rows || res.data || []).map((item) => {
            item.status = null;
            return item;
          })
        );
      });
    },
    activated() {
      this.$set(
        this.tabsConfig.btnArr[0],
        "disabled",
        !this.selectionRows.length
      );
      this.$set(
        this.tabsConfig.btnArr[1],
        "disabled",
        !this.selectionRows.length
      );
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
