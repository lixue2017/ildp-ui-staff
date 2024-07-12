<template>
  <ComDrawer
    class="add-drawer"
    ref="myDrawer"
    :customDrawer="drawerConfig"
    :confirmClose="false"
  >
    <template v-slot:content>
      <ComDetailTop title="关联客户" :config="{}" />
      <div class="top">
        <div class="title">待选客户</div>
        <div>
          <!-- <AutoComplete
            ref="customRef"
            :formModel="searchFromData"
            :fieldItem="{
              id: 'customId',
              placeholder: '搜索客户',
              ...httpLogisticsCompanySelect(),
              handle: handleSearch,
            }"
          /> -->
          <el-input
            v-model="searchFromData.name"
            size="mini"
            placeholder="搜索客户"
            maxlength="50"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
      </div>
      <ComTable
        ref="tableRef"
        :tableHeight="tableConfig.tableHeight"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="getQueryParams"
        @onSelectionChange="onSelectionChange"
        :paginationConfig="paginationConfig"
        rowKey="customerId"
        selectionKey="customerId"
      />
    </template>
  </ComDrawer>
</template>

<script>
import { tableColumns } from "./model";
import { httpLogisticsCompanySelect } from "@/comModel/httpSelect.js";
import { getCostBindCustomer } from "@/api/oneConsignmentPlan/common";
export default {
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  data() {
    return {
      httpLogisticsCompanySelect,
      drawerConfig: {
        title: "slot",
        width: "685px",
        size: "small",
        showClose: false,
        wrapperClosable: true,
        footer: [
          {
            num: null,
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.submitSelect();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      searchFromData: {
        name: "",
        excludeCustomerId: "",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 165px)",
        httpRequest: getCostBindCustomer,
        columnConfig: tableColumns,
      },
      paginationConfig: {
        limit: 20,
        layout: "total, prev, pager, next",
        className: "",
        small: false,
        total: 20,
      },
      selectAll: [], //选择的数据
    };
  },
  methods: {
    show(obj) {
      this.searchFromData = {
        ...this.searchFromData,
        ...obj,
      };
      this.$refs.myDrawer.show();
      this.$nextTick(() => {
        this.handleSearch();
      });
    },
    hide() {
      this.$refs.myDrawer.hide();
    },
    handleSearch() {
      this.$refs.tableRef.refreshKeepTable();
    },
    getQueryParams() {
      return this.searchFromData;
    },
    onSelectionChange(rows) {
      this.selectAll = rows;
      this.drawerConfig.footer[0].num = this.selectAll.length;
    },
    submitSelect() {
      this.$refs.tableRef.clearCheckRowList();
      this.$emit("handleSelect", this.selectAll);
      this.hide();
      this.onSelectionChange([]);
    },
  },
};
</script>
<style lang="scss" scoped>
.add-drawer {
  /deep/ {
    .el-drawer__header {
      display: none;
    }
    .drawer-content {
      padding: 0 20px 10px;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
    .el-table::before {
      background-color: transparent;
    }
  }
  .com-detail-top {
    padding: 13px 0 0;
    margin-bottom: 5px;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      padding: 15px 0;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
