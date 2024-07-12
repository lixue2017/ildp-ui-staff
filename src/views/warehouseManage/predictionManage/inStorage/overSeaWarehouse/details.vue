<template>
  <!-- 海外入仓预报详情页面 -->
  <div class="app-container" v-if="formData.id">
    <ComDetailTop
      :title="overseaLangObj.hw_rc_xq || '海外入仓详情'"
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
          :sessionStorageActive="tabActive"
          :needCheckAccount="true"
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
  getWarehouseClearanceInfo,
  getHeaderTotalBill,
} from "@/api/operateRecord/customsClearance";
import { mapActions } from "vuex";
import { handleDetailData } from "@/views/overseasBusiness/components/utils.js";
export default {
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    TopForm: () => import("@/views/overseasBusiness/components/TopForm"),
    TabTable: () => import("@/views/overseasBusiness/components/TabTable"),
    Trajectory: () => import("@/views/overseasBusiness/components/Trajectory"),
  },
  data() {
    return {
      tabActive: 1,
      formData: {},
      showSearchForm: false,
      pageType: 1,
      footerBtn: [
        {
          statusShow: [4],
          text: this.overseaLangObj.sh_receipt(),
          type: "takeGoods",
          handleClick: (row) =>
            this.handleView(row, {
              isSee: 0,
              path: "/warehouseManage/inStorage/overSeaReceiptPage",
            }),
        },
        // {
        //   statusShow: [0, 1, 2, 3, 4, 5, 6, 7],
        //   text: "收货详情",
        //   type: "takeGoodsDetail",
        //   handleClick: (row) =>
        //     this.handleView(row, {
        //       isSee: 1,
        //       path: "/warehouseManage/inStorage/overSeaReceiptPage",
        //     }),
        // },
        {
          text: this.overseaLangObj.gb_close,
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
      getWarehouseClearanceInfo(id).then((res) => {
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
      const { warehouseOrderDetailVo } = this.formData;
      const status = warehouseOrderDetailVo?.warehouseStatus;
      const btnList = this.footerBtn.filter((e) => {
        const { statusShow } = e;
        if (statusShow) {
          return statusShow.includes(status);
        }
        return true;
      });
      return btnList;
    },
    handleView(row, exParams) {
      const { id } = row;
      const { path, isSee } = exParams;
      this.$router.push({
        path,
        query: {
          id: id,
          backPath: this.$route.fullPath,
          isSee,
        },
      });
    },
    handleActive(key) {
      this.tabActive = key;
      sessionStorage.setItem("tabActive", key);
    },
    changeCostRequest() {
      const {
        id,
        businessUnit: billingMain,
        settlementBusinessType,
      } = this.formData;
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
