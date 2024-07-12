<template>
  <div>
    <ComForm :formConfig="searchFormConfig" v-if="showSearchForm"> </ComForm>
    <ComTable
      :ref="`tableRef${tabsConfig.activeName}`"
      :tableHeight="containerTable.tableHeight"
      :columnConfig="containerTable.columnConfig"
      :httpRequest="containerTable.httpRequest"
      :getQueryParams="containerTable.getQueryParams"
      @onSelectionChange="onSelectionChange"
      :selectionRow="selectionRowEvt"
      :selectionTableRow="[...selectionRows]"
      selectionKey="orderId"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'registerNo'">
          <div class="display-flex" @click="handleDetails(slotProps.row)">
            <span class="primary-text-btn ellipsis-text">
              {{ slotProps.row.registerNo || "--" }}
            </span>
          </div>
        </template>
        <template v-if="slotProps.prop === 'customsDeclarationType'">
          <span :class="['ellipsis-text']">
            {{ slotProps.dicsList.nameCn || "--" }}
          </span>
        </template>

        <template
          v-if="['meansNum', 'declareNum', 'dataMsg'].includes(slotProps.prop)"
        >
          <div
            :class="[
              'operation-content',
              `${
                slotProps.row[slotProps.prop]
                  ? 'wanzheng-tip-color'
                  : 'queshi-tip-color'
              }`,
            ]"
          >
            <i
              :class="[
                'iconfont',
                `${slotProps.row[slotProps.prop] ? 'wanzheng2' : 'queshi2'}`,
              ]"
            />
            <span>{{ slotProps.dicsList.nameCn }}</span>
          </div>
        </template>
        <template v-if="slotProps.prop === 'status'">
          <div class="operate-status">
            <span>
              <i
                class="status-dot"
                :style="{
                  backgroundColor: slotProps.dicsList.color,
                }"
              ></i>
              {{ slotProps.dicsList.nameCn }}
            </span>
          </div>
        </template>
      </template>
    </ComTable>

    <div class="grand-total" v-if="activeTab === '1'">
      <span class="title">合计： </span>
      <div
        v-for="(item, index) in totalMoneyData"
        :key="`m_${index}`"
        class="total-money"
      >
        <span class="grey-text-color">{{ item.label }}</span>
        <span>{{ toFixedNum(item.moneyVal, item.decimal) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getWaitSort } from "@/api/container/arrange.js";
import { duplicateRemoval } from "@/utils/index";
import { accumulationFn } from "@/utils/instructions";
import { mapActions } from "vuex";
import { subtotalList } from "../loadContainer/model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  mixins: [mixinColsConf],
  props: {
    containerTableCols: {
      type: Array,
      default: () => [],
    },
    searchColumns: {
      type: Array,
      default: () => [],
    },
    activeTab: {
      type: String,
      default: () => undefined,
    },
  },
  data() {
    return {
      tabsConfig: {
        activeName: this.activeTab,
      },
      containerTable: {
        tableHeight: `calc(100vh - ${this.activeTab === "1" ? 368 : 324}px)`,
        getQueryParams: this.getQueryParams,
        httpRequest: getWaitSort,
        columnConfig: this.containerTableCols,
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        columnMultiples: 2,
        residueCols: [1],
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.searchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        size: "small",
        labelWidth: "100px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: this.searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      searchFromData: {},
      selectionRows: [],
      isArrMixinTable: false,
    };
  },
  deactivated() {
    this.$emit("onSelectionChange", []);
  },
  created() {
    this["dictionary/getDictionary"]("cabinetArrangement").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchList(searchFrom = {}) {
      const { estimateTime, actualTime, ysIds, ...searchObj } = searchFrom;
      if (estimateTime) {
        searchObj.startDate = estimateTime[0];
        searchObj.endDate = estimateTime[1];
      }
      if (actualTime) {
        searchObj.startTime = actualTime[0];
        searchObj.endTime = actualTime[1];
      }
      this.searchFromData = {
        ...searchObj,
        serviceChannelIds: ysIds && ysIds.length ? ysIds.join(",") : undefined,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
        dataType: Number(this.activeTab) - 1,
      };
    },
    handleDetails(row = {}) {
      // 堡森装柜 - 装柜信息
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`].tableData.map(
        (e) => e.sortBoxId
      );
      this.$router.push({
        path: "/projectContainer/cabinetInfo",
        query: {
          id: row.sortBoxId,
          backPath: this.$route.path,
          pageSign: duplicateRemoval(idList).join(","),
        },
      });
    },
    selectionRowEvt(row) {
      const rowNo = (row.torderNo || "").toLocaleUpperCase(); // 转大写，带UK的单号与其他单号区分
      const rSome = this.selectionRows.some((e) => {
        const eleNo = (e.torderNo || "").toLocaleUpperCase();
        return (
          e.bookingSpaceProxy === row.bookingSpaceProxy &&
          e.warehouseId === row.warehouseId &&
          (eleNo.includes("UK") ? rowNo.includes("UK") : !rowNo.includes("UK"))
        );
      });
      if (this.selectionRows?.length && !rSome) {
        return false; // 禁止选择
      }
      return true; // 可选
    },
    onSelectionChange(rows = []) {
      // this.selectionRows = rows;
      const row = rows[0] || {};
      const rowNo = (row.torderNo || "").toLocaleUpperCase(); // 转大写，带UK的单号与其他单号区分
      this.selectionRows = (rows || []).filter((e) => {
        const eleNo = (e.torderNo || "").toLocaleUpperCase();
        return (
          e.bookingSpaceProxy === row.bookingSpaceProxy &&
          e.warehouseId === row.warehouseId &&
          (rowNo.includes("UK") ? eleNo.includes("UK") : !eleNo.includes("UK"))
        );
      });
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ]._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
      this.$emit("onSelectionChange", this.selectionRows);
    },
    accumulation(arr = [], key) {
      if (key === "total_rows") {
        return arr.length;
      }
      return accumulationFn(arr.map((e) => e[key]));
    },
  },
  computed: {
    totalMoneyData() {
      return subtotalList.map((ele) => {
        return {
          ...ele,
          moneyVal: this.accumulation(this.selectionRows, ele.key),
        };
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation-content {
  .iconfont {
    font-size: 13px;
    margin-right: 2px;
  }
}
.grand-total {
  margin-bottom: 15px;
  .total-money {
    margin-left: 20px;
  }
}
</style>
