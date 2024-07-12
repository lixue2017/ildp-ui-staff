<template>
  <ComDrawer
    ref="customDrawer"
    :customDrawer="customDrawerConfig"
    :confirmClose="false"
  >
    <template v-slot:title>
      <span>箱单维护记录</span>
      <span class="tit-order-sn">{{ resData.orderSn || "" }}</span>
    </template>
    <template v-slot:content>
      <div class="drawer-class">
        <div
          class="no-maintenance word-break-all"
          v-if="resData.noOrderSnList && resData.noOrderSnList.length"
        >
          箱单无维护记录单号：{{ resData.noOrderSnList.join(", ") }}
        </div>
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(activity, index) in resData.logList || []"
            :key="index"
            :color="index === 0 ? '#00adb2' : '#bcbcbc'"
            class="timeline"
          >
            <div class="operation" style="word-break: break-all">
              <div class="drawer-title">
                <span>{{ activity.optTime || "--" }}</span>
                <span> {{ activity.optUserName || "" }} </span>
                <span class="tag-blue-color">
                  {{ ["预报", "核实"][activity.optType - 201] || "--" }}
                </span>
              </div>
            </div>
            <div class="operation" style="word-break: break-all">
              {{ activity.remark || "--" }}
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </template>
  </ComDrawer>
</template>

<script>
import { postPackingRecord } from "@/api/performance/record.js";

export default {
  data() {
    return {
      customDrawerConfig: {
        title: "箱单维护记录",
        width: "500px",
        useFooter: "footer",
        slotTitle: true,
        footer: [
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      resData: {},
    };
  },
  methods: {
    show(row) {
      this.resData = {};
      const params = {
        tootId: row.tootId,
        optTypeList: [201, 202], // 201=预报清关货物；202=核实清关货物
      };
      postPackingRecord(params).then((res) => {
        this.resData = res.data || {};
      });
      this.$refs.customDrawer.show();
    },
    hide() {
      this.$refs.customDrawer.hide();
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
  },
};
</script>

<style lang="scss" scoped>
.tit-order-sn {
  margin-left: 8px;
  font-weight: 400;
  color: #5094ff;
}
.no-maintenance {
  border: 1px solid rgba(255, 229, 143, 1);
  background-color: rgba(255, 251, 230, 1);
  border-radius: 4px;
  padding: 8px;
  line-height: 22px;
}
/deep/ {
  .drawer-content {
    padding: 5px 26px 10px;
  }
  .drawer-class {
    .operation {
      margin-top: 10px;
    }
  }
}
</style>
