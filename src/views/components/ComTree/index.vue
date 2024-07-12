<template>
  <div class="com-tree">
    <div class="tree-left">
      <div class="search-input">
        <el-input
          v-if="searchConfig.show"
          placeholder="搜索"
          suffix-icon="el-icon-search"
          v-model="searchStr"
					@change="(val) => {
						searchStr = val.trim();
						searchConfig.handleSearch(searchStr);
					}"
        />
				<!-- @change="searchConfig.handleSearch" -->
      </div>
      <el-tree
        :data="data"
        :props="defaultProps"
        :node-key="nodeKey"
        :default-expanded-keys="[0]"
        :current-node-key="currentNode"
        :class="className"
        accordion
        highlight-current
        @node-click="handleNodeClick"
      >
        <span class="el-tree-node__label" :class="{'tree-node-box-width': !!rgWidth}" slot-scope="{ node, data }" >
          <span class="tree-left-width" :style="{width: `calc(100% - ${rgWidth}px)`}" :title="node.label">{{ node.label }}</span>
          <slot name="treeContent" v-bind:data="data" v-bind:node="node"></slot>
        </span>
      </el-tree>
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
    rgWidth: {
      type: Number,
      default: () => 0,
    },
    className: {
      type: String,
      default: () => '',
    },
    currentNode: {
      type: Number,
      default: () => 0,
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "label",
        };
      },
    },
    nodeKey: {
      type: String,
      default: () => "code",
    },
    searchConfig: {
      type: Object,
      default: () => {
        return {
          show: false,
          handleSearch: () => {},
        };
      },
    },
  },
  data() {
    return {
      searchStr: "",
    };
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss">
.com-tree {
  display: flex;
  justify-content: space-around;

  .tree-left {
    width: 200px;
    padding-top: 10px;
    border-radius: 2px;
    margin-top: 5px;
    background-color: #fff;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);

    .search-input {
      padding: 0 10px 10px;
    }

    .el-tree {
      background-color: transparent;
      height: calc(100% - 45px);
      overflow-y: auto;
      &::-webkit-scrollbar {
        height: 6px;
        width: 6px;
      }

      .el-tree-node__content {
        height: 36px;

        .el-tree-node__label {
          width: calc(100% - 35px);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &.tree-node-box-width {
            display: flex;
            align-items: center;
            .tree-left-width {
              display: inline-block;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
    }
    .el-tree {
      &.tree-basic-archives {
        //  基础档案
        height: auto;
        padding: 0 10px;
        .el-tree-node__expand-icon {
          display: none;
        }
        .el-tree-node {
          border-bottom: 1px solid #E2E2E2;
          &:first-child {
            border-top: 1px solid #E2E2E2;
          }
        }
        .el-tree-node__content {
          margin: 0 -10px;
          padding-left: 10px !important;
          padding-right: 10px;
          // height: 28px;
          .el-tree-node__label {
            width: 100%;
          }
        }
      }
    }
  }

  .tree-right {
    width: calc(100% - 220px);
  }
}
</style>
