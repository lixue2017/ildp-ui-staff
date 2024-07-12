<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="{
                ...searchFormConfig,
                ...searchColumns(tab.name),
              }"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :httpRequest="tableConfig.httpRequest[tab.name]"
              :columnConfig="tableConfig.tableColumns[tab.name]"
              :getQueryParams="() => getQueryParams(tab.name)"
              @handleTableView="handleView"
              :rowOperationBtnListFn="getOperationBtn"
              @handleRowBtnClick="handleRowBtnClick"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <RuleDialog ref="ruleDialogRef" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, ruleTableColumns, setTableColumns } from "./model";
import { msgBox } from "@/utils/confirmBox.js";
import { mapState, mapActions } from "vuex";
import {
  getCostOdaSettingsList,
  getCostSpecialRuleList,
  enableDisableSpecialRule,
  deleteSpecialRule,
} from "@/api/oneConsignmentPlan/saleSpecialCost";
export default {
  name: "OdaConfigList",
  mixins: [mixinColsConf],
  components: {
    RuleDialog: () => import("./components/RuleDialog"),
  },
  data() {
    return {
      searchColumns,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "ODA偏远地区规则",
            name: "1",
          },
          // {
          //   label: "ODA设置",
          //   name: "2",
          // },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleAdd(),
            showTabName: "1",
          },
        ],
      },
      searchFromData: {
        1: {
          stateIn:['3','0','1']
        },
        2: {
          stateIn:['3','0','1']
        },
      },
      searchFormConfig: {
        formModel: {
          stateIn:['3','0','1']
        }, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "87px",
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: {
          1: getCostSpecialRuleList,
          2: getCostOdaSettingsList,
        },
        tableColumns: {
          1: ruleTableColumns,
          2: setTableColumns,
        },
      },
      mixinTableColArr: [ruleTableColumns, setTableColumns],
      operationBtn: [
        {
          text: "启用",
          type: "enable",
          status: [0, 2],
        },
        {
          text: "禁用",
          type: "interdict",
          status: [1],
        },
        {
          text: "修改",
          type: "edit",
          status: [0],
        },
        {
          text: "复制",
          type: "copy",
          status: [0,1,2],
        },
        {
          text: "删除",
          type: "delete",
          status: [0],
          color: "#ff6767",
        },
      ],
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this.searchDictionary();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchDictionary() {
      this["dictionary/getDictionary"]("saleSpecialCost").then(() => {
        this.showSearchForm = true;
      });
    },
    handleCommand(cb, row) {
      cb && cb(row);
    },
    getList(searchFrom = {}) {
      const { beginTime, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        beginTime: beginTime && beginTime.join("@"),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      if (tab === "1") {
        this.searchFromData[tab].type = 1;
      }
      const { stateIn=[], ...obj } = this.searchFromData[tab];
      return {
        ...obj,
        stateIn:stateIn.join(',')
      };
    },
    handleView(row) {
      const { activeName } = this.tabsConfig;
      if (activeName === "2") {
        const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
          (item) => item.id
        );
        this.$router.push({
          path: "/oneConsignmentPlan/saleSpecialCost/odaSetDetail",
          query: {
            id: row.id,
            backPath: this.$route.path,
            pageSign: idList.join(","), // 详情显示上一页/下一页
          },
        });
      } else {
        this.$refs.ruleDialogRef.show(row, true);
      }
    },
    handleAdd() {
      this.$refs.ruleDialogRef.show();
    },
    getOperationBtn(row) {
      const { state } = row;
      return this.operationBtn.filter((btn) => btn.status.includes(state));
    },
    handleInterdict(rows) {
      const { id } = rows;
      if (id) {
        const msg = "操作禁用之后该数据不可被关联引用！";
        const title = "禁用提示";
        const className = "el-icon-warning text-warning";

        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, enableDisableSpecialRule, { id }).then(
            () => {
              this.msgSuccess("禁用成功！");
              this.mixinkeepTable();
            }
          );
        });
      }
    },
    handleDelete(rows) {
      const { id } = rows;
      if (id) {
        const msg = "删除操作不可逆！";
        const title = "删除提示";
        const className = "el-icon-warning text-warning";

        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, deleteSpecialRule, { id }).then(() => {
            this.msgSuccess("删除成功！");
            this.mixinkeepTable();
          });
        });
      }
    },
    handleCopy(row={}){
      const {id,...obj}=row
      this.$refs.ruleDialogRef.show({
        ...obj,
        copyId:id
      });
    },
    handleRowBtnClick(row, btn) {
      const { type } = btn;
      switch (type) {
        case "enable":
          this.comRepeatedRequest(this, enableDisableSpecialRule, {
            id: row.id,
          }).then(() => {
            this.msgSuccess("启用成功！");
            this.mixinkeepTable();
          });
          break;
        case "interdict":
          this.handleInterdict(row);
          break;
        case "edit":
          this.$refs.ruleDialogRef.show(row);
          break;
        case "delete":
          this.handleDelete(row);
          break;
        case "copy":
          this.handleCopy(row)
          break
        default:
          break;
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
