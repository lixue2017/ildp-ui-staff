<template>
  <div class="detail-table">
    <template v-for="{ item, index } in table">
      <div
        :key="index"
        v-if="
          showTable.includes(index) &&
          (index !== 5 || formModel.canInvoiceList === 1) // 客户箱单发票-操作接单后显示数据
          // && (index !== 1 || formModel.isInvoice === 1) // 核实货物信息-入仓核实后显示数据
        "
      >
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
          <div class="title-right" v-if="item.btnRight && !disabled">
            <!-- <el-button
              v-if="index == 1"
              type="primary"
              size="small"
              plain
              round
              @click="exportVerifyGoods(item)"
            >
              导 出
            </el-button> -->
            <template v-for="item in item.btnRight">
              <el-button
                type="primary"
                size="small"
                :loading="item.key === 'goodsEmail' && isBtnLoading"
                :plain="item.plain"
                round
                :key="item.key"
                @click="handleMaintain(item.key)"
                v-if="
                  (!item.hideMainBill ||
                    !item.hideMainBill.includes(formModel.isMainBill)) &&
                  (!item.canEditInvoice ||
                    item.canEditInvoice === formModel.canEditInvoice) &&
                  (!item.invoiceStatus ||
                    formModel.invoiceStatus === item.invoiceStatus) &&
                  (!item.showConceal ||
                    item.showConceal.includes(formModel.isConceal)) &&
                  (!item.invoice ||
                    item.invoice.includes(formModel.isInvoice)) &&
                  (!item.isMainBill ||
                    !item.isMainBill.includes(formModel.isMainBill)) &&
                  (item.noEncasementWay
                    ? !item.noEncasementWay.includes(formModel.encasementWay) &&
                      !!tableTotalArr[1]
                    : true)
                "
              >
                {{ item.text }}
              </el-button>
            </template>
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
          :isMountedRequest="!(index === 2) /* 防止重复调预报货物接口 */"
          :httpRequest="(params) => handleRequest(index, params)"
          :getQueryParams="() => getQueryParams(index)"
          :pagination="false"
          @getResult="(obj) => getResult(index, obj)"
          :tableHeight="tableAutoHeight(index)"
          :spanMethod="
            [1, 2, 5].includes(index) && formModel.quickOrder != 1
              ? handleSpanMethod
              : null
          "
          :extraConfig="{
            stripe: false,
          }"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'img'">
              <div class="staff-preview-image">
                <el-image
                  :src="slotProps.row.img || productDefaultLogo"
                  :preview-src-list="[slotProps.row.img]"
                />
              </div>
            </template>
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
                :currentVal="slotProps.row.totalboxVolume"
                :verifyVal="slotProps.row.warehousingTotalVolume"
                :decimal="slotProps.column.decimal"
                :isNumIntercept="true"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingTotalVolume !== null"
              />
              <span v-else>{{
                interceptNum(
                  slotProps.row.totalboxVolume,
                  slotProps.column.decimal
                )
              }}</span>
            </template>
            <template v-if="slotProps.prop === 'totalWeight'">
              <DiffMark
                :currentVal="slotProps.row.totalBoxWeight"
                :verifyVal="slotProps.row.warehousingTotalWeight"
                :showCurrentVal="false"
                :showVerifyVal="false"
                v-if="slotProps.row.warehousingTotalWeight !== null"
              />
              <span v-else>{{ slotProps.row.totalBoxWeight }}</span>
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
                :showCurrentVal="false"
                :showVerifyVal="false"
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
          @getResult="(obj) => getResult(index, obj)"
          :tableHeight="tableAutoHeight(index)"
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
              <div class="table-preview-image">
                <el-image
                  :src="slotProps.row.img || productDefaultLogo"
                  :preview-src-list="[slotProps.row.img]"
                />
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
                <span>{{ toFixedNum(slotProps.row.productWeight) }}</span>
              </el-row>
              <el-row class="ellipsis-text">
                <span>{{ toFixedNum(slotProps.row.productNetWeight) }}</span>
              </el-row>
            </template>
            <template v-if="slotProps.prop === 'declaredValue'">
              <el-row class="ellipsis-text">
                <span>{{ toFixedNum(slotProps.row.declaredValue) }}</span>
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
              </el-row>
            </div>
            <DiffMark
              v-else
              :label="gross.label"
              :util="gross.util"
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
    <!-- @handleChange="() => handleMaintainChange(0)" -->
    <MaintainCabinet
      ref="maintainCabinet"
      @handleChange="handleUpdateView"
      :basicData="formModel"
    />
    <!-- @handleChange="() => handleMaintainChange(1)" -->
    <!-- operationType 1:客户端  2：操作单 3：清关 4：国内仓库 -->
    <MaintainGoods
      ref="MaintainGoods"
      @handleChange="handleUpdateView"
      :basicData="formModel"
      :operationType="2"
    />
    <OrderMaintainGoods
      ref="orderMaintainGoodsRef"
      :basicData="formModel"
      :type="3"
      @handleChange="handleUpdateView"
    />
    <ComUpload
      style="display: none"
      ref="productUploadRef"
      :uploadConfig="{
        ...productUploadConfig,
        fragmentationUpload: false,
        url:
          importType === 5
            ? importClearanceProductInvoice
            : importGoodsRelationProduct,
        uploadData: {
          orderId: formModel.id,
          operationOrderId: formModel.operationOrderId,
          importType: importType,
          customerId: formModel.customerId,
        },
      }"
      @handleSuccess="(res) => uploadSuccess(res)"
      @handleError="handleImportErr"
      @handleUploading="handleUploading"
    />

    <SendEmail
      ref="emailRef"
      :paramObj="{
        operationOrderId: formModel.operationOrderId,
        customerId: formModel.customerId,
        salesmanId: formModel.salesman,
        kaIdList: formModel.kaIdList,
        webMailTag: 'goods_hw',
      }"
    />
  </div>
</template>

<script>
import {
  getFreightList,
  getTakeList,
  getBoxList,
  getFreightProductList,
  exportOrderGoods,
} from "@/api/order/firstTransport.js";
import { selectClearanceInvoice } from "@/api/operateRecord/clearanceGoods.js";
import { comSaveRepeatedRequest } from "@/api/common";
import { accumulationFn, multiplicationFn } from "@/utils/instructions";
import productDefaultLogo from "@/assets/image/product_default.svg";
import { comFileDownload } from "@/utils/download.js";
import { mixinImportConf } from "../mixinImportConf.js";
import { mapActions, mapState } from "vuex";
import {
  customerInvoiceTable,
  goodsTable,
  predictionGoodsTable,
  cabinetTable,
  pickTable,
  productTable,
} from "./model";
import {
  importGoodsRelationProduct,
  importClearanceProductInvoice,
} from "_comp/ComUpload/model";
import {
  mergeColumnProps, // 分列行
} from "../tableModel";
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
    disabled: {
      type: Boolean,
      default: false,
    },
    showTable: {
      type: Array,
      default: () => [1, 2, 3, 5], // 0=整柜，4=产品去掉
    },
  },
  mixins: [mixinImportConf],
  components: {
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
    MaintainCabinet: () =>
      import("@/views/operateManage/components/MaintainCabinet"),
    MaintainGoods: () => import("_comp/ECMaintainGoods/verify"),
    OrderMaintainGoods: () => import("_comp/ECMaintainGoods"),
    SendEmail: () => import("_comp/ComLogistTrack/components/SendEmail"),
  },
  data() {
    return {
      productDefaultLogo,
      importGoodsRelationProduct,
      importClearanceProductInvoice,
      tableTotalArr: [0, 0, 0, 0, 0, 0], // 计算高度
      table: [
        {
          index: 5,
          item: customerInvoiceTable,
        },
        // {
        //   index: 0,
        //   item: cabinetTable,
        // },
        {
          index: 1,
          item: goodsTable(),
        },
        {
          index: 2,
          item: predictionGoodsTable,
        },
        {
          index: 3,
          item: pickTable,
        },
        // {
        //   index: 4,
        //   item: productTable,
        // },
      ],
      tableData: [],
      httpRequest: {
        5: selectClearanceInvoice,
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
      importType: 2,
    };
  },
  mounted() {},
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
        const {
          operationOrderNum,
          customerShortName,
          bailorPeople,
          createTime,
          customerId,
        } = this.formModel;
        this.$refs.MaintainGoods.show(this.formModel);
      } else if (type === "verifyGoods") {
        comFileDownload(this, exportOrderGoods, this.exportVerifyGoods());
      } else if (type === 2) {
        this.importType = 2;
        this.handleImport();
      } else if (type === 3) {
        this.importUrlXlsx();
      } else if (type === 4) {
        this.$refs.orderMaintainGoodsRef.show(this.formMode);
      } else if (type === 5) {
        this.importType = 2;
        this.handleImport(true);
      } else if (type === "goodsEmail") {
        // console.log('formModel==', this.formModel)
        comSaveRepeatedRequest(exportOrderGoods, this.exportVerifyGoods()).then(
          (gRes) => {
            this.$refs.emailRef.show({
              goodsFilePath: gRes.data,
            });
          }
        );
      } else if (type === 6) {
        this.importUrlXlsxCustomer();
      } else if (type === 7) {
        this.importType = 5;
        this.handleImport();
      } else if (type === 8) {
        this.importType = 5;
        this.handleMaintainGoods();
      }
    },
    handleRequest(index, params) {
      const reqs = {
        5: {
          //客户箱单发票
          httpRequest: selectClearanceInvoice,
          type: "customerInvoice",
        },
        0: {
          //整柜信息
          httpRequest: getBoxList,
          type: "boxList",
        },
        1: {
          //核实货物信息
          httpRequest: getBoxList,
          type: "verFreightList",
        },
        2: {
          //预报货物信息
          httpRequest: getFreightList,
          type: "freightList",
        },
        3: {
          //提货信息
          httpRequest: getTakeList,
          type: "takeList",
        },
        4: {
          //产品信息
          httpRequest: getFreightProductList,
          type: "freightProductList",
        },
      };
      return new Promise((resolve, reject) => {
        reqs[index].httpRequest(params).then((res) => {
          if (res.data && !res.rows) {
            res.rows = res.data;
          }
          if (index === 5) {
            const obj = {};
            res.data.invoiceEcDtoList.forEach((item, i) => {
              if (obj[item.goodsId]) {
                obj[item.goodsId].num += 1;
              } else {
                obj[item.goodsId] = {
                  index: i,
                  num: 1,
                };
              }
            });
            res.rows = res.data.invoiceEcDtoList.map((item, i) => ({
              ...item,
              mergeColumn:
                i === obj[item.goodsId].index ? obj[item.goodsId].num : 0,
            }));
          }
          if (index === 2) {
            res.rows = res.rows.map((item) => {
              //预报毛重小计取totalBoxWeight   体积小计取totalboxVolume
              return {
                ...item,
                calcVolume: item.totalboxVolume,
                calcWeight: item.totalBoxWeight,
                calcBoxCount: item.boxCount,
              };
            });
          }
          if (reqs[index].type) {
            this.$emit("tableList", {
              [reqs[index].type]: res,
            });
          }
          if (index === 5) {
            const {
              data: {
                invoiceEcDtoList,
                totalBoxCount,
                totalVolume,
                totalWeight,
              },
              ...other
            } = res;
            this.grossTotal[index] = {
              ...other,
              rows: invoiceEcDtoList,
              totalBoxCount,
              totalVolume,
              totalWeight,
            };
            const tableIndex = this.table.findIndex(
              (item) => item.index === index
            );
            this.table[tableIndex].item.grossTotal.map((item) => {
              this.$set(item, "total", this.grossTotal[index][item.prop]);
            });
          } else {
            this.grossTotal[index] = res;
          }
          if (index == 0 && res && res.rows) {
            res = {
              ...res,
              ...this.handleData(res.rows),
            };
          }
          if (index === 1) {
            // 核实货物后响应，再获取预报货物，才能正确进行数值合计比较
            this.$refs[`tableConfig${2}`] &&
              this.$refs[`tableConfig${2}`][0]?.refreshTable();
          }
          if (index === 2) {
            // 预报货物
            this.$emit("onForecastGoodsList", res || {});
          }
          // 核实、预报货物，合并行
          const list = [];
          if (
            [1, 2].includes(index) &&
            (index !== 2 || this.formModel.quickOrder !== 1)
          ) {
            res.rows.map((item) => {
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
    getFreightList() {
      const { orderId: orderEcId, operationOrderId } = this.formModel;
      getFreightList({
        orderEcId,
        operationOrderId,
      }).then((res) => {
        this.$emit("tableList", {
          freightList: res,
        });
      });
    },
    handleData(data) {
      let totalWeight = 0;
      let totalVolume = 0;
      const rows = data.map((item) => {
        if (!item.deleted) {
          totalWeight = accumulationFn([totalWeight, item.weight]);
          totalVolume = accumulationFn([totalVolume, item.volume]);
        }
        let { warehousingTotalVolume, warehousingTotalWeight, weight, volume } =
          item;
        item.warehousingTotalWeight =
          warehousingTotalVolume && warehousingTotalWeight
            ? warehousingTotalWeight
            : weight;
        item.warehousingTotalVolume =
          warehousingTotalVolume && warehousingTotalWeight
            ? warehousingTotalVolume
            : volume;
        return item;
      });
      return {
        rows,
        subtotalWeight: totalWeight,
        subtotalVolume: totalVolume,
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
      if (index === 4) {
        return {
          orderEcId,
          operationOrderId,
        };
      }
      if (index === 5) {
        return {
          operationOrderId,
          importType: 5,
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
    getResult(index, { total }) {
      this.$set(this.tableTotalArr, index, total);
      if (index === 5) return;
      //计算货物总数
      const tableIndex = this.table.findIndex((item) => item.index === index);
      if (tableIndex > -1 && this.grossTotal[index].code === 200) {
        if (!this.table[tableIndex].item.grossTotal) return;
        this.table[tableIndex].item.grossTotal.map((item) => {
          let totalTop = 0;
          let totalBtm = 0;
          let total = 0;
          this.grossTotal[index].rows.map((result) => {
            if (
              [1, 2].includes(index) &&
              (index !== 2 || this.formModel.quickOrder !== 1)
            ) {
              if (!result.mergeColumn) return;
            }
            if (item.compute) {
              totalTop = accumulationFn([
                totalTop,
                multiplicationFn([
                  result[item.factor[0].propTop],
                  result[item.factor[1].propTop],
                ]),
              ]);
              totalBtm = accumulationFn([
                totalBtm,
                multiplicationFn([
                  result[item.factor[0].propBtm],
                  result[item.factor[1].propBtm],
                ]),
              ]);
              total = accumulationFn([
                total,
                multiplicationFn([
                  result[item.factor[0].prop],
                  result[item.factor[1].prop],
                ]),
              ]);
            } else {
              totalTop = accumulationFn([totalTop, result[item.propTop]]);
              totalBtm = accumulationFn([totalBtm, result[item.propBtm]]);
              total = accumulationFn([total, result[item.prop]]);
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
    tableAutoHeight(idx) {
      return this.tableTotalArr[idx] > 9 ? `${10 * 39 + 54}px` : undefined;
    },
    handleUpdateView() {
      [0, 1, 2, 3, 4, 5].forEach((e) => {
        this.$refs[`tableConfig${e}`] &&
          this.$refs[`tableConfig${e}`][0]?.refreshTable();
      });
    },
    exportVerifyGoods() {
      const { operationOrderId, freightType, orderType, isMainBill } =
        this.formModel;
      return {
        operationOrderId,
        freightType: Number(freightType || 0),
        orderType,
        verifyStatus: Number(freightType || 0) || isMainBill ? 1 : undefined, // 主单和散货
      };
    },
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
    }),
  },
};
</script>

<style lang="scss" scoped>
.detail-table {
  // border-top: 1px solid #e2e2e2;
  /deep/ {
    .tableData .table-header-cell {
      background-color: #f8f8f8;
    }
    .goods-table {
      .el-table td {
        // vertical-align: top;

        .cell {
          line-height: 28px;
        }
      }
      .el-table--medium .el-table__cell {
        padding: 4px 0;
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
        background: #95dcb7;
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
        margin-right: 5px;
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
  .staff-preview-image {
    justify-content: flex-end;
  }
}
</style>
