<template>
  <div class="detail-table">
    <template v-for="(item, index) in table">
      <div :key="index">
        <div class="title">
          <div
            class="title-left"
            :style="{ marginTop: index == 0 ? 0 : '18px' }"
          >
            {{ item.title }}
          </div>
          <div v-if="index === 0" class="title-right">
            <el-radio-group
              v-model="formModel.freightType"
              class="radio"
              :disabled="true"
            >
              <el-radio key="0" label="0"> FCL整柜 </el-radio>
              <el-radio key="1" label="1"> LCL散货 </el-radio>
            </el-radio-group>
            <el-checkbox
              v-model="formModel.isHomeDelivery"
              class="checkbox"
              :disabled="true"
            >
              上门提货
            </el-checkbox>
          </div>
        </div>
        <ComTable
          :ref="`tableConfig${index}`"
          v-if="index !== 3"
          :columnConfig="item.columns"
          :httpRequest="(params) => handleRequest(index, params)"
          :getQueryParams="getQueryParams"
          :pagination="false"
          @getResult="getResult(index)"
        >
          <template v-slot:customRow="{ slotProps }">
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
        </ComTable>
        <ComTable
          :ref="`tableConfig${index}`"
          :columnConfig="item.columns"
          :httpRequest="(params) => handleRequest(index, params)"
          :getQueryParams="getQueryParams"
          :pagination="false"
          v-else
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'code'">
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.customsCode || "--" }}</span>
              </el-row>
              <el-row class="ellipsis-text">
                <span>{{ slotProps.row.asin || "--" }}</span>
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
        <div class="grand-total" v-if="[0, 1].includes(index)">
          <template v-for="gross in item.grossTotal">
            <span :key="gross.prop">
              <span class="label">{{ gross.label }}</span>
              <span class="value">{{ gross.total }}</span>
            </span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getFreightList } from "@/api/order/firstTransport.js";
import {
  getSeaTraditionFreightList,
  getSeaTraditionFreightTakeList,
} from "@/api/trandition/oceanModel";
import productDefaultLogo from "@/assets/image/product_default.svg";
import {
  fclGoodsInfo,
  fclPickGoodsInfo,
  lclGoodsInfo,
  lclPickGoodsInfo,
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
  },
  data() {
    return {
      productDefaultLogo,
      table: [fclGoodsInfo, fclPickGoodsInfo],
      tableData: [],
      httpRequest: {
        0: getFreightList,
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
    const orderType = "5";
    if (orderType == "3") {
      //海运
      if (freightType == "0") {
        this.table = [fclGoodsInfo, fclPickGoodsInfo];
      } else {
        this.table = [lclGoodsInfo, lclPickGoodsInfo];
      }
    } else if (orderType == "4") {
      //空运
      this.table = [lclGoodsInfo, lclPickGoodsInfo];
    } else if (orderType == "5") {
      //拖车
      this.table = [fclGoodsInfo, fclPickGoodsInfo];
    } else if (orderType == "6") {
      //报关出证
      this.table = [];
    }
  },

  mounted() {
    // console.log(11, this.formModel);
  },
  methods: {
    handleRequest(index, params) {
      // console.log(index, params, this.formModel);
      const reqs = {
        0: getSeaTraditionFreightList,
        1: getSeaTraditionFreightTakeList,
      };
      if (index === 0) {
        params.orderType = this.formModel.orderType
      }
      return new Promise((resolve, reject) => {
        reqs[index](params).then((res) => {
          if (res.data && !res.rows) {
            res.rows = res.data;
          }
          this.grossTotal[index] = res;
          return resolve(res);
        });
      });
    },
    getQueryParams(index) {
      const { orderType, orderId } = this.formModel;
      return {
        orderId,
        orderType,
      };
    },
    reUpdate(index = [0, 1, 2, 3]) {
      index.forEach((i) => {
        console.log(this.$refs[`tableConfig${i}`]);
        this.$refs[`tableConfig${i}`] &&
          this.$refs[`tableConfig${i}`].length &&
          this.$refs[`tableConfig${i}`][0].refreshTable(true);
      });
    },
    getResult(index) {
      //计算货物总数
      if (this.grossTotal[index].code === 200) {
        this.table[index].grossTotal.map((item) => {
          var total = 0;
          this.grossTotal[index].rows.map((result) => {
            if (item.compute) {
              total +=
                result[item.factor[0].prop] * result[item.factor[1].prop];
            } else if (result[item.prop]) {
              total += result[item.prop];
            }
          });
          if (item.decimal) {
            this.$set(item, "total", total?.toFixed(item.decimal));
          } else {
            this.$set(item, "total", total);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-table {
  // margin-top: -22px;
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
      align-self: flex-start;
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
