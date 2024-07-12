<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :isMountedRequest="false"
              @handleTableView="(r) => handleView(r)"
            >
              <template v-slot:customRow="{ slotProps }">
                <!-- <template v-if="slotProps.prop === 'number'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.number }}
                  </span>
                </template> -->
                <!-- 0-草稿 1-待拣货 2-拣货中  3-已拣货 4-待出库 5-运输中 6已完结-->
                <template v-if="slotProps.prop === 'operation'">
                  <div
                    class="operate-btn-list"
                    v-if="/1/.test(slotProps.row.status)"
                  >
                    <div
                      class="btn"
                      v-for="(item, index) in tableConfig.statusList"
                      :key="index"
                    >
                      <el-button
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="mini"
                        type="text"
                        @click="item.handleClick(slotProps.row)"
                      >
                        {{ item.text }}
                      </el-button>
                    </div>
                  </div>
                  <div v-else>--</div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight v-if="!isPerformance">
        <CurrentWhereWarehouse @setCurWarehouse="getWarehouseTableMixin" />
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDialog" v-if="!isPerformance" />
  </div>
</template>

<script>
import {
  getFbaList,
  getFbaPerformanceList,
  editTrackNoFba,
} from "@/api/warehouse/prediction";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns } from "../model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  props: {
    pageType: {
      type: String,
      default: () => "",
    },
    isPerformance: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
  mixins: [curWarehouseMixin, mixinColsConf],
  // computed: {
  //   ...mapState(["dictionary"]),
  // },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.zx_ck || "整箱出库",
            name: "1",
          },
        ],
        btnArr: [],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getFbaList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        residueCols: this.pageType !== "fbaPathWarehouse" ? [2] : null,
        fold: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns(this.pageType),
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        getQueryParams: this.getQueryParams,
        httpRequest: this.isPerformance ? getFbaPerformanceList : getFbaList,
        columnConfig: tableColumns(this.pageType),
        statusList: [
          {
            text: "修改跟踪号",
            handleClick: this.handleUpdate,
          },
        ],
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("custTypeEn").then(() => {
      this.showSearchForm = true;
      this.isPerformance && this.keepTableListMixin(true);
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getFbaList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        deliveryWarehouseid: searchFrom.deliveryWarehouseid || 0,
        deliveryChannelid: searchFrom.deliveryChannelid || 0,
        receivingWarehouseid: searchFrom.receivingWarehouseid || 0,
      };
      this.keepTableListMixin(true);
    },
    getQueryParams() {
      const other = {};
      const { state } = this.searchFromData;
      if (this.isPerformance) {
        other.statusList = state ? state : [1, 2, 3, 4, 5, 6];
      } else {
        other.warehouseId = this.curWarehouseObj.value;
      }
      other.state = state ? state.join(",") : "1,2,3,4,5,6";
      return {
        ...this.searchFromData,
        ...other,
      };
    },
    handleView(row) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e.id);
      const query = {
        id: row.id,
        backPath: this.$route.path,
        pageSign: idList.join(","), // 详情显示上一页/下一页
      };
      this.isPerformance && (query.isPerformance = true);
      const pathObj = {
        fbaPathOrder: "fbaOrderDetails", // 订单
        fbaPathOperation: "fbaOperationDetails", // 操作单
        fbaPathWarehouse: "fbaWarehouseDetails", // 仓库
      };
      this.$router.push({
        path: `/warehouseManage/outStorage/${pathObj[this.pageType]}`,
        query,
      });
    },
    handleUpdate(row) {
      const { id, referenceNumber } = row;
      this.$refs.confirmDialog.handleFormDialog("changeTrackNo", {
        formModel: {
          traceNumber: referenceNumber,
        },
        httpRequest: (formData) => {
          const { traceNumber } = formData;
          const params = {
            id,
            referenceNumber: traceNumber,
          };
          return editTrackNoFba(params);
        },
        successFunction: () => {
          this.msgSuccess(this.overseaLangObj.cz_cg || "修改成功");
          this.keepTableListMixin(true);
        },
      });
    },
    handleSuccess() {
      this.keepTableListMixin(true);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
