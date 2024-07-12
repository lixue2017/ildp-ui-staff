<template>
  <div class="app-container" v-if="formData.id">
    <ComDetailTop
      :title="`${formData.shippingMode == 1 ? '海运' : '空运'}运价详情`"
      :formModel="formData"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    />
    <div class="port">
      <div
        :class="`port-icon iconfont ${
          formData.shippingMode == 1 ? 'haiyun' : 'kongyun'
        }`"
      ></div>
      <div class="start-port">{{ formData.startPortCode }}</div>
      <div class="iconfont jiantou2"></div>
      <div class="end-port">{{ formData.endPortCode }}</div>
    </div>
    <Carousel
      :formData="formData"
      :list="formData.freightRateSettingList || []"
    />
    <TopForm :formData="formData" />
    <SurchargeTable
      :formData="formData"
      :isDetail="true"
      :isDetailView="true"
      :packingMode="Number(formData.packingMode)"
    />

    <div class="order-footer">
      <template v-for="(btn, index) in footerBtn">
        <el-button
          :type="btn.type"
          @click="() => btn.handleClick(btn)"
          :key="index"
          v-if="
            (!btn.isHavePurview || btn.isHavePurview === isHavePurview) &&
            (!btn.statusArr || btn.statusArr.includes(formData.state))
          "
        >
          {{ btn.text }}
        </el-button>
      </template>
    </div>
    <BookingSpace ref="bookingSpaceRef" @handleSuccess="getDetails" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { getFreightRateInfo } from "@/api/marketManage/freightRate";
import { msgBox } from "@/utils/confirmBox.js";
import { enableDisableFreightRate } from "@/api/marketManage/freightRate";
export default {
  data() {
    return {
      tabsConfig: {},
      formData: {},
      footerBtn: [
        {
          statusArr: [0],
          text: "提 交",
          type: "submit",
          handleClick: this.handleBtnClick,
          isHavePurview: true,
        },
        {
          statusArr: [0],
          text: "修 改",
          type: "edit",
          handleClick: this.handleBtnClick,
          isHavePurview: true,
        },
        {
          statusArr: [1],
          text: "禁 用",
          type: "interdict",
          handleClick: this.handleBtnClick,
          isHavePurview: true,
        },
        {
          statusArr: [1],
          text: "订 舱",
          type: "bookingSpace",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [2],
          text: "启 用",
          type: "enable",
          handleClick: this.handleBtnClick,
          isHavePurview: true,
        },
        {
          text: "关 闭",
          handleClick: this.reBack,
        },
      ],
      isHavePurview: false,
    };
  },
  components: {
    TopForm: () => import("./components/TopForm"),
    Carousel: () => import("./components/Carousel"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    SurchargeTable: () => import("./components/SurchargeTable"),
    BookingSpace: () => import("./components/BookingSpace"),
  },
  computed: {
    ...mapGetters(["routesCollect"]),
  },
  created() {
    this.searchDictionary();
    if ((this.routesCollect.name || []).includes("EditFreightRate")) {
      this.isHavePurview = true;
      // this.tabsConfig.btnArr = this.tabsBtnArr;
    }
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchDictionary() {
      this["dictionary/getDictionary"]("freightRate").then(() => {
        this.showForm = true;
        this.getDetails();
      });
    },
    getDetails(newId) {
      this.formData = {};
      let id = newId;
      if (!id) {
        id = this.$route.query.id;
      }
      getFreightRateInfo(id).then((res) => {
        const { createUserName, ...data } = res.data;
        this.formData = {
          ...data,
          createBy: createUserName,
        };
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails(id);
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleInterdict() {
      const { id } = this.formData;
      if (id) {
        const msg = "操作禁用之后该数据不可被关联引用！";
        const title = "禁用提示";
        const className = "el-icon-warning text-warning";
        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, enableDisableFreightRate, { id }).then(
            () => {
              this.msgSuccess("禁用成功！");
              this.getDetails();
            }
          );
        });
      }
    },
    handleBtnClick(btn) {
      const { type } = btn;
      const { id, shippingMode } = this.formData;
      switch (type) {
        case "submit":
          this.comRepeatedRequest(this, enableDisableFreightRate, { id }).then(
            () => {
              this.msgSuccess("提交成功！");
              this.getDetails();
            }
          );
          break;
        case "edit":
          this.$router.push({
            path: "/marketManage/editFreightRate",
            query: {
              id,
              shippingMode,
            },
          });
          break;
        case "interdict":
          this.handleInterdict();
          break;
        case "bookingSpace":
          this.$refs.bookingSpaceRef.show(this.formData);
          break;
        case "enable":
          this.comRepeatedRequest(this, enableDisableFreightRate, { id }).then(
            () => {
              this.msgSuccess("启用成功！");
              this.getDetails();
            }
          );
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  margin-bottom: 100px;
  /deep/ {
    .com-detail-top {
      margin: 0 0 15px;
      padding: 0;
    }
  }
  .port {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 76px 12px 0;
    background: linear-gradient(360deg, #def3ff 0%, #b3d4ff 100%);
    box-shadow: 2px 2px 4px 0px rgba(45, 115, 195, 0.1);

    .port-icon {
      font-size: 42px;
      margin-right: 34px;
      color: #5094ff;
    }
    .start-port,
    .end-port {
      font-size: 20px;
      font-weight: bold;
      display: -webkit-box;
      max-width: 300px;
      word-break: break-all;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .jiantou2 {
      margin: 0 40px;
    }
  }
}
</style>
