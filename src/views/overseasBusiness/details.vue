<template>
  <!-- 此页面已经根据需求拆分成三个独立页面，不再在此页面新增代码,
  2023年7月15日如果项目没有报错，会删除掉此文件
  海外清关详情：src\views\overseasBusiness\components\details\customsClearanceOrder.vue
  海外提派详情：src\views\overseasBusiness\components\details\deliverryOrder.vue
  海外入仓详情：src\views\warehouseManage\predictionManage\inStorage\overSeaWarehouse\details.vue -->
  <div class="app-container" v-if="formData.id">
    <!-- <ComDetailTop
      :title="`${config[pageType].title}(${formData.nlCode})`"
      :formModel="formData"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    />
    <div class="flex">
      <div class="detail-left" v-if="showSearchForm">
        <TopForm :formData="formData" :pageType="pageType" />
        <TabTable
          :formData="formData"
          :pageType="pageType"
          :active="tabActive"
          @handleChange="() => this.getDetails()"
          @handleActive="handleActive"
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
    <ComCustomDialog ref="customDlgRef" />
    <PlaceOrderDialog
      ref="placeOrderRef"
      :tabType="pageType"
      :title="config[pageType].title"
      @handleSuccess="() => this.getDetails()"
    /> -->
  </div>
</template>

<script>
import {
  getDirecrClearanceInfo,
  getDeliveryClearanceInfo,
  getWarehouseClearanceInfo,
  clearanceRelease,
  warehousingRegistration,
} from "@/api/operateRecord/customsClearance";
import { mapActions } from "vuex";
import { releaseFormConfig, warehousingFormConfig } from "./components/model";
import { handleDetailData } from "@/views/overseasBusiness/components/utils.js";
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
      config: {
        1: { title: "海外清关", req: getDirecrClearanceInfo },
        2: { title: "海外提派", req: getDeliveryClearanceInfo },
        3: { title: "海外入仓", req: getWarehouseClearanceInfo },
      },
      footerBtn: [
        {
          statusArr: [0],
          text: "清关登记",
          type: "registration",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [1],
          text: "清关放行",
          type: "release",
          handleClick: this.handleBtnClick,
        },
        {
          warehouseStatusArr: [4],
          text: "收货",
          type: "takeGoods",
          handleClick: (row) =>
            this.handleView(row, {
              isSee: 0,
              path: "/warehouseManage/inStorage/overSeaReceiptPage",
            }),
        },
        {
          warehouseStatusArr: [0, 1, 2, 3, 4, 5, 6, 7],
          text: "收货详情",
          type: "takeGoodsDetail",
          handleClick: (row) =>
            this.handleView(row, {
              isSee: 1,
              path: "/warehouseManage/inStorage/overSeaReceiptPage",
            }),
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
      console.log(this.$route.query);
      const req = this.config[this.pageType].req;
      req(id).then((res) => {
        this.formData = handleDetailData(res.data);
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
      const {
        directClearanceOrderDetail,
        deliveryClearanceOrderDeatail,
        warehouseOrderDetailVo,
      } = this.formData;
      const obj = {
        1: {
          status: directClearanceOrderDetail?.status,
          statusName: "statusArr",
        },
        2: {
          status: deliveryClearanceOrderDeatail?.devlieryStatus,
          statusName: "devlieryStatusArr",
        },
        3: {
          status: warehouseOrderDetailVo?.warehouseStatus,
          statusName: "warehouseStatusArr",
        },
      };
      const { status, statusName } = obj[this.pageType];
      const btnList = this.footerBtn.filter(
        (btn) =>
          btn[statusName] &&
          btn[statusName].includes(status) &&
          (btn.freightType || btn.freightType === 0
            ? btn.freightType == warehouseOrderDetailVo?.freightType
            : true)
      );
      if (btnList.length) {
        btnList.push({
          text: "关 闭",
          handleClick: this.reBack,
        });
      }
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
    handleBtnClick(row, iBtn) {
      const { type: type_num, freightType } = iBtn;
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
        case "devanning": // 预计提拆柜
        case "warehousing": // 入仓登记
          const {
            nlCode,
            bailorPeopleName,
            operationMainName,
            businessUnitName,
            salesman,
          } = row;
          this.$refs.customDlgRef?.showCustomDialog({
            formModel: {
              nlCode,
              bailorPeopleName,
              operationMainName,
              businessUnitName,
            },
            httpRequest: (params) =>
              warehousingRegistration({
                ...params,
                id,
              }),
            successFunction: () => this.getDetails(),
            customFormConfig: warehousingFormConfig({
              mType: freightType,
              salesman,
            }),
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
