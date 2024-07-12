<template>
  <!-- 仓库管理/入库预报管理/第三方入库预报详情 -->
  <ThirdPartyWarehouseDetails
    ref="detailsRef"
    viewDetailsSource="warehouseReceiving"
  >
    <template v-slot:footerBtn="{ btnInfo }">
      <el-button
        type="primary"
        @click="() => handleUpdate(btnInfo.id)"
        v-if="[2, '2'].includes(btnInfo.orderState)"
      >
        {{overseaLangObj.sh_receipt()}}
      </el-button>
    </template>
  </ThirdPartyWarehouseDetails>
</template>

<script>
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { mapActions } from "vuex";
export default {
  name: "WarehouseThirdParty",
  mixins: [mixinEditCache],
  data() {
    return {
      isMixinCreatedMounted: "mounted",
    };
  },
  methods: {
    ...mapActions(["tagsView/delView"]),
    handleUpdate(id) {
      this["tagsView/delView"](this.$route).then(() => {
        // 返回时关闭当前页面，防止反复保存
        this.$router.replace({
          path: "/warehouseManage/inStorage/receiptPage",
          query: {
            id,
            modelType: "wms",
            backPath: this.$route.fullPath,
          },
        });
      });
    },
    mixinInitData() {
      setTimeout(() => {
        // 保存子组件加载完成
        this.$refs.detailsRef?.getInitData();
      });
    },
  },
  components: {
    ThirdPartyWarehouseDetails: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/wmsForecast/components/thirdPartyDetails.vue"
      ),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
