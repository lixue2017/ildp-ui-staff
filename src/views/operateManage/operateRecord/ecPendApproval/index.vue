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
                  @setColumnConf="setColumnMixinConf"
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
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content">
                    <div
                      class="btn"
                      v-if="
                        [0, 1].includes(slotProps.row.customsClearanceStatus)
                      "
                    >
                      <template v-for="(item, index) in statusList">
                        <el-button
                          :class="`operate-icon ${
                            item.info ? 'operate-icon-info' : ''
                          }`"
                          size="small"
                          type="text"
                          @click="item.handleClick(slotProps.row)"
                          :key="index"
                          v-if="
                            item.status.includes(
                              slotProps.row.customsClearanceStatus
                            )
                          "
                        >
                          {{ item.text }}
                        </el-button>
                      </template>
                    </div>
                    <div v-else>
                      <span>--</span>
                    </div>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ConnectDialog ref="ConnectDialog" @handleSuccess="mixinkeepTable" />
    <AddDrawer ref="addDrawer" @handleSuccess="mixinkeepTable">
      <template v-slot:operationDate="slotProps">
        <div class="drawer-title">
          <span>{{ slotProps.activity.createTime }}</span>
          <span>
            {{ slotProps.activity.createBy }}
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
import { ecPendApproval } from "@/views/operateManage/operateRecord/components/customsClearance.js";
import { getEsUnconfirmed } from "@/api/performance/record.js";
export default {
  name: "EcPendApproval",
  mixins: [mixinColsConf, clearanceMixin],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "待审核(电商)",
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
                    cols: ecPendApproval().lists,
                  },
                ],
              },
            ],
          },
        ],
        formRules: {},
      },
      tableConfig: {
        httpRequest: getEsUnconfirmed,
        getQueryParams: this.getQueryParams,
      },
      mixinTableColArr: [ecPendApproval().tableColumns],
      // tabTableObj: {
      //   1: ecPendApproval().tableColumns,
      // },
      searchFromData: {},
      statusList: [
        {
          text: "审核交接",
          status: [0],
          handleClick: (row) => {
            this.handleHandover(row);
          },
        },
        {
          text: "清关交接",
          status: [1],
          handleClick: (row) => {
            this.handleHandover(row);
          },
        },
      ],
    };
  },
  methods: {
    getQueryParams(row) {
      return {
        ...this.searchFromData,
        customsClearanceStatus: 0,
        orderType: 2,
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
