<template>
  <div
    :class="[
      'com-tabs',
      tabsConfig.className || '',
      tabsConfig.isBtnPane && 'btn-pane',
    ]"
  >
    <el-tabs
      v-model="tabsConfig.activeName"
      :before-leave="beforeLeave"
      @tab-click="tabsConfig.handleTabsClick"
    >
      <template v-if="!tabsConfig.slotTabs">
        <template v-for="tab in tabsConfig.tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            <slot :name="`tabs${tab.name}`" :tabName="tab.name" />
          </el-tab-pane>
        </template>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </el-tabs>
    <div class="tabs-right-btn">
      <slot name="slotTabsRight" />
      <template
        v-for="(btn, i) in tabsConfig.btnArr ||
        (tabsConfig.rightBtn ? tabsConfig.rightBtn[tabsConfig.activeName] : [])"
      >
        <slot name="btnOptions" :slotProps="{ btn }" v-if="btn.options" />
        <template v-else>
          <el-dropdown
            v-if="
              btn.btnType === 'dropdown' &&
              (btn.showTabName
                ? btn.showTabName.includes(tabsConfig.activeName)
                : true)
            "
            :key="`dropdown-${i}`"
            trigger="click"
            placement="bottom"
          >
            <el-button
              :type="btn.type || 'primary'"
              :size="btn.size || 'small'"
              :plain="btn.plain || false"
              :disabled="btn.disabled || false"
              :class="btn.className"
              @click="btn.handleDropdown && btn.handleDropdown()"
            >
              {{ btn.table }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" :class="btn.dropdownClassName">
              <el-dropdown-item
                v-for="dItem in btn.dropdownArr"
                :key="dItem.value"
                @click.native="btn.handleClick && btn.handleClick(btn, dItem)"
                >{{ dItem.name }}</el-dropdown-item
              >
              <div class="dropdown-no-data" v-if="!btn.dropdownArr.length">
                无数据
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-else-if="
              btn.showTabName
                ? btn.showTabName.includes(tabsConfig.activeName)
                : !btn.hideTabBtn
            "
            v-debounce="btn.banDebounce"
            :key="`btn-${i}`"
            :type="btn.type || 'primary'"
            :size="btn.size || 'small'"
            :plain="btn.plain || false"
            :disabled="btn.disabled || false"
            :icon="btn.icon"
            :class="btn.className"
            :loading="btn.tabBtnLoading && isBtnLoading"
            @click="btn.handleClick && btn.handleClick()"
            >{{ btn.table }}</el-button
          >
        </template>
      </template>
      <!-- <el-button type="primary" size="small" @click="handleUpdate" >新增</el-button>
      <el-button type="primary" size="small">导入</el-button>
      <el-button type="primary" size="small">导出</el-button>
      <el-button type="primary" size="small" plain>导出模板</el-button> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    tabsConfig: {
      type: Object,
      default: () => {},
    },
    beforeLeave: {
      type: Function,
      default: () => true,
    },
  },
  methods: {},
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
    }),
  },
};
</script>

<style lang="scss">
.dropdown-no-data {
  padding: 5px 20px;
}
.com-tabs {
  position: relative;
  background-color: #ffffff;

  .el-tabs__item {
    height: auto;
    line-height: initial;
    padding: 6px 20px 6px 20px;
  }
  .tabs-right-btn {
    display: flex;
    align-items: center;
    position: absolute;
    top: -5px;
    right: 0px;
    z-index: 1;
    .dropDown {
      margin-left: 10px;
    }
  }
  .el-button [class*="iconfont"] + span {
    margin-left: 5px;
  }
  &.btn-pane {
    .el-tabs__header {
      margin-bottom: 5px;
    }
    .tabs-right-btn {
      top: 3px;
    }
    .el-tabs__nav-scroll::after {
      display: none;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item {
      font-size: 13px;
      font-weight: bold;
      padding: 4px 12px;
      color: #515151;
      border: 1px solid #bcbcbc;
      border-radius: 2px;
      margin-right: 12px;
      &.is-active {
        color: #5094ff;
        border: 1px solid #5094ff;
      }

      &:hover {
        color: #5094ff;
        border-color: #5094ff;
      }

      &.is-top:last-child {
        padding-right: 15px;
      }
      &.is-top:nth-child(2) {
        padding-left: 15px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.com-tabs {
  &.slot-label-state {
    /deep/ {
      .el-tabs__nav {
        width: calc(100% - 160px);
        .el-tabs__item {
          width: 100%;
          padding-bottom: 0;
        }
      }
      .el-tabs__active-bar {
        display: none;
      }
    }
  }
}
.tabs-right-btn {
  /deep/ {
    button {
      i {
        font-size: 12px;
        font-weight: bold;
      }
      span {
        font-weight: bold;
      }
    }
    .switchBtn {
      top: 0px;
    }
  }
}
/deep/ {
  .el-dropdown {
    margin-left: 10px;
  }
}
</style>
