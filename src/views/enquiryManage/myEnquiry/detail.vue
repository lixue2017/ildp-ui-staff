<template>
  <div
    :class="['app-container', !handleBtn(formData).length && 'no-footer']"
    v-if="formData.id"
  >
    <ComDetailTop
      :title="`${pageParam[queryPage].title}(${formData.number})`"
      :formModel="formData"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <!-- <template v-slot:middleInfo v-if="[2, 3].includes(queryPage)">
        <el-button
          class="copy-btn"
          size="mini"
          type="primary"
          icon="el-icon-document-copy"
          @click="handleCopy"
          round
          plain
          >复制询价单信息</el-button
        >
      </template> -->
    </ComDetailTop>
    <div class="flex">
      <div class="detail-left" v-if="showSearchForm">
        <TopForm :formData="formData" />
        <div class="set-quotation-btn" v-if="showQuotationBtn()">
          <el-button
            size="small"
            type="primary"
            @click="handleSetQuotation"
            :disabled="setDisabled"
          >
            设置客户报价
          </el-button>
        </div>
        <!-- 国内报价 -->
        <QuotationSchemeTable
          ref="domesticQuotationRef"
          type="domesticQuotationSheetInfoVO"
          :formData="{
            ...formData,
            cabinetList: formData.cabinetList || [],
          }"
          :proxyIds="proxyIds"
          :quotationSheetInfo="formData.domesticQuotationSheetInfoVO || {}"
          :isFcl="formData.packingMode === 0 ? true : false"
          :queryPage="queryPage"
          @handleVoid="
            (state) =>
              handleVoid(formData.domesticQuotationSheetInfoVO.id, state)
          "
          @confirmQuotationSheet="confirmQuotationSheet"
          @handleRenew="
            (fn, addList) =>
              handleRenew(fn, addList, 'domesticQuotationSheetInfoVO')
          "
          @handleRecall="handleRecall"
          @handleSelect="handleSelect"
          v-if="[1, 2].includes(queryPage) && [1, 3].includes(formData.type)"
        />
        <!-- 海外报价 -->
        <QuotationSchemeTable
          ref="foreignQuotationRef"
          type="foreignQuotationSheetInfoVO"
          :formData="formData"
          :quotationSheetInfo="formData.foreignQuotationSheetInfoVO || {}"
          :isOverseasToDoor="true"
          :queryPage="queryPage"
          :proxyIds="proxyIds"
          :isFcl="formData.packingMode === 0 ? true : false"
          @handleVoid="
            (state) =>
              handleVoid(formData.foreignQuotationSheetInfoVO.id, state)
          "
          @handleRenew="
            (fn, addList) =>
              handleRenew(fn, addList, 'foreignQuotationSheetInfoVO')
          "
          @confirmQuotationSheet="confirmQuotationSheet"
          @handleRecall="handleRecall"
          @handleSelect="(ids) => handleSelect(ids, true)"
          @handleReDetail="getDetails"
          v-if="[1, 3].includes(queryPage) && [2, 3].includes(formData.type)"
        />
      </div>
      <div class="enquiry-trajectory">
        <EnquiryTrajectory
          :formData="formData"
          :queryPage="queryPage"
          @updQuotationUser="updQuotationUser"
          @updPortInfo="updPortInfo"
          @handleCopy="handleCopy"
        />
      </div>
    </div>
    <div class="order-footer" v-if="handleBtn(formData).length">
      <template v-for="(btn, index) in handleBtn(formData)">
        <el-button :type="btn.type" @click="btn.handleClick" :key="index">
          {{ btn.text }}
        </el-button>
      </template>
    </div>
    <ConfirmDialog ref="confirmDlgRef" />
    <SetSingleDialog ref="setQuotationRef" @handleSuccess="getDetails" />
    <SetProfitDialog ref="setProfitRef" @handleSuccess="getDetails" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { msgBox, handleCopyTextarea } from "@/utils/confirmBox.js";
import {
  getEnquiryInfo,
  updateQuotationState,
  rollbackQuotationSheet,
  confirmQuotationSheet,
  updQuotationUser,
  updatePort,
} from "@/api/enquiryManage";
import { fromConfig, portFromConfig } from "./model";
import { POSTOrderIsolateConfig } from "@/api/marketManage/airline";
export default {
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    TopForm: () => import("@/views/enquiryManage/components/TopForm"),
    QuotationSchemeTable: () =>
      import("@/views/enquiryManage/components/QuotationSchemeTable"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    EnquiryTrajectory: () =>
      import("@/views/enquiryManage/components/EnquiryTrajectory"),
    SetSingleDialog: () =>
      import(
        "@/views/enquiryManage/customerQuotation/components/SetSingleDialog"
      ),
    SetProfitDialog: () =>
      import("@/views/enquiryManage/components/SetProfitDialog"),
  },
  data() {
    return {
      formData: {},
      footerBtn: [
        {
          text: "提 交",
          handleClick: this.handleSubmit,
          showPage: [2, 3],
          showState: [2, 4],
        },
        {
          text: "设置利润",
          handleClick: this.setProfit,
          showPage: [3],
          showState: [2, 4],
        },
        {
          text: "关 闭",
          handleClick: this.reBack,
          showPage: [2, 3],
          showState: [2, 4],
        },
      ],
      showSearchForm: false,
      queryPage: 1,
      pageParam: {
        1: {
          title: "询价方案详情",
          stateName: "state",
        },
        2: {
          title: "订舱报价详情",
          stateName: "domesticQuotationSheetState",
        },
        3: {
          title: "海外到门报价详情",
          stateName: "foreignQuotationSheetState",
        },
      },
      setDisabled: true,
      quotationSchemeIds: {
        overseas: [],
        booking: [],
      },
      outWarehouseWayObj: {},
      proxyIds: "",
    };
  },
  created() {
    this["dictionary/getDictionary"]("enquiryList").then(() => {
      const outWarehouseWay = this.dictData.outWarehouseWay;
      if (outWarehouseWay) {
        const outWarehouseWayObj = {};
        outWarehouseWay.forEach((item) => {
          outWarehouseWayObj[item.value] = item.nameCn;
        });
        this.outWarehouseWayObj = outWarehouseWayObj;
      }
      this.showSearchForm = true;
    });
    const { queryPage = 1 } = this.$route.query;
    this.queryPage = Number(queryPage);
    this.getDetails();
    this.getOrderIsolateConfig();
  },
  computed: {
    ...mapGetters(["dictData"]),
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleBtn(formData) {
      const { queryPage, footerBtn } = this;
      const {
        state,
        domesticQuotationSheetInfoVO,
        foreignQuotationSheetInfoVO,
      } = formData;
      const currState = {
        1: state,
        2: domesticQuotationSheetInfoVO?.state,
        3: foreignQuotationSheetInfoVO?.state,
      };
      const currBtn = [];
      footerBtn.forEach((btn) => {
        // console.log(btn.showState, currState[queryPage]);
        if (
          btn.showPage.includes(queryPage) &&
          (!btn.showState ||
            (btn.showState && btn.showState.includes(currState[queryPage])))
        ) {
          currBtn.push(btn);
        }
      });
      return currBtn;
    },
    getDetails(newId, addObj = {}) {
      let id = newId;
      if (!id) {
        id = this.$route.query.id;
      }
      this.formData = {};
      this.setDisabled = true;
      this.quotationSchemeIds = {
        overseas: [],
        booking: [],
      };
      getEnquiryInfo({ id, queryPage: this.queryPage }).then((res) => {
        console.log(res);
        this.$nextTick(() => {
          const { overseasShippingMode, productType, ...data } = res.data;
          const {
            startPortId,
            startPortName,
            endPortId,
            endPortName,
            type,
            overseasToDoor,
          } = data;
          if (!type) {
            data.type = overseasToDoor ? 3 : 1;
          }
          data.inquirySheetType = this.typeConversion(data.type);
          if ([2, 3].includes(this.queryPage)) {
            const obj = {
              2: data.domesticQuotationSheetInfoVO || {},
              3: data.foreignQuotationSheetInfoVO || {},
            };
            const { prop, addList } = addObj;
            if (
              prop &&
              addList &&
              data[prop].quotationSchemeInfoVOList &&
              data[prop].quotationSchemeInfoVOList.length
            ) {
              data[prop].quotationSchemeInfoVOList = [
                ...addList,
                ...data[prop].quotationSchemeInfoVOList,
              ];
            }
            const {
              startPortId: cStartPortId,
              startPortName: cStartPortName,
              endPortId: cEndPortId,
              endPortName: cEndPortName,
            } = obj[this.queryPage];
            data.startPortId = cStartPortId || startPortId;
            data.startPortName = cStartPortName || startPortName;
            data.endPortId = cEndPortId || endPortId;
            data.endPortName = cEndPortName || endPortName;
          }
          this.formData = {
            ...data,
            overseasShippingMode:
              overseasShippingMode && overseasShippingMode.split(","),
            productType: `${
              productType || productType === 0 ? productType : ""
            }`,
            formShippingMode: this.typeConversion(data.shippingMode),
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
    handleVoid(id, state) {
      const obj = {
        1: {
          title: "市场打回",
          remarkTitle: "打回",
        },
        4: {
          title: "业务退回",
          remarkTitle: "退回",
        },
      };
      this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
        confObj: {
          title: obj[state]?.title || "说明",
          label: `${obj[state]?.remarkTitle || ""}说明：`,
          message: `请输入${obj[state]?.remarkTitle || ""}说明`,
          maxlength: 50,
        },
        formModel: {},
        httpRequest: ({ remark }) => {
          return rollbackQuotationSheet({
            quotationSheetId: id,
            state,
            rollbackRemark: remark,
          });
        },
        successFunction: this.getDetails,
      });
    },
    handleRenew(fn, addList, prop) {
      const { id } = this.formData;
      if (
        !this.formData[prop].quotationSchemeInfoVOList ||
        !this.formData[prop].quotationSchemeInfoVOList.length
      ) {
        this.getDetails("", { prop, addList });
      } else {
        getEnquiryInfo({ id, queryPage: this.queryPage }).then((res) => {
          console.log(res);
          fn(res.data[prop].quotationSchemeInfoVOList);
        });
      }
    },
    handleSubmit() {
      const { domesticQuotationSheetInfoVO, foreignQuotationSheetInfoVO } =
        this.formData;
      const param = {
        state: 3,
      };
      if (this.queryPage === 2) {
        const error = this.$refs.domesticQuotationRef?.getSaveArr();
        if (error) {
          return;
        }
        const { remark, id: quotationSheetId } = domesticQuotationSheetInfoVO;
        param.remark = remark;
        param.quotationSheetId = quotationSheetId;
      } else {
        const error = this.$refs.foreignQuotationRef?.getSaveArr();
        if (error) {
          return;
        }
        const { remark, id: quotationSheetId } = foreignQuotationSheetInfoVO;
        param.remark = remark;
        param.quotationSheetId = quotationSheetId;
      }
      updateQuotationState(param).then(() => {
        this.$message.success("提交成功");
        this.getDetails();
      });
    },
    setProfit() {
      this.$refs.setProfitRef.show({
        inquirySheetId: this.formData.id,
      });
    },
    handleRecall(id) {
      const msg = "撤回后询价人无法查看报价方案！";
      const title = "确定撤回报价";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        updateQuotationState({
          quotationSheetId: id,
          state: 2,
        }).then(() => {
          this.$message.success("撤回成功");
          this.getDetails();
        });
      });
    },
    confirmQuotationSheet(id) {
      const msg = "是否确认报价方案";
      const title = "确认";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        confirmQuotationSheet(id).then(() => {
          this.$message.success("已确认报价方案");
          this.getDetails();
        });
      });
    },
    updQuotationUser() {
      const {
        id,
        type,
        domesticQuotedPriceUserId,
        domesticQuotedPriceUserName,
        foreignQuotedPriceUserId,
        foreignQuotedPriceUserName,
      } = this.formData;
      const formModel = {
        ...([1, 3].includes(type)
          ? {
              domesticQuotedPriceUserId,
              domesticQuotedPriceUserName,
            }
          : {}),
        ...([2, 3].includes(type)
          ? {
              foreignQuotedPriceUserId,
              foreignQuotedPriceUserName,
            }
          : {}),
      };
      this.$refs.confirmDlgRef.handleFormDialog("customConfirmModel", {
        formModel,
        customFormConfig: fromConfig(type),
        httpRequest: (param) =>
          updQuotationUser({
            id,
            ...param,
          }),
        successFunction: this.getDetails,
      });
    },
    updPortInfo() {
      const {
        domesticQuotationSheetInfoVO,
        startPortId,
        startPortName,
        endPortId,
        endPortName,
      } = this.formData;
      const formModel = {
        startPortId,
        startPortName,
        endPortId,
        endPortName,
      };
      this.$refs.confirmDlgRef.handleFormDialog("customConfirmModel", {
        formModel,
        customFormConfig: portFromConfig,
        httpRequest: (param) =>
          this.defineUpdate({
            quotationSheetId: domesticQuotationSheetInfoVO.id,
            ...param,
          }),
      });
    },
    defineUpdate(data) {
      let { startPortId, endPortId, isCabinRelease, ...param } = data;
      let startPortName = "";
      let endPortName = "";
      if (startPortId && startPortId.label) {
        const { id, label } = startPortId;
        startPortId = id;
        startPortName = label;
      }
      if (endPortId && endPortId.label) {
        const { id, label } = endPortId;
        endPortId = id;
        endPortName = label;
      }
      param.startPortId = startPortId;
      param.endPortId = endPortId;
      return new Promise((resolve, reject) => {
        const title = "确定";
        const html =
          "<div class='display-flex'>修改港口信息后，已保存的报价信息，需要重新编辑保存</div><div class='subtitle'>是否确认修改</div>";
        msgBox(
          this,
          { title, html },
          () => {
            updatePort(param)
              .then(() => {
                resolve();
                if (startPortName) {
                  this.formData.startPortId = startPortId;
                  this.formData.startPortName = startPortName;
                }
                if (endPortName) {
                  this.formData.endPortId = endPortId;
                  this.formData.endPortName = endPortName;
                }
                this.$nextTick(() => {
                  this.$refs.domesticQuotationRef?.handleAllEdit();
                });
              })
              .catch(() => {
                reject();
              });
          },
          () => reject()
        );
      });
    },
    handleSetQuotation() {
      const { id: inquirySheetId } = this.formData;
      const { overseas, booking } = this.quotationSchemeIds;
      const qIds = [...overseas, ...booking];
      if (!qIds.length) {
        return;
      }
      this.$refs.setQuotationRef.show({
        inquirySheetId,
        quotationSchemeIds: qIds,
      });
    },
    handleSelect(ids, isOverseasToDoor) {
      let { overseas, booking } = this.quotationSchemeIds;
      if (isOverseasToDoor) {
        overseas = ids;
      } else {
        booking = ids;
      }
      this.quotationSchemeIds = {
        overseas,
        booking,
      };
      const {
        overseasToDoor,
        foreignQuotationSheetInfoVO,
        domesticQuotationSheetInfoVO,
      } = this.formData;
      const haveDomestic =
        domesticQuotationSheetInfoVO &&
        [3, 6].includes(domesticQuotationSheetInfoVO.state);
      const haveOverseas =
        overseasToDoor &&
        foreignQuotationSheetInfoVO &&
        [3, 6].includes(foreignQuotationSheetInfoVO.state);
      if (
        (!haveDomestic || booking.length) &&
        (!haveOverseas || overseas.length)
      ) {
        this.setDisabled = false;
      } else {
        this.setDisabled = true;
      }
    },
    // 我的询价queryPage:1 && 国内或者海外已报价都可显示设置客户报价
    showQuotationBtn() {
      const {
        state,
        domesticQuotationSheetInfoVO,
        foreignQuotationSheetInfoVO,
      } = this.formData;
      const domesticState =
        domesticQuotationSheetInfoVO && domesticQuotationSheetInfoVO.state;
      const foreignState =
        foreignQuotationSheetInfoVO && foreignQuotationSheetInfoVO.state;
      if (
        this.queryPage === 1 &&
        state === 2 &&
        ([3, 6].includes(domesticState) || [3, 6].includes(foreignState))
      ) {
        return true;
      }
      return false;
    },
    handleCopy() {
      const {
        packingMode,
        inquirerUserName,
        startPortName,
        endPortName,
        productType,
        deliveryTime,
        cabinetName,
        freightQuantity,
        freightTotalVolume,
        freightTotalWeight,
        overseasToDoor,
        overseasShippingMode,
        deliveryAddress,
      } = this.formData;

      const content = `起运港目的港：${startPortName}-${endPortName}\n产品属性：${
        productType == 0 ? "普货" : "敏感货"
      }\n交货时间：${deliveryTime}\n${
        packingMode == 0
          ? `货物：${cabinetName}\n`
          : `件数：${freightQuantity || "--"}件\n重量：${
              freightTotalWeight || "--"
            }KG\n体积：${freightTotalVolume || "--"}CBM\n`
      }${
        overseasToDoor
          ? `海外运输方式：${this.getOverseasShippingMode(
              overseasShippingMode
            )}\n海外送货地址：${deliveryAddress}\n`
          : ""
      }${
        packingMode == 0
          ? `重量：${freightTotalWeight || "--"}KG\n体积：${
              freightTotalVolume || "--"
            }CBM`
          : ""
      }`;

      handleCopyTextarea(content, this, "复制询价单信息成功");
    },
    getOverseasShippingMode(overseasShippingMode) {
      if (overseasShippingMode) {
        const names = overseasShippingMode.map(
          (k) => this.outWarehouseWayObj[k]
        );
        return names.join(",");
      }
      return "";
    },
    getOrderIsolateConfig() {
      POSTOrderIsolateConfig().then((res) => {
        const { data } = res;
        this.proxyIds = data;
      });
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

  .copy-btn {
    margin-left: 10px;
  }
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
      .set-quotation-btn {
        padding-bottom: 5px;
        border-bottom: 1px solid #e2e2e2;
        text-align: right;
      }
    }
  }
}
</style>
