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
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => tableQueryParams(tab.name)"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'billNo'">
                  <span
                    class="primary-text-btn"
                    @click="
                      handleView(
                        slotProps.row,
                        'id',
                        // `${
                        //   tabsConfig.activeName === '1' &&
                        //   'reviewCostExpensesPage'
                        // }`
                        'reviewCostExpensesPage'
                      )
                    "
                  >
                    {{ slotProps.row.billNo }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content-btn">
                    <template v-for="(bItem, index) in tableConfig.statusList">
                      <el-button
                        :key="`b_${index}`"
                        size="small"
                        type="text"
                        :style="{
                          color: bItem.color ? bItem.color : '#5094ff',
                        }"
                        v-if="operationBtn(bItem, slotProps.row)"
                        @click="bItem.handleClick(slotProps.row)"
                        >
                        {{ bItem.text }}
                        </el-button>
                    </template>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ExamineConfirmDlg ref="examineConfirmRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { reviewCostExpenses } from "@/views/settlementManage/paymentReceived/components/model.js";
import mixinExpenses from "@/views/settlementManage/paymentReceived/components/mixinExpenses.js";
import { costExamineMixin } from "./examineMixin.js";
import { getExpenseAuditList } from "@/api/settlementManage/paymentReceived";
// import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
export default {
  name: "ReviewCostExpenses",
  mixins: [mixinColsConf, mixinExpenses, costExamineMixin],
  computed: {
    // ...mapState(["dictionary", "user"]),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: this.initMixinColumnConf,
        tabs: [
          {
            label: "待审核",
            name: "1",
          },
          {
            label: "已审核",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "批量确认",
            disabled: true,
            showTabName: ["1"],
            handleClick: () => {
              this.handleBatchOperation(5)
            },
          },
          {
            table: "批量打回",
            disabled: true,
            showTabName: ["1"],
            handleClick: () => {
              this.handleBatchOperation(9)
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        residueCols: [2],
        searchColsHeight: true,
        fold: true,
        size: "small",
        labelWidth: "85px",
        formRules: {},
      },
      searchFromData: {},
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        httpRequest: getExpenseAuditList,
        statusList: [
          {
            statusBtnArr: [1],
            text: "确认",
            handleClick: (row) => this.handleMixinExamine(row, "5"),
          },
          {
            statusBtnArr: [1],
            text: "打回",
            color: "#FF6767",
            handleClick: (row) => this.handleMixinExamine(row, "9"),
          },
          {
            statusBtnArr: [2],
            text: "财务审核",
            handleClick: (row) => {},
          },
          {
            statusBtnArr: [3],
            text: "总经理审核",
            handleClick: (row) => {},
          },
        ],
      },
      mixinTableColArr: [
        reviewCostExpenses.OTcolumnConfig,
        reviewCostExpenses.TTcolumnConfig,
      ],
      selectionRows: [],
    };
  },
  watch: {
    "selectionRows": function (newVal, oldVal) {
      console.log('newVal',newVal)
      this.tabsConfig.btnArr.map((e) => {
        this.$set(e, "disabled", !newVal.length);
      });
    },
  },
  mounted() {},
	created() {
    this.searchFormConfig.formModel = {
			taskBySearch: this.curUserInfo?.userId,
			taskByName: this.curUserInfo?.userName,
      auditBySearch: this.curUserInfo?.userId,
			auditByName: this.curUserInfo?.userName,
		};
		this.searchFromData[1] = {
      taskBySearch: this.curUserInfo?.userId,
			taskByName: this.curUserInfo?.userName,
    };
    this.searchFromData[2] = {
      auditBySearch: this.curUserInfo?.userId,
			auditByName: this.curUserInfo?.userName,
    };
  },
  methods: {
    getInitialData() {
			this.showSearchForm = true;
    },
    operationBtn(bItem, row) {
      return bItem.statusBtnArr.includes(1);
    },
    searchTabForm(tName) {
      console.log('tName',tName)
      return {
        ...this.searchFormConfig,
				formModel:this.searchFormConfig.formModel,
        lists: [reviewCostExpenses.OTSearch, reviewCostExpenses.TTSearch][
          tName - 1
        ],
      };
    },
    tableQueryParams(tName) {
      const {activeName}=this.tabsConfig
			const { taskByName,auditByName, status,taskBySearch,auditBySearch, ...nSearchData } = this.searchFromData[tName] || {};
      return {
        ...nSearchData,
        auditStatus:tName - 1,
        status: status && status.length ? status : (tName == 1 ? [1] : [1,2,3,4,5,6,7,20,21,22,23,24,30,31,32]),
        taskBySearch:tName==1?taskBySearch:undefined,
        auditBySearch:tName==2?auditBySearch:undefined,
        tab:activeName
      };
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
    },
    selectionRowEvt(row) {
      return true;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
}
</style>
