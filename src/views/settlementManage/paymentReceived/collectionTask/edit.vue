<template>
  <div class="app-content-container">
    <div class="content" v-if="isInitRes">
      <ComDetailTop
        :title="`收款信息(${basicInfoConfig.formModel.serialCode || '--'})`"
        ref="detailTopRef"
				class="title-sides-margin-none"
				:titConfig="leftTopConfig"
        :formModel="basicInfoConfig.formModel"
        @handleClick="handleTopClick"
      />

      <div class="top-content">
        <PaymentInfo
          :processRecords="processRecords"
          :formConfig="basicInfoConfig"
        />

        <div class="right-info">
          <CurrencyList
            :isPay="false"
            :currencyAccountObj="basicInfoConfig.formModel"
          />
        </div>
      </div>
      <div class="middle-content">
        <div class="content-right">
          <PreviewOrDownload
            btnTxt="收款凭证"
            :btnConf="{
              size: 'small',
              btnType: 'primary',
              round: true,
            }"
            :previewDownloadConf="
              previewDownloadVoucher()
            "
						style="margin-right: 15px;"
            v-if="basicInfoConfig.formModel.status === 100"
          />
          <PreviewOrDownload
            btnTxt="明细凭证"
            :btnConf="{
              size: 'small',
              btnType: 'primary',
              round: true,
            }"
            :previewDownloadConf="
              previewDownloadDetails()
            "
            v-if="basicInfoConfig.formModel.status === 100"
          />
          <!-- <el-button @click="voucher">收款凭证</el-button> -->
          <!-- <el-button @click="openRecord">收款记录</el-button> -->
        </div>
        <BillTable :formData="basicInfoConfig.formModel" @detailUploadFn="keepTableList" />
      </div>
    </div>
    <PaymentDrawer ref="PaymentDrawer" :formModel="basicInfoConfig" />

		<template v-if="isInitRes">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
				<template v-for="(btn, index) in getFooterBtn()">
					<el-button :type="btn.type" @click="handleClick(btn.type)" :key="index">
						{{ btn.text }}
					</el-button>
				</template>
			</div>
    </template>

    <WaterBillDialog ref="waterBillDialog" @handleSuccess="keepTableList" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>
<script>
import { basicInfoConfig, processRecords } from "./editModel";
import { mapActions } from "vuex";
import { comFileDownload } from "@/utils/download.js";
import {
  getCashierInfo,
  settleCashierPreview,
	getCashierVoucherPreview,
  postCashierRepulse,
  GETCashierPreviewAll,
  GETCashierPreviewAllBr
} from "@/api/settlementManage/paymentReceived";
import { msgTipBox } from "@/utils/confirmBox.js";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    BillTable: () =>
      import(
        "@/views/settlementManage/paymentReceived/taskList/components/BillTable"
      ),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    CurrencyList: () =>
      import(
        "@/views/settlementManage/paymentReceived/taskList/components/DetailsInfo/currencyList"
      ),
    PaymentInfo: () =>
      import(
        "@/views/settlementManage/paymentReceived/taskList/components/DetailsInfo/paymentInfo"
      ),
    PaymentDrawer: () =>
      import(
        "@/views/settlementManage/paymentReceived/taskList/components/paymentDrawer/index"
      ),
    WaterBillDialog: () => import("./components/EditDialog/index"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    const formConfig = {
      formModel: {},
      successFunction: () => {}, // 表单提交成功回调
      size: "small",
      labelWidth: "92px",
      formRules: {}, // 表单校验规则
      visibleAll: true,
    };
    return {
      processRecords,
			leftTopConfig: {
				columnConfig: [
					{
						label: "请款人",
						color: "#5094ff",
						prop: "applicantName",
					},
					{
						label: "业务员",
						color: "#5094ff",
						prop: "salesmanName",
					},
					{
						label: "创建时间",
						prop: "createTime",
					},
				],
			},
      basicInfoConfig: {
        ...formConfig,
        lists: basicInfoConfig.lists,
      },
      isInitRes: false,
      statusList: [
        {
          text: "收款确认",
          statusArr: [65],
          isApply: [1, 5],
          type: "Collection",
        },
        {
          text: "财务核销",
          statusArr: [80],
          isApply: [0, 1, 5],
          type: "Verification",
        },
        {
          text: "打回",
          statusArr: [65, 80, "w_31"],
          isApply: [0, 1, 5],
          type: "repulseBtn",
        },
        {
          text: "关闭",
          isBtnAll: true,
          type: "reBack",
        },
      ],
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      const { id } = this.$route.query;
      if (id) {
        this.getCashierInfo(id);
      }
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    previewDownloadVoucher() {
      const { id } = this.basicInfoConfig.formModel;
      return {
        previewParam: {
          id,
        },
        previewHttp: GETCashierPreviewAllBr,
      };
    },
		previewDownloadDetails() {
			const { id } = this.basicInfoConfig.formModel;
      return {
        previewParam: {
          id,
        },
        previewHttp: GETCashierPreviewAll,
      };
    },
    getCashierInfo(id) {
      this.isInitRes = false;
      getCashierInfo(id).then((res) => {
        const fModel = res.data;
        this.basicInfoConfig.formModel = {
          ...fModel,
        };
        this.isInitRes = true;
      });
    },
    openRecord() {
      const { statementsId } = this.basicInfoConfig.formModel;
      this.$refs.PaymentDrawer.show(statementsId, "collection");
    },
    getFooterBtn() {
      const {
        status,
        isApplyInvoice,
        serialCode = "",
      } = this.basicInfoConfig.formModel;
      // 有水单流水显示收款确认
      let tStatus = "-1";
      // 待收款 && 流水号有 -1时 可打回
      if (serialCode.includes("-1") && status === 55) {
        tStatus = "w_31";
      }
      return this.statusList.filter((e) => {
        return e.isBtnAll
          ? true
          : (e.statusArr.includes(status) || e.statusArr.includes(tStatus)) &&
              e.isApply?.includes(isApplyInvoice);
      });
    },
    keepTableList() {
      const { id } = this.$route.query;
      this.getCashierInfo(id);
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getCashierInfo(id);
      }
    },
    voucher() {
      // const { id } = this.$route.query;
      // comFileDownload(this, settleCashierPreview, { id });
    },
    handleClick(type) {
      switch (type) {
        //Collection 收款确认    Verification财务核销    reBack返回
        case "Collection":
          this.$refs.waterBillDialog.show(this.basicInfoConfig.formModel, type);
          break;
        case "Verification":
          this.$refs.waterBillDialog.show(this.basicInfoConfig.formModel, type);
          break;
        case "repulseBtn":
          this.$refs.customDialogRef.showCustomDialog({
            customFormConfig: remarkDialogCols({
              title: "账单打回",
              label: "备注：",
              id: "remark",
              rulesKey: "remark",
            }),
            formModel: {
              id: [this.basicInfoConfig.formModel.id],
              settleType: 2,
            },
            httpRequest: postCashierRepulse,
            successFunction: () => {
              this.$refs.detailTopRef?.comReBack();
            },
          });
          // msgTipBox(this, { title: "打回", msg: "确定打回？" }, () => {
          //   this.comRepeatedRequest(this, postCashierRepulse, {
          //     id: [this.basicInfoConfig.formModel.id],
          //     settleType: 2,
          //   }).then(() => {
          //     this.$refs.detailTopRef?.comReBack();
          //   });
          // });
          break;
        case "reBack":
          this.$refs.detailTopRef?.comReBack();
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-content-container {
  /deep/ {
    .el-form-item {
      margin-bottom: 20px;
    }
    .remark-info {
      margin-bottom: 0;
    }
  }
  .content {
    .title {
      font-weight: bold;
      color: #515151;
      margin-bottom: 15px;
    }
    .top-content {
      display: flex;
      margin-bottom: 20px;
      .right-info {
        flex: 1;
        min-width: 300px;
        padding-left: 20px;
        border-left: 1px solid #e2e2e2;
      }
    }
    .middle-content {
      position: relative;
      .content-right {
        position: absolute;
        right: 0;
        z-index: 1;
      }
    }
  }
}
</style>
