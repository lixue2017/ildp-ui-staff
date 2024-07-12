<template>
  <div>
    <ComDrawer
      class="add-cabinet-arrangement"
      ref="drawerRef"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComDetailTop
          :title="overseaLangObj.xz_add('添加')"
          class="title-sides-margin-none"
          :config="{}"
        />
        <ComForm :formConfig="searchFormConfig" v-show="isFormShow" />
        <ComTable
          :ref="`tableDrawerRef`"
          v-if="isFormShow"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :httpRequest="tableConfig.httpRequest"
          :getQueryParams="getSearchParams"
          @onSelectionChange="onSelectionChangeEvt"
          :selectionTableRow="[...checkTableArr]"
        >
        </ComTable>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { getOrderCarEcFreightList } from "@/api/order/dispatchVehicles";
import { searchDrawerFormCols, tableDrawerCols } from "./model";
export default {
  props: {},
  data() {
    return {
      drawerConfig: {
        width: "1288px",
        footer: [
          {
            text: this.overseaLangObj.qr_confirm("确定(0)"),
            type: "primary",
            handleClick: () => {
              this.$emit("handleCheckClick", [...this.checkTableArr]);
              this.$refs.drawerRef.hide();
            },
          },
          {
            text: this.overseaLangObj.qx_cancel(),
            plain: true,
            handleClick: () => {
              this.$refs.drawerRef.hide();
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
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "105px" : "95px",
        lists: searchDrawerFormCols(),
      },
      tableConfig: {
        tableHeight: "calc(100vh - 236px)",
        httpRequest: getOrderCarEcFreightList,
        columnConfig: tableDrawerCols(),
      },
      isFormShow: false, // 阻止自动聚焦与表格选择缓存
      searchFromData: {},
      drawerObj: {},
      checkTableArr: [],
      backIds: "",
    };
  },
  methods: {
    getTableList(searchFrom = {}) {
      const { beginTime, ...nSearchFrom } = searchFrom || {};
      const [startDate, endDate] = beginTime || [];
      this.searchFromData = {
        ...nSearchFrom,
        startDate,
        endDate,
      };

      this.$refs[`tableDrawerRef`]?.refreshTable();
    },
    onSelectionChangeEvt(arr = []) {
      this.checkTableArr = arr;
    },
    show(rows, obj) {
      this.isFormShow = false;
      this.drawerObj = obj || {};
      this.checkTableArr = [];
      this.backIds = (rows || [])
        .map((e) => e.orderFreightId || e.id)
        .join(",");
      this.$refs.drawerRef.show();
      this.$nextTick(() => {
        this.isFormShow = true;
      });
    },
    getSearchParams() {
      const { id, orderEcIds } = this.drawerObj;
      return {
        ...this.searchFromData,
        orderEcIds,
        orderReservationCarId: id,
        orderFreightIds: this.backIds, // 排除已选中的
      };
    },
  },
  watch: {
    "checkTableArr.length"(sLen) {
      this.$set(
        this.drawerConfig.footer[0],
        "text",
        this.overseaLangObj.qr_confirm(`确定(${sLen})`)
      );
      this.$set(this.drawerConfig.footer[0], "disabled", !sLen);
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
</style>
