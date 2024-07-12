<template>
  <ComDrawer ref="customDrawer" :customDrawer="customDrawerConfig">
    <template v-slot:content>
      <div class="content-timeline">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :color="activity.color"
            :timestamp="activity.content"
          >
            <span> {{ activity.timestamp }}</span>
            <span class="timeline-user">{{ activity.des }}</span>
          </el-timeline-item>
        </el-timeline>
      </div>
    </template>
  </ComDrawer>
</template>

<script>
import { getRepulse } from "@/api/order/firstTransport.js";
export default {
  props: {
    formModel: {
      type: Object,
      default: () => {
        return {
          encasementWay: 1,
          pickUpHome: false,
        };
      },
    },
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComDrawer: () => import("_comp/ComDrawer"),
  },
  data() {
    return {
      customDrawerConfig: {
        title: "打回记录",
        width: "460px",
        customerStatus: 0,
        useFooter: "footer",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      reverse: false,
      activities: [
        {
          content: "费用信息不全，缺了订舱费",
          des: "由WADA打回",
          timestamp: "2022/07/20 00:26:34",
          color: "#000000",
        },
        {
          content: "费用信息不全，缺了订舱费",
          des: "由WADA打回",
          timestamp: "2022/07/18 00:26:34",
        },
        {
          content: "费用信息不全，缺了订舱费",
          des: "由WADA打回",
          timestamp: "2022/07/15 00:26:34",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    show(rows) {
      getRepulse(rows.id).then((res) => {
        this.$refs.customDrawer.show();
      });
    },
    hide() {
      this.$refs.customDrawer.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.content-timeline {
  padding-top: 10px;
  .timeline-user {
    padding-left: 10px;
  }
}
</style>
