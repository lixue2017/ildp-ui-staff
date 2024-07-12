<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      class="audit-dialog"
    >
      <template v-slot:title></template>
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        >
          <template v-slot:imgList>
            <div class="title">上传图片</div>
            <div class="sub-title">最多5张，支持png、jpg格式</div>
            <ComUpload
              :uploadConfig="uploadConfig"
              @handleSuccess="handleUploadSuccess"
            >
            </ComUpload>
          </template>
          <template v-slot:slotImgList="{ formModel }">
            <div class="custom-preview-image">
              <template v-for="(item, index) in formModel.picUrl">
                <el-image
                  v-if="item"
                  :src="item"
                  :key="index"
                  :preview-src-list="formModel.picUrl"
                >
                </el-image>
              </template>
            </div>
          </template>
          <template
            v-for="(sItem, sIdx) in currencySlotArr"
            v-slot:[sItem.numKey]="{ formModel }"
          >
            <div
              :class="[
                'table-slot-Sxf',
                sItem.numKey === 'verificationMoney' && formModel.isBatch && formModel.bankReceiptCurrencyId === formModel.currencyCode
                  ? 'table-slot-disabled'
                  : '',
              ]"
              :key="sIdx"
            >
						<!-- :disabled="
                  sItem.numKey === 'verificationMoney' && formModel.poll != 1
                " -->
              <el-input
								type="number"
                placeholder="请输入"
                v-model="formModel[sItem.numKey]"
                class="input-with-select"
								:disabled="
                  sItem.numKey === 'verificationMoney' && formModel.isBatch && formModel.bankReceiptCurrencyId === formModel.currencyCode
                "
                @input="
                  (val) =>
                    currencyInpChange(val, sItem, formModel.isAllVerification)
                "
								@change="(val) => inputChangeEvt(val, sItem)"
              >
                <el-select
                  v-model="formModel[sItem.currencyKey]"
                  slot="append"
                  placeholder="币别"
                  @change="(val) => changeSelect(val, sItem)"
                >
                  <el-option
                    v-for="(item, index) in unitList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </div>
          </template>

          <template v-slot:exchangeRate="{ formModel }">
            <div class="base-flex-between">
              <el-input-number
                v-model="formModel.exchangeRate"
                v-input-number-limit="10"
                :min="0"
                :controls="false"
                placeholder="购汇汇率"
                :disabled="
                  (formModel.isAllVerification && !formModel.isBatch) ||
                  formModel.bankReceiptCurrencyId === formModel.currencyCode
                "
                @change="handleFormChange"
              ></el-input-number>
              <el-checkbox
                @change="changeAllOff"
                class="all-off-check"
								:disabled="formModel.isBatch"
                v-if="
                  formModel.bankReceiptCurrencyId !== formModel.currencyCode || formModel.isBatch
                "
                v-model="formModel.isAllVerification"
                >全部核销</el-checkbox
              >
            </div>
          </template>
          <!-- <template v-slot:exchangeLoss="{ formModel }">
            <div class="table-slot-HDSY">
              <el-input
                v-model="formModel.exchangeLoss"
                @change="getRemainMoney(formModel)"
                ><template slot="append">RMB</template></el-input
              >
            </div>
          </template> -->
					<template v-slot:receiptPaymentAccount="slotProps">
						<AutoComplete
							ref="selectAccountRef"
							:formModel="slotProps.formModel"
							:fieldItem="slotProps.fieldItem"
							:additionalParam="{
								customerId: slotProps.formModel.businessCompany, // 主体公司
            		currencyId: slotProps.formModel.currencyCode, // 币别
							}"
						/>
					</template>
					<template v-slot:serviceChargeAccountId="slotProps">
						<AutoComplete
							ref="sServiceAccountRef"
							:formModel="slotProps.formModel"
							:fieldItem="slotProps.fieldItem"
							:additionalParam="{
								customerId: slotProps.formModel.businessCompany, // 主体
            		currencyId: slotProps.formModel.serviceChargeCurrencyId, // 手续费币别
							}"
						/>
					</template>
          <template v-slot:receiptPaymen="{ formModel }">
            <div class="slot-content-receiptPayment">
              <p>{{ formModel.AccountName }}</p>
              <p>{{ formModel.AccountOpeningBank }}</p>
              <p>{{ formModel.BankAccount }}</p>
            </div>
          </template>
          <template v-slot:poll="{ formModel }">
            <!-- 付款任务单 分配任务 付款登记 上传水单  财务核销 -->
            <div class="content-payNum">
              <span>付款票数：</span>
              <span>{{ formModel.poll ? `${formModel.poll}票` : "--" }}</span>
            </div>
            <div>
              <span>业务单位：</span>
              <span>{{ formModel.businessCompanyName }}</span>
            </div>
            <div>
              <span>相关单位：</span>
              <span>{{ formModel.dealingsCompanyName }}</span>
            </div>
            <div>
              <span>业务员：</span>
              <span>{{ formModel.salesmanName }}</span>
            </div>
          </template>
          <!-- 付款任务单 财务核销 -->
          <template v-slot:payCurrency="{ formModel }">
            <div class="content-verification">
              <div class="balance-description">
                剩余金额 = 待付款金额 - 核销金额 / 购汇汇率
              </div>
              <div>预计剩余付款金额</div>
              <div>
                <span
                  >{{ formModel.billCurrencyCode }}[{{
                    formModel.billCurrencyName
                  }}]：</span
                >
                <span style="color: #ff0000">{{
                  formatMoney(formModel.remainingPayment)
                }}</span>
              </div>
            </div>
          </template>
          <template v-slot:verification="{ formModel }">
            <!-- 付款任务单 分配任务 付款登记 上传水单  财务核销 -->
            <div class="content-verification">
              <div>
                <p>待付款金额</p>
                <span
                  >{{ formModel.billCurrencyCode }}[{{ formModel.billCurrencyName }}]：</span
                >
                <span>{{ formatMoney(formModel.remainMoney) }}</span>
              </div>
              <div>
                <p>已付款金额</p>
                <span
                  >{{ formModel.billCurrencyCode }}[{{ formModel.billCurrencyName }}]：</span
                >
                <span>{{ formatMoney(formModel.money) }}</span>
              </div>
            </div>
          </template>
          <template v-slot:Subtotal="{ formModel }">
            <!-- 付款任务单 分配任务 付款登记 上传水单  财务核销 -->
            <div class="content-verification">
              <span>小计金额</span>
              <div v-for="(item, index) in formModel.amonnt" :key="index">
                <span>{{ item.currencyCode }}[{{ item.currencyName }}]：</span>
                <span>{{ formatMoney(item.money) }}</span>
              </div>
            </div>
          </template>
          <template v-slot:bankReceiptMoney="{ formModel }">
            <!-- 付款任务单 分配任务 付款登记 上传水单  财务核销 -->
            <span
              >{{
                formModel.bankReceiptMoney ? formModel.bankReceiptMoney : 0
              }}RMB</span
            >
          </template>
          <template v-slot:uploadWater="slotProps">
            <UploadFiles
              :fileData="{
                ...slotProps.formModel,
              }"
              :uploadFileModel="uploadFileModel"
              @attachIdList="getAttachIdList"
            >
            </UploadFiles>
          </template>
        </ComForm>
      </template>
    </ComDialog>
  </div>
</template>


<script>
import { config, financiaVerifyLists, waterUploadLists } from "./model";
import { defaultParams } from "_comp/ComUpload/model";
import { getToken } from "@/utils/auth";
import { querySearchList } from "@/api/common";
import {
  addWaterBill,
  updateWaterBill,
  addCashierReceipt,
  cashierPayment, //付款分配
  paymentCheck, //付款登记
  paymentUploadBankReceipt, //上传水单，收付款上传
  paymentVerification, //财务核销
  submitBatchVerification,
  getWaterBillDetail, //水单详情
  cashierPaymentUploadBankReceipt, //收付款上传水单
  getCashierDetail,
  getCashierDetailByBefore,
  getPaymentCashierByRegister,
  postCashierRepulse,
} from "@/api/settlementManage/paymentReceived.js";
import { msgTipBox } from "@/utils/confirmBox.js";
import { getAccountList } from "@/api/settlementManage/feeSet.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    ComUpload: () => import("_comp/ComUpload"),
		AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    UploadFiles: () =>
      import("@/views/operateManage/components/uploadFiles/index.vue"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirmClose: false,
      customDialogConfig: {
        title: "水单信息(编辑)",
        width: "800px",
        appendToBody: this.appendToBody,
        footer: [],
      },
      dialogFooter: [
        // {
        //   text: "打回",
        //   plain: true,
        //   btnType: ["mergeDistribution", "createWaterBill", "editDialog"], // 收款水单管理、分配不显示
        //   handleClick: () => {
        //     const { poll, id } = this.formConfig.formModel;
        //     if (poll != 1 && typeof id !== "number") {
        //       return this.msgError("批量操作不可打回");
        //     }
        //     const settleTypeObj = {
        //       financiaVerify: 1,
        //       payment: 4,
        //     };
        //     msgTipBox(this, { title: "财务打回", msg: "确定打回？" }, () => {
        //       this.comRepeatedRequest(this, postCashierRepulse, {
        //         id: [id],
        //         settleType: settleTypeObj[this.type], // 区分消息推送
        //       }).then(() => {
        //         this.handleFormSuccess();
        //       });
        //     });
        //   },
        // },
        {
          text: "确认",
          type: "primary",
          btnType: [],
          handleClick: this.handleConfirm,
        },
        {
        	text: "取消",
        	plain: true,
        	btnType: [],
        	handleClick: () => {
        		this.$refs.customDialog.handleClose();
        	},
        },
      ],
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleFormSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
        lists: config.addLists, // 表单渲染列表
      },
      uploadConfig: {
        ...defaultParams,
        type: "picture-card",
        className: "card-uploader",
        autoUpload: true,
        pasteUpload: true, // 图片粘贴上传
        fileList: [],
        url: process.env.VUE_APP_BASE_API + "/crm/info/customerFile",
        headers: { Authorization: "Bearer " + getToken() },
        limit: 5,
        size: 100,
        multiple: true,
        accept: ".jpg,.png",
        name: "customerFile",
      },
      type: "",
      unitList: [], //货币
      verification: [
        { title: "待核销本位币", currencyName: "RMB：", money: 0 },
        { title: "已核销本位币", currencyName: "RMB：", money: 0 },
      ],
      Subtotal: {
        title: "合计金额",
        lists: [
          { currencyName: "RMB：", money: 0 },
          { currencyName: "USD：", money: 0 },
        ],
      },
      currencySlotArr: [
        {
          numKey: "serviceCharge", // 手续费
          currencyKey: "serviceChargeCurrencyId",
        },
        {
          numKey: "verificationMoney", // 核销金额
          currencyKey: "currencyCode",
          currencyCodeKey: "bankReceiptCurrencyCode",
        },
        {
          numKey: "money", // 金额
          currencyKey: "currencyCode",
        },
      ],
      uploadFileModel: {
        fileTypeArr: [
          {
            label: "应收账单合同",
            fBtnParam: {
              type: "131",
            },
          },
        ],
      },
      attachId:[]
    };
  },
  created() {},
  methods: {
    handleConfirm() {
      if (this.type === "financiaVerify") {
        const { remainingPayment, billCurrencyCode, billCurrencyName } =
          this.$refs.dialogForm?.getFormParams() || {};
        let confirmText = [];
        if (remainingPayment > 0) {
          confirmText = [
            `当前付款单还剩 ${remainingPayment} ${billCurrencyCode}[${billCurrencyName}]未核销 !`,
            "此付款任务单可被再次付款，你还要继续吗?",
          ];
        } else if (remainingPayment < 0) {
          this.msgError("预计剩余付款金额不能小于0");
          return;
        } else {
          confirmText = [
            "当前付款单核销完成!",
            "核销完成之后此付款单完结，你还要继续吗?",
          ];
        }
        const newDatas = [];
        const h = this.$createElement;
        for (const i in confirmText) {
          newDatas.push(h("p", null, confirmText[i]));
        }
        this.$confirm("提示", {
          confirmButtonText: "继 续",
          cancelButtonText: "取 消",
          type: "warning",
          message: h("div", null, newDatas),
        })
          .then(() => {
            this.$refs.dialogForm.submitForm();
          })
          .catch(() => {});
      } else {
        this.$refs.dialogForm.submitForm();
      }
    },
    submitFormRequest(formModel) {
      let picUrls = [];
      if (this.type === "add") {
        this.uploadConfig.fileList.map((item) => {
          if (item.response) {
            picUrls.push(item.response.imgUrl);
          } else {
            picUrls.push(item.url);
          }
        });
      }
      let params = {
        // id: formModel.id ? formModel.id : "",
        bankReceiptTitle: formModel.bankReceiptTitle, //水单抬头
        money:
          typeof formModel.money === "string"
            ? JSON.parse(formModel.money)
            : formModel.money, //金额
        currencyId: formModel.currencyId, //币别
        payType: formModel.payType == "1" ? "0" : "1", //收付款类型(0:应收/1:应付)
        accountId: formModel.accountId, //ID
        dealDate: formModel.dealDate, //水单时间
        picUrl: picUrls, //水单图片url集合
        financialRemark: formModel.financialRemark, //财务备注
      };
      if (this.type === "add") {
        //创建发票
        return addWaterBill(params);
      } else if (this.type === "editDialog") {
        // 修改水单
        const data = {
          id: formModel.id ? formModel.id : "",
          currencyCode: this.formConfig.formModel.currencyId,
          money: formModel.money,
          openingBank: formModel.openingBank,
          openingAddress: formModel.openingAddress,
          bankAccount: formModel.bankAccount,
          accountName: formModel.accountName,
          receiptPaymentAccount: formModel.receiptPaymentAccount?.value,
          dealDate: formModel.dealDate,
          attachId: formModel.attachId,
          remark: formModel.financialRemark,
        };
        return updateWaterBill(data);
      } else if (this.type === "Verification") {
        params.taskAccountId = formModel.id || "";
        return addCashierReceipt(params);
      } else if (this.type === "addAllSelect") {
        //付款单批量分配任务
        return cashierPayment({
          ids: formModel.id.split(","),
          cashierBy: formModel.accountId,
          bankReceiptCheckBy: formModel.bankReceiptCheckBy,
          verificationBy: formModel.verificationBy,
        });
      }
      //  else if (this.type === "assignedBy") {
      //   //付款任务单单独分配任务
      //   var idArr = [];
      //   idArr.push(formModel.id);
      //   const data = {
      //     ids: idArr,
      //     cashierBy: formModel.accountId,
      //     bankReceiptCheckBy: formModel.bankReceiptCheckBy,
      //     verificationBy: formModel.verificationBy,
      //   };
      //   return cashierPayment(data);
      // }
      // else if (this.type === "payment") {
      //   //付款登记
      //   const data = {
      //     id: [formModel.id],
      //     bankReceiptCheckBy: formModel.bankReceiptCheckBy,
      //     remark: formModel.remark,
      //     accountId: formModel.accountId,
      //     // currencyCode: formModel.currencyCode,
      //     // latestPaymentDate: formModel.latestPaymentDate,
      //   };
      //   return paymentCheck(data);
      // }
      else if (this.type === "createWaterBill") {
        //上传水单
        const data = {
          // id: formModel.id ? formModel.id : "",
          currencyCode: this.formConfig.formModel.currencyId,
          money: formModel.money,
          openingBank: formModel.openingBank,
          openingAddress: formModel.openingAddress,
          bankAccount: formModel.bankAccount,
          accountName: formModel.accountName,
          receiptPaymentAccount: formModel.receiptPaymentAccount?.value,
          dealDate: formModel.dealDate,
          attachId: formModel.attachId,
          remark: formModel.financialRemark,
        };
        return addWaterBill(data);
      } else if (this.type === "financiaVerify") {
        //财务核销
        let verifyOpt = {
          dealDate: formModel.dealDate, //水单时间
          serviceCharge: formModel.serviceCharge, //手续费
          serviceChargeCurrencyCode: formModel.serviceChargeCurrencyId, //手续费币种
          receiptPaymentAccount: formModel.receiptPaymentAccount, //付款账号
          remark: formModel.remark,
					exchangeRate: formModel?.exchangeRate, // 购汇汇率,
					currencyCode: formModel?.currencyCode, //核销币别,
					verificationMoney: formModel?.verificationMoney, //核销金额
					isAllVerification: formModel.isAllVerification ? 1 : 0, // 是否完全核销(0:否/1:是)
					orderId: formModel.orderId, // 工作单号
          serviceChargeAccountId: formModel.serviceChargeAccountId, // 手续费付款账号
					payeeAccountId: formModel.payeeAccountId, // 双向收款账号
          attachId:this.attachId.join(',')
        };
        if (formModel.isBatch) {
          // 批量核销
          verifyOpt = {
            ...verifyOpt,
            id:
              typeof formModel.id === "number" ? [formModel.id] : formModel.id,
          };
          return submitBatchVerification({
            ...verifyOpt,
          });
        }
        const data = {
          ...verifyOpt,
          id: formModel.id,
          type: 0, //应收应付类型
          exchangeLoss: formModel.exchangeLoss, //汇兑损益
        };
        return paymentVerification(data);
      }
      //  else if (this.type === "RapUploadWaterBill") {
      //   // 收付款上传水单
      //   return cashierPaymentUploadBankReceipt({
      //     id: formModel.id,
      //     remark: formModel.remark,
      //     attachId: formModel.attachId,
      //     verificationBy: formModel.verificationBy,
      //   });
      // }
      //  else if (this.type === "mergeDistribution") {
      //   const params = {
      //     ids: formModel.id?.split(","),
      //     cashierBy: formModel?.accountId,
      //     latestPaymentDate: formModel?.latestPaymentDate,
      //     currencyId: formModel?.currencyId,
      //     remark: formModel?.remark,
      //     bankReceiptCheckBy: formModel.bankReceiptCheckBy,
      //     verificationBy: formModel.verificationBy,
      //   };
      //   return cashierPayment(params);
      // }
       else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    handleFormSuccess() {
      this.hide();
      this.$emit("handleSuccess");
    },
    async show(params, type) {
      console.log("type", type);
      console.log("params", params);
      this.uploadConfig.fileList = [];
      this.type = type;
      if (params) {
        this.formConfig.formModel = {
          id: params.id,
        };
        if (params.picUrl) {
          params.picUrl.map((item) => {
            this.uploadConfig.fileList.push({ url: item });
          });
        }
      }
      this.formConfig.formRules = config.formRules; // 表单校验规则
      this.customDialogConfig.footer = this.dialogFooter.filter(
        (e) => !e.btnType.includes(type)
      );

      /** 水单改为公共上传组件 */
      const newUploadFile = [
        // "RapUploadWaterBill",
        "createWaterBill",
        "editDialog",
      ].includes(type);
      this.formConfig.isAttachFileId = newUploadFile;
      this.formConfig.uploadFormConfig = newUploadFile
        ? {
            type: "picture-card",
            className: "card-uploader",
            limit: 5,
            accept: ".jpg,.png",
          }
        : undefined;

      switch (type) {
        case "editDialog":
          // 水单管理(收款) -> 修改水单
          this.customDialogConfig.title = "修改水单";
          await this.initEditWaterBill(params);
          break;
        case "createWaterBill":
          // 水单管理(收款) -> 新增水单
          this.formConfig.formModel = {
            ...params,
            payType: "1",
          };
          this.customDialogConfig.title = "新增水单";
          this.formConfig.lists = waterUploadLists({
            handle: (val) => this.changeWaterBill(val),
          });
          this.formConfig.formRules = config.waterUploadFormRules;
          break;
        // case "assignedBy":
        //   //单个分配任务
        //   this.formConfig.formModel = {
        //     ...this.formConfig.formModel,
        //     taskNum: 1,
        //   };
        //   this.customDialogConfig.width = "500px";
        //   this.customDialogConfig.title = config.assignedByLists[0].title;
        //   this.formConfig.lists = config.assignedByLists;
        //   break;
        case "financiaVerify":
          //财务核销
          this.initWriteOff(params);
          break;
        case "addAllSelect":
          //批量分配任务
          this.formConfig.formModel = {
            ...this.formConfig.formModel,
            taskNum: params.num,
          };
          this.customDialogConfig.width = "500px";
          this.customDialogConfig.title = config.assignedByLists[0].title;
          this.formConfig.lists = config.assignedByLists;
          break;
        // case "mergeDistribution":
        //   // 合并分配付款人
        //   await this.initDistribution(params);
        //   break;
        // case "payment":
        //   //付款登记
        //   await this.initRegister(params);
        //   break;
        // case "RapUploadWaterBill":
        //   await this.initWaterBill(params);
        //   break;
        default:
          break;
      }
      this.$refs.customDialog.show();
    },

    /** 初始值 */
    initEditWaterBill(params) {
      // 水单修改详情初始化
      return getWaterBillDetail(params.id).then((res) => {
        const {
          receiptPaymentAccount,
          remark,
          bankReceiptCurrencyCode,
          bankReceiptCurrencyName,
          bankReceiptCurrencyId,
          ...nRes
        } = res.data || {};
        this.formConfig = {
          ...this.formConfig,
          formModel: {
            ...nRes,
            receiptPaymentAccount: {
              value: receiptPaymentAccount,
            },
            currencyName: `${bankReceiptCurrencyCode}[${bankReceiptCurrencyName}]`, //币别名称
            currencyId: bankReceiptCurrencyId,
            financialRemark: remark,
            payType: "1",
          },
          formRules: config.waterUploadFormRules,
          lists: waterUploadLists({
            handle: (val) => this.changeWaterBill(val),
          }),
        };
      });
    },
    // initDistribution(params) {
    //   const id = params.id.split(",");
    //   const { selectLists } = params;
    //   const { taskByName, taskBy } = selectLists[0];
    //   //获取详情列表中缺少的数据
    //   return getCashierDetailByBefore(id).then((res) => {
    //     const {
    //       businessCompanyName,
    //       dealingsCompanyName,
    //       salesmanName,
    //       poll,
    //       amonnt,
    //       billCurrencyCode,
    //       billCurrencyName,
    //       remainMoney,
    //     } = res.data || {};
    //     this.formConfig = {
    //       ...this.formConfig,
    //       formModel: {
    //         id: params.id,
    //         taskNum: params.num,
    //         accountId: taskByName === "Zzeng" ? taskBy : "",
    //         businessCompanyName, //往来单位
    //         dealingsCompanyName, //相关单位
    //         salesmanName, //业务员
    //         poll, //付款票数
    //         amonnt, //合计金额
    //         currencyId: selectLists[0]?.currencyCode, //币种
    //         latestPaymentDate: selectLists[0]?.latestPaymentDate,
    //         remainMoney,
    //         billCurrencyCode,
    //         billCurrencyName,
    //       },
    //       lists: config.mergeDistribution.lists,
    //       formRules: config.mergeDistribution.formRules,
    //     };
    //     this.customDialogConfig.width = "900px";
    //     this.customDialogConfig.title = config.mergeDistribution.title;
    //   });
    // },
    // initRegister(params) {
    //   return getCashierDetail({ id: params.id }).then((res) => {
    //     const {
    //       bankReceiptMoney,
    //       currencyId,
    //       poll,
    //       amonnt,
    //       billCurrencyCode,
    //       billCurrencyName,
    //       remainMoney,
    //       bankReceiptCheckBy,
    //       financialRemark,
    //       businessCompanyName,
    //     } = res.data || {};
    //     this.formConfig = {
    //       ...this.formConfig,
    //       formModel: {
    //         ...params,
    //         money: bankReceiptMoney,
    //         currencyCode: currencyId,
    //         poll,
    //         amonnt,
    //         bankReceiptCheckBy,
    //         billCurrencyCode,
    //         billCurrencyName,
    //         remainMoney,
    //         financialRemark,
    //         businessCompanyName,
    //       },
    //       lists: config.paymentLists.lists,
    //       formRules: config.paymentLists.formRules,
    //     };
    //     this.customDialogConfig.width = "900px";
    //     this.customDialogConfig.title = config.paymentLists.title;
    //   });
    // },
    // initWaterBill(params) {
    //   const { attachList, attachId, ...nParams } = params;
    //   return getCashierDetail({ id: params.id }).then((res) => {
    //     const {
    //       bankReceiptMoney,
    //       accountName,
    //       poll,
    //       bankAccount,
    //       openingBank,
    //       openingAddress,
    //       amonnt,
    //       moneyInfo,
    //       billCurrencyCode,
    //       billCurrencyName,
    //       remainMoney,
    //       financialRemark,
    //       checkRemark,
    //       businessCompanyName,
    //       verificationBy,
    //     } = res.data || {};
    //     // this.verification[0].money = resData?.moneyInfo.moneyWaitRMB;
    //     // this.verification[1].money = resData?.moneyInfo.moneyRMB;
    //     this.formConfig = {
    //       ...this.formConfig,
    //       formModel: {
    //         ...nParams,
    //         payNum: poll,
    //         money: bankReceiptMoney, //待核销金额
    //         AccountName: accountName, //收付款账号名
    //         BankAccount: bankAccount, //收付款银行账号
    //         AccountOpeningBank: openingBank, //收付款开户行
    //         AccountOpenAddress: openingAddress, //收付款开户行地址
    //         amonnt, //合计金额
    //         moneyInfo, //核销信息
    //         poll, //票数
    //         billCurrencyCode,
    //         billCurrencyName,
    //         remainMoney,
    //         financialRemark,
    //         checkRemark,
    //         businessCompanyName,
    //         verificationBy,
    //       },
    //       lists: config.RapUploadWaterBillList.lists,
    //       formRules: config.RapUploadWaterBillList.formRules,
    //     };
    //     this.customDialogConfig.width = "900px";
    //     this.customDialogConfig.title = config.RapUploadWaterBillList.title;
    //   });
    // },
    initWriteOff(initObj) {
      const { poll, remainMoney, verificationMoney,isBatch } = initObj;
      let bankReceiptMoney = 0;
      let exchangeLoss = 0;
      if (!isBatch) {
        this.customDialogConfig.title = "付款核销";
        bankReceiptMoney = initObj.remainMoneyRMB;
        exchangeLoss = initObj.exchangeLoss;
      } else {
        this.customDialogConfig.title = "批量核销";
      }
      this.getCurrency(); //获取币别
      this.formConfig = {
        ...this.formConfig,
				labelWidth: "115px",
        lists: financiaVerifyLists({
					pId: initObj.id,
					customerId: initObj.dealingsCompany,
					isJoinBs: initObj.isJoinBs, // 1-双向核销
        }).lists,
        formRules: financiaVerifyLists().formRules,
        formModel: {
          ...initObj,
          methodOfPayment: initObj.type,
          tempMoney: initObj.money || 0, // 临时赋值，用于限制金额输入
          payNum: poll, //付款票数
          currencyName: initObj.billCurrencyCode, //币别
          poll, //付款票数
          remainMoney, // 待付款金额
          verificationMoney: remainMoney, // 核销金额
          currencyCode: initObj.bankReceiptCurrencyId,
          bankReceiptMoney, //剩余金额
          exchangeLoss, //汇兑损益
          exchangeRate: "1.0000", // 兑USD汇率
          remainingPayment: "0.00", // 预计剩余付款金额
					isAllVerification: isBatch // 批量默认全部核销
        },
      };
      this.customDialogConfig.width = "1050px";
    },
    changeSelect(e, sItem) {
      // console.log('付款核销选择核销币别', e, sItem)
      if (sItem.numKey === "verificationMoney") {
        // this.$refs.dialogForm?.setFormModel({ receiptPaymentAccount: null });
				this.$refs.selectAccountRef.changeFocusRequest()
        this.$nextTick(() => {
          const { bankReceiptCurrencyId, remainMoney, poll,isBatch } =
            this.formConfig.formModel;
          if (e === bankReceiptCurrencyId) {
            this.$refs.dialogForm?.setFormModel({
              exchangeRate: "1.0000",
              remainingPayment: "0.00",
              verificationMoney: remainMoney,
							isAllVerification: isBatch,
            });
          }
        });
      }
			if (sItem.numKey === "serviceCharge" || sItem.numKey === "verificationMoney") {
				// console.log('===e', e, sItem)
        // this.$refs.dialogForm?.setFormModel({ receiptPaymentAccount: null });
				const sxFind = this.formConfig.lists[0].fieldList[0].rows[0].cols.find(e => e.id === 'serviceChargeAccountId');
				if (!sxFind) return false;

				this.$refs.sServiceAccountRef?.changeFocusRequest();
				const SXF_NUM =
          this.$refs.dialogForm?.getFormModelVal("serviceCharge") || '';
				const SXF_CURRENCY =
          this.$refs.dialogForm?.getFormModelVal("serviceChargeCurrencyId");
				const HX_CURRENCY =
          this.$refs.dialogForm?.getFormModelVal("currencyCode");

				Object.assign(sxFind, {
					colItemHide: !(SXF_CURRENCY !== HX_CURRENCY && (SXF_NUM || SXF_NUM === 0)),
					colKey: Math.random() + ""
				});
      }
    },
    currencyInpChange(val, sItem, isCheckedAll) {
      if (sItem.numKey === "verificationMoney") {
        const { remainMoney, poll,isBatch } = this.formConfig.formModel;
        if (!isBatch) {
          // 单笔
          if (isCheckedAll) {
            this.changeAllOff();
            return;
          }
          const RATE_NUM =
            this.$refs.dialogForm?.getFormModelVal("exchangeRate") || 1;
          this.$refs.dialogForm?.setFormModel({
            remainingPayment: RATE_NUM
              ? (remainMoney - val / RATE_NUM).toFixed(4)
              : remainMoney,
          });
        } else {
          // 合并付款
            this.changeAllOff();
        }
      }
    },
		inputChangeEvt(val, sItem) {
			if (sItem.numKey === "serviceCharge") {
				// console.log('==xval, sItem, isCheckedAll', val, sItem)
				const orderFind = this.formConfig.lists[0].fieldList[0].rows[0].cols.find(e => e.id === 'orderId');
				if (!orderFind) return false;
				const showItemConf = {
					colItemHide: !(val || val === 0),
					colKey: Math.random() + ""
				}
				Object.assign(orderFind, showItemConf);
				const SXF_CURRENCY =
          this.$refs.dialogForm?.getFormModelVal("serviceChargeCurrencyId");
				const HX_CURRENCY =
          this.$refs.dialogForm?.getFormModelVal("currencyCode");

				if (SXF_CURRENCY !== HX_CURRENCY) {
					const sxFind = this.formConfig.lists[0].fieldList[0].rows[0].cols.find(e => e.id === 'serviceChargeAccountId');
					Object.assign(sxFind, showItemConf);
				}
      }
		},
    handleFormChange(val) {
      const { remainMoney, poll,isBatch } = this.formConfig.formModel;
      if (!isBatch) {
        // 单笔
        const MONEY_NUM =
          this.$refs.dialogForm?.getFormModelVal("verificationMoney") || 0;
        this.$refs.dialogForm?.setFormModel({
          remainingPayment: val
            ? (remainMoney - MONEY_NUM / val).toFixed(4)
            : remainMoney,
        });
      } else {
        // 合并付款
          this.$refs.dialogForm?.setFormModel({
            remainingPayment: "0.00",
            verificationMoney: (remainMoney * val).toFixed(4),
          });
      }
    },
    changeAllOff() {
      const { remainMoney } = this.formConfig.formModel;
      const MONEY_NUM =
        this.$refs.dialogForm?.getFormModelVal("verificationMoney") || 0;
      this.$refs.dialogForm?.setFormModel({
        remainingPayment: "0.00",
        exchangeRate: (MONEY_NUM / remainMoney).toFixed(10),
      });
    },
    hide(type) {
      this.$refs.customDialog.hide();
    },
    changeWaterBill(e) {
      //水单页面新增水单选项改变时带出数据
      this.$refs.dialogForm?.setFormModel({
        currencyName: `${e.code}[${e.currencyName}]`, //币别名称
        currencyId: e.currencyId,
      });
    },
    getCurrency() {
      querySearchList({
        type: "currency",
        pageNum: 1,
        pageSize: 999,
      }).then((res) => {
        this.unitList = (res.rows || []).map((item) => {
          return {
            label: item.code,
            value: item.id,
          };
        });
      });
    },
    handleUploadSuccess(row, file) {
      //上传成功
      // console.log(this.uploadConfig.fileList);
    },
    getAttachIdList(row) {
      this.attachId=row
      console.log("this.attachId", this.attachId);
    },
  },
};
</script>
<style lang="scss" scoped>
.audit-dialog {
  /deep/ {
    .el-dialog__body {
      padding: 30px 30px 10px 30px;
    }
    .title {
      font-size: 14px;
      color: #515151;
      font-weight: bold;
      line-height: 20px;
    }
    .sub-title {
      font-size: 13px;
      color: #8b8b8b;
      line-height: 20px;
      margin: 5px 0 18px;
    }
    .card-uploader {
      .el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item {
        width: 80px;
        height: 80px;
        line-height: 85px;
        margin: 0 18px 0 0;
      }
    }
    .custom-remark {
      .el-form-item {
        .el-form-item__label {
          margin: 0 0 5px 5px;
        }
      }
      .el-form-item--small .el-form-item__content {
        line-height: 20px;
        min-height: 20px;
      }
    }
  }
  .table-slot-Sxf {
		.input-with-select {
			/deep/ .el-input__inner[type="number"] {
				padding-right: 0;
			}
		}
    /deep/ .el-input-group__append {
      width: 80px;
      .el-select .el-input__inner {
        cursor: pointer;
      }
    }
    /deep/ .el-input.is-disabled {
      .el-input__inner {
        padding: 0 15px;
      }
      .el-input__icon {
        opacity: 1;
        cursor: pointer;
      }
    }
  }
  .table-slot-disabled {
    /deep/ .el-input.is-disabled {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      // .el-input__inner {
      //   border-radius: 4px;
      //   border: 1px solid #dcdfe6;
      // }
			.el-input-group__append {
				border: none;
			}
    }
  }
  .table-slot-HDSY {
    display: flex;
    & > div:first-child {
      margin-right: 10px;
      flex: 1;
    }
  }
  .slot-content-receiptPayment {
    width: 100%;
    background-color: rgba(250, 250, 250, 1);
    padding-left: 5px;
    padding-right: 5px;
    border-color: rgba(215, 215, 215, 1);
    border-width: 1px;
    border-style: solid;
    border-color: rgba(215, 215, 215, 1);
    border-radius: 4px;
  }
  .dialog-form {
    /deep/.bill-left {
      height: 100%;
      padding-right: 40px;
      .margin-bottom-0 {
        margin-bottom: 0;
      }
      .el-col:last-child {
        .el-form-item--small.el-form-item {
          margin-bottom: 0;
        }
      }
    }
    /deep/.bill-right {
      padding-left: 40px;
      border-left: 1px solid #e2e2e2;
      .el-col:last-child {
        .el-form-item--small.el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .content-payNum {
      width: 100%;
      & > span:nth-child(2) {
        font-size: 15px;
        color: #3179ef;
      }
    }
    /deep/.content-mainMoney {
      color: #ff0000;
    }
    .content-verification {
      width: 100%;
      background: rgba(80, 148, 255, 0.05);
      box-shadow: 0px 0px 3px 0px rgba(20, 69, 147, 0.25);
      border-radius: 10px;
      padding-left: 25px;
    }
  }
  .balance-description {
    line-height: 18px;
    color: #63a103;
    padding-top: 7px;
  }
  .all-off-check {
    margin-left: 10px;
    margin-right: 0;
  }
}
</style>
