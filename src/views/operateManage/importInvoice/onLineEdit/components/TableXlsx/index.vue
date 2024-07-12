<template>
  <div
    class="table-xlsx"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <el-table
      :data="tableData"
      :span-method="handleSpanMethod"
      border
      class="tableData"
      header-cell-class-name="table-header-cell"
      header-row-class-name="table-header-row"
      cell-class-name="el-table__cell"
      row-key="newId"
      :height="tableAutoHeight"
      @row-contextmenu="handleContextmenu"
      @cell-dblclick="handleCellDblclick"
      @cell-click="handleCellClick"
      :row-class-name="tableRowClassName"
      :row-style="tableRowClass"
    >
      <template v-for="column in tableColumns">
        <el-table-column
          :key="column.type"
          :type="column.type"
          :width="column.width"
          :fixed="column.fixed"
          :align="column.align || 'left'"
          v-if="column.type === 'index'"
          class-name="cell_index"
        />
        <el-table-column
          :key="column.prop"
          :prop="column.prop"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :fixed="column.fixed"
          :header-align="column.align || 'left'"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :class-name="column.className"
          :formatter="
            (row) =>
              row[column.prop] || row[column.prop] === 0
                ? handleViewData(row, column)
                : '--'
          "
          v-else-if="column.fieldItem.type === 'txt'"
        >
          <template slot="header" v-if="column.type !== 'index'">
            <div :class="`label ${column.align || 'left'}`">
              <div class="label-top" v-if="column.labelTop">
                {{ column.request ? "*" : "" }}{{ column.labelTop }}
              </div>
              <div class="label-btm" v-if="column.labelBtm">
                {{ column.request ? "*" : "" }}{{ column.labelBtm }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="column.prop"
          :prop="column.prop"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :fixed="column.fixed"
          :header-align="column.align || 'left'"
          :class-name="updateImg.includes(column.prop) ? 'img-cell' : ''"
        >
          <template slot="header" v-if="column.type !== 'index'">
            <div :class="`label ${column.align || 'left'}`">
              <div class="label-top" v-if="column.labelTop">
                {{ column.request ? "*" : "" }}{{ column.labelTop }}
              </div>
              <div class="label-btm" v-if="column.labelBtm">
                {{ column.request ? "*" : "" }}{{ column.labelBtm }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <template
              v-if="
                showInputKey != `${column.prop}_${scope.$index}` ||
                updateImg.includes(column.prop)
              "
            >
              <div
                :class="[
                  'view-text',
                  !scope.row[column.fieldItem.selectLabelKey || column.prop] &&
                    scope.row[
                      column.fieldItem.selectLabelKey || column.prop
                    ] !== 0 &&
                    'text-empty',
                ]"
                v-if="!updateImg.includes(column.prop)"
              >
                {{
                  handleViewData(scope.row, column) ||
                  column.fieldItem.placeholder
                }}
              </div>
              <template v-else>
                <el-image
                  :src="scope.row[column.prop]"
                  fit="contain"
                  class="product-img"
                  title="导入"
                  v-if="scope.row[column.prop]"
                ></el-image>
                <el-input
                  :class="[
                    'parte-no-data',
                    scope.row[column.prop] && 'parte-input',
                  ]"
                  :ref="`${column.prop}_${scope.$index}`"
                  size="small"
                  @paste.native="onPasteUpload($event)"
                  @keyup.delete.native="handleDeleteImg()"
                  @blur="handleParteBlur(column.prop, scope.$index)"
                  placeholder="粘贴图片"
                />
              </template>
              <div
                v-if="
                  (column.prop === selectProp &&
                    selectList.includes(scope.$index)) ||
                  selectLine === scope.$index
                "
                :class="`cover-div ${scope.$index === 0 && 'first'} ${
                  column.prop === 'sku' && 'table-flex'
                }`"
              ></div>
            </template>
            <div
              v-else
              :class="`table-cell ${
                cancelMerge.includes(column.prop) ? 'merge-cell' : ''
              }`"
            >
              <template v-if="column.prop === 'consigneeWarehouseId'">
                <AutoComplete
                  v-if="scope.$index === 0 || encasementWay == 0"
                  :key="`${column.prop}_${scope.$index}`"
                  :ref="`${column.prop}_${scope.$index}`"
                  :formModel="scope.row"
                  :fieldItem="{
                    id: column.fieldItem.id || column.prop,
                    ...column.fieldItem,
                    size: 'small',
                    handleCreate: addAddress,
                    refreshRequest: warehouseRefreshRequest,
                    handle: (val) => handleSelectWarehouse(val, scope.$index),
                  }"
                  :additionalParam="{ customerId: userCustomerId }"
                />
                <el-row v-else class="show-overflow-tooltip"
                  >{{ scope.row.consigneeWarehouseCode || "--" }}
                </el-row>
              </template>
              <FormSingle
                :ref="`${column.prop}_${scope.$index}`"
                :key="`${column.prop}_${scope.$index}`"
                :formData="scope.row"
                :fieldItem="{
                  id: column.fieldItem.id || column.prop,
                  ...column.fieldItem,
                }"
                size="small"
                :class="column.className"
                :dictionary="dictionary"
                :disabled="column.fieldItem.type === 'txt'"
                @handleChange="
                  (val) => handleChange(val, column.prop, scope.$index)
                "
                @click.stop.native="handleClearSelect"
                v-else
              />
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="grand-total">
      <span class="total-title">合计：</span>
      <template v-for="gross in totalConfig">
        <span :key="gross.prop">
          <span class="total-label">{{ gross.label }}</span>
          <span class="total-value">
            {{
              grossTotal[gross.prop] && grossTotal[gross.prop].length
                ? accumulationFn(grossTotal[gross.prop], gross.decimal || 0)
                : "--"
            }}</span
          >
        </span>
      </template>
    </div>
    <div
      class="context-menu"
      v-if="contextVisible"
      :style="{ top: `${contextMenuTop}px`, left: `${contextMenuLeft}px` }"
    >
      <div
        @click="addLine('above')"
        :class="600 - tableData.length <= 0 && 'prevent'"
      >
        <span>在上方插入</span>
        <el-input-number
          v-model="aboveRowsNum"
          :min="1"
          :controls="false"
          v-input-number-limit="{
            value: 0, // 几位小数限制
            maxNumber: 600 - tableData.length, // 最大值限制
          }"
          :precision="0"
          :maxlength="3"
          size="mini"
          class="menu-input"
          @click.stop.native="() => {}"
        />
        <span>行</span>
      </div>
      <div
        @click="addLine('below')"
        :class="600 - tableData.length <= 0 && 'prevent'"
      >
        <span>在下方插入</span>
        <el-input-number
          v-model="belowRowsNum"
          :min="1"
          :controls="false"
          v-input-number-limit="{
            value: 0, // 几位小数限制
            maxNumber: 600 - tableData.length, // 最大值限制
          }"
          :precision="0"
          :maxlength="3"
          size="mini"
          class="menu-input"
          @click.stop.native="() => {}"
        />
        <span>行</span>
      </div>
      <div @click="handleMerge" v-if="menuType === 2">取消合并单元格</div>
      <div @click="handleMerge" :class="menuType !== 1 && 'prevent'" v-else>
        合并单元格
      </div>
      <div @click="handleImgImport" :class="menuType !== 3 && 'prevent'">
        插入图片
      </div>
      <div @click="handleDeleteLine">移除该行</div>
      <div @click="handleCopy">复制</div>
      <div @click="handleParte">粘贴</div>
    </div>
    <ComUpload
      style="display: none"
      ref="productUploadRef"
      :uploadConfig="{
        ...productUploadConfig,
        //uploadData: {
        //  productId,
        //},
      }"
      @handleSuccess="(res) => uploadSuccess(res)"
      @handleError="handleImportErr"
      @handleUploading="handleUploading"
    />
    <AddDialog ref="addDialogRef" @handleSuccess="handleSuccess" />
  </div>
</template>

<script>
import {
  tableColumns,
  mergeColumn,
  slotInputProp,
  handleRule,
  totalConfig,
  clearanceRemark,
} from "./model.js";
import { mixinConf } from "../mixinConf.js";
import { mapState } from "vuex";
import { toNewFixed } from "@/utils/instructions";

export default {
  mixins: [mixinConf],
  props: {
    encasementWay: {
      type: Number,
      default: 0,
    },
    newsData: {
      type: Object,
      default: () => ({}),
    },
    invoiceEcDtoList: {
      type: Array,
      default: null,
    },
    isOperationOrder: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const initNum = 15; // 初始添加行
    const arr = new Array(initNum).fill(0);
    return {
      totalConfig,
      slotInputProp,
      tableColumns: this.isOperationOrder
        ? [...tableColumns, clearanceRemark]
        : tableColumns,
      tableData: [],
      mergeObj: {},
      identName: "mergeColumn", // 合并单元格标识
      mergeColumn: 0,
      newId: 0,
      aboveRowsNum: 1,
      belowRowsNum: 1,
      contextMenuLeft: 0,
      contextMenuTop: 0,
      initNum,
      showInputKey: "",
      clickKey: "",
      warehouseRefreshRequest: false,
      grossTotal: {
        quantityNum: [...arr],
        totalDeclaredValue: [...arr],
        boxCount: [...arr],
        boxTotalWeight: [...arr],
        totalProductNetWeight: [...arr],
        boxVolume: [...arr],
      },
    };
  },
  created() {
    if (!this.invoiceEcDtoList) {
      this.tableData = this.addRows(this.initNum);
    } else {
      const list = [...this.invoiceEcDtoList];
      const mergeObj = {};
      const quantityNum = [];
      const totalDeclaredValue = [];
      const boxCount = [];
      const boxTotalWeight = [];
      const totalProductNetWeight = [];
      const boxVolume = [];
      list.forEach((item, index) => {
        this.newId += 1;
        item.newId = `newId${this.newId}`;
        item.mergeColumn = Number(item.mergeColumn);
        quantityNum.push(item.quantityNum || 0);
        totalDeclaredValue.push(item.totalDeclaredValue || 0);
        if (!mergeObj[item.mergeColumn]) {
          mergeObj[item.mergeColumn] = { index, num: 0 };
          boxCount.push(item.boxCount || 0);
          boxTotalWeight.push(item.boxTotalWeight || 0);
          totalProductNetWeight.push(item.totalProductNetWeight || 0);
          boxVolume.push(toNewFixed(item.boxVolume, 3) || 0); // 体积特殊处理, 先四舍五入再进行合计
        } else {
          boxCount.push(0);
          boxTotalWeight.push(0);
          totalProductNetWeight.push(0);
          boxVolume.push(0);
        }
        mergeObj[item.mergeColumn].num += 1;
      });
      this.grossTotal = {
        quantityNum,
        totalDeclaredValue,
        boxCount,
        boxTotalWeight,
        totalProductNetWeight,
        boxVolume,
      };
      Object.keys(mergeObj).forEach((k) => {
        const { index, num } = mergeObj[k];
        if (num > 1) {
          this.mergeObj[k] = mergeObj[k];
          this.mergeColumn = k;
        } else {
          list[index].mergeColumn = undefined;
        }
      });
      this.tableData = list;
    }
    // 添加操作记录
    this.$emit(
      "addRecord",
      {
        tableData: this.tableData,
        mergeObj: this.mergeObj,
      },
      true
    );
  },
  computed: {
    ...mapState(["dictionary"]),
    ...mapState({
      userCustomerId: (state) => state.user.userInfo?.customerId,
    }),
    tableAutoHeight() {
      const tableLen = this.tableData.length;
      return tableLen > 21
        ? `${20 * 45 + 67 + 10}px`
        : `${tableLen * 45 + 67 + 10}px`;
    },
  },
  watch: {
    encasementWay(val) {
      if (val == 1) {
        const row = this.tableData ? this.tableData[0] : {};
        this.tableData.forEach((item) => {
          item.consigneeWarehouseId = row.consigneeWarehouseId;
          item.consigneeWarehouseCode = row.consigneeWarehouseCode;
        });
      }
    },
    "newsData.outWarehouseWay"(val) {
      if (val == 50) {
        const row = this.tableData ? this.tableData[0] : {};
        this.tableData.forEach((item) => {
          item.consigneeWarehouseId = row.consigneeWarehouseId;
          item.consigneeWarehouseCode = row.consigneeWarehouseCode;
        });
      }
    },
  },
  methods: {
    handleSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!row[this.identName] || !this.mergeObj[row[this.identName]]) {
        return {
          rowspan: 1,
          colspan: 1,
        };
      }
      if (mergeColumn.includes(columnIndex)) {
        const { index, num } = this.mergeObj[row[this.identName]];
        if (rowIndex === index) {
          return {
            rowspan: num,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    getTableList() {
      const list = [];
      const obj = {};
      let err = "";
      let goodsNum = 0;
      const index = this.tableData.findIndex((item, i) => {
        if (item.mergeColumn && !obj[item.mergeColumn]) {
          goodsNum += 1;
          const { index } = this.mergeObj[item.mergeColumn];
          obj[item.mergeColumn] = {};
          this.cancelMerge.forEach(
            (k) => (obj[item.mergeColumn][k] = this.tableData[index][k])
          );
        }
        const row = { ...item, ...(obj[item.mergeColumn] || {}) };
        if (!row.mergeColumn) {
          this.mergeColumn += 1;
          row.mergeColumn = this.mergeColumn;
        }
        const { deleteLine, msg } =
          handleRule(
            row,
            this.encasementWay,
            this.newsData.clearanceType,
            this.newsData.reportCustomsWayId,
            this.isOperationOrder,
            i
          ) || {};
        if (deleteLine) {
          return false;
        }
        if (!item.mergeColumn) goodsNum += 1;
        list.push(row);
        if (msg) {
          err = `第${i + 1}行，${msg}`;
        } else if (row.boxWeight <= row.productNetWeight) {
          err = `第${i + 1}行，毛重净重 （单箱）毛重永远只能＞（单箱）净重`;
          return true;
        }
        return msg;
      });
      if (index > -1) {
        this.$message.error(err);
        return false;
      }
      console.log(list, goodsNum);
      return { list, goodsNum };
    },
    handleContextmenu(row, column, ev) {
      console.log(row, column, ev);
      ev.preventDefault();
      const index = this.tableData.findIndex(
        (item) => row.newId === item.newId
      );
      this.openContextMenu(ev, column.property, index);
    },
    handleCellClick(row, column, cell, ev) {
      ev.preventDefault();
      this.showInputKey = "";
      const index = this.tableData.findIndex(
        (item) => row.newId === item.newId
      );
      if (!column.property) {
        this.handleClickIndex(index);
        return;
      }
      if (this.shiftKey) {
        this.handleClickShift(column.property, index);
      } else if (this.ctrlKey) {
        this.handleClickCtrl(column.property, index);
      } else if (
        this.clickKey === `${column.property}_${index}` &&
        this.selectList.length === 1 &&
        !this.updateImg.includes(column.property)
      ) {
        this.tabIndex = index;
        this.handleInputFocus(this.clickKey);
      } else {
        this.clickKey = `${column.property}_${index}`;
        this.handleClick(column.property, index);
      }
    },
    handleCellDblclick(row, column, cell, ev) {
      ev.preventDefault();
      const index = this.tableData.findIndex(
        (item) => row.newId === item.newId
      );
      this.tabIndex = index;
      this.handleInputFocus(`${column.property}_${index}`);
    },
    handleInputFocus(key) {
      this.showInputKey = key;
      setTimeout(() => {
        const refs = this.$refs[this.clickKey];
        if (refs) {
          if (refs[0].handleFocus) {
            refs.forEach((ref) => {
              ref.handleFocus();
            });
          } else {
            refs.forEach((ref) => {
              ref.$refs.selectSearch.focus();
            });
          }
        }
      });
    },
    handleViewData(row, column) {
      const value = row[column.fieldItem.selectLabelKey || column.prop];
      if ((value || value === 0) && column.fieldItem.decimal) {
        return this.toFixedNum(value, column.fieldItem.decimal);
      }
      return value;
    },
    setHistoryRecord(tableData, mergeObj) {
      if (tableData) {
        this.tableData = JSON.parse(JSON.stringify(tableData));
      }
      if (mergeObj) {
        this.mergeObj = { ...mergeObj };
      }
    },
    addAddress() {
      this.$refs.addDialogRef.show();
    },
    handleSuccess() {
      this.warehouseRefreshRequest = !this.warehouseRefreshRequest;
    },
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      if (rowIndex < 10) {
        return `table-row fixed-row row${rowIndex}`;
      } else {
        return `table-row`;
      }
    },
    tableRowClass({ row, column, rowIndex, columnIndex }) {
      let styleClass = {};
      if (rowIndex < 10) {
        styleClass = {
          top: `${45 * rowIndex}px`,
        };
      }
      return styleClass;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-xlsx {
  user-select: none;

  .table-cell {
    cursor: pointer;

    &.table-index {
      cursor: grab;

      &.active-index {
        background-color: rgb(95, 98, 102);
        color: #fff;
      }
    }
    &.merge-cell {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      padding: 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      & > div {
        width: calc(100% + 2px);
      }
    }
  }

  .view-text {
    width: 100%;
    text-align: left;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    // border-radius: 4px;
    // border: 1px solid #bcbcbc;
    color: #515151;
    overflow: hidden;

    &.text-empty {
      color: #a5a5a5;
    }
    &.el-icon-search {
      padding-right: 23px;
      &::before {
        position: absolute;
        z-index: 1;
        right: 20px;
        top: 49%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        color: #999;
      }
    }
  }
  .product-img {
    display: block;
    width: 44px;
    height: 44px;
    border-radius: 2px;
    border: 1px solid #bcbcbc;
    margin: 5px 0;
  }
  .parte-no-data {
    &.parte-input {
      position: absolute;
      width: 44px;
      height: 44px;
      top: 0;
      left: 0;
      z-index: -1;
    }

    /deep/ {
      .el-input__inner {
        border: none;
      }
    }
  }
  .cover-div {
    position: absolute;
    top: -1px;
    left: -1px;
    z-index: 3;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    background: rgba($color: #5094ff, $alpha: 0.1);
    border: 1px solid #8b8b8b;

    &.first {
      top: 0px;
      height: calc(100% + 1px);
    }
    &.table-flex {
      left: 0px;
      width: calc(100% + 1px);
    }
  }
  .grand-total {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .total-title {
      font-size: 15px;
      font-weight: bold;
      color: #737373;
      margin-right: -30px;
    }
  }
}
.label {
  font-weight: 400;
  line-height: 18px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;

  &.right {
    align-items: end;
  }
  &.center {
    align-items: center;
  }
  .label-top {
    color: #696969;
  }
  .label-btm {
    color: #5094ff;
  }
}
.context-menu {
  position: absolute;
  z-index: 200;
  padding: 8px 4px;
  background: #ffffff;
  box-shadow: 0px 0px 8px 2px rgba(136, 136, 136, 0.2);
  & > div {
    height: 38px;
    padding: 0 11px;
    display: flex;
    align-items: center;
    white-space: initial;
    cursor: pointer;

    &:hover {
      background: rgba(80, 148, 255, 0.1);
    }
    .menu-input {
      width: 45px;
      margin: 0 10px;
      /deep/ {
        .el-input__inner {
          height: 24px;
          padding: 0 8px;
          text-align: center;
          border-radius: 2px;
          border: 1px solid #bcbcbc;
        }
      }
    }
  }
  .prevent {
    color: #a5a5a5;
    cursor: not-allowed;
    // pointer-events: none;
    &:hover {
      background: transparent;
    }
  }
}
/deep/ {
  .el-input-number--small {
    width: 100%;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #e2e2e2;
    border-bottom: none;
  }
}
.tableData {
  // ----------修改elementui表格的默认样式-----------
  /deep/ {
    .table-header-cell {
      &:not(:last-child) {
        border-right: 1px solid #e2e2e2;
      }
    }
    .el-table__cell {
      position: relative;
      padding: 0;
      cursor: pointer;
      &.cell_index {
        .cell {
          padding: 13px 0;
        }
      }
      &.img-cell {
        .cell {
          justify-content: flex-start;
          max-height: 44px;
        }
      }
      &.is-right {
        .cell {
          justify-content: flex-end;
        }
      }
      &.is-left {
        .cell {
          justify-content: flex-start;
        }
      }
      &.detailed-address {
        .cell {
          display: inline-block;
          align-items: flex-start;
        }
      }
      .cell {
        display: flex;
        align-items: center;
        justify-content: center;
        .el-input__inner {
          padding-left: 10px;
        }
      }
    }
    .el-table__body-wrapper {
      &::-webkit-scrollbar {
        height: 10px;
        width: 10px;
      }
    }

    // 解决表格固定列问题
    .el-table__fixed,
    .el-table__fixed-right {
      height: calc(100% - 12px) !important;
    }

    // 当表格没有滚动条时
    .el-table__body-wrapper.is-scrolling-none {
      & ~ .el-table__fixed,
      & ~ .el-table__fixed-right {
        height: 100% !important;
        bottom: 0 !important;
        box-shadow: none !important;
      }
    }

    // 当表格有纵向滚动条时
    .el-table--scrollable-y .el-table__fixed-right {
      right: 10px !important;
    }

    // 当表格只有横向滚动条，没有纵向滚动条时
    .el-table--scrollable-x:not(.el-table--scrollable-y)
      .el-table__fixed-right {
      right: 0 !important;
    }
    .table-row.hover-row > td.el-table__cell,
    .table-row:hover > td.el-table__cell {
      background-color: transparent;
    }
  }
}
/deep/ {
  .el-table {
    .fixed-row {
      position: sticky;
      position: "-webkit-sticky";
      z-index: 3;
    }
  }
}
</style>
