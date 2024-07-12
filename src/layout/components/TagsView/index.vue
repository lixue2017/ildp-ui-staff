<template>
  <div class="tags-view-container">
    <!-- <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
      style="float: left"
    /> -->
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper tags-page-sort"
      @scroll="handleScroll"
    >
      <template v-for="tag in visitedViews">
        <router-link
          v-if="!isAffix(tag)"
          ref="tag"
          :key="tag.path"
          :class="[isActive(tag) && 'active']"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          :style="activeStyle(tag)"
          @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
          @contextmenu.prevent.native="openMenu(tag, $event)"
        >
          <!-- <template v-if="!isAffix(tag)"> -->
          {{ tag.title }}
          <!-- <span
						v-if="!isAffix(tag)"
						class="el-icon-close"
						@click.prevent.stop="closeSelectedTag(tag)"
					/> -->
          <i
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
            v-if="!isAffix(tag)"
          ></i>
          <!-- </template> -->

          <!-- <el-dropdown placement="bottom" @command="handleCommand" v-else>
						<span class="dropdown-affix">
							{{ tag.title }}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu class="affix-menu" slot="dropdown">
							<template v-for="item in affixAuthority">
								<el-dropdown-item
									:key="item.type"
									:command="() => handleCommandItem(item.type)"
									:class="affixActive === item.type && 'isActive'"
									>{{ item.name }}</el-dropdown-item
								>
							</template>
						</el-dropdown-menu>
					</el-dropdown> -->
        </router-link>
        <span class="tags-fix-item" :key="tag.path" v-else>
          <router-link
            ref="tag"
            :key="tag.path"
            :class="[isActive(tag) && 'active']"
            :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
            tag="span"
            class="tags-view-item"
            :style="activeStyle(tag)"
            @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
            @contextmenu.prevent.native="openMenu(tag, $event)"
          >
            {{ tag.title }}
            <i
              class="el-icon-close"
              @click.prevent.stop="closeSelectedTag(tag)"
              v-if="!isAffix(tag)"
            ></i>
          </router-link>
        </span>
      </template>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭当前
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
import path from "path";
import { mapGetters, mapActions } from "vuex";
import Sortable from "sortablejs";
export default {
  components: {
    ScrollPane,
    Hamburger: () => import("@/components/Hamburger"),
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      affixAuthority: [
        { type: 1, name: "默认首页" },
        { type: 2, name: "业务首页" },
        { type: 3, name: "操作首页" },
        { type: 4, name: "财务首页" },
      ],
    };
  },
  computed: {
    ...mapGetters(["sidebar", "affixActive", "component"]),
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    routes() {
      return this.$store.state.permission.routes;
    },
    theme() {
      return this.$store.state.settings.theme;
    },
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  mounted() {
    this.initTags();
    this.addTags();
    this.$nextTick(() => {
      new Sortable(
        document.querySelector(
          ".tags-page-sort.tags-view-wrapper .el-scrollbar__view"
        ),
        {
          sort: true,
          animation: 150,
        }
      );
    });
  },
  methods: {
    ...mapActions(["home/switchAffix"]),
    isActive(route) {
      return route.path === this.$route.path;
    },
    activeStyle(tag) {
      if (!this.isActive(tag)) return {};
      return {
        "background-color": this.theme,
        "border-color": this.theme,
      };
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    filterAffixTags(routes, basePath = "/") {
      let tags = [];
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch("tagsView/addVisitedView", tag);
        }
      }
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("tagsView/addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("tagsView/updateVisitedView", this.$route);
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      });
    },
    closeSelectedTag(view) {
      this.$store
        .dispatch("tagsView/delView", view)
        .then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view);
          }
        });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store
        .dispatch("tagsView/delOthersViews", this.selectedTag)
        .then(() => {
          this.moveToCurrentTag();
        });
    },
    closeAllTags(view) {
      this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.path === this.$route.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
          // to reload home page
          this.$router.replace({ path: "/redirect" + view.fullPath });
        } else {
          this.$router.push("/");
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const dis = 300;
      const left = e.clientX - offsetLeft + 15 + dis; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    handleCommand(cb) {
      cb && cb();
    },
    handleCommandItem(affixActive) {
      this["home/switchAffix"]({
        component: this.component,
        affixActive,
      });
    },
  },
};
</script>

<style lang="scss">
.affix-menu {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-color: #ebeef5;

  .popper__arrow {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  }
  &.el-popper[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: #ebeef5;
  }
  .el-dropdown-menu__item {
    &:focus,
    &:not(.is-disabled):hover,
    &.isActive {
      background-color: rgba($color: #00adb2, $alpha: 0.1);
      color: #00adb2;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.tags-view-container {
  height: 60px;
  width: calc(100% - 139px);
  background: #fff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  margin-left: $sideBarWidth;
  padding-right: 430px;
  .scroll-container {
    height: 100%;
    padding-left: 90px;
  }
  .tags-view-wrapper {
    /deep/ {
      .el-scrollbar__view {
        height: 100%;
        display: flex;
        align-items: center;

        .el-icon-close {
          margin-left: 4px;
        }
      }
    }
    .tags-view-item {
      display: block;
      position: relative;
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      border-radius: 4px;
      margin-right: 15px;
      text-align: center;
      cursor: pointer;
      color: #393939;
      background: #fff;
      &:first-child {
        margin-left: 15px;
      }
      &.active {
        color: #fff;
        font-weight: 400;
        /deep/ {
          .dropdown-affix {
            color: #fff;
            font-weight: 400;
          }
        }
      }
    }
    .tags-fix-item {
      font-weight: bold;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      background: #fff;
      overflow: hidden;
      margin: 0;
      .tags-view-item {
        margin: 10px 15px;
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    // top: 50px !important;
    // right: 400px !important;
    // left: auto !important;
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}

.customer-tags {
  height: 48px;
  margin-left: 0;
  padding-left: 36px;
  padding-right: 0;
  .tags-view-wrapper {
    .tags-view-item {
      height: 36px;
      line-height: 36px;
      padding: 0 11px;
      margin-right: 12px;
      background-color: #fafafa;
      &:first-child {
        margin-left: 0;
      }

      &.active {
        background-color: rgba(255, 129, 61, 0.08) !important;
        color: rgb(255, 129, 61);
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    // .el-icon-close {
    //   width: 16px;
    //   height: 16px;
    //   vertical-align: 2px;
    //   border-radius: 50%;
    //   text-align: center;
    //   transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    //   transform-origin: 100% 50%;
    //   &:before {
    //     transform: scale(0.6);
    //     display: inline-block;
    //     vertical-align: -3px;
    //   }
    //   &:hover {
    //     background-color: #b4bccc;
    //     color: #fff;
    //   }
    // }
  }
}
</style>
