<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :httpRequest="tableConfig.httpRequest"
              :columnConfig="tableMixinConfig(tab.name)"
              :getQueryParams="() => getQueryParams()"
              @handleTableView="handleView"
              :rowOperationBtnListFn="getOperationBtn"
              @handleRowBtnClick="handleRowBtnClick"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns } from "./model";
import { msgBox } from "@/utils/confirmBox.js";
import { mapState, mapActions } from "vuex";
import {
  getCostSpecialRuleList,
  enableDisableSpecialRule,
  deleteSpecialRule,
} from "@/api/oneConsignmentPlan/saleSpecialCost";
export default {
  name: "OverLengthOverweightList",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "超长超重规则",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleAdd(),
          },
        ],
      },
      searchFromData: {
        stateIn:['0','1']
      },
      searchFormConfig: {
        formModel: {
          stateIn:['0','1']
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
        labelWidth: "98px",
        searchNum: searchColumns.length,
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getCostSpecialRuleList,
      },
      mixinTableColArr: [tableColumns],
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
      this["dictionary/getDictionary"]("odaConfig").then(() => {
        this.showSearchForm = true;
      });
    },
    handleCommand(cb, row) {
      cb && cb(row);
    },
    getList(searchFrom = {}) {
      const { beginTime, ...searchObj } = searchFrom;
      this.searchFromData = {
        ...searchObj,
        beginTime: beginTime && beginTime.join("@"),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      // 0=超长超重规则，1=ODA偏远地区规则
      const { stateIn=[], ...obj } = this.searchFromData;
      return {
        ...obj,
        type: 0,
        stateIn:stateIn.join(',')
      };
    },
    handleView(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: "/oneConsignmentPlan/saleSpecialCost/overLengthOverweightDetail",
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleAdd() {
      this.$router.push({
        path: "/oneConsignmentPlan/saleSpecialCost/editOverLengthOverweight",
        query: {
          backPath: this.$route.path,
        },
      });
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
    handleCopy(row) {
      const { id } = row;
      this.$router.push({
        path: "/oneConsignmentPlan/saleSpecialCost/editOverLengthOverweight",
        query: {
          copyId: id,
          backPath: this.$route.path,
        },
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
          this.$router.push({
            path: "/oneConsignmentPlan/saleSpecialCost/editOverLengthOverweight",
            query: {
              id: row.id,
              backPath: this.$route.path,
            },
          });
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

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
