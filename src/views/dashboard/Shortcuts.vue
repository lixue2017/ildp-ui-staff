<template>
  <div class="chart-wrapper">
    <TitleTop title="快捷工具">
      <template v-slot:right>
        <el-dropdown @command="handleCommand">
          <el-button type="primary" size="small" round>
            编辑<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu class="shortcuts-dropdown" slot="dropdown">
            <el-dropdown-item
              v-for="item in compData"
              :key="item.menuId"
              :disabled="!!item.select"
              :command="
                () => {
                  handleSelect(item);
                }
              "
            >
              <div :class="item.select ? 'item-name' : ''">
                {{ item.menuName }}
              </div>
              <div class="item-btn" v-if="item.select">
                <el-button
                  style="color: #ff6767"
                  type="text"
                  size="small"
                  @click="handleDelete($event, item)"
                  v-debounce
                  >移除</el-button
                >
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </TitleTop>
    <div class="shortcuts-btn">
      <template v-for="btn in compDataSelect">
        <el-button
          v-if="btn.select"
          :key="btn.id"
          size="small"
          plain
          round
          @click="handleSkip(btn.route)"
          >{{ btn.menuName }}</el-button
        >
      </template>
      <div class="no-data" v-if="!compDataSelect.length">暂无快捷工具~</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    compData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    TitleTop: () => import("@/views/dashboard/components/TitleTop"),
  },
  data() {
    return {
      compDataSelect: [],
    };
  },
  watch: {
    compData(newVal, oldVal) {
      if (newVal) {
        this.compDataSelect = newVal.filter((item) => item.select);
      }
    },
  },
  mounted() {
    this.compDataSelect = this.compData.filter((item) => item.select);
  },
  methods: {
    handleSkip(name) {
      this.$router.push({
        name,
      });
    },
    handleDelete(e, item) {
      if (e && e.stopPropagation) {
        e.stopPropagation();
      } else {
        window.event.cancelable = true;
      }
      this.handleSelect(item);
    },
    handleCommand(cb) {
      cb && cb();
    },
    handleSelect(item) {
      this.$emit("handleSelect", {
        menuId: item.menuId,
      });
    },
  },
};
</script>
<style lang="scss">
.shortcuts-dropdown {
  max-height: 400px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  box-shadow: 0px 0px 4px 2px rgba(160, 160, 160, 0.4);
  border: none;

  .popper__arrow {
    // border: none;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  }
  &.el-popper[x-placement^="bottom"] {
    margin-top: 3px;
  }
  .el-dropdown-menu__item {
    display: flex;
    justify-content: space-between;
    .item-name {
      color: #a5a5a5;
    }
    .item-btn {
      margin-left: 17px;
      .el-button {
        cursor: pointer;
        pointer-events: all;
      }
    }
  }
  .no-data {
    text-align: center;
    color: #69707a;
    padding: 10px 0 15px;
  }
}
</style>
<style lang="scss" scoped>
.shortcuts-btn {
  padding: 14px 0 10px;
  margin-left: -15px;
  .el-button {
    margin-bottom: 10px;
    margin-left: 15px;
  }
}
</style>