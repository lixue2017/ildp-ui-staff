<template>
  <ComDialog
    ref="detailDialogRef"
    :customDialog="detailDialogConfig"
    :confirmClose="false"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="detailFormConfig"
        class="dialog-form"
        v-if="
          $refs.detailDialogRef && $refs.detailDialogRef.dialogVisible
        "
      >
      </ComForm>

      <p class="cargo-tit-txt">当前托盘货物明细</p>
      <ComTable
        :ref="`detailTableRef`"
        :columnConfig="tableTabConfig()"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="getTableQueryParams"
        :paginationConfig="{ limit: 999 }"
        :pagination="false"
        :isMountedRequest="false"
        @getResult="getTableResult"
      />
			
      <div :class="['base-flex-center', 'table-subtotal']">
        <div class="subtotal-tit">合计：</div>
        <div v-for="(item, i) in tableTotalArr" :key="i" class="subtotal-des">
          <span class="subtotal-label">{{ item.label }}</span>
          <span class="subtotal-num">{{
            i === 2 ? toFixedNum(item.value) : item.value
          }}</span>
        </div>
      </div>
    </template>
  </ComDialog>
</template>

<script>
import { warehouseTrayFreightList } from "@/api/warehouse/manage";
import { duplicateRemoval } from "@/utils/index";
import { accumulationFn } from "@/utils/instructions";
import { detailFromCols, detailTableColumns, tableTotalArr } from "./model";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      detailDialogConfig: {
        width: "800px",
        title: "详情",
        useFooter: "footer",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.detailDialogRef.handleClose();
            },
          },
        ],
      },
      detailFormConfig: {
        formModel: {},
        size: "small",
        labelWidth: "80px",
        lists: detailFromCols(),
        formRules: {},
      },
      tableConfig: {
        httpRequest: warehouseTrayFreightList,
      },
      tableTotalArr,
    };
  },
  methods: {
    detailShow(row = {}) {
      this.detailFormConfig.formModel = {
        ...row,
      };
      this.$refs.detailDialogRef.show();
      this.$nextTick(() => {
        this.$refs[`detailTableRef`]?.refreshTable();
      });
    },
    getTableResult({ tableData }) {
      this.tableTotalArr.forEach((e, idx) => {
        e.value = this.accumulation(tableData, e.key);
      });
    },
    accumulation(arr = [], key) {
      if (key === "total_xs") {
        return arr.length;
      }
      if (key === "orderNum") {
        return duplicateRemoval(arr, key).length;
      }
			return accumulationFn(arr.map(e => e[key]))
    },
    tableTabConfig() {
      return detailTableColumns();
    },
    getTableQueryParams() {
      const { customerId, trayNum: trayNumber } =
        this.detailFormConfig.formModel;
      return {
        customerId,
        trayNumber,
      };
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.tag-green-color {
  margin-right: 5px;
}
.cargo-tit-txt {
  margin-bottom: 15px;
  padding-top: 20px;
  font-weight: 500;
  border-top: 1px solid $divisionBorder;
}
</style>
