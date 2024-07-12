<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :columnData="columnData"
      :pagination="false"
      :paginationConfig="tableConfig.paginationConfig"
      defaultExpandAll
      @handleChange="handleChange"
      @getResult="getResult"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'consigneeWarehouseId'">
          <AutoComplete
            :formModel="slotProps.row"
            :fieldItem="{
              ...slotProps.column.fieldItem,
              handleCreate: addAddress,
              refreshRequest,
              handle: (val) => handleChange(val, slotProps.prop, slotProps.row),
            }"
            :additionalParam="{
              countryId,
              ...destinationTypeParams(),
            }"
            size="mini"
          />
        </template>
        <template v-if="slotProps.prop === 'operation'">
          <template v-for="(btn, i) in operation">
            <el-button
              class="operation-btn"
              :key="i"
              :type="btn.type"
              circle
              @click="btn.handleClick(slotProps.row, slotProps.rowIndex)"
            >
              <i :class="btn.icon"></i>
            </el-button>
          </template>
        </template>
        <template v-if="slotProps.prop === 'expand'">
          <template v-for="(item, index) in slotProps.row.productList">
            <ProductsItem
              :index="index"
              :productsLen="slotProps.row.productList.length"
              :formData="item"
              :key="`${item.temp_only_key || ''}_${item.id || ''}_${
                item.detailId || ''
              }`"
              @handleSelectProduct="
                (obj) => handleSelectProduct(obj, slotProps.rowIndex, index)
              "
              @handleAddProduct="handleAddProduct(slotProps.row, index)"
              @handleDeleteProduct="handleDeleteProduct(slotProps.row, index)"
            />
          </template>
        </template>
      </template>
    </ComTable>
    <div class="grand-total">
      <template v-for="gross in grossConfig">
        <span :key="gross.prop">
          <span class="label">{{ gross.label }}</span>
          <!-- <span class="value">{{ tableTotal[gross.prop] }}</span> -->
          <span :class="`value ${gross.valClass}`">{{
            toFixedNum(grossTotal[gross.prop], gross.decimal)
          }}</span>
          <span>{{ gross.unit }}</span>
        </span>
      </template>
    </div>
    <AddDialog ref="addDialogRef" @handleSuccess="handleChangeDestination" />
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
<script>
import {} from "@/api/order/firstTransport.js";
import { getConsigneeList } from "@/api/basicInfo/consignee.js";
import { tableColumns, handleRule, grossConfig } from "./model.js";
import {
  multiplicationFn,
  accumulationFn,
  dividedFn,
} from "@/utils/instructions";
import { mapState } from "vuex";
export default {
  props: {
    countryId: {
      type: [Number, String],
      default: () => null,
    },
    formModel: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    AddDialog: () => import("_comp/PrivateWarehouseDialog/AddDialog/index.vue"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    ProductsItem: () => import("./ProductsItem"),
  },
  data() {
    return {
      grossConfig,
      grossTotal: {},
      tableConfig: {
        tableColumns,
        paginationConfig: {
          limit: 999,
        },
      },
      operation: [
        {
          type: "primary",
          icon: "iconfont fuzhi2",
          color: "#FF6767",
          circle: true,
          // text: "复制",
          handleClick: this.handleCopy,
        },
        {
          type: "danger",
          icon: "el-icon-minus",
          color: "#FF6767",
          circle: true,
          handleClick: this.handleDelete,
        },
      ],
      columnData: [],
      addId: 0,
      refreshRequest: true,
      deleteFreghtIdList: [],
      deleteProductIdList: [],
    };
  },
  watch: {
    "formModel.encasementWay"(val) {
      const list = this.$refs.tableRef?.getNewTableData() || [];
      if (val == 1 && list.length > 1) {
        const { consigneeWarehouseId, consigneeWarehouseCode } = list[0];
        this.columnData = list.map((item) => ({
          ...item,
          consigneeWarehouseId,
          consigneeWarehouseCode,
        }));
        this.updateTable();
      }
    },
    "formModel.outWarehouseWay"(val) {
      const list = this.$refs.tableRef?.getNewTableData() || [];
      if (val == 50 && list.length > 1) {
        const { consigneeWarehouseId, consigneeWarehouseCode } = list[0];
        this.columnData = list.map((item) => ({
          ...item,
          consigneeWarehouseId,
          consigneeWarehouseCode,
        }));
        this.updateTable();
      }
    },
  },
  computed: {
    ...mapState({
      userCustomerId: (state) => state.user.userInfo?.customerId,
    }),
  },
  created() {
    if (this.formModel.freghtList && this.formModel.freghtList.length) {
      this.columnData = this.formModel.freghtList.map((item) => {
        const { productList, ...obj } = item;
        if (!productList || !productList.length) {
          obj.productList = [
            {
              temp_only_key: Math.random() + "",
              newProductAdd: true,
            },
          ];
        } else {
          obj.productList = [...productList];
        }
        return obj;
      });
    }
  },
  methods: {
    // 目的仓过滤条件
    destinationTypeParams() {
      // LCL尾程为一件代发、存仓上架、自提时，只能选自建仓
      const isZjc =
        this.formModel.encasementWay == "1" &&
        ["20", "30", "40"].includes(this.formModel.outWarehouseWay);
      if (isZjc) {
        return {
          typeList: "2",
        };
      }
      const { headTransportMode, outWarehouseWay } = this.formModel;
      return {
        typeList: "0,1,2,3,4",
        includTypeList: "0,1,2,3",
        headTransportMode,
        outWarehouseWay,
        customerId: this.userCustomerId,
      };
    },
    // 添加目的地
    addAddress() {
      this.$refs.addDialogRef.show({ nationId: this.countryId });
    },
    // 更新目的仓下拉数据
    handleChangeDestination() {
      this.refreshRequest = !this.refreshRequest;
    },
    // 更新提货信息列表
    updateTable() {
      this.$refs.tableRef?.setNewTableData(this.columnData);
      this.getResult();
    },
    // 添加行
    handleAddLine() {
      this.addId += 1;
      this.columnData = [
        {
          boxVolume: undefined,
          addId: this.addId,
          productList: [
            {
              temp_only_key: Math.random() + "",
              newProductAdd: true,
            },
          ],
        },
        ...this.columnData,
      ];
      this.updateTable();
    },
    handleSave() {
      const list = this.$refs.tableRef?.getNewTableData() || [];
      if (!list.length) {
        this.msgError("货物信息列表不能为空");
        return false;
      }
      const freghtList = [];
      for (let index = 0; index < list.length; index++) {
        const row = list[index];
        const msg = handleRule(row);
        if (msg) {
          this.msgError(`货物信息列表，第${index + 1}行${msg}！`);
          return false;
        }
        const { addId, temp_secondId, consigneeWarehouseCode, ...obj } = row;
        obj.consigneeWarehouseCode = (consigneeWarehouseCode || "").split(
          "/"
        )[0];
        obj.boxNumber = this.getBoxNo(obj);
        freghtList.push(obj);
      }
      return {
        freghtList,
        deleteFreghtIdList: this.deleteFreghtIdList,
        deleteProductIdList: this.deleteProductIdList,
      };
    },
    getBoxNo(formModel) {
      const { shipmentId = "", boxCount } = formModel;
      let num = "00000";
      let boxNumber = shipmentId;
      if (boxCount) {
        if (boxCount > 1) {
          num = num.substring(0, 5 - (boxCount + "").length) + boxCount;
          boxNumber = `${shipmentId || ""}00001~${num}`;
        } else {
          boxNumber = `${shipmentId || ""}00001`;
        }
      }
      formModel.boxNumber = boxNumber;
      return boxNumber;
    },
    // 复制列表事件
    handleCopy(row) {
      const list = this.$refs.tableRef?.getNewTableData() || [];
      const { addId, temp_secondId, id, productList, ...obj } = row;
      list.unshift({
        ...obj,
        productList: productList.map((item, i) => ({
          ...item,
          temp_only_key: Math.random() + i + "",
        })),
      });
      this.columnData = list;
      this.updateTable();
    },
    // 删除列表事件
    handleDelete(row, index) {
      if (row.id) {
        this.deleteFreghtIdList.push(row.id);
      }
      const list = this.$refs.tableRef?.getNewTableData() || [];
      list.splice(index, 1);
      this.columnData = list;
      this.updateTable();
    },
    getResult(res) {
      //计算货物总数
      const list =
        (res && res.tableData) || this.$refs.tableRef?.getNewTableData() || [];
      const boxCounts = [];
      const weights = [];
      const volumes = [];
      list.forEach((item) => {
        if (item.boxCount) {
          boxCounts.push(item.boxCount);
          if (item.boxWeight) {
            weights.push(multiplicationFn([item.boxCount, item.boxWeight], 2));
          }
          if (item.boxVolume) {
            volumes.push(multiplicationFn([item.boxCount, item.boxVolume], 2));
          }
        }
      });
      this.grossTotal = {
        totalBoxCount: accumulationFn(boxCounts, 0),
        totalVolume: accumulationFn(volumes, 2),
        totalWeight: accumulationFn(weights, 2),
      };
    },
    handleChange(val, prop, row) {
      if (["boxCount", "boxWeight"].includes(prop)) {
        this.getResult();
      } else if (["boxLength", "boxWidth", "boxHeight"].includes(prop)) {
        const { boxLength = 0, boxWidth = 0, boxHeight = 0 } = row;
        row.boxVolume = dividedFn(
          multiplicationFn([boxLength, boxWidth, boxHeight]),
          6
        );
        this.getResult();
      } else if (
        prop === "consigneeWarehouseId" &&
        (this.formModel.encasementWay == 1 ||
          this.formModel.outWarehouseWay == 50)
      ) {
        const list = this.$refs.tableRef?.getNewTableData() || [];
        this.columnData = list.map((item) => ({
          ...item,
          consigneeWarehouseId: val.value,
          consigneeWarehouseCode: val.label,
        }));
        this.updateTable();
      }
    },
    handleSelectProduct(obj, pIndex, index) {
      const list = this.$refs.tableRef?.getNewTableData() || [];
      list[pIndex].productList[index] = {
        ...list[pIndex].productList[index],
        ...obj,
      };
      this.columnData = list;
      this.updateTable();
    },
    handleAddProduct(row, productIndex) {
      row.productList.splice(productIndex + 1, 0, {
        temp_only_key: Math.random() + "",
      });
    },
    handleDeleteProduct(row, productIndex) {
      const { id } = row.productList[productIndex];
      if (id) {
        this.deleteProductIdList.push(id);
      }
      row.productList.splice(productIndex, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .el-table__cell.is-right {
    .el-input__inner {
      text-align: right;
    }
  }
  .el-table__cell.is-center {
    .el-input__inner {
      text-align: center;
    }
  }
  .el-input--suffix .el-input__inner {
    padding-left: 10px;
  }
  .el-input-number.is-without-controls .el-input__inner {
    padding: 0 10px;
  }
}
.operation-btn {
  width: 18px;
  height: 18px;
  padding: 0;

  i,
  .iconfont {
    font-size: 12px;
  }
}
.product-item {
  &:not(:last-child) {
    margin-bottom: 2px;
  }
}
</style>
