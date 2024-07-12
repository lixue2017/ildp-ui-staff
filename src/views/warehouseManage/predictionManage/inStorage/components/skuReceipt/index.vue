<template>
  <div>
    <div v-for="(item, index) in getTableList()" :key="index">
      <div v-if="isInit">
        <div class="table-title base-flex-between">
          <span>{{ requestObj[menuType] && requestObj[menuType].title[index] }}</span>
					<el-button
            v-if="index === 0"
            type="primary"
            size="small"
            plain
            @click="() => handleVerify(selectionRows)"
            :disabled="disabledRows(1)"
            >{{ overseaLangObj.cp_pl_hs("产品批量核实") }}</el-button
          >
        </div>
        <div>
          <ComTable
            :ref="`tableRef${index}`"
            :columnConfig="getTableColumns(index)"
            :columnData="tableConfig.columnData[index]"
            @onSelectionChange="selectionChange"
            :selectionRow="selectionRowEvt"
            :selectionTableRow="[...selectionRows]"
            :rowOperationBtnListFn="rowOperationBtnListFn"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'sku'">
                <span class="marking" v-if="!slotProps.row.isVerify&&index!=1">
                  {{ overseaLangObj.first_entry("首次入仓") }}
                </span>
                <el-row class="ellipsis-text">
                  {{ slotProps.row.sku }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'takeAmountSku'">
                <div v-if="slotProps.row.isVerify">
                  <el-input-number
                    size="mini"
                    v-model="slotProps.row.takeAmountSku"
                    v-input-number-limit="0"
                    :min="1"
                    :max="999999"
                    :placeholder="slotProps.column.label"
                    @keyup.native="
                      formatNumber(slotProps.row,'takeAmountSku')
                    "
                    @blur="formatNumber(slotProps.row,'takeAmountSku')"
                    :controls="false"
                  />
                </div>
                <div v-else>
                  {{ slotProps.row.takeAmountSku || "--" }}
                </div>
              </template>

              <template v-for="item in ['verifyWeight', 'verifyLength', 'verifyWidth', 'verifyHeight']">
                <div :key="item" v-if="slotProps.prop === item">
                  <div v-if="!slotProps.row.isVerify">
                    <el-input-number
                      size="mini"
                      v-model="slotProps.row[item]"
                      v-input-number-limit="slotProps.column.decimal || 2"
											:min="minLimitNumber(slotProps.column.decimal || 2)"
                      :placeholder="slotProps.column.label"
                      :controls="false"
                    />
                  </div>
                  <div v-else>
                    <span>
                      {{ slotProps.row[item] }}
                    </span>
                  </div>
                </div>
              </template>
              <template v-if="slotProps.prop === 'freightNum'">
                <div>
                  <div v-if="slotProps.row.isUpdate==1">
                    <el-input-number
                    size="mini"
                    v-model="slotProps.row.freightNum"
                    v-input-number-limit="0"
                    :min="1"
                    :max="999999"
                    :placeholder="slotProps.column.label"
                    @keyup.native="
                      formatNumber(slotProps.row,'freightNum')
                    "
                    @blur="formatNumber(slotProps.row,'freightNum')"
                    :controls="false"
                  />
                  </div>
                  <div v-else>
                    <span>{{ slotProps.row.freightNum }}</span>
                  </div>
                </div>
              </template>
              <template v-if="slotProps.prop === 'operation'">
              <div class="operation-content-btn">
                <template
                  v-for="(item, index) in predictionStatusList"
                >
                  <el-button
                  v-if="item.showStatus.includes(slotProps.row.isUpdate)"
                    :key="index"
                    size="small"
                    type="text"
                    :style="{ color: item.color }"
                    v-throttle
                    @click="item.handleClick(slotProps.row)"
                    >{{ item.text }}</el-button
                  >
                </template>
              </div>
            </template>
            </template>
            <template v-slot:bottomTotal="{ slotProps }">
                <div class="grand-total" v-if="index==1">
                  <div class="tableTotal-flex">
                    <span class="title">小计：</span>
                    <div class="tableTotal-flex ">
                      <div v-for="(item,index) in getDataSummary(tableConfig.columnData[index])" :key="index" class="item-space">
                      <span>{{ item.label }}：</span>
                      <span>{{ item.total }}</span>
                      </div>
                    </div>
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
  getEcOrderWarehouseskuStorageInfo,
  postSkuBatchVerification,
} from "@/api/warehouse/prediction.js";
import { buttOrderTableList } from "./model.js";
import {
  subtractFn,
} from "@/utils/instructions";
import {updateReceipt,deleteReceipt} from '@/api/warehouse/prediction.js'
import { eCommerceTotalLists } from "../tDmodel";
import {  accumulationFn } from "@/utils/instructions";
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
    ComForm: () => import("_comp/ComForm"),
  },
  data() {
    return {
      isInit: false,
      selectionRows: [],
      tableConfig: {
        columnData: [[], []],
      },
      requestObj: {
        buttOrder: {
          //海外仓库管理-入库预报管理-电商SKU收货
          title: ["预报货物信息", "已收货信息"],
          tableLists: ["prediction", "verify"],
          goodsHttpRequest: getEcOrderWarehouseskuStorageInfo,
          tableConfigLists: buttOrderTableList,
        },
      },
      statusList: [
        {
          text: this.overseaLangObj.cp_hs || "产品核实",
          showVerify: [0],
          handleClick: (r) => this.handleVerify([r]),
        },
      ],
      predictionStatusList: [
        {
          text: "修改",
          showStatus:[0],
          handleClick: (row)=>{
            console.log('row',row)
            row.isUpdate=1
          },
        },
        {
          text: "删除",
          showStatus:[0],
          handleClick: (row)=>{
            this.deletePreData(row)
          },
        },
        {
          text: "保存",
          showStatus:[1],
          handleClick: (row)=>{
            this.savePreData(row)
          },
        },
        {
          text: "取消",
          showStatus:[1],
          handleClick: (row)=>{
            row.isUpdate=0
          },
        },
      ],
    };
  },
  mounted() {
    // this.getTableData();
  },
  methods: {
    getTableData() {
      this.isInit = false;
      this.selectionChange([]);
      const { orderEcId, orderOperationId } = this.formData;
      const httpRequest = this.requestObj[this.menuType].goodsHttpRequest;
      let goodsParams;
      if (this.menuType == "buttOrder") {
        goodsParams = {
          orderId: orderEcId,
          operationOrderId: orderOperationId,
        };
      }
      httpRequest(goodsParams).then((res = {}) => {
        let { orderEcFreightListVos,ecOkwarehouseStorages } = res.data || {};
				let skuFirstIds = [];
        orderEcFreightListVos.forEach((e)=>{
            const {forecastSkuNum, takeFreightSkuNum}=e
            const total=subtractFn([forecastSkuNum,takeFreightSkuNum])
            e.takeAmountSku = total > 0 ? total : 1
						if (!e.isVerify && !skuFirstIds.includes(e.productId)) {
							e.isFirstSku = true; // 相同SKU批量核实时取第一条数据
							skuFirstIds.push(e.productId);
						}
          })
          ecOkwarehouseStorages.forEach((e)=>{
            e.isUpdate=0
          })
        this.tableConfig.columnData = [
          orderEcFreightListVos, //预报
          ecOkwarehouseStorages, //核实
        ];
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
    rowOperationBtnListFn(row) {
      return this.statusList.filter((e) => {
        return e.showVerify.includes(row.isVerify);
      });
    },
    handleVerify(rows) {
      let errMsg = [];
      const vOpt = (rows || []).map((m) => {
        if (!m.verifyWeight) {
          errMsg.push("毛重");
        }
        if (!m.verifyLength) {
          errMsg.push("长");
        }
        if (!m.verifyWidth) {
          errMsg.push("宽");
        }
        if (!m.verifyHeight) {
          errMsg.push("高");
        }
        return {
          cpmId: m.productId,
          cwmId: m.warehouseId,
          weight: m.verifyWeight,
          length: m.verifyLength,
          width: m.verifyWidth,
          height: m.verifyHeight,
        };
      });
      if (errMsg.length) {
        this.msgError(`请输入大于0的核实${errMsg.join("、")}`);
        return;
      }
      postSkuBatchVerification(vOpt).then(() => {
        this.msgSuccess("核实成功");
        this.getTableData();
      });
    },
    selectionChange(rows) {
			const row = rows[0] || {};
      if (!row.isVerify) {
        this.selectionRows = rows.filter((e) => !e.isVerify && e.isFirstSku);
      } else {
        this.selectionRows = rows.filter(
          (e) => e.isVerify && e.takeAmountSku
        );
      }
			if (this.$refs[`tableRef${0}`]) {
        this.$refs[
          `tableRef${0}`
        ][0]?._toggleRowSelectionMixin({ newCheckRows: this.selectionRows });
      }
      // this.selectionRows = rows;
      this.$emit("getSkuSelect", this.selectionRows.filter(e => e.isVerify));
    },
    selectionRowEvt(row) {
			const rSome = this.selectionRows.some((e) => !e.isVerify);
      if (!row.isVerify) {
        return row.isFirstSku && (rSome || !this.selectionRows.length);
      } else {
        return !!row.takeAmountSku && !rSome;
      }
    },
    formatNumber(formModel,type) {
      let { forecastSkuNum = 0 , takeFreightSkuNum = 0 } = formModel
      if(!formModel[type]){
        const total=subtractFn([forecastSkuNum,takeFreightSkuNum])
        formModel[type] = total > 0 ? total : 1
      }
    },
    savePreData(row){
      const {id,freightNum}=row
      const params={
        id,
        freightNum
      }
      updateReceipt(params).then((res)=>{
        const { msg }=res
        this.msgSuccess(msg);
        row.isUpdate=0
        this.getTableData()
      })
    },
    deletePreData(row){
      const {id}=row
      deleteReceipt(id).then((res)=>{
        this.getTableData()
      })
    },
		disabledRows(btnNum) {
      const rSome = this.selectionRows.some((e) => !e.isVerify);
      return (
        !this.selectionRows.length || (rSome ? btnNum === 2 : btnNum === 1)
      );
    },
    getDataSummary(rows){
      const totalList= (eCommerceTotalLists||[]).map((e)=>{
        const {getParamLength=false,value}=e
        if(getParamLength){
          const trayNumArr=(rows||[]).map((e)=>e[value])
          return {
            ...e,
            total:[...new Set(trayNumArr)].length
          }
        }else{
          return {
            ...e,
            total:accumulationFn((rows||[]).map((e) => e[value])), //电商
          }
        }
      })
      return totalList
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
.marking {
  width: 66px;
  height: 19px;
  text-align: center;
  background: #fff2e8;
  border-radius: 0px 0px 15px;
  padding-right: 8px;
  color: #fa541c;
  font-size: 12px;
}
.tableTotal-flex{
  display: flex;
  .item-space{
    margin-right:20px
  }
}
</style>
