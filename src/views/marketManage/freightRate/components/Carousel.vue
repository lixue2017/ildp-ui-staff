<template>
  <div class="carousel">
    <div
      :class="`left-btn ${leftNum <= 0 ? 'no-num' : ''}`"
      @click="handleClick('pre')"
      v-if="list && list.length > 4"
    >
      <i class="el-icon-arrow-left"></i>
    </div>
    <div class="content" ref="contentRef">
      <!-- <div class=""> -->
      <el-row
        :class="list.length <= 4 && 'center'"
        :gutter="40"
        :style="{ left: `${carouselLeft}px` }"
      >
        <template v-for="item in list">
          <el-col :span="6" :key="item.id">
            <div class="carousel-item">
              <div class="carousel-item-top">
                <div class="item-top-1">
                  <template v-if="packingMode === 1">
                    {{
                      item.endValue
                        ? `${item.startValue}&lt;X≤${item.endValue}`
                        : item.startValue
                    }}{{ pricingType == 1 ? "KG" : "CBM" }}
                  </template>
                  <template v-else>
                    {{ item.boxModelName }}
                  </template>
                </div>
                <div class="item-top-currency">({{ item.currencyCode }})</div>
              </div>
              <div class="carousel-item-bottom">
                {{ item.price }}
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
      <!-- </div> -->
    </div>
    <div
      :class="`right-btn ${rightNum <= 0 ? 'no-num' : ''}`"
      @click="handleClick('next')"
      v-if="list && list.length > 4"
    >
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const {
      freightRateSettingList = [],
      packingMode,
      pricingType,
    } = this.formData;
    return {
      list: freightRateSettingList || [],
      carouselLeft: 20,
      leftNum: 0,
      rightNum: freightRateSettingList.length - 4,
      packingMode,
      pricingType,
    };
  },
  methods: {
    handleClick(type) {
      const itemWidth = this.$refs.contentRef.offsetWidth * 0.25;
      switch (type) {
        case "pre":
          this.leftNum -= 1;
          this.rightNum += 1;
          this.carouselLeft += itemWidth;
          break;
        case "next":
          this.rightNum -= 1;
          this.leftNum += 1;
          this.carouselLeft -= itemWidth;
          break;

        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  display: flex;
  padding: 30px 60px;
  border-bottom: 1px solid #e2e2e2;
  margin-bottom: 12px;

  .left-btn,
  .right-btn {
    text-align: center;
    width: 42px;
    height: 128px;
    line-height: 128px;
    font-size: 16px;
    background: #ffdbc7;
    box-shadow: 0px 0px 4px 0px rgba(122, 57, 20, 0.3);
    border-radius: 4px;
    color: #ff813d;
    cursor: pointer;

    &:hover {
      background: #ffb992;
    }
    &.no-num {
      background: rgba(255, 219, 199, 0.4);
      box-shadow: none;
      cursor: no-drop;
      pointer-events: none;
    }
  }
  .content {
    height: 128px;
    position: relative;
    flex: 1;
    overflow: hidden;
  }
  /deep/ {
    .el-row {
      display: flex;
      position: absolute;
      z-index: 0;
      width: 100%;
      left: 20px;
      top: 0;
      min-width: 100%;

      &.center {
        justify-content: center;
      }
      .el-col-6 {
        min-width: 25%;
      }
    }
  }
  .carousel-item {
    background: linear-gradient(360deg, #fff2e8 0%, #ffbe9b 100%);
    border-radius: 6px;
    text-align: center;
    overflow: hidden;
    .carousel-item-top {
      font-size: 20px;
      height: 64px;
      color: #fff;
      background: #ffb78e;
      padding: 7px 0;

      .item-top-1 {
        line-height: 28px;
      }
      .item-top-currency {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    .carousel-item-bottom {
      font-size: 28px;
      height: 64px;
      line-height: 64px;
      font-weight: bold;
    }
  }
}
</style>
