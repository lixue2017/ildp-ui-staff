<template>
  <div class="dashboard-editor-container">
    <div class="card" v-if="!loading">
      <template v-for="name in component.top">
        <comp-item :name="name" :key="name" />
      </template>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <template v-for="name in component.left">
            <comp-item :ref="`${name}Ref`" :name="name" :key="name" />
          </template>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <template v-for="name in component.right">
            <comp-item :ref="`${name}Ref`" :name="name" :key="name" />
          </template>
        </el-col>
      </el-row>
    </div>
    <template v-if="showEnquiry">
      <div class="enquiry-btn" @mousedown="arrowMove" @click="handleShowDrawer">
        <div>快速</div>
        <div>询价</div>
      </div>
      <EnquiryDialog
        ref="enquiryDialogRef"
        :isOnly="false"
        @handleSuccess="handleSuccess"
      />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { FullscreenLoading } from "@/utils/loading";
export default {
  name: "Index",
  components: {
    compItem: () => import("@/views/dashboard/index"),
    EnquiryDialog: () =>
      import("@/views/enquiryManage/components/EnquiryDialog"),
  },
  data() {
    return {
      fullscreenLoading: new FullscreenLoading(),
      loading: true,
      isMove: false,
      showEnquiry: false,
    };
  },
  computed: {
    ...mapGetters(["component", "routesCollect"]),
  },
  created() {
    this.fullscreenLoading.show();
    this.getComponentInfo();
    const { name = [] } = this.routesCollect;
    if (name.includes("MyEnquiry")) {
      this.showEnquiry = true;
    }
  },
  methods: {
    ...mapActions(["home/getCompInfo"]),
    getComponentInfo() {
      const { top = [], left = [], right = [] } = this.component;
      this["home/getCompInfo"]({
        component: [...top, ...left, ...right],
      })
        .then(() => {
          this.loading = false;
          this.fullscreenLoading.hide();
        })
        .catch(() => {
          this.loading = false;
          this.fullscreenLoading.hide();
        });
    },
    handleShowDrawer() {
      if (this.isMove) return;
      this.$refs.enquiryDialogRef.show();
    },
    arrowMove(e) {
      // 元素大小
      let elw = e.currentTarget.offsetWidth;
      let elH = e.currentTarget.offsetHeight; // 元素位置
      let elL = e.currentTarget.offsetLeft;
      let elT = e.currentTarget.offsetTop;
      // 鼠标位置
      let x = e.clientX;
      let y = e.clientY;
      // 窗口大小
      let w = window.innerWidth;
      let h = window.innerHeight;
      // 鼠标到元素左边距离
      let moveX = x - elL;
      let moveY = y - elT;
      let el = e.currentTarget;
      document.onmousemove = (e) => {
        this.isMove = true;
        el.style.right = w - (e.clientX - moveX) - elw + "px";
        el.style.bottom = h - (e.clientY - moveY) - elH + "px";
      };
      document.onmouseup = () => {
        setTimeout(() => {
          this.isMove = false;
        }, 300);
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    handleSuccess() {
      this.$refs.backlogRef && this.$refs.backlogRef[0]?.getCompInfo();
    },
  },
};
</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  min-height: calc(100vh - 60px);
  padding: 11px 24px 40px;
  background-color: #f6f5f6;
  position: relative;

  .card {
    /deep/ .chart-wrapper {
      background: #ffffff;
      border-radius: 6px;
      padding: 0 24px;
      margin-bottom: 20px;
    }
    /deep/ {
      .el-radio-group {
        .el-radio {
          margin-right: 15px;
        }
        .el-radio__label {
          padding-left: 3px;
        }
      }
      .no-data {
        text-align: center;
        color: #69707a;
        padding: 40px 0;
      }
      .form-class {
        flex: 1;
        .el-row {
          flex-flow: nowrap;
          justify-content: end;
          .el-col {
            width: auto;
            & > .customer-width {
              width: 178px;
            }
            & > .dealings-width {
              width: 120px;
            }
            & > .currency-width {
              width: 100px;
            }
            & > .date-width {
              width: 215px;
            }
          }
        }
      }
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  .enquiry-btn {
    position: fixed;
    right: 50px;
    bottom: calc(100vh - 150px);
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    width: 70px;
    height: 70px;
    line-height: 21px;
    font-weight: 500;
    color: #ffffff;
    background: linear-gradient(153deg, #b2daff 0%, #5094ff 100%);
    box-shadow: 4px 1px 12px 0px rgba(48, 106, 198, 0.27);
    border: 3px solid #ffffff;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>
