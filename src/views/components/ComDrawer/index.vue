<template>
  <div class="drawer-wrapper">
    <el-drawer
      :title="customDrawer.title"
      :direction="customDrawer.direction || 'rtl'"
      :visible="drawerVisible"
      :close-on-press-escape="customDrawer.wrapperClosable || false"
      :wrapper-closable="customDrawer.wrapperClosable || false"
      :append-to-body="customDrawer.appendToBody || false"
      :show-close="customDrawer.showClose === false ? false : true"
      @close="handleClose"
      :size="customDrawer.width || '870px'"
    >
      <template v-if="customDrawer.slotTitle">
        <div slot="title">
          <slot name="title"></slot>
        </div>
      </template>
      <div class="drawer-content">
        <slot name="content"></slot>
      </div>
      <div
        class="drawer-footer"
        v-if="customDrawer[customDrawer.useFooter || 'footer']"
      >
        <template
          v-for="(item, index) in customDrawer[
            customDrawer.useFooter || 'footer'
          ]"
        >
          <el-button
            :type="item.type"
            @click="item.handleClick"
            :key="index"
            :plain="item.plain"
            :size="customDrawer.size || 'medium'"
            :disabled="item.disabled || false"
            v-hasPermi="item.hasPermission ? item.hasPermission : undefined"
            v-debounce
          >
            {{ item.text }}{{ item.num ? `(${item.num})` : "" }}
          </el-button>
        </template>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { msgBox } from "@/utils/confirmBox.js";
export default {
  components: {},
  props: {
    customDrawer: {
      type: Object,
      default: {},
    },
    confirmClose: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {},
  data() {
    return {
      drawerVisible: false,
    };
  },
  computed: {},
  methods: {
    show() {
      this.drawerVisible = true;
    },
    hide() {
      this.drawerVisible = false;
    },
    handleClose() {
      if (!this.drawerVisible) return;
      if (this.confirmClose) {
        const title = "取消提示";
        const className = "el-icon-warning text-warning";
        const msg = "取消操作之后当前页面将不会保存!";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          this.$emit("onClose");
          this.hide();
        });
      } else {
        this.$emit("onClose");
        this.hide();
      }
    },
  },
};
</script>

<style lang="scss">
.el-drawer__body {
  height: calc(100vh - 123px);
}
.el-drawer__header {
  height: 56px;
  font-weight: bold;
  padding: 0 0 0 26px;
  border-bottom: 1px solid #e2e2e2;
  margin-bottom: 30px;
  background-color: #f4f4f4;

  & > span {
    font-size: 16px;
    color: #515151;
    font-weight: bold;
  }
}
.drawer-wrapper .drawer-content {
  height: calc(100% - 56px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 26px 10px;

  &::-webkit-scrollbar {
    height: 6px;
    width: 10px;
  }
}

.drawer-footer {
  border-top: 1px solid #e2e2e2;
  text-align: right;
  padding: 13px 23px;
  background-color: #f4f4f4;
  button {
    font-size: 14px;
    font-weight: bold;
    &.el-button--medium {
      padding: 8px 15px;
    }
  }
}
</style>
