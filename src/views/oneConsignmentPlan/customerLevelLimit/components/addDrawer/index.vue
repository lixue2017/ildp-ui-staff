<template>
  <ComDrawer
    ref="customDrawer"
    :customDrawer="customDrawerConfig"
    v-loading="loading"
    class="drawer-content"
  >
    <template v-slot:content>
      <el-timeline>
        <el-timeline-item v-for="(item, index) in activities" :key="index">
          <div>
            <div class="top">
              <div class="top-left">
                <span>{{ item.createTime }}</span>
                <span>{{ item.reviewedUser }}</span>
              </div>
              <div>
                {{
                  statusObj &&
                  statusObj[item.state] &&
                  statusObj[item.state].nameCn
                }}
              </div>
            </div>
            <div>{{ item.msg }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </template>
  </ComDrawer>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      customDrawerConfig: {
        title: "审核记录",
        width: "800px",
        showClose: false,
        customerStatus: 0,
        useFooter: "footer",
        footer: [
          {
            text: "取 消",
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      loading: false,
      isint: true,
      activities: [],
    };
  },
  computed: {
    ...mapState({
      statusObj: (state) => state.dictionary.dicsData.limitManageStatus,
    }),
  },
  methods: {
    show(rows = []) {
      this.activities = rows;
      this.$refs.customDrawer?.show();
    },
    hide() {
      this.$refs.customDrawer?.hide();
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
  },
};
</script>

<style lang="scss" scoped>
/deep/.drawer-content {
  padding-top: 10px !important;
}
.top {
  display: flex;
  justify-content: space-between;
  .top-left {
    & > span:not(:last-child) {
      margin-right: 30px;
    }
  }
}
</style>
