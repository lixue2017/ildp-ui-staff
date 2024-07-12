<template>
  <div class="amount-list">
    <div class="base-flex-align">
      <div
        class="next-btn base-flex-center"
        :class="marginLeft >= overWidth && 'is-display'"
        @click="handleNext"
      >
        <i class="iconfont shangyitiao1" />
      </div>
      <div class="currency-box">
        <div
          class="currency-scroll"
          ref="scrollRef"
          :style="`marginLeft: -${marginLeft}px;`"
        >
          <div
            class="currency-li"
            v-for="(item, index) in currencyAccountObj.cashierInfo"
            :key="index"
          >
            <div class="unit-tit">{{ item.name }}</div>
            <div>
              应付：<span class="money-txt">{{
                formatMoney(item.totalMoney)
              }}</span>
            </div>
            <div style="margin: 3px 0">
              实付：<span class="money-txt">{{
                formatMoney(item.verificationMoney)
              }}</span>
            </div>
            <div>
              剩余：<span class="pink-text-color">{{
                toFixedNum(item.surplusMoney)
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="previous-btn base-flex-center"
        :class="
          ((marginLeft === 0 && overWidth > 0) || overWidth === 0) &&
          'is-display'
        "
        @click="handlePrevious"
      >
        <i class="iconfont xiayitiao1" />
      </div>
    </div>
    <div class="account-box">
      <div>
        <div class="flex">
          <div class="account-label">
            {{ isPay ? "收款账户" : "付款账户（认领的水单对应账户）" }}
          </div>
          <!-- 修改账户功能暂时没有 有这个需求，预留隐藏按钮 -->
          <!-- <el-button
            size="small"
            type="primary"
            class="account-btn"
            plain
            round
            v-throttle
            >修改账户</el-button
          > -->
        </div>
        <div class="account-content">
          <div>
            <div class="label">账号名称：</div>
            <div class="value">
              {{ currencyAccountObj.accountName || "--" }}
            </div>
          </div>
          <div>
            <div class="label">开户行：</div>
            <div class="value">
              {{ currencyAccountObj.openingBank || "--" }}
              {{ currencyAccountObj.currency || "" }}
            </div>
          </div>
          <div>
            <div class="label">银行账号：</div>
            <div class="value">
              {{ currencyAccountObj.bankAccount || "--" }}
            </div>
          </div>
          <div>
            <div class="label">公司地址：</div>
            <div class="value">
              {{ currencyAccountObj.openingAddress || "--" }}
            </div>
          </div>
          <div>
            <div class="label">BANK ADDRESS：</div>
            <div class="value">
              {{ currencyAccountObj.openingAddressEn || "--" }}
            </div>
          </div>
          <div v-if="isPay">
            <div class="label">swift code：</div>
            <div class="value">
              {{ currencyAccountObj.invoiceTitle || "--" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currencyAccountObj: {
      type: Object,
      default: () => ({}),
    },
    isPay: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      active: 0,
      marginLeft: 0,
      overWidth: 0,
      itemWidth: 234,
    };
  },
  mounted() {
    setTimeout(() => {
      const overWidth =
        this.currencyAccountObj.cashierInfo.length * this.itemWidth -
        (12 + this.$refs.scrollRef.offsetWidth);
      if (overWidth > 0) {
        this.overWidth = overWidth;
      }
    });
  },
  methods: {
    handleNext() {
      if (this.marginLeft >= this.overWidth) {
        return;
      }
      if (this.marginLeft + this.itemWidth >= this.overWidth) {
        this.marginLeft = this.overWidth;
      } else {
        this.marginLeft += this.itemWidth;
      }
    },
    handlePrevious() {
      if (this.marginLeft <= 0) {
        return;
      }
      if (this.marginLeft - this.itemWidth <= 0) {
        this.marginLeft = 0;
      } else {
        this.marginLeft -= this.itemWidth;
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.amount-list {
  .next-btn {
    margin-right: 12px;
  }
  .next-btn,
  .previous-btn {
    width: 30px;
    height: 112px;
    background: #eaf2ff;
    border-radius: 4px;
    border: 1px solid rgba(188, 188, 188, 0.5);
    cursor: pointer;
  }
  .previous-btn {
    margin-left: 12px;
  }
  .is-display {
    opacity: 0.5;
    cursor: not-allowed;
    background-image: none;
  }
  .currency-box {
    width: 100%;
    overflow: hidden;
  }
  .currency-scroll {
    margin: 0 auto;
    white-space: nowrap;
  }
  .currency-li {
    width: 219px;
    height: 112px;
    background: rgba(188, 188, 188, 0.1);
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    display: inline-block;
    vertical-align: middle;
    margin-right: 15px;
    padding: 7px 13px;
    color: #8b8b8b;
    &:last-child {
      margin-right: 0;
    }
    div {
      line-height: 18px;
    }
    .unit-tit {
      margin-bottom: 6px;
    }
    .money-txt {
      font-size: 15px;
      color: #515151;
    }
    .pink-text-color {
      font-size: 15px;
    }
  }

  .account-box {
    margin-top: 20px;
    padding: 10px 20px 20px;
    background: rgba(188, 188, 188, 0.1);
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    .flex {
      display: flex;
      justify-content: space-between;
      .account-label {
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
      }
      .account-btn {
        padding: 5.5px 12px;
      }
    }
    .account-content {
      color: #515151;
      margin-top: 7px;
      & > div {
        display: flex;
        line-height: 18px;
        &:not(:first-child) {
          margin-top: 10px;
        }
        .label {
          width: 120px;
          text-align: right;
          color: #8b8b8b;
        }
        .value {
          flex: 1;
        }
      }
    }
  }
}
</style>
