<template>
  <div class="app-container" v-if="showSearchForm">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(tab.name)"
              v-if="tabsConfig.activeName === tab.name"
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
              v-loading="loading"
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              :selectionRow="selectionRowEvt"
              @onSelectionChange="onSelectionChange"
              :selectionTableRow="[...selectionRows[tab.name]]"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operate-btn-list">
                    <!-- <div class="btn">
                    <el-button
                      class="operate-icon"
                      size="mini"
                      type="text"
                      @click="handleClick(slotProps.row, 'edit')"
                    >
                      修改
                    </el-button>
                  </div> -->
                    <div class="btn">
                      <el-button
                        class="operate-icon"
                        size="mini"
                        type="text"
                        @click="handleClick(slotProps.row, 'detail')"
                      >
                        查看
                      </el-button>
                    </div>
                  </div>
                </template>
              </template>
              <template v-slot:bottomTotal>
                <div class="bottomTotalClass">
                  <div class="is-select-all">
                    <el-checkbox
                      v-model="selectAll"
                      :disabled="!selectionRows[tab.name].length"
                      @change="handleSelectAll"
                      >所有分页全选(选择一个之后可以操作)</el-checkbox
                    >
                  </div>
                  <div class="money-total">
                    <div
                      class="total"
                      v-if="
                        totalData[tab.name] &&
                        Object.keys(totalData[tab.name]).length
                      "
                    >
                      <div class="label">合计：</div>
                      <div class="value">
                        <template
                          v-for="code in Object.keys(totalData[tab.name])"
                        >
                          <!-- 金额太大会导致数据展示占宽太长样式错乱，除非加个固定宽度滑滚动条，但是加了滚动条太臃肿了还显示不全 -->
                          <div :key="code" class="value-space">
                            <span>{{
                              formatMoney(totalData[tab.name][code])
                            }}</span>
                            <span class="value-width-30">{{ code }}</span>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div v-else></div>
                  </div>
                </div>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>

    <EditDialog ref="editDialog" />
    <DetailDialog ref="detailDialog" />
  </div>
</template>

<script>
import {
  settleAccountsStayList,
  settleAccountsStayExport,
  batchGenerateBill,
} from "@/api/settlementManage/statementManage";
import { duplicateRemoval } from "@/utils/index";
import { accumulationFn } from "@/utils/instructions";
import { msgBox } from "@/utils/confirmBox.js";
import { searchBillColumns, tableColumns } from "../components/model";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { comFileDownload } from "@/utils/download.js";

export default {
  name: "PaymentBillDetailed",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    EditDialog: () => import("../components/EditDialog"),
    DetailDialog: () => import("../components/DetailDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.totalData = {};
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "待出应付对账单",
            name: "1",
          },
          {
            label: "一件代发待出应付对账单",
            name: "2",
          },
          {
            label: "仓租应付对账单",
            name: "3",
          },
        ],
        btnArr: [
          {
            table: "导出",
            handleClick: this.handleExport,
          },
          {
            table: "生成对账单",
            disabled: true,
            handleClick: this.generateBill,
          },
          {
            table: "批量生成对账单",
            disabled: true,
            handleClick: this.batchGenerateBill,
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.onSelectionChange([]); //触发搜索清空勾选
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "85px",
        residueCols: [2],
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: settleAccountsStayList,
      },
      selectionRows: {
        1: [],
        2: [],
        3: [],
      },
      mixinTableColArr: [tableColumns, tableColumns, tableColumns],
      sBusinessTypeList: [],
      totalData: {},
      selectAll: false,
      loading: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.sBusinessTypeList = this.dictBusinessTypeList
        .map((e) => e.value)
        .filter((v) => !["35", "40"].includes(v));
      this.getInitialData();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitialData() {
      this.showSearchForm = true;
    },
    getSearchFormConfig(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchBillColumns(tName), // 表单渲染列表
      };
    },
    handleExport() {
      comFileDownload(this, settleAccountsStayExport, {
        ...this.getQueryParams(this.tabsConfig.activeName),
        exportType: this.tabsConfig.activeName,
      });
    },
    getList(searchFrom = {}) {
      this.selectAll = false;
      const { time, createTime, ...searchObj } = searchFrom;
      const [beginTime, endTime] = time || [];
      const [beginCreateTime, endCreateTime] = createTime || [];
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        beginTime,
        endTime,
        beginCreateTime,
        endCreateTime,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tName) {
      const { billingMainName, ...nObj } = this.searchFromData[tName] || {};
      const businessTypeList = {
        1: this.sBusinessTypeList,
        2: [35],
        3: [40],
      }[tName];
      return {
        ...nObj,
        businessTypeList,
        isGenerateStatement: 0,
        isDataFil: 1,
        type: 0,
      };
    },
    handleClick(row, type) {
      if (type === "edit") {
        this.$refs.editDialog.show();
      } else {
        this.$refs.detailDialog.show(row);
      }
    },
    confirmNext() {
      return new Promise((resolve) => {
        const title = "警告提示";
        const className = "el-icon-warning text-warning";
        const msg = "币别不一致是否进入下一步！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    confirmGenerateBill(num) {
      return new Promise((resolve) => {
        const title = "提示";
        const className = "el-icon-success text-success";
        const msg = `确定将${num}条费用生成对账单？`;
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    batchGenerateBill() {
      const billIds = this.selectionRows[this.tabsConfig.activeName].map(
        (item) => item.id
      );
      this.confirmGenerateBill(billIds.length).then(() => {
        batchGenerateBill({
          billIds,
        }).then(() => {
          this.onSelectionChange();
          this.mixinkeepTable(true);
        });
      });
    },
    generateBill() {
      this.$message.closeAll();
      const { activeName } = this.tabsConfig;
      const selectRows = this.selectionRows[activeName];
      const { billingMain, dealingsCompany, type, currencyCode } =
        selectRows[0];
      const typeIndex = selectRows.findIndex((e) => type !== e.type);
      if (typeIndex > -1) {
        return this.$message.error("应收应付类型不一致不可生成账单");
      }
      const index = selectRows.findIndex(
        (e) =>
          billingMain !== e.billingMain || dealingsCompany !== e.dealingsCompany
      );
      if (index > -1) {
        return this.$message.error("计费主体与往来单位不一致不可生成账单");
      }
      const currencyIndex = selectRows.findIndex(
        (e) => currencyCode !== e.currencyCode
      );
      if (currencyIndex > -1) {
        return this.$message.error("货币不一致不可生成账单");
      }
      const nextFu = () => {
        const rowIds = selectRows.map((e) => e.id);
        const idRows = duplicateRemoval(rowIds).join(",");
        this.$router.push({
          path: "/settlementManagement/statementManage/editBillManage",
          query: {
            idRows,
            backPath: this.$route.fullPath,
            activeTab: "1", // 1为新增，2为修改，3为详情
          },
        });
      };
      if (currencyIndex > -1) {
        this.confirmNext().then(() => {
          nextFu();
        });
      } else {
        nextFu();
      }
    },
    onSelectionChange(rows = []) {
      // const row = rows[0] || {};
      const totalData = {};
      const { activeName } = this.tabsConfig;
      this.selectionRows[activeName] = rows.filter(
        (e) => {
          totalData[e.currencyCode] = accumulationFn([
            totalData[e.currencyCode],
            e.totalMoney,
          ]);
          return e;
        }
        // !e.lockOrder // 锁单可以生成对账单
        // e.dealingsCompanyName === row.dealingsCompanyName &&
        // e.billingMainName === row.billingMainName &&
        // e.currencyCode === row.currencyCode &&
        // e.type === row.type
      );
      this.totalData[activeName] = totalData;
      this.$refs[`tableRef${activeName}`][0]._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows[activeName],
      });
    },
    selectionRowEvt(row) {
      // 选择条件：同一个往来单位/同一个记账主体
      //列表条件选择，不满足条件置灰
      // if (row.lockOrder) { // 锁单可以生成对账单
      //1已经锁单
      //   return false;
      // }
      // const rSome = this.selectionRows.some(
      //   (e) =>
      //   e.dealingsCompanyName === row.dealingsCompanyName && //往来单位
      //   e.billingMainName === row.billingMainName && //记账主体
      //   e.type === row.type && //收付类型
      //   e.currencyCode === row.currencyCode //货币类型
      // );
      // if (this.selectionRows.length && !rSome) {
      //   return false;
      // }
      return true;
    },
    handleSelectAll(status) {
      this.loading = true;
      if (status) {
        //每一次都得重新获取最新的数据，避免他们多屏操作增加新数据
        const { activeName } = this.tabsConfig;
        const params = {
          ...this.getQueryParams(activeName),
          pageNum: 1,
          pageSize: 999999,
        };
        settleAccountsStayList(params).then((res) => {
          const { rows } = res;
          this.onSelectionChange(rows);
          this.loading = false;
        });
      } else {
        this.onSelectionChange();
        this.loading = false;
      }
    },
  },
  deactivated() {
    this.totalData = {};
    this.selectAll = false;
  },
  watch: {
    selectionRows: {
      deep: true,
      handler: function (newVal) {
        const { activeName } = this.tabsConfig;
        this.$set(
          this.tabsConfig.btnArr[1],
          "disabled",
          !newVal[activeName].length
        );
        this.$set(
          this.tabsConfig.btnArr[2],
          "disabled",
          !newVal[activeName].length
        );
      },
    },
  },
  computed: {
    ...mapState({
      dictBusinessTypeList: (state) =>
        state.dictionary.dicsData.settlementBusinessType,
    }),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .bottom-pagination {
    display: flex;
    justify-content: space-between;
    min-width: 0;
    .bottomTotalClass {
      display: flex;
      align-items: center;
      min-width: 0;
      flex: 1;
      .is-select-all {
        min-width: 0;
      }
      .money-total {
        min-width: 0;
        flex: 1;
        .total {
          display: flex;
          align-items: flex-start;
          padding: 20px;
          line-height: 20px;
          .label {
            font-size: 14px;
            font-weight: bold;
            flex-shrink: 0;
          }
          .value {
            display: flex;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow-x: auto;
            &::-webkit-scrollbar {
              z-index: 11;
              width: 6px;
            }
            &::-webkit-scrollbar:horizontal {
              height: 6px;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 5px;
              width: 6px;
              background: #b4bccc;
            }
            .value-space {
              margin-right: 15px;
            }
          }
          .value-width-30 {
            display: inline-block;
            width: 30px;
            text-align: right;
          }
          .value-width-45 {
            display: inline-block;
            width: 45px;
            text-align: right;
          }
        }
      }
    }
    .my-pagination-container {
      min-width: 0;
      flex: 1;
    }
  }
}
</style>
