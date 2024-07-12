<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(tab.name)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="privateWarehouseTable.tableHeight"
              :columnConfig="
                tab.name === '1'
                  ? privateWarehouseTable.FBAColumnConfig
                  : privateWarehouseTable.columnConfig
              "
              :httpRequest="
                tab.name === '1'
                  ? privateWarehouseTable.FBAHttpRequest
                  : privateWarehouseTable.httpRequest
              "
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="() => privateWarehouseTable.statusList"
              :colShowBtnFn="operationBtn"
            >
              >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'contacts'">
                  <div @click="handleDetails(slotProps.row)">
                    <span class="primary-text-btn">
                      {{ slotProps.row.contacts }}
                    </span>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'warehouseCode'">
                  <div
                    class="display-flex"
                    @click="handleDetails(slotProps.row)"
                  >
                    <span class="primary-text-btn ellipsis-text">
                      {{ slotProps.row.warehouseCode }}
                    </span>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'dataStatus'">
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
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <AddDialog ref="addDialog" @handleSuccess="mixinkeepTable" />
    <EditDialog ref="editDialog" @handleSuccess="mixinkeepTable" />
    <DetailDialog ref="detailDialog" @handleUpdate="mixinkeepTable" />
  </div>
</template>

<script>
import {
  getWarehouseList,
  updateWarehouseStatus,
  delWarehouse,
} from "@/api/basicInfo/warehouse.js";
import { msgBox } from "@/utils/confirmBox.js";
import { searchColumns, tableColumns } from "./model";
import { DateCompute } from "@/utils/index.js";
import { mapActions, mapState, mapMutations } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "PrivateWarehouse",
  mixins: [mixinColsConf],
  components: {
    AddDialog: () => import("./components/AddDialog"),
    EditDialog: () => import("./components/EditDialog"),
    DetailDialog: () => import("./components/DetailDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    const api = "/system";
    return {
      api,
      FBATab: "1",
      platformTypeList: "0,1,2,3",
      platformType: 4,
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
            label: "FBA仓库信息",
            name: "1",
          },
          {
            label: "私人仓库信息",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "新增仓库地址",
            handleClick: this.handleUpdate,
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getPrivateWarehouseList(formModel);
            resolve();
          });
        }, // 表单提交接口
        fold: true,
        searchForm: true,
        // expansion: false,
        size: "small",
        labelWidth: "85px",
        lists: searchColumns(), // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      privateWarehouseTable: {
        tableHeight: "calc(100vh - 324px)",
        statusList: [
          {
            text: "修改",
            showStatus: [0, 1],
            handleClick: (row) => {
              this.handleUpdate(row);
            },
          },
          {
            text: "启用",
            showStatus: [0, 2],
            handleClick: (row) => {
              this.changeStatus(row, 1);
            },
          },
          {
            text: "禁用",
            info: true,
            color: "#FF6767",
            showStatus: [1],
            handleClick: (rows) => this.changeStatus(rows, 2),
          },
          {
            text: "删除",
            info: true,
            color: "#FF6767",
            showStatus: [0],
            handleClick: (row) => {
              this.handleDelete(row);
            },
          },
        ],
        httpRequest: (query) => getWarehouseList(query),
        FBAHttpRequest: getWarehouseList,
        columnConfig: tableColumns(true),
        FBAColumnConfig: tableColumns(),
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("privateWareTypeEn").then(() => {
      const warehouseType =
        (this.dictionary.dicsData && this.dictionary.dicsData.warehouseType) ||
        [];
      this["dictionary/SET_DICTIONARY"]({
        ...(this.dictionary.dicsData || {}),
        warehouseType: warehouseType.slice(0, warehouseType.length - 1),
      });
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    ...mapMutations(["dictionary/SET_DICTIONARY"]),
    getSearchFormConfig(activeName) {
      const searchFormConfig = { ...this.searchFormConfig };
      if (activeName === "2") {
        searchFormConfig.lists = searchColumns(true);
        return searchFormConfig;
      }
      searchFormConfig.lists = searchColumns();
      return searchFormConfig;
    },
    handleTime(time) {
      const obj = {};
      if (time) {
        this.$set(obj, "beginTime", time[0]);
        this.$set(obj, "endTime", DateCompute(time[1], 1));
      }
      return obj;
    },
    getPrivateWarehouseList(searchFrom = {}) {
      let params = {};
      if (this.FBATab === this.tabsConfig.activeName) {
        const { createTime, warehouseCode, platformType, statusList, address } =
          searchFrom;
        params = {
          ...this.handleTime(createTime),
          warehouseCode,
          platformTypeList: platformType ? platformType : this.platformTypeList,
          statusList: statusList && statusList.join(","),
          "cusWarehouse.address": address,
        };
      } else {
        const { createTime, companyName, contacts, warehouseCode, statusList } =
          searchFrom;
        params = {
          ...this.handleTime(createTime),
          companyName,
          "cusWarehouse.contacts": contacts,
          warehouseCode,
          platformType: this.platformType,
          statusList: statusList && statusList.join(","),
        };
      }
      this.searchFromData[this.tabsConfig.activeName] = {
        ...params,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      const params = { ...this.searchFromData[tab] };
      if (tab == 2) {
        params.platformType = this.platformType;
      } else {
        params.platformTypeList = params.platformTypeList
          ? params.platformTypeList
          : this.platformTypeList;
      }
      return params;
    },
    // 新增（修改）提货地址
    handleUpdate(row = {}) {
      console.log("row", row);
      this.$refs.detailDialog.hide();
      if (!row.id) {
        this.$refs.addDialog.show();
      } else {
        this.$refs.editDialog.show(row);
      }
    },
    handleSuccess() {
      this.$refs.addDialog.hide();
      this.$refs.editDialog.hide();
      this.mixinkeepTable(true);
    },
    handleDetails(row = {}) {
      this.$refs.detailDialog.show(row);
    },
    changeStatus(row = {}, status) {
      let msg = "启用之后可以被引用";
      let title = "启用提示";
      let className = "el-icon-success text-success";
      let successMsg = "启用成功";
      if (status === 2) {
        msg = "禁用之后不可引用，且不影响历史数据";
        title = "禁用提示";
        className = "el-icon-warning text-warning";
        successMsg = "禁用成功";
      }

      msgBox(this, { title, className, msg }, () => {
        updateWarehouseStatus({
          id: row.id,
          dataStatus: status,
        }).then(() => {
          this.$message({
            message: successMsg,
            type: "success",
          });
          row.dataStatus = status;
        });
      });
    },
    handleDelete(rows) {
      if (rows.id) {
        delWarehouse(rows.id).then(() => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        });
      }
    },
    operationBtn(rItem, row) {
      //按钮展示条件
      const { dataStatus } = row;
      const { showStatus } = rItem;
      if (showStatus.includes(dataStatus)) {
        return true;
      } else {
        return false;
      }
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
</style>
