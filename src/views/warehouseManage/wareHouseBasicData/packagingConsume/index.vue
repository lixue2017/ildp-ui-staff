<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchTabForm(idx)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
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
              :rowOperationBtnListFn="getStatusBtnList"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="['status'].includes(slotProps.prop)">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <!-- <template v-if="slotProps.prop === 'operation'">
                  <template v-if="slotProps.row.status === 1">--</template>
                  <div v-else class="operation-content-btn">
                    <template
                      v-for="(item, index) in tableConfig.statusBtnList"
                    >
                      <el-button
                        :key="index"
                        :class="`operate-icon ${
                          item.info && 'operate-icon-info'
                        }`"
                        size="mini"
                        type="text"
                        :icon="`${item.icon}`"
                        @click="item.handleClick(slotProps.row)"
                        >{{ item.text }}</el-button
                      >
                    </template>
                  </div>
                </template> -->
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="getWarehouseTableMixin" />
      </template>
    </ComTabs>
    <editConsumeDlg ref="editFormRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getPackagingConsumeList,
  delPackagingConsume,
  packagingConsumePut,
} from "@/api/warehouse/basic";
import { msgBox } from "@/utils/confirmBox.js";
import { searchColumns, tableColumns } from "./model";
import editConsumeDlg from "./editDlg.vue";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "PackagingConsume",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "包材消耗",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "包材补货",
            handleClick: () => this.handleAddOrEdit({ type: 1 }),
          },
        ],
      },
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
        searchForm: true,
        size: "small",
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 324px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getPackagingConsumeList,
        statusBtnList: [
          {
            text: "修改",
            handleClick: this.handleAddOrEdit,
          },
          {
            text: "生效",
            handleClick: this.handleTakeEffect,
          },
          {
            text: "删除",
            color: "#FF6767",
            handleClick: this.handleDelete,
          },
        ],
      },
    };
  },
  methods: {
    handleAddOrEdit(row = {}) {
      const { activeName } = this.tabsConfig;
      this.$refs.editFormRef.editShow(row, {
        editSuccess: () => {
          // 编辑成功
          this.keepTableListMixin();
        },
      });
    },
    handleTakeEffect(row = {}) {
      packagingConsumePut({
        id: row.id,
        status: 1,
      }).then(() => {
        this.msgSuccess("更新成功");
        this.keepTableListMixin();
      });
    },
    handleDelete(row) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        delPackagingConsume(row.id).then(() => {
          this.msgSuccess("删除成功");
          this.keepTableListMixin();
        });
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
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
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns,
      };
    },
    tableTabConfig(index) {
      return tableColumns(index);
    },
    getStatusBtnList(row) {
      const { status } = row;
      if (status == 1) {
        return [];
      } else {
        return this.tableConfig.statusBtnList;
      }
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("basicsWarehouse").then((res) => {
      this.showSearchForm = true;
    });
  },
  components: {
    editConsumeDlg,
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
