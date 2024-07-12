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
              />
            </keep-alive>
          </el-tab-pane>
        </template>
      </ComTabs>
    </div>

		<ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['tipSlot']">
			<template v-slot:tipSlot="slotProps">
				<span>{{ ['注意: 结账之后不能再输入新的记账凭证，所有的账务资料都无法再修改，所以结账操作一定要慎重。',
				'使用“反结账”工具将当前会计期间返回到已结账的期间。'][slotProps.formModel.typeNum] }}</span>
			</template>
		</ComCustomDialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";

import {
  getLockRecordList,
	getVoucherLockMonth,
	postVoucherLock, postVoucherUnlock
} from "@/api/settlementManage/paymentReceived.js";
import { comSaveRepeatedRequest } from "@/api/common";
import {
  searchFormCols,
  tableColumns,
	customDialogCols,
	formRules
} from "./model";

export default {
	name: "ClosingReport",
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
						label: "结账管理",
						name: "1",
					}
				],
				btnArr: [
					{
						table: "结 账",
						tabBtnLoading: true,
						handleClick: () => this.handleVoucherLock(0)
					},
					{
						table: "反结账",
						tabBtnLoading: true,
						handleClick: () => this.handleVoucherLock(1),
					},
				],
			},
      searchFormConfig: {
        formModel: {},
        labelWidth: "90px",
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
				tableRequest: [getLockRecordList],
      },
			initDefaultTabs: [],
			showSearchForm: true,
			searchFromData: {
				1: {}
			},
    };
  },
  methods: {
		async handleVoucherLock(typeNum) {
			const { billingMain } = this.searchFromData[this.tabsConfig.activeName] || {};
			const { lockMonth, unlockMonth } = (await comSaveRepeatedRequest(getVoucherLockMonth, { billingMain })).data || {};
			const fMonth = [lockMonth, unlockMonth][typeNum];
			this.$refs.customDialogRef.showCustomDialog({
				customFormConfig: customDialogCols({ typeNum }),
				formModel: {
					// ...this.searchFormConfig.formModel,
					lockMonth,
					unlockMonth,
					typeNum
				},
				confirmCheckFunction: (callBack) => {
					if (fMonth) {
						callBack && callBack();
					} else {
						this.msgError(`没有日期，无法${['结账', '反结账'][typeNum]}`)
					}
				},
				httpRequest: () => {
					const voucherRequest = [postVoucherLock, postVoucherUnlock][typeNum];
					const opt = {
						billingMain,
						[['lockMonth', 'unlockMonth'][typeNum]]: fMonth
					}
					return comSaveRepeatedRequest(voucherRequest, opt)
				},
				successFunction: this.mixinkeepTable,
			})
		},
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
          },
        }),
      };
    },
    getQueryParams(tName) {
      return this.searchFromData[tName] || {};
    },
		tableTabColumns(tName) {
			return tableColumns(tName);
		},
		...mapActions(["dictionary/getDictionary"]),
  },
	created() {
		// getVoucherLockMonth().then(res => {
		// 	this.searchFormConfig.formModel = res.data || {};
		// 	this.showSearchForm = true;
		// })
		// this["dictionary/getDictionary"](["billType"]);
	},
	components: {
		ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
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
