<template>
  <!-- 海外提派订单详情页面 -->
  <div class="app-container" v-if="formData.id">
    <ComDetailTop
      :title="overseaLangObj.hw_ps_xq('海外提派详情')"
      :formModel="formData"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{ formData.jobNo ? `(${formData.jobNo})` : "" }}
        </span>
      </template>
    </ComDetailTop>
    <div class="flex">
      <div class="detail-left" v-if="showSearchForm">
        <TopForm :formData="formData" :pageType="pageType" />
        <TabTable
          :formData="formData"
          :pageType="pageType"
          :active="tabActive"
          @handleChange="() => this.getDetails()"
          @handleActive="handleActive"
          @changeCostRequest="changeCostRequest"
        />
      </div>
      <div>
        <Trajectory
          :formData="formData"
          :pageType="pageType"
          @handleChange="() => this.getDetails()"
        />
      </div>
    </div>
    <div class="order-footer" v-if="handleBtn().length">
      <template v-for="(btn, index) in handleBtn()">
        <el-button
          :type="btn.type"
          @click="() => btn.handleClick(formData, btn)"
          :key="index"
        >
          {{ btn.text }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import {
  getDeliveryClearanceInfo,
  removeClearance,
  getHeaderTotalBill,
} from "@/api/operateRecord/customsClearance";
import { mapActions } from "vuex";
import { handleDetailData } from "@/views/overseasBusiness/components/utils.js";
import { msgBox } from "@/utils/confirmBox.js";
export default {
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    TopForm: () => import("@/views/overseasBusiness/components/TopForm"),
    TabTable: () => import("@/views/overseasBusiness/components/TabTable"),
    Trajectory: () => import("@/views/overseasBusiness/components/Trajectory"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    PlaceOrderDialog: () =>
      import("@/views/overseasBusiness/components/PlaceOrderDialog"),
  },
  data() {
    return {
      tabActive: 1,
      formData: {},
      showSearchForm: false,
      pageType: 1,
      footerBtn: [
        // {
        //   statusShow: [2],
        //   text: "删除",
        //   type: "delete",
        //   handleClick: this.handleDelete,
        // },
        {
          text: "关 闭",
          handleClick: this.reBack,
        },
      ],
    };
  },
  created() {
    const tabActive = sessionStorage.getItem("tabActive");
    this.tabActive = Number(tabActive || 1);
    this.pageType = Number(this.$route.query.pageType);
    this["dictionary/getDictionary"]("customsClearance").then(() => {
      this.showSearchForm = true;
    });
    this.getDetails();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDetails(newId) {
      this.formData = {};
      let id = newId;
      if (!id) {
        id = this.$route.query.id;
      }
      getDeliveryClearanceInfo(id).then((res) => {
        this.formData = handleDetailData(res.data);
        this.changeCostRequest();
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails(id);
        sessionStorage.removeItem("tabActive");
        this.tabActive = 1;
      }
    },
    handleEdit() {
      const params = {
        operationOrderId: this.detailFormConfig.formModel.joinOrderId,
        type_num: 0, //0是打开编辑弹窗
      };
      this.$refs.dialogFormRef?.show(params);
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleBtn() {
      const { deliveryClearanceOrderDeatail } = this.formData;
      const status = deliveryClearanceOrderDeatail?.devlieryStatus;
      const btnList = this.footerBtn.filter(
        (btn) => btn.statusShow && btn.statusShow.includes(status)
      );
      if (btnList.length) {
        btnList.push({
          text: "关 闭",
          handleClick: this.reBack,
        });
      }
      return btnList;
    },
    // handleDelete(row) {
    //   const { id } = row;
    //   const msg = "删除操作不可逆！";
    //   const title = "删除提示";
    //   const className = "el-icon-warning text-warning";
    //   msgBox(this, { title, className, msg }, () => {
    //     this.comRepeatedRequest(this, removeClearance, {
    //       id,
    //       removeSource: this.pageType,
    //     }).then(() => {
    //       this.msgSuccess("删除成功");
    //       this.reBack();
    //     });
    //   });
    // },
    handleActive(key) {
      this.tabActive = key;
      sessionStorage.setItem("tabActive", key);
    },
    changeCostRequest() {
      const { id, businessUnit: billingMain, settlementBusinessType } = this.formData;
      const opt = {
        orderId: id,
        billingMain,
        businessType: settlementBusinessType,
      };
      getHeaderTotalBill(opt).then((res) => {
        this.formData = {
          ...this.formData,
          ...res.data,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-image-viewer__close {
}
.app-container {
  min-height: calc(100vh - 80px);
  padding: 15px 20px;
  margin-bottom: 10px;
  /deep/ {
    .com-detail-top {
      padding-top: 0;
      margin: 0 0 15px;
    }
    .el-image-viewer__close {
      color: #fff;
    }
  }
  .flex {
    display: flex;
    height: 100%;
    .detail-left {
      min-width: 900px;
      flex: 0 1 100%;
      padding: 0 20px 114px 0;
    }
  }
}
</style>
