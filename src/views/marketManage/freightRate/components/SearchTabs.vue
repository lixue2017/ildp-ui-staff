<template>
  <div class="search-tab">
    <div class="title">{{ title }}</div>
    <div class="tab">
      <div
        @click="handleClick({ [defaultProp.value]: 0 })"
        :class="`item-tab ${activeName === 0 && 'is-active'}`"
      >
        全部
      </div>
      <template v-for="item in dataShow">
        <div
          :class="`item-tab ${
            activeName === item[defaultProp.value] && 'is-active'
          }`"
          :key="item[defaultProp.value]"
          @click="handleClick(item)"
        >
          <TooltipOver
            :content="handleContent(item)"
            :style="{ maxWidth: '94px' }"
            refName="tooltipOverTit"
          />
        </div>
      </template>
      <div class="more-btn" v-if="dataMore.length">
        <div class="btn" @click="handleToggle">
          <span>更多</span
          ><i
            :class="`${showMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down'}`"
          ></i>
        </div>
        <div class="panel" v-show="showMore">
          <template v-for="(item, index) in dataMore">
            <span
              :key="item[defaultProp.value]"
              @click="handleClick(item, true, index)"
            >
              <TooltipOver
                :content="handleContent(item)"
                :style="{ maxWidth: '94px' }"
                refName="tooltipOverTit"
              />
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    haveAll: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    defaultProp: {
      type: Object,
      default: () => ({
        value: "id",
        label: "nameEn",
      }),
    },
  },
  data() {
    return {
      activeName: 0,
      tabsMax: 10,
      dataShow: [],
      dataMore: [],
      showMore: false,
    };
  },
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  mounted() {
    this.handleReSize();
    window.addEventListener("resize", this.handleReSize);
  },
  methods: {
    handleReSize() {
      const tabsMax = Math.round(
        (document.documentElement.clientWidth - 500) / 150
      );
      this.tabsMax = tabsMax < 4 ? 4 : tabsMax;
      if (this.dataList && this.dataList.length > this.tabsMax) {
        this.dataShow = this.dataList.slice(0, this.tabsMax);
        this.dataMore = this.dataList.slice(this.tabsMax);
      } else {
        this.dataShow = this.dataList || [];
      }
    },
    handleClick(btn, isMore, index) {
      this.activeName = btn[this.defaultProp.value];
      if (isMore) {
        const len = this.dataShow.length;
        const item = this.dataShow.splice(len - 1, 1, { ...btn });
        this.dataMore.splice(index, 1);
        this.dataMore = [{ ...item[0] }, ...this.dataMore];
      }
      this.showMore = false;
      this.$emit("handleSelect", this.activeName || undefined);
    },
    handleToggle() {
      this.showMore = !this.showMore;
    },
    handleContent(item) {
      const { label } = this.defaultProp;
      const [name1, name2] = label.split(",");
      if (name2) {
        return `${item[name1]}[${item[name2] || "--"}]`;
      }
      return item[name1];
    },
  },
};
</script>

<style lang="scss" scoped>
.search-tab {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 10px 0 5px;
  border-top: 1px solid #e2e2e2;
  .title {
    width: 74px;
    color: #a5a5a5;
  }
  .tab {
    width: calc(100% - 70px);
    display: flex;
    align-items: center;
    flex: 1;
    .item-tab {
      white-space: nowrap;
      line-height: 20px;
      padding: 5px 12px;
      margin: 0 8px;
      cursor: pointer;

      &:hover {
        background: #e3edff;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
        border-radius: 2px;
      }
      &.is-active {
        border-radius: 4px;
        color: #fff;
        background: rgba(80, 148, 255, 0.8);
      }
    }
    .more-btn {
      margin-left: 63px;
      color: #5094ff;
      position: relative;
      .btn {
        cursor: pointer;
      }
      i {
        font-size: 11px;
      }
      .panel {
        position: absolute;
        top: 22px;
        right: 0px;
        z-index: 100;
        width: 325px;
        overflow-y: auto;
        max-height: 300px;
        padding: 16px 15px 12px;
        background: #ffffff;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        border: 1px solid #5094ff;

        &::-webkit-scrollbar {
          z-index: 11;
          width: 6px;
        }
        &::-webkit-scrollbar:horizontal {
          height: 6px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          width: 6px;
          background: #b4bccc;
        }
        &::-webkit-scrollbar-corner {
          background: #fff;
        }
        &::-webkit-scrollbar-track {
          background: #fff;
        }
        &::-webkit-scrollbar-track-piece {
          background: #fff;
          width: 6px;
        }
        span {
          width: 94px;
          white-space: nowrap;
          display: inline-block;
          line-height: 18px;
          padding: 4px;
          margin-bottom: 4px;
          text-overflow: ellipsis;
          text-align: center;
          color: #515151;
          cursor: pointer;

          &:hover {
            background: #e3edff;
            box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
            border-radius: 2px;
          }

          /deep/ {
            .text-tooltip {
              justify-content: center;
            }
          }
        }
      }
    }
  }
}
</style>
