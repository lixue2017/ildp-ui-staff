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
                <template v-slot:salesmanId="slotProps">
                  <AutoComplete
                    ref="salesmanRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      ...slotProps.fieldItem,
                      className: 'auto-dis-search',
                      disabled: !slotProps.formModel.customerId,
                    }"
                    :additionalParam="{
                      customerId: slotProps.formModel.customerId,
                    }"
                  />
                </template>

                <template v-slot:dealingsCompanyId="slotProps">
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

            <keep-alive>
              <ComTable
                :class="`voucher-table-${tab.name}`"
                :ref="`tableRef${tab.name}`"
                :columnConfig="tableTabColumns(tab.name)"
                :tableHeight="tableConfig.tableHeight"
                :httpRequest="tableConfig.tableRequest[tab.name - 1]"
                :getQueryParams="() => getQueryParams(tab.name)"
                :isMountedRequest="false"
                :selectionKey="tab.name == '2' ? 'voucherNo' : 'orderNo'"
                :selectionRow="selectionRowEvt"
                @onSelectionChange="onTableSelectionChange"
                :selectionTableRow="[ ...selectionRows [ tab.name ] ]"
                :treeLazyLoad = "{
                  lazy: true,
                  load: (row, treeNode, resolve) =>
                    tableTreeLoad(row, resolve, tab.name),
                }"
                :tree-props = " {
                  children: 'children',
                  hasChildren: 'webHasChildren',
                }"
                :spanMethod="
                  ({ row, columnIndex }) =>
                    spanMethod({ row, columnIndex }, tab.name)
                "
                @getResult="getTableResult"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template
                    v-if="tab.name === '1' && slotProps.prop === 'orderNo'"
                  >
                    <template>
                      <span>{{ slotProps.row.orderNo }}</span>
                    </template>
                  </template>

                  <template v-if="tab.name === '2'">
                    <template v-if="slotProps.prop === 'lineRow'">
                      <span v-if="!slotProps.row.webHasChildren">{{
                        slotProps.row.lineRow + 1
                      }}</span>
                    </template>
                    <template v-if="slotProps.prop === 'orderNum'">
                      <span>{{ slotProps.row.orderNum }}</span>
                    </template>
                  </template>
                </template>
								<template v-slot:bottomTotal v-if="tab.name === '2'">
                  <ComTable
                    :ref="`tableTotal`"
                    :columnConfig="tableTotalConfig.columnConfig"
                    :columnData="tableTotalConfig.columnData"
                    :extraConfig="{ multiline: true }"
                  >
                    <template v-slot:customRow="{ slotProps }">
                      <template v-if="slotProps.prop === 'leftHeader'">
                        <div
                          v-for="(item, index) in collectConfig"
                          :key="index"
                        >
                          <span
                            :style="{
                              color: item.color,
                            }"
                            v-if="item.rowIndex.includes(slotProps.rowIndex)"
                          >
                            {{ item.label }}
                          </span>
                        </div>
                      </template>
                    </template>
                  </ComTable>
								</template>
              </ComTable>
            </keep-alive>
          </el-tab-pane>
        </template>
      </ComTabs>
    </div>
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
// import { formatDate } from "@/utils/index.js";
import { comFileDownload } from "@/utils/download.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  getVoucherReportList,
  exportVoucherReport,
  postAddVoucher,
  getSettleVoucherList,
	getSettleVoucherSubtotal,
  postDelVoucher,
  getVoucherReportDetail,
  getSettleVoucherDetail,
	getVoucherLockMonth
} from "@/api/settlementManage/paymentReceived.js";
import {toThousands } from "@/utils/index.js";
import { searchFormCols, formRules, tableColumns,tableTotleLists } from "./model";
import { getCurrencyList } from "@/api/basicData/index.js";
export default {
	// name: "VoucherReport", // 不做缓存
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
					if (this.initDefaultTabs.includes(this.tabsConfig.activeName)) {
						this.$nextTick(() => {
							this.mixinkeepTable();
						});
					}
        },
        tabs: [
          {
            label: "待生成凭证",
            name: "1",
          },
          {
            label: "已生成凭证",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "生成凭证",
            showTabName: "1",
            disabled: true,
            handleClick: () => {
              this.generateVouchers();
            },
          },
          {
            table: "删 除",
            showTabName: "2",
            disabled: true,
            handleClick: () => {
              this.isAll = false;
              this.handleDelete();
            },
          },
          {
            table: "导出",
            showTabName: "2",
            disabled: true,
            icon: "iconfont daochu",
            handleClick: () => {
              this.isAll = false;
              this.handleExport();
            },
          },
          {
            table: "一键删除",
            showTabName: "2",
            handleClick: () => {
              this.isAll = true;
              this.handleDelete();
            },
          },
          {
            table: "一键导出",
            showTabName: "2",
            icon: "iconfont daochu",
            handleClick: () => {
              this.isAll = true;
              this.handleExport();
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {
          // month,
        },
        labelWidth: "85px",
				searchForm: true,
        // fold: tName === '2',
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
						this.onTableSelectionChange(); // 查询重置选中项
            resolve();
          });
        }, // 表单提交接口
        formRules, // 表单校验规则
      },
      tableTotalConfig: {
        columnData: [],
      },
      tableConfig: {
        tableHeight: "calc(100vh - 413px)",
        tableRequest: [getVoucherReportList, getSettleVoucherList],
      },
      selectionRows: {
        1: [],
        2: [],
      },
      searchFromData: {
        2: {
          // beginTime: `${month[0]}`,
          // endTime: `${month[1]}`,
        },
      },
			initDefaultTabs: [],
			showSearchForm: false,
      btnType: null,
      isAll: false, //区分已生成凭证页面右侧按钮是一键还是单个
			tableSubtotal: [],
      collectConfig: [
        {
          label: "应收总计：",
          color: "#53C88A",
          rowIndex: [0],
        },
        {
          label: "应付总计：",
          color: "#FF6767",
          rowIndex: [1],
        },
        {
          label: "利润总计：",
          rowIndex: [2],
        },
      ],
    };
  },
  methods: {
    getIsitConfig(){
      getCurrencyList({ isTabShow: 1 }).then((res)=>{
        const {rows=[]}=res
        this.tableTotalConfig={
          ...this.tableTotalConfig,
          columnConfig: tableTotleLists(rows),
        }
        this.showSearchForm=true
      })
    },
    generateVouchers() {
      const { activeName } = this.tabsConfig;
      const selectRows = this.selectionRows[activeName];
        // this.$refs[`tableRef${activeName}`][0]?.rowsTableSelectMultiple();
      if (!selectRows.length) return;
			const { customerId } = this.searchFromData[activeName]
      const orderNos = selectRows.map((e) => e.orderNo);
      const { beginTime, lastTime } = this.searchFromData[activeName];
      this.comRepeatedRequest(this, postAddVoucher, {
        orderNos,
        beginTime,
        lastTime,
				customerId,
      }).then(() => {
        this.onTableSelectionChange();
        this.mixinkeepTable();
      });
    },
    /**展开树形数据 */
    tableTreeLoad(row, resolve, tName) {
      const { billingMain }  = this.$refs[`searchFormRef${tName}`][0]?.getFormParams()
      const httpVoucherDetail =
        tName == "2" ? getSettleVoucherDetail : getVoucherReportDetail;
      const { beginTime, lastTime } = this.searchFromData[tName];
      const cKey = tName == "2" ? "voucherNo" : "orderNo";
      this.comRepeatedRequest(this, httpVoucherDetail, {
        [tName == "2" ? "voucherNos" : "orderNos"]: [row[cKey]],
        beginTime: tName == "1" ? beginTime : undefined,
        lastTime: tName == "1" ? lastTime : undefined,
        generateTime: tName == "1" ? undefined : row.generateTime,
        billingMain : tName == "2" ? billingMain : undefined,
      }).then((res) => {
        resolve(res.rows || []);
      });
    },
    handleDelete() {
      this.$refs.confirmDialog?.delete().then(() => {
        const { activeName } = this.tabsConfig;
        const selectRows = this.selectionRows[activeName];
        // if (!selectRows.length) return;
        const voucherNos = selectRows.map((e) => e.voucherNo);
        const { beginTime, endTime, billingMain } = this.searchFromData[activeName];
        this.comRepeatedRequest(this, postDelVoucher, {
          voucherNos: this.isAll ? undefined : voucherNos,
          beginTime,
          endTime,
					billingMain,
        }).then(() => {
          this.onTableSelectionChange();
          this.mixinkeepTable();
        });
      });
    },

    getTableList(obj = {}) {
      const { month, ...nObj } = obj;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        beginTime: month?.length ? `${month[0]}` : undefined,
        [activeName === "2" ? "endTime" : "lastTime"]: month?.length
          ? `${month[1]}`
          : undefined,
        ...nObj,
      };
      if (this.btnType === "export") {
        this.btnType = null;
        const selectRows = this.selectionRows[activeName];
        comFileDownload(this, exportVoucherReport, {
          ...this.searchFromData[activeName],
          voucherNos: this.isAll
            ? undefined
            : selectRows.map((e) => e.voucherNo),
        });
      } else {
        this.mixinkeepTable(true);
      }
    },
    handleExport(row = {}) {
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
          customerHandle: (val) => {
						if (val) {
							this.getBillingMonth(val, tName);
						}
            if (tName === '1') {
							this.$refs.salesmanRef[0]?.changeFocusRequest();
						}
          },
          salesmanHandle: () => {
            this.$refs.companyRef[0]?.changeFocusRequest();
          },
        }),
      };
    },
		getBillingMonth(bVal, tName) {
			// 根据主体获取默认日期
			getVoucherLockMonth({ billingMain: bVal }).then(res => {
				const { lockMonth } = res.data || {};
				this.$refs[
					`searchFormRef${tName}`
				][0]?.setFormModel({
					month: [lockMonth, lockMonth]
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
      // let params = {
      //   ...this.searchFromData[tName],
      // };
      // if (tName == 1) {
      //   delete params.endTime;
      //   delete params.startTime;
      // }
      return this.searchFromData[tName];
    },
    tableTabColumns(tName) {
      return tableColumns(tName);
    },
    getTableResult({ tableData, resultData }) {
      tableData.forEach((e) => (e.webHasChildren = true));
      const { activeName } = this.tabsConfig;
      this.$refs[`tableRef${activeName}`][0]?.setNewTableData(tableData);
      if (activeName === "2") {
        const { data } = resultData;
        this.tableTotalConfig.columnData = [...data];
        this.$refs.tableTotal[0]?.setNewTableData(
          this.tableTotalConfig.columnData
        );
      }
    },
    spanMethod({ row, columnIndex }, tName) {
      if (row.webHasChildren) {
        if (tName === "2") {
          if (columnIndex === 2) {
            return [1, 2];
          } else if (columnIndex === 3) {
            return [0, 0];
          } else if (columnIndex === 7) {
            return [1, tableColumns(tName).length - 7];
          } else {
            return [1, 1];
          }
        } else {
          if (columnIndex === 1) {
            return [1, tableColumns(tName).length - 1];
          } else {
            return [1, 1];
          }
        }
      }
    },
    onTableSelectionChange(rows = []) {
      // const row = rows[0] || {};
      const { activeName } = this.tabsConfig;
      this.selectionRows[activeName] = rows;
      this.$refs[`tableRef${activeName}`][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows[activeName],
      });
    },
    selectionRowEvt(row) {
      // const { activeName } = this.tabsConfig;
      // const rSome = this.selectionRows[activeName].some(
      //   (e) =>
      //     e.type === row.type // 类型
      // );
      // if (this.selectionRows[activeName].length && !rSome) {
      //   return false;
      // }
      return true;
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["billType"]).then((res)=>{
      this.getIsitConfig()
    });
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  watch: {
    selectionRows: {
      deep: true,
      handler: function (newVal) {
        const { activeName } = this.tabsConfig;
        if (activeName == 1) {
          this.$set(
            this.tabsConfig.btnArr[activeName - 1],
            "disabled",
            !newVal[activeName].length
          );
        } else {
          this.tabsConfig.btnArr.map((e, index) => {
            if (index == 1 || index == 2) {
              this.$set(
                this.tabsConfig.btnArr[index],
                "disabled",
                !newVal[activeName].length
              );
            }
          });
        }
      },
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

  /deep/ {
    .voucher-table-2 {
      // 序号样式
      .el-table__row--level-1 {
        .el-table_2_column_12 {
          .cell {
            padding-left: 15px;
            padding-right: 5px;
          }
        }
        .el-table__indent,
        .el-table__placeholder {
          display: none;
        }
      }
    }
    .el-table__row--level-1 {
      .el-checkbox {
        display: none;
      }
    }
  }
}
</style>
