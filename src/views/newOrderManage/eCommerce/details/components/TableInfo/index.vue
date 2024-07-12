<template>
  <div class="detail-table">
    <!-- <div @click="() => reUpdate([0])">xxxxxxx</div> -->
    <template v-for="(item, index) in table">
      <div :key="index" v-if="item.colIndex === 0">
        <!-- 预报与核实货物信息 -->
        <OrderEcGoodsTable ref="goodsRef" :formModel="formModel" />
      </div>
      <div :key="index" v-else>
        <div class="title" v-if="item.colIndex !== 2 || formModel.pickUpHome">
          <div class="title-left">{{ item.cols.title }}</div>
        </div>
        <!-- 0货物信息 1整柜信息   2提货信息  3产品信息 -->
        <!-- pickUpHome是否上门提货  pickUpHome：0整柜 1散货 -->
        <ComTable
          :ref="`tableConfig${item.colIndex}`"
          v-if="item.colIndex !== 2 || formModel.pickUpHome"
          :columnConfig="item.cols.columns"
          :httpRequest="(params) => handleRequest(item.colIndex, params)"
          :getQueryParams="() => getQueryParams(item.colIndex)"
          :pagination="false"
          @getResult="(obj) => getTableResult(item.colIndex, obj)"
          :tableHeight="tableAutoHeight(item.colIndex)"
        ></ComTable>
        <div
          class="grand-total"
          v-if="item.colIndex !== 2 || formModel.pickUpHome"
        >
          <template v-for="gross in item.cols.grossTotal">
            <span :key="gross.prop">
              <span class="label">{{ gross.label }}</span>
              <span class="value">
                {{
                  toFixedNum(
                    grossTotal[item.colIndex][gross.prop],
                    gross.decimal || 0
                  )
                }}
                {{ gross.util && gross.util }}</span
              >
            </span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {
  getTakeList,
  getEcBoxList,
  getFreightProductList,
} from "@/api/order/firstTransport.js";
import { accumulationFn } from "@/utils/instructions";
import productDefaultLogo from "@/assets/image/product_default.svg";
import { goodsTable, cabinetTable, pickTable, productTable } from "./model";
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
  components: {
    ComTable: () => import("_comp/ComTable"),
    OrderEcGoodsTable: () =>
      import(
        "@/views/operateManage/components/orderGoodsTable/orderEcGoods.vue"
      ),
  },
  data() {
    return {
      productDefaultLogo,
      table: [
        // {
        //   colIndex: 1,
        //   cols: cabinetTable, // 整柜信息
        // },
        {
          colIndex: 0,
          // cols: goodsTable, // 货物信息
        },
        {
          colIndex: 2,
          cols: pickTable, // 提货信息
        },
        // {
        //   colIndex: 3,
        //   cols: productTable, // 产品信息
        // },
      ], // 0货物信息  1整柜信息  2提货信息  3产品信息
      tableTotalArr: [0, 1, 1, 1], // 默认显示，列表无值时隐藏 - 计算表格高度
      tableData: [],
      grossTotal: {
        1: {},
        2: {},
      },
    };
  },
  mounted() {},
  methods: {
    handleRequest(index, params) {
      const reqs = {
        1: getEcBoxList,
        2: getTakeList,
        3: getFreightProductList,
      };
      return new Promise((resolve, reject) => {
        reqs[index](params).then((res) => {
          if (res.data && !res.rows) {
            res.rows = res.data;
          }
          if (index === 1) {
            const ecBoxArr = res.rows || [];
            this.grossTotal[index] = {
              boxTypeCount: ecBoxArr.length,
              totalWeight: accumulationFn(
                ecBoxArr.map((e) => e.subtotalWeight)
              ),
            };
          } else {
            this.grossTotal[index] = res;
          }
          if (index === 2) {
            this.grossTotal[index].takeBoxCount = (res.rows || []).reduce(
              function (acc, obj) {
                return acc + obj.takeBoxCount;
              },
              0
            );
          }
          return resolve(res);
        });
      });
    },
    getTableResult(idx, { total }) {
      this.$set(this.tableTotalArr, idx, total);
    },
    tableAutoHeight(idx) {
      return this.tableTotalArr[idx] > 9 ? `${10 * 39 + 54}px` : undefined;
    },
    getQueryParams(index) {
      const { id: orderEcId, operationOrderId } = this.formModel;
      // console.log('112==', orderEcId, index);
      if (index === 3) {
        return {
          orderEcId,
          operationOrderId,
        };
      }
      return {
        orderEcId,
      };
    },
    reUpdate(cIndex = [0, 1, 2, 3]) {
      if (cIndex.includes(0)) {
        // 刷新预报货物信息
        this.$refs.goodsRef && this.$refs.goodsRef[0]?.reGoodsUpdate([1]);
      }
      cIndex.forEach((i) => {
        // console.log(this.$refs[`tableConfig${i}`]);
        this.$refs[`tableConfig${i}`] &&
          this.$refs[`tableConfig${i}`].length &&
          this.$refs[`tableConfig${i}`][0].refreshTable(true);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-table {
  /deep/ .el-row {
    display: none;
    display: block;
  }
  // margin-top: -22px;
  /deep/ .tableData .table-header-cell {
    background-color: #f8f8f8;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .title-left {
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
      padding: 0 35px;
      /deep/ .el-checkbox__label {
        padding-left: 0;
      }
      /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
        background-color: #5094ff;
        border-color: #5094ff;
        &::after {
          border-color: #fff;
        }
      }
    }
  }
}
</style>
