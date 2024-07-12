<template>
	<div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
							ref="searchFormRef"
							v-if="showSearchForm && tabsConfig.activeName === tab.name"
              :formConfig="searchTabForm()"
            >
              <template v-slot:customerId="slotProps">
                <AutoComplete
                  ref="companyRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                    className: 'auto-dis-search',
                    disabled: !slotProps.formModel.salesmanIds || !slotProps.formModel.salesmanIds.length,
                  }"
                  :additionalParam="{
                    salesmanIds: slotProps.formModel.salesmanIds,
                  }"
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
              :getQueryParams="getQueryParams"
            >
						<!-- :isMountedRequest="false" -->
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { getGoodsTraceList, exportGoodsTrace } from "@/api/settlementManage/paymentReceived.js";
import { formatDate } from "@/utils/index.js";
import { comFileDownload } from "@/utils/download.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchFormCols, formRules, tableColumns } from "./model.js";

export default {
	name: "GoodsTracking",
  mixins: [mixinColsConf],
	data() {
		return {
			tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "货物跟踪表",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => {
							this.btnType = "export";
							this.$refs.searchFormRef[0]?.submitForm();
							setTimeout(() => {
								this.btnType = null;
							}, 500)
						},
          },
        ],
      },
			searchFormConfig: {
				searchForm: true,
				fold: true,
				httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        labelWidth: "85px",
        formRules, // 表单校验规则
      },
			tableConfig: {
        tableHeight: "calc(100vh - 265px)",
        httpRequest: getGoodsTraceList,
      },
			btnType: null,
			searchFromData: {},
			mixinTableColArr: [tableColumns],
		}
	},
	methods: {
		getTableList(searchFrom = {}) {
      this.searchFromData = searchFrom;
			if (this.btnType === "export") {
				comFileDownload(this, exportGoodsTrace, this.getQueryParams());
			} else {
				this.mixinkeepTable(true);
			}
    },
		searchTabForm() {
      return {
        ...this.searchFormConfig,
        lists: searchFormCols({
					// customerHandle: (val) => {
					// 	this.$refs.salesmanRef[0]?.changeFocusRequest();
					// 	if (!this.isDefaultSelection) {
					// 		this.isDefaultSelection = true;
					// 		this.getTableList(this.$refs.searchFormRef[0]?.getFormParams());
					// 	}
					// },
					salesmanHandle: () => {
            this.$refs.companyRef && this.$refs.companyRef[0]?.changeFocusRequest();
						this.$refs.searchFormRef[0]?.setFormModel({
							customerId: "", // 隐藏的查询联动需要重置
							customerId_name: ""
						})
          },
				}),
      };
    },
		getQueryParams() {
			const { createTime, oDate, ...searchObj } = this.searchFromData;
			const [startTime, endTime] = createTime || [];
			return {
				...searchObj,
				startTime,
        endTime,
				// startGoodsWarehouseDate: oDate && oDate[0],
        // endGoodsWarehouseDate: oDate && oDate[1],
			}
		},
		...mapActions(["dictionary/getDictionary"]),
	},
	created() {
		// 默认当前用户
		const theSameMonth = [`${formatDate(new Date().getTime(), '/', 'month')}/01`, formatDate(new Date().getTime(), '/', 'date')] // 默认当月1号到当前日期
    this.searchFromData = {
			createTime: theSameMonth,
			// oDate: theSameMonth,
      salesmanIds: this.salesmanId ? [ this.salesmanId ] : []
    };
		this.searchFormConfig.formModel = { ...this.searchFromData };
		this["dictionary/getDictionary"](["orderStatus"]).then(() => {
			this.showSearchForm = true;
		})
	},
	computed: {
    // ...mapState({
    //   curUserInfo: (state) => state.user.userInfo,
    // }),
		...mapGetters(["salesmanId", "salesmanName"]),
  },
	components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
	}
}
</script>