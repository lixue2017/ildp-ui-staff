<template>
  <div class="warehouse-receipt-table">
    <template>
      <div class="tabs-group base-flex-between">
        <div class="base-flex-align">
          <div class="custom-tabs-btn">
            <template v-for="tItem in btnTabsList">
              <el-button
                size="small"
                plain
                :key="tItem.name"
                @click="() => changeTabs(tItem)"
                :type="
                  tItem.name === mixinOperationObj.activeName
                    ? 'activation'
                    : ''
                "
                >{{ tItem.label }}</el-button
              >
            </template>
          </div>
          <div class="tab-reminder">
            * 交货仓 = 目的仓(货物)，
            尾程运输为“一件代发”则为“按SKU收货”，为“按箱存库”；交货仓 !=
            目的仓(货物)，存仓方式为“大货中转”，大货中转和按箱存仓不可以一起收货；
          </div>
        </div>
        <div v-if="!wmsObj.receiptOk" style="white-space: nowrap">
          <template v-for="rBtn in rightBtnList">
            <el-button
              :key="rBtn.text"
              type="primary"
              size="small"
              plain
              round
              :disabled="disabledRows(rBtn.btnType)"
              @click="() => rBtn.handleClick()"
              >{{ rBtn.text }}</el-button
            >
          </template>
        </div>
      </div>

      <div v-for="tab in btnTabsList" :key="tab.name">
        <keep-alive>
          <div v-if="mixinOperationObj.activeName === tab.name">
            <div class="table-title base-flex-between">
              <span>{{
                overseaLangObj.forecast_cargo_info || "预报货物信息"
              }}</span>
              <div v-if="!wmsObj.receiptOk && tab.name === '2'">
                <template v-for="aBtn in rightAddBtnList">
                  <el-button
                    :key="aBtn.text"
                    type="primary"
                    size="small"
                    plain
                    round
                    v-if="aBtn.showBtnType.includes(wmsObj.sReceiptType)"
                    @click="() => aBtn.handleClick()"
                    >{{ aBtn.text }}</el-button
                  >
                </template>
              </div>
            </div>
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableAutoHeight(tableConfig.nos)"
              :columnConfig="tableColumns(tab.name)"
              :selectionRow="selectionRowEvt"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectRowList]"
              :columnData="[]"
              :rowOperationBtnListFn="(r) => tableStatusList(r)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'sku'">
                  <AutoComplete
                    v-if="slotProps.row.isNewAdd"
                    :formModel="slotProps.row"
                    :fieldItem="{
                      ...slotProps.column.fieldItem,
                      handle: (v, sObj) => handleSelectSku(slotProps.row, sObj),
                    }"
                    :additionalParam="{
                      customerId: wmsObj.customerId,
                    }"
                  />
                  <template v-else>
                    <span
                      class="sku-mark"
                      style="display: inline-block"
                      v-if="slotProps.row.noVerifyFlag"
                    >
                      {{ overseaLangObj.first_entry("首次入仓") }}
                    </span>
                    <div
                      class="sku-mark new-tag"
                      v-if="slotProps.row.addSource === 2"
                    >
                      新
                    </div>
                    <el-row class="ellipsis-text">
                      {{ slotProps.row.sku || "--" }}
                    </el-row>
                  </template>
                </template>

                <template v-if="slotProps.prop === 'packingTrackingNum'">
                  <AutoComplete
                    :formModel="slotProps.row"
                    :fieldItem="slotProps.column.fieldItem"
                    :additionalParam="{
                      stateList: [2, 3], // 2-待收货 3-待上架
                      noTrackSnFlag: false, // 有包裹跟踪号
                      orderId: wmsObj.orderId,
                    }"
                  />
                </template>

                <template
                  v-for="item in [
                    'verifySkuLong',
                    'verifySkuWide',
                    'verifySkuHigh',
                    'verifySkuWeight',
                  ]"
                >
                  <div :key="item" v-if="slotProps.prop === item">
                    <el-input-number
                      v-if="slotProps.row.noVerifyFlag"
                      size="mini"
                      v-model="slotProps.row[item]"
                      v-input-number-limit="{
                        value: slotProps.column.decimal,
                        maxNumber: slotProps.column.max,
                      }"
                      :min="minLimitNumber(slotProps.column.decimal)"
                      :controls="false"
                      :placeholder="slotProps.column.label"
                    />
                    <span v-else>{{
                      toFixedNum(slotProps.row[item], slotProps.column.decimal)
                    }}</span>
                  </div>
                </template>
              </template>
            </ComTable>
          </div>
        </keep-alive>

        <keep-alive>
          <ReceivedGoods
            :ref="`receiptTableRef${tab.name}`"
            v-if="mixinOperationObj.activeName === tab.name"
            :receivedObj="wmsObj"
            @onChangeRefresh="() => changeTabs()"
          />
        </keep-alive>
      </div>
    </template>

    <BindingTray ref="trayDlgRef" />
    <AddDialogPackage ref="nPackageRef" />
  </div>
</template>

<script>
import { wmsTableCols } from "./model";
import { customMessageBox } from "@/utils/confirmBox.js";
import { accumulationFn, subtractFn } from "@/utils/instructions";
import {
  getSearchReceiptList,
  postReturnReceipt,
  postReceiptAddSku,
  getSearchStorageReceipt,
} from "@/api/warehouse/process";
import { postSkuBatchVerification } from "@/api/warehouse/prediction";
import { mixinTableOperationRow } from "_comp/ComTable/tableOperation/rowOperationMixin.js";
export default {
  mixins: [mixinTableOperationRow],
  props: {
    wmsObj: {
      type: Object,
      default: () => ({}),
    },
    btnTabsList: {
      type: Array,
      default: () => [
        // {
        //   label: "按箱收货",
        //   name: "1",
        // },
        // {
        //   label: "按SKU收货",
        //   name: "2",
        // },
      ],
    },
  },
  data() {
    return {
      rightBtnList: [
        {
          text: this.overseaLangObj.cp_pl_hs("产品批量核实"),
          btnType: 1,
          handleClick: () => {
            this.handleVerify(this.selectRowList);
          },
        },
        {
          text: this.overseaLangObj.qd_sh || "确定收货",
          btnType: 2,
          handleClick: () => {
            this.bindTrayBefore();
          },
        },
      ],
      rightAddBtnList: [
        {
          text: "新增包裹",
          showBtnType: ["1"], // 订单类型才显示
          handleClick: () => {
            this.$refs.nPackageRef?.showDlg({
              ...this.wmsObj,
              successFn: () => this.handleChangeRefresh(),
            });
          },
        },
        {
          text: "新增货物",
          showBtnType: ["1", "2"],
          handleClick: () => {
            this.mixinAddTableOpnData([
              {
                isNewAdd: true,
                rBtnUpdate: true,
              },
            ]);
          },
        },
      ],
      tableBtnList: [
        {
          text: this.overseaLangObj.cp_hs || "产品核实",
          handleClick: (r) => this.handleVerify([r]),
        },
      ],
      tableConfig: {},
      selectRowList: [],
      mixinTableRef: "tableRef",
      mixinOperationObj: {
        activeName: "1",
        httpSaveRequest: (row) => this.handleRowSave(row),
        saveCallBack: (r) => {
          if (r.isNewAdd) {
            this.handleChangeRefresh();
          }
        },
      },
      tabsData: {},
    };
  },
  methods: {
    changeTabs(tabItem) {
      this.onTableSelectionChange();
      if (tabItem) {
        this.mixinOperationObj.activeName = tabItem.name;
      }
      let idList = [];
      if (this.mixinOperationObj.activeName === "1") {
        idList = this.tabsData.boxIdList;
      }
      if (this.mixinOperationObj.activeName === "2") {
        idList = this.tabsData.skuIdList;
      }
      getSearchReceiptList({ idList }).then((res) => {
        const { nos, oks } = res.data || {};
        this.tableConfig = res.data || {};
        let skuFirstIds = [];
        (nos || []).forEach((item) => {
          const takeAmountBox = subtractFn([item.forecastNum, item.takeNum]);
          item.takeAmountBox = takeAmountBox < 1 ? 1 : takeAmountBox;
          if (item.noVerifyFlag && !skuFirstIds.includes(item.cpmId)) {
            item.isFirstSku = true; // 相同SKU批量核实时取第一条数据
            skuFirstIds.push(item.cpmId);
          }
        });

        setTimeout(() => {
          this.setTableMixinData(nos);
          this.$refs[
            `receiptTableRef${this.mixinOperationObj.activeName}`
          ][0]?.setReceivedTableData(oks);
        }, 20);
      });
    },
    handleSelectSku(row, skuObj) {
      row.verifySkuLong = skuObj.cusProduct?.productLength;
      row.verifySkuWide = skuObj.cusProduct?.productWidth;
      row.verifySkuHigh = skuObj.cusProduct?.productHigh;
      this.$set(row, "productNameCn", skuObj.productNameCn);
      this.$set(row, "verifySkuWeight", skuObj.cusProduct?.productWeight); // 更新视图层
    },
    handleRowSave(r) {
      const { customerId, orderId, receivingSource } = this.wmsObj;
      const opt = {
        customerId,
        orderId,
        receivingSource,
        cpmId: r.cpmId,
        num: r.takeAmountBox,
        packageId: r.packageId,
      };
      const ruleObj = {
        ruleMsg: {
          packageId: "箱号/包裹跟踪号",
          num: "数量",
        },
      };
      return this.handleMixinRowSave(opt, postReceiptAddSku, ruleObj);
    },
    handleChangeRefresh() {
      // 获取新增后的全部ID值查询全部列表数据
      const { orderSn, warehouseId, sReceiptType } = this.wmsObj;
      getSearchStorageReceipt({
        type: sReceiptType,
        search: orderSn,
        wmsId: warehouseId,
      }).then((res) => {
        this.tabsData = res.data;
        this.changeTabs();
      });
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
          cpmId: m.cpmId,
          cwmId: this.wmsObj.warehouseId,
          weight: m.verifySkuWeight,
          length: m.verifySkuLong,
          width: m.verifySkuWide,
          height: m.verifySkuHigh,
        };
      });
      if (errMsg.length) {
        this.msgError(`请输入大于0的${errMsg.join("、")}`);
        return;
      }
      postSkuBatchVerification(vOpt).then(() => {
        this.msgSuccess(this.overseaLangObj.cg_tip("核实成功"));
        this.changeTabs();
      });
    },
    bindTrayBefore() {
      if (!this.selectRowList.length) {
        return this.msgError("请选择收货信息");
      }
      // const isTips = this.selectRowList.some(
      //   (e) => e.forecastNum != e.takeAmountBox
      // );
      // if (isTips) {
      //   customMessageBox(
      //     this,
      //     {
      //       msgTxt1: "预报数量和收货数量不一致，",
      //       msgTxt2: "确认是否收货？",
      //     },
      //     () => {
      //       this.bindTray();
      //     }
      //   );
      // } else {
      //   this.bindTray();
      // }
      this.bindTray();
    },
    bindTray() {
      const { customerShortName, customerId, warehouseId } = this.wmsObj;
      this.$refs.trayDlgRef?.showDlg(
        {
          bailorPeople: customerShortName,
          storageMode: this.typeConversion(this.selectRowList[0].storageMode), // 托盘显示存仓方式
          customerId,
          warehouseId,
        },
        {
          httpRequest: (trayObj) => {
            const { trayNumObj, remark } = trayObj || {};
            return postReturnReceipt({
              remark,
              trayId: trayNumObj?.id,
              items: this.selectRowList.map((e) => {
                return {
                  id: e.id,
                  num: e.takeAmountBox,
                };
              }),
            });
          },
          handleSuccess: () => this.changeTabs(),
        }
      );
    },
    onTableSelectionChange(rows = []) {
      const row = rows[0] || {};
      if (row.noVerifyFlag) {
        this.selectRowList = rows.filter((e) => e.noVerifyFlag && e.isFirstSku);
      } else {
        this.selectRowList = rows.filter(
          (e) =>
            !e.noVerifyFlag &&
            e.takeAmountBox &&
            row.storageMode === e.storageMode &&
            row.packingTrackingNum &&
            !row.rowReceiptOk
        );
      }
      if (this.$refs[`tableRef${this.mixinOperationObj.activeName}`]) {
        this.$refs[
          `tableRef${this.mixinOperationObj.activeName}`
        ][0]._toggleRowSelectionMixin({
          newCheckRows: this.selectRowList,
        });
      }
    },
    selectionRowEvt(row) {
      if (row.isNewAdd || !row.packingTrackingNum || row.rowReceiptOk) {
        return false;
      }
      const rSome = this.selectRowList.some((e) => e.noVerifyFlag);
      if (row.noVerifyFlag) {
        // 未核实
        return row.isFirstSku && (rSome || !this.selectRowList.length);
      } else {
        if (this.selectRowList.length) {
          const tSome = this.selectRowList.some(
            (ele) => row.storageMode === ele.storageMode
          );
          return !!row.takeAmountBox && !rSome && tSome;
        }
        return !!row.takeAmountBox && !rSome;
      }
    },
    tableStatusList(row) {
      if (row.rowReceiptOk) {
        return [];
      }
      if (row.noVerifyFlag) {
        return this.tableBtnList;
      }
      if (row.isNewAdd) {
        return [
          ...this.mixinTableRowBtnArr().filter(
            (btn) => (btn.btnUpdate || false) === (row.rBtnUpdate || false)
          ),
        ];
      }
      return [];
    },
    disabledRows(btnNum) {
      const rSome = this.selectRowList.some((e) => e.noVerifyFlag);
      return (
        !this.selectRowList.length || (rSome ? btnNum === 2 : btnNum === 1)
      );
    },
    tableColumns() {
      return wmsTableCols(this.wmsObj.receiptOk);
    },
    tableAutoHeight(arr) {
      return (arr || []).length > 6 ? `${7 * 49}px` : undefined;
    },
  },
  created() {
    this.tabsData = this.wmsObj;
    this.changeTabs(this.btnTabsList[0] || {});
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    BindingTray: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/components/bindingTray"
      ),
    ReceivedGoods: () => import("./receivedGoods"),
    AddDialogPackage: () => import("../components/addPackage"),
  },
};
</script>

<style lang="scss" scoped>
.warehouse-receipt-table {
  .tabs-group {
    border-bottom: 1px solid #e2e2e2;
  }
  .custom-tabs-btn {
    border-bottom: none;
  }
  .tab-reminder {
    margin: 0 5px;
    color: #5094ff;
  }
  .table-title {
    color: #515151;
    font-weight: bold;
    margin: 15px 0;
  }
  .sku-mark {
    font-size: 12px;
    height: 17px;
    line-height: 17px;
    text-align: center;
    border-radius: 0px 0px 19px 0px;
    color: #fff;
    background: #ff813d;
    &.new-tag {
      background: #96dcb7;
      max-width: 48px;
    }
  }
}
</style>
