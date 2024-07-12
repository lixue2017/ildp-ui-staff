<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchTabForm(idx)"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableTabConfig(idx)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :isMountedRequest="false"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <div
                    class="primary-text-btn ellipsis-text"
                    @click="handleEditOrSee(slotProps.row)"
                  >
                    {{ slotProps.row.code || "--" }}
                  </div>
                </template>
                <template v-if="['status'].includes(slotProps.prop)">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn || "--" }}
                  </span>
                </template>

                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content-btn">
                    <template
                      v-for="(item, index) in tableConfig.statusBtnList"
                    >
                      <el-button
                        :key="index"
                        :class="`operate-icon ${
                          item.info && 'operate-icon-info'
                        }`"
                        size="small"
                        type="text"
                        :icon="`${item.icon}`"
                        @click="item.handleClick(slotProps.row)"
                        >{{ item.text }}</el-button
                      >
                    </template>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse
          @setCurWarehouse="getWarehouseTableMixin"
        />
      </template>
    </ComTabs>
    <editFormExpressDlg ref="editFormExpressRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { exwarehouseRecordList } from "@/api/warehouse/process";
import editFormExpressDlg from "./editDlg";
import { searchColumns, tableColumns } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name:"ExpressRecord",
  mixins: [curWarehouseMixin,mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "快递信息",
            name: "1",
          },
        ],
      },
      showSearchForm: false,
      searchFromData: {},
      searchFormConfig: {
        labelWidth: "85px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        fold: true,
        searchForm: true,
        size: "small",
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 324px)",
        getQueryParams: this.getQueryParams,
        httpRequest: exwarehouseRecordList,
      },
    };
  },
  methods: {
    handleEditOrSee(row = {}) {
      this.$refs.editFormExpressRef.editShow(row);
    },
    getTableList(searchFrom = {}) {
      const { createTime, statusList, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        statusList: statusList?.length ? statusList.join(",") : undefined,
        beginTime: createTime ? `${createTime[0]}@${createTime[1]}` : undefined,
      };
      this.keepTableListMixin(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        warehouseId: this.curWarehouseObj.value,
        // type: this.tabsConfig.activeName - 1
      };
    },
    handleDetails(row = {}) {},
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(index),
      };
    },
    tableTabConfig(index) {
      return tableColumns(index);
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("inOutWarehouseProcess").then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    editFormExpressDlg,
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
