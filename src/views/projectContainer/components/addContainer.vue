<template>
  <div>
    <ComDrawer
      class="add-cabinet-arrangement"
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComDetailTop title="添加排柜" :config="{}" />
        <ComForm :formConfig="searchFormConfig" v-show="isFormShow" />
        <ComTable
          :ref="`tableRef`"
          v-if="isFormShow"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :httpRequest="tableConfig.httpRequest"
          :getQueryParams="tableConfig.getQueryParams"
          :selectionRow="selectionRowEvt"
          @onSelectionChange="onSelectionChangeEvt"
          selectionKey="orderId"
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
            <template v-if="slotProps.prop === 'customer'">
              <el-row class="ellipsis-text"
                >{{ slotProps.row.userShortName || "--" }}
              </el-row>
              <el-row class="ellipsis-text">
                {{ slotProps.row.followBy || "--" }}
              </el-row>
            </template>

            <template v-if="slotProps.prop === 'start'">
              <el-row class="ellipsis-text"
                >{{ slotProps.row.startWarehouse || "--" }}
              </el-row>
              <el-row class="ellipsis-text">
                {{ slotProps.dicsList.nameCn || "--" }}
              </el-row>
            </template>

            <template v-if="slotProps.prop === 'objective'">
              <el-row class="ellipsis-text"
                >{{ slotProps.row.endWarehouse || "--" }}
              </el-row>
              <el-row class="ellipsis-text">
                {{ slotProps.row.aimCountry || "--" }}
              </el-row>
            </template>

            <template v-if="slotProps.prop === 'inWarehouseStatus'">
              <el-row class="ellipsis-text">
                <span
                  :style="{
                    color: slotProps.dicsList && slotProps.dicsList.color,
                  }"
                >
                  {{ slotProps.dicsList.nameCn || "--" }}
                </span>
              </el-row>
              <el-row class="ellipsis-text">
                <div
                  :class="[
                    'operation-content',
                    `${
                      slotProps.row.dataMsg
                        ? 'wanzheng-tip-color'
                        : 'queshi-tip-color'
                    }`,
                  ]"
                >
                  <i
                    :class="[
                      'iconfont',
                      `${slotProps.row.dataMsg ? 'wanzheng2' : 'queshi2'}`,
                    ]"
                  />
                  <span>{{
                    getDictObj(
                      dictionary.dicsData.information,
                      slotProps.row.dataMsg
                    )
                  }}</span>
                </div>
              </el-row>
            </template>

            <template v-if="slotProps.prop === 'warehousingDate'">
              <el-row class="ellipsis-text"
                >{{ slotProps.row.expectInWarehouseTime || "--" }}
              </el-row>
              <el-row class="ellipsis-text">
                {{ slotProps.row.inWarehouseTime || "--" }}
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'expectSumBoxNum'">
              <el-row class="ellipsis-text"
                >{{ slotProps.row.expectSumBoxNum || "--" }}
              </el-row>
              <el-row class="ellipsis-text">
                <span>备注：{{ slotProps.row.remark || "--" }}</span>
              </el-row>
            </template>
            <!-- <template v-if="slotProps.prop === 'estimate'">
              <div class="base-flex-center estimate-row">
                <span class="ellipsis-text ">
                  {{ slotProps.row.expectSumBoxNum || "--" }}
                </span>
                <span class="ellipsis-text">
                  {{ toFixedNum(slotProps.row.expectSumWeight) }}
                </span>
                <span class="ellipsis-text">
                  {{ toFixedNum(slotProps.row.expectCbm) }}
                </span>
              </div>
              <el-row class="ellipsis-text">
                <span>备注：{{ slotProps.row.remark || "--" }}</span>
              </el-row>
            </template> -->
          </template>
          <template v-slot:customHeader="{ slotProps }">
            <template
              v-if="
                /operationNo|customer|start|objective|inWarehouseStatus|warehousingDate/.test(
                  slotProps.column.prop
                )
              "
            >
              <div>{{ slotProps.column.labelTop }}</div>
              <div>{{ slotProps.column.labelBtm }}</div>
            </template>
            <!-- <template v-if="/estimate/.test(slotProps.column.prop)">
              <div class="estimate-header">
                <span>{{ slotProps.column.labelLeft }}</span>
                <span>{{ slotProps.column.labelRightMiddle }}</span>
                <span>{{ slotProps.column.labelRight }}</span>
              </div>
            </template> -->
          </template>
        </ComTable>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { getWaitSort } from "@/api/container/arrange.js";
import { mapState } from "vuex";
import {
  editSearchFormCols,
  editDrawerTableCols,
} from "../loadContainer/model";
export default {
  props: {
    activities: {
      type: Array,
      default: () => [],
    },
  },
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
              // console.log('checkTableArr===', this.checkTableArr)
              this.$emit(
                "handleClick",
                this.checkTableArr.map((e) => e.orderId)
              );
              this.hide();
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this._getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        // fold: true,
        labelWidth: "85px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: editSearchFormCols,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 234px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getWaitSort,
        columnConfig: editDrawerTableCols,
      },
      isFormShow: false, // 阻止自动聚焦与表格选择缓存
      searchFromData: {},
      searchDefault: {
        dataType: 0, // 待排柜
      },
      checkTableArr: [],
    };
  },
  methods: {
    _getTableList(searchFrom = {}) {
      const { estimateTime, actualTime, ...searchObj } = searchFrom;
      if (estimateTime) {
        searchObj.startDate = estimateTime[0];
        searchObj.endDate = estimateTime[1];
      }
      if (actualTime) {
        searchObj.startTime = actualTime[0];
        searchObj.endTime = actualTime[1];
      }
      this.searchFromData = { ...searchObj };
      this.$refs[`tableRef`]?.refreshTable();
    },
    selectionRowEvt(row) {
      const rowNo = (row.torderNo || "").toLocaleUpperCase(); // 转大写，带UK的单号与其他单号区分
      const rSome = this.checkTableArr.some((e) => {
        const eleNo = (e.torderNo || "").toLocaleUpperCase();
        return eleNo.includes("UK")
          ? rowNo.includes("UK")
          : !rowNo.includes("UK");
      });
      if (this.checkTableArr?.length && !rSome) {
        return false; // 禁止选择
      }
      return true; // 可选
    },
    onSelectionChangeEvt(rows = []) {
      // this.checkTableArr = rows;

      const row = rows[0] || {};
      const rowNo = (row.torderNo || "").toLocaleUpperCase(); // 转大写，带UK的单号与其他单号区分
      this.checkTableArr = (rows || []).filter((e) => {
        const eleNo = (e.torderNo || "").toLocaleUpperCase();
        return rowNo.includes("UK")
          ? eleNo.includes("UK")
          : !eleNo.includes("UK");
      });
      this.$refs[`tableRef`]._toggleRowSelectionMixin({
        newCheckRows: this.checkTableArr,
      });
    },
    show(obj) {
      const { operationMain } = obj;
      this.checkTableArr = obj.rows;
      this.searchDefault.orderIds = obj.ids;
      this.searchDefault.bookingSpaceProxy = operationMain
        ? operationMain
        : obj.bookingSpaceProxy || undefined;
      this.searchDefault.startWarehouse = obj.warehouseId || undefined;
      this.$refs.myDrawer.show();
      this.$nextTick(() => {
        this.isFormShow = true;
      });
    },
    hide() {
      this.isFormShow = false;
      this.$refs.myDrawer.hide();
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
        ...this.searchDefault,
        dataStatus: 1, // 排除已选中的 orderIds
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
      padding-top: 20px;
      padding-right: 0;
    }
    .search-form-btn {
      display: flex;
      flex-direction: column;
      .el-button + .el-button {
        margin-left: 0;
        margin-top: 22px;
      }
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
