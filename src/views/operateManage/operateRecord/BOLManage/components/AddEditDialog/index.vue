<template>
  <!-- 列表新增按钮 -->
  <el-dialog
    :visible.sync="Visible"
    :before-close="handleClose"
    class="dialog-container"
    width="1024px"
  >
    <ComTabs :tabsConfig="tabsConfig" v-if="Visible">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComTable
            :ref="`tableConfig${tab.name}`"
            :columnConfig="tableConfig.tableColumns[tab.name]"
            :httpRequest="tableConfig.httpRequest"
            :currentRow="true"
            :getQueryParams="() => getQueryParams(tab.name)"
            :extraConfig="tableConfig.extraConfig"
            :paginationConfig="paginationConfig"
            @onCurrentChange="selectRow"
            @row-click="handleRowClick"
            :loadMore="true"
            :pagination="false"
            tableHeight="420px"
            v-if="paginationConfig"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'rowChoice'">
                <el-radio
                  v-model="rowChoice.operationOrderId"
                  :label="slotProps.row.operationOrderId"
                  class="el-table-radio"
                />
              </template>
            </template>
          </ComTable>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <el-input
          size="small"
          placeholder="搜索操作单"
          suffix-icon="el-icon-search"
          clearable
          v-model="search"
          @change="handleSearch"
          @clear="handleSearch"
        >
        </el-input>
      </template>
    </ComTabs>
    <template slot="footer" class="dialog-footer">
      <div class="foot-container">
        <div alt="加载更多">
          <span class="el-dropdown-link" @click="loadMore"> 查看更多 </span>
        </div>
        <div alt="右侧操作按钮">
          <el-button
            size="small"
            v-for="(item, index) in tabsConfig.footBtn"
            :key="index"
            :type="item.type"
            @click="item.handleClick"
            >{{ item.label }}</el-button
          >
        </div>
      </div>
    </template>
  </el-dialog>
</template>


<script>
import { tableColumns, modelData } from "./model";
import { getHblOrMblList } from "@/api/operateRecord/BOLManage.js";
export default {
  props: {
    nationId: {
      type: Number,
      default: null,
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComTabs: () => import("_comp/ComTabs"),
  },
  data() {
    return {
      search: "",
      Visible: false,
      tabsConfig: {
        activeName: "0",
        slotTabs: true,
        handleTabsClick: this.handleTabsClick,
        tabs: [
          {
            label: "待出HBL",
            name: "0",
          },
        ],
        footBtn: [
          {
            label: "取 消",
            handleClick: (rows) => {
              this.reSet();
              this.hide();
            },
          },
          {
            label: "确 认",
            type: "primary",
            handleClick: (rows) => {
              this.reSet();
              this.addSubmit();
            },
          },
        ],
      },
      tableConfig: {
        tableColumns,
        httpRequest: getHblOrMblList,
        columnData: modelData,
        extraConfig: {
          showHeader: true,
          loadMore: true,
          stripe: false,
        },
      },
      rowChoice: {
        operationOrderId: "",
      },
      currentRow: null,
      getTableData: {
        warehouseCode: "",
        pageNum: 1,
        pageSize: 10,
      },
      paginationConfig: {
        limit: 15,
        layout: "total, prev, pager, next, jumper",
      },
      hblOrMbl: "0",
    };
  },
  watch: {
    "tabsConfig.activeName": {
      deep: true,
      handler: function (newVal, oldVal) {
        this.hblOrMbl = newVal;
        if (newVal !== oldVal) {
          this.paginationConfig.limit = 15;
          this.$refs[
            `tableConfig${+this.tabsConfig.activeName}`
          ][0].refreshTable(true);
        }
      },
    },
  },
  mounted() {},
  methods: {
    getQueryParams(index) {
      //提单新增查询接口的传参
      let params = {
        operationOrderNum: this.search,
      };
      // const params = {
      //   statusList: "1",
      //   warehouseCode: this.search,
      //   "cusWarehouse.nationId": this.nationId,
      // };
      params.type = index;
      // if (index !== "1") {
      //   params.bolType = "1";
      // } else {
      //   params.bolType = "0";
      // }
      return params;
    },
    handleRowClick(row, column, event) {
      this.$emit("selectChange", row);
      this.hide();
    },
    show() {
      this.Visible = true;
      this.selectRow();//每次打开新窗口重置
    },
    hide() {
      this.Visible = false;
    },
    handleTabsClick() {
      this.search = "";
    },
    handleClose() {
      this.$confirm("取消操作之后当前页面将不会保存!", "取消提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.hide();
          this.reSet();
        })
        .catch(() => {});
    },
    handleSearch() {
      console.log(this.search);
      this.$refs[`tableConfig${+this.tabsConfig.activeName}`][0].refreshTable(
        true
      );
    },
    reSet() {
      this.getTableData = {
        warehouseCode: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.search = "";
    },
    selectRow(val) {
      this.rowChoice.operationOrderId = val ? val.operationOrderId : "";
      this.currentRow = val;
    },
    handleClickDrop() {},
    loadMore() {
      this.paginationConfig.limit += 5;
      this.$refs[`tableConfig${+this.tabsConfig.activeName}`][0].refreshTable(
        true
      );
    },
    addSubmit() {
      this.hide();
      setTimeout(() => {
        this.$emit("getTableSelect", this.currentRow, this.hblOrMbl);
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-container {
  /deep/.el-tabs__content {
    margin-top: 15px;
  }
  .foot-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  /deep/.el-dialog__footer {
    padding: 20px;
  }
}
/deep/.el-tabs__item {
  padding-bottom: 15px;
}
/deep/ .el-dialog__header {
  padding: 0px;
  .el-dialog__headerbtn {
    z-index: 100;
  }
}

/deep/ .el-dialog__body {
  padding: 0;
  .com-tabs {
    .el-tabs__header {
      margin-bottom: 0;
    }
    .tabs-right-btn {
      top: 12px;
      right: 60px;
    }
    .el-tabs__nav-scroll {
      background: #f4f4f4;
      padding: 12px 27px 0;
    }
    .el-table--medium .el-table__cell {
      padding: 9px 0;
    }
  }
}
/deep/.el-table-radio {
  .el-radio__label {
    display: none;
  }
}
</style>
