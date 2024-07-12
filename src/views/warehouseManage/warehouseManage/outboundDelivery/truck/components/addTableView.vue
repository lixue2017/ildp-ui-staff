<template>
  <div>
    <template v-for="(item, index) in tableConfigList">
      <div :key="item.tIndex">
        <div class="base-flex-between footer-btn">
          <div class="title">{{ item.label }}</div>
          <el-button
            v-if="item.tIndex === 0"
            type="primary"
            size="small"
            @click="addContainerEvt"
            class="add-btn"
          >
            <i class="el-icon-plus"></i>
            {{ overseaLangObj.xz_add("添 加") }}
          </el-button>
        </div>

        <ComTable
          v-if="item.tIndex === 1"
          :ref="`tableRef`"
          :columnConfig="trayTable.tableColumns"
          :tableHeight="tableTrayHeight"
          :columnData="trayTable.columnData"
          :treeProps="{ children: 'trayList' }"
          :extraConfig="{
            rowKeyName: 'trayKeyObj',
          }"
          :spanMethod="spanMethod"
          :selectionRowConfig="{ childrenSelection: true }"
          :defaultExpandAll="true"
          :selectionRow="selectionRowEvt"
          @onSelectionChange="onTableSelectionChange"
        />
        <ComTable
          v-else
          :ref="`gTableRef${item.tIndex}`"
          :tableHeight="tableAutoHeight(index)"
          :columnConfig="item.columnConfig"
          :columnData="item.columnData"
          :pagination="false"
          :rowOperationBtnListFn="(row) => item.statusBtnList"
        >
          <!-- (item.columnData.length > 1 ? item.statusBtnList : []) -->
          <template v-slot:customRow="{ slotProps }">
            <template v-for="(nItem, nIdx) in ['num', 'pltNum']">
              <template v-if="slotProps.prop == nItem">
                <div :key="nIdx">
                  <!-- 大货中转不可修改 -->
                  <span v-if="[1, 4].includes(slotProps.row.businessType)">{{
                    slotProps.row[nItem]
                  }}</span>
                  <el-input-number
                    v-else
                    size="small"
                    :min="slotProps.column.min || 0"
                    v-model="slotProps.row[nItem]"
                    v-input-number-limit="{
                      value: slotProps.column.decimal,
                      maxNumber: slotProps.column.maxKey
                        ? slotProps.row[slotProps.column.maxKey]
                        : 9999,
                    }"
                    :placeholder="slotProps.column.label"
                    :controls="false"
                    @change="
                      (val) => handleNumberChange(slotProps.row, val, nItem)
                    "
                  />
                </div>
              </template>
            </template>
          </template>
          <template v-slot:bottomTotal>
            <div class="grand-total">
              <template v-for="(tItem, i) in tableSubtotal(index)">
                <span :key="`t_${i}`">
                  <span>{{ tItem.totalLabel }}：</span>
                  <span>{{ tItem.totalNum }}</span>
                </span>
              </template>
            </div>
          </template>
        </ComTable>
      </div>
    </template>

    <addDrawerOrder ref="addDrawerRef" @handleCheckClick="addTableClick" />
  </div>
</template>

<script>
import { accumulationFn, multiplicationFn } from "@/utils/instructions";
import { duplicateRemoval } from "@/utils/index";
import {
  getTruckCargoList,
  getTruckDeliveryPlan,
  getTruckListPlan,
} from "@/api/warehouse/manage";
import { addTableColumns, trayTableColumns } from "../model";

export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      trayTable: {
        tableColumns: trayTableColumns(),
        columnData: [],
        totalRow: 0,
      },
      selectionRows: [],
      tableConfigList: [
        {
          tIndex: 0,
          label: this.overseaLangObj.ygl_tp || "已关联托盘货物信息",
          columnConfig: addTableColumns(0),
          columnData: [],
          statusBtnList: [],
        },
        {
          tIndex: 1,
          label: this.overseaLangObj.tp_info || "托盘信息",
        },
        {
          tIndex: 2,
          label: this.overseaLangObj.wgl_tp || "未关联托盘货物信息",
          columnConfig: addTableColumns(1),
          columnData: [],
          statusBtnList: [
            {
              text: this.overseaLangObj.yc_delete("移除"),
              handleClick: this.handleDelete,
            },
          ],
        },
      ],
      resTrayPlan: {},
    };
  },
  methods: {
    selectionRowEvt(row) {
      return !row.trayList;
    },
    onTableSelectionChange(rows = []) {
      let trayAllArr = [...rows];
      rows.forEach((e) => {
        if (e.trayList) {
          trayAllArr = trayAllArr.concat(e.trayList || []);
        }
      });
      this.selectionRows = duplicateRemoval(
        trayAllArr.filter((e) => !e.trayList),
        "id"
      );
      this.handleCheckedChange(this.selectionRows.map((e) => e.id));
      this.$refs.tableRef[0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    handleCheckedChange(rows) {
      if (rows?.length) {
        getTruckListPlan({ idList: rows || [] }).then((res) => {
          this.setTableData(0, res.data);
        });
      } else {
        this.setTableData(0, []);
      }
    },
    handleDelete(row = {}) {
      const tableData = this.tableConfigList[2].columnData.filter(
        (e) => e.id !== row.id
      );
      this.setTableData(2, tableData);
    },
    addContainerEvt() {
      this.$refs.addDrawerRef?.show(this.handleTableData(), this.formData);
    },
    addTableClick(arr) {
      if (arr?.length) {
        let idLists = [];
        arr.forEach((ele) => {
          idLists.push(...ele.idList);
        });
        const ids = this.handleTableData().map((e) => e.id);
        this.getTableList([...ids, ...idLists]);
      }
    },
    async getTableList(ids) {
      const { routeId, routePageLocation } = this.formData;
      this.resTrayPlan =
        (
          await getTruckDeliveryPlan({
            idList: ids ? ids : routeId.split(","),
            pageLocation: routePageLocation,
          })
        ).data || {};
      const {
        planIdList, // 无托盘货物列表
        planList, // 关联托盘列表
      } = this.resTrayPlan;

      this.trayTable.columnData = planList || [];
      this.$refs.tableRef[0]?.setNewTableData(planList || []);

      if (planList?.length) {
        let trayAllArr = [];
        planList.forEach((ele) => {
          trayAllArr = trayAllArr.concat(ele.trayList || []);
        });
        this.trayTable.totalRow = accumulationFn([
          planList.length,
          trayAllArr.length,
        ]);
        this.onTableSelectionChange(trayAllArr);
      }
      if (planIdList?.length) {
        getTruckCargoList({
          idList: planIdList,
          pageLocation: routePageLocation,
        }).then((res) => {
          this.setTableData(2, res.data);
        });
      }
    },
    setTableData(idx, arr) {
      this.tableConfigList[idx].columnData = arr || [];
      this.$refs[`gTableRef${idx}`][0]?.setNewTableData(arr || []);
    },
    handleTableData() {
      return [
        ...this.tableConfigList[0].columnData,
        ...this.tableConfigList[2].columnData,
      ];
    },
    getTableData() {
      // 父组件获取表格数据
      const ruleIndex = this.tableConfigList[2].columnData.findIndex(
        (e) => !e.num
      );
      if (ruleIndex > -1) {
        this.msgError(
          `${this.tableConfigList[2].label}，序号${ruleIndex + 1}行箱数不能为空`
        );
      } else {
        return this.handleTableData();
      }
      return null;
    },

    tableAutoHeight(idx) {
      const tableLen = this.tableConfigList[idx].columnData.length;
      return tableLen > 6 ? `${7 * 39 + 54}px` : undefined;
    },
    handleNumberChange(row, val, key) {
      if (key === "num") {
        row.totalVolume = multiplicationFn([row.singleVolume, val]);
        row.totalWeight = multiplicationFn([row.singleWeight, val]);
      }
    },
    spanMethod({ row, columnIndex }) {
      if (!row.trayList) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        } else if (columnIndex === 2) {
          return [1, 5];
        } else if ([3, 4, 5, 6].includes(columnIndex)) {
          return [0, 0];
        } else {
          return [1, 1];
        }
      }
    },
    tableSubtotal(idx) {
      const arr = this.tableConfigList[idx].columnData || [];
      return [
        {
          totalLabel: this.overseaLangObj.zxs_total("总箱数"),
          totalNum: accumulationFn(arr.map((e) => e.num)),
        },
        {
          totalLabel: "PLT",
          // totalNum: accumulationFn(arr.map((e) => e.pltNum)),
          totalNum:
            idx === 0
              ? duplicateRemoval(this.selectionRows, "trayId").length
              : accumulationFn(arr.map((e) => e.pltNum)),
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
  mounted() {
    this.getTableList();
  },
  computed: {
    tableTrayHeight() {
      return this.trayTable.totalRow > 6 ? `${7 * 39 + 54}px` : undefined;
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    addDrawerOrder: () => import("../addDrawer.vue"),
  },
  created() {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .el-table__row--level-0 {
    &:not(:first-child) {
      .el-table__cell {
        border-top: 1px solid #e2e2e2;
      }
    }
  }
  .el-table__row--level-1 {
    .el-table__cell {
      border-bottom: none;
      &:first-child {
        text-align: left;
        padding-left: 53px;
      }
    }
  }
}
.tray-tit {
  padding: 10px 0;
  font-size: 14px;
  font-weight: 600;
}
.footer-btn {
  padding: 10px 0;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
