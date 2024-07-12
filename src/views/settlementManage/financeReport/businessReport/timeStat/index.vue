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
            <template v-slot:salesmanId="slotProps">
              <AutoComplete
                  ref="salesmanIdsRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                    className: 'auto-dis-search',
                    disabled: !slotProps.formModel.businessCompany,
                  }"
                  :additionalParam="{
                    customerId: slotProps.formModel.businessCompany,
                  }"
                />
            </template>
              <template v-slot:customerId="slotProps">
                <AutoComplete
                  ref="companyRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                    className: 'auto-dis-search',
                    disabled: !slotProps.formModel.salesmanId,
                  }"
                  :additionalParam="{
                    salesmanId: slotProps.formModel.salesmanId,
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
              :isMountedRequest="false"
              :getQueryParams="getQueryParams"
            >
						</ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getEffectiveTimeList, exportEffectiveTime } from "@/api/settlementManage/paymentReceived.js";
import { comFileDownload } from "@/utils/download.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchFormCols, tableColumns,timeStatFormRules } from "./model.js";
export default {
	name: "TimeStat",
  mixins: [mixinColsConf],
	data() {
		return {
			tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "时效统计表",
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
        formModel:{},
				searchForm: true,
				fold: true,
				httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        labelWidth: "85px",
        formRules: timeStatFormRules, // 表单校验规则
      },
			tableConfig: {
        tableHeight: "calc(100vh - 265px)",
        httpRequest: getEffectiveTimeList,
      },
			btnType: null,
			searchFromData: {},
			mixinTableColArr: [tableColumns],
		}
	},
	methods: {
		getTableList(formModel = {}) {
      this.searchFromData = {
        ...formModel
      };
			if (this.btnType === "export") {
				comFileDownload(this, exportEffectiveTime, this.getQueryParams());
			} else {
				this.mixinkeepTable(true);
			}
    },
		searchTabForm() {
      return {
        ...this.searchFormConfig,
        lists: searchFormCols({
					salesmanHandle: () => {
            this.$refs.companyRef && this.$refs.companyRef[0]?.changeFocusRequest();
						this.$refs.searchFormRef[0]?.setFormModel({
							customerId: "", // 隐藏的查询联动需要重置
							customerId_name: ""
						})
          },
          businessCompanyHanele:()=>{
            if(!this.isint){
              this.isint=true
              this.getTableList(this.$refs.searchFormRef[0]?.getFormParams());
            }
            this.$refs.salesmanIdsRef && this.$refs.salesmanIdsRef[0]?.changeFocusRequest();
            this.$refs.searchFormRef[0]?.setFormModel({
							salesmanId: "",
						})
          }
				}),
      };
    },
		getQueryParams() {
			return {
				...this.searchFromData,
			}
		},
		...mapActions(["dictionary/getDictionary"]),
	},
	created() {
		// 默认当前用户
		this.searchFromData = {
      // salesmanIds: this.curUserInfo ? [ this.curUserInfo.userId ] : []
    };
		this.searchFormConfig.formModel = { ...this.searchFromData };
		this["dictionary/getDictionary"](["outWarehouseWay"]).then(() => {
			this.showSearchForm = true;
		})
	},
	// computed: {
  //   ...mapState({
  //     curUserInfo: (state) => state.user.userInfo,
  //   }),
  // },
	components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
	}
}
</script>
