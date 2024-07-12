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
                v-if="showSearchForm && tabsConfig.activeName === tab.name"
              >
              </ComForm>
            </keep-alive>

            <keep-alive>
              <ComTable
								v-if="tabsConfig.activeName === tab.name"
                :ref="`tableRef${tab.name}`"
								:isMountedRequest="false"
                :columnConfig="tableTabColumns(tab.name)"
                :tableHeight="tableConfig.tableHeight"
                :httpRequest="tableConfig.tableRequest[tab.name - 1]"
                :getQueryParams="() => getQueryParams(tab.name)"
								:rowOperationBtnListFn="(r) => tableBtnList"
              >
								<template v-slot:customRow="{ slotProps }">
									<template v-if="['voucherRate'].includes(slotProps.prop)">
                    <el-input-number
                      size="mini"
                      v-model="slotProps.row[slotProps.prop]"
                      v-input-number-limit="4"
                      :controls="false"
                      :placeholder="slotProps.column.label"
                      :disabled="slotProps.row.lockSign==1"
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
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { formatDate } from "@/utils/index.js";
import {
  getVoucherRateList,
  postVoucherRate,
  putVoucherRate,
  postBatchVoucherRate,
  getVoucherLockMonth
} from "@/api/settlementManage/paymentReceived.js";
import {
  searchFormCols,
  tableColumns,
	formRules
} from "./model";

export default {
	name: "VoucherRate",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
				activeName: "1",
				slotTabs: true,
				handleTabsClick: () => {
					this.$nextTick(() => {
            this.mixinkeepTable();
					});
				},
				tabs: [
					{
						label: "凭证汇率",
						name: "1",
					}
				],
				btnArr: [
					// {
					// 	table: "批量更新汇率",
					// 	handleClick: () => {
					// 		const sTableData = this.$refs[
					// 			`tableRef${this.tabsConfig.activeName}`
					// 		][0]?.getNewTableData() || [];
					// 		if (sTableData.length) {
					// 			let errNos = [];
					// 			sTableData.forEach((r, i) => {
					// 				if (!r.voucherRate && r.voucherRate !== 0) {
					// 					errNos.push(i + 1);
					// 				}
					// 			})

					// 			if (errNos.length) {
					// 				this.msgError(`序号第${errNos.join('、')}行请输入凭证汇率`);
					// 			} else {
					// 				this.comRepeatedRequest(this, postBatchVoucherRate, sTableData).then(() => {
					// 					this.msgSuccess("操作成功");
					// 					this.mixinkeepTable();
					// 				})
					// 			}
					// 		}
					// 		// const { billingMain, byMonth } = this.$refs[
					// 		// 	`searchFormRef${this.tabsConfig.activeName}`
					// 		// ][0]?.getFormParams() || {};
					// 		// if (billingMain && byMonth) {
					// 		// 	this.comRepeatedRequest(this, postVoucherRate, { billingMain, byMonth })
					// 	}
					// },
				],
			},
      searchFormConfig: {
        formModel: {
					byMonth: formatDate(new Date(), "-", "month"), // 默认当前月
				},
        labelWidth: "85px",
				searchForm: true,
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
				tableRequest: [getVoucherRateList],
      },
			tableBtnList: [
				{
					text: "更新汇率",
					handleClick: (row) => {
						if (!row.voucherRate && row.voucherRate !== 0) {
							this.msgError("请输入凭证汇率")
							return
						}
						this.comRepeatedRequest(this, putVoucherRate, row).then(() => {
							this.mixinkeepTable();
						})
					},
				},
			],
			initDefaultTabs: [],
			showSearchForm: true,
			searchFromData: {
				1: {}
			},
    };
  },
  methods: {
    getTableList(obj = {}) {
			const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...obj,
      };
      this.mixinkeepTable(true);
    },
    searchConfig(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchFormCols({
          customerHandle: (val) => {
            if(val){
              this.getBillingMonth(val, tName);
            }
          },
        }),
      };
    },
    getBillingMonth(bVal,tName){
      //初始化默认带出首个主体与选择主体时重新定位月份
      getVoucherLockMonth({ billingMain: bVal }).then((res)=>{
        const { lockMonth } = res.data || {};
        this.$refs[
					`searchFormRef${tName}`
				][0]?.setFormModel({
					byMonth: lockMonth
				})
        if (!this.initDefaultTabs.includes(tName)) {
							// 初始化赋值一次
							this.initDefaultTabs.push(tName);
							this.$nextTick(() => {
								this.getTableList(
									this.$refs[
										`searchFormRef${tName}`
									][0]?.getFormParams()
								);
							})
						}
      })
    },
    getQueryParams(tName) {
      return this.searchFromData[tName] || {};
    },
		tableTabColumns(tName) {
			return tableColumns(tName);
		},
  },
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
