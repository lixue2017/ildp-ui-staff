<template>
  <div>
    <div class="title">
      <span>运费</span>
      <span class="subtitle">* 利润用原币种计算</span>
    </div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumns"
      :columnData="columnData"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'title'">
          <template v-if="slotProps.rowIndex === 0">批量改价：</template>
          <template v-else>
            <div>
              <span class="company-name">{{
                slotProps.row.shipCompanyName ||
                slotProps.row.airShipCompanyName
              }}</span>
              <span
                >{{
                  slotProps.row.voyage || slotProps.row.sailingSchedule
                }}天</span
              >
            </div>
          </template>
        </template>
        <template v-else-if="['quantity', 'remark'].includes(slotProps.prop)">
          <FormSingle
            :formData="slotProps.row"
            :fieldItem="{
              id: slotProps.prop,
              placeholder: slotProps.column.label,
              ...slotProps.column.fieldItem,
            }"
            v-if="slotProps.rowIndex !== 0"
          />
        </template>
        <template v-else-if="slotProps.row[slotProps.prop]">
          <template v-if="slotProps.rowIndex === 0">
            <el-input-number
              v-model="slotProps.row[slotProps.prop].profit"
              controls-position="right"
              size="small"
              :max="999999.99"
              :min="-999999.99"
              placeholder="增加或减少利润"
              v-input-number-limit="2"
              @change="(val) => handleProfitChange(val, slotProps.prop)"
              v-if="changePriceType === 1"
            />
            <div v-else class="base-flex-between">
              <el-input-number
                v-model="slotProps.row[slotProps.prop].profit"
                controls-position="right"
                size="small"
                :max="1000"
                :min="-100"
                placeholder="增加或减少利润"
                v-input-number-limit="2"
                @change="(val) => handleProfitChange(val, slotProps.prop)"
              />
              <span style="min-width: 18px; text-align: right"> % </span>
            </div>
            <!-- <el-input
              v-model="slotProps.row[slotProps.prop].profit"
              type="number"
              placeholder="增加或减少利润"
              :maxlength="11"
              size="small"
              class="profit-input"
              @change="(val) => handleProfitChange(val, slotProps.prop)"
              v-else
            >
              <template slot="append"> % </template>
            </el-input> -->
          </template>

          <div class="profit" v-else>
            <el-checkbox
              v-model="slotProps.row[slotProps.prop].customerQuotation"
              >{{
                slotProps.row[slotProps.prop].price ||
                slotProps.row[slotProps.prop].unitPrice
              }}</el-checkbox
            >
            <span> + </span>
            <el-input-number
              v-model="slotProps.row[slotProps.prop].profit"
              controls-position="right"
              size="small"
              :max="999999.99"
              :min="-999999.99"
              v-input-number-limit="2"
              v-if="changePriceType === 1"
            />
            <div v-else class="base-flex-between">
              <el-input-number
                v-model="slotProps.row[slotProps.prop].profit"
                controls-position="right"
                size="small"
                :max="1000"
                :min="-100"
                v-input-number-limit="2"
              />
              <span style="min-width: 18px; text-align: right"> % </span>
            </div>
            <!-- <el-input
              v-model="slotProps.row[slotProps.prop].profit"
              type="number"
              :maxlength="11"
              size="small"
              class="profit-input"
              v-else
            >
              <template slot="append"> % </template>
            </el-input> -->
          </div>
        </template>
        <template v-else>--</template>
      </template>
      <template v-slot:customHeader="{ slotProps }">
        <el-checkbox
          v-model="headCheck[slotProps.column.prop]"
          :checked="true"
          @change="(val) => handleSelect(val, slotProps.column.prop)"
          >{{ slotProps.column.label }}</el-checkbox
        >
      </template>
    </ComTable>
  </div>
</template>

<script>
import { tableColumns } from "./model";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
  },
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    changePriceType: {
      type: Number,
      default: 1,
    },
    quantity: {
      type: [String, Number],
      default: undefined,
    },
  },
  data() {
    const {
      boxModelIds,
      boxModelName,
      packingMode,
      freightRateSettingList = [],
    } = this.formData;
    return {
      cabinetList: [{ isNew: 1 }],
      tableColumns: tableColumns(packingMode, boxModelName),
      columnData: freightRateSettingList,
      packingMode: packingMode,
      boxModel: {
        ids: boxModelIds,
        name: boxModelName,
      },
      cabinetArr: [],
      additionalCharge: true,
      headCheck: {},
    };
  },
  watch: {
    quantity(val) {
      // console.log(val);
      this.handleQuantityChange(val, "priceTable");
    },
  },
  mounted() {
    setTimeout(() => {
      (this.formData.boxModelName || []).forEach((ele) => {
        this.handleSelect(true, ele);
      });
    }, 600);
  },
  methods: {
    getTableData() {
      return this.$refs.tableRef?.getNewTableData();
    },
    getSaveList() {
      const { name: boxModelName } = this.boxModel;
      const detailList = [];
      const lists = this.getTableData();
      let err = "";
      lists.forEach((item) => {
        if (err) return;
        if (item.id) {
          const nameArr = boxModelName?.length ? boxModelName : ["priceTable"];
          nameArr.forEach((key) => {
            if (item[key] && item[key].customerQuotation) {
              const { id: freightRateId, quantity, num, remark } = item;
              // !item[key].quantity && !item[key].num
              if (this.packingMode && !quantity && !num) {
                err = "运费选中费用数量必填！";
                return;
              }
              detailList.push({
                freightRateId,
                ...item[key],
                profit: item[key].profit || 0,
                quantity: quantity || num,
                remark,
              });
            }
          });
        }
      });
      if (err) {
        this.$message.error(err);
        return false;
      }
      return detailList;
    },
    handleProfitChange(val, prop) {
      const tableData = this.getTableData();
      const list = tableData.map((item) => {
        if (item[prop]) {
          return {
            ...item,
            [prop]: {
              ...item[prop],
              profit: val,
            },
          };
        } else {
          return item;
        }
      });
      this.$refs.tableRef.setNewTableData(list);
    },
    handleSelect(val, prop) {
      const tableData = this.getTableData() || [];
      const list = tableData.map((item) => {
        if (item[prop]) {
          return {
            ...item,
            [prop]: {
              ...item[prop],
              customerQuotation: val,
            },
          };
        } else {
          return item;
        }
      });
      this.$refs.tableRef?.setNewTableData(list);
    },
    handleQuantityChange(val, prop) {
      const tableData = this.getTableData();
      const list = tableData.map((item) => ({
        ...item,
        quantity: val,
      }));
      this.$refs.tableRef.setNewTableData(list);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 13px;
  font-weight: bold;
}
/deep/ {
  .el-input-group__append {
    width: 25px;
  }
}
.company-name {
  margin-right: 10px;
}
.profit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /deep/ {
    .el-input-number {
      width: 98px;
    }
    .el-input {
      width: 98px;
    }
  }
}
.profit-input {
  /deep/ .el-input__inner {
    padding-left: 12px;
    padding-right: 0;
  }
}
.additional-charge {
  margin-top: 17px;
  text-align: right;
}
.subtitle {
  font-size: 12px;
  font-weight: 400;
  margin-left: 5px;
  color: #5094ff;
}
</style>
