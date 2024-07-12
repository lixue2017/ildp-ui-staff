<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :columnData="columnData"
      :pagination="false"
      defaultExpandAll
      :paginationConfig="tableConfig.paginationConfig"
      @handleChange="handleChange"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'operation'">
          <el-button
            v-if="slotProps.row.deleted"
            type="text"
            @click="handleRecovery(slotProps.row, slotProps.rowIndex)"
          >
            恢复
          </el-button>
          <template v-else>
            <el-button
              v-for="(btn, i) in operation"
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
        <template v-else-if="slotProps.prop === 'expand'">
          <template v-for="(item, index) in slotProps.row.cusProducts">
            <ProductsItem
              :index="index"
              :productsLen="slotProps.row.cusProducts.length"
              :formData="item"
              :disabled="!!slotProps.row.deleted"
              :key="`${item.temp_only_key || ''}_${item.id || ''}_${
                item.detailId || ''
              }`"
              :isVer="true"
              @handleSelectProduct="
                (obj) => handleSelectProduct(obj, slotProps.rowIndex, index)
              "
              @handleAddProduct="handleAddProduct(slotProps.row, index)"
              @handleDeleteProduct="handleDeleteProduct(slotProps.row, index)"
            />
          </template>
        </template>
        <template v-else>
          <template v-if="slotProps.prop === 'shipmentId'">
            <div class="tag delete" v-if="slotProps.row.deleted">删</div>
            <div
              class="tag new"
              v-if="!slotProps.row.deleted && slotProps.row.isNew"
            >
              新
            </div>
          </template>
          <FormSingle
            :formData="slotProps.row"
            :fieldItem="{
              id: slotProps.prop,
              placeholder: slotProps.column.label,
              ...slotProps.column.fieldItem,
              ...(slotProps.prop === 'consigneeWarehouseId'
                ? {
                    handleCreate: addAddress,
                    refreshRequest,
                    id: !!slotProps.row.deleted
                      ? 'consigneeWarehouseCode'
                      : 'consigneeWarehouseId',
                    additionalParam: {
                      countryId,
                      ...destinationTypeParams(),
                    },
                  }
                : {}),
            }"
            :disabled="
              !!slotProps.row.deleted ||
              !['warehousingBoxNum', 'consigneeWarehouseId'].includes(
                slotProps.prop
              )
            "
            @handleChange="(...data) => handleChange(...data, slotProps.row)"
          />
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
    <AddDialog
      ref="addDialogRef"
      @handleSuccess="handleChangeDestination"
      :appendToBody="true"
    />
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
<script>
import { tableColumns_ver, handleRule, grossConfig } from "./model.js";
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
    goodsRows: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
    AddDialog: () => import("_comp/PrivateWarehouseDialog/AddDialog/index.vue"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    ProductsItem: () => import("./ProductsItem"),
  },
  data() {
    return {
      grossConfig,
      grossTotal: {},
      tableConfig: {
        tableColumns: tableColumns_ver,
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
      columnData: this.goodsRows || [],
      addId: 0,
      refreshRequest: true,
    };
  },
  computed: {
    ...mapState({
      userCustomerId: (state) => state.user.userInfo?.customerId,
    }),
  },
  mounted() {
    setTimeout(() => {
      this.getResult();
    });
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
          cusProducts: [
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
      const { operationOrderId, freightType, id: orderEcId } = this.formModel;
      const freghtList = [];
      for (let index = 0; index < list.length; index++) {
        const row = list[index];
        const msg = handleRule(row, true);
        if (msg) {
          this.msgError(`货物信息列表，第${index + 1}行${msg}！`);
          return false;
        }
        const { addId, temp_secondId, cusProducts, ...obj } = row;
        obj.boxNumber = this.getBoxNo(obj);
        obj.freightProductDtoList = cusProducts;
        freghtList.push({
          ...obj,
          operationOrderId,
          orderType: 2,
          freightType,
          orderEcId,
        });
      }
      return freghtList;
    },
    getBoxNo(formModel) {
      const { shipmentId = "", warehousingBoxNum } = formModel;
      let num = "00000";
      let boxNumber = shipmentId;
      if (warehousingBoxNum) {
        if (warehousingBoxNum > 1) {
          num =
            num.substring(0, 5 - (warehousingBoxNum + "").length) +
            warehousingBoxNum;
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
      const { addId, temp_secondId, id, ...obj } = row;
      list.unshift({
        ...obj,
        cusProducts: row.cusProducts.map((item, i) => ({
          ...item,
          temp_only_key: Math.random() + i + "",
        })),
      });
      this.columnData = list;
      this.updateTable();
    },
    // 删除列表事件
    handleDelete(row, index) {
      const list = this.$refs.tableRef?.getNewTableData() || [];
      if (row.id) {
        list[index].deleted = 1;
      } else {
        list.splice(index, 1);
      }
      this.columnData = list;
      this.updateTable();
    },
    handleRecovery(row, index) {
      row.deleted = 0;
      this.getResult();
    },
    getResult() {
      //计算货物总数
      const list = this.$refs.tableRef?.getNewTableData() || [];
      const boxCounts = [];
      const weights = [];
      const volumes = [];
      list.forEach((item) => {
        if (!item.deleted && item.warehousingBoxNum) {
          boxCounts.push(item.warehousingBoxNum);
          if (item.warehousingWeight) {
            weights.push(
              multiplicationFn(
                [item.warehousingBoxNum, item.warehousingWeight],
                2
              )
            );
          }
          if (item.warehousingVolume) {
            volumes.push(
              multiplicationFn(
                [item.warehousingBoxNum, item.warehousingVolume],
                2
              )
            );
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
      if (["warehousingBoxNum", "warehousingWeight"].includes(prop)) {
        this.getResult();
      } else if (
        ["warehousingLength", "warehousingWidth", "warehousingHeight"].includes(
          prop
        )
      ) {
        const {
          warehousingLength = 0,
          warehousingWidth = 0,
          warehousingHeight = 0,
        } = row;
        row.warehousingVolume = dividedFn(
          multiplicationFn([
            warehousingLength,
            warehousingWidth,
            warehousingHeight,
          ]),
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
      list[pIndex].cusProducts[index] = {
        ...list[pIndex].cusProducts[index],
        ...obj,
      };
      this.columnData = list;
      this.updateTable();
    },
    handleAddProduct(row, productIndex) {
      row.cusProducts.splice(productIndex + 1, 0, {
        temp_only_key: Math.random() + "",
      });
    },
    handleDeleteProduct(row, productIndex) {
      row.cusProducts.splice(productIndex, 1);
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
.tag {
  font-size: 12px;
  width: 40px;
  height: 17px;
  line-height: 17px;
  text-align: center;
  position: absolute;
  left: -50px;
  top: 0;
  border-radius: 0px 0px 19px 0px;
  color: #fff;

  &.delete {
    background: #f59ead;
  }
  &.new {
    background: #96dcb7;
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
