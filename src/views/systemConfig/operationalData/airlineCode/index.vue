<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="consigneeTable.tableHeight"
              :columnConfig="consigneeTable.columnConfig"
              :httpRequest="consigneeTable.httpRequest"
              :getQueryParams="consigneeTable.getQueryParams"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor: slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'lineType'">
                  <span v-if="slotProps.row.lineType">
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                  <span v-else>--</span>
                </template>
                <template v-if="slotProps.prop === 'isPublic'">
                  <span v-if="dataPublicType && slotProps.row.isPublic">
                    {{
                      dataPublicType[slotProps.row.isPublic] &&
                      dataPublicType[slotProps.row.isPublic].label
                    }}
                  </span>
                  <span v-else>--</span>
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
import { DateCompute } from "@/utils/index.js";
import { getRouteCodeList } from "@/api/operationalData";
import { DATA_STATUS, DATA_PUBLICTYPE } from "@/utils/mixin.js";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns, columnData } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "AirlineCode",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      dataStatus: DATA_STATUS,
      dataRouteType: [],
      dataPublicType: DATA_PUBLICTYPE,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "航线代码",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getRouteCodeList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        // expansion: false,
        size: "small",
        labelWidth: "85px",
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
      consigneeTable: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: (query) => getRouteCodeList(query, true),
        columnConfig: tableColumns,
      },
      addVisible: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("airlineCodeTypeEn").then((res) => {
      this.showSearchForm = true;
      this.activeName = `tabs${this.tabsConfig.activeName}`;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getRouteCodeList(searchFrom = {}) {
      this.searchFromData = {
        nameCn: searchFrom.name,
        nameEn: searchFrom.name,
        code: searchFrom.code,
      };
      if (searchFrom.createTime) {
        this.$set(this.searchFromData, "startDate", searchFrom.createTime[0]);
        this.$set(
          this.searchFromData,
          "endDate",
          DateCompute(searchFrom.createTime[1], 1)
        );
      }
      // this.searchFromData = { ...searchFrom };
      // this.searchFromData.createTime &&
      //   (this.searchFromData.createTime =
      //     this.searchFromData.createTime.join("@"));
      // this.searchFromData.dataStatus &&
      //   (this.searchFromData.dataStatus =
      //     this.searchFromData.dataStatus.join(","));
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation-content {
  .btn {
    display: flex;

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
.dialog-form {
  padding-right: 30px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
.historical-records {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .historical-records-title {
    font-size: 16px;
    margin-right: 21px;
    color: #1f1f1f;
  }

  .historical-records-sub {
    color: #666;

    i {
      margin-right: 10px;
    }
  }
}
</style>
