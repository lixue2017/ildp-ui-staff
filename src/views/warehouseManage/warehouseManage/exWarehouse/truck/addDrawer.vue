<template>
  <div>
    <ComDrawer
      class="add-cabinet-arrangement"
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComDetailTop title="添加" :config="{}" />
        <ComForm :formConfig="searchFormConfig" v-show="isFormShow" />
        <ComTable
          :ref="`tableDrawerRef`"
          v-if="isFormShow"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :httpRequest="tableConfig.httpRequest"
          :getQueryParams="getSearchParams"
          @onSelectionChange="onSelectionChangeEvt"
          :selectionTableRow="checkTableArr"
          rowKey="freightId"
          selectionKey="freightId"
        >
        </ComTable>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { getTruckFreightList } from "@/api/warehouse/manage";
import { mapState } from "vuex";
import { searchDrawerFormCols, tableDrawerCols } from "./model";
export default {
  props: {},
  data() {
    return {
      drawerConfig: {
        title: "",
        width: "1288px",
        size: "small",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$emit("handleCheckClick", [...this.checkTableArr]);
              this.hide();
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "85px",
        lists: searchDrawerFormCols(),
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 234px)",
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            getTruckFreightList(formModel).then((res) => {
              if (this.backArr) {
                res.rows = res.rows.filter(
                  (item) => !this.backArr.includes(item.freightId)
                );
              }
              resolve(res);
            });
          });
        },
        columnConfig: tableDrawerCols(),
      },
      isFormShow: false, // 阻止自动聚焦与表格选择缓存
      searchFromData: {},
      checkTableArr: [],
      backIds: "",
    };
  },
  methods: {
    getTableList(searchFrom = {}) {
      this.searchFromData = { ...searchFrom };
      this.$refs[`tableDrawerRef`]?.refreshTable();
    },
    onSelectionChangeEvt(arr = []) {
      this.checkTableArr = arr;
    },
    show(rows, detailsAddr) {
      this.checkTableArr = rows;
      this.detailsAddr = detailsAddr;
      this.backArr = rows.map((e) => e.freightId);
      this.backIds = this.backArr.join(",");
      this.$refs.myDrawer.show();
      this.$nextTick(() => {
        this.isFormShow = true;
      });
    },
    hide() {
      (this.isFormShow = false), this.$refs.myDrawer.hide();
    },
    getSearchParams() {
      // const { detailsAddr } = this.$route.query;
      return {
        ...this.searchFromData,
        statusList: 4, // 4-待出库
        detailsAddr: this.detailsAddr,
        backIds: this.backIds, // 排除已选中的
      };
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.add-cabinet-arrangement {
  .operation-content {
    .iconfont {
      font-size: 13px;
      margin-right: 2px;
    }
  }
  /deep/ .el-drawer {
    .com-detail-top {
      margin-bottom: 20px;
      padding: 20px 0 0 0;
    }
    .el-table--medium td {
      padding: 7px 0;
    }
    .el-drawer__header {
      display: none;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
  }
}
.estimate-header {
  display: flex;
  span {
    flex: 1;
    padding: 0 3px;
  }
}
.estimate-row {
  span {
    flex: 1;
    padding: 0 3px;
  }
}
</style>