<template>
  <div class="base-flex-align search-dropdown" @click.stop>
    <el-dropdown trigger="click" @visible-change="handleDropdownChange">
      <span
        class="el-dropdown-link"
        :class="[
          stateSearchVal === curCustomSearch.id ? 'active-more-state' : '',
        ]"
      >
        <span class="ellipsis-text">
          <template v-if="[0, 1].includes(curCustomSearch.regular)">
            {{ curCustomSearch.nameCn || "--" }}
            <span
              class="state-num"
              v-if="
                curCustomSearch.regular === 1 &&
                (curCustomSearch.countSum || curCustomSearch.countSum === 0)
              "
            >
              ({{ curCustomSearch.countSum }})
            </span>
          </template>
          <template v-else>更多搜索</template>
        </span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <div class="custom-search-list">
            <div
              class="base-flex-between"
              v-for="(sRow, sIdx) in moreSearchList || []"
              :key="sIdx"
            >
              <span
                class="item-li search-name"
                @click="() => handleDropdownCommand(sRow)"
              >
                <!-- :class="[
                    curCustomSearch.id === sRow.id ? 'cur-search-item' : '',
                  ]" -->
                {{ sRow.nameCn || "--" }}
                <template
                  v-if="
                    sRow.regular === 1 && (sRow.countSum || sRow.countSum === 0)
                  "
                >
                  ({{ sRow.countSum }})
                </template>
              </span>
              <span
                class="item-li search-close"
                @click="() => handleShowOrClose(sRow)"
                :style="{ color: sRow.regular === 1 ? '#5094ff' : '#FF6767' }"
              >
                <!-- <i class="el-icon-close"></i
                > -->
                <!-- 1为固定列  0为自定义搜索条件 -->
                {{ sRow.regular === 1 ? "显示" : "删除" }}
              </span>
            </div>
            <div
              v-if="!moreSearchList || !moreSearchList.length"
              style="color: #919191"
            >
              暂无数据
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div @click.prevent.stop="handleSearchSave" class="tab-search-btn">
      保存当前搜索
    </div>
    <ComCustomDialog ref="customSearchRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { singleEmitEvents } from "@/utils/emit-events";
import {
  postSaveCustomSearch,
  getTabCustomSearch,
  delCustomSearch,
  postSetShowStateTab,
} from "@/api/home";
import { customDialogSearchCols } from "../model";
export default {
  props: {
    searchFormData: {
      type: Object,
      default: () => ({}),
    },
    curCustomSearch: {
      type: Object,
      default: () => ({}),
    },
    stateSearchVal: {
      type: [Number, String],
      default: () => null,
    },
    stateSearchHideList: {
      type: Array,
      default: () => [],
    },
    tabName: {
      type: String,
      default: () => "1",
    },
  },
  data() {
    return {
      routeKey: this.$route.path,
      getCustomSearchList: [],
      isVisibleChange: true,
    };
  },
  watch: {
    tabName(val) {
      this.isVisibleChange = true;
    },
  },
  methods: {
    handleSearchSave() {
      this.$refs.customSearchRef.showCustomDialog({
        customFormConfig: customDialogSearchCols(),
        httpRequest: ({ nameCn }) => {
          return postSaveCustomSearch({
            nameCn,
            searchObj: this.searchFormData,
            route: this.routeKey,
            tab: this.tabName,
          });
        },
        successFunction: () => {
          this.msgSuccess("操作成功");
          this.isVisibleChange = true;
        },
      });
    },
    handleDropdownChange(v) {
      if (v) {
        this.handleCustomSearchList();
      }
    },
    handleDropdownCommand(row) {
      if (row.regular === 1) {
        this.$emit("onDropdownChangeState", row);
      } else {
        singleEmitEvents.emit(
          `onCustomSearchEvt${this.$route.path}`,
          row.searchObj || {}
        );
      }
    },
    handleShowOrClose(mItem) {
      if (mItem.regular === 1) {
        postSetShowStateTab(mItem.id).then(() => {
          this.isVisibleChange = true;
          this.msgSuccess("操作成功");
          if (this.curCustomSearch.id === mItem.id) {
            this.$emit("onClearCurSearch");
          }
          this["customer/storeRouteSearch"]({
            route: this.routeKey,
            tab: this.tabName,
          });
        });
      } else {
        delCustomSearch(mItem.id).then(() => {
          this.isVisibleChange = true;
        });
      }
    },
    handleCustomSearchList() {
      if (this.isVisibleChange) {
        getTabCustomSearch({
          route: this.routeKey,
          tab: this.tabName,
          pageNum: 1,
          pageSize: 99999,
        }).then((res) => {
          this.isVisibleChange = false;
          this.getCustomSearchList = res.rows || [];
        });
      }
    },
    ...mapActions(["customer/storeRouteSearch"]),
  },
  computed: {
    moreSearchList() {
      return [...this.stateSearchHideList, ...this.getCustomSearchList];
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.search-dropdown {
  padding: 0 0 6px 6px;
  .el-dropdown {
    cursor: pointer;
    margin: 0 5px 0 0;
    font-weight: 400;
    .el-dropdown-link {
      display: flex;
      align-items: center;
      max-width: 150px;
      padding: 0 5px;
      &.active-more-state {
        background-color: #eef4ff;
      }
      .state-num {
        color: #5094ff;
      }
    }
  }
  .tab-search-btn {
    cursor: pointer;
    color: #5094ff;
    font-weight: 600;
  }
}
.el-dropdown-menu--medium {
  .el-dropdown-menu__item {
    padding-right: 0;
    &:not(.is-disabled):hover {
      background-color: #fff;
      color: #515151;
    }
  }
  .custom-search-list {
    overflow: auto;
    max-height: 500px;
    max-width: 390px;
    padding-right: 17px;
    .item-li {
      padding: 0 5px;
      &.search-name {
        flex: 1;
        white-space: normal;
        word-break: break-all;
      }
      &.search-close {
        .el-icon-close {
          margin: 0;
        }
      }
      &.cur-search-item {
        background-color: #eef4ff;
        color: #73a9ff;
      }
      &:hover {
        background-color: #eef4ff;
        color: #73a9ff;
      }
    }
  }
}
.context-menu {
  position: fixed;
  z-index: -1;
  background: #ffffff;
  opacity: 0;
}
</style>
