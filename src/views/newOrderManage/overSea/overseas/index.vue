<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(tab.name)"
              @searchHeight="getSearchHeight"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive>
            <ComTable
              :ref="`tableConfig${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="model[tab.name].tableColumns"
              :httpRequest="model[tab.name].httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'number'">
                  <span
                    class="primary-text-btn"
                    @click="handleUpdate(slotProps.row, 'view')"
                  >
                    {{ slotProps.row.number }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'insurance'">
                  <span
                    class="text-theme-color"
                    v-if="slotProps.row.insurance == '1'"
                  >
                    ✓保险
                  </span>
                  <span v-else>--</span>
                </template>
                <template v-if="slotProps.prop === 'deliveryWarehouse'">
                  {{
                    `${slotProps.row.deliverCode}[${slotProps.dicsList.nameCn}]`
                  }}
                </template>
                <template v-if="slotProps.prop === 'receivingWarehouse'">
                  <span
                    v-if="
                      tabsConfig.activeName === '1' &&
                      slotProps.row.orderType == 1
                    "
                  >
                    --
                  </span>
                  <span v-else>
                    {{
                      slotProps.row.receivingCode
                        ? `${slotProps.row.receivingCode}[${slotProps.dicsList.nameCn}]`
                        : "--"
                    }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'product'">
                  <el-row>
                    <span
                      :class="[
                        'isComplete',
                        slotProps.row.foreignExportParam == 1
                          ? 'text-success-color'
                          : 'text-danger-color',
                      ]"
                    >
                      <i
                        :class="
                          slotProps.row.foreignExportParam == 1
                            ? 'el-icon-circle-check'
                            : 'el-icon-warning-outline'
                        "
                      ></i>
                      {{ slotProps.dicsList.nameCn }}
                    </span>
                  </el-row>
                </template>
                <template v-if="slotProps.prop === 'status'">
                  <div class="operate-status">
                    <span>
                      <i
                        class="status-dot"
                        :style="{
                          backgroundColor: slotProps.dicsList.color,
                        }"
                      ></i>
                      {{ slotProps.dicsList.nameCn }}
                    </span>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content">
                    <div class="btn">
                      <el-button
                        class="operate-icon"
                        size="small"
                        type="text"
                        icon="el-icon-edit-outline"
                        @click="handleUpdate(slotProps.row)"
                      >
                        接收
                      </el-button>
                    </div>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { FullscreenLoading } from "@/utils/loading.js";
import { searchColumns, tableColumns } from "./model";
import {
  searchColumns as FBASearchColumns,
  tableColumns as FBATableColumns,
} from "./FBAModel";
import {
  searchColumns as pfSearchColumns,
  tableColumns as pfTableColumns,
} from "./platformModel";
import { mapActions, mapState } from "vuex";
import { getFbaOrderList } from "@/api/overseas/fbaOrder.js";
import {
  getPlatformOrderList,
  getOverseasList,
} from "@/api/overseas/platformOrder.js";
export default {
  name: "Overseas",
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      fullscreenLoading: new FullscreenLoading(),
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.keepTableList(false)
          })
        },
        tabs: [
          {
            label: "海外订单",
            name: "1",
          },
          {
            label: "平台订单",
            name: "2",
          },
          {
            label: "整箱出库",
            name: "3",
          },
        ],
        btnArr: [
          {
            table: "批量分配",
            handleClick: () => this.handleUpdate(),
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "85px",
        formRules: {}, // 表单校验规则
      },
      model: {
        1: {
          searchColumns,
          tableColumns,
          httpRequest: getOverseasList,
        },
        2: {
          searchColumns: pfSearchColumns,
          tableColumns: pfTableColumns,
          httpRequest: getPlatformOrderList,
        },
        3: {
          searchColumns: FBASearchColumns,
          tableColumns: FBATableColumns,
          httpRequest: getFbaOrderList,
        },
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
      },
      showSearchForm: false
    };
  },
  created() {
    this["dictionary/getDictionary"]("overseasOrderTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  activated() {
    this.keepTableList(false)
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchHeight(height) {
      this.tableConfig.tableHeight = `calc(100vh - ${height + 211}px)`;
    },
    handleCommand(cb, row) {
      cb && cb(row);
    },
    keepTableList(isRefreshPage = true) {
      const { activeName } = this.tabsConfig
      this.$refs[`tableConfig${activeName}`] && this.$refs[`tableConfig${activeName}`][0]?.refreshKeepTable(isRefreshPage, activeName);
    },
    getSearchFormConfig(tab) {
      return {
        ...this.searchFormConfig,
        ...this.model[tab].searchColumns,
      };
    },
    getList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchFrom,
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        state: searchFrom.state && searchFrom.state.join(","),
        deliveryWarehouseid: searchFrom.deliveryWarehouseid || 0,
        deliveryChannelid: searchFrom.deliveryChannelid || 0,
        receivingWarehouseid: searchFrom.receivingWarehouseid || 0,
        contactsid: searchFrom.contactsid || 0,
        userId: searchFrom.userId || 0,
      };
      this.$refs[`tableConfig${+this.tabsConfig.activeName}`][0].refreshTable(
        true
      );
    },
    getQueryParams(tab) {
      return this.searchFromData[tab];
    },
    handleUpdate(row, type) {
      // 0-fba  1-平台
      // console.log(row, type);
      const { activeName } = this.tabsConfig
      if (type === "view") {
        const idList = this.$refs[
          `tableConfig${activeName}`
        ][0].tableData.map(e => {
          `${e.id}_${[e.orderType, 1, 0][activeName - 1]}`
        });
        this.$router.push({
          path: "/newOrderManage/overSea/overseasDetails",
          query: {
            id: `${row.id}_${[row.orderType, 1, 0][activeName - 1]}`,
            backPath: this.$route.fullPath,
            pageSign: idList.join(','), // 详情显示上一页/下一页
          }
        })
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.white-space-nowrap {
  white-space: nowrap;
}
.operation-header {
  // padding: 0 20px;
  span {
    &:nth-child(1) {
      width: 40%;
    }
    &:nth-child(2) {
      width: 60%;
    }
    display: inline-block;
    text-align: center;
  }
}
.operation-content {
  // padding: 0 20px;
  .operate-status {
    span {
      &:nth-child(1) {
        width: 40%;
      }
      &:nth-child(2) {
        width: 60%;
      }
      display: inline-block;
      text-align: center;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 7px;
    .btn-list {
      display: flex;
    }
    .operate-icon {
      display: flex;
      align-items: center;
      margin-right: 14px;

      &.operate-icon-info {
        color: #606060;
      }
      /deep/ span {
        font-size: 12px;
      }
    }
  }
}
</style>
