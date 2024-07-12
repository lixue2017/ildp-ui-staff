<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm :formConfig="searchTabForm(idx)"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive>
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableTabConfig(idx)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :columnData="[{}, {}]"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <div class="primary-text-btn ellipsis-text" @click="handleEditOrSee(slotProps.row, 1)">
                    {{ slotProps.row.code || "--" }}
                  </div>
                </template>
                <template v-if="['tbzt', 'jhzt'].includes(slotProps.prop)">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn || '--' }}
                  </span>
                </template>

                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content-btn">
                    <template v-for="(item, index) in tableConfig.statusBtnList">
                      <el-button
                        :key="index"
                        :class="`operate-icon ${item.info && 'operate-icon-info'}`"
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
    </ComTabs>
    <editFormTransferDlg ref="editFormTransferRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getPackingList } from "@/api/warehouse/basic"
import editFormTransferDlg from "./editDlg"
import { searchColumns, tableColumns } from "./model"
export default {
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "移库管理",
            name: "1",
          }
        ]
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
        formRules: {}
      },
      tableConfig: {
        tableHeight: "calc(100vh - 324px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getPackingList,
        statusBtnList: [{
          text: "移库",
          handleClick: this.handleEditOrSee,
        }]
      }
    }
  },
  methods: {
    handleEditOrSee(row = {}, mode_type = 0) {
      this.$refs.editFormTransferRef.editShow(row, {
        mode_type,
        editSuccess: () => {
          this.$refs[`tableRef${+this.tabsConfig.activeName}`][0].refreshTable(false);
        }
      })
    },
    getTableList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom
      const { activeName } = this.tabsConfig
      this.searchFromData[activeName] = {
        ...searchObj,
        createTime: createTime ? `${createTime[0]}@${createTime[1]}` : undefined
      };
      this.$refs[`tableRef${+activeName}`][0].refreshTable();
    },
    getQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        // type: this.tabsConfig.activeName - 1
      };
    },
    handleDetails(row = {}) {
      
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(index),
      }
    },
    tableTabConfig(index) {
      return tableColumns(index)
    },
    ...mapActions(["dictionary/getDictionary"])
  },
  created() {
    this["dictionary/getDictionary"]("basicsWarehouse").then(res => {
      this.showSearchForm = true
    });
  },
  components: {
    editFormTransferDlg,
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>