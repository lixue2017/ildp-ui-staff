<template>
  <div class="app-content-container" v-if="showSearchForm">
    <div>
      <ComDetailTop
        :title="/*认领页面*/ topTitle"
        :formModel="formConfig.formModel"
        ref="detailTopRef"
        class="title-sides-margin-none"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            {{
              formConfig.formModel.operateShortName
                ? `(${formConfig.formModel.operateShortName})`
                : ""
            }}
          </span>
        </template>
      </ComDetailTop>
    </div>
    <div>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        @handleChange="handleChange"
      >
        <template v-slot:bsAccountInfo="slotProps">
          <div class="content-bsAccountInfo">
            <div class="title">收款账户(BS账号)</div>
            <div
              class="content"
              v-for="(item, index) in accountInfo.receipt"
              :key="index"
            >
              <div class="content-label">{{ item.label }}：</div>
              <TooltipOver
                :content="slotProps.formModel[item.value] || '--'"
                :style="{
                  maxWidth: `calc(${
                    slotProps.formModel.buyerId ? '50%' : '100%'
                  } - 105px)`,
                }"
              />
              <i
                v-if="!['receiptPaymentAccountAddress'].includes(item.value)"
                class="txt-copy el-icon-document-copy"
                @click="handleCopyText(slotProps.formModel[item.value] || '--')"
              ></i>
            </div>
          </div>
          <div
            class="content-invoice-info"
            v-if="slotProps.formModel.buyerInvoiceTitle"
          >
            <div class="title">发票信息(收款方)</div>
            <div
              class="content"
              v-for="(item, index) in accountInfo.payee"
              :key="index"
            >
              <div class="content-label">{{ item.label }}：</div>
              <TooltipOver
                :content="slotProps.formModel[item.value] || '--'"
                :style="{
                  maxWidth: 'calc(100% - 105px)',
                }"
              />
              <i
                v-if="!['sellerAccount'].includes(item.value)"
                class="txt-copy el-icon-document-copy"
                @click="handleCopyText(slotProps.formModel[item.value] || '--')"
              ></i>
            </div>
          </div>
        </template>
        <template v-slot:counterpartInfo="slotProps">
          <div class="content-bsAccountInfo">
            <div class="title">对方账号信息</div>
            <div
              class="content"
              v-for="(item, index) in accountInfo.other"
              :key="index"
            >
              <div class="content-label">{{ item.label }}：</div>
              <TooltipOver
                :content="slotProps.formModel[item.value] || '--'"
                :style="{
                  maxWidth: `calc(${
                    slotProps.formModel.sellerId ? '50%' : '100%'
                  } - 105px)`,
                }"
              />
              <i
                v-if="!['openingAddress'].includes(item.value)"
                class="txt-copy el-icon-document-copy"
                @click="handleCopyText(slotProps.formModel[item.value] || '--')"
              ></i>
            </div>
          </div>
          <div
            class="content-invoice-info"
            v-if="slotProps.formModel.sellerInvoiceTitle"
          >
            <div class="title">发票信息(付款方)</div>
            <div
              class="content"
              v-for="(item, index) in accountInfo.payer"
              :key="index"
            >
              <div class="content-label">{{ item.label }}：</div>
              <TooltipOver
                :content="slotProps.formModel[item.value] || '--'"
                :style="{
                  maxWidth: 'calc(100% - 105px)',
                }"
              />
              <i
                v-if="!['buyerAccount'].includes(item.value)"
                class="txt-copy el-icon-document-copy"
                @click="handleCopyText(slotProps.formModel[item.value] || '--')"
              ></i>
            </div>
          </div>
        </template>
        <template v-slot:dialogAdd="slotProps">
          <div class="dialog-class">
            <div>
              <el-checkbox
                v-model="slotProps.formModel.isClaimAll"
                @change="
                  handleChange(slotProps.formModel.isClaimAll, 'isClaimAll')
                "
                >水单金额全部认领
              </el-checkbox>
            </div>
            <div class="tableTags-amount-btn">
              <el-button
                v-debounce
                type="primary"
                @click="addContainerEvt"
                class="add-btn"
              >
                <i class="el-icon-plus"></i>
                添 加
              </el-button>
            </div>
          </div>
        </template>
        <template v-slot:slotQuestion>
          <el-tooltip
            effect="dark"
            content="剩余金额 = 水单金额 + 手续费 - 汇兑损益 - 本次核销(水单币种)合计"
            placement="top"
          >
            <i
              class="el-icon-question"
              style="font-size: 18px; color: #5094ff; cursor: pointer"
            ></i>
          </el-tooltip>
        </template>
        <template v-slot:tableData>
          <ComTable
            ref="tableConfig"
            :tableHeight="tableAutoHeight"
            :columnConfig="tableConfig.columnConfig"
            :columnData="tableConfig.columnData"
            :pagination="false"
            :rowOperationBtnListFn="() => tableConfig.statusList"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'billNo'">
                <span
                  class="primary-text-btn"
                  @click="handleView(slotProps.row.billId)"
                >
                  {{ slotProps.row.billNo }}
                </span>
              </template>
              <template v-if="slotProps.prop === 'verificationMoney'">
                <el-input-number
                  size="mini"
                  v-model="slotProps.row.verificationMoney"
                  v-input-number-limit="slotProps.column.decimal"
                  :max="getVerificationMoneyMax(slotProps.row)"
                  :controls="false"
                  @change="() => getRemainMoney(slotProps.row)"
                />
              </template>
            </template>
          </ComTable>
          <div class="grand-total" v-if="tableSubtotal && tableSubtotal.length">
            <template v-for="(tItem, i) in tableSubtotal">
              <span :key="`t_${i}`">
                <span>{{ tItem.totalLabel }}：</span>
                <span>{{ formatMoney(tItem.totalNum) }}</span>
              </span>
            </template>
          </div>
        </template>
        <template v-slot:uploadFile="slotProps">
          <UploadFiles
            :attachList="slotProps.formModel.attachList"
            :fileData="{
              id: arrRouteIds,
            }"
            :uploadFileModel="{
              webFileType: 'F202',
              fileTypeArr: [
                {
                  label: '发票资料-委托书',
                  fBtnParam: {
                    type: '390',
                  },
                },
              ],
            }"
            @attachIdList="getAttachId"
          />
        </template>
      </ComForm>
    </div>
    <div>
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in statusList">
          <el-button
            :type="btn.type"
            @click="btn.handleClick(formConfig.formModel)"
            :loading="isBtnLoading"
            :key="index"
          >
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </div>
    <WaterAddDialog ref="WaterAddDialogRef" @handleSuccess="getNewData" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { claimFormLists, tableConfig } from "./model.js";
// import { customDialogCols } from "./model.js";
import {
  getWaterBillDetail,
  getMoneyRemainRMB,
  waterBillClaim,
  submitClaimApplyInvoice,
  POSTSettleBankReceiptPayee,
  POSTSettleCashierClaimEdit,
  getApplyInvoice,
} from "@/api/settlementManage/paymentReceived";
import {
  subtractFn,
  multiplicationFn,
  accumulationFn,
} from "@/utils/instructions";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { Notification } from "element-ui";
import { handleCopyText } from "@/utils/confirmBox.js";
import { msgBox } from "@/utils/confirmBox.js";
export default {
  name: "WaterBillClaim",
  mixins: [mixinEditCache],
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    WaterAddDialog: () => import("../../components/waterAddDialog"),
    TooltipOver: () => import("_comp/TooltipOver"),
    UploadFiles: () =>
      import(
        "@/views/settlementManage/paymentReceived/invoice/components/uploadFiles"
      ),
    // ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  computed: {
    tableAutoHeight() {
      const tableLen = this.tableConfig.columnData.length;
      return tableLen > 6 ? `${7 * 49 + 54}px` : undefined;
    },
    tableSubtotal() {
      return [
        {
          totalLabel: "合计（水单币别）",
          totalNum: accumulationFn(
            this.tableConfig.columnData.map(
              (e) => e.bankReceiptVerificationMoney
            )
          ),
        },
      ];
    },
  },
  data() {
    return {
      topTitle: "",
      formConfig: {
        isMixinCreatedMounted: "created",
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        errorFunction: this.handleError, // 表单提交失败回调
        size: "small",
        className: "detail-see-form",
        labelWidth: "90px",
        isAttachFileId: true,
        lists: claimFormLists({}),
      },
      tableConfig: {
        columnConfig: tableConfig.editTable,
        columnData: [],
        statusList: [
          {
            text: "全部",
            handleClick: (r) => this.handleEdit(r),
          },
          {
            text: "移除",
            handleClick: (r) => this.handleDelete(r),
          },
        ],
      },
      statusList: [
        {
          text: "保 存",
          type: "primary",
          handleClick: () => {
            this.$refs.dialogForm.submitForm();
          },
        },
        {
          text: "取 消",
          plain: true,
          handleClick: () => {
            this.reBack();
          },
        },
      ],
      accountInfo: {
        receipt: [
          { label: "账号名称", value: "receiptPaymentAccountName" },
          { label: "开户行", value: "receiptPaymentAccountBank" },
          { label: "银行账号", value: "receiptPaymentBankAccount" },
          { label: "公司地址", value: "receiptPaymentAccountAddress" },
        ],
        payee: [
          { label: "销售方", value: "sellerName" },
          { label: "抬头", value: "sellerInvoiceTitle" },
          { label: "开户行", value: "sellerAccountsBank" },
          { label: "开户账号", value: "sellerAccount" },
        ],
        other: [
          { label: "账号名称", value: "accountName" },
          { label: "开户行", value: "openingBank" },
          { label: "银行账号", value: "bankAccount" },
          { label: "公司地址", value: "openingAddress" },
        ],
        payer: [
          { label: "购买方", value: "buyerName" },
          { label: "抬头", value: "buyerInvoiceTitle" },
          { label: "开户行", value: "buyerAccountsBank" },
          { label: "开户账号", value: "buyerAccount" },
        ],
      },
      showSearchForm: false,
      submitDetermine: undefined, //提交的时候用来判断是直接返回列表还是去开票的数据
      handleCopyText,
      arrRouteIds: [],
      attachId: [],
      tableAutoHeight: undefined,
      tableSubtotal: [],
    };
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
    }),
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getDetail();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary", "tagsView/delView"]),
    getAttachId(data) {
      this.attachId = data;
    },
    getDetail() {
      const { operationType } = this.$route.query;
      this.getWaterBillDetail({ operationType });
      // if(operationType=='add'){
      //   //水单认领
      //   this.getWaterBillDetail();
      // }else{
      //   //编辑
      //   this.getEditDetail()
      // }
    },
    submitFormRequest(formModel) {
      const { operationType } = this.$route.query;
      const { columnData = [] } = this.tableConfig;
      const { isApplyInvoice, bankReceiptCurrencyId } = formModel; //0私账  1公账，  私账直接提交  公账需要判断是否需要开票申请
      if (!columnData.length) {
        this.msgError("对账单信息不能为空");
        return new Promise((resolve, reject) => {
          return reject();
        });
      }
      if (formModel.moneyRemain && formModel.moneyRemain < 0) {
        this.msgError("剩余金额不能小于0");
        return new Promise((resolve, reject) => {
          return reject();
        });
      }
      let executionStatus = true;
      const params = {
        bankReceiptId: formModel.id, //水单ID
        statementInfo: columnData.map((e) => ({
          id: e.id,
          money: e.verificationMoney,
        })), //对账单数据
        serviceCharge: formModel.serviceCharge || 0, //手续费
        serviceChargeCurrencyCode: formModel.bankReceiptCurrencyId, //手续费币别
        exchangeLoss: formModel.exchangeLoss || 0, //汇兑损益
        isClaimAll: formModel.isClaimAll ? 1 : 0, //水单金额全部认领
        remark: formModel.remark, //业务备注
        invoiceCurrencyId: bankReceiptCurrencyId, //发票币别取的水单币别
        invoiceType: 0, //没值，写死0
        invoiceMedium: 0, //没值，写死0
        invoiceId: formModel.invoiceId, // 发票id
        attachId: this.attachId.join(","), // 附件
      };
      columnData.map((e) => {
        //verificationMoney 本次核销金额  writeOffMoney已核销金额  invoiceMoney已开票金额  underwayInvoiceMoney开票中金额   underwayMoney核销中金额(同步认领多票水单)
        const {
          verificationMoney,
          writeOffMoney,
          invoiceMoney,
          underwayInvoiceMoney,
          underwayMoney,
          totalMoney,
        } = e;
        const nowWriteOffMoney = accumulationFn([
          underwayMoney,
          verificationMoney,
          writeOffMoney,
        ]); //本次核销总金额
        const nowInvoicing = accumulationFn([
          invoiceMoney,
          underwayInvoiceMoney,
        ]); //已经开票总金额
        if (totalMoney > 0 && nowWriteOffMoney > nowInvoicing) {
          executionStatus = false;
          return;
        } else if (
          totalMoney < 0 &&
          nowWriteOffMoney > Math.abs(nowInvoicing)
        ) {
          executionStatus = false;
          return;
        }
      });
      if (!executionStatus && isApplyInvoice && operationType == "add") {
        this.submitDetermine = 0;



        return this.comRepeatedRequest(this, submitClaimApplyInvoice, params);
      } else {
        this.submitDetermine = 1;



        const httpRequest={
          'add':waterBillClaim,
          'edit':POSTSettleCashierClaimEdit
        }[operationType]
        return this.comRepeatedRequest(this, httpRequest, params);
      }
      // if (
      //   !executionStatus &&
      //   isApplyInvoice &&//公账
      //   operationType == "add" &&//新增
      //   !formModel.invoiceId//没有发票ID
      // ) {
      //   return this.comRepeatedRequest(this, submitClaimApplyInvoice, params);
      // } else {
      //   const httpRequest = {
      //     add: waterBillClaim,
      //     edit: POSTSettleCashierClaimEdit,
      //   }[operationType];
      //   return this.comRepeatedRequest(this, httpRequest, params);
      // }
    },
    handleSuccess(row) {
      const { data } = row;
      this.$confirm("水单认领成功待财务确认", "提示", {
        confirmButtonText: "确定",
        type: "success",
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
      }).then(() => {
        if (this.submitDetermine == 0) {
          const hasPermi = [
            "settlementManage:paymentReceived:invoice:edit:list",
          ];
          if (hasBtnPermits(hasPermi)) {
            this.$router.push({
              path: "/settlementManagement/invoice/editInvoice",
              query: {
                id: data,
                backPath: "/settlementManagement/billConfirmed/waterBill",
              },
            });
            this.$store.dispatch("tagsView/delView", this.$route);
          } else {
            Notification.error({
              title: "没有访问申请发票的权限，请联系管理员添加权限",
            });
            this.reBack();
          }
        } else {
          this.reBack();
        }
      });
    },
    handleError(err) {
      if (err.code === 1002) {
        err.data && err.data.type && this.handleWarningBox(err.data.type);
      }
    },
    handleWarningBox(type) {
      let line1 = "";
      let lineArr = [];
      switch (type) {
        case 1:
          line1 = "检测到发票币别与水单币别不一致，无法认领，解决方案如下：";
          lineArr = ["1、联系财务人员作废发票", "2、退回款水单"];
          break;
        case 2:
          line1 =
            "检测到发票抬头与水单抬头信息不一致，无法认领，解决方案如下：";
          lineArr = ["1、作废发票", "2、退回款水单", "3、上传委托书附件"];
          break;
        case 3:
          line1 = "检测到水单明细与已开票明细不一致，无法认领，解决方案如下：";
          lineArr = ["1、联系财务人员作废发票", "2、退回款水单"];
          break;

        default:
          break;
      }
      let html = `
				<div class="base-flex weight-bold margin-bottom-5">
          <i class="el-icon-warning"></i>
          ${line1}
        </div>`;
      lineArr.forEach((text) => {
        html += `<div class="margin-left-30">
          ${text}
        </div>`;
      });
      msgBox(
        this,
        {
          customClass: "confirm-class invoice-warning-box",
          html,
          confirmButtonText: "确 定",
          showClose: false,
        },
        () => {}
      );
    },
    getWaterBillDetail(row = {}) {
      this.showSearchForm = false;
      const { operationType } = row;
      const { id } = this.$route.query;
      const httpRequest = {
        add: getWaterBillDetail,
        edit: POSTSettleBankReceiptPayee,
      }[operationType];
      this.topTitle = {
        add: "水单信息(认领)",
        edit: "水单信息(编辑)",
      }[operationType];

      Promise.all([
        httpRequest(id, {}),
        getApplyInvoice({ bankReceiptId: id }),
      ]).then(([res, applyInvoice]) => {
        const { moneyInfo, exchangeLoss, serviceCharge, statementInfos } =
          res.data;
        const moneyRemain =
          moneyInfo && (moneyInfo.moneyRemain || moneyInfo.moneyRemain === 0)
            ? moneyInfo.moneyRemain
            : res.data.money;
        this.formConfig = {
          ...this.formConfig,
          formModel: {
            ...res.data,
            ...applyInvoice.data,
            isClaimAll: !moneyRemain,
            moneyRemain,
            exchangeLoss: exchangeLoss || 0,
            serviceCharge: serviceCharge || 0,
          },
          lists: claimFormLists(),
        };
        if (operationType == "edit") {
          this.tableConfig.columnData = statementInfos;
        }
        this.showSearchForm = true;
        if (operationType == "add") {
          setTimeout(() => {
            this.addContainerEvt();
          }, 500);
        }
      });
    },
    // getEditDetail(){
    //   this.showSearchForm = false;
    //   const {id}=this.$route.query
    //   POSTSettleBankReceiptPayee(id,{}).then((res)=>{
    //     const { moneyInfo, exchangeLoss, serviceCharge,statementInfos } = res.data;
    //     const moneyRemain =
    //       moneyInfo && (moneyInfo.moneyRemain || moneyInfo.moneyRemain === 0)
    //         ? moneyInfo.moneyRemain
    //         : res.data.money;
    //     this.formConfig = {
    //       ...this.formConfig,
    //       formModel: {
    //         ...res.data,
    //         isClaimAll: !moneyRemain,
    //         moneyRemain,
    //         exchangeLoss: exchangeLoss || 0,
    //         serviceCharge: serviceCharge || 0,
    //       },
    //       lists: claimFormLists(),
    //     };
    //     this.tableConfig.columnData=statementInfos
    //     this.showSearchForm = true;
    //   })
    // },
    handleEdit(row) {
      //verificationMoney  本次核销（原币种）=账单金额-已核销金额
      row.verificationMoney = subtractFn([row.totalMoney, row.writeOffMoney]);
      this.getRemainMoney(row);
    },
    getRemainMoney(tRow) {
      //exchangeLoss 汇兑损益  serviceCharge手续费  bankReceiptCurrencyId水单金额币别
      const {
        exchangeLoss = 0,
        serviceCharge = 0,
        bankReceiptCurrencyId,
        id,
      } = this.$refs.dialogForm?.getFormParams();
      if (!id) {
        return;
      }
      if (tRow) {
        //获取本次核销（水单金额）=费用转水单汇率*本次核销（原币种）
        if (!tRow.verificationMoney) {
          tRow.verificationMoney = null;
        }
        tRow.bankReceiptVerificationMoney = multiplicationFn([
          tRow.exchangeRateAb,
          tRow.verificationMoney,
        ]);
      }
      const amount = this.tableConfig.columnData.map((item) => {
        return {
          id: item.id,
          money: item.verificationMoney || 0,
        };
      });
      const params = {
        bankReceiptId: id,
        serviceChargeCurrencyCode: bankReceiptCurrencyId, // 手续费币别ID
        serviceCharge,
        exchangeLoss,
        amount,
      };
      getMoneyRemainRMB(params).then((res) => {
        const { moneyRemain } = res.data;
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          moneyRemain,
          exchangeLoss,
        };
        this.$refs.dialogForm?.setFormModel({
          moneyRemain,
          isClaimAll: !moneyRemain, //水单全部认领
        });
      });
    },
    handleChange(e, type) {
      //serviceCharge手续费   exchangeLoss汇兑损益  isClaimAll水单金额全部认领
      if (["serviceCharge", "exchangeLoss"].includes(type)) {
        this.getRemainMoney();
      }
      if (type == "isClaimAll") {
        // 勾选水单金额全部认领时，手续费=当前手续费-剩余金额 ； 汇兑损益不变
        const { serviceCharge, moneyRemain } =
          this.$refs.dialogForm?.getFormParams();
        if (moneyRemain === 0) {
          //水单金额全部认领后只有通过修改手续费或者修改对账单信息改变勾选状态
          this.$refs.dialogForm?.setFormModel({
            isClaimAll: true,
          });
          return;
        }
        if (e) {
          this.$refs.dialogForm?.setFormModel({
            serviceCharge: subtractFn([serviceCharge, moneyRemain]),
          });
          this.getRemainMoney();
        }
      }
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetail();
        // this.voyageBillObj = {};
        // this.getData(id);
      }
    },
    getVerificationMoneyMax(row) {
      const { totalMoney, writeOffMoney, underwayMoney } = row;
      return Math.abs(subtractFn([totalMoney, writeOffMoney, underwayMoney]));
    },
    handleView(id) {
      this.$router.push({
        path: "/settlementManagement/statementManage/editBillManage",
        query: {
          id,
          backPath: this.$route.fullPath,
          activeTab: "3", // 3-详情
        },
      });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    addContainerEvt() {
      const { id } = this.$route.query;
      const billIds = [
        ...new Set(this.tableConfig.columnData.map((e) => e.billId)),
      ].map((e) => {
        return { id: e };
      });
      this.$refs.WaterAddDialogRef?.show({ bankReceiptId: id, billIds });
    },
    getNewData(rows) {
      const oldIds = this.tableConfig.columnData.map((e) => e.id);
      const nowRows = rows.map((e) => {
        if (oldIds.includes(e.id)) {
          const oldRow = this.tableConfig.columnData.find((t) => t.id == e.id);
          return oldRow;
        } else {
          return e;
        }
      });
      const accountBillId = [];
      this.tableConfig.columnData = (nowRows || []).map((rItem) => {
        const { totalMoney, writeOffMoney, underwayMoney } = rItem;
        const verificationMoney = subtractFn([
          totalMoney,
          writeOffMoney,
          underwayMoney,
        ]);
        const bankReceiptVerificationMoney = multiplicationFn([
          verificationMoney,
          rItem.exchangeRateAb,
        ]);
        accountBillId.push(rItem.id);
        return {
          ...rItem,
          verificationMoney: rItem.isOld
            ? rItem.verificationMoney
            : verificationMoney,
          bankReceiptVerificationMoney: rItem.isOld
            ? rItem.bankReceiptVerificationMoney
            : bankReceiptVerificationMoney,
          isOld: true,
        };
      });
      this.$refs.tableConfig?.setNewTableData(this.tableConfig.columnData);
      this.getRemainMoney();
      this.getApplyInvoiceNew(accountBillId);
    },
    handleDelete(row) {
      this.tableConfig.columnData.some((e, index) => {
        if (e.id == row.id) {
          this.tableConfig.columnData.splice(index, 1);
          return true;
        }
      });
      this.getRemainMoney();
      this.getApplyInvoiceNew(
        this.tableConfig.columnData.map((item) => item.id)
      );
    },
    getApplyInvoiceNew(accountBillId = []) {
      const { id } = this.$route.query;
      const params = {};
      params.bankReceiptId = id;
      if (accountBillId.length) {
        params.accountBillId = accountBillId;
      }
      getApplyInvoice(params).then((res) => {
        this.$refs.dialogForm?.setFormModel(res.data);
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          ...res.data,
        };
        this.$nextTick(() => {
          this.$refs.dialogForm?.renewForm();
        });
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-content-container {
  /deep/ {
    .content-bsAccountInfo,
    .content-invoice-info {
      margin-top: 20px;
      .title {
        font-size: 14px;
        font-weight: bold;
        color: #515151;
      }
      .content {
        display: flex;
        align-items: center;
        font-size: 13px;
        font-weight: 400;
        .content-label {
          width: 72px;
          text-align: right;
          color: #8b8b8b;
        }
        .txt-copy {
          font-size: 18px;
          margin-left: 6px;
          color: #5094ff;
          cursor: pointer;
        }
      }
    }
    .content-bsAccountInfo {
      width: 100%;
      background: #f8f8f8;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
      padding: 15px 20px;
    }
    .content-invoice-info {
      width: 50%;
      position: absolute;
      top: -4px;
      right: -6px;
      z-index: 1;
      padding: 16px 20px 8px;
      background: #f6f9ff;
      box-shadow: 0px 0px 4px 0px #ebebeb;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
    }
    .dialog-class {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .money-Info {
      padding-left: 35px;
      background: rgba(80, 148, 255, 0.05);
      box-shadow: 0px 0px 3px 0px rgba(20, 69, 147, 0.25);
      border-radius: 18px;
      .money-Info-waterReceipt {
        span {
          &:nth-child(2) {
            color: #53c88a;
          }
        }
      }
    }
    .form-column-list {
      flex-direction: column;
      .water-cols-content {
        margin-top: 15px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .water-cols-left {
          flex: 1;
          padding: 5px;
          background: rgba(80, 148, 255, 0.05);
          box-shadow: 0px 0px 3px 0px rgba(20, 69, 147, 0.25);
          border-radius: 18px;
        }
        .water-cols-right {
          padding-left: 10px;
        }
      }
    }
  }
}
</style>
