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
            :ref="`tableRef${tab.name}`"
            :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
            :columnConfig="tableMixinConfig(tab.name)"
            :httpRequest="tableConfig.httpRequest"
            :getQueryParams="tableConfig.getQueryParams"
            v-if="tabsConfig.activeName === tab.name"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'operationOrderNum1'">
                <span
                  class="primary-text-btn"
                  @click="handleView(slotProps.row)"
                >
                  {{ slotProps.row.operationOrderNum1 }}
                </span>
              </template>
              <template v-if="slotProps.prop === 'countsum'">
                <span
                  class="primary-text-btn"
                  @click="handleDrawer(slotProps.row)"
                >
                {{ slotProps.row.countsum ? slotProps.row.countsum : "0" }}
                </span>
              </template>
            </template>
          </ComTable>
          </keep-alive>

        </el-tab-pane>
      </template>
    </ComTabs>
    <AddDrawer ref="addDrawer" @handleSuccess="mixinkeepTable">
      <template v-slot:operationDate="slotProps">
        <div class="drawer-title">
          <span>{{ slotProps.activity.createTime }}</span>
          <span>
            {{ slotProps.activity.createBy }}
            <!-- {{ slotProps.activity.type }} -->
          </span>
        </div>
      </template>
      <template v-slot:operationContent="slotProps">
        <span>
          {{ slotProps.activity.remark }}
        </span>
      </template>
    </AddDrawer>
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { clearanceMixin } from "@/views/operateManage/operateRecord/components/clearanceMixin.js";
import { tradSubmitted } from "@/views/operateManage/operateRecord/components/customsClearance.js";
import { getTraditionConfirmed } from "@/api/performance/record.js";
export default {
  name: "TradSubmitted",
  mixins: [mixinColsConf, clearanceMixin],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "已提交(传统)",
            name: "1",
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.searchList(formModel);
            resolve();
          });
        },
        searchForm: true,
        searchColsHeight: true,
        labelWidth: "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: tradSubmitted().lists,
                  },
                ],
              },
            ],
          },
        ],
      },
      tableConfig: {
        httpRequest: getTraditionConfirmed,
        getQueryParams: this.getQueryParams,
      },
      mixinTableColArr: [tradSubmitted().tableColumns],
      tabTableObj: {
        1: tradSubmitted().tableColumns,
      },
      searchFromData: {},
    };
  },
  methods: {
    getQueryParams(row) {
      return {
        ...this.searchFromData,
        customsClearanceStatus: 1,
        orderType: 3,
      };
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/ {
    .drawer-title {
      display: flex;
      & > span:first-child {
        margin-right: 30px;
      }
    }
  }
}
</style>
