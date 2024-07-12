<template>
  <div class="detail-table">
    <!-- LCL/FCL信息 -->
    <OrderTraditionGoodsTable ref="goodsRef" :formModel="formModel" />

    <template v-for="(item, index) in table">
      <div :key="index" v-if="item.colIndex !== 1 || formModel.isHomeDelivery">
        <div class="tit-box base-flex-between">
          <div class="tit-left">{{ item.cols.title }}</div>
        </div>
        <ComTable
          :ref="`tableConfig${item.colIndex}`"
          :columnConfig="item.cols.columns"
          :httpRequest="(params) => handleRequest(item.colIndex, params)"
          :getQueryParams="getQueryParams"
          :pagination="false"
          @getResult="(obj) => getResult(item.colIndex, obj)"
          :tableHeight="tableAutoHeight(item.colIndex)"
        >
        </ComTable>
        <div class="grand-total">
          <span>合计：</span>
          <template v-for="gross in item.cols.grossTotal">
            <span :key="gross.prop">
              <span class="label">{{ gross.label }}</span>
              <span class="value"
                >{{
                  toFixedNum(
                    grossTotal[item.colIndex][gross.prop],
                    gross.decimal || 0
                  )
                }}
                {{ gross.util || "" }}</span
              >
            </span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getSeaTraditionFreightTakeList } from "@/api/trandition/oceanModel";
import { accumulationFn, multiplicationFn } from "@/utils/instructions";
import { fclPickGoodsInfo, lclPickGoodsInfo } from "./model";
export default {
  props: {
    formModel: {
      type: Object,
      default: () => {
        return {
          encasementWay: 1,
          pickUpHome: false,
        };
      },
    },
  },
  data() {
    return {
      table: [],
      tableTotalArr: [0, 0], // 计算表格高度
      tableData: [],
      grossTotal: {
        0: {},
        1: {},
      },
    };
  },
  created() {
    const { freightType, orderType } = this.formModel;
    if (orderType === 3) {
      //海运
      if (freightType == "0") {
        this.table = [
          {
            colIndex: 1,
            cols: fclPickGoodsInfo,
          },
        ];
      } else {
        this.table = [
          {
            colIndex: 1,
            cols: lclPickGoodsInfo,
          },
        ];
      }
    } else if (orderType === 4) {
      // 空运
      this.table = [
        {
          colIndex: 1,
          cols: lclPickGoodsInfo,
        },
      ];
    } else if (orderType === 5) {
      // 拖车
      this.table = [
        {
          colIndex: 1,
          cols: fclPickGoodsInfo,
        },
      ];
    }
  },
  methods: {
    handleRequest(index, params) {
      const reqs = {
        1: getSeaTraditionFreightTakeList,
      };
      return new Promise((resolve, reject) => {
        reqs[index](params).then((res) => {
          return resolve(res);
        });
      });
    },
    getQueryParams() {
      const { orderType, id } = this.formModel;
      return {
        orderId: id,
        orderType,
      };
    },
    getResult(index, { total, tableData }) {
      this.$set(this.tableTotalArr, index, total);
      this.grossTotal[index] = {
        takeFreightNum: accumulationFn(tableData.map((e) => e.takeFreightNum)),
        totalWeight: accumulationFn(
          tableData.map((r) => multiplicationFn([r.takeFreightNum, r.weight]))
        ),
      };
    },
    tableAutoHeight(idx) {
      return this.tableTotalArr[idx] > 9 ? `${10 * 39 + 54}px` : undefined;
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    OrderTraditionGoodsTable: () =>
      import(
        "@/views/operateManage/components/orderGoodsTable/orderTraditionGoods.vue"
      ),
  },
};
</script>

<style lang="scss" scoped>
.detail-table {
  .tit-box {
    .tit-left {
      font-size: 14px;
      font-weight: bold;
      line-height: 22px;
      padding: 14px 0 11px;
      color: #515151;
    }
    .radio {
      font-size: 13px;
      .el-radio {
        margin-right: 6px;
      }
      /deep/ {
        .el-radio__label {
          padding-left: 0;
        }
      }
    }
    .checkbox {
      font-size: 13px;
      padding-left: 35px;
    }
  }
}
</style>
