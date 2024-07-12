<template>
  <div>
    <ComDrawer
      class="add-cabinet-arrangement"
      ref="myDrawer"
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
          <template v-slot:bottomTotal>
            <div class="grand-total">
              <template v-for="(tItem, i) in tableSubtotal">
                <span :key="`t_${i}`">
                  <span>{{ tItem.totalLabel }}：</span>
                  <span>{{ tItem.totalNum }}</span>
                </span>
              </template>
            </div>
          </template>
        </ComTable>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { accumulationFn } from "@/utils/instructions";
import { getTruckDeliveryList } from "@/api/warehouse/manage";
import { searchDrawerFormCols, tableDrawerCols } from "./model";
export default {
  props: {},
  data() {
    return {
      drawerConfig: {
        width: "1288px",
        footer: [
          {
            text: this.overseaLangObj.qr_confirm(),
            type: "primary",
            handleClick: () => {
              this.$emit("handleCheckClick", [...this.checkTableArr]);
              this.hide();
            },
          },
          {
            text: this.overseaLangObj.qx_cancel(),
            plain: true,
            handleClick: () => {
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
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "105px" : "85px",
        lists: searchDrawerFormCols(),
      },
      tableConfig: {
        tableHeight: "calc(100vh - 236px)",
        httpRequest: getTruckDeliveryList,
        columnConfig: tableDrawerCols(),
      },
      isFormShow: false, // 阻止自动聚焦与表格选择缓存
      searchFromData: {},
      truckObj: {},
      checkTableArr: [],
      backIds: [],
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
    show(rows, tObj) {
      this.truckObj = tObj;
      this.checkTableArr = [];
      this.backIds = rows.map((e) => e.id);
      this.$refs.myDrawer.show();
      this.$nextTick(() => {
        this.isFormShow = true;
      });
    },
    hide() {
      (this.isFormShow = false), this.$refs.myDrawer.hide();
    },
    getSearchParams() {
      const { destinationId, destinationType, destinationDetailAddress } =
        this.truckObj;
      return {
        ...this.searchFromData,
        distributionType: 1, // 4-卡车
        tab: 0,
        destinationId, // 目的地ID
        destinationType, // 目的地类型
        destinationDetailAddress,
        idListNotIn: this.backIds, // 排除已选中的
      };
    },
  },
  computed: {
    tableSubtotal() {
      const arr = this.checkTableArr || [];
      return [
        {
          totalLabel: this.overseaLangObj.zxs_total("总箱数"),
          totalNum: accumulationFn(arr.map((e) => e.num)),
        },
        {
          totalLabel: this.overseaLangObj.total_weight("总重量(KG)"),
          totalNum: accumulationFn(
            arr.map((e) => e.totalWeight),
            2
          ),
        },
        {
          totalLabel: this.overseaLangObj.total_volume("总体积(m³)"),
          totalNum: accumulationFn(
            arr.map((e) => e.totalVolume),
            2
          ),
        },
      ];
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
