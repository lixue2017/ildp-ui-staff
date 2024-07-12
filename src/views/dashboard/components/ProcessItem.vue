<template>
  <div>
    <el-dropdown
      placement="bottom"
      @command="handleCommand"
      v-if="
        slotProps.row[`${slotProps.prop}Flag`] &&
        slotProps.row[slotProps.prop] != null
      "
    >
      <span :class="['process-num', slotProps.column.className]">
        (<span>{{ slotProps.row[slotProps.prop] }}</span
        >)
      </span>
      <el-dropdown-menu class="process-dropdown" slot="dropdown">
        <template v-for="item in slotProps.row[`${slotProps.prop}List`]">
          <el-dropdown-item
            :class="['process-dropdown-item', slotProps.column.className]"
            :key="item.type"
            :command="() => handleSkip(item.route, item.params)"
            >{{ item.name }} ({{ item.num }})</el-dropdown-item
          >
        </template>
      </el-dropdown-menu>
    </el-dropdown>
    <span
      :class="['process-num', slotProps.column.className]"
      @click="
        handleSkip(
          slotProps.row[`${slotProps.prop}Route`],
          slotProps.row[`${slotProps.prop}Params`]
        )
      "
      v-else-if="
        slotProps.row[`${slotProps.prop}Route`] &&
        slotProps.row[slotProps.prop] != null
      "
    >
      (<span>{{ slotProps.row[slotProps.prop] }}</span
      >)
    </span>
    <span v-else>{{
      slotProps.row[slotProps.prop] || slotProps.row[slotProps.prop] === 0
        ? slotProps.row[slotProps.prop]
        : "-"
    }}</span>
  </div>
</template>

<script>
export default {
  props: {
    slotProps: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    handleCommand(cb) {
      cb && cb();
    },
    handleSkip(path, params = {}) {
      if (!path) return;
      const query = {};
      if (Object.keys(params).length) {
        query.params = JSON.stringify(params);
      }
      try {
        this.$router.push({
          path,
          query,
        });
      } catch {
        this.$message.error("暂无权限，请联系管理员！");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.process-dropdown {
  max-height: 400px;
  overflow-y: hidden;
  transform: translate(60%, -18px) !important;
  margin: 0;
  box-shadow: 0px 0px 4px 2px rgba(160, 160, 160, 0.4);
  border: none;
  .process-dropdown-item:focus,
  .process-dropdown-item:not(.is-disabled):hover {
    color: #66a5ff;
    background: #fff;

    &.red {
      color: #ff6767;
    }
  }
}
.process-num {
  cursor: pointer;
  color: #66a5ff;
  &.red {
    color: #ff6767;
  }
  span {
    text-decoration: underline;
  }
}
</style>