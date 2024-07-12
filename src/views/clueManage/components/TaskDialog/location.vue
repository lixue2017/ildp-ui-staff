<template>
  <div class="sign-in">
    <!-- <el-select v-model="keyword" placeholder="签到地址">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select> -->
    <el-input
      v-model="keyword"
      placeholder="请输入内容"
      @focus="handleFocus"
    ></el-input>
    <baidu-map
      :center="center"
      :zoom="zoom"
      @ready="handler"
      class="bm-view"
      ak="55rdq07VZjzCCZmSa5zrLVeeDBr0aSBI"
    >
      <bm-local-search
        class="local-search"
        :style="{
          ...(!searchShow ? { display: 'none' } : {}),
        }"
        :keyword="keyword"
        :auto-viewport="true"
        @infohtmlset="handleSelect"
      ></bm-local-search>
      <!-- <bm-circle :center="center" :radius="radius"></bm-circle> -->
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :showAddressBar="true"
        :autoLocation="true"
      ></bm-geolocation>
    </baidu-map>
  </div>
</template>

<script>
import { BaiduMap, BmView, BmLocalSearch, BmGeolocation } from "vue-baidu-map";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    BaiduMap,
    BmView,
    BmLocalSearch,
    BmGeolocation,
  },
  data() {
    const { address, latitude, longitude } = this.formData;
    return {
      keyword: address,
      center: { lng: longitude, lat: latitude },
      radius: 1000,
      zoom: 3,
      searchShow: false,
    };
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map);
      const { latitude, longitude } = this.formData;
      this.center.lng = longitude || 116.404;
      this.center.lat = latitude || 39.915;
      this.zoom = 15;
    },
    handleSelect(item) {
      this.searchShow = false;
      const {
        point: { lng, lat },
        province,
        city,
        tags,
      } = item;
      let address = item.address;
      let title = item.title;
      if (address && !address.includes(province)) {
        if (!address.includes(city)) {
          address = `${city}${address}`;
        }
        address = `${province}${address}`;
      }
      if (tags && tags.includes("交通设施") && title && !title.includes("站")) {
        title = `${title}站`;
      }
      address = `${address}${title}`;
      this.keyword = `${province}${city}${title}`;
      this.center.lng = lng;
      this.center.lat = lat;
      this.$emit("handleSelect", {
        title,
        lng,
        lat,
        address: `${province}${city}${title}`,
      });
      console.log("address", address);
    },
    handleFocus() {
      this.searchShow = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.sign-in {
  position: relative;
  .local-search {
    position: absolute;
    top: 30px;
    z-index: 10;
    & > div {
      & > div:nth-child(1) {
        height: 300px;
        overflow-y: auto;
      }
      & > div:nth-child(2) {
        margin-top: 0px;
      }
    }
  }
}
.bm-view {
  width: 100%;
  height: 300px;
  margin-top: 10px;
}
</style>
