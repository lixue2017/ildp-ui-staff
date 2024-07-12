<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :columnData="columnData"
      :pagination="false"
      :paginationConfig="tableConfig.paginationConfig"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'takeInfo'">
          <template v-if="!slotProps.row.isUpdate">
            <el-row class="ellipsis-text">
              {{ slotProps.row.takeInfo }}
            </el-row>
          </template>
          <el-row class="ellipsis-text" v-show="slotProps.row.isUpdate">
            <AutoComplete
              :ref="`takeAutoComplete${slotProps.rowIndex}`"
              :formModel="slotProps.row"
              :fieldItem="{
                ...slotProps.column.fieldItem,
                handle: (item) => handleSelect(slotProps.row, item),
                handleCreate: handleCreate,
              }"
              size="mini"
              defaultKey="id"
              :additionalParam="{ customerId }"
            />
          </el-row>
        </template>
        <template v-if="slotProps.prop === 'freightCode'">
          <template v-if="!slotProps.row.isUpdate">
            <el-row class="ellipsis-text">
              {{ slotProps.row.freightCode || "--" }}
            </el-row>
          </template>
          <template v-else>
            <el-row class="ellipsis-text">
              <AutoComplete
                ref="takeAutoComplete"
                :formModel="slotProps.row"
                :fieldItem="{
                  id: 'freightCode',
                  size: 'mini',
                  placeholder: '请输入货物编码',
                  isBackAll: true,
                  httpRequest: getFreightList,
                  handle: (item) => handleFreightSelect(slotProps.row, item),
                  defaultProp: {
                    value: 'id',
                    label: 'freightCode',
                  },
                }"
                size="mini"
                defaultKey="id"
              />
            </el-row>
          </template>
        </template>
        <template v-if="slotProps.prop === 'takeFreightNum'">
          <template v-if="!slotProps.row.isUpdate">
            <el-row class="ellipsis-text">
              {{ slotProps.row.takeFreightNum || "--" }}
            </el-row>
          </template>
          <template v-else>
            <el-row class="ellipsis-text">
              <el-input-number
                v-model="slotProps.row[slotProps.prop]"
                size="mini"
                :min="1"
                :controls="false"
                v-input-number-limit="{
                  value: 0,
                  maxNumber: slotProps.column.colMax,
                }"
                :placeholder="slotProps.column[`label${freightType}`]"
              ></el-input-number>
            </el-row>
          </template>
        </template>
        <template v-if="slotProps.prop === 'presentTime'">
          <template v-if="!slotProps.row.isUpdate">
            <el-row class="ellipsis-text">
              {{ slotProps.row.presentTime || "--" }}
            </el-row>
          </template>
          <template v-else>
            <el-row class="ellipsis-text">
              <el-date-picker
                type="datetime"
                v-model="slotProps.row[slotProps.prop]"
                placeholder="到场时间"
                range-separator="-"
                value-format="yyyy/MM/dd HH:mm:ss"
              />
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
      <template v-slot:customHeader="{ slotProps }">
        <template v-if="slotProps.column.prop === 'takeFreightNum'">
          <div :class="slotProps.column.request && 'row-request'">
            {{ slotProps.column[`label${freightType}`] }}
          </div>
        </template>
      </template>
    </ComTable>
    <div class="grand-total">
      <template v-for="gross in grossTotal">
        <span :key="gross.prop">
          <span class="label">{{ gross.label }}</span>
          <!-- <span class="value">{{ tableTotal[gross.prop] }}</span> -->
          <span :class="`value ${gross.valClass}`">{{ gross.total }}</span>
        </span>
      </template>
    </div>
    <AddConsigneeDialog
      appendToBody
      ref="addConsignee"
      :extendParams="{
        customerId,
      }"
      @handleSuccess="handleAddSuccess"
    />
    <EditConsigneeDialog
      appendToBody
      ref="editConsignee"
      @handleSuccess="editConsigneeSuccess"
    />
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
<script>
import {
  getFreightList,
  getFreightTakeList,
  editOrderFreightTake,
  deleteOrderFreighttake,
  setOrderFreightTake,
} from "@/api/trandition/airTransport.js";
import { getConsigneeList } from "@/api/basicInfo/consignee.js";
import { tableColumns, handleRule, grossTotal } from "./model.js";
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
    customerId: {
      type: Number,
      default: 0,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    AddConsigneeDialog: () => import("_comp/ConsigneeDialog/AddDialog"),
    EditConsigneeDialog: () => import("_comp/ConsigneeDialog/EditDialog"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  data() {
    return {
      tableConfig: {
        httpRequest: this.getFreightTakeList,
        tableColumns,
        paginationConfig: {
          limit: 999,
        },
        operation: {
          0: [
            {
              label: "维护地址",
              handleClick: this.handleEditConsignee,
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
      iList: [],
      grossTotal,
    };
  },
  watch: {
    customerId(val) {
      this.getFreightTakeList();
    },
  },
  mounted() {
    this.getFreightTakeList();
  },
  methods: {
    // 获取提货信息列表
    getFreightTakeList() {
      return new Promise((resolve) => {
        getFreightTakeList({
          orderId: this.$route.query.id,
          freightType: this.freightType,
          orderType: this.formData.orderType,
          pageNum: 1,
          pageSize: 999,
        }).then((res) => {
          const newList = this.columnData.filter(
            (item) => !item.id && item.isUpdate
          );
          res.rows.map((item, i) => {
            const index = this.columnData.findIndex(
              (n) => n.id === item.id && n.isUpdate
            );
            if (index > -1) {
              newList.push({
                ...this.columnData[index],
              });
            } else {
              const { detailsAddr, contacts, phone } = item.cusConsignee || {};
              newList.push({
                ...item,
                isUpdate: 0,
                takeInfo: `${contacts}(${phone})`,
                address: detailsAddr,
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
    // 提货地址选中
    handleSelect(row, item) {
      console.log(item);
      const { consigneeId, detailsAddr, contacts, phone } = item || {};
      row.address = detailsAddr;
      row.takePeopleId = consigneeId;
      row.takeInfo = contacts ? `${contacts}(${phone})` : "";
    },
    // 新增提货地址弹框显示
    handleCreate() {
      this.$refs.addConsignee.show();
    },
    // 新增提货地址成功
    handleAddSuccess() {
      this.iList = [];
      this.columnData.forEach(
        (item, index) => item.isUpdate && this.iList.push(index)
      );
    },
    // 维护编辑提货地址
    handleEditConsignee(row) {
      this.takeId = row.id;
      this.$refs.editConsignee.show(
        {
          id: row.takePeopleId,
        },
        false
      );
    },
    // 编辑提货地址成功
    editConsigneeSuccess(res) {
      editOrderFreightTake({
        id: this.takeId,
        takePeopleId: res.data,
      }).then(() => {
        this.getFreightTakeList();
      });
    },
    // 更新提货地址下拉数据
    // renewConsignee() {
    // if (this.iList.length) {
    //   if (this.iList.length) {
    //     this.$refs[`takeAutoComplete${this.iList[0]}`].querySearchAsync();
    //     this.iList.splice(0, 1);
    //   }
    // }
    // },
    // 获取货物列表
    getFreightList(params) {
      const { id: orderId, orderType } = this.formData;
      return getFreightList({
        ...params,
        orderId,
        orderType,
        freightType: this.freightType,
      });
    },
    // 货物信息选中
    handleFreightSelect(row, item) {
      console.log(item);
      row.freightId = item.id;
      row.freightCode = item.freightCode;
      row.freightType = row.freightType;
      row.freightNum = item.packNum || item.boxNum;
      row.takeFreightNum = item.packNum || item.boxNum;
      // row.totalWeight = (item.boxWeight * item.boxCount).toFixed(2);
      // row.totalVolume = (item.boxVolume * item.boxCount).toFixed(2);
      row.totalWeight = item.totalWeight;
      row.totalVolume = item.totalVolume;
    },
    // 更新提货信息列表
    updateTable() {
      this.$refs.tableRef.setNewTableData(this.columnData);
    },
    // 添加行
    handleAddLine() {
      this.columnData = [
        {
          address: "",
          isUpdate: 1,
          newAdd: true,
        },
        ...this.columnData,
      ];
      this.updateTable();
    },
    handleSave(row) {
      const { id: orderId, orderType } = this.formData;
      const {
        freightCode,
        freightId,
        freightNum,
        takePeopleId,
        takeFreightNum,
        presentTime,
      } = row;
      // if (takeFreightNum > freightNum) {
      //   return this.$message.error(`提货箱数不可大于总箱数${freightNum}`);
      // }
      const isNo = handleRule(row);
      if (isNo) {
        return this.$message.error(isNo);
      }
      let params = {
        freightCode,
        freightId: freightId || null,
        freightNum,
        freightType: this.freightType,
        orderId,
        orderType,
        takeFreightNum: takeFreightNum || null,
        takePeopleId,
        presentTime,
      };
      let reqs = setOrderFreightTake;
      if (row.id) {
        params.id = row.id;
        reqs = editOrderFreightTake;
      } else {
        params = [params];
      }
      reqs(params)
        .then(() => {
          row.isUpdate = 0;
          this.getFreightTakeList();
        })
        .catch((err) => {
          if (err?.msg) {
            this.$message.error(err.msg);
          }
        });
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
        deleteOrderFreighttake(row.id).then(() => {
          this.columnData.splice(index, 1);
          this.getResult(this.columnData);
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
      //this.grossTotal定义的要计算的参数
      //rows数据
      this.grossTotal.map((item) => {
        var total = 0;
        rows.map((result) => {
          if (item.compute) {
            total += result[item.factor[0].prop] * result[item.factor[1].prop];
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
    },
  },
};
</script>
<style lang="scss" scoped></style>
