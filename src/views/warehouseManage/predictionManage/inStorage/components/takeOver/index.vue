<template>
  <div>
    <div class="tagsTitle tabs">
      <div class="tags">
        <div v-for="tab in getTags()" :key="tab.name" class="tabsBtn">
          <el-button
            size="small"
            plain
            class="tabs-change"
            :type="tab.name === tabsConfig.active ? 'activation' : ''"
            @click="changeTabs(tab.name)"
            >{{ tab.label }}</el-button
          >
        </div>
        <div class="tags-title">
          <span> * {{ overseaLangObj.sh_jhc_sm }} </span>
        </div>
      </div>
      <div class="right">
        <el-button
          v-if="tabsConfig.active === '2'"
          type="primary"
          size="small"
          plain
          @click="() => handleVerify(selectRowList)"
          :disabled="disabledRows(1)"
          >{{ overseaLangObj.cp_pl_hs("产品批量核实") }}</el-button
        >
        <el-button
          type="primary"
          size="small"
          plain
          :disabled="disabledRows(2)"
          @click="bindTrayBefore"
          >{{ overseaLangObj.qd_sh }}</el-button
        >
      </div>
    </div>
    <div>
      <div v-for="tab in tabsConfig.tabs" :key="tab.name">
        <div v-if="tabsConfig.active === tab.name">
          <div class="received-title">
            {{ overseaLangObj.forecast_cargo_info }}
          </div>
          <ComTable
            :ref="`tableRef${tabsConfig.active}`"
            :columnConfig="tableColumns(tabsConfig.active)"
            :columnData="tableConfig.columnData"
            :selectionRow="selectionRowEvt"
            @onSelectionChange="onTableSelectionChange"
            :selectionTableRow="[...selectRowList]"
            :selectionKey="tabsConfig.active == 2 ? 'boxProductId' : 'id'"
            v-if="tabsConfig.active === tab.name"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'sku'">
                <span class="marking" v-if="slotProps.row.noVerifyFlag">
                  {{ overseaLangObj.first_entry("首次入仓") }}
                </span>
                <el-row class="ellipsis-text">
                  {{ slotProps.row.sku }}
                </el-row>
              </template>
              <template
                v-for="item in [
                  'verifySkuLong',
                  'verifySkuWide',
                  'verifySkuHigh',
                  'verifySkuWeight',
                  'num',
                ]"
              >
                <div :key="item" v-if="slotProps.prop === item">
                  <el-input-number
                    v-if="slotProps.row.noVerifyFlag || item === 'num'"
                    :disabled="slotProps.row.noVerifyFlag && item === 'num'"
                    size="mini"
                    v-model="slotProps.row[item]"
                    v-input-number-limit="{
                      value: slotProps.config ? slotProps.config.decimal : null,
                      maxNumber: slotProps.config ? slotProps.config.max : null,
                    }"
                    :min="minLimitNumber(slotProps.config.decimal)"
                    :controls="false"
                    :placeholder="slotProps.column.label"
                    @change="(val) => changeAmount(val, item, slotProps.row)"
                  />
                  <span v-else>
                    {{
                      toFixedNum(slotProps.row[item], slotProps.config.decimal)
                    }}
                  </span>
                </div>
              </template>
              <template v-for="item in ['shipmentIds', 'referenceIds']">
                <div :key="item" v-if="slotProps.prop === item">
                  <div
                    v-for="(skuItem, skuIndex) in slotProps.row[item]"
                    :key="skuIndex"
                  >
                    {{ skuItem }}
                  </div>
                </div>
              </template>
              <template v-if="slotProps.prop === 'operation'">
                <div
                  class="operation-content-btn"
                  v-if="slotProps.row.noVerifyFlag"
                >
                  <template v-for="(item, index) in tableConfig.statusList">
                    <el-button
                      :key="index"
                      size="small"
                      type="text"
                      @click="item.handleClick(slotProps.row)"
                      >{{ item.text }}</el-button
                    >
                  </template>
                </div>
                <span v-else>--</span>
              </template>
            </template>
          </ComTable>
        </div>

        <div v-if="tabsConfig.active === tab.name">
          <div class="received-title">{{ overseaLangObj.sh_info }}</div>
          <TableOperation
            :ref="`receiptTableRef${tabsConfig.active}`"
            :columnOpnConf="tableReceivedColumns(tabsConfig.active)"
            :tOperationObj="operationObj"
          >
            <template v-slot:num="{ slotProps }">
              <span v-if="!slotProps.row.rBtnUpdate">{{
                slotProps.row[slotProps.prop]
              }}</span>
              <el-input-number
                v-else
                size="mini"
                v-model="slotProps.row[slotProps.prop]"
                v-input-number-limit="{
                  value: slotProps.config ? slotProps.config.decimal : null,
                  maxNumber: slotProps.config ? slotProps.config.max : null,
                }"
                :min="1"
                :controls="false"
                :placeholder="slotProps.column.label"
                @change="
                  (val) => changeAmount(val, slotProps.prop, slotProps.row)
                "
              />
            </template>
            <template v-slot:bottomTotal="{ slotProps }">
                <div class="grand-total">
                  <div class="tableTotal-flex">
                    <span class="title">小计：</span>
                    <div class="tableTotal-flex ">
                      <div v-for="(item,index) in getDataSummary(receiptTableData)" :key="index" class="item-space">
                      <span>{{ item.label }}：</span>
                      <span>{{ item.total }}</span>
                      </div>
                    </div>
                  </div>
              </div>
              </template>
          </TableOperation>
        </div>
      </div>
    </div>
    <BindingTray ref="trayDlgRef" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  overSeaWarehousePredictionCols,
  overSeaWarehouseReceivedGoodCols,
  overSeaTotalLists,
} from "./model";
import { subtractFn } from "@/utils/instructions";
import {
  postSkuBatchVerification,
  postReceiptUpdate,
  deleteOrderReceiptDel,
} from "@/api/warehouse/prediction";
import {
  getClearanceOrderBoxReceiptInfo,
  getClearanceOrderProductReceiptInfo,
  postReceipt,
} from "@/api/warehouse/prediction.js";
import { Notification } from "element-ui";
import { msgBox } from "@/utils/confirmBox.js";
import {  accumulationFn } from "@/utils/instructions";
export default {
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    TableOperation: () => import("_comp/ComTable/tableOperation"),
    BindingTray: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/components/bindingTray/index.vue"
      ),
  },
  props: {
    formModel: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tabsConfig: {
        active: "1",
        title: this.overseaLangObj.sh_info || "收货信息",
        tabs: [
          {
            label: this.overseaLangObj.ax_sh || "按箱收货",
            isShow: "isBox",
            name: "1",
          },
          {
            label: this.overseaLangObj.a_sku_sh || "按SKU收货",
            isShow: "isSku",
            name: "2",
          },
        ],
      },
      tableConfig: {
        columnData: [],
        statusList: [
          {
            text: this.overseaLangObj.cp_hs || "产品核实",
            handleClick: (r) => this.handleVerify([r]),
          },
        ],
      },
      selectRowList: [],
      requestObj: {
        overSeaWarehouse: {
          //海外入仓收货
          httpRequest: [
            getClearanceOrderBoxReceiptInfo, //按箱收货 预报与收货信息查询接口
            getClearanceOrderProductReceiptInfo, //按SKU   预报与收货信息查询接口
          ],
          prediction: overSeaWarehousePredictionCols, //预报货物config
          received: overSeaWarehouseReceivedGoodCols, //收货信息config
          receivedTotalList:overSeaTotalLists,//收货汇总cONFIG
          takeGoods: postReceipt, //确定收货 接口
          updateGoods: postReceiptUpdate, //修改收货信息 接口
          deleteGoods: deleteOrderReceiptDel, //删除货物信息 接口
        },
      },
      operationObj: {
        httpSaveRequest: (row) => {
          const { menuType } = this.formModel || {};
          const updateGoodsRequest = this.requestObj[menuType].updateGoods;
          return updateGoodsRequest({
            id: row.id,
            num: row.num,
          });
        },
        saveCallBack: () => {
          this.getTableList(this.detailId);
        },
        httpDelRequest: (row) => {
          const { menuType } = this.formModel || {};
          const deleteGoodsRequest = this.requestObj[menuType].deleteGoods;
          return deleteGoodsRequest({ id: row.id });
        },
        delCallBack: () => {
          this.getTableList(this.detailId);
        },
      },
      receiptTableData:[],
      showSearchForm: true,
      detailId: undefined,
    };
  },
  created() {
    const { id } = this.formModel;
    this.detailId = id;
    const { isBox } = this.formModel;
    this.tabsConfig.active = isBox ? "1" : "2";
    this["dictionary/getDictionary"]("predictionManage").then(() => {
      this.getTableList(id);
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getTags() {
      const { tabs } = this.tabsConfig;
      const tags = tabs.filter((e) => {
        const { isShow } = e;
        if (this.formModel[isShow]) {
          return true;
        }
      });
      return tags;
    },
    getTableList(id) {
      const { menuType } = this.formModel;
      const { active } = this.tabsConfig;
      const httpRequest = this.requestObj[menuType].httpRequest[active - 1];
      httpRequest(id).then((res) => {
        if (menuType == "overSeaWarehouse") {
          const {
            noReceiptVOBoxList,
            noProductReceiptVOS,
            okReceiptVOBoxList,
            okProductgReceiptVOS,
          } = res.data;
          let tableData =
            active == 1 ? noReceiptVOBoxList : noProductReceiptVOS;
          let skuFirstIds = [];
          tableData = tableData.map((e, index) => {
            const { predictionNum, arrivalNum } = e;
            const takeGoodsNum = subtractFn([predictionNum, arrivalNum]);
            let mOpt = {
              ...e,
              num: 0,
              id: e.id ? e.id : e.productId ? e.productId : index, //没返回ID导致勾选的时候勾一个全部都选中
              num: takeGoodsNum < 1 ? 1 : takeGoodsNum,
            };
            if (
              active === "2" &&
              e.noVerifyFlag &&
              !skuFirstIds.includes(e.productId)
            ) {
              mOpt.isFirstSku = true; // 相同SKU批量核实时取第一条数据
              skuFirstIds.push(e.productId);
            }
            return mOpt;
          });
          this.$refs[`tableRef${active}`][0]?.setNewTableData(tableData);
          const receiptTableData =
            active == 1 ? okReceiptVOBoxList : okProductgReceiptVOS;
          this.receiptTableData=receiptTableData
          this.$refs[`receiptTableRef${active}`][0]?.setTableOpnData(
            receiptTableData
          );
        }
      });
      this.showSearchForm = true;
    },
    changeAmount(val, key, row) {
      if (key === "num" && !val) {
        this.$nextTick(() => {
          row[key] = 1; // 视图更新后重置
        });
      }
    },
    changeTabs(tName = "1") {
      this.tableConfig.columnData = [];
      this.tabsConfig.active = tName;
      this.getTableList(this.detailId);
      this.onTableSelectionChange();
    },
    // SKU长宽高数据核实
    handleVerify(rows) {
      let errMsg = [];
      const vOpt = (rows || []).map((m) => {
        if (!m.verifySkuWeight) {
          errMsg.push("毛重");
        }
        if (!m.verifySkuLong) {
          errMsg.push("长");
        }
        if (!m.verifySkuWide) {
          errMsg.push("宽");
        }
        if (!m.verifySkuHigh) {
          errMsg.push("高");
        }
        return {
          cpmId: m.productId,
          cwmId: this.formModel.warehouseId,
          weight: m.verifySkuWeight,
          length: m.verifySkuLong,
          width: m.verifySkuWide,
          height: m.verifySkuHigh,
        };
      });
      if (errMsg.length) {
        this.msgError(`请输入大于0的核实${errMsg.join("、")}`);
        return;
      }
      postSkuBatchVerification(vOpt).then(() => {
        this.msgSuccess(this.overseaLangObj.cg_tip("核实成功"));
        this.onTableSelectionChange();
        this.getTableList(this.detailId);
      });
    },
    onTableSelectionChange(rows = []) {
      const { active } = this.tabsConfig;
      if (active == 1) {
        const nRows = rows.filter((e) => e.storageType || e.storageType == 0);
        const fRow = nRows[0];
        this.selectRowList = nRows.filter((e) => {
          const { storageType, consigneeWarehouseCode } = fRow;
          if (storageType == 0) {
            //大货中转需要目的地一致
            return (
              e.storageType == storageType &&
              e.consigneeWarehouseCode == consigneeWarehouseCode
            );
          } else {
            return e.storageType == storageType;
          }
        });
        // const nRows = rows.filter((e) => e.storageType || e.storageType == 0);
        // const fRow = nRows[0];
        // this.selectRowList = nRows.filter((e) => {
        //   return fRow.storageType == e.storageType;
        // });
      } else if (active == 2) {
        const eRow = rows[0] || {};
        if (eRow.noVerifyFlag) {
          this.selectRowList = rows.filter(
            (e) => e.noVerifyFlag && e.isFirstSku
          );
        } else {
          this.selectRowList = rows.filter((e) => !e.noVerifyFlag && e.num);
        }
      }
      if (this.$refs[`tableRef${active}`]) {
        this.$refs[`tableRef${active}`][0]?._toggleRowSelectionMixin({
          newCheckRows: this.selectRowList,
        });
      }
    },
    selectionRowEvt(row) {
      const { active } = this.tabsConfig;
      let rSome = true;
      if (active == 1) {
        const nRow = this.selectRowList[0] || {};
        const { storageType, consigneeWarehouseCode } = nRow;
        if (storageType == 0) {
          rSome =
            row.storageType == storageType &&
            row.consigneeWarehouseCode == consigneeWarehouseCode;
        } else {
          rSome = row.storageType == storageType;
        }
      } else if (active == 2) {
        const rowSome = this.selectRowList.some((e) => e.noVerifyFlag);
        if (row.noVerifyFlag) {
          return row.isFirstSku && (rowSome || !this.selectRowList.length);
        } else {
          return !!row.num && !rowSome;
        }
      }
      if (this.selectRowList?.length && !rSome) {
        return false; // 禁止选择
      }
      return true;
    },
    bindTrayBefore(){
      if (!this.selectRowList.length) {
        this.msgError("请选择订单！");
        return;
      }else{
        const { active } = this.tabsConfig;
        const dislogTips = (this.selectRowList || []).some((e) => e.predictionNum != e.num);
        if (dislogTips) {
          const title = "收货提示";
          const className = "el-icon-warning text-warning";
          const msg = "预报数量和收货数量不一致，确认是否收货。";
          msgBox(
            this,
            { title, className, msg, showCancelButton: true },
            () => {
              this.bindTray();
            }
          );
        }else{
          this.bindTray();
        }
      }
    },
    bindTray() {
      if (!this.selectRowList.length) {
        this.msgError("请选择订单！");
        return;
      }
      const { menuType } = this.formModel || {};
      const takeGoodsRequest = this.requestObj[menuType].takeGoods;
      const { id, orderSn, bailorPeopleName, nlCode, customerId, warehouseId } =
        this.formModel;
      this.$refs.trayDlgRef.showDlg(
        // 对接头程存仓：0整箱存仓   1大货中转
        // WMS入库单入库  1整箱存仓 2SKU存仓
        // 海外入仓：0大货中转 1整箱存仓  2SKU存仓
        // 弹窗：0SKU存仓   1整箱存仓  2大货中转
        {
          bailorPeople: bailorPeopleName,
          customerId,
          storageMode: ["2", "1", "0"][this.selectRowList[0].storageType], // 托盘显示存仓方式
          warehouseId,
        },
        {
          httpRequest: (trayObj) => {
            const { active } = this.tabsConfig;
            const { remark, isNew, trayNumObj } = trayObj;
            const receiptItemParamList = this.selectRowList.map((e) => {
              const {
                shipmentId,
                shipmentIds,
                num,
                storageType,
                boxProductId,
              } = e;
              return {
                boxSn: shipmentId || shipmentIds?.join(","),
                id: active == 1 ? e.id : undefined,
                num,
                orderId: id,
                orderSn: nlCode,
                productId: active == 1 ? undefined : e.productId,
                storageType,
                boxProductId: active == 2 ? boxProductId : undefined,
              };
            });
            const params = {
              traySn: isNew == 1 ? undefined : trayNumObj?.trayNum,
              orderId: id,
              orderSn: nlCode,
              remark,
              warehouseId,
              receiptItemParamList,
              // trayNumObj: isNew == 1 ? undefined : trayNumObj,
            };
            return takeGoodsRequest(params);
          },
          handleSuccess: () => {
            this.onTableSelectionChange();
            this.getTableList(id);
          },
        }
      );
    },
    tableColumns(tName) {
      //预报货物Config
      const { menuType } = this.formModel || {};
      const config = this.requestObj[menuType].prediction;
      return config(tName);
    },
    tableReceivedColumns(tName) {
      //已收货信息Config
      const { menuType } = this.formModel || {};
      const config = this.requestObj[menuType].received;
      return config(tName);
    },
    disabledRows(btnNum) {
      const rSome = this.selectRowList.some((e) => e.noVerifyFlag);
      return (
        !this.selectRowList.length || (rSome ? btnNum === 2 : btnNum === 1)
      );
    },
    getDataSummary(rows){
      const totalList= (overSeaTotalLists||[]).map((e)=>{
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
.tagsTitle {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e2e2;
  .tags {
    display: flex;
    .tabsBtn {
      &:not(:first-child) {
        margin-left: 15px;
      }
    }
    .tags-title {
      display: flex;
      align-items: center;
      margin-left: 15px;
      color: #5094ff;
    }
  }
  .right {
    .el-button {
      border: 1px solid #5094ff;
    }
  }
}
.marking {
  width: 66px;
  height: 19px;
  text-align: center;
  background: rgba(83, 200, 138, 0.6);
  border-radius: 0px 0px 11px 0px;
  color: #ffffff;
  font-size: 12px;
}
.received-title {
  padding: 15px 0px;
}
.tableTotal-flex{
  display: flex;
  .item-space{
    margin-right:20px
  }
}
</style>
