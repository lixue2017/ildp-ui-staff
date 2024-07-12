<template>
  <div class="tree-container">
    <div class="tree-left">
      <el-tree
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
        node-key="id"
        :default-expanded-keys="[6]"
      ></el-tree>
      <slot name="treeFooter"></slot>
    </div>
    <div class="tree-right">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    handleNodeClick: {
      type: Function,
      default: () => {},
    },
    // rgWidth: {
    //   type: Number,
    //   default: () => 0,
    // },
    // className: {
    //   type: String,
    //   default: () => "",
    // },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "label",
        };
      },
    },
    // nodeKey: {
    //   type: String,
    //   default: () => "code",
    // },
    // searchConfig: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       show: false,
    //       handleSearch: () => {},
    //     };
    //   },
    // },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss">
.tree-container {
  display: flex;
  .tree-left {
    width: 180px;
    border-right: 1px solid #e2e2e2;
    height: 846px;
  }
  .tree-right {
    width:100%;
    padding:30px
  }
}
</style>
