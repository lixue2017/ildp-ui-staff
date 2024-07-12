<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => tableConfig.getQueryParams()"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'msgContent'">
                  <div
                    class="show-overflow-tooltip"
                    v-html="handleContent(slotProps.row.msgContent)"
                  ></div>
                </template>
                <template v-if="slotProps.prop === 'msgType'">
                  <span
                    :style="{
                      color: slotProps.dicsList && slotProps.dicsList.color,
                    }"
                  >
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'flagRead'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
                  </span>
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
import { searchConfig, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getMsgRecordList } from "@/api/messageService";
import { handleContent } from "@/utils";
export default {
  name: "Record",
  mixins: [mixinColsConf],
  data() {
    return {
      handleContent,
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
            label: "消息记录",
            name: "1",
          },
        ],
        btnArr: [],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        searchForm: true,
        expansion: false,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getMessageRecord(formModel);
            resolve();
          });
        }, // 表单提交接口
        size: "small",
        labelWidth: "87px",
        formRules: {}, // 表单校验规则
        ...searchConfig,
      },
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getMsgRecordList,
        columnConfig: tableColumns,
      },
    };
  },
  methods: {
    getMessageRecord(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
        readTimeStart:
          searchFrom.readTimeStart && searchFrom.readTimeStart.join("@"),
        pushTimeStart:
          searchFrom.pushTimeStart && searchFrom.pushTimeStart.join("@"),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const param = {};
      for (let key in this.searchFromData) {
        this.searchFromData[key] && (param[key] = this.searchFromData[key]);
      }
      return param;
    },
  },
};
</script>