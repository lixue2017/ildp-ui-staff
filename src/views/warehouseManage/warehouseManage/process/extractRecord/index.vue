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
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'number'">
                  <div
                    class="primary-text-btn ellipsis-text"
                    @click="handleEditOrSee(slotProps.row)"
                  >
                    {{ slotProps.row.number || "--" }}
                  </div>
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
    </ComTabs>
    <!-- <editFormExpressDlg ref="editFormExpressRef" /> -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getExwarehouseList } from "@/api/warehouse/manage";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "ExtractRecord",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.zt_info || "自提信息",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "85px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        // fold: true,
        searchForm: true,
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getExwarehouseList,
      },
    };
  },
  methods: {
    handleEditOrSee(row = {}) {
      // this.$refs.editFormExpressRef.editShow(row);
      const { markStatus } = row;
      const pathObj = {
        1: `/warehouseManage/outStorage/wholeSaleDetails`, // 一件代发详情
        0: `/warehouseManage/outStorage/fbaWarehouseDetails`, // FBA订单详情
        2: `/warehouseManage/inStorage/buttOrderDetails`, // 中转出库/大货中转 -> 电商头程详情
      };
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData
        .map((e) => {
          if (e.markStatus == markStatus) {
            return e.id;
          }
        })
        .filter((result) => typeof result !== "undefined");
      console.log("idList", idList);
      this.$router.push({
        path: pathObj[markStatus],
        query: {
          id: row.id,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          backPath: this.$route.path,
        },
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, statusList, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        statusList: statusList?.length ? statusList.join(",") : undefined,
        beginTime: createTime ? `${createTime[0]}@${createTime[1]}` : undefined,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        statusList: 6,
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
    // editFormExpressDlg: () => import("./editDlg"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
