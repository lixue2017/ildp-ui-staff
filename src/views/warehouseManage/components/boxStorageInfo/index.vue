<template>
  <!-- 入仓详情按箱或按SKU，仅用于详情，不用于编辑 -->
  <div>
    <div v-for="(item, index) in getTableList()" :key="index">
      <div v-if="isInit && getShowTable(index)">
        <div class="table-title">
          {{ requestObj[menuType] && requestObj[menuType].title[index] }}
        </div>
        <div>
          <ComTable
            :ref="`tableRef${index}`"
            :columnConfig="getTableColumns(index)"
            :columnData="tableConfig.columnData[index]"
            :tableHeight="tableAutoHeight(index)"
            :rowOperationBtnListFn="(r) => rowBtnListFn(r)"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'volume'">
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
                  <span>{{ slotProps.row.productName }}</span>
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'code'">
                <el-row class="ellipsis-text">
                  <span>{{ slotProps.row.hsCode || "--" }}</span>
                </el-row>
                <el-row class="ellipsis-text">
                  <span>{{ slotProps.row.asin || "--" }}</span>
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'weight'">
                <el-row class="ellipsis-text">
                  <span>{{
                    toFixedNum(
                      slotProps.row.singleBoxWeight,
                      slotProps.column.decimal || 0
                    ) || "--"
                  }}</span>
                </el-row>
                <el-row class="ellipsis-text">
                  <span>{{
                    toFixedNum(
                      slotProps.row.productNetWeight,
                      slotProps.column.decimal || 0
                    ) || "--"
                  }}</span>
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
                  <span>{{ slotProps.row.packingTrackingNum || "--" }}</span>
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
    <ChangeNumDialog ref="cNumRef" />
  </div>
</template>

<script>
import {
  getThirdPartyReceiptList,
  getClearanceOrderBoxReceiptInfo,
  POSTRcOrderStorageInfoNew,
} from "@/api/warehouse/prediction.js";
import {
  getProductOrderEc,
  getEcProductThirdPartyOrder,
  getEcProductClearance,
} from "@/api/order/firstTransport.js";
import {
  buttOrderTableList,
  thirdPartyTableList,
  overSeasTableList,
  buttOrderTotal,
  thirdPartyTotal,
  overSeasTotal
} from "./model.js";
import productDefaultLogo from "@/assets/image/product_default.svg";
import { mapActions } from "vuex";
import { multiplicationFn, accumulationFn } from "@/utils/instructions";
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
    ChangeNumDialog: () =>
      import(
        "@/views/warehouseManage/warehouseManage/putIn/components/trayDetail/changeDlg.vue"
      ),
  },
  data() {
    return {
      productDefaultLogo,
      tableConfig: {
        columnData: [],
      },
      requestObj: {
        buttOrder: {
          //电商入仓
          title: [
            `${this.overseaLangObj.ysh_info || "已收货信息"}`,
            `${this.overseaLangObj.forecast_cargo_info || "预报货物信息"}`,
            `${this.overseaLangObj.product_info || "产品信息"}`,
          ],
          tableLists: ["verify", "prediction", "product"],
          goodsHttpRequest: POSTRcOrderStorageInfoNew,
          productHttpRequest: getProductOrderEc,
          tableConfigLists: buttOrderTableList,
          totalConfig: buttOrderTotal,
          show: {
            dataLength: [0], //数据>0展示
          },
        },
        thirdParty: {
          //第三方入仓
          title: [
            `${this.overseaLangObj.ysh_info || "已收货信息"}`,
            `${this.overseaLangObj.forecast_cargo_info || "预报货物信息"}`,
            `${this.overseaLangObj.product_info || "产品信息"}`,
          ],
          tableLists: ["verify", "prediction", "product"],
          goodsHttpRequest: getThirdPartyReceiptList,
          productHttpRequest: getEcProductThirdPartyOrder, //需要替换成第三方的产品接口，目前没有
          tableConfigLists: thirdPartyTableList,
          totalConfig: thirdPartyTotal,
        },
        overSeas: {
          //海外入仓
          title: [
            `${this.overseaLangObj.ysh_info || "已收货信息"}`,
            `${this.overseaLangObj.forecast_cargo_info || "预报货物信息"}`,
            `${this.overseaLangObj.product_info || "产品信息"}`,
          ],
          tableLists: ["verify", "prediction", "product"],
          goodsHttpRequest: getClearanceOrderBoxReceiptInfo,
          productHttpRequest: getEcProductClearance, //需要替换成海外入仓的产品接口，目前没有
          tableConfigLists: overSeasTableList,
          totalConfig: overSeasTotal,
        },
      },
      tableBtnList: [
        {
          text: "更改",
          handleClick: (row) => {
            this.$refs.cNumRef?.twsShow(row, {
              successFn: () => this.getTableData(true),
            });
          },
        },
      ],
      isInit: false,
      totalObj:{}
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getTableData(noRefresh) {
      this.isInit = false;
      const tableHttpRequest = this.requestObj[this.menuType].goodsHttpRequest;
      const productHttpRequest =
        this.requestObj[this.menuType].productHttpRequest;
      const { id, operationOrderId } = this.formData;
      let httpList = [];
      if (tableHttpRequest) {
        if (this.menuType === "buttOrder") {
          httpList.push(tableHttpRequest(id, operationOrderId));
        } else {
          httpList.push(tableHttpRequest(id));
        }
      }
      if (productHttpRequest && !noRefresh) {
        const url_id = this.menuType === "buttOrder" ? id || operationOrderId : id;
        httpList.push(productHttpRequest(url_id));
      }
      Promise.all(httpList).then(([goodsRes, productRes]) => {
        const {
          orderEcFreightListVos,
          ecOkwarehouseStorages,
          okReceiptVOSkuList,
          noReceiptVOSkuList,
          noReceiptVOBoxList,
          okReceiptVOBoxList,
        } = goodsRes.data || {};
        const productData = noRefresh
          ? this.tableConfig.columnData[2]
          : productRes?.data || [];
        this.tableConfig.columnData = [
          ecOkwarehouseStorages || okReceiptVOBoxList || okReceiptVOSkuList, //核实
          orderEcFreightListVos || noReceiptVOBoxList || noReceiptVOSkuList, //预报
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
      const [verifyLists,predictionLists,product]=this.tableConfig.columnData
      this.totalObj = {
        verifyWeight: accumulationFn(verifyLists.map((e) => multiplicationFn([e.weight,e.freightNum]))),//电商
        verifyVolume: accumulationFn(verifyLists.map((e) => multiplicationFn([e.volume,e.freightNum]))),//电商
        verifyFreightNum: accumulationFn(verifyLists.map((e) => e.freightNum)), //电商
        verifyBoxWeight: accumulationFn(verifyLists.map((e) => multiplicationFn([e.boxWeight,e.num]))),//第三方
        verifyBoxVolume: accumulationFn(verifyLists.map((e) => multiplicationFn([e.boxVolume,e.num]))),//第三方
        verifyNum: accumulationFn(verifyLists.map((e) => e.num)), //第三方，海外入仓
        verifyBoxWeightSum: accumulationFn(verifyLists.map((e) => e.boxWeightSum)), //海外入仓
        verifyBoxVolumeSum: accumulationFn(verifyLists.map((e) => e.boxVolumeSum)), //海外入仓
        preWeight: accumulationFn(predictionLists.map((e) => multiplicationFn([e.weight,e.forecastBoxNum]))),//电商
        preVolume: accumulationFn(predictionLists.map((e) => multiplicationFn([e.volume,e.forecastBoxNum]))),//电商
        preForecastBoxNum: accumulationFn(predictionLists.map((e) => e.forecastBoxNum)), //电商
        preTakeFreightBoxNum: accumulationFn(predictionLists.map((e) => e.takeFreightBoxNum)), //电商
        preBoxWeight: accumulationFn(predictionLists.map((e) => multiplicationFn([e.boxWeight,e.predictionNum]))),//第三方，海外入仓
        preBoxVolume: accumulationFn(predictionLists.map((e) => multiplicationFn([e.boxVolume,e.predictionNum]))),//第三方，海外入仓
        prePredictionNum: accumulationFn(predictionLists.map((e) => e.predictionNum)), //第三方，海外入仓
        preArrivalNum: accumulationFn(predictionLists.map((e) => e.arrivalNum)), //第三方，海外入仓
        proLength: (product||[]).length,//电商，第三方
        proNumTotal:accumulationFn(product.map((e) => e.singleBoxNum)), //电商，第三方,海外入仓
      };
    },
    getShowTable(index) {
      //根据不同的条件判断是否展示当前TABLE内容
      const { show } = this.requestObj[this.menuType];
      if (show?.dataLength.includes(index)) {
        if (this.tableConfig.columnData[index].length) return true;
      } else {
        return true;
      }
    },
    rowBtnListFn(row) {
      /**
       * 0：SKU存仓，1：整箱存仓，2：大货中转
       * 海外入仓收货  ["2", "1", "0"][storageType]
       * 第三方入库收货  ["1", "0"][storageType - 1]
       * 电商头程入库单 ['1', '2', '0'][storageWay]
       */
      // 大货中转显示
      if (this.menuType === "buttOrder") {
        if (row.storageWay === 1) {
          return this.tableBtnList;
        }
      }
      if (this.menuType === "overSeas") {
        if (row.storageType === 0) {
          return this.tableBtnList;
        }
      }
      return [];
    },
    tableAutoHeight(idx) {
      const tableLen = this.tableConfig.columnData[idx].length;
      return tableLen > 10 ? `${11 * 39 + 54}px` : undefined;
    },
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
.flex {
  display: flex;
  .flex-interval {
    display:flex;
    margin-left: 25px;
  }
}
</style>
