<template>
  <div>
    <!-- 海外报价 -->
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumns"
      :columnData="columnData"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'priceTable'">
          <template v-if="slotProps.rowIndex === 0">
            <el-input-number
              v-model="slotProps.row.profit"
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
                v-model="slotProps.row.profit"
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
              v-model="slotProps.row.profit"
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
            <el-checkbox v-model="slotProps.row.customerQuotation">{{
              slotProps.row.unitPrice
            }}</el-checkbox>
            <span> + </span>
            <el-input-number
              v-model="slotProps.row.profit"
              controls-position="right"
              size="small"
							:max="999999.99"
              :min="-999999.99"
							v-input-number-limit="2"
              v-if="changePriceType === 1"
            />
            <div v-else class="base-flex-between">
              <el-input-number
                v-model="slotProps.row.profit"
                controls-position="right"
                size="small"
                :max="1000"
                :min="-100"
                v-input-number-limit="2"
              />
              <span style="min-width: 18px; text-align: right"> % </span>
            </div>
            <!-- <el-input
              v-model="slotProps.row.profit"
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
        <template v-if="['quantity', 'remark'].includes(slotProps.prop)">
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
  },
  data() {
    const { foreignQuotationSheetList } = this.formData;
    return {
      tableColumns: tableColumns,
      columnData: [
        {
          profit: undefined,
        },
        ...foreignQuotationSheetList.map((item) => ({
          ...item,
          quantity: item.num || 1,
          customerQuotation: true,
        })),
      ],
    };
  },
  methods: {
    getTableData() {
      return this.$refs.tableRef.getNewTableData();
    },
    getSaveList() {
      const detailList = [];
      const lists = this.getTableData();
      let err = "";
      lists.forEach((item) => {
        const { customerQuotation, ...data } = item;
        if (customerQuotation) {
          if (!data.quantity) {
            err = "海外报价选中费用数量必填！";
            return;
          }
          detailList.push({ ...data, profit: data.profit || 0 });
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
      const list = tableData.map((item) => ({
        ...item,
        profit: val,
      }));
      this.$refs.tableRef.setNewTableData(list);
      console.log(tableData, val, prop);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
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
</style>
