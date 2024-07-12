<template>
  <div class="billing-header">
    <div :class="['title', 'base-flex-between', title ? '' : 'margin-tit']">
      <div class="title-left">{{ title || "" }}</div>

      <div class="title-right">
        <template v-for="(btnItem, i) in showBtnList()">
          <el-dropdown
            v-if="[31].includes(btnItem.btnType)"
            :key="`h_${i}`"
            trigger="click"
            class="add-cost-btn"
          >
            <el-button size="small" type="primary" round>
              {{ btnItem.text }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(tabBtn, iBtn) in tabBtnArr"
                :key="`d_${iBtn}`"
                @click.native="btnItem.handleBtnClick(tabBtn)"
                >{{ tabBtn.cnName }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>

          <ComColumnConf
            :key="`c_${i}`"
            v-else-if="[63].includes(btnItem.btnType)"
            :tableCols="tableAllMixinConfig(tabsConfig.activeName)"
            :tName="tabsConfig.activeName"
            :columnConfObj="{ btnRound: true }"
            @setColumnConf="setColumnMixinConf"
          />

          <el-button
            :key="`h_${i}`"
            size="small"
            type="primary"
            :disabled="isDisabled(btnItem)"
            v-else
            :plain="btnItem.plain"
            round
            @click="btnItem.handleBtnClick"
          >
            {{ btnItem.text }}
          </el-button>
        </template>
      </div>
    </div>

    <div class="bill-dis-grid" v-if="billInfoList && billInfoList.length">
      <template v-if="extraSlotSet.ISPROFITSLOT">
        <slot name="PROFITSLOT" :slotProps="{ billInfoList }"></slot>
      </template>
      <template v-else>
        <div
          v-for="(bItem, bIdx) in billInfoList"
          :key="bIdx"
          class="bill-item-box"
        >
          <template v-if="bIdx === 0">
            <p class="conversion-txt1">利润折合RMB：</p>
            <p class="conversion-txt2">{{ formatMoney(bItem.baseMoney, 4) }}</p>
            <p class="conversion-txt1">利润折合USD：</p>
            <p class="conversion-txt2">{{ formatMoney(bItem.helpMoney, 4) }}</p>
          </template>
          <template v-else>
            <p class="bill-item-txt1">{{ bItem.currency }}</p>
            <p class="bill-item-txt2">
              应收：<span>{{ formatMoney(bItem.paymentMoney, 2) }}</span>
            </p>
            <p class="bill-item-txt2">
              应付：<span>{{ formatMoney(bItem.payeeMoney, 2) }}</span>
            </p>
            <p class="bill-item-txt2">
              利润：<span>{{ formatMoney(bItem.profitMoney, 2) }}</span>
            </p>
          </template>
        </div>
      </template>
    </div>

    <CopyDlgBill ref="copyDlgRef" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  mixins: [mixinColsConf],
  props: {
    billInfoList: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: () => "",
    },
    selectionRows: {
      // 表格选中项
      type: Array,
      default: () => [],
    },
    showBtnArr: {
      type: Array,
      default: () => [10, 20, 26, 30, 70, 40, 50],
    },
    tabBtnArr: {
      type: Array,
      default: () => [],
    },
    headFormData: {
      type: Object,
      default: () => ({}),
    },
    parentEventObj: {
      // 需要父组件执行的事件集合
      type: Object,
      default: () => ({}),
    },
    headTableColumnSet: {
      type: Object,
      default: () => ({
        tableColumns: [],
      }),
    },
    addRowParam: {
      type: Object,
      default: () => ({}),
    },
    extraSlotSet: {
      //只涉及当前组件需不需要插槽或者插槽参数传参，不要把其他参数也传入这个对象
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      btnArr: [
        {
          text: "复制账单",
          plain: true,
          btnType: 10,
          handleBtnClick: this.handleCopy,
        },
        {
          text: this.overseaLangObj.save_all || "全部保存",
          plain: true,
          btnType: 20,
          handleBtnClick: this.parentEventObj.handleSaveAll,
        },
        {
          text: "批量删除",
          plain: true,
          btnType: 26,
          handleBtnClick: this.parentEventObj.handleDelAll,
        },
        {
          text: this.overseaLangObj.add_fee || "新增费用",
          handleBtnClick: this.parentEventObj.addBill,
          btnType: 30,
        },
        {
          text: this.overseaLangObj.xz_add() || "新增",
          handleBtnClick: this.parentEventObj.addBill,
          btnType: 31,
        },
        {
          text: this.overseaLangObj.batch_edit || "批量编辑",
          handleBtnClick: this.parentEventObj.batchEditBill,
          btnType: 70,
        },
        {
          text: this.overseaLangObj.sc_dzd || "生成对账单",
          handleBtnClick: this.parentEventObj.createdBill,
          btnType: 40,
          isDisable: 101,
        },
        {
          text: this.overseaLangObj.batch_sc_dzd || "批量生成对账单",
          handleBtnClick: this.parentEventObj.batchBillGenerateEvt,
          btnType: 50,
          isDisable: 102,
        },
        {
          text: "列设置",
          handleBtnClick: () => {},
          btnType: 63,
        },
      ],
      tabsConfig: {
        activeName: this.headTableColumnSet.tabName || "1",
      }, // 列设置使用
      mixinTableColArr: [
        this.headTableColumnSet.tableColumns,
        this.headTableColumnSet.tableColumns,
      ],
    };
  },
  methods: {
    handleCopy() {
      const { isBussiness } = this.addRowParam || {};
      this.$refs.copyDlgRef?.editShow(
        {
          isBussiness: 0, //之前此组件默认的0
          ...this.headFormData,
          WEB_isBussiness: isBussiness, //仅一件代发，FBA第三方订单需要取接口数值,赶集上线没给时间去查能不能替代上面isBussiness默认为0
          // "customerId":66,
          // "id":1079,
          // "orderType":2,
        },
        {
          editSuccess: () => {
            this.parentEventObj.copyBillEvt();
          },
        }
      );
    },
    isDisabled(btn) {
      if ([101, 102].includes(btn.isDisable) && !this.selectionRows.length) {
        return true;
      }
      return false;
    },
    showBtnList() {
      return this.btnArr.filter((e) => this.showBtnArr.includes(e.btnType));
    },
    childTableColumnConfig() {
      // 父级调用
      return this.tableMixinConfig(this.tabsConfig.activeName);
    },
  },
  created() {},
  components: {
    CopyDlgBill: () => import("../copyDlgBill"),
    ComColumnConf: () => import("_comp/ComColumnConf"),
  },
};
</script>

<style lang="scss" scoped>
.billing-header {
  .add-cost-btn {
    margin-left: 10px;
    margin-right: 10px;
  }
  .title {
    &.margin-tit {
      margin: 10px 0px;
    }
    .title-left {
      font-size: 14px;
      font-weight: bold;
      line-height: 22px;
      padding: 14px 0 11px;
      color: #515151;
    }
  }
}
</style>
