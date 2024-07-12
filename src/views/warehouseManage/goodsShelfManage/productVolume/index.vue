<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchFormConfig"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableConfig.columnConfig[tab.name]"
              :httpRequest="tableConfig.httpRequest[tab.name]"
              :getQueryParams="() => getQueryParams(tab.name)"
              :isMountedRequest="false"
              :extraConfig="{ multiline: true }"
              :rowOperationBtnListFn="(r) => tableBtnList"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse
          ref="currentWhereWarehouseRef"
          @setCurWarehouse="setCurWarehouse"
        />
      </template>
    </ComTabs>

    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import {
  getProductCbmList,
  getVolumeBoxList,
} from "@/api/goodsShelf/productVolume";
import {
  postSkuBatchVerification,
  boxSouVerification,
} from "@/api/warehouse/prediction";
import {
  searchColumns,
  tableColumns,
  FCLTableColumns,
  customDialogCols,
} from "./model";
import { mapActions, mapState } from "vuex";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "ProductVolume",
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        tabsRefresh: true,
        handleTabsClick: this.handleTabsClick,
        tabs: [
          {
            label: this.overseaLangObj.cp_tj_cx || "产品体积查询",
            name: "1",
          },
          {
            label: this.overseaLangObj.zx_tj_cx || "整箱体积查询",
            name: "2",
            isFirst: true,
          },
        ],
      },
      searchFromData: {
        1: {},
        2: {},
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        // fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        searchColsHeight: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "118px" : "75px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
      },
      tableConfig: {
        httpRequest: { 1: getProductCbmList, 2: getVolumeBoxList },
        columnConfig: { 1: tableColumns, 2: FCLTableColumns },
      },
      tableBtnList: [
        {
          text: this.overseaLangObj.wh_cc || "维护尺寸",
          handleClick: (row) => this.handleCustomDialog(row),
        },
      ],
      currWhereWarehouse: {
        1: null,
        2: null,
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("custTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  computed: {
    ...mapState({
      currWhereWarehouseObj: (state) => state.customer.curWarehouseObj,
    }),
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleCustomDialog(row) {
      const tabName = this.tabsConfig.activeName;

      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: customDialogCols(tabName),
        formModel: row || {},
        httpRequest: (obj) => {
          const params = {
            cwmId: this.currWhereWarehouse[this.tabsConfig.activeName].value,
            length: obj.verifyLength,
            width: obj.verifyWidth,
            height: obj.verifyHeight,
            weight: obj.productNetWeight,
          };
          if (tabName == 1) {
            params.cpmId = row.productId;
          } else {
            params.storageId = row.storageId;
          }
          const req = {
            1: postSkuBatchVerification,
            2: boxSouVerification,
          }[tabName];
          return req([params]);
        },
        successFunction: () => this.mixinkeepTable(),
      });
    },
    getList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = { ...searchFrom };
      this.keepTableListMixin(true);
    },
    getQueryParams(tabName) {
      return {
        ...this.searchFromData[tabName],
        warehouseId: (
          this.currWhereWarehouse[tabName] || this.currWhereWarehouseObj
        ).value,
      };
    },
    setCurWarehouse(obj) {
      this.currWhereWarehouse[this.tabsConfig.activeName] = obj;
      this.getWarehouseTableMixin(obj);
    },
    handleTabsClick() {
      this.$nextTick(() => {
        this.initMixinColumnConf();
      });
      // const tabName = this.tabsConfig.activeName;
      // if (!this.currWhereWarehouse[tabName]) {
      //   this.currWhereWarehouse[tabName] = this.currWhereWarehouseObj;
      // }
      // this.$refs.currentWhereWarehouseRef?.emitCurWarehouse(
      //   this.currWhereWarehouse[tabName]
      // );
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
