<template>
  <div v-if="stateSearchList" class="state-tabs-box">
    <div class="search-state-tabs">
      <template v-for="(sItem, tIndex) in stateSearchSumList(1)">
        <div
          :key="tIndex"
          class="state-tab-item"
          :class="[stateSearchVal === sItem.id ? 'active-state' : '']"
          @click="() => handleStateChangeSearch(sItem)"
          @contextmenu.prevent="(e) => handleRightClick(e, sItem)"
        >
          <span>{{ sItem.nameCn }}</span>
          <span class="state-num" v-if="sItem.countSum || sItem.countSum === 0">
            <!-- 已完结不显示 -->
            ({{ sItem.countSum }})
          </span>
        </div>
      </template>
    </div>
    <SearchDropdown
      :searchFormData="searchFormData"
      :curCustomSearch="curCustomSearch"
      :stateSearchHideList="stateSearchSumList(2)"
      :tabName="tabName"
      :stateSearchVal="stateSearchVal"
      @onDropdownChangeState="(r) => handleStateChangeSearch(r, false)"
      @onClearCurSearch="
        () => {
          curCustomSearch = {};
        }
      "
    />

    <el-popover placement="bottom" width="212" v-model="cVisible">
      <!-- <p>是否设置为默认搜索条件？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="() => handleDefaultState()"
          >确定</el-button
        >
      </div> -->
      <div class="right-click-content">
        <div class="menu-li" @click="() => handleDefaultState()">
          设置为默认搜索条件
        </div>
        <div
          class="menu-li"
          v-if="
            stateSearchList[routeKey] &&
            stateSearchList[routeKey][0].id !== tabState.id
          "
          @click="() => handleHideState()"
        >
          隐藏页签
        </div>
      </div>
      <div
        slot="reference"
        class="context-menu"
        :style="{ top: `${contextMenuY}px`, left: `${contextMenuX}px` }"
      ></div>
    </el-popover>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { singleEmitEvents } from "@/utils/emit-events";
import { setRouteDefaultState, postSetHideStateTab } from "@/api/home";
export default {
  props: {
    searchFormData: {
      type: Object,
      default: () => ({}),
    },
    tabName: {
      type: String,
      default: () => "1",
    },
  },
  data() {
    return {
      routeKey: this.$route.path,
      routeQuery: this.$route.query,
      stateSearchVal: 1,
      countList: [],
      // getCustomSearchList: [],
      isVisibleChange: true,
      tabState: {},
      curCustomSearch: {},
      curSearchObj: {},
      cVisible: false,
      contextMenuX: 0,
      contextMenuY: 0,
    };
  },
  methods: {
    handleStateChangeSearch(sItem, isClear = true) {
      this.curCustomSearch = isClear ? {} : sItem;
      this.stateSearchVal = sItem.id;
      singleEmitEvents.emit(
        `onChangeSearchEvt${this.$route.path}`,
        sItem.searchObj
      );
    },
    handleRightClick(ev, sItem) {
      this.cVisible = false;
      const { left, top } = this.$el.getBoundingClientRect(); // 滚动条偏移量
      this.contextMenuX = ev.clientX - left;
      this.contextMenuY = ev.clientY - top;
      this.tabState = sItem;
      this.$nextTick(() => {
        this.cVisible = true;
      });
    },
    handleDefaultState() {
      setRouteDefaultState(this.tabState.id).then(() => {
        this.cVisible = false;
        this.msgSuccess("操作成功");
        this["customer/storeRouteSearch"]({
          route: this.routeKey,
          tab: this.tabName,
        });
      });
    },
    handleHideState() {
      postSetHideStateTab(this.tabState.id).then(() => {
        this.cVisible = false;
        this.msgSuccess("操作成功");
        this["customer/storeRouteSearch"]({
          route: this.routeKey,
          tab: this.tabName,
        });
      });
    },

    stateSearchSumList(stateNum) {
      const countStateList = (this.stateSearchList[this.routeKey] || []).map(
        (ele) => {
          const countSumObj = this.countList.find(
            (c) => c.countType === ele.countType
          );
          return {
            ...countSumObj,
            ...ele,
          };
        }
      );
      if (stateNum === 2) {
        return countStateList.filter((e) => e.isHide);
      }
      return countStateList.filter((e) => !e.isHide);
    },
    ...mapActions(["customer/storeRouteSearch"]),
  },
  created() {
    singleEmitEvents.on(`onChangeStateCountEvt${this.$route.path}`, (arr) => {
      this.countList = arr;
    });
  },
  mounted() {
    this["customer/storeRouteSearch"]({
      route: this.routeKey,
      tab: this.tabName,
      noWebRepeat: true,
    }).then((res) => {
      // console.log("==", res);
      // console.log(this.routeQuery.params);
      let stateDefault = res[this.routeKey]
        ? res[this.routeKey].find((e) => e.isDefault) || res[this.routeKey][0]
        : {};
      let { params } = this.routeQuery;
      if (params) {
        params = JSON.parse(params);
        if (params.countType) {
          stateDefault = res[this.routeKey]
            ? res[this.routeKey].find((e) => params.countType == e.countType) ||
              res[this.routeKey][0]
            : {};
        }
      }
      setTimeout(() => {
        // 初始化时表单与表格要先加载完
        this.handleStateChangeSearch(stateDefault);
      }, 100);
    });
  },
  computed: {
    ...mapState({
      stateSearchList: (state) => state.customer.routeSearchData || {},
    }),
  },
  components: {
    SearchDropdown: () => import("./SearchDropdown.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.state-tabs-box {
  display: flex;
  align-items: flex-start;
}
.search-state-tabs {
  display: flex;
  overflow-x: auto;
  max-width: calc(100% - 252px);
  white-space: nowrap;
  position: relative;
  .state-tab-item {
    flex: 1;
    text-align: center;
    color: #696969;
    font-weight: 400;
    padding-bottom: 6px;
    padding-right: 16px;
    cursor: pointer;
    // &:not(:last-child) {
    //   padding-right: 16px;
    // }
    .state-num {
      color: #5094ff;
    }
  }
  .active-state {
    color: #515151;
    font-weight: 600;
    position: relative;
    transition: all 0.3s;
    &::before {
      position: absolute;
      content: " ";
      bottom: 0;
      left: 0;
      width: calc(100% - 16px);
      height: 2px;
      background-color: #515151;
    }
  }
}
.context-menu {
  position: fixed;
  z-index: -1;
  background: #ffffff;
  opacity: 0;
}
.right-click-content {
  .menu-li {
    line-height: 30px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: #eef4ff;
      color: #73a9ff;
    }
  }
}
</style>
