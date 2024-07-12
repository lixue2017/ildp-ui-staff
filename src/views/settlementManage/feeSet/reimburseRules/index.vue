<template>
  <!-- 新页面 -->
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <div class="checkbox base-flex-align">
            <div class="base-flex-align">
              <span>类型：</span>
              <el-checkbox-group
                @change="checkBoxConfig.handleClick"
                v-model="checkBoxConfig.checkData[tab.name]"
                size="mini"
                :min="1"
              >
                <el-checkbox
                  :label="item.value"
                  border
                  v-for="(item, index) in checkBoxConfig.columnConfig(tab.name)"
                  :key="index"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </div>

            <div v-if="tab.name === '2'" style="margin-left: 30px">
              默认规则:
              <span :style="{ color: getDictObj(billTypeDict, 1, false).color }"
                >(应收)</span
              >
              往来单位对应的业务员;
              <span :style="{ color: getDictObj(billTypeDict, 0, false).color }"
                >(应付)</span
              >
              提交人的直接领导(日常报销规则)
            </div>
          </div>

          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="mixinTableColArr[tab.name - 1]"
              :httpRequest="tableConfig.httpRequest[tab.name - 1]"
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="() => tableConfig.statusBtnList"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'levelName30'">
                  <div>
                    <div>{{ slotProps.row.levelName30 || "--" }}</div>
                    <div v-if="slotProps.row.amount30">
                      {{ slotProps.row.amount30 }}{{ slotProps.row.currencyCode30 }}
                    </div>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'levelName20'">
                  <div>
                    <div>{{ slotProps.row.levelName20 || "--" }}</div>
                    <div v-if="slotProps.row.amount20">
                      {{ slotProps.row.amount20 }}{{ slotProps.row.currencyCode20 }}
                    </div>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'levelName10'">
                  <div>
                    <div>{{ slotProps.row.levelName10 || "--" }}</div>
                    <div v-if="slotProps.row.amount10">
                      {{ slotProps.row.amount10 }}{{ slotProps.row.currencyCode10 }}
                    </div>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'levelName1'">
                  <div>
                    <div>{{ slotProps.row.levelName1 || "--" }}</div>
                    <div v-if="slotProps.row.amount1">
                      {{ slotProps.row.amount1 }}{{ slotProps.row.currencyCode1 }}
                    </div>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ComDialog ref="ComDialogRef" @handleSuccess="handleSuccess"></ComDialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { tableColumns, tableBillColumns, checkboxOptions } from "./model.js";
import { comFileDownload } from "@/utils/download.js";
import {
  getExpenseBillRuleList,
  getStatementRuleList,
  exportExpenseBillRule,
  getExpenseBillRule,
  GETBillRuleDetail,
} from "@/api/settlementManage/feeSet.js";
export default {
  name: "EcPendApproval",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () =>
      import(
        "@/views/settlementManage/feeSet/reimburseRules/components/dialog/index.vue"
      ),
  },
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
            label: "日常报销规则",
            name: "1",
          },
          {
            label: "对账单审核规则",
            name: "2",
          },
        ],
        // btnArr: [
        //   {
        //     table: "导出",
        //     handleClick: () => {
        //       this.exportData();
        //     },
        //   },
        // ],
      },
      checkBoxConfig: {
        columnConfig: checkboxOptions,
        checkData: {
          1: [0],
          2: [1],
        },
        handleClick: (row) => {
          this.checkChange(row);
        },
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: [getExpenseBillRuleList, getStatementRuleList],
        statusBtnList: [
          {
            text: "编辑",
            handleClick: this.handleUpdate,
          },
        ],
      },
      mixinTableColArr: [tableColumns, tableBillColumns()],
    };
  },
  computed: {
    ...mapState({
      billTypeDict: (state) => state.dictionary.dicsData.billType,
    }),
  },
  created() {
    this["dictionary/getDictionary"](["departmentDic", "billType"]);
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleResize() {
      const { activeName } = this.tabsConfig;
      this.$refs[`tableRef${+activeName}`][0].doLayout();
    },
    checkChange(row) {
      //勾选类型参数
      this.mixinkeepTable(true);
    },
    getQueryParams(tName) {
      return {
        type: tName==1?this.checkBoxConfig.checkData[tName]:undefined,
        types:tName==2?(this.checkBoxConfig.checkData[tName]||[]).join(','):undefined
      };
    },
    async handleUpdate(row) {
      //编辑
      const { activeName } = this.tabsConfig;
      const tagType = {
        1: "reimburseRules", //报销规则
        2: "processRules", //对账单审核规则
      }[activeName];
      if (activeName == 1) {
        this.$refs.ComDialogRef?.show(tagType, row);
      } else if (activeName == 2) {
        const {
          type,
          identity,
          isAppoint,
          customerId,
          identityName,
          typeName,
          customerName,
          user,
          deptId
        } = row;
        const params = {
          type,
          identity,
          isAppoint,
          customerId,
          deptId
        };
        const { data={} } = await GETBillRuleDetail(params);
        const {appointUserId, auditList,remark}=data
        const dialogParams = {
          type,
          identity,
          isAppoint,
          customerId,
          identityName,
          typeName,
          customerName,
          user,
          appointUserId,
          auditList,
          remark,
          deptId
        };
        this.$refs.ComDialogRef?.show(tagType, dialogParams);
      }
    },
    exportData() {
      //导出
      const { activeName } = this.tabsConfig;
      const { limit, start } =
        this.$refs[`tableRef${activeName}`][0]?.getPaging();
      const params = {
        pageNum: start,
        pageSize: limit,
        type: this.checkBoxConfig.checkData[activeName],
      };
      comFileDownload(this, exportExpenseBillRule, params);
    },
    handleSuccess() {
      this.mixinkeepTable(true);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .checkbox {
    margin-bottom: 15px;
  }
}
</style>
