<template>
  <div class="app-container">
    <!-- 仓租日账单列表 -->
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm :formConfig="searchFormConfig" v-if="showSearchForm">
              <template
                v-slot:form-submit
                v-if="storageRentObj.orderSource != 3"
              >
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="setColumnMixinConf"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              @onSelectionChange="onSelectionChange"
              :selectionTableRow="[...selectionTableRow]"
              :selectionRow="selectionRowEvt"
              :getQueryParams="getQueryParams"
              @handleTableView="handleView"
              :rowOperationBtnListFn="(row) => getBtnLists(row)"
              :isMountedRequest="storageRentObj.orderSource == 3 ? false : true"
              v-if="showSearchForm"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <div v-if="storageRentObj.orderSource == 3">
          <CurrentWhereWarehouse @setCurWarehouse="getWarehouseTableMixin" />
        </div>
      </template>
    </ComTabs>
    <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['titleSlot']">
      <template v-slot:titleSlot>
        <span class="dialog-title"
          >*生成日期对应的为选择日期的前1天的库存数据(同自动生成逻辑)</span
        >
      </template>
    </ComCustomDialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { permissionJump } from "@/utils/index.js";
import { comFileDownload } from "@/utils/download.js";
import {
  EXPORTOrderBillListAndDetail,
  POSTStorageMatchRegeneration,
  deleteMonthlyBillRemove,
  postOperationBillListAndDetail,
  postOverseaBillListAndDetail,
} from "@/api/costScheme/index.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { customDialogCols } from "./model.js";
export default {
  mixins: [curWarehouseMixin, mixinColsConf],
  props: {
    storageRentObj: {
      type: Object,
      required: true,
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComTabs: () => import("_comp/ComTabs"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    ComColumnConf: () => import("_comp/ComColumnConf"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  data() {
    const { orderSource } = this.storageRentObj;
    const createHasPermission = {
      1: ["operateManage:storageOrderBill:create"],
      2: ["newOrderManage:storageOrderBill:create"],
      3: ["warehouseManage:storageOrderBill:create"],
    }[orderSource];
    const deleteHasPermission = {
      1: ["operateManage:storageOrderBill:delete"],
      2: ["newOrderManage:storageOrderBill:delete"],
      3: ["warehouseManage:storageOrderBill:delete"],
    }[orderSource];
    const tabBtnArr = [
      {
        table: "生成仓租",
        hasPermission: createHasPermission,
        handleClick: () => {
          this.handleCreteWarehouse();
        },
      },
      {
        table: "导出",
        icon: "iconfont daochu",
        handleClick: () => {
          this.handleBatchExport();
        },
      },
    ];
    const btnArr = tabBtnArr.filter((e) => {
      const { hasPermission } = e;
      return hasPermission ? hasBtnPermits(hasPermission) : true;
    });
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.storageRentObj.title,
            name: "1",
          },
        ],
        btnArr: btnArr || [],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            console.log("formModel", formModel);
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        residueCols: [2],
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "135px" : "100px",
        lists: this.storageRentObj.formConfig,
      },
      statusList: [
        {
          text: "导出账单",
          handleClick: (row) => {
            this.handleExport(row);
          },
        },
        {
          text: "删除",
          color: "#FF6767",
          hasPermission: deleteHasPermission,
          handleClick: (row) => {
            this.handleDelete(row);
          },
        },
      ],
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: this.storageRentObj.tableHttpRequest,
      },
      showSearchForm: false,
      mixinTableColArr: [this.storageRentObj.tableConfig],
      searchFromData: {},
      selectionTableRow: [],
    };
  },
  created() {
    this["dictionary/getDictionary"](["trueOrFalse", "isCoAndPay"]).then(() => {
      const { roles = [] } = this.curUserInfo;
      const roleIds = (roles || []).map((e) => e.roleId);
      if (roleIds.includes(141)) {
        //业务员
        this.searchFormConfig.formModel = {
          salesManId: this.curUserInfo?.userId,
          salesManName: this.curUserInfo?.userName,
        };
        this.searchFromData = {
          ...this.searchFormConfig.formModel,
        };
      }
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getList(formModel = {}) {
      const { createTime, updateTime, ...nObj } = formModel;
      this.searchFromData = {
        ...nObj,
        createTimeBegin: createTime && createTime[0],
        createTimeEnd: createTime && createTime[1],
        updateTimeBegin: updateTime && updateTime[0],
        updateTimeEnd: updateTime && updateTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { salesManName, ...obj } = this.searchFromData;
      return {
        ...obj,
        warehouseId:
          this.storageRentObj.orderSource == 3
            ? this.curWarehouseObj.value
            : undefined,
      };
    },
    handleView(row, rItem) {
      const hasPermi = ["storageRentBillDetail:DetailsPage"];
      const tips = "没有访问详情的权限，请联系管理员添加权限";
      permissionJump({ hasPermi, tips }).then((res) => {
        const { id } = row;
        const idList = this.$refs[
          `tableRef${+this.tabsConfig.activeName}`
        ][0].tableData.map((item) => item.id);
        this.$router.push({
          path: "/costScheme/storageRentBillDetail",
          query: {
            id,
            backPath: this.$route.path,
            pageSign: idList.join(","), // 详情显示上一页/下一页
            orderSource: this.storageRentObj.orderSource,
          },
        });
      });
    },
    getBtnLists(row) {
      const arr = this.statusList.filter((e) =>
        e.hasPermission ? hasBtnPermits(e.hasPermission) : true
      );
      return arr;
    },
    handleExport({ id }) {
      const { orderSource } = this.storageRentObj;
      const httpExportObj = {
        1: postOperationBillListAndDetail, // 操作单
        2: EXPORTOrderBillListAndDetail, // 订单
        3: postOverseaBillListAndDetail, // 海外仓
      };
      comFileDownload(this, httpExportObj[orderSource], {
        id,
        querySource: orderSource == 2 ? 1 : undefined,
      });
    },
    onSelectionChange(val) {
      this.selectionTableRow = val;
    },
    selectionRowEvt() {
      return true;
    },
    handleBatchExport() {
      //批量导出
      const ids = (this.selectionTableRow || []).map((e) => e.id);
      const { pageSize, pageNum, ...obj } = this.getQueryParams();
      const { orderSource } = this.storageRentObj;
      const httpExportObj = {
        1: postOperationBillListAndDetail,
        2: EXPORTOrderBillListAndDetail,
        3: postOverseaBillListAndDetail,
      };
      comFileDownload(this, httpExportObj[orderSource], {
        ...(ids.length > 0 ? undefined : obj),
        querySource: orderSource == 2 ? 1 : undefined,
        ids: ids.length > 0 ? ids : undefined,
      });
    },
    handleCreteWarehouse() {
      this.$refs.customDialogRef?.showCustomDialog({
        customFormConfig: customDialogCols(),
        httpRequest: (formModel) => {
          return POSTStorageMatchRegeneration(formModel);
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
    handleDelete({ id }) {
      this.comRepeatedRequest(this, deleteMonthlyBillRemove, id).then(() => {
        this.msgSuccess("删除成功");
        this.mixinkeepTable();
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-title {
  color: #5094ff;
}
</style>
