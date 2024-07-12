<template>
  <div>
    <ComDrawer
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :color="index === 0 ? '#00adb2' : '#bcbcbc'"
            class="timeline"
          >
            <div class="title">
              <slot name="title" :activity="activity"></slot>
            </div>
            <div class="operation">
              <slot name="operationDate" :activity="activity"></slot>
            </div>
            <div class="operation">
              <slot name="operationContent" :activity="activity"></slot>
            </div>
          </el-timeline-item>
        </el-timeline>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
export default {
  props: {
    activities: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
  },
  data() {
    return {
      dialogShow: false,
      drawerConfig: {
        title: "操作日志",
        width: "550px",
      },
    };
  },
  methods: {
    show() {
      this.$refs.myDrawer.show();
    },
    hide() {
      this.$refs.myDrawer.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-timeline {
  margin-top: 4px;
}
.timeline {
  /deep/ {
    .el-timeline-item__tail {
      left: 3.5px;
      border-left: 1px dashed #e4e7ed;
    }
    .el-timeline-item__node--normal {
      width: 10px;
      height: 10px;
    }
  }
  .title {
    font-size: 14px;
    color: #333333;
    margin-bottom: 7px;
  }
  .operation {
    font-size: 12px;
    color: #606060;
    margin-bottom: 6px;
  }
}
</style>
