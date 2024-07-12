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
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
              @handleTableView="handleDetails"
              :rowOperationBtnListFn="tableBtnList"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>

    <ClaimDialog ref="ClaimDialog" />
    <ConfirmDialog ref="confirmDlgRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import {
  getInvoiceList,
  deleteInvoiceList,
  postInvoiceCheck,
  postInvoicingVoid,
  GETSettleInvoiceExport,
} from "@/api/settlementManage/paymentReceived";
import { searchColumns, writeColumns, onGoingTable } from "./model";
import { mapActions, mapState } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  postInvoicingReject,
  POSTMaintainInvoice,
} from "@/api/settlementManage/paymentReceived";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { editInvoiceDialogCols } from "@/views/settlementManage/paymentReceived/invoice/model.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  // name: "Invoice",
  mixins: [mixinColsConf],
  props: {
    invoiceObj: {
      type: Object,
      default: () => ({
        // menuType: "", 0发票信息（个人）  1发票信息（审核）
        tableRequest: getInvoiceList,
        tableCols: [onGoingTable({ menuType: "1" }), writeColumns],
      }),
    },
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.handleGetTabsClick(true);
        },
        tabs: [
          {
            label: "进行中",
            name: "1",
          },
          {
            label: "已完结发票",
            name: "2",
          },
        ],
      },
      tabBtnArr: [
        {
          table: "合并开票",
          disabled: true,
          showTabName: "1",
          showMenuType: ["1", 1],
          handleClick: this.handleMerge,
        },
        {
          table: "导出",
          showTabName: "2",
          showMenuType: ["1", 1],
          hasPermission: ["settlementManagement:invoice:examineExport"],
          handleClick: () => {
            this.handleExport();
          },
        },
      ],
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "90px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: this.invoiceObj.tableRequest,
      },
      mixinTableColArr: this.invoiceObj.tableCols,
      tableBtnArr: [
        {
          text: "提交",
          btnStatus: [0, 3],
          menuTypeStatus: ["0"],
          handleClick: this.handleSubmit,
          hasPermission: ["settlementManagement:invoice:saveSubmit"],
        },
        {
          text: "修改",
          btnStatus: [0, 3],
          menuTypeStatus: ["0"],
          handleClick: this.handleEdit,
        },
        {
          text: "删除",
          color: "#FF6767",
          btnStatus: [0, 3],
          menuTypeStatus: ["0"],
          handleClick: this.handleDelete,
        },
        {
          text: "开票",
          btnStatus: [1],
          menuTypeStatus: ["1"],
          handleClick: (row) => this.handleInvoicing(row),
          hasPermission: ["settlementManagement:invoice:openInvoice"],
        },
        {
          text: "退回",
          btnStatus: [1],
          menuTypeStatus: ["1"],
          handleClick: this.handleReject,
          hasPermission: ["settlementManagement:invoice:reject"],
        },
        {
          text: "修改发票号",
          btnStatus: [2],
          menuTypeStatus: ["1"],
          handleClick: this.handleEditInvoice,
          hasPermission: ["settlementManagement:invoice:numEdit"],
        },
        {
          text: "作废",
          btnStatus: [2],
          menuTypeStatus: ["0", "1"],
          handleClick: this.handleVoid,
          hasPermission: ["settlementManagement:invoice:cancel"],
        },
      ],
      selectionRows: [],
    };
  },
  watch: {
    "tabsConfig.activeName": function (val, oldVal) {
      if (this.invoiceObj.menuType == 1) {
        const formModel = {
          1: {
            statusArr: ["1"],
          },
          2: {
            statusArr: ["2"],
          },
        }[val];
        this.searchFormConfig.formModel = {
          ...this.searchFormConfig.formModel,
          ...formModel,
        };
      }
    },
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    handleMerge() {
      if (!this.selectionRows.length) {
        this.msgError("请选择发票");
        return;
      }
      const ids = this.selectionRows.map((e) => e.id);
      this.handleInvoicing({}, ids.join(","));
    },
    handleSubmit({ id }) {
      postInvoiceCheck({ id }).then(() => {
        this.msgSuccess("提交成功");
        this.mixinkeepTable();
      });
    },
    handleVoid({ id, serialCode }) {
      this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
        confObj: {
          title: `确定要作废发票${serialCode}？`,
          label: "作废说明：",
          message: "请输入作废说明",
        },
        formModel: {},
        httpRequest: ({ remark }) => {
          const opt = {
            id,
            remark,
          };
          return postInvoicingVoid(opt);
        },
        successFunction: this.mixinkeepTable,
      });
    },
    handleEdit(row) {
      this.$router.push({
        path: "/settlementManagement/invoice/editInvoice",
        query: {
          id: row.id,
          backPath: this.$route.fullPath,
        },
      });
    },
    handleDetails(row) {
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e.id);
      this.$router.push({
        // path: "/settlementManagement/paymentReceived/invoiceDetails",
        path: "/settlementManagement/invoice/invoiceDetails",
        query: {
          id: row.id,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleInvoicing(row, ids) {
      this.$router.push({
        path: "/settlementManagement/invoice/invoicing",
        // path: "/settlementManagement/paymentReceived/invoicing",
        query: {
          id: row.id,
          ids,
          backPath: this.$route.fullPath,
        },
      });
    },
    handleDelete(row) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        deleteInvoiceList(row.id).then(() => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        });
      });
    },
    getSearchList(searchFrom = {}) {
      const { activeName } = this.tabsConfig;
      const { createTime, sInvoiceTime, statusArr, ...searchObj } = searchFrom;
      const [startTime, endTime] = createTime || [];
      const [invoiceDateBegin, invoiceDateEnd] = sInvoiceTime || [];
      this.searchFromData[activeName] = {
        ...searchObj,
        startTime,
        endTime,
        invoiceDateBegin,
        invoiceDateEnd,
        statusArr: statusArr?.length ? statusArr : undefined,
      };
      this.$refs[`tableRef${activeName}`][0]?.refreshTable();
    },
    getQueryParams(tName) {
      const {
        statusArr,
        operatorName,
        businessCompanyName,
        drawerName,
        ...nObj
      } = this.searchFromData[tName] || {};
      const status = statusArr?.join(",") || "";
      const { menuType } = this.invoiceObj;
      const { activeName } = this.tabsConfig;
      const statusLists = {
        10: "0,1,3",
        20: "2,4",
        11: "1,3",
        21: "2,4",
      };
      return {
        ...nObj,
        status: status || statusLists[activeName + menuType], //勾选就用勾选的，没勾选用默认值
      };
    },
    searchTabForm(tName) {
      const { menuType } = this.invoiceObj || {};
      return {
        ...this.searchFormConfig,
        lists: searchColumns({
          activeName: tName,
          menuType,
        }), // 表单渲染列表
      };
    },
    handleReject(row) {
      const { id } = row;
      this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
        confObj: {
          title: "确定要驳回开票申请？",
        },
        formModel: {},
        httpRequest: ({ remark }) => {
          const opt = {
            id,
            remark,
          };
          return postInvoicingReject(opt);
        },
        successFunction: this.mixinkeepTable,
      });
    },
    handleUpdate(row) {},
    credentialsDetail(row, type) {
      this.$refs.ClaimDialog.show(row, type);
    },
    onTableSelectionChange(rows = []) {
      const nRows = rows.filter((e) => e.status === 1);
      const row = nRows[0] || {};
      this.selectionRows = nRows.filter(
        (e) =>
          e.invoiceType === row.invoiceType &&
          e.invoiceMedium === row.invoiceMedium &&
          e.dealingsCompany === row.dealingsCompany &&
          e.invoiceCurrencyId === row.invoiceCurrencyId &&
          e.drawer === row.drawer
      );
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]._toggleRowSelectionMixin({ newCheckRows: this.selectionRows });
      this.$set(this.tabBtnArr[0], "disabled", !this.selectionRows.length);
    },
    selectionRowEvt(row) {
      const rSome = this.selectionRows.some(
        (e) =>
          e.invoiceType === row.invoiceType &&
          e.invoiceMedium === row.invoiceMedium &&
          e.dealingsCompany === row.dealingsCompany &&
          e.invoiceCurrencyId === row.invoiceCurrencyId &&
          e.drawer === row.drawer
      );
      if ((this.selectionRows?.length && !rSome) || row.status !== 1) {
        return false; // 禁止选择
      }
      return true; // 可选
    },
    tableBtnList(row) {
      const { applicant } = row;
      const { userId } = this.curUserInfo;
      const { menuType } = this.invoiceObj || {};
      return this.tableBtnArr.filter((rBtn) => {
        return (
          rBtn.btnStatus.includes(row.status) &&
          ((rBtn.hasPermission ? hasBtnPermits(rBtn.hasPermission) : true) ||
            applicant == userId) &&
          rBtn.menuTypeStatus.includes(menuType)
        );
      });
    },
    handleGetTabsClick(isTabsChange) {
      console.log("isTabsChange", isTabsChange);
      //判断当前标签展示合并开票
      const { menuType } = this.invoiceObj;
      const bArr = this.tabBtnArr.filter((e) => {
        const { showMenuType, hasPermission } = e;
        return (
          (showMenuType ? showMenuType.includes(menuType) : true) &&
          (hasPermission ? hasBtnPermits(hasPermission) : true)
        );
      });
      this.$set(this.tabsConfig, "btnArr", bArr);
      if (isTabsChange) {
        //切换标签页就刷新，否则不刷新
        this.initMixinColumnConf();
      }
    },
    getInitialData() {
      //当前标签页是否有初始化搜索数据
      const { roles } = this.curUserInfo;
      const roleIds = roles.map((e) => e.roleId);
      const operator = {
        operator: roleIds.includes(140) ? this.curUserInfo.userId : undefined,
        operatorName: roleIds.includes(140)
          ? this.curUserInfo.userName
          : undefined,
      };
      this.searchFromData[1] = {
        ...operator,
        ...(this.invoiceObj.menuType == 1 ? { statusArr: ["1"] } : undefined),
        ...(this.searchFromData[1] || {}),
      };
      this.searchFromData[2] = {
        ...operator,
        ...(this.invoiceObj.menuType == 1 ? { statusArr: ["2"] } : undefined),
        ...(this.searchFromData[2] || {}),
      };
      this.searchFormConfig.formModel = {
        ...operator,
        ...(this.invoiceObj.menuType == 1 ? { statusArr: ["1"] } : undefined),
        ...(this.searchFromData[1] || {}),
      };
      this.showSearchForm = true;
    },
    handleEditInvoice(row) {
      const { invoiceNumber, id } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: editInvoiceDialogCols({ menuType: "Invoice" }),
        formModel: {
          id: [id],
          invoiceNumber,
        },
        httpRequest: POSTMaintainInvoice,
        successFunction: this.mixinkeepTable,
      });
    },
    handleExport() {
      const { activeName } = this.tabsConfig;
      const { pageNum, pageSize, ...params } = this.getQueryParams(activeName);
      comFileDownload(this, GETSettleInvoiceExport, params);
    },
    handleEditInvoice(row) {
      const { invoiceNumber, id } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: editInvoiceDialogCols({ menuType: "Invoice" }),
        formModel: {
          id: [id],
          invoiceNumber,
        },
        httpRequest: POSTMaintainInvoice,
        successFunction: this.mixinkeepTable,
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this.handleGetTabsClick();
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getInitialData();
    });
  },
  activated() {
    this.$set(this.tabBtnArr[0], "disabled", !this.selectionRows.length);
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ClaimDialog: () =>
      import(
        "@/views/settlementManage/paymentReceived/waterBill/components/ClaimDialog/index"
      ),
    ConfirmDialog: () => import("@/views/components/ConfirmDialog"), // 审核弹窗
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
