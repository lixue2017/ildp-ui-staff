<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns(freightType, formData.orderType)"
      :columnData="columnData"
      :pagination="false"
      :paginationConfig="tableConfig.paginationConfig"
    >
      <template v-slot:customRow="{ slotProps }">
        <template
          v-if="
            [
              'boxNum',
              'weight',
              'packNum',
              'length',
              'width',
              'height',
              'volume',
              'totalWeight',
              'totalVolume',
            ].includes(slotProps.prop)
          "
        >
          <template v-if="!slotProps.row.isUpdate">
            <el-row class="ellipsis-text">
              {{
                toFixedNum(
                  slotProps.row[slotProps.prop],
                  slotProps.config.decimal || 0
                )
              }}
            </el-row>
          </template>
          <template v-else>
            <el-row class="ellipsis-text">
              <el-input-number
                :class="`padding-class ${
                  ['boxNum', 'packNum'].includes(slotProps.prop)
                    ? 'text-input-center'
                    : [
                        'weight',
                        'volume',
                        'totalWeight',
                        'totalVolume',
                      ].includes(slotProps.prop)
                    ? 'text-input-right'
                    : ''
                }`"
                v-model="slotProps.row[slotProps.prop]"
                size="mini"
                :placeholder="slotProps.column.placeholder"
                :min="
                  handleMinNumber(
                    slotProps.config ? slotProps.config.decimal : 0,
                    slotProps.row,
                    slotProps.prop
                  )
                "
                :controls="false"
                v-input-number-limit="{
                  value: slotProps.config ? slotProps.config.decimal : null,
                  maxNumber: slotProps.config ? slotProps.config.max : null,
                }"
                @change="() => handleChange(slotProps.row, slotProps.prop)"
              ></el-input-number>
            </el-row>
          </template>
        </template>
        <template v-if="slotProps.prop === 'boxCode'">
          <template v-if="!slotProps.row.isUpdate">
            <el-row class="ellipsis-text">
              {{ slotProps.row[slotProps.prop] }}
            </el-row>
          </template>
          <template v-else>
            <el-row class="ellipsis-text">
              <AutoComplete
                class="padding-class"
                ref="autoComplete"
                :formModel="slotProps.row"
                :fieldItem="{
                  id: slotProps.prop,
                  size: 'mini',
                  placeholder: '柜型',
                  isBackAll: true,
                  httpRequest: getSizeList,
                  handle: (item) => handleSelect(slotProps.row, item),
                }"
                size="mini"
                defaultKey="id"
              />
            </el-row>
          </template>
        </template>
        <template
          v-if="
            ['sku', 'productNameCn', 'customsCode'].includes(slotProps.prop)
          "
        >
          <template v-if="!slotProps.row.isUpdate">
            <el-row class="ellipsis-text">
              {{ slotProps.row[slotProps.prop] || "--" }}
            </el-row>
          </template>
          <template v-else>
            <el-row class="ellipsis-text">
              <el-input
                class="padding-class"
                type="text"
                :placeholder="slotProps.column.placeholder"
                v-model="slotProps.row[slotProps.prop]"
                size="mini"
                :maxlength="slotProps.config ? slotProps.config.maxlength : 50"
              />
            </el-row>
          </template>
        </template>
        <template
          v-if="
            ['packType', 'customsDeclarationType', 'productAttribute'].includes(
              slotProps.prop
            )
          "
        >
          <template v-if="!slotProps.row.isUpdate">
            <el-row class="ellipsis-text">
              {{
                slotProps.dicsList ? slotProps.dicsList.nameCn || "--" : "--"
              }}
            </el-row>
          </template>
          <template v-else>
            <el-row class="ellipsis-text">
              <el-select
                v-if="slotProps.column.basicType"
                v-model="slotProps.row[slotProps.prop]"
                :placeholder="slotProps.column.label"
                style="width: 100%"
                clearable
                class="padding-class"
              >
                <el-option
                  v-for="selectItem in dictionary.dicsData[
                    slotProps.column.basicType
                  ]"
                  :key="Number(selectItem.value)"
                  :label="selectItem.nameCn"
                  :value="Number(selectItem.value)"
                />
              </el-select>
            </el-row>
          </template>
        </template>
        <template v-if="slotProps.prop === 'operation'">
          <div class="operation-content">
            <div class="btn">
              <div class="btn-list">
                <template
                  v-for="(item, index) in tableConfig.operation[
                    slotProps.row.isUpdate || 0
                  ]"
                >
                  <el-button
                    size="small"
                    type="text"
                    @click="item.handleClick(slotProps.row, slotProps.rowIndex)"
                    :key="index"
                  >
                    {{ item.label }}
                  </el-button>
                </template>
              </div>
            </div>
          </div>
        </template>
      </template>
    </ComTable>
    <div class="grand-total">
      <template v-for="gross in grossTotalLists[freightType]">
        <span :key="gross.prop">
          <span class="label">{{ gross.label }}</span>
          <!-- <span class="value">{{ tableTotal[gross.prop] }}</span> -->
          <span :class="`value ${gross.valClass}`">{{ gross.total }}</span>
        </span>
      </template>
    </div>
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import {
  getFreightList,
  addOrderFreight,
  deleteOrderFreight,
  editOrderFreight,
} from "@/api/trandition/seaAirTransport.js";
import { getSizeList } from "@/api/common";
import { tableColumns, handleRule, grossTotalLists } from "./model.js";
import { multiplicationFn } from "@/utils/instructions";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    freightType: {
      type: Number,
      default: 0,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      tableConfig: {
        tableColumns,
        paginationConfig: {
          limit: 999,
        },
        operation: {
          0: [
            {
              label: "复制",
              handleClick: this.handleCopy,
            },
            {
              label: "修改",
              handleClick: (row) => {
                this.currRow[row.id] = {
                  ...row,
                };
                row.isUpdate = 1;
              },
            },
            {
              label: "删除",
              handleClick: this.handleDelete,
            },
          ],
          1: [
            {
              label: "保存",
              handleClick: this.handleSave,
            },
            {
              label: "取消",
              handleClick: this.handleReduction,
            },
          ],
        },
      },
      currRow: {},
      columnData: [],
      consigneeData: [],
      iList: [],
      grossTotalLists,
    };
  },
  mounted() {
    this.getFreightList();
  },
  methods: {
    // 获取提货信息列表
    getFreightList(isTypeChange) {
      return new Promise((resolve) => {
        const { id: orderId, orderType } = this.formData;
        getFreightList({
          orderId,
          orderType,
          freightType: this.freightType,
          pageNum: 1,
          pageSize: 999,
        }).then((res) => {
          // 整柜、散货切换清除新增项
          const newList = isTypeChange
            ? []
            : this.columnData.filter((item) => !item.id && item.isUpdate);
          res.rows.map((item) => {
            const index = this.columnData.findIndex(
              (n) => n.id === item.id && n.isUpdate
            );
            if (index > -1) {
              newList.push({
                ...this.columnData[index],
              });
            } else {
              if (typeof item.packType === "string") {
                item.packType = Number(item.packType);
              }
              if (typeof item.customsDeclarationType === "string") {
                item.customsDeclarationType = Number(
                  item.customsDeclarationType
                );
              }
              newList.push({
                ...item,
                isUpdate: 0,
              });
            }
          });
          this.columnData = newList;
          this.getResult(this.columnData);
          this.updateTable();
          resolve(res);
        });
      });
    },
    getSizeList,
    handleSelect(row, item = {}) {
      console.log(item);
      row.boxSizeId = item.id;
      row.boxCode = item.code;
    },
    // 更新提货信息列表
    updateTable() {
      this.$refs.tableRef?.setNewTableData(this.columnData);
      this.getResult(this.columnData); //重新计算汇总结果
    },
    // 添加行
    handleAddLine() {
      this.columnData = [
        {
          isUpdate: 1,
          newAdd: true,
        },
        ...this.columnData,
      ];
      this.updateTable();
    },
    // 复制行
    handleCopy(row) {
      const copyLine = {
        ...row,
        isUpdate: 1,
        newAdd: true,
      };
      delete copyLine.id;
      delete copyLine.temp_secondId;
      this.columnData = [
        {
          ...copyLine,
        },
        ...this.columnData,
      ];
      this.updateTable();
    },
    handleSave(row, index) {
      const { id: orderId, orderType } = this.formData;
      const params = {
        ...row,
        orderId,
        orderType,
        freightType: this.freightType,
      };
      const column = this.tableConfig.tableColumns(this.freightType, orderType);
      const isNo = handleRule(params, column);
      if (isNo) {
        return this.$message.error(isNo);
      }
      if (row.id) {
        params.id = row.id;
        editOrderFreight(params).then(() => {
          row.isUpdate = 0;
          this.getFreightList();
        });
      } else {
        addOrderFreight(params).then(() => {
          row.isUpdate = 0;
          this.getFreightList();
        });
      }
    },
    handleChange(row, prop) {
      //freightType  0整柜  1散货
      // if (prop == "packNum") {
      //   //散货
      //   const { packNum = 0, weight = 0, volume = 0 } = row;
      //   row.totalWeight = multiplicationFn([packNum, weight], 2);
      //   row.totalVolume = multiplicationFn([packNum, volume], 2);
      // } else if (prop == "boxNum") {
      //   //整柜
      //   const { boxNum = 0, weight = 0, volume = 0 } = row;
      //   row.totalWeight = multiplicationFn([boxNum, weight], 2);
      //   row.totalVolume = multiplicationFn([boxNum, volume], 2);
      // } else if (this.freightType == 0 && prop == "weight") {
      //   //整柜计算重量小计
      //   const { boxNum = 0, weight = 0 } = row;
      //   row.totalWeight = multiplicationFn([boxNum, weight], 2);
      // } else if (this.freightType == 0 && prop == "volume") {
      //   //整柜计算体积小计
      //   const { boxNum = 0, volume = 0 } = row;
      //   row.totalVolume = multiplicationFn([boxNum, volume], 2);
      // } else if (this.freightType == 0 && prop == "totalVolume") {
      //   //整柜计算体积单价
      //   const { boxNum = 0, totalVolume = 0 } = row;
      //   const volume = (Number(totalVolume) / Number(boxNum)).toFixed(2);
      //   row.volume = volume == Infinity ? 0 : volume;
      // } else if (this.freightType == 0 && prop == "totalWeight") {
      //   //整柜计算重量单价
      //   const { boxNum = 0, totalWeight = 0 } = row;
      //   const weight = (Number(totalWeight) / Number(boxNum)).toFixed(2);
      //   row.weight = weight == Infinity ? 0 : weight;
      // } else if (this.freightType == 1 && prop == "weight") {
      //   //散货计算重量小计
      //   const { packNum = 0, weight = 0 } = row;
      //   row.totalWeight = multiplicationFn([packNum, weight], 2);
      // } else if (this.freightType == 1 && prop == "volume") {
      //   //散货计算体积小计
      //   const { packNum = 0, volume = 0 } = row;
      //   row.totalVolume = multiplicationFn([packNum, volume], 2);
      // } else if (this.freightType == 1 && prop == "totalVolume") {
      //   //散货计算体积单价
      //   const { packNum = 0, totalVolume = 0 } = row;
      //   const volume = (Number(totalVolume) / Number(packNum)).toFixed(2);
      //   row.volume = volume == Infinity ? 0 : volume;
      // } else if (this.freightType == 1 && prop == "totalWeight") {
      //   //散货计算重量单价
      //   const { packNum = 0, totalWeight = 0 } = row;
      //   const weight = (Number(totalWeight) / Number(packNum)).toFixed(2);
      //   row.weight = weight == Infinity ? 0 : weight;
      // }
    },
    handleMinNumber(decimal, row, key) {
      if (["totalWeight", "totalVolume"].includes(key)) {
        // 数量*单件体积与重量最小值
        return multiplicationFn([
          this.freightType == 1 ? row.packNum : row.boxNum,
          0.01,
        ]);
      }
      return this.minLimitNumber(decimal);
    },
    handleReduction(row, index) {
      if (row.newAdd) {
        this.columnData.splice(index, 1);
        this.updateTable();
      } else {
        this.$set(this.columnData, index, {
          ...this.currRow[row.id],
          isUpdate: 0,
        });
      }
    },
    // 删除列表事件
    handleDelete(row, index) {
      if (!row.id) return;
      this.$refs.confirmDialog.delete().then(() => {
        deleteOrderFreight(row.id).then(() => {
          this.columnData.splice(index, 1);
          this.updateTable();
        });
      });
    },
    judgeAllSave() {
      const index = this.columnData.findIndex((item) => item.isUpdate);
      if (index > -1) {
        return false;
      }
      return true;
    },
    getResult(rows) {
      //计算货物总数
      //this.grossTotalLists定义的要计算的参数
      //rows数据
      this.grossTotalLists[this.freightType].map((item) => {
        var total = 0;
        rows.map((result) => {
          if (item.compute) {
            total += multiplicationFn([
              result[item.factor[0].prop],
              result[item.factor[1].prop],
            ]);
          } else if (result[item.prop]) {
            total += result[item.prop];
          }
        });
        const unit = item.unit || "";
        if (item.decimal) {
          this.$set(item, "total", `${total.toFixed(item.decimal)}${unit}`);
        } else {
          this.$set(item, "total", `${total}${unit}`);
        }
      });
      console.log(this.grossTotalLists);
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .padding-class {
    .el-input__inner {
      padding-left: 8px;
      padding-right: 8px;
    }
  }
  .text-input-center {
    .el-input__inner {
      text-align: center;
    }
  }
  .text-input-right {
    .el-input__inner {
      text-align: right;
    }
  }
  .ellipsis-text {
    padding-right: 0px;
  }
  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .tableData .table-header-cell .cell {
    padding: 5px;
  }
}
</style>
