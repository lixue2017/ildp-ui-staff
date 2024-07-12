<template>
  <div :class="classObj" class="app-wrapper">
    <div>
      <!-- <div
        v-if="device === 'mobile' && sidebar.opened"
        class="drawer-bg"
        @click="handleClickOutside"
      /> -->
      <sidebar ref="sidebarRef" class="sidebar-container" />
      <div
        class="main-container"
        :class="
          $refs.sidebarRef && $refs.sidebarRef.isCollapse
            ? 'right-container-expand'
            : ''
        "
      >
        <div class="fixed-header">
          <div class="header-box">
            <tags-view />
            <PersonCenter />
          </div>
        </div>
        <app-main />
        <!-- <right-panel v-if="showSettings">
          <settings />
        </right-panel> -->
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Layout",
  components: {
    AppMain,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    PersonCenter: () => import("./components/PersonCenter"),
    Item: () => import("./components/Sidebar/Item"),
    AppLink: () => import("./components/Sidebar/Link"),
  },
  mixins: [ResizeMixin],
  data() {
    return {
      hideSidebar: true,
    };
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
      selectPath: (state) => state.permission.selectPath,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  mounted() {},
  methods: {
    // handleClickOutside() {
    //   this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  // &.mobile.openSidebar {
  //   position: fixed;
  //   top: 0;
  // }
  .customer-main {
    margin-left: 0 !important;
  }

  .main-container {
    margin-left: 260px;
    &.right-container-expand {
      margin-left: 64px;
    }
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: 100%;
  transition: width 0.28s;
  .header-box {
    display: flex;
  }
}

// .hideSidebar .fixed-header {
//   width: 100%;
// }

// .mobile .fixed-header {
//   width: 100%;
// }
</style>
