<template>
  <!-- 传统/其他订单LCL散货/FCL整柜预报与核实 -->
  <div class="detail-table">
    <template v-for="(item, index) in table">
      <div
        :key="index"
        v-if="item.colIndex === 0 ? !!formModel.operationOrderId : true"
      >
        <div class="tit-box base-flex-between">
          <div class="tit-left">{{ item.cols.title }}</div>

          <div v-if="item.colIndex === 1">
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
          :ref="`tableRef${item.colIndex}`"
          :isMountedRequest="
            formModel.operationOrderId /** && table.some(e => e.colIndex === 0) */
              ? item.colIndex !== 1
              : item.colIndex !== 0 /* 防止重复调预报货物接口 */
          "
          :columnConfig="item.cols.columns"
          :httpRequest="(params) => handleRequest(item.colIndex, params)"
          :getQueryParams="() => getQueryParams(item.colIndex)"
          :pagination="false"
          @getResult="
            (obj) => getTableResult(item.colIndex, item.cols.totalCol, obj)
          "
          :tableHeight="tableAutoHeight(item.colIndex)"
        >
          <template v-slot:customRow="{ slotProps }">
            <!-- 核实与预报 -->
            <template v-if="slotProps.prop === 'indexSlot'">
              <div class="tag delete" v-if="slotProps.row.deleted">删</div>
              <div
                class="tag new"
                v-if="!slotProps.row.deleted && slotProps.row.isNew"
              >
                新
              </div>
              <span>{{ slotProps.rowIndex + 1 }}</span>
            </template>

            <template v-if="item.colIndex === 1">
              <!-- 预报 -->
              <template v-for="dItem in slotKeyArr">
                <div
                  :key="dItem.curProp"
                  v-if="slotProps.prop === dItem.curProp"
                >
                  <DiffMark
                    :currentVal="slotProps.row[dItem.curProp]"
                    :verifyVal="slotProps.row[dItem.verifyProp]"
                    :decimal="slotProps.column.decimal"
                    :showCurrentVal="false"
                    :showVerifyVal="false"
                    v-if="isValJudgment(slotProps.row[dItem.verifyProp])"
                  />
                  <span v-else>{{ slotProps.row[dItem.curProp] }} </span>
                </div>
              </template>
            </template>
          </template>
        </ComTable>

        <div class="grand-total">
          <span>合计：</span>
          <template v-for="gross in item.cols.totalCol">
            <span :key="gross.prop">
              <template v-if="item.colIndex === 0 || !tableTotalArr[0]">
                <!-- 核实与没有核实时的预报 -->
                <span class="label">{{ gross.label }}</span>
                <span class="value">
                  {{
                    toFixedNum(
                      grossTotal[item.colIndex][gross.prop],
                      gross.decimal || 0
                    )
                  }}
                  {{ gross.util || "" }}</span
                >
              </template>
              <DiffMark
                v-else
                :key="gross.prop"
                :label="gross.label"
                :util="gross.util"
                :currentVal="grossTotal[item.colIndex][gross.prop]"
                :verifyVal="grossTotal[0][gross.vProp]"
                :decimal="gross.decimal"
                :grossTotal="true"
              />
            </span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getGoodsList } from "@/api/order/firstTransport.js";
import { getSeaTraditionFreightList } from "@/api/trandition/oceanModel";
import { countListKeyFn } from "@/utils/instructions";
import {
  orderLCLVerifyGoodsCols,
  orderLCLGoodsCols,
  orderFCLVerifyGoodsCols,
  orderFCLGoodsCols,
} from "./traditionModel";

export default {
  props: {
    formModel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      table: [],
      tableTotalArr: [0, 0], // 计算表格高度
      grossTotal: [{}, {}],
      slotKeyArr: [
        {
          curProp: "packNum",
          verifyProp: "warehousingBoxNum",
        },
        {
          curProp: "totalboxVolume",
          verifyProp: "warehousingTotalVolume",
        },
        {
          curProp: "totalBoxWeight",
          verifyProp: "warehousingTotalWeight",
        },
      ],
    };
  },
  methods: {
    handleRequest(index, params) {
      const req_obj = {
        0: getGoodsList, // 核实货物
        1: getSeaTraditionFreightList, // 预报货物信
      };
      return new Promise((resolve, reject) => {
        req_obj[index](params).then((res) => {
          if (index === 0) {
            // 核实货物后响应，再获取预报货物，才能正确进行数值合计比较
            this.$refs[`tableRef${1}`] &&
              this.$refs[`tableRef${1}`][0]?.refreshTable();
          }
          resolve(res);
        });
      });
    },
    getTableResult(idx, totalCol, { total, tableData }) {
      this.$set(this.tableTotalArr, idx, total);
      this.grossTotal[idx] = countListKeyFn(tableData, {
        countKeys: totalCol.map((e) => e.prop),
      });
    },
    tableAutoHeight(idx) {
      return this.tableTotalArr[idx] > 9 ? `${10 * 39 + 54}px` : undefined;
    },
    getQueryParams(index) {
      const { orderType, id, operationOrderId, freightType } = this.formModel;
      if (index === 0) {
        return {
          operationOrderId,
          orderType,
          deleted: 0,
          freightType: Number(freightType || 0), // 1-散货
					verifyStatus: 1,
          // verifyStatus: Number(freightType || 0) ? 1 : undefined, // 1-散货 空运只有散货
        };
      }
      if (index === 1) {
        return {
          orderId: id,
          orderType,
        };
      }
    },
    // reGoodsUpdate(index = [0, 1]) {
    //   index.forEach((i) => {
    //     this.$refs[`tableRef${i}`]?.length &&
    //       this.$refs[`tableRef${i}`][0].refreshTable(true);
    //   });
    // },
  },
  created() {
    const { freightType } = this.formModel;
    this.table = [
      {
        colIndex: 0, // 0-核实 1-预报
        cols:
          freightType == "1"
            ? orderLCLVerifyGoodsCols()
            : orderFCLVerifyGoodsCols(),
      },
      {
        colIndex: 1,
        cols: freightType == "1" ? orderLCLGoodsCols : orderFCLGoodsCols,
      },
    ];
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
  },
};
</script>

<style lang="scss" scoped>
.detail-table {
  /deep/ {
    .el-table {
      td {
        vertical-align: top;

        .cell {
          line-height: 28px;
        }
      }
      .tag {
        font-size: 12px;
        width: 40px;
        height: 17px;
        line-height: 17px;
        text-align: center;
        position: absolute;
        left: 0;
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
  }
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
