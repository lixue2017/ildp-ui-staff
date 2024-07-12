<template>
  <div id="app" class="staff">
    <router-view />
  </div>
</template>



<script>
import { mapState, mapActions } from "vuex";
import { removeWatermark, setWaterMark } from "@/utils/waterMark";
export default {
  name: "App",
  data() {
    return {};
  },
  mounted() {
		// window.addEventListener("offline", () => {
		// 	console.log("已断网");
		// });
		window.addEventListener("online", () => {
			this.preventRepeatedClicks = false;
			this["settings/actionRepeatedClick"](false);
			// console.log("网络已连接", this);
		});

    this.setWaterMark();
    this.$nextTick((_) => {
      //页面缩放时水印位置与高度自适应,
      window.addEventListener("resize", this.setWaterMark, true);
    });
  },
  destroyed() {
    removeWatermark();
    window.removeEventListener("resize", this.setWaterMark, true);
  },
  methods: {
    setWaterMark() {
      setWaterMark("堡森三通", ""); //背景水印
    },
		...mapActions([
			"settings/actionRepeatedClick"
    ])
  },
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
// @import "../public/iconfont/iconfont.css"; //20220630，iconfont官网正在维护无法生成unicode只能下载到本地，这里全局引用下载到本地的icon-font
// @import "@/assets/styles/iconfont.scss"
</style>
