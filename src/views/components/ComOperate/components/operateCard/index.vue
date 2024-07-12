<template>
  <div class="status-bar-box">
    <template v-for="(bItem, i) in showBarTabArr">
      <div
        :key="bItem.name"
        :class="[
          'hide-status-bar base-flex-align',
          bItem.className,
          showTabObj.isTabShow && 'show-status-bar',
          bItem.isTabShow && 'show-active-bar',
					overseaLangObj.yu_yan_lang === 'en-us' && 'en-us-status-bar'
        ]"
        @click="showBarEvt(i)"
      >
        <div>
          <i
            class="i-font-icon"
            :class="bItem.isTabShow ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          />
					<template v-if="overseaLangObj.yu_yan_lang === 'en-us'">
						<el-tooltip effect="dark" :content="`${bItem.isTabShow ? overseaLangObj.yc_hide_bar : overseaLangObj.wx_show_bar}${bItem.name}`" placement="top">
							<span>{{bItem.isTabShow ? "HIDE" : "SHOW"}}</span>
						</el-tooltip>
					</template>
					<template v-else>{{ bItem.isTabShow ? "隐藏" : "显示" }}{{ bItem.name }}</template>
        </div>
        <div v-if="bItem.isTabShow" class="active-bar-arrow"></div>
      </div>
    </template>

    <div :class="['com-operate', showTabObj.isTabShow && 'com-operate-width']">
      <slot name="slideCard" :showTabObj="showTabObj" />
    </div>
  </div>
</template>

<script>
// OperateSidebarCard: () => import("@/views/components/ComOperate/components/operateCard"),
import { mapActions, mapState } from "vuex";

export default {
  props: {
    showBarTabArr: {
      type: Array,
      default: () => [
        {
          isTabShow: false,
          tabKey: "stateBar",
          name: "状态栏",
        },
      ],
    },
    isTabShow: {
      type: Boolean,
      default: null,
    },
  },
  components: {},
  data() {
    return {
      isShowBar: false,
      showTabObj: {},
    };
  },
  methods: {
    showBarEvt(sIdx) {
      this.showBarTabArr.forEach((e, aIdx) => {
        e.isTabShow = aIdx === sIdx ? !e.isTabShow : false;
      });
      this.showTabObj = this.showBarTabArr[sIdx];
      this["operateDetails/storeShowSidebar"]({
        pathKey: this.$route.path,
        ...this.showBarTabArr[sIdx],
      });
    },
    ...mapActions(["operateDetails/storeShowSidebar"]),
  },
  created() {
    const isTabShow = this.isTabShow === false ? false : true;
    this.showTabObj = this.sidebarObj[this.$route.path] || {
      ...(this.showBarTabArr[0] || {}),
      isTabShow,
    };
    if (this.showTabObj.isTabShow) {
      const sIndex = this.showBarTabArr.findIndex(
        (e) => e.tabKey === this.showTabObj.tabKey
      );
      if (sIndex > -1) {
        this.showBarTabArr[sIndex].isTabShow = isTabShow;
      }
    }
    if (this.isTabShow && !this.showBarTabArr.length) {
      this.showTabObj.isTabShow = isTabShow;
    }
  },
  computed: {
    ...mapState({
      sidebarObj: (state) => state.operateDetails.sidebarShowObj,
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "@/views/components/ComOperate/operate.scss";
.status-bar-box {
}
</style>
