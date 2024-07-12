<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <baidu-map
        :center="center"
        :zoom="zoom"
        @ready="handler"
        class="bm-view"
        ak="55rdq07VZjzCCZmSa5zrLVeeDBr0aSBI"
      >
      </baidu-map>
    </template>
  </ComDialog>
</template>
<script>
import { BaiduMap } from "vue-baidu-map";
export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    BaiduMap,
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    const { latitude, longitude } = this.formData;
    return {
      customDialogConfig: {
        title: "地图",
        width: "600px",
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "关 闭",
            plain: true,
            handleClick: this.hide,
          },
        ],
      },
      center: { lng: longitude, lat: latitude },
      zoom: 3,
    };
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map);
    },
    show(data) {
      const { latitude, longitude } = data;
      this.center.lng = longitude || 116.404;
      this.center.lat = latitude || 39.915;
      this.zoom = 15;
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.bm-view {
  width: 100%;
  height: 300px;
}
</style>
