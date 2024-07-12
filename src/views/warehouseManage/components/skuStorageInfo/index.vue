<template>
  <!-- 入仓详情按箱或按SKU，仅用于详情，不用于编辑 -->
  <div>
    <div v-for="(item, index) in getTableList()" :key="index">
      <div v-if="isInit">
        <div class="table-title">
          {{ requestObj[menuType] && requestObj[menuType].title[index] }}
        </div>
        <div>
          <ComTable
            :ref="`tableRef${index}`"
            :columnConfig="getTableColumns(index)"
            :columnData="tableConfig.columnData[index]"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-for="item in ['shipmentIds', 'referenceIds']">
                <div :key="item" v-if="slotProps.prop == item">
                  <div
                    v-for="(skuItem, skuIndex) in slotProps.row[item]"
                    :key="skuIndex"
                  >
                    {{ skuItem }}
                  </div>
                </div>
              </template>
            </template>
            <template v-slot:bottomTotal>
              <div class="grand-total" v-if="requestObj[menuType].totalConfig">
                  <div class="flex">
                    <span class="title">小计：</span>
                    <template
                      v-for="(cItem, cIndex) in requestObj[
                        menuType
                      ].totalConfig(index)"
                    >
                      <div v-if="index == 0" :key="cIndex" class="flex-interval">
                        <span>{{ cItem.label }}：</span>
                        <span>{{
                          toFixedNum(totalObj[cItem.value], cItem.decimal || 0)
                        }}</span>
                      </div>
                      <div v-else :key="cIndex" class="flex-interval">
                        <span>{{ cItem.label }}：</span>
                        <span v-if="cItem.verifyParams">
                          <DiffMark
                            :currentVal="totalObj [cItem . value]"
                            :verifyVal="totalObj[cItem . verifyParams]"
                            :decimal="cItem.decimal || 0"
                            :showCurrentVal="false"
                            :showVerifyVal="false"
                          />
                        </span>
                        <span v-else>
                          {{toFixedNum(totalObj[cItem.value], cItem.decimal || 0)}}
                        </span>
                      </div>
                    </template>
                  </div>
              </div>
            </template>
          </ComTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getThirdPartyReceiptList,
  getClearanceOrderProductReceiptInfo,
  getEcOrderWarehouseskuStorageInfo
} from "@/api/warehouse/prediction.js";
import { thirdPartyTableList, overSeasTableList,buttOrderTableList,buttOrderTotal,thirdPartyTotal,overSeasTotal } from "./model.js";
import { mapActions } from "vuex";
import { accumulationFn,multiplicationFn } from "@/utils/instructions";
export default {
  props: {
    menuType: {
      type: String,
      default: "",
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
  },
  data() {
    return {
      tableConfig: {
        columnData: [],
      },
      requestObj: {
        thirdParty: {
          title: [this.overseaLangObj.ysh_info, this.overseaLangObj.forecast_cargo_info],
          tableLists: ["verify", "prediction"],
          goodsHttpRequest: getThirdPartyReceiptList,
          tableConfigLists: thirdPartyTableList,
          totalConfig:thirdPartyTotal
        },
        overSeas: {
          title: [this.overseaLangObj.ysh_info, this.overseaLangObj.forecast_cargo_info],
          tableLists: ["verify", "prediction"],
          goodsHttpRequest: getClearanceOrderProductReceiptInfo,
          tableConfigLists: overSeasTableList,
          totalConfig:overSeasTotal
        },
        buttOrder: {
          title: [
            `${this.overseaLangObj.ysh_info || "已收货信息"}`,
            `${this.overseaLangObj.forecast_cargo_info || "预报货物信息"}`,
          ],
          tableLists: ["verify", "prediction"],
          goodsHttpRequest: getEcOrderWarehouseskuStorageInfo,
          tableConfigLists: buttOrderTableList,
          totalConfig:buttOrderTotal
        },
      },
      isInit: false,
      totalObj:{}
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getTableData() {
      this.isInit = false;
      const tableHttpRequest = this.requestObj[this.menuType].goodsHttpRequest;
      const productHttpRequest =
        this.requestObj[this.menuType].productHttpRequest;
      const { id, operationOrderId } = this.formData;
      let goodsParams, profuctParams;
      if (this.menuType == "thirdParty") {
        goodsParams = id;
      } else if (this.menuType == "overSeas") {
        goodsParams = id;
      } else if (this.menuType == "buttOrder") {
        goodsParams = {
          orderId: id,
          operationOrderId,
        };
      }
      const httpList = [
        tableHttpRequest && tableHttpRequest(goodsParams),
        productHttpRequest && productHttpRequest(profuctParams),
      ].filter((e) => e);
      Promise.all(httpList).then(([goodsRes, productRes]) => {
        const {
          orderEcFreightListVos,
          ecOkwarehouseStorages,
          okReceiptVOSkuList,
          noReceiptVOSkuList,
          noProductReceiptVOS,
          okProductgReceiptVOS,

        } = goodsRes.data || {};
        const productData = productRes?.data || [];
        this.tableConfig.columnData = [
          ecOkwarehouseStorages || okReceiptVOSkuList || okProductgReceiptVOS, //核实
          orderEcFreightListVos || noReceiptVOSkuList || noProductReceiptVOS, //预报
          productData, //产品
        ];
        this.getTotalData()
        this.isInit = true;
      });
    },
    getTableColumns(index) {
      const tableConfig = this.requestObj[this.menuType].tableConfigLists;
      return tableConfig({ index });
    },
    getTableList() {
      const lists = this.requestObj[this.menuType].tableLists;
      return lists;
    },
    getTotalData(){
      const [verifyLists,predictionLists,...arr]=this.tableConfig.columnData
      this.totalObj = {
        verifyWeight: accumulationFn(verifyLists.map((e) => e.weight)),//电商
        verifyVolume: accumulationFn(verifyLists.map((e) => e.volume)),//电商
        verifyTotleWeight: accumulationFn(verifyLists.map((e) => e.totleWeight)),//电商
        verifyTotleVolume: accumulationFn(verifyLists.map((e) => e.totleVolume)),//电商
        verifyFreightNum: accumulationFn(verifyLists.map((e) => e.freightNum)),//电商
        verifyBoxWeight: accumulationFn(verifyLists.map((e) => multiplicationFn([e.boxWeight,e.num]))),//第三方
        verifyBoxVolume: accumulationFn(verifyLists.map((e) => multiplicationFn([e.boxVolume,e.num]))),//第三方
        verifyNum: accumulationFn(verifyLists.map((e) => e.num)),//第三方，海外入仓
        verifySkuWeight:accumulationFn(verifyLists.map((e) => e.skuWeight)),//海外入仓
        verifySkuVolume:accumulationFn(verifyLists.map((e) => e.skuVolume)),//海外入仓
        verifySkuWeightSum:accumulationFn(verifyLists.map((e) => e.skuWeightSum)),//海外入仓
        verifySkuVolumeSum:accumulationFn(verifyLists.map((e) => e.skuVolumeSum)),//海外入仓
        preWeight: accumulationFn(predictionLists.map((e) => multiplicationFn([e.weight,e.takeFreightSkuNum]))),//电商
        preVolume: accumulationFn(predictionLists.map((e) => multiplicationFn([e.volume,e.takeFreightSkuNum]))),//电商
        preForecastSkuNum:accumulationFn(predictionLists.map((e) => e.forecastSkuNum)),//电商
        preTakeFreightSkuNum: accumulationFn(predictionLists.map((e) => e.takeFreightSkuNum)),//电商
        preBoxWeight: accumulationFn(predictionLists.map((e) => multiplicationFn([e.boxWeight,e.arrivalNum]))),//第三方
        preBoxVolume: accumulationFn(predictionLists.map((e) => multiplicationFn([e.boxVolume,e.arrivalNum]))),//第三方
        prePredictionNum: accumulationFn(predictionLists.map((e) => e.predictionNum)),//第三方，海外入仓
        preArrivalNum: accumulationFn(predictionLists.map((e) => e.arrivalNum)),//第三方，海外入仓
        preSkuWeight:accumulationFn(predictionLists.map((e) => multiplicationFn([e.skuWeight,e.arrivalNum]))),//海外入仓
        preSkuVolume:accumulationFn(predictionLists.map((e) => multiplicationFn([e.skuVolume,e.arrivalNum]))),//海外入仓
      };
    }
  },
};
</script>

<style lang="scss" scoped>
.table-title {
  margin-top: 15px;
  margin-bottom: 15px;
  border: none;
  color: #515151;
  font-weight: bold;
}
.pics-box {
  img {
    width: 50px;
    height: 40px;
    vertical-align: middle;
  }
}
.flex {
  display: flex;
  .flex-interval {
    display:flex;
    margin-left: 25px;
  }
}
</style>
