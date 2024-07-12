<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComForm
            ref="searchTabForm"
            :formConfig="searchFormConfig"
            v-if="showSearchForm"
          >
          </ComForm>
          <ComTable
            :ref="`tableRef${tab.name}`"
            :tableHeight="tableConfig.tableHeight"
            :columnConfig="tableMixinConfig(tab.name)"
            :httpRequest="tableConfig.httpRequest"
            :getQueryParams="getQueryParams"
            :rowOperationBtnListFn="() => tableConfig.statusList"
            v-if="tabsConfig.activeName == tab.name && showSearchForm"
          >
          </ComTable>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ComCustomDialog ref="CustomDialogRef" />
    <ConfigReturnDialog ref="ConfigReturnDialogRef" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchForm, tableColumns } from "./model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { customDialogCols } from "./model.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import {
  GETOrderSettleGetList,
  POSTOrderSettleSave,
  GETSaveBusinessConfigListParam,
} from "@/api/customerManage/customerList.js";
export default {
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "业务回款配置",
            name: "1",
          },
        ],
        btnArr: [],
      },
      tabsBtnArr: [
        {
          table: "业务配置",
          className: "btn-type-add",
          hasPermission: ["enterprise:businessReturn:business"],
          handleClick: () => {
            this.businessConfig();
          },
        },
        {
          table: "回款配置",
          className: "btn-type-add",
          handleClick: () => {
            this.returnConfig();
          },
        },
      ],
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        fold: true,
        size: "small",
        labelWidth: "100px",
        lists: searchForm,
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 320px)",
        columnConfig: tableColumns,
        httpRequest: GETOrderSettleGetList,
        statusList: [
          {
            text: "修改",
            handleClick: (row) => {
              this.handleEdit(row)
            },
          },
        ],
      },
      mixinTableColArr: [tableColumns],
      showSearchForm: false,
      searchFromData: {},
    };
  },
  mounted() {},
  created() {
    this.getTabsArr();
    this["dictionary/getDictionary"]([
      "settlementBusinessType",
      "accountCycle",
      "settleModel",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    async businessConfig() {
      const { data: orderType = [] } = await GETSaveBusinessConfigListParam();
      this.$refs.CustomDialogRef?.showCustomDialog({
        customFormConfig: customDialogCols(),
        formModel: {
          orderType: orderType.map(String),
        },
        httpRequest: (formModel) => {
          const { orderType } = formModel;
          return POSTOrderSettleSave(orderType);
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
    returnConfig() {
      this.$refs.ConfigReturnDialogRef?.show();
    },
    getTabsArr() {
      const arr = this.tabsBtnArr.filter((e) => {
        const { hasPermission } = e;
        return hasPermission ? hasBtnPermits(hasPermission) : true;
      });
      this.tabsConfig.btnArr = arr;
    },
    handleEdit(row){
       const {customerId,customerName}=row
       this.$refs.ConfigReturnDialogRef?.show({customerId,customerName});
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    ConfigReturnDialog: () => import("./dialogConfig.vue"),
  },
};
</script>

<style lang="scss" scoped></style>
