<template>
  <div class="app-container">
    <div class="content">
      <ComTabs :tabsConfig="tabsConfig">
        <template v-for="tab in tabsConfig.tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            <keep-alive>
              <ComForm
                class="search-info"
								:ref="`searchFormRef${tab.name}`"
                :formConfig="searchConfig(tab.name)"
                v-if="tabsConfig.activeName === tab.name && showSearchForm"
              >
              </ComForm>
            </keep-alive>

            <keep-alive>
              <ComTable
								v-if="tabsConfig.activeName === tab.name&&showSearchForm"
                :ref="`tableRef${tab.name}`"
                :columnConfig="tableTabColumns(tab.name)"
                :tableHeight="tableConfig.tableHeight"
                :httpRequest="tableConfig.tableRequest[tab.name - 1]"
                :getQueryParams="() => getQueryParams(tab.name)"
								:rowOperationBtnListFn="(r) => tableBtnList"
								:selectionRow="selectionRowEvt"
								@onSelectionChange="onTableSelectionChange"
								:selectionTableRow="[...selectionRows[tab.name]]"
              >
								<template v-slot:customRow="{ slotProps }">
									<template v-if="['checkCode', 'jindieShortName'].includes(slotProps.prop)">
										<el-input
											type="text"
											size="mini"
											v-model="slotProps.row[slotProps.prop]"
											:placeholder="slotProps.column.label"
											:maxlength="slotProps.column.maxLength"
										/>
									</template>
								</template>
              </ComTable>
            </keep-alive>
          </el-tab-pane>
        </template>
      </ComTabs>
    </div>
  </div>
</template>

<script>

import { mapActions } from "vuex";
import { comFileDownload } from "@/utils/download.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  getWaitCalculateList,
  exportCalculateReport,
	postAddCalculate,
	getCalculateList,
	postDelCalculate,
  exportCustomerVoucherWating,
  logisticsCustomerInfo
} from "@/api/settlementManage/paymentReceived.js";

import {
  searchFormCols,
  tableColumns,
	formRules
} from "./model";

export default {
	name: "CalculateMerchant",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
				activeName: "1",
				slotTabs: true,
				handleTabsClick: () => {
          this.initMixinColumnConf();
					// if (this.initDefaultTabs.includes(this.tabsConfig.activeName)) {
					// 	this.$nextTick(() => {
					// 		this.mixinkeepTable();
					// 	});
					// }
				},
				tabs: [
					{
						label: "待核算商户",
						name: "1",
					},
					{
						label: "已核算商户",
						name: "2",
					},
				],
				btnArr: [
					{
						table: "删 除",
						showTabName: ['2'],
						disabled: true,
						handleClick: () => {
							this.handleDelete();
						},
					},
					{
						table: "导出",
						showTabName: ['1','2'],
						icon: "iconfont daochu",
						handleClick: () => {
							this.handleExport();
						},
					},
				],
			},
      searchFormConfig: {
        formModel: {},
        labelWidth: "85px",
				searchForm: true,
				// fold: tName === '2',
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
				formRules
      },
      tableConfig: {
        tableHeight: "calc(100vh - 282px)",
				tableRequest: [getWaitCalculateList, getCalculateList],
      },
			tableBtnList: [
				{
					text: "核算",
					handleClick: (row) => {
						if (!row.checkCode) {
							this.msgError("请输入核算代码")
							return
						}
						row.customerId = row.id;
						delete row.id; // 新增不传ID
						this.comRepeatedRequest(this, postAddCalculate, row).then(() => {
							this.mixinkeepTable();
						})
					},
				},
			],
			selectionRows: {
        1: [],
        2: [],
      },
			initDefaultTabs: [],
			searchFromData: [{},{}],
      btnType: null,
      showSearchForm: false,
    };
  },
  mounted() {
    const params = {
      pageNum: 1,
      pageSize: 10,
    };
    logisticsCustomerInfo(params).then((res) => {
      const {rows=[]}=res
      const billingMainName=`${rows[0]?.code}[${rows[0]?.shortName}]`
      this.searchFormConfig.formModel={
        billingMain:rows[0].id,
        billingMainName:billingMainName
      }
      this.searchFromData[1]={
        ...this.searchFormConfig.formModel
      }
      this.searchFromData[2]={
        ...this.searchFormConfig.formModel
      }
      this.showSearchForm=true
    });
  },
  methods: {
		handleDelete() {
			const { activeName } = this.tabsConfig;
			const selectRows = this.selectionRows[activeName] || [];
			if (!selectRows.length) return;
			const delIds = selectRows.map(e => e.id);
			this.comRepeatedRequest(this, postDelCalculate, delIds.join(",")).then(() => {
				this.onTableSelectionChange();
				this.mixinkeepTable();
			})
		},
    getTableList(obj = {}) {
			const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...obj,
      };
      if (this.btnType === "export") {
        this.btnType = null;
        comFileDownload(
          this,
          [exportCustomerVoucherWating,exportCalculateReport][activeName-1],
          this.searchFromData[activeName]
        );
      } else {
        this.mixinkeepTable(true);
      }
    },
    handleExport() {
      this.btnType = "export";
      this.$refs[`searchFormRef${this.tabsConfig.activeName}`][0]?.submitForm();
      setTimeout(() => {
        this.btnType = null;
      }, 1000);
    },
    searchConfig(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchFormCols({
					tName,
					// customerHandle: (val) => {
					// 	if (!this.initDefaultTabs.includes(tName)) {
					// 		// 只有初始选中默认值后调接口查询表格
					// 		this.initDefaultTabs.push(tName);
					// 		this.getTableList(this.$refs[`searchFormRef${tName}`][0]?.getFormParams());
					// 	}
					// },
        }),
      };
    },
    getQueryParams(tName) {
      return this.searchFromData[tName] || {};
    },
		tableTabColumns(tName) {
			return tableColumns(tName);
		},
		onTableSelectionChange(rows = []) {
			const { activeName } = this.tabsConfig;
      this.selectionRows[activeName] = rows;
      this.$refs[`tableRef${activeName}`][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows[activeName],
      });
    },
		selectionRowEvt(row) {
			return true
		},
		...mapActions(["dictionary/getDictionary"]),
  },
	created() {
		this["dictionary/getDictionary"](["billType"]);
	},
	watch: {
		selectionRows: {
      deep: true,
      handler: function (newVal) {
				const { activeName } = this.tabsConfig;
				this.$set(this.tabsConfig.btnArr[0], "disabled", !newVal[activeName].length);
      },
    },
	}
};
</script>

<style lang="scss" scoped>
.app-container {
  .content {
    min-height: calc(100vh - 108px);
    margin: auto;
    background: #fff;
  }
}
</style>
