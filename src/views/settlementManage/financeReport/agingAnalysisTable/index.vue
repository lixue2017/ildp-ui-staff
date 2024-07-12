<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              class="search-info"
              ref="searchFormRef"
              :formConfig="searchConfig"
              @handleChange="handleChange"
              @resetForm="resetForm"
              v-if="showSearchForm"
            >
              <template v-slot:salesman="slotProps">
                <AutoComplete
                  ref="salesmanRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                    className: 'auto-dis-search',
                    refreshRequest: salesmanRefreshRequest,
                  }"
                  :additionalParam="{
                    customerId: slotProps.formModel.businessCompany, // 所属公司
                  }"
                />
              </template>
              <template v-slot:assessmentDate="slotProps">
                <el-date-picker
                  v-model="slotProps.formModel.assessmentDate"
                  :value-format="slotProps.fieldItem.valueFormat"
                  type="daterange"
                  :disabled="
                    slotProps.formModel.tolType.length > 0 &&
                    !(
                      slotProps.formModel.tolType.includes(1) ||
                      slotProps.formModel.tolType.includes(2)
                    )
                  "
                  range-separator="-"
                  :start-placeholder="slotProps.fieldItem.startPlaceholder"
                  :end-placeholder="slotProps.fieldItem.endPlaceholder"
                ></el-date-picker>
              </template>
              <template v-slot:checkDate="slotProps">
                <el-date-picker
                  v-model="slotProps.formModel.checkDate"
                  :value-format="slotProps.fieldItem.valueFormat"
                  type="daterange"
                  :disabled="
                    slotProps.formModel.tolType.length > 0 &&
                    !slotProps.formModel.tolType.includes(3)
                  "
                  range-separator="-"
                  :start-placeholder="slotProps.fieldItem.startPlaceholder"
                  :end-placeholder="slotProps.fieldItem.endPlaceholder"
                ></el-date-picker>
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive>
            <ComTable
              :ref="`tableRef${tab.name}`"
              tableHeight="463px"
              :columnConfig="
                tableColumns(
                  cusIde,
                  searchFromData.tolType && searchFromData.tolType.length
                    ? searchFromData.tolType
                    : ''
                )
              "
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :pagination="true"
              :extraConfig="{ multiline: true }"
              @getResult="getResult"
              v-if="showSearchForm"
            >
            </ComTable>
          </keep-alive>
          <keep-alive>
            <ComTable
              class="total-table"
              :ref="`totalTableRef${tab.name}`"
              :columnConfig="
                totalTableColumns(
                  cusIde,
                  searchFromData.tolType && searchFromData.tolType.length
                    ? searchFromData.tolType
                    : ''
                )
              "
              :columnData="totalTableData"
              :pagination="false"
              :extraConfig="{ multiline: true }"
              v-if="showSearchForm"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  getBillAgingList,
  getBillAgingExport,
} from "@/api/settlementManage/agingAnalysisTable.js";
import { formatDate } from "@/utils/index.js";
import {
  formConfig,
  tableColumns,
  totalTableColumns,
  formRulesLists,
} from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "DailyReport",
  mixins: [mixinColsConf],
  props: {
    cusIde: {
      // cusIde:客户身份(2:客户/3服务商)
      type: Number,
      default: 2,
    },
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    const startTime = `${new Date().getFullYear()}-01-01`;
    const endTime = formatDate(new Date(), "-", "date");
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          return;
        },
        tabs: [
          {
            label: this.cusIde === 2 ? "客户账龄分析" : "服务商账龄分析",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => {
              this.handleExport();
            },
          },
        ],
      },
      searchConfig: {
        formModel: {
          assessmentDate: [startTime, endTime],
          tolType: [1, 2],
        },
        size: "small",
        labelWidth: "105px",
        searchForm: true,
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        ...formConfig(this.cusIde), // 表单校验规则
      },
      salesmanRefreshRequest: false,
      searchFromData: {},
      tableColumns,
      totalTableColumns,
      btnType: null,
      tableConfig: {
        httpRequest: getBillAgingList,
      },
      totalTableData: [],
    };
  },
  mounted() {
    logisticsCustomerInfo({ pageNum: 1, pageSize: 10 }).then(
      ({ rows = [] }) => {
        this.searchConfig.formModel = {
          ...this.searchConfig.formModel,
          businessCompany: rows[0]?.id,
          customerName: rows[0]?.nameCn,
          salesman: this.salesmanId ? [this.salesmanId] : [],
        };
        const { assessmentDate, tolType, businessCompany, customerName } =
          this.searchConfig.formModel;
        const [startTime, endTime] = assessmentDate;
        this.searchFromData = {
          startTime,
          endTime,
          businessCompany,
          customerName,
          salesman: this.salesmanId ? [this.salesmanId] : [],
          tolType,
        };
        this["dictionary/getDictionary"]([
          "settlementBusinessType",
          "accountCycle",
        ]).then(() => {
          this.showSearchForm = true;
        });
      }
    );
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getQueryParams() {
      return { ...this.searchFromData, cusIde: [this.cusIde] };
    },
    getSearchList(searchFrom = {}) {
      const { assessmentDate = [], checkDate = [], ...searchObj } = searchFrom;
      const [startTime, endTime] = assessmentDate;
      const [startCheckDate, endCheckDate] = checkDate;
      this.searchFromData = {
        ...searchObj,
        startTime,
        endTime,
        startCheckDate,
        endCheckDate,
      };
      this.mixinkeepTable(true);
    },
    handleExport() {
      const params = this.getQueryParams();
      comFileDownload(this, getBillAgingExport, params);
    },
    handleChange(val, prop) {
      if (prop == "businessCompany") {
        this.salesmanRefreshRequest = !this.salesmanRefreshRequest;
        this.$refs.searchFormRef[0].setFormModel({
          salesman: [],
        });
      } else if (prop == "tolType") {
        let ruleValide = {}; //ruleValide需要新增的表单校验
        let removeRule = []; //removeRule需要移除的表单校验
        let params = {};
        if (val.length == 0) {
          removeRule = ["assessmentDate", "checkDate"];
        } else if ((val.includes(1) || val.includes(2)) && val.includes(3)) {
          ruleValide = {
            assessmentDate: formRulesLists["assessmentDate"],
            checkDate: formRulesLists["checkDate"],
          };
        } else if (val.includes(3)) {
          params = {
            assessmentDate: [],
          };
          ruleValide = {
            checkDate: formRulesLists["checkDate"],
          };
          removeRule = ["assessmentDate"];
        } else {
          params = {
            checkDate: [],
          };
          ruleValide = {
            assessmentDate: formRulesLists["assessmentDate"],
          };
          removeRule = ["checkDate"];
        }
        this.$refs.searchFormRef[0]?.setFormRules(ruleValide, removeRule);
        this.$refs.searchFormRef[0]?.setFormModel(params);
      }
    },
    getResult({ resultData }) {
      this.totalTableData = resultData.data;
      if (this.$refs[`totalTableRef${this.tabsConfig.activeName}`]) {
        this.$refs[
          `totalTableRef${this.tabsConfig.activeName}`
        ][0].setNewTableData(this.totalTableData);
      }
    },
    resetForm() {
      const { tolType } = this.searchConfig.formModel;
      this.handleChange(tolType, "tolType");
    },
  },
  computed: {
    ...mapGetters(["salesmanId"]),
  },
  activated() {
    if (this.$refs.searchFormRef) {
      this.$refs.searchFormRef[0].submitForm();
    }
  },
};
</script>

<style lang="scss" scoped>
.total-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
/deep/ {
  .my-pagination-container {
    padding-bottom: 0;
  }
}
</style>
