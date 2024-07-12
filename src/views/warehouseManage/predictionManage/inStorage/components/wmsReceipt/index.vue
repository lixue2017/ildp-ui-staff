<template>
  <div>
    <template>
      <div class="btn-group">
        <div class="tabs">
          <div v-for="tab in tabsConfig.tabs" :key="tab.name">
            <el-button
              size="small"
              plain
              class="tabs-change"
              v-show="filterTabs.length !== 1 || filterTabs[0] !== tab.name"
              :type="tab.name === tabsConfig.active ? 'activation' : ''"
              @click="changeTabs(tab.name)"
              >{{ tab.label }}</el-button
            >
          </div>
          <div class="reminder">
            <!-- <i class="iconfont icon-tishi"></i> -->
            <span>* {{ overseaLangObj.sh_jhc_sm }}</span>
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

      <div v-for="tab in tabsConfig.tabs" :key="tab.name">
        <keep-alive>
          <ComTable
            v-if="tabsConfig.active === tab.name"
            :ref="`tableRef${tabsConfig.active}`"
            :columnConfig="tableColumns(tabsConfig.active)"
            :selectionRow="selectionRowEvt"
            @onSelectionChange="onTableSelectionChange"
            :selectionTableRow="[...selectRowList]"
            :columnData="[]"
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
                  'takeAmountBox',
                ]"
              >
                <div :key="item" v-if="slotProps.prop === item">
                  <el-input-number
                    v-if="
                      tabsConfig.active === '1'
                        ? !!slotProps.row.maxTakeAmountBox
                        : slotProps.row.noVerifyFlag || item === 'takeAmountBox'
                    "
                    :disabled="
                      slotProps.row.noVerifyFlag && item === 'takeAmountBox'
                    "
                    size="mini"
                    v-model="slotProps.row[item]"
                    v-input-number-limit="{
                      value: slotProps.config ? slotProps.config.decimal : null,
                      maxNumber:
                        tabsConfig.active === '1'
                          ? slotProps.row.maxTakeAmountBox
                          : slotProps.config
                          ? slotProps.config.max
                          : null,
                    }"
                    :min="minLimitNumber(slotProps.config.decimal)"
                    :controls="false"
                    :placeholder="slotProps.column.label"
                    @change="(val) => changeAmount(val, slotProps.row, item)"
                  />
                  <span v-else>{{
                    toFixedNum(slotProps.row[item], slotProps.config.decimal)
                  }}</span>
                </div>
              </template>

              <template v-if="slotProps.prop === 'operation'">
                <div
                  class="operation-content-btn"
                  v-if="slotProps.row.noVerifyFlag"
                >
                  <template v-for="(item, index) in wmsTableBtn">
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
        </keep-alive>

        <keep-alive>
          <div v-if="tabsConfig.active === tab.name">
            <div class="received-title">{{ overseaLangObj.sh_info }}</div>
            <TableOperation
              :ref="`receiptTableRef${tabsConfig.active}`"
              :columnOpnConf="tableReceivedColumns(tabsConfig.active)"
              :tOperationObj="operationObj"
              :filterOpnBtnArr="
                tabsConfig.active === '1' ? ['copyRow', 'editRow'] : ['copyRow']
              "
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
                    (val) => changeAmount(val, slotProps.row, slotProps.prop)
                  "
                />
              </template>
              <template v-slot:bottomTotal="{ slotProps }">
                <div class="grand-total">
                  <div class="tableTotal-flex">
                    <span class="title">小计：</span>
                    <div class="tableTotal-flex ">
                      <div v-for="(item,index) in getDataSummary(tabsConfig.active==1?wmsTableObj.okReceiptVOBoxList:wmsTableObj.okReceiptVOSkuList)" :key="index" class="item-space">
                      <span>{{ item.label }}：</span>
                      <span>{{ item.total }}</span>
                      </div>
                    </div>
                  </div>
              </div>
              </template>
            </TableOperation>
          </div>
        </keep-alive>
      </div>
    </template>

    <BindingTray ref="trayDlgRef" />
  </div>
</template>

<script>
import {
  getThirdPartyReceiptList,
  getThirdPartyReceipt,
  putThirdPartyReceiptUpdate,
  delThirdPartyReceipt,
  postSkuBatchVerification,
} from "@/api/warehouse/prediction";
import { wmsTableCols, wmsReceivedTableCols,wmsReceivedTotalLists } from "./model";
import { msgBox } from "@/utils/confirmBox.js";
import {  accumulationFn } from "@/utils/instructions";
export default {
  props: {
    wmsObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tabsConfig: {
        active: "1",
        tabs: [
          {
            label: this.overseaLangObj.ax_sh || "按箱收货",
            name: "1",
          },
          {
            label: this.overseaLangObj.a_sku_sh || "按SKU收货",
            name: "2",
          },
        ],
      },
      wmsTableBtn: [
        {
          text: this.overseaLangObj.cp_hs || "产品核实",
          handleClick: (r) => this.handleVerify([r]),
        },
      ],
      wmsTableObj: {},
      selectRowList: [],
      operationObj: {
        httpSaveRequest: (row) => {
          return putThirdPartyReceiptUpdate({
            id: row.id,
            num: row.num,
          });
        },
        saveCallBack: (row) => {
          // this.getTableList不重新调用接口，否则其他未修改的临时数据状态会发生改变
        },
        httpDelRequest: (row) => {
          return delThirdPartyReceipt({ id: row.id });
        },
        delCallBack: this.getTableList,
      },
      filterTabs: [], // 初始化只有一个页签有数据时只显示一个tab
    };
  },
  methods: {
    bindTrayBefore() {
      if (!this.selectRowList.length) {
        this.msgError("请选择订单！");
        return;
      } else {
        const dislogTips = (this.selectRowList || []).some(
          (e) => e.predictionNum != e.takeAmountBox
        );
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
        } else {
          this.bindTray();
        }
      }
    },
    bindTray() {
      const { id, orderSn, customerName, customerId, warehouseId } =
        this.wmsObj;
      this.$refs.trayDlgRef.showDlg(
        {
          bailorPeople: customerName,
          customerId,
          storageMode: ["1", "0"][this.selectRowList[0].storageType - 1], // 托盘显示存仓方式
          warehouseId,
        },
        {
          httpRequest: (trayObj) => {
            // console.log('opt===', opt)
            const { trayNumObj, remark, isNew } = trayObj;
            const nOpt = {
              warehouseId,
              orderSn,
              orderId: id,
              remark,
              orderType: 2,
              traySn: isNew === 0 ? trayNumObj?.trayNum : undefined, // 新托盘清空托盘号
              receiptItemParamList: this.selectRowList.map((e) => {
                return {
                  id: e.id,
                  boxSn: e.boxSn,
                  num: e.takeAmountBox,
                  storageType: e.storageType,
                };
              }),
            };
            return getThirdPartyReceipt(nOpt);
          },
          handleSuccess: this.getTableList,
        }
      );
    },
    changeTabs(tName = "1") {
      this.onTableSelectionChange();
      this.tabsConfig.active = tName;
      this.$nextTick(() => {
        // 先清空选择项，再切换tab
        const setTabTable = ["wmsBoxTableList", "wmsSkuTableList"][tName - 1];
        this[setTabTable]();
        const setTabReceivedTable = [
          "wmsBoxReceivedTable",
          "wmsSkuReceivedTable",
        ][tName - 1];
        this[setTabReceivedTable]();
      });
    },
    changeAmount(val, row, prop) {
      if (["takeAmountBox", "num"].includes(prop) && !val) {
        this.$nextTick(() => {
          row[prop] = 1; // 视图更新后重置
        });
      }
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
          cwmId: this.wmsObj.warehouseId,
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
        this.getTableList();
      });
    },
    getTableList(callBack) {
      const { id } = this.wmsObj;
      getThirdPartyReceiptList(id).then((res) => {
        let { noReceiptVOBoxList = [], noReceiptVOSkuList = [] } = res.data;
        noReceiptVOBoxList.forEach((item) => {
          const takeAmountBox = item.predictionNum - (item.arrivalNum || 0);
          item.takeAmountBox = takeAmountBox;
          item.maxTakeAmountBox = takeAmountBox; // 按箱只能收货一次, 收货后只有删除不能修改
        });
        let skuFirstIds = [];
        noReceiptVOSkuList.forEach((item) => {
          const takeAmountBox = item.predictionNum - (item.arrivalNum || 0);
          item.takeAmountBox = takeAmountBox < 1 ? 1 : takeAmountBox;
          if (item.noVerifyFlag && !skuFirstIds.includes(item.productId)) {
            item.isFirstSku = true; // 相同SKU批量核实时取第一条数据
            skuFirstIds.push(item.productId);
          }
        });
        this.wmsTableObj = res.data;
        this.changeTabs(this.tabsConfig.active);
        callBack && callBack();
      });
    },
    wmsBoxTableList() {
      const { noReceiptVOBoxList = [] } = this.wmsTableObj;
      this.$refs[`tableRef${this.tabsConfig.active}`][0]?.setNewTableData(
        noReceiptVOBoxList
      );
    },
    wmsSkuTableList() {
      const { noReceiptVOSkuList = [] } = this.wmsTableObj;
      this.$refs[`tableRef${this.tabsConfig.active}`][0]?.setNewTableData(
        noReceiptVOSkuList
      );
    },
    wmsBoxReceivedTable() {
      const { okReceiptVOBoxList = [] } = this.wmsTableObj;
      this.$refs[
        `receiptTableRef${this.tabsConfig.active}`
      ][0]?.setTableOpnData(okReceiptVOBoxList);
    },
    wmsSkuReceivedTable() {
      const { okReceiptVOSkuList = [] } = this.wmsTableObj;
      this.$refs[
        `receiptTableRef${this.tabsConfig.active}`
      ][0]?.setTableOpnData(okReceiptVOSkuList);
    },
    tableColumns(tName) {
      return wmsTableCols(tName);
    },
    tableReceivedColumns(tName) {
      return wmsReceivedTableCols(tName);
    },
    onTableSelectionChange(rows = []) {
      const row = rows[0] || {};
      if (row.noVerifyFlag) {
        this.selectRowList = rows.filter((e) => e.noVerifyFlag && e.isFirstSku);
      } else {
        this.selectRowList = rows.filter(
          (e) => !e.noVerifyFlag && e.takeAmountBox
        );
      }
      if (this.$refs[`tableRef${this.tabsConfig.active}`]) {
        this.$refs[
          `tableRef${this.tabsConfig.active}`
        ][0]._toggleRowSelectionMixin({ newCheckRows: this.selectRowList });
      }
    },
    initShowTabs() {
      const {
        noReceiptVOBoxList = [],
        noReceiptVOSkuList = [],
        okReceiptVOBoxList = [],
        okReceiptVOSkuList = [],
      } = this.wmsTableObj;
      if (!noReceiptVOBoxList.length && !okReceiptVOBoxList.length) {
        this.filterTabs.push("1");
      }
      if (!noReceiptVOSkuList.length && !okReceiptVOSkuList.length) {
        this.filterTabs.push("2");
      }
      if (this.filterTabs.length === 1) {
        this.changeTabs(this.filterTabs[0] === "1" ? "2" : "1");
      }
    },
    selectionRowEvt(row) {
      const rSome = this.selectRowList.some((e) => e.noVerifyFlag);
      if (row.noVerifyFlag) {
        return row.isFirstSku && (rSome || !this.selectRowList.length);
      } else {
        return !!row.takeAmountBox && !rSome;
      }
    },
    disabledRows(btnNum) {
      const rSome = this.selectRowList.some((e) => e.noVerifyFlag);
      return (
        !this.selectRowList.length || (rSome ? btnNum === 2 : btnNum === 1)
      );
    },
    getDataSummary(rows){
      const totalList= (wmsReceivedTotalLists||[]).map((e)=>{
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
  mounted() {
    this.getTableList(() => {
      this.initShowTabs();
    });
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    TableOperation: () => import("_comp/ComTable/tableOperation"),
    BindingTray: () => import("../bindingTray"),
  },
};
</script>

<style lang="scss" scoped>
@import "../takeDelivery.scss";
.tableTotal-flex{
  display: flex;
  .item-space{
    margin-right:20px
  }
}
</style>
