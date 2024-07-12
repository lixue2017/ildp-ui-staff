<template>
  <div class="app-content-container">
    <div class="content" v-if="isInitRes">
      <ComDetailTop
        :title="`付款信息(${basicInfoConfig.formModel.serialCode || '--'})`"
        ref="detailTopRef"
				:titConfig="leftTopConfig"
				class="title-sides-margin-none"
        :formModel="basicInfoConfig.formModel"
        @handleClick="handleTopClick"
      />
      <div class="top-content">
        <PaymentInfo
          :processRecords="processRecords"
          :formConfig="basicInfoConfig"
        />
        <div class="right-info">
          <CurrencyList :currencyAccountObj="basicInfoConfig.formModel" />
        </div>
      </div>
      <div class="middle-content">
        <div class="content-right">
          <PreviewOrDownload
          v-for="(item,index) in getRightBtns(basicInfoConfig.formModel)"
          :key="index"
            :btnTxt="item.label"
            :btnConf="{
              size: 'small',
              btnType: 'primary',
              round: true,
            }"
            :previewDownloadConf="
             handlePreviewOrDownload(item)
            "
						style="margin-right: 15px;"
          />
        </div>
        <BillTable :formData="basicInfoConfig.formModel" @detailUploadFn="handleSuccess" />
      </div>
    </div>
    <PaymentDrawer ref="PaymentDrawer" :formModel="basicInfoConfig" />

		<template v-if="footBtn.status">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
				<template v-for="(btn, index) in footBtn.showBtn">
					<el-button :type="btn.type" @click="btn.handleClick" :key="index">
						{{ btn.text }}
					</el-button>
				</template>
			</div>
    </template>

    <WaterBillDialog ref="waterBillDialog" @handleSuccess="handleSuccess" />
    <ComCustomDialog ref="customDialogRef" />
    <AddDrawer ref="addDrawer" @handleSuccess="handleSuccess" />
  </div>
</template>
<script>
import { taskDetailsCols, processRecords } from "./editModel";
import { mapActions } from "vuex";
import {
  getCashierInfo,
  getCashierDetail,
	postCashierRepulse,
  POSTCashierPaymentApplyBill,
  POSTCashierPaymentApplyBillServiceCharge,
  POSTBillApplyInvoice
} from "@/api/settlementManage/paymentReceived";
import { getNowDate } from "@/utils/index.js";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import {editInvoiceDialogCols} from "@/views/settlementManage/paymentReceived/invoice/model.js"
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
    BillTable: () => import("./components/BillTable"),
    CurrencyList: () => import("./components/DetailsInfo/currencyList"),
    PaymentInfo: () => import("./components/DetailsInfo/paymentInfo"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    PaymentDrawer: () =>
      import(
        "@/views/settlementManage/paymentReceived/taskList/components/paymentDrawer/index"
      ),
    WaterBillDialog: () => import("../waterBill/components/EditDialog"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AddDrawer: () => import("../payAllocation/components/addDrawer"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
  },
  data() {
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
        formModel: {},
        labelWidth: "92px",
        lists: taskDetailsCols(),
      },
      footBtn: {
        status: false,
        lists: [
          {
            statusBtnArr: [50,60,70,80,100],
            hasPermission: ["settlementManagement:invoice:numEdit"],
            isJoinBs:[0],
            text: "修改发票号",
            handleClick: this.handleEditInvoice,
          },
          {
            statusBtnArr: [50],
            text: "分配任务",
            handleClick: this.handleDistribution,
          },
          {
            text: "付款登记",
            statusBtnArr: [60],
            handleClick: this.handlePayment,
          },
          {
            text: "上传水单",
            statusBtnArr: [70],
            handleClick: this.uploadWaterBill,
          },
          {
            text: "财务核销",
            statusBtnArr: [80],
            handleClick: this.verification,
          },
					{
            text: "打回",
            statusBtnArr: [60, 70, 80, 'w_31'],
            handleClick: this.handleRepulse
          },
          {
            text: "关闭",
            isBtnAll: true,
            handleClick: this.reBack,
          },
        ],
        showBtn: [],
      },
      rightBtns: [
        {
          label: "付款手续费",
          name: "1",
          haveServiceCharge:true,
          httpType:0,
        },
        {
          label: "付款申请单",
          showStatus:[100],
          name: "2",
          httpType:1,
        },
      ],
      isInitRes: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      const { id, type } = this.$route.query;
      if (id) {
        this.getCashierInfo(id); //详情数据
      }
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getCashierInfo(id) {
      this.isInitRes = false;
      getCashierInfo(id).then((res) => {
        this.getFootBtn(res.data); //根据状态获取底部按钮
        this.basicInfoConfig.formModel = {
          ...res.data,
        };
        this.isInitRes = true;
      });
    },
		handleRepulse() {
      console.log(this.$route)
      const { id, status,isMainBill } = this.basicInfoConfig.formModel;
      const settleTypeObj = {
					80: 1,
					60: 4,
					50: 3
				};
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "账单打回",
          label: "备注：",
          id: "remark",
          rulesKey: "remark",
        }),
        formModel: {
					id: [id],
					settleType: settleTypeObj[status], // 区分消息推送
        },
        httpRequest: postCashierRepulse,
        successFunction: () => {
          if([1,'1',2,'2'].includes(isMainBill)&&status==60){
            //主单会被删除，再查询详情会报错，需要跳转回列表
            const {backPath}=this.$route.query
            this.$router.push({
              path:backPath,
            });
            this.$message.success("打回成功");
          }else{
            this.handleSuccess();
          }
        },
      });
			// msgTipBox(this, { title: "打回", msg: "确定打回？" }, () => {
			// 	const settleTypeObj = {
			// 		3: 1,
			// 		0: 4,
			// 		5: 3
			// 	};
			// 	const { id, status } = this.basicInfoConfig.formModel;

			// 	this.comRepeatedRequest(this, postCashierRepulse, {
			// 		id: [id],
			// 		settleType: settleTypeObj[status], // 区分消息推送
			// 	}).then(() => {
			// 		this.reBack();
			// 	});
			// });
		},

    openRecord() {
      //查询付款记录
      const { statementsId } = this.basicInfoConfig.formModel;
      this.$refs.PaymentDrawer.show(statementsId, "payment");
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    getFootBtn(row) {
      //status 0:付款登记  2:上传水单  3:财务核销
      let tStatus = "-1";
      // 分配 && 流水号有 -1时 可打回
      if (row.serialCode.includes("-1") && row.status === 50) {
        tStatus = 'w_31';
      }
      this.footBtn.showBtn = this.footBtn.lists.filter(
        (e) => (e.isBtnAll ? true : e.statusBtnArr.includes(row.status) || e.statusBtnArr.includes(tStatus))&&
        (e.hasPermission ? hasBtnPermits(e.hasPermission) : true)&&//角色权限
        (e.isJoinBs?e.isJoinBs.includes(row.isJoinBs):true)// 1双向单 0非双向
      );
      this.footBtn.status = true;
    },
    handlePayment() {
      //待付款-付款登记
      const { formModel } = this.basicInfoConfig;
      const params = {
        selectionRows: [formModel],
      };
      this.$refs.addDrawer.show(params, "WEB_paymentMerge");
      // const row = JSON.parse(JSON.stringify(this.basicInfoConfig.formModel));
      // const params = {
      //   ...row,
      //   payNum: 1,
      //   id: row.id,
      // };
      // this.$refs.waterBillDialog.show(params, "payment"); //与列表保持一致
    },
    handleDistribution() {
      //待付款-分配任务
      const { formModel } = this.basicInfoConfig;
      const params={
        selectionRows: [formModel],
        isJoinBs:formModel.isJoinBs
      }
      this.$refs.addDrawer.show(params,"WEB_outMerge");
      // const { formModel: fpForm } = this.basicInfoConfig;
      // const opt = {
      //   id: String(fpForm.id),
      //   selectLists: [fpForm],
      // };
      // this.$refs.waterBillDialog.show(opt, "mergeDistribution");
    },
    uploadWaterBill() {
      //上传水单
      const { formModel } = this.basicInfoConfig;
      const params = {
        selectionRows: [formModel],
      };
      this.$refs.addDrawer.show(params, "WEB_uploadWaterBillMerge");
      // const { formModel: row } = this.basicInfoConfig;
      // // getCashierDetail({id: row.id}).then((res) => {
      // this.$refs.waterBillDialog.show(
      //   {
      //     ...row,
      //   },
      //   "RapUploadWaterBill" //与列表保持一致
      // );
      // });
    },
    verification() {
      //待核销-财务核销
      const row = JSON.parse(JSON.stringify(this.basicInfoConfig.formModel));
      const dealDate = getNowDate("-"); // 水单时间
      getCashierDetail({ id: row.id, dealDate }).then((res) => {
        this.$refs.waterBillDialog.show(
          {
            ...res.data,
            picUrl: res.data.picUrl || [],
            dealDate,
          },
          "financiaVerify" //与列表保持一致
        );
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getCashierInfo(id);
      }
    },
    handleSuccess() {
      const { id } = this.$route.query;
      this.getCashierInfo(id); //详情数据
    },
    getRightBtns(row){
      console.log('row',row)
      const arr=this.rightBtns.filter((e)=>{
        const {showStatus,haveServiceCharge}=e
        return ((showStatus?showStatus.includes(row.status):false)||(haveServiceCharge?row.serviceCharge:false))
      })
      return arr
    },
    handlePreviewOrDownload(row){
      const {httpType}=row
      const {id}=this.basicInfoConfig.formModel
      const httpRequest={
        0:POSTCashierPaymentApplyBillServiceCharge,
        1:POSTCashierPaymentApplyBill,
      }[httpType]
      return {
        previewParam: {
          id,
        },
        previewHttp: httpRequest,
      };
    },
    handleEditInvoice(){
      const {invoiceMoney,id,checkNo}=this.basicInfoConfig.formModel
			this.$refs.customDialogRef.showCustomDialog({
				customFormConfig: editInvoiceDialogCols({menuType:'taskList'}),
				formModel: {
					taskBillId: [id],
          invoiceMoney,
          invoiceNumber:checkNo
				},
				httpRequest: POSTBillApplyInvoice,
				successFunction: this.handleSuccess,
			})
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
