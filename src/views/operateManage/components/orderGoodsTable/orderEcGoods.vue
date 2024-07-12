<template>
  <!-- 电商订单预报与核实货物 -->
  <div class="detail-table">
    <template v-for="(item, index) in table">
      <div
        :key="index"
        v-if="item.colIndex === 0 ? !!formModel.operationOrderId : true"
      >
        <div class="tit-box base-flex-between">
          <div class="tit-left">{{ item.cols.title }}</div>

          <div
            v-if="
              item.colIndex === 0 && !!tableTotalArr[0] && !formModel.isConceal
            "
          >
            <el-button
              type="primary"
              size="small"
              plain
              round
              @click="exportVerifyGoods()"
            >
              导 出
            </el-button>
          </div>

          <div v-if="item.colIndex === 1">
            <el-radio-group
              v-model="formModel.encasementWay"
              class="radio"
              :disabled="true"
            >
              <el-radio :key="0" :label="0"> FCL整柜 </el-radio>
              <el-radio :key="1" :label="1"> LCL散货 </el-radio>
            </el-radio-group>
            <el-checkbox
              v-model="formModel.pickUpHome"
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
            formModel.operationOrderId
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
          :spanMethod="formModel.quickOrder != 1 ? handleSpanMethod : null"
          :extraConfig="{
            stripe: false,
          }"
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
                    :isNumIntercept="
                      ['totalboxVolume'].includes(slotProps.prop)
                    "
                    v-if="isValJudgment(slotProps.row[dItem.verifyProp])"
                  />
                  <span v-else>
                    <template
                      v-if="['totalboxVolume'].includes(slotProps.prop)"
                      >{{
                        interceptNum(
                          slotProps.row[slotProps.prop],
                          slotProps.column.decimal
                        )
                      }}</template
                    >
                    <template v-else>{{
                      slotProps.row[dItem.curProp]
                    }}</template>
                  </span>
                </div>
              </template>
            </template>
            <template v-if="slotProps.prop === 'img'">
              <div class="staff-preview-image">
                <el-image
                  :src="slotProps.row.img || productDefaultLogo"
                  :preview-src-list="[slotProps.row.img]"
                />
              </div>
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
import {
  getGoodsList,
  getFreightList,
  exportOrderGoods,
} from "@/api/order/firstTransport.js";
import { countListKeyFn } from "@/utils/instructions";
import { comFileDownload } from "@/utils/download.js";
import { orderEcVerifyGoodsCols, orderEcGoodsCols } from "./model";
import {
  mergeColumnProps, // 分列行
} from "../tableModel";
import productDefaultLogo from "@/assets/image/product_default.svg";

export default {
  props: {
    formModel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      productDefaultLogo,
      table: [
        {
          colIndex: 0,
          cols: orderEcVerifyGoodsCols(),
        },
        {
          colIndex: 1,
          cols: orderEcGoodsCols(this.formModel.quickOrder === 1),
        },
      ], // 0-核实 1-预报
      tableTotalArr: [0, 0], // 计算表格高度
      grossTotal: [{}, {}],
      slotKeyArr: [
        {
          curProp: "boxCount",
          verifyProp: "warehousingBoxNum",
        },
        {
          curProp: "totalboxVolume",
          verifyProp: "warehousingTotalVolume",
        },
        {
          curProp: "boxWeight",
          verifyProp: "warehousingWeight",
        },
        {
          curProp: "totalBoxWeight",
          verifyProp: "warehousingTotalWeight",
        },
      ],
    };
  },
  methods: {
    handleSpanMethod({ row, column }) {
      if (mergeColumnProps.includes(column.property)) {
        return {
          rowspan: 1,
          colspan: 1,
        };
      }
      if (row.mergeColumn) {
        return {
          rowspan: row.mergeColumn,
          colspan: 1,
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    },
    handleRequest(index, params) {
      const req_obj = {
        0: getGoodsList, // 核实货物
        1: getFreightList, // 预报货物信
      };
      return new Promise((resolve, reject) => {
        req_obj[index](params).then((res) => {
          if (index === 0) {
            // 核实货物后响应，再获取预报货物，才能正确进行数值合计比较
            this.$refs[`tableRef${1}`] &&
              this.$refs[`tableRef${1}`][0]?.refreshTable();
          }

          this.grossTotal[index] = res;
          if (index !== 1 || this.formModel.quickOrder !== 1) {
            const list = [];
            (res.rows || res.data || []).map((item) => {
              const { cusProducts, ...data } = item;
              if (!cusProducts || !cusProducts.length) {
                list.push({
                  ...data,
                  mergeColumn: 1,
                });
              } else {
                cusProducts.map((p, i) => {
                  const { id, ...pData } = p;
                  if (i === 0) {
                    list.push({
                      ...data,
                      ...pData,
                      mergeColumn: cusProducts.length,
                    });
                  } else {
                    list.push({
                      ...data,
                      ...pData,
                      mergeColumn: 0,
                    });
                  }
                });
              }
            });
            res.rows = list;
          }
          resolve(res);
        });
      });
    },
    exportVerifyGoods() {
      comFileDownload(this, exportOrderGoods, this.getQueryParams(0));
    },
    getTableResult(idx, totalCol, { total }) {
      this.$set(this.tableTotalArr, idx, total);
      if (idx === 0) {
        this.grossTotal[idx] = countListKeyFn(this.grossTotal[0].data, {
          countKeys: totalCol.map((e) => e.prop),
        });
      }
    },
    tableAutoHeight(idx) {
      return this.tableTotalArr[idx] > 9 ? `${10 * 39 + 54}px` : undefined;
    },
    getQueryParams(index) {
      const { id, orderType, operationOrderId, freightType, isMainBill } =
        this.formModel;
      // console.log('===this.formModel', this.formModel)
      if (index === 0) {
        return {
          operationOrderId,
          freightType,
          orderType,
          verifyStatus: freightType || isMainBill ? 1 : undefined, // 主单和散货
        };
      }
      if (index === 1) {
        return {
          orderEcId: id,
          operationOrderId,
        };
      }
    },
    reGoodsUpdate(index = [0, 1]) {
      index.forEach((i) => {
        this.$refs[`tableRef${i}`]?.length &&
          this.$refs[`tableRef${i}`][0].refreshTable(true);
      });
    },
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
    .el-table--medium .el-table__cell {
      padding: 4px 0;
    }
    .el-table {
      td {
        // vertical-align: top;

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
  .staff-preview-image {
    justify-content: flex-end;
  }
}
</style>
