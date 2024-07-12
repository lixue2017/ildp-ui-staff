<template>
  <div :class="isCollapse ? 'put-away' : ''">
    <logo>
      <div class="expand-and-collapse" @click="handleExpandCollapse">
        菜单{{ isCollapse ? "展开" : "收起" }}
      </div>
    </logo>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="left-menu-container">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in permission_routes"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
  data() {
    return {
      isCollapse: false,
    };
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const { meta, path, query } = this.$route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      if (query.activeMenu) {
        //需要跳转详情后又能返回到上个页面，又要激活左侧菜单选中
        return query.activeMenu;
      } else if (query.backPath) {
        // 详情页定位菜单
        return query.backPath;
      }
      return path;
    },
    variables() {
      return variables;
    },
  },
  methods: {
    handleExpandCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="scss" scoped>
.left-menu-container {
  width: 260px;
  position: fixed;
  z-index: 1001;
  top: 60px;
}
.put-away {
  /deep/ {
    .left-menu-container {
      width: 64px;
      .el-submenu__title {
        span {
          display: none;
        }
        .el-submenu__icon-arrow {
          display: none;
        }
      }
    }
  }
}

.expand-and-collapse {
  font-size: 14px;
  display: inline-block;
  vertical-align: middle;
  padding-right: 10px;
  color: #bcbcbc;
  cursor: pointer;
}

/deep/ {
  .el-submenu__title i.iconfont,
  .el-menu-item i.iconfont {
    font-size: 18px;
  }
  .el-scrollbar__view > .el-menu > div {
    & > li > .el-submenu__title i.iconfont {
      font-size: 20px;
    }
    &:nth-child(4n - 2) > li {
      & > .el-submenu__title i.iconfont {
        color: #bdb8ff;
      }
    }
    &:nth-child(4n - 1) > li {
      & > .el-submenu__title i.iconfont {
        color: #ffbb97;
      }
    }
    &:nth-child(4n) > li {
      & > .el-submenu__title i.iconfont {
        color: #84e2c0;
      }
    }
    &:nth-child(4n + 1) > li {
      & > .el-submenu__title i.iconfont {
        color: #f3e065;
      }
    }
  }
}
</style>
