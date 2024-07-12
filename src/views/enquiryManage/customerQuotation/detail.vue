<template>
  <div class="app-container" v-if="formData.id">
    <!-- !handleBtn(formData).length && 'no-footer' -->
    <ComDetailTop
      :title="`客户报价详情(${formData.number})`"
      :formModel="formData"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    />
    <div class="flex" v-if="showSearchForm">
      <div class="detail-left">
        <TopForm :formData="formData" />
        <div class="top-right" v-if="showState()">
          <template v-for="item in btnList">
            <el-button
              size="small"
              :type="item.type || 'primary'"
              :icon="item.icon"
              @click="item.handleClick()"
              :key="item.text"
              :plain="item.plain"
              :round="item.round"
              :disabled="schemeDisabled"
            >
              {{ item.text }}
            </el-button>
          </template>
        </div>
        <!-- 国内报价 -->
        <QuotationSchemeTable
          ref="domesticQuotationRef"
          type="domesticQuotationSheetInfoVO"
          :quotationSheetInfo="{
            ...(formData.domesticQuotationSheetInfoVO || {}),
            viewState: formData.state,
          }"
          :isFcl="formData.packingMode === 0 ? true : false"
          :formData="{
            packingMode: formData.packingMode,
            shippingMode: formData.shippingMode,
          }"
          :queryPage="1"
          :isQuotation="true"
          @handleSelectRadio="handleSelectRadio"
          v-if="formData.domesticQuotationSheetInfoVO"
        />
        <!-- [1, 3].includes(formData.type) && -->
        <!-- 海外报价 -->
        <QuotationSchemeTable
          ref="foreignQuotationRef"
          type="foreignQuotationSheetInfoVO"
          :quotationSheetInfo="{
            ...(formData.foreignQuotationSheetInfoVO || {}),
            viewState: formData.state,
          }"
          :isOverseasToDoor="true"
          :queryPage="1"
          :isQuotation="true"
          :isFcl="formData.packingMode === 0 ? true : false"
          @handleSelectRadio="handleSelectRadio"
          v-if="formData.foreignQuotationSheetInfoVO"
        />
        <!-- [2, 3].includes(formData.type) &&-->
      </div>
      <div class="enquiry-trajectory">
        <EnquiryTrajectory
          :formData="formData"
          :queryPage="1"
          :isQuotation="true"
        />
      </div>
    </div>
    <div class="order-footer">
      <template v-for="(btn, index) in footerBtn">
        <el-button :type="btn.type" @click="btn.handleClick" :key="index">
          {{ btn.text }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  getQuotationSheetInfo,
  confirmationScheme,
} from "@/api/enquiryManage/customerQuotation";
import { customMessageBox, handleCopyText } from "@/utils/confirmBox.js";
export default {
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    TopForm: () => import("@/views/enquiryManage/components/TopForm"),
    QuotationSchemeTable: () =>
      import("@/views/enquiryManage/components/QuotationSchemeTable/quotation"),
    EnquiryTrajectory: () =>
      import("@/views/enquiryManage/components/EnquiryTrajectory"),
  },
  data() {
    return {
      formData: {},
      footerBtn: [
        {
          text: "关 闭",
          handleClick: this.reBack,
        },
      ],
      showSearchForm: false,
      btnList: [
        {
          text: "确认报价",
          round: true,
          showState: [6],
          handleClick: this.confirmQuotation,
        },
        {
          text: "分享报价",
          plain: true,
          round: true,
          showState: [6],
          handleClick: this.handleShare,
        },
      ],
      quotationSchemeIds: {},
      schemeDisabled: true,
    };
  },
  created() {
    this["dictionary/getDictionary"]("customerQuotation").then(() => {
      this.showSearchForm = true;
    });
    this.getDetails();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleBtn() {
      const { state } = this.formData;
      const currBtn = [];
      this.btnList.forEach((btn) => {
        if (btn.showState.includes(6)) {
          currBtn.push(btn);
        }
      });
      return currBtn;
    },
    getDetails(newId) {
      let id = newId;
      if (!id) {
        id = this.$route.query.id;
      }
      this.quotationSchemeIds = {}; // 重置
      this.schemeDisabled = true;
      this.formData = {};
      getQuotationSheetInfo({ id }).then((res) => {
        console.log(res);
        this.$nextTick(() => {
          const {
            overseasShippingMode,
            productType,
            tradeClause,
            formShippingMode,
            inquirySheetType,
            ...data
          } = res.data || {};
          this.formData = {
            ...data,
            id,
            overseasShippingMode:
              overseasShippingMode && overseasShippingMode.split(","),
            productType: this.typeConversion(productType),
            tradeClause: this.typeConversion(tradeClause),
            formShippingMode: this.typeConversion(formShippingMode),
            inquirySheetType: this.typeConversion(inquirySheetType),
            createBy: data.createUserName,
          };
        });
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
    handleSelectRadio(obj) {
      const { id, isOverseasToDoor } = obj;
      let { overseas, booking } = this.quotationSchemeIds;
      if (isOverseasToDoor) {
        overseas = id;
      } else {
        booking = id;
      }
      this.quotationSchemeIds = {
        overseas,
        booking,
      };
      const {
        domesticQuotationSheetInfoVO,
        overseasToDoor,
        foreignQuotationSheetInfoVO,
      } = this.formData;
      const haveOverseas = overseasToDoor && foreignQuotationSheetInfoVO;
      if (
        (!domesticQuotationSheetInfoVO || booking) &&
        (!haveOverseas || overseas)
      ) {
        this.schemeDisabled = false;
      } else {
        this.schemeDisabled = true;
      }
    },
    confirmQuotation() {
      customMessageBox(
        this,
        {
          msgTitle: "确认报价",
          msgTxt1: "",
          msgTxt2: "是否确认报价方案",
          httpMsgRequest: () => {
            // const { id } = this.formData;
            const { overseas, booking } = this.quotationSchemeIds;
            return confirmationScheme({
              domesticQuotationSchemeId: booking,
              foreignQuotationSchemeId: overseas,
              // quotationSheetId: id,
            });
          },
        },
        () => {
          this.msgSuccess("确定报价成功");
          this.getDetails();
        }
      );
    },
    handleShare() {
      const { overseas, booking } = this.quotationSchemeIds;
      const ids = [];
      overseas && ids.push(overseas);
      booking && ids.push(booking);
      handleCopyText(
        `您好，感谢贵司的咨询，根据您的需求，我们为您精心制定了一份详细的报价单，请随时与我们联系，谢谢 点击链接查阅： ${
          window.location.origin
        }/shareQuotation?id=${ids.join(",")}&type=2`,
        this,
        "已复制分享链接"
      );
    },
    showState() {
      return (
        this.formData.domesticQuotationSheetInfoVO?.state === 6 ||
        this.formData.foreignQuotationSheetInfoVO?.state === 6
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.el-image-viewer__close {
}
.app-container {
  min-height: calc(100vh - 170px);
  padding: 15px 20px;
  margin-bottom: 90px;

  &.no-footer {
    min-height: calc(100vh - 80px);
    margin-bottom: 10px;
  }
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
    .detail-left {
      min-width: 900px;
      flex: 0 1 100%;
      padding-right: 40px;
      /deep/ .internal-quote:nth-child(2) {
        border-top: 1px solid #e2e2e2;
      }
      // /deep/ .internal-quote:nth-child(3) {
      //   margin-top: 20px;
      // }
      .top-right {
        padding-bottom: 5px;
        border-bottom: 1px solid #e2e2e2;
        text-align: right;
      }
    }
  }
}
</style>
