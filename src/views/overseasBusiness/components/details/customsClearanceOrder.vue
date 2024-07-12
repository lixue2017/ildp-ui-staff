<template>
  <!-- 海外清关订单详情页面 -->
  <div class="app-container" v-if="formData.id">
    <ComDetailTop
      title="海外清关详情"
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
          :formData="{
            ...formData,
            pageTabSource: 't_11',
          }"
          :pageType="pageType"
          :active="tabActive"
          @handleChange="() => this.getDetails()"
          @handleActive="handleActive"
          @changeCostRequest="changeCostRequest"
        >
          <template v-slot:slotFileTab>
            <FileUploadTable
              :uploadTableConfig="{
                isGetUploadFileTypes: true,
                ...handleFileRequestCollection(),
              }"
              :uploadFileTableConfig="{
                noLengthHide: false,
              }"
            />
          </template>
        </TabTable>
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
    <!-- 自定义弹窗 -->
    <ComCustomDialog ref="customDlgRef" />
    <PlaceOrderDialog
      ref="placeOrderRef"
      :tabType="pageType"
      title="海外清关"
      @handleSuccess="() => this.getDetails()"
    />
  </div>
</template>

<script>
import {
  getDirecrClearanceInfo,
  clearanceRelease,
  getHeaderTotalBill,
  uploadAttach,
} from "@/api/operateRecord/customsClearance";
import { delClearanceAccessory } from "@/api/performance/record";
import { mapActions } from "vuex";
import { releaseFormConfig } from "../model";
import { handleDetailData } from "@/views/overseasBusiness/components/utils.js";
export default {
  // name: "OverseasClearanceDetail",
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    TopForm: () => import("@/views/overseasBusiness/components/TopForm"),
    TabTable: () => import("@/views/overseasBusiness/components/TabTable"),
    Trajectory: () => import("@/views/overseasBusiness/components/Trajectory"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    PlaceOrderDialog: () =>
      import("@/views/overseasBusiness/components/PlaceOrderDialog"),
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
  },
  provide() {
    return {
      PROVIDECURRFILTER:true,
    };
  },
  data() {
    return {
      tabActive: 11,
      formData: {},
      showSearchForm: false,
      pageType: 1,
      footerBtn: [
        // {
        //   statusShow: [0],
        //   text: "清关登记",
        //   type: "registration",
        //   handleClick: this.handleBtnClick,
        // },
        {
          statusShow: [1],
          text: "清关放行",
          type: "release",
          handleClick: this.handleBtnClick,
        },
        {
          text: "关 闭",
          handleClick: this.reBack,
        },
      ],
    };
  },
  created() {
    const tabActive = sessionStorage.getItem("tabActive");
    this.tabActive = Number(tabActive || 11);
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
      getDirecrClearanceInfo(id).then((res) => {
        this.formData = handleDetailData(res.data);
        this.changeCostRequest();
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails(id);
        sessionStorage.removeItem("tabActive");
        this.tabActive = 11;
      }
    },
    handleFileRequestCollection() {
      const { id, attachId } = this.formData.directClearanceOrderDetail;
      return {
        onGetFileType: "HWQGGL",
        attachId,
        httpSaveFileRequest: ({ attachAllList }) => {
          return uploadAttach({
            attachIds: attachAllList,
            id,
            updateSource: 1,
          }).then(() => {
            this.formData.directClearanceOrderDetail.attachId =
              attachAllList.join(",");
          });
        },
        isDelGetAttachList: true,
        httpDelFileRequest: ({ deleteAttachIdList, attachAllList }) => {
          return delClearanceAccessory(deleteAttachIdList.join(",")).then(
            () => {
              this.formData.directClearanceOrderDetail.attachId =
                attachAllList.join(",");
            }
          );
        },
      };
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
      const { directClearanceOrderDetail } = this.formData;
      const status = directClearanceOrderDetail?.status;
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
    handleBtnClick(row, iBtn) {
      const { type: type_num } = iBtn;
      const { id } = row;
      switch (type_num) {
        case "registration": // 清关登记
          this.$refs.placeOrderRef?.show({
            ...row,
            types: row.overseaBusinessTypes,
          });
          break;
        case "release": // 清关放行
          this.$refs.customDlgRef?.showCustomDialog({
            httpRequest: (formData) => {
              return clearanceRelease({
                ...formData,
                id,
              });
            },
            successFunction: () => this.getDetails(),
            customFormConfig: releaseFormConfig,
          });
          break;
        default:
          break;
      }
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
