<template>
  <div class="detail-table">
    <template v-for="(item, index) in table">
      <div :key="index">
        <div class="title">
          <div class="title-left">
            {{ item.title }}
            <el-checkbox
              v-if="index === 2"
              v-model="formModel.isHomeDelivery"
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
          <!-- <div
            class="title-left"
            :style="{ marginTop: index == 0 ? 0 : '18px' }"
          >
            {{ item.title }}
          </div>
          <div v-if="index === 1" class="title-right">
            <el-radio-group
              v-model="formModel.freightType"
              class="radio"
              disabled
            >
              <el-radio key="0" label="0"> FCL整柜 </el-radio>
              <el-radio key="1" label="1"> LCL散货 </el-radio>
            </el-radio-group>
            <el-checkbox
              v-model="formModel.isHomeDelivery"
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
          v-if="index !== 3"
          :columnConfig="item.columns"
          :httpRequest="(params) => handleRequest(index, params)"
          :getQueryParams="() => getQueryParams(index)"
          :pagination="false"
          @getResult="getResult(index)"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'customsDeclarationType'">
              <div class="tag delete" v-if="slotProps.row.deleted">删</div>
              <div
                class="tag new"
                v-if="!slotProps.row.deleted && slotProps.row.isNew"
              >
                新
              </div>
              <el-row class="show-overflow-tooltip">
                {{ slotProps.dicsList.nameCn }}
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'boxCode'">
              <el-row class="show-overflow-tooltip">
                {{ slotProps.row.boxCode }}
              </el-row>
              <!-- <el-row>
                {{
                  formModel.freightType == 0
                    ? "整柜VGM核实："
                    : "入仓数据核实："
                }}
              </el-row> -->
            </template>
            <template v-if="slotProps.prop === 'count'">
              <DiffMark
                :currentVal="slotProps.row.boxNum"
                :verifyVal="slotProps.row.warehousingBoxNum"
                :decimal="slotProps.column.decimal"
                :showCurrentVal="false"
                :showVerifyVal="false"
              />
            </template>
            <template v-if="slotProps.prop === 'weight'">
              <DiffMark
                :currentVal="slotProps.row.weight"
                :verifyVal="slotProps.row.warehousingWeight"
                :decimal="slotProps.column.decimal"
                :showCurrentVal="false"
                :showVerifyVal="false"
              />
            </template>
            <template v-if="slotProps.prop === 'packType'">
              <el-row class="show-overflow-tooltip">
                {{ slotProps.dicsList.nameCn }}
              </el-row>
              <!-- <el-row> 入仓数据核实： </el-row> -->
            </template>
            <template v-if="slotProps.prop === 'packNum'">
              <DiffMark
                :currentVal="slotProps.row.packNum"
                :verifyVal="slotProps.row.warehousingBoxNum"
                :decimal="slotProps.column.decimal"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingBoxNum !== null"
              />
              <span v-else>{{ slotProps.row.packNum || "--" }}</span>
            </template>
            <template v-if="slotProps.prop === 'length'">
              <DiffMark
                :currentVal="slotProps.row.length"
                :verifyVal="slotProps.row.warehousingLength"
                :decimal="slotProps.column.decimal"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingLength !== null"
              />
              <span v-else>{{ slotProps.row.length }}</span>
            </template>
            <template v-if="slotProps.prop === 'width'">
              <DiffMark
                :currentVal="slotProps.row.width"
                :verifyVal="slotProps.row.warehousingWidth"
                :decimal="slotProps.column.decimal"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingWidth !== null"
              />
              <span v-else>{{ slotProps.row.width }}</span>
            </template>
            <template v-if="slotProps.prop === 'height'">
              <DiffMark
                :currentVal="slotProps.row.height"
                :verifyVal="slotProps.row.warehousingHeight"
                :decimal="slotProps.column.decimal"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingHeight !== null"
              />
              <span v-else>{{ slotProps.row.height }}</span>
            </template>
            <template v-if="slotProps.prop === 'goodsTotalWeight'">
              <DiffMark
                :currentVal="slotProps.row.totalWeight"
                :verifyVal="slotProps.row.warehousingTotalWeight"
                :decimal="slotProps.column.decimal"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingTotalWeight !== null"
              />
              <span v-else>{{ slotProps.row.totalWeight }}</span>
            </template>
            <template v-if="slotProps.prop === 'totalVolume'">
              <DiffMark
                :currentVal="slotProps.row.totalVolume"
                :verifyVal="slotProps.row.warehousingTotalVolume"
                :decimal="slotProps.column.decimal"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingTotalVolume !== null"
              />
              <span v-else>{{ slotProps.row.totalVolume || "--" }}</span>
            </template>
            <template v-if="slotProps.prop === 'volume'">
              <DiffMark
                :currentVal="slotProps.row.volume"
                :verifyVal="slotProps.row.warehousingVolume"
                :showCurrentVal="false"
                :showVerifyVal="false"
              />
            </template>
            <template v-if="slotProps.prop === 'pickAddressInfo'">
              <el-row class="ellipsis-text">
                <span
                  >{{ slotProps.row.cusConsignee.contacts }}({{
                    slotProps.row.cusConsignee.phone
                  }})</span
                >
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'pickAddress'">
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.cusConsignee.address }}</span>
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'totalWeight'">
              <el-row class="ellipsis-text">
                <span>
                  {{
                    (
                      slotProps.row.takeFreightNum * slotProps.row.weight
                    ).toFixed(2)
                  }}
                </span>
              </el-row>
            </template>
          </template>
          <template v-slot:customHeader="{ slotProps }">
            <template v-if="/weight|count/.test(slotProps.column.prop)">
              <div>{{ slotProps.column.labelTop }}</div>
              <div>{{ slotProps.column.labelBtm }}</div>
            </template>
          </template>
        </ComTable>
        <div class="grand-total" v-if="[0, 1].includes(index)">
          <div
            v-for="gross in item.grossTotal"
            :key="gross.prop"
            class="grand-cols"
          >
            <div v-if="gross.prop && gross.prop === 'boxCode'">
              <el-row class="show-overflow-tooltip">
                <span class="label">{{ gross.label }}</span>
                <span class="value">
                  {{ gross.lists }}
                </span>
              </el-row>
            </div>
            <DiffMark
              v-else
              :label="gross.label"
              :currentVal="gross.prop ? gross.total : gross.totalTop"
              :verifyVal="gross.prop ? '' : gross.totalBtm || ''"
              :decimal="gross.decimal"
              :grossTotal="!!gross.totalBtm"
            />
          </div>
        </div>
      </div>
    </template>
    <MaintainTransition
      @handleChange="handleMaintainChange"
      ref="maintainTransition"
      :basicData="formModel"
    />
  </div>
</template>

<script>
import { getFreightList, getGoodsList } from "@/api/order/firstTransport.js";
import {
  getSeaTraditionFreightList,
  getSeaTraditionFreightTakeList,
} from "@/api/trandition/oceanModel";
import productDefaultLogo from "@/assets/image/product_default.svg";
import {
  fclGoodsInfo,
  predictionFclGoodsInfo,
  fclPickGoodsInfo,
  lclGoodsInfo,
  lclPickGoodsInfo,
  predictionLclGoodsInfo,
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
    MaintainTransition: () =>
      import("@/views/operateManage/components/MaintainTransition"),
  },
  data() {
    return {
      productDefaultLogo,
      table: [fclGoodsInfo, predictionFclGoodsInfo, fclPickGoodsInfo],
      tableData: [],
      httpRequest: {
        0: getGoodsList,
        1: getSeaTraditionFreightTakeList,
      },
      grossTotal: {
        0: {},
        1: {},
      },
      tableTotal: {},
    };
  },
  created() {
    var { freightType } = this.formModel;
    const orderType = "3";
    if (orderType === "3") {
      //海运
      if (freightType == "0") {
        this.table = [fclGoodsInfo, predictionFclGoodsInfo, fclPickGoodsInfo];
      } else {
        this.table = [lclGoodsInfo, predictionLclGoodsInfo, lclPickGoodsInfo];
      }
    } else if (orderType === "4") {
      //空运
      this.table = [lclGoodsInfo, predictionLclGoodsInfo, lclPickGoodsInfo];
    } else if (orderType === "5") {
      //拖车
      this.table = [fclGoodsInfo, predictionFclGoodsInfo, fclPickGoodsInfo];
    } else if (orderType === "6") {
      //报关出证
      this.table = [];
    }
  },

  mounted() {},
  methods: {
    handleMaintain() {
      const { freightType } = this.formModel;
      this.$refs.maintainTransition.show(freightType);
    },
    handleMaintainChange() {
      this.$refs.tableConfig0[0].refreshTable();
      this.$refs.tableConfig1[0].refreshTable();
    },
    handleRequest(index, params) {
      const reqs = {
        0: {
          httpRequest: getGoodsList,
          type: "verFreightList",
        },
        1: {
          httpRequest: getSeaTraditionFreightList,
          type: "freightList",
        },
        2: {
          httpRequest: getSeaTraditionFreightTakeList,
          type: "takeList",
        },
      };
      return new Promise((resolve, reject) => {
        reqs[index].httpRequest(params).then((res) => {
          if (res.data && !res.rows) {
            res.rows = res.data;
          }
          this.grossTotal[index] = res;

          if (index === 1) {
            res.rows = res.rows.map((item) => {
              const totalVolume = Number(
                (
                  Number(item.volume || 0) *
                  Number(item.packNum || item.boxNum || 0)
                ).toFixed(2)
              );
              const totalWeight = Number(
                (
                  Number(item.weight || 0) *
                  Number(item.packNum || item.boxNum || 0)
                ).toFixed(2)
              );
              return {
                ...item,
                totalVolume,
                totalWeight,
                calcVolume: item.deleted ? 0 : totalVolume,
                calcWeight: item.deleted ? 0 : totalWeight,
                calcPackNum: item.deleted
                  ? 0
                  : item.packNum || item.boxNum || 0,
                packNum: item.packNum || item.boxNum || 0,
                calcWarehousingBoxNum: item.deleted
                  ? 0
                  : item.warehousingBoxNum,
                calcWarehousingTotalVolume: item.deleted
                  ? 0
                  : item.warehousingTotalVolume,
                calcWarehousingTotalWeight: item.deleted
                  ? 0
                  : item.warehousingTotalWeight,
              };
            });
          }
          if (reqs[index].type) {
            this.$emit("tableList", {
              [reqs[index].type]: res,
            });
          }

          return resolve(res);
        });
      });
    },
    getSeaTraditionFreightList() {
      const { orderType, orderId } = this.formModel;
      getSeaTraditionFreightList({
        orderId,
        orderType,
      }).then((res) => {
        this.$emit("tableList", {
          freightList: res,
        });
      });
    },
    getQueryParams(index) {
      const { operationOrderId, freightType, orderType, orderId } =
        this.formModel;
      if (index === 0) {
        return {
          operationOrderId,
          freightType: Number(freightType || 0),
          orderType,
          isForecast: index || undefined,
          deleted: index === 0 ? 0 : undefined,
          verifyStatus: Number(freightType || 0) ? 1 : undefined, // 空运只有散货
        };
      }
      return {
        orderId,
        orderType,
      };
    },
    reUpdate(index = [0, 1, 2, 3]) {
      index.forEach((i) => {
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
          this.$set(item, "totalBtm", totalBtm);
          this.$set(item, "total", total);
          let lists = [];
          const propList = this.grossTotal[index].rows.map(
            (eles) => eles[item.prop]
          );
          if (propList.length) {
            const propObj = this.getRepeatNum(propList);
            Object.keys(propObj).map((key) => {
              lists.push(`${propObj[key]}x${key}`);
            });
          }
          this.$set(item, "lists", lists.toString());
        });
      }
    },
    handleUpdateView() {
      [0, 1, 2].forEach((e) => {
        this.$refs[`tableConfig${e}`] &&
          this.$refs[`tableConfig${e}`][0]?.refreshTable();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-table {
  // margin-top: -22px;
  /deep/.goods-table {
    .el-table td {
      vertical-align: top;
    }
    .cell {
      line-height: 28px;
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
  .pics-box {
    img {
      width: 50px;
      height: 40px;
      vertical-align: middle;
    }
  }
}
</style>
