<template>
  <div class="detail-table">
    <template v-for="(item, index) in table">
      <div :key="index">
        <div
          class="title"
          v-if="
            (index !== 3 || formModel.pickUpHome) &&
            (index !== 0 || formModel.encasementWay != 1)
          "
        >
          <div class="title-left">
            {{ item.title }}
            <el-checkbox
              v-if="index === 2"
              v-model="formModel.pickUpHome"
              class="checkbox"
              disabled
            >
              上门提货
            </el-checkbox>
          </div>
          <div class="title-right" v-if="item.btnRight && !formModel.isConceal">
            <el-button
              type="primary"
              size="small"
              plain
              round
              v-for="item in item.btnRight"
              :key="item.key"
              @click="handleMaintain(item.key)"
            >
              {{ item.text }}
            </el-button>
          </div>
          <!-- <div v-if="index === 1" class="title-right">
            <el-radio-group
              v-model="formModel.encasementWay"
              class="radio"
              disabled
            >
              <el-radio :key="0" :label="0"> FCL整柜 </el-radio>
              <el-radio :key="1" :label="1"> LCL散货 </el-radio>
            </el-radio-group>
            <el-checkbox
              v-model="formModel.pickUpHome"
              class="checkbox"
              disabled
            >
              上门提货
            </el-checkbox>
          </div> -->
        </div>
        <ComTable
          class="goods-table"
          :ref="`tableConfig${index}`"
          v-if="
            index !== 4 &&
            (index !== 3 || formModel.pickUpHome) &&
            (index !== 0 || formModel.encasementWay != 1)
          "
          :columnConfig="item.columns"
          :httpRequest="(params) => handleRequest(index, params)"
          :getQueryParams="() => getQueryParams(index)"
          :pagination="false"
          @getResult="getResult(index)"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'shipmentId'">
              <div class="tag delete" v-if="slotProps.row.deleted">删</div>
              <div
                class="tag new"
                v-if="!slotProps.row.deleted && slotProps.row.isNew"
              >
                新
              </div>
              <el-row class="show-overflow-tooltip">
                {{ slotProps.row.shipmentId }}
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'boxSizeCode'">
              <div class="tag delete" v-if="slotProps.row.deleted">删</div>
              <div
                class="tag new"
                v-if="!slotProps.row.deleted && slotProps.row.isNew"
              >
                新
              </div>
              <el-row class="boxSizeCode show-overflow-tooltip">
                {{ slotProps.row.boxSizeCode }}
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'boxNumber'">
              <el-row class="show-overflow-tooltip">
                {{ slotProps.row.boxNumber }}
              </el-row>
              <!-- <el-row v-if="formModel.encasementWay == 1">
                入仓数据核实：
              </el-row> -->
            </template>
            <template v-if="slotProps.prop === 'boxCount'">
              <DiffMark
                :currentVal="slotProps.row.boxCount"
                :verifyVal="slotProps.row.warehousingBoxNum"
                :decimal="0"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingBoxNum !== null"
              />
              <span v-else>{{ slotProps.row.boxCount }}</span>
            </template>
            <template v-if="slotProps.prop === 'unitWeight'">
              <DiffMark
                :currentVal="slotProps.row.unitWeight"
                :verifyVal="slotProps.row.warehousingWeight"
              />
            </template>
            <template v-if="slotProps.prop === 'totalVolume'">
              <DiffMark
                :currentVal="slotProps.row.totalVolume"
                :verifyVal="slotProps.row.warehousingTotalVolume"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingTotalVolume !== null"
              />
              <span v-else>{{ slotProps.row.totalVolume }}</span>
            </template>
            <template v-if="slotProps.prop === 'totalWeight'">
              <DiffMark
                :currentVal="slotProps.row.totalWeight"
                :verifyVal="slotProps.row.warehousingTotalWeight"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingTotalWeight !== null"
              />
              <span v-else>{{ slotProps.row.totalWeight }}</span>
            </template>
            <template v-if="slotProps.prop === 'subtotalWeight'">
              <DiffMark
                :currentVal="slotProps.row.subtotalWeight"
                :verifyVal="slotProps.row.warehousingTotalWeight"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingTotalWeight !== null"
              />
              <span v-else>{{ slotProps.row.subtotalWeight }}</span>
            </template>
            <template v-if="slotProps.prop === 'boxLength'">
              <DiffMark
                :currentVal="slotProps.row.boxLength"
                :verifyVal="slotProps.row.warehousingLength"
              />
            </template>
            <template v-if="slotProps.prop === 'boxWidth'">
              <DiffMark
                :currentVal="slotProps.row.boxWidth"
                :verifyVal="slotProps.row.warehousingWidth"
              />
            </template>
            <template v-if="slotProps.prop === 'boxHeight'">
              <DiffMark
                :currentVal="slotProps.row.boxHeight"
                :verifyVal="slotProps.row.warehousingHeight"
              />
            </template>
            <template v-if="slotProps.prop === 'boxWeight'">
              <DiffMark
                :currentVal="slotProps.row.boxWeight"
                :verifyVal="slotProps.row.warehousingWeight"
              />
            </template>
            <template v-if="slotProps.prop === 'boxVolume'">
              <DiffMark
                :currentVal="slotProps.row.boxVolume"
                :verifyVal="slotProps.row.warehousingVolume"
              />
            </template>
          </template>
        </ComTable>
        <ComTable
          :ref="`tableConfig${index}`"
          :columnConfig="item.columns"
          :httpRequest="(params) => handleRequest(index, params)"
          :getQueryParams="() => getQueryParams(index)"
          :pagination="false"
          v-else-if="index === 4"
          @getResult="getResult(index)"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'volume'">
              <div class="tag delete" v-if="slotProps.row.deleted">删</div>
              <div
                class="tag new"
                v-if="!slotProps.row.deleted && slotProps.row.isNew"
              >
                新
              </div>
              <div class="pics-box">
                <img :src="slotProps.row.img || productDefaultLogo" alt="" />
              </div>
            </template>
            <template v-if="slotProps.prop === 'sku'">
              <el-row class="ellipsis-text">
                <span>
                  {{ slotProps.row.sku }}
                </span>
              </el-row>
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.productNameCn }}</span>
                <span> ({{ slotProps.row.productNameEn }}) </span>
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'code'">
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.customsCode || "--" }}</span>
              </el-row>
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.asin || "--" }}</span>
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'weight'">
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.productWeight || "--" }}</span>
              </el-row>
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.productNetWeight || "--" }}</span>
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'declaredValue'">
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.declaredValue || "--" }}</span>
              </el-row>
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.singleBoxNum || "--" }}</span>
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'productModel'">
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.productModel || "--" }}</span>
              </el-row>
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.brand || "--" }}</span>
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'businessUse'">
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.materialCn || "--" }}</span>
              </el-row>
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.businessUseCn || "--" }}</span>
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'shipmentId'">
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.shipmentId || "--" }}</span>
              </el-row>
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.referenceId || "--" }}</span>
              </el-row>
            </template>
          </template>
          <template v-slot:customHeader="{ slotProps }">
            <template
              v-if="
                /sku|code|weight|declaredValue|productModel|businessUse|shipmentId/.test(
                  slotProps.column.prop
                )
              "
            >
              <div>{{ slotProps.column.labelTop }}</div>
              <div>{{ slotProps.column.labelBottom }}</div>
            </template>
          </template>
        </ComTable>
        <div
          class="grand-total"
          v-if="
            !(
              (index == 0 && formModel.encasementWay == 1) ||
              (index == 3 && !formModel.pickUpHome)
            ) && item.grossTotal
          "
        >
          <div class="grand-title">合计：</div>
          <div
            v-for="gross in item.grossTotal"
            :key="gross.prop"
            class="grand-cols"
          >
            <div v-if="gross.prop && gross.prop === 'consigneeWarehouseId'">
              <el-row class="show-overflow-tooltip">
                <span class="label">{{ gross.label }}</span>
                <span class="value">
                  {{ gross.count }}
                </span>
                <span>{{ gross.util }}</span>
              </el-row>
            </div>
            <DiffMark
              v-else
              :label="gross.label"
              :currentVal="gross.prop ? gross.total : gross.totalTop"
              :verifyVal="
                gross.prop || (index === 1 && formModel.encasementWay == 0)
                  ? ''
                  : gross.totalBtm || ''
              "
              :decimal="gross.decimal"
              :grossTotal="!!gross.totalBtm"
            />
          </div>
        </div>
      </div>
    </template>
    <MaintainCabinet
      ref="maintainCabinet"
      @handleChange="() => handleMaintainChange(0)"
      :basicData="formModel"
    />
    <MaintainGoods
      ref="MaintainGoods"
      @handleChange="() => handleMaintainChange(1)"
      :basicData="formModel"
    />
  </div>
</template>

<script>
import {
  getFreightList,
  getTakeList,
  getBoxList,
  getFreightProductList,
} from "@/api/order/firstTransport.js";
import { multiplicationFn } from "@/utils/instructions";
import productDefaultLogo from "@/assets/image/product_default.svg";
import {
  goodsTable,
  predictionGoodsTable,
  cabinetTable,
  pickTable,
  productTable,
} from "./model";
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
    DiffMark: () => import("_comp/DiffMark"),
    MaintainCabinet: () =>
      import("@/views/operateManage/components/MaintainCabinet"),
    MaintainGoods: () =>
      import("@/views/operateManage/components/MaintainGoods"),
  },
  data() {
    return {
      productDefaultLogo,
      table: [
        cabinetTable,
        goodsTable(),
        predictionGoodsTable,
        pickTable,
        productTable,
      ],
      tableData: [],
      httpRequest: {
        0: getBoxList,
        1: getBoxList,
        2: getBoxList,
        3: getTakeList,
        4: getFreightProductList,
      },
      grossTotal: {
        0: {},
        1: {},
      },
      verifyTotal: {},
    };
  },
  mounted() {},
  methods: {
    handleMaintainChange(index) {
      this.$refs[`tableConfig${index}`][0].refreshTable();
      if (index === 1) {
        this.$refs[`tableConfig${2}`][0].refreshTable();
      }
    },
    handleMaintain(type) {
      if (type === 0) {
        console.log(this.grossTotal[type].data);
        this.$refs.maintainCabinet.show(this.grossTotal[type]);
      } else if (type === 1) {
        console.log(this.formModel);
        const { operationOrderNum, bailorPeople, createTime } = this.formModel;
        this.$refs.MaintainGoods.show({
          ...this.grossTotal[type],
          operationOrderNum,
          bailorPeople,
          createTime,
        });
      }
    },
    handleRequest(index, params) {
      const reqs = {
        0: {
          httpRequest: getBoxList,
          type: "boxList",
        },
        1: {
          httpRequest: getBoxList,
          type: "verFreightList",
        },
        2: {
          httpRequest: getFreightList,
          type: "freightList",
        },
        3: {
          httpRequest: getTakeList,
          type: "takeList",
        },
        4: {
          httpRequest: getFreightProductList,
          type: "freightProductList",
        },
      };
      return new Promise((resolve, reject) => {
        reqs[index].httpRequest(params).then((res) => {
          if (res.data && !res.rows) {
            res.rows = res.data;
          }
          if (index === 2) {
            res.rows = res.rows.map((item) => {
              const totalVolume = multiplicationFn([item.boxVolume, item.boxCount]);
              const totalWeight = multiplicationFn([item.boxWeight, item.boxCount]);
              return {
                ...item,
                totalVolume,
                totalWeight,
                calcVolume: totalVolume,
                calcWeight: totalWeight,
                calcBoxCount: item.boxCount,
              };
            });
          }
          if (reqs[index].type) {
            this.$emit("tableList", {
              [reqs[index].type]: res,
            });
          }
          this.grossTotal[index] = res;
          if (index == 0 && res && res.rows) {
            res = {
              ...res,
              ...this.handleData(res.rows),
            };
          }
          return resolve(res);
        });
      });
    },
    getFreightList() {
      const { orderId: orderEcId } = this.formModel;
      getFreightList({
        orderEcId,
      }).then((res) => {
        this.$emit("tableList", {
          freightList: res,
        });
      });
    },
    handleData(data) {
      let totalWeight = 0;
      let totalVolume = 0;
      data.map((item) => {
        if (!item.deleted) {
          totalWeight += Number(item.weight || 0);
          totalVolume += Number(item.volume || 0);
        }
      });
      return {
        subtotalWeight: totalWeight.toFixed(2),
        subtotalVolume: totalVolume.toFixed(2),
      };
    },
    getQueryParams(index) {
      const {
        orderId: orderEcId,
        operationOrderId,
        freightType,
        orderType,
        isMainBill,
      } = this.formModel;
      const ret = {
        orderEcId,
      };
      if (index === 0) {
        return {
          operationOrderId,
          freightType: Number(freightType || 0),
          orderType,
          isFull: 1,
        };
      }
      if (index === 1) {
        return {
          operationOrderId,
          freightType: Number(freightType || 0),
          orderType,
          verifyStatus: Number(freightType || 0) || isMainBill ? 1 : undefined, // 主单和散货
          // verifyStatus: 1,
        };
      }
      if (index === 2) {
        return {
          orderEcId,
          operationOrderId,
          // freightType: Number(freightType || 0),
          // orderType,
          // isForecast: 1,
        };
      }
      return ret;
    },
    reUpdate(index = [0, 1, 2, 3, 4]) {
      index.forEach((i) => {
        console.log(this.$refs[`tableConfig${i}`]);
        this.$refs[`tableConfig${i}`] &&
          this.$refs[`tableConfig${i}`].length &&
          this.$refs[`tableConfig${i}`][0].refreshTable(true);
      });
    },
    getRepeatNum(list) {
      return list.reduce((prev, next) => {
        prev[next] = prev[next] + 1 || 1;
        return prev;
      }, {});
    },
    getResult(index) {
      //计算货物总数
      if (this.grossTotal[index].code === 200) {
        if (!this.table[index].grossTotal) return;
        this.table[index].grossTotal.map((item) => {
          let totalTop = 0;
          let totalBtm = 0;
          let total = 0;
          this.grossTotal[index].rows.map((result) => {
            if (item.compute) {
              totalTop +=
                result[item.factor[0].propTop] * result[item.factor[1].propTop];
              totalBtm +=
                result[item.factor[0].propBtm] * result[item.factor[1].propBtm];
              total +=
                result[item.factor[0].prop] * result[item.factor[1].prop];
            } else {
              totalTop += result[item.propTop];
              totalBtm += result[item.propBtm];
              total += result[item.prop];
            }
          });
          this.$set(item, "totalTop", totalTop);
          if (index === 2 && item.propBtm) {
            this.$set(item, "totalBtm", this.verifyTotal[item.propBtm]);
          } else {
            this.$set(item, "totalBtm", totalBtm);
          }
          this.$set(item, "total", total);
          let count = 0;
          const propList = this.grossTotal[index].rows.map(
            (eles) => eles[item.prop]
          );
          if (propList.length) {
            const propObj = this.getRepeatNum(propList);
            count = Object.keys(propObj).length;
          }
          this.$set(item, "count", `${count}${item.util}`);
          if (index === 1) {
            this.verifyTotal[item.prop] = item.total;
          }
        });
      }
    },
    handleUpdateView() {
      [0, 1, 2, 3, 4].forEach((e) => {
        this.$refs[`tableConfig${e}`] &&
          this.$refs[`tableConfig${e}`][0]?.refreshTable();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-table {
  border-top: 1px solid #e2e2e2;
  /deep/ {
    .tableData .table-header-cell {
      background-color: #f8f8f8;
    }
    .goods-table {
      .el-table td {
        vertical-align: top;

        .cell {
          line-height: 28px;
        }
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
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .title-left {
      color: #515151;
      font-size: 14px;
      font-weight: bold;
      margin: 18px 0 12px;
    }
    .title-right {
      align-self: center;
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
      padding-left: 15px;
      /deep/ .el-checkbox__label {
        padding-left: 2px;
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
  .pics-box {
    img {
      width: 50px;
      height: 40px;
      vertical-align: middle;
    }
  }
}
</style>
