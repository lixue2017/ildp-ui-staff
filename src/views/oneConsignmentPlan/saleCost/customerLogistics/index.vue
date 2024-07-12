<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <!-- <keep-alive>
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
            >
            </ComTable>
          </keep-alive> -->
        </el-tab-pane>
      </template>
    </ComTabs>

    <CostTrialDrawer ref="costTrialDrawerRef" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns } from "./model";
import { msgBox } from "@/utils/confirmBox.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "CustomerLogisticsList",
  mixins: [mixinColsConf],
  components: {
    CostTrialDrawer: () => import("./components/CostTrialDrawer"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "客户物流费用",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "一件代发费用试算",
            handleClick: () => this.handleTrial(),
          },
        ],
      },
      // searchFromData: {},
      // searchFormConfig: {
      //   formModel: {}, // 表单数据
      //   fold: true, // 模糊搜索是否需要展开按钮
      //   httpRequest: (formModel) => {
      //     return new Promise((resolve) => {
      //       this.getList(formModel);
      //       resolve();
      //     });
      //   }, // 表单提交接口
      //   searchForm: true,
      //   size: "small",
      //   labelWidth: "85px",
      //   searchNum: searchColumns.length,
      //   lists: [
      //     {
      //       className: "search-form-width",
      //       fieldList: [
      //         {
      //           rows: [
      //             {
      //               cols: searchColumns,
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ], // 表单渲染列表
      //   formRules: {}, // 表单校验规则
      // },
      // tableConfig: {
      //   tableHeight: "calc(100vh - 264px)",
      //   httpRequest: getCostLogisticsList,
      // },
      // mixinTableColArr: [tableColumns],
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
      this["dictionary/getDictionary"]("saleLogistics").then(() => {
        this.showSearchForm = true;
      });
    },
    getList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const [beginTime, endTime] = createTime || [];
      this.searchFromData = {
        ...searchObj,
        beginTime,
        endTime,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    handleTrial() {
      this.$refs.costTrialDrawerRef.show();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
