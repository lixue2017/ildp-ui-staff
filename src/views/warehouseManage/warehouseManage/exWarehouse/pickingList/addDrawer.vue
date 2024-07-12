<template>
  <div>
    <ComDrawer
      class="add-cabinet-arrangement"
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComDetailTop :title="overseaLangObj.xz_add('添加')" :config="{}" />
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
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'operationNo'">
              <el-row class="ellipsis-text"
                >{{ slotProps.row.torderNo || "--" }}
              </el-row>
              <!-- <el-row class="ellipsis-text">
                {{ slotProps.row.channel || "--" }}
              </el-row> -->
            </template>
          </template>
        </ComTable>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { getPickingOrderList } from "@/api/warehouse/manage";
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
            text: this.overseaLangObj.qx_cancel(),
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
          {
            text: this.overseaLangObj.qr_confirm(),
            type: "primary",
            handleClick: () => {
              // console.log('checkTableArr===', this.checkTableArr)
              if (this.checkTableArr?.length) {
                this.$emit(
                  "handleCheckClick",
                  [...this.checkTableArr],
                  this.paramsSearch
                );
              }
              this.hide();
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this._getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "85px",
        lists: searchDrawerFormCols(),
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 234px)",
        httpRequest: getPickingOrderList,
        columnConfig: tableDrawerCols(),
      },
      isFormShow: false, // 阻止自动聚焦与表格选择缓存
      searchFromData: {},
      checkTableArr: [],
      backIds: "",
      paramsSearch: {},
    };
  },
  methods: {
    _getTableList(searchFrom = {}) {
      this.searchFromData = { ...searchFrom };
      this.$refs[`tableDrawerRef`]?.refreshTable();
    },
    onSelectionChangeEvt(arr = []) {
      this.checkTableArr = arr;
    },
    showDrawer(rows, obj) {
      this.checkTableArr = rows;
      this.paramsSearch = obj;
      this.backIds = rows.map((e) => e.id).join(",");
      this.$refs.myDrawer.show();
      this.$nextTick(() => {
        this.isFormShow = true;
      });
    },
    hide() {
      (this.isFormShow = false), this.$refs.myDrawer.hide();
    },
    getSearchParams() {
      const { id } = this.$route.query;
      return {
        ...this.searchFromData,
        ...this.paramsSearch,
        mark: 0, // 过滤已拣货
        orderIds: this.backIds, // 排除已选中的
        id,
      };
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
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
      margin: 0 0 20px;
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
