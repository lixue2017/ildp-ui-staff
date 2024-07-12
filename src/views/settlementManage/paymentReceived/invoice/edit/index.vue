<template>
  <div class="apply-invoice-box">
    <ComDetailTop
      title="申请发票"
      ref="detailTopRef"
      class="title-sides-margin-none"
      :config="{}"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{
            formConfig.formModel.serialCode
              ? `(${formConfig.formModel.serialCode})`
              : ""
          }}
        </span>
      </template>
      <template v-slot:info>
        <div class="titleInfo" v-if="formConfig.formModel.dealDate">
          <span>交易日期：{{ formConfig.formModel.dealDate }}</span>
        </div>
      </template>
    </ComDetailTop>

    <ComForm
      v-if="showSearchForm && isInitRes"
      ref="formRef"
      :formConfig="editFormConf()"
      @handleChange="handleFormChange"
      :class="`invoice-form-box${tabsConfig.activeName}`"
    >
      <!-- <template v-slot:slotApplyTit="slotProps">
        <div class="title-txt">
          {{ slotProps.fieldItem.titleTxt }}
        </div>
      </template> -->
      <template
        v-slot:[prop]="slotProps"
        v-for="prop in ['waterBillPayee', 'waterBillPayer']"
      >
        <div class="water-bill-info" :key="prop">
          <div class="title">{{ slotProps.fieldItem.title }}</div>
          <el-tooltip
            popper-class="custom-tooltip"
            effect="light"
            :content="slotProps.formModel.bankReceiptInfo"
            placement="top-end"
            v-if="prop === 'waterBillPayee'"
          >
            <div class="water-bill-money">
              水单金额：<span
                >{{ slotProps.formModel.bankReceiptMoney }}
                {{ slotProps.formModel.bankReceiptCurrencyCode }}</span
              >
            </div>
          </el-tooltip>
          <div
            v-for="item in slotProps.fieldItem.list"
            class="base-flex-align"
            :key="item.id"
          >
            <div class="el-form-item__label">{{ item.label }}</div>
            <TooltipOver
              :content="slotProps.formModel[item.id]"
              :style="{
                maxWidth: 'calc(100% - 105px)',
              }"
            />
            <i
              v-if="item.txtCopy"
              class="txt-copy el-icon-document-copy"
              @click="handleCopyText(slotProps.formModel[item.id])"
            ></i>
          </div>
        </div>
      </template>
      <template v-slot:salesman="slotProps">
        <AutoComplete
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            refreshRequest: refreshRequestRoute,
          }"
          :additionalParam="{
            id: (invoiceRecordList || []).map((e) => e.accountBillId),
            billId: (invoiceRecordList || []).map((e) => e.billId),
          }"
        />
      </template>
      <template v-slot:sellerObj="slotProps">
        <AutoComplete
          ref="saleRef"
          :formModel="slotProps.formModel"
          :fieldItem="slotProps.fieldItem"
          :additionalParam="{
            isApplyInvoice: 1,
            currencyId:
              slotProps.formModel.invoiceCurrencyObj &&
              slotProps.formModel.invoiceCurrencyObj.value,
          }"
        />
      </template>
      <template v-slot:uploadFile>
        <!-- <Attachment
          ref="attachmentRef"
          :fileData="{
            id: arrRouteIds,
            type: 1, //1申请发票  2开票与详情
          }"
          @attachIdList="getAttachId"
        /> -->
        <UploadFiles
          :fileData="{
            id: arrRouteIds,
          }"
          @attachIdList="getAttachId"
        />
      </template>

      <template v-slot:slotTabs>
        <ComTabs class="details-tabs-btn" :tabsConfig="tabsConfig">
          <template v-for="tab in tabsConfig.tabs">
            <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            </el-tab-pane>
          </template>
          <template v-slot:slotTabsRight>
            <!-- <div class="tableTags-info">
              <span
                >分录金额合计：{{
                  toFixedNum(slotProps.formModel.costRMBMoney) || 0
                }}
                RMB</span
              >
            </div> -->
            <div class="tableTags-amount">
              <div class="tableTags-amount-info">
                <template v-for="(item, index) in amountLists">
                  <span :key="index">{{
                    `${item.name}：${formatMoney(item.value)}`
                  }}</span>
                </template>
              </div>
              <div class="tableTags-amount-btn" v-if="isOperation">
                <el-button
                  v-show="[2, '2'].includes(tabsConfig.activeName)"
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
        </ComTabs>
        <div
          v-for="tab in tabsConfig.tabs"
          :key="tab.name"
          v-show="
            tabsConfig.activeName === tab.name &&
            (tabsConfig.activeName == 1 || tabsConfig.activeName == 2)
          "
        >
          <div v-show="tabsConfig.activeName === '1'" class="table-tit">
            分录信息
          </div>
          <div v-show="tabsConfig.activeName === '2'" class="remark-txt">
            <i class="iconfont queshi2" />
            销售方和购买方是中进宝和湖南时，发票汇率使用的是账单创建月份的发票汇率，其他公司使用的是开票时汇率。
          </div>
          <ComTable
            :ref="`tableRef${tab.name}`"
            :columnConfig="tableColsConf(tab.name)"
            :httpRequest="tableConf.httpRequest"
            :isMountedRequest="false"
            :pagination="false"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-for="sItem in ['dutiableService', 'unit']">
                <div :key="sItem" v-if="slotProps.prop === sItem">
                  <el-input
                    size="mini"
                    v-model="slotProps.row[sItem]"
                    maxlength="50"
                  />
                </div>
              </template>

              <template
                v-for="numItem in [
                  'num',
                  'price',
                  'taxMoney',
                  'inTaxMoney',
                  'applyMoney',
                ]"
              >
                <div :key="numItem" v-if="slotProps.prop === numItem">
                  <el-input-number
                    size="mini"
                    v-model="slotProps.row[numItem]"
                    v-input-number-limit="slotProps.column.decimal"
                    :min="getInputMin(numItem, slotProps.row)"
                    :max="
                      slotProps.column.maxNumKey
                        ? slotProps.row[slotProps.column.maxNumKey]
                        : Infinity
                    "
                    placeholder="请输入"
                    :controls="false"
                    @change="() => handleChange(numItem, slotProps.row)"
                  />
                </div>
              </template>

              <template v-if="slotProps.prop === 'operation'">
                <template v-for="(item, index) in tableConf.statusBtnList">
                  <el-button
                    :key="index"
                    size="small"
                    type="text"
                    v-if="
                      item.isTab === tab.name &&
                      item.hideIndex !== invoiceJournalList.length
                    "
                    @click="item.handleClick(slotProps.row, slotProps.rowIndex)"
                    >{{ item.text }}</el-button
                  >
                </template>
              </template>
            </template>
            <template v-slot:customHeader="{ slotProps }">
              <template
                v-if="
                  /invoiceMoney|applyMoneyRMB|applyMoneyInvoice/.test(
                    slotProps.column.prop
                  )
                "
              >
                <div>{{ slotProps.column.labelTop }}</div>
                <div>{{ slotProps.column.labelBtm }}</div>
              </template>
            </template>
          </ComTable>
          <!-- <div class="grand-total" v-show="tabsConfig.activeName === '1'">
        <span class="subtotal"
          >小计(RMB)：{{ toFixedNum(formConfig.formModel.costRMBMoney) || 0 }}
        </span>
        <span>金额大写：{{ formConfig.formModel.bigCostMoney || "" }}</span>
      </div> -->
        </div>
      </template>
    </ComForm>

    <CostAddDrawer ref="addDrawerRef" @handleCheckClick="addTableClick" />
    <ConfirmDialog ref="confirmDlgRef" />

    <div class="order-footer">
      <template v-for="(btn, index) in footerBtn">
        <el-button
          :type="btn.type"
          v-debounce
          v-hasPermi="btn.hasPermission"
          :loading="isBtnLoading"
          @click="btn.handleClick"
          :key="index"
        >
          {{ btn.text }}
        </el-button>
      </template>
    </div>
    <!-- <div class="base-flex-between footer-btn">
      <div>
        <el-button
          v-if="tabsConfig.activeName !== '1'"
          v-debounce
          type="primary"
          @click="addContainerEvt"
          class="add-btn"
        >
          <i class="el-icon-plus"></i>
          添 加
        </el-button>
      </div>
      <div>
        <el-button
          type="primary"
          @click="() => btnSubmitForm(1)"
          v-debounce
          :loading="isBtnLoading"
        >
          保存并提交
        </el-button>
        <el-button
          type="primary"
          @click="() => btnSubmitForm(0)"
          v-debounce
          :loading="isBtnLoading"
        >
          保 存
        </el-button>
        <el-button type="info" @click="reBack"> 取 消 </el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  getJournal,
  getJournalDetails,
  getInvoicingRecord,
  getInvoiceRecordList,
  getInvoiceDrawer,
  getInvoiceSalesman,
  getInvoiceReviewer,
  addInvoice,
  getInvoiceDetails,
  updateInvoice,
  getApplyBankReceipt,
} from "@/api/settlementManage/paymentReceived";
import { addBankInfo } from "@/api/customerManage/customerList.js";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import {
  accumulationFn,
  multiplicationFn,
  subtractFn,
} from "@/utils/instructions";
import { msgBox } from "@/utils/confirmBox.js";
import {
  editFormConfig,
  editFormRules,
  addOreditTableConfig,
  dynamicVerifice,
} from "./model";
import { convertCurrency, duplicateRemoval } from "@/utils/index.js";
import { handleCopyText } from "@/utils/confirmBox.js";
export default {
  name: "EditInvoice",
  mixins: [mixinEditCache],
  data() {
    return {
      formConfig: {
        formModel: {},
        labelWidth: "88px",
        httpRequest: this.handleSave, // 表单提交接口
        successFunction: this.reBack, // 表单提交成功回调
        errorFunction: this.handleError, // 表单提交失败回调
      },
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "基本信息",
            name: "1",
          },
          {
            label: "费用明细",
            name: "2",
          },
          {
            label: "附件信息",
            name: "3",
          },
        ],
      },
      tableConf: {
        httpRequest: () => {},
        statusBtnList: [
          {
            text: "删除",
            isTab: "1",
            hideIndex: 1,
            handleClick: this.handleDelete,
          },
          {
            text: "新增",
            isTab: "1",
            handleClick: this.handleAdd,
          },
          {
            text: "移除",
            isTab: "2",
            handleClick: this.handleRemove,
          },
        ],
      },
      invoiceJournalList: [],
      invoiceRecordList: [],
      numStatus: 0,
      isMixinCreatedMounted: "mounted",
      showSearchForm: false, // 先加载字典词
      isInitRes: false,
      amountLists: [
        {
          name: "分录金额合计(RMB)",
          key: "totalMoney",
          value: 0,
        },
        {
          name: "开票金额合计(RMB)",
          key: "applyMoneyRMB",
          value: 0,
        },
        {
          name: "金额大写",
          key: "applyMoneyInvoice",
          value: "零",
        },
      ],
      footerBtn: [
        {
          text: "保存并提交",
          type: "primary",
          hasPermission: ["settlementManagement:invoice:saveSubmit"],
          handleClick: () => this.btnSubmitForm(1),
        },
        {
          text: "保 存",
          type: "primary",
          handleClick: () => this.btnSubmitForm(0),
        },
        {
          text: "取 消",
          type: "info",
          handleClick: () => this.reBack(),
        },
      ],
      costLists: [], //添加移除后余下的的费用明细
      attachId: [],
      refreshRequestRoute: false,
      handleCopyText,
      isOperation: true,
    };
  },
  methods: {
    // 保存前校验
    btnSubmitForm(status) {
      this.$refs.formRef?.$refs["myForm"].validate((valid) => {
        if (valid) {
          this.numStatus = status;
          this.btnTwoSubmitForm();
        } else {
          if (this.tabsConfig.activeName !== "1") {
            this.msgError("请确认其他页签下是否有必填项未填写完整");
          }
        }
      });
    },
    // 再次校验
    btnTwoSubmitForm() {
      if (!this.invoiceJournalList.length) {
        this.msgError("请添加发票分录");
        return;
      }
      let errArr = [];
      const ruleMsg = {
        dutiableService: "货物或应税劳务名称",
        num: "数量",
        price: "单价",
        unit: "单位",
        taxMoney: "税额",
      };
      this.invoiceJournalList.forEach((e) => {
        for (let key in ruleMsg) {
          if (!e[key] && e[key] !== 0 && !errArr.includes(ruleMsg[key])) {
            errArr.push(ruleMsg[key]);
          }
        }
      });
      if (errArr.length) {
        this.msgError(`请输入发票分录${errArr.join("、")}`);
        return false;
      }

      if (!this.invoiceRecordList.length) {
        this.msgError("请添加相关费用信息");
        return;
      }
      const rule_msg = {
        applyMoney: "本次开票金额",
      };
      this.invoiceRecordList.forEach((e) => {
        for (let key in rule_msg) {
          if (!e[key] && e[key] !== 0 && !errArr.includes(rule_msg[key])) {
            errArr.push(rule_msg[key]);
          }
        }
      });
      if (errArr.length) {
        this.msgError(`请输入相关费用信息${errArr.join("、")}`);
        return false;
      }
      this.$refs.formRef?.submitForm();
    },
    handleSave(formData) {
      const {
        xx_apply_33,
        buyerObj,
        sellerObj,
        acceptObj,
        invoiceCurrencyObj,
        dealDate,
        tempDealingsCompany,
        ...nFormData
      } = formData;
      let opt = {
        ...nFormData,
        status: this.numStatus,
        invoiceCurrencyId: invoiceCurrencyObj.value,
        buyerId: buyerObj.value,
        buyerName: buyerObj.customerShortName,
        sellerId: sellerObj.value,
        sellerName: sellerObj.customerShortName,
        expressAccept: acceptObj.value,
        expressAcceptName: acceptObj.name,
        invoiceJournal: this.invoiceJournalList,
        attachId: this.attachId.join(","),
        dealDate,
        invoiceRecord: this.invoiceRecordList.map((e) => {
          const {
            id,
            applyMoney,
            accountBillId,
            applyMoneyInvoice,
            applyMoneyRMB,
            exchangeRateInvoice,
            exchangeRateRMB,
          } = e;
          return {
            id,
            applyMoney,
            accountBillId,
            applyMoneyInvoice,
            applyMoneyRMB,
            exchangeRateInvoice,
            exchangeRateRMB,
          };
        }),
      };
      if (opt.dealingsCompany && opt.dealingsCompany.toString().includes(",")) {
        // 新增/编辑多个往来单位，保存时传选中购买方的往来单位
        opt.dealingsCompany = buyerObj.customerId || tempDealingsCompany;
      }
      if (opt.id) {
        return updateInvoice(opt);
      }
      return addInvoice(opt);
    },
    handleError(err) {
      if (err.code === 1002) {
        err.data && err.data.type && this.handleWarningBox(err.data.type);
      }
    },
    handleWarningBox(type) {
      let line1 = "";
      let line2 = "";
      let lineArr = "";
      switch (type) {
        case 1:
          line1 =
            "检测到发票抬头与水单抬头信息不一致，无法提交，解决方案如下：";
          line2 = "上传委托书附件";
          break;
        case 2:
          line1 = "检测到水单明细已修改，发票流程已冻结，解决方案如下：";
          line2 = "联系操作员删除发票，重新生成";
          break;
        case 3:
          line1 = "检测到发票币别与水单币别不一致，无法开票，解决方案如下：";
          lineArr = ["1、修改开票明细与已认领水单明细一致", "2、退回款水单"];
          break;
        case 4:
          line1 = "检测到开票明细与已水单明细不一致，无法开票，解决方案如下：";
          lineArr = ["1、修改开票明细与已认领水单明细一致", "2、退回款水单"];
          break;

        default:
          break;
      }
      let html = `
				<div class="base-flex weight-bold margin-bottom-5">
          <i class="el-icon-warning"></i>
          ${line1}
        </div>`;
      if (line2) {
        html += `
				<div class="margin-left-30 text-theme-color">
          ${line2}
        </div>`;
      }
      if (lineArr) {
        lineArr.forEach((text) => {
          html += `<div class="margin-left-30">
						${text}
					</div>`;
        });
      }
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
    addContainerEvt() {
      // 传accountBillId
      const invoiceCurrencyObj =
        this.$refs.formRef?.getFormModelVal("invoiceCurrencyObj");
      this.$refs.addDrawerRef?.show([...this.invoiceRecordList], {
        ...this.formConfig.formModel,
        invoiceCurrencyObj,
      });
    },
    addTableClick(arr) {
      //添加
      const tArr = (arr || []).map((e) => {
        e.isNewData = true;
        return e;
      });
      this.costLists = [...this.costLists, ...tArr];
      this.invoiceRecordList.push(...tArr);
      this.costUpdate(3);
      this.getApplyBankReceiptNew(
        this.invoiceRecordList.map((item) => item.accountBillId)
      );
    },
    handleRemove({}, index) {
      // console.log("index", index);
      this.costLists = this.costLists.filter(
        (e) => this.invoiceRecordList[index].accountBillId != e.accountBillId
      );
      this.invoiceRecordList.splice(index, 1);
      this.costUpdate(4);
      this.getApplyBankReceiptNew(
        this.invoiceRecordList.map((item) => item.accountBillId)
      );
    },
    costUpdate(type) {
      this.refreshRequestRoute = !this.refreshRequestRoute;
      this.setCostData({
        ref: `tableRef${2}`,
        data: this.invoiceRecordList,
        type,
      });
    },
    handleAdd() {
      this.invoiceJournalList.push({
        dutiableService: "",
        num: undefined,
        price: undefined,
        totalMoney: 0,
        unit: "",
        taxMoney: 0,
        inTaxMoney: 0,
      });
      this.$refs[`tableRef${1}`][0].setNewTableData(this.invoiceJournalList);
    },
    getApplyBankReceiptNew(accountBillId = []) {
      const { id, billIds } = this.$route.query;
      const params = {};
      if (accountBillId.length) {
        params.accountBillId = accountBillId;
      } else if (id) {
        params.invoiceId = id;
      } else {
        params.billId = billIds.splice(",");
      }
      getApplyBankReceipt(params).then((res) => {
        this.$refs.formRef?.setFormModel(res.data);
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          ...res.data,
        };
        this.$nextTick(() => {
          this.$refs.formRef?.renewForm();
        });
      });
    },
    handleDelete({}, index) {
      this.invoiceJournalList.splice(index, 1);
      this.$refs[`tableRef${1}`][0].setNewTableData(this.invoiceJournalList);
      this.setBaseData();
    },
    editFormConf() {
      const {
        dealingsCompany,
        businessCompany,
        invoiceMedium,
        invoiceCurrencyObj,
        invoiceType,
        isBind,
        bankReceiptId,
      } = this.formConfig.formModel;
      return {
        ...this.formConfig,
        lists: editFormConfig({
          bankReceiptId,
          isBind: !!isBind,
          dealingsCompany,
          businessCompany,
          invoiceMedium,
          currencyHandle: (curObj) => {
            // console.log("发票币别==", curObj);
            this.$refs.saleRef.changeFocusRequest(); //清空选中的值
            this.$refs.formRef.setFormModel({
              sellerObj: "",
            });
            this.getexchangeRate(curObj);

            const newInvoiceType =
              this.$refs.formRef?.getFormModelVal("invoiceType");
            this.changeFormRules({
              invoiceCurrencyObj: curObj,
              invoiceType: newInvoiceType,
            });
            // setTimeout(() => {
            //   this.getInvoiceEntryMoney();
            // });
          },
          addresseeHandle: (addresseeObj) => {
            // console.log('收件人==', addresseeObj)
            this.$refs.formRef.setFormModel(
              {
                expressAcceptTelephone: addresseeObj.phone || "",
                expressAcceptCountry: addresseeObj.customerName || "",
                expressAcceptAddress: addresseeObj.address || "",
              },
              false,
              "resetFields"
            );
          },
          buyHandle: (buyObj) => {
            // console.log('购买方==', buyObj)
            this.$refs.formRef.setFormModel(
              {
                buyerInvoiceTitle: buyObj.accountName,
                buyerAccountsBank: buyObj.openingBank,
                buyerAccount: buyObj.bankAccount,
                buyerDutyParagraph: buyObj.taxNumber,
                buyerTelephone: buyObj.phone,
                buyerAddress: buyObj.openAddress,
              },
              false,
              "resetFields"
            );
          },
          saleHandle: this.setSaleData,
          handleBuyCreate: this.addBuyBankAccount,
        }),
        formRules: editFormRules({
          invoiceMedium, //发票介质
          invoiceCurrencyObj, //发票币别
          invoiceType, //发票类型
        }),
      };
    },
    addBuyBankAccount() {
      // 购买方选择框下拉新增
      const { dealingsCompany } = this.formConfig.formModel;
      const customerArr = dealingsCompany?.toString().split(",") || [];
      this.$refs.confirmDlgRef.handleFormDialog("bankAccount", {
        httpRequest: (sFormData) => {
          const { isCabinRelease, isDefault, isApplyInvoice, ...nFormModel } =
            sFormData;
          return addBankInfo({
            ...nFormModel,
            isDefault: isDefault ? 1 : 0,
            isApplyInvoice: isApplyInvoice ? 1 : 0,
          });
        },
        successFunction: () => {
          this.$refs.formRef.$refs.buyerObjRef[0]?.querySearchAsync();
        }, // 接口成功回调
        formModel: {
          isDefault: true,
          isApplyInvoice: true,
          dataStatus: 1,
          customerId: Number(customerArr[0]),
        },
        confObj: {
          isSelectCustomer: !!customerArr.length,
          customerIds: dealingsCompany,
        },
      });
    },
    setSaleData(saleObj = {}, saleKey = {}) {
      // console.log('销售方==', saleObj, saleKey)
      this.$refs.formRef.setFormModel(
        {
          ...saleKey,
          sellerInvoiceTitle: saleObj.accountName || "",
          sellerAccountsBank: saleObj.openingBank || "",
          sellerAccount: saleObj.bankAccount || "",
          sellerDutyParagraph: saleObj.taxNumber || "",
          sellerTelephone: saleObj.phone || "",
          sellerAddress: saleObj.openAddress || "",
        },
        false,
        "resetFields"
      );
      setTimeout(() => {
        this.getInvoiceEntryMoney();
      });
    },
    handleChange(key, row) {
      if (!row[key]) {
        row[key] = 0;
      }
      if (["num", "price", "taxMoney"].includes(key)) {
        const { num, price, taxMoney } = row;
        const rTotalMoney = multiplicationFn([num, price]);
        if (key !== "taxMoney") {
          row.totalMoney = rTotalMoney;
          this.setBaseData();
        }
        row.inTaxMoney = subtractFn([rTotalMoney, taxMoney]);
      } else if (key == "applyMoney") {
        //修改费用明细-本次开票金额
        const { value } =
          this.$refs.formRef?.getFormParams().invoiceCurrencyObj;
        this.getexchangeRate({ invoiceCurrencyId: value });
      }
    },
    getInvoiceEntryMoney() {
      if (!this.totalEntryMoney) {
        // 清空
        // this.$refs.formRef?.setFormModel({
        //   costMoney: 0,
        //   costRMBMoney: 0,
        //   bigCostMoney: "零",
        // });
        return;
      }
      const curObj = this.$refs.formRef?.getFormModelVal("invoiceCurrencyObj");
      if (curObj && curObj.value) {
        const seller_obj = this.$refs.formRef?.getFormModelVal("sellerObj");
        const opt = {
          currencyId: curObj.value,
          money: this.totalEntryMoney,
          businessCompany: seller_obj?.value, // 销售方id
          // applyInfo: this.invoiceRecordList.map((e) => ({
          //   applyMoney: e.applyMoney,
          //   accountBillId: e.accountBillId,
          // })),
        };
        //已经不需要后端计算汇总了
        // invoiceAmountInWords(opt).then((res) => {
        //   const { amountInWords, currencyCode, moneyRMB, money } = res.data;
        //   const amountData = {
        //     costMoney: money,
        //     costRMBMoney: moneyRMB,
        //     bigCostMoney: amountInWords,
        //   };
        //   this.formConfig.formModel = {
        //     ...this.formConfig.formModel,
        //     ...amountData,
        //   };
        //   this.$refs.formRef.setFormModel(amountData);
        // });
      }
    },
    handleFormChange(v, k) {
      if (k === "invoiceMedium") {
        this.mediumHandle(v);
      } else if (k == "invoiceType") {
        const newInvoiceCurrencyObj =
          this.$refs.formRef?.getFormModelVal("invoiceCurrencyObj");
        this.changeFormRules({
          invoiceType: v,
          invoiceCurrencyObj: newInvoiceCurrencyObj,
        });
      }
    },
    changeFormRules(row) {
      //发票币别与发票类型
      const { invoiceType, invoiceCurrencyObj } = row;
      let addFormRules = {};
      let removeFormRules = [];
      if (invoiceType == 0 && invoiceCurrencyObj.value == 1) {
        // 增值税普通发票+RMB
        addFormRules = {
          buyerDutyParagraph: dynamicVerifice.buyerDutyParagraph,
        };
        removeFormRules = ["buyerTelephone"];
      } else if (invoiceType == 1 && invoiceCurrencyObj.value == 1) {
        // 增值税专用发票+RMB
        addFormRules = {
          buyerDutyParagraph: dynamicVerifice.buyerDutyParagraph,
          buyerTelephone: dynamicVerifice.buyerTelephone,
        };
      } else if (invoiceCurrencyObj.value != 1) {
        //非RMB
        removeFormRules = ["buyerTelephone", "buyerDutyParagraph"];
      }
      this.$refs.formRef.setFormRules(addFormRules, removeFormRules);
    },
    mediumHandle(val) {
      // console.log('发票介质==', val)
      if (val == 0 || val == 2) {
        this.$refs.formRef.setFormRules(
          {
            customerEmail: dynamicVerifice.customerEmail,
          },
          [
            "expressPaymentMethod",
            "acceptObj",
            "expressAcceptTelephone",
            "expressAcceptCountry",
            "expressAcceptAddress",
          ]
        );
      } else {
        this.$refs.formRef.setFormRules(
          {
            expressPaymentMethod: dynamicVerifice.expressPaymentMethod,
            acceptObj: dynamicVerifice.acceptObj,
            expressAcceptTelephone: dynamicVerifice.expressAcceptTelephone,
            expressAcceptCountry: dynamicVerifice.expressAcceptCountry,
            expressAcceptAddress: dynamicVerifice.expressAcceptAddress,
          },
          ["customerEmail"]
        );
      }
    },

    /** 新增初始值 */
    async _getInvoiceAddList() {
      const { billIds, dealingsCompany, businessCompany } = this.$route.query;
      const billId = billIds.split(",");
      // 默认开票人
      const drawerData =
        (await getInvoiceDrawer({ businessCompany })).data || {};
      // 默认业务员
      const salesmanData =
        (await getInvoiceSalesman({ businessCompany, billId })).data || {};
      // 默认复核人
      const reviewerData =
        (await getInvoiceReviewer({ businessCompany })).data || {};
      const applyBankReceipt =
        (
          await getApplyBankReceipt({
            billId,
          })
        ).data || {};
      this.formConfig.formModel = {
        ...applyBankReceipt,
        dealingsCompany,
        businessCompany,
        statement: billId,
        costRMBMoney: "",
        bigCostMoney: "",
        drawer: drawerData.userId,
        drawerName: drawerData.userName,
        salesman: salesmanData.userId,
        salesmanName: salesmanData.userName,
        reviewer: reviewerData.userId,
        reviewerName: reviewerData.userName,
        invoiceCurrencyObj: {
          value: 1,
          currencyCode: "RMB",
        },
      };
      this.isOperation = !applyBankReceipt.isBind;
      this.isInitRes = true;

      getJournal({ billId }).then((res) => {
        if (res.data) {
          this.invoiceJournalList = [res.data];
          this.$refs[`tableRef${1}`][0].setNewTableData(
            this.invoiceJournalList
          );
          this.setBaseData();
        }
      });
      getInvoicingRecord({ billId, invoiceCurrencyId: 1 }).then((res) => {
        //新增初始化,本次开票金额需要取值：本次最多开票金额
        this.invoiceRecordList = res.rows || [];
        this.setCostData({
          ref: `tableRef${2}`,
          data: this.invoiceRecordList,
          type: 0,
        });
      });
    },
    /** 编辑初始值 */
    async _getInvoiceDetails(id) {
      const resData = (await getInvoiceDetails(id)).data || {};
      const applyBankReceipt =
        (
          await getApplyBankReceipt({
            invoiceId: id,
          })
        ).data || {};
      const {
        expressAccept,
        expressAcceptName,
        buyerId,
        buyerName,
        sellerId,
        sellerName,
        audit,
        invoiceCurrencyId,
        invoiceCurrencyCode,
        // operator,
        // operatorName,
        ...nRes
      } = resData;
      const tempDealingsCompany = nRes.dealingsCompany; // 在多个往来单位之前赋值

      // 费用明细中获取多个往来单位
      const resInvoice = await getInvoiceRecordList({
        invoiceId: [id],
        invoiceCurrencyId,
        isEdit: 1,
      });

      if (resInvoice.rows?.length) {
        const deArr = (resInvoice.rows || []).map(
          (e) => e.dealingsCompany || nRes.dealingsCompany
        );
        nRes.dealingsCompany = duplicateRemoval(deArr).join(",");
      }
      this.formConfig.formModel = {
        ...applyBankReceipt,
        ...nRes,
        tempDealingsCompany, // 编辑时的初始往来单位
        invoiceType: this.typeConversion(nRes.invoiceType),
        invoiceMedium: this.typeConversion(nRes.invoiceMedium),
        expressPaymentMethod: this.typeConversion(nRes.expressPaymentMethod),
        invoiceCurrencyObj: {
          value: invoiceCurrencyId,
          currencyCode: invoiceCurrencyCode,
        },
        acceptObj: {
          value: expressAccept,
          name: expressAcceptName,
        },
        buyerObj: {
          value: buyerId,
          customerShortName: buyerName,
        },
        sellerObj: {
          value: sellerId,
          customerShortName: sellerName,
        },
      };
      this.isOperation = !applyBankReceipt.isBind; // (先回款后开票 && 开票明细与水单明细相同)隐藏明细新增编辑移除
      this.isInitRes = true;

      getJournalDetails({ invoiceId: [id] }).then((res) => {
        this.invoiceJournalList = res.rows || [];
        setTimeout(() => {
          this.$refs[`tableRef${1}`][0].setNewTableData(
            this.invoiceJournalList
          );
          this.setBaseData();
        }, 20);
      });

      setTimeout(() => {
        // 费用列表
        this.invoiceRecordList = resInvoice.rows || [];
        this.setCostData({
          ref: `tableRef${2}`,
          data: this.invoiceRecordList,
          type: 1,
        });
      }, 500);
    },
    getInputMin(key, row) {
      if (key == "applyMoney" && row.surplusMoney != 0) {
        // 编辑发票管理-本次最多开票金额等于0的时候，本次开票金额不能输入负数
        return -Infinity;
      } else if (key == "price") {
        return -Infinity;
      }
      return 0;
    },
    getexchangeRate(curObj) {
      //修改币别获取费用明细最新汇率
      const { invoiceCurrencyId } = curObj;
      const { id, billIds } = this.$route.query;
      const accountBillIdAdd = this.invoiceRecordList.map(
        (e) => e.accountBillId
      );
      const accountBillIdEdit = this.costLists.map((e) => e.accountBillId);
      const originalIds = this.invoiceRecordList
        .map((e) => e.id)
        .filter((e) => e != undefined || e != null);
      let params = {};
      let httpRequest;
      if (id) {
        httpRequest = getInvoiceRecordList;
        params = {
          invoiceId: [id],
          invoiceCurrencyId,
          accountBillId: accountBillIdEdit,
          id: originalIds, //账单绑定的明细
          isEdit: 1,
          // billId: billIds?.split(","),
        };
      } else {
        httpRequest = getInvoicingRecord;
        params = {
          // billId: billIds?.split(","),
          invoiceCurrencyId,
          accountBillId: accountBillIdAdd,
        };
      }
      const sortData = JSON.parse(JSON.stringify(this.invoiceRecordList));
      httpRequest(params).then((res) => {
        this.invoiceRecordList = res.rows || [];
        this.setCostData({
          ref: `tableRef${2}`,
          data: this.invoiceRecordList,
          type: 2,
          sortData,
        });
      });
    },
    setBaseData(row = {}) {
      //对基本信息数据进行操作
      const invoiceJournalList =
        this.$refs[`tableRef${1}`][0].getNewTableData();
      const totalMoney = accumulationFn(
        invoiceJournalList.map((e) => e.totalMoney)
      );
      this.amountLists[0].value = totalMoney;
      this.$refs.formRef?.setFormModel({
        costRMBMoney: totalMoney,
      });
    },
    setCostData(row) {
      //type  0-新增初始化   1-编辑初始化   2修改发票币别/本次开票金额获取最新汇率   3-添加费用明细  4 删除
      const { ref, data, type, sortData } = row;
      let costMoney = 0;
      let applyMoneyRMB = 0;
      data.map((e) => {
        if (
          type == 0 ||
          (type == 1 && e.applyMoney > e.surplusMoney) //会出现后端返回本次最多开票金额为0，但是本次开票金额>0，本次开票金额>本次最多开票金额，导致初始化后续计算开票金额出错的问题
        ) {
          e.applyMoney = e.surplusMoney;
          e.applyMoneyRMB = multiplicationFn([
            e.type == 1 ? e.applyMoney : -e.applyMoney,
            e.exchangeRateRMB,
          ]); //本次开票金额RMB
          e.applyMoneyInvoice = multiplicationFn([
            e.type == 1 ? e.applyMoney : -e.applyMoney,
            e.exchangeRateInvoice,
          ]); //本次开票金额发票币别
        } else if (type == 2) {
          sortData.find((item) => {
            if (e.accountBillId == item.accountBillId) {
              e.applyMoney = item.applyMoney;
              e.applyMoneyRMB = multiplicationFn([
                e.type == 1 ? item.applyMoney : -item.applyMoney,
                e.exchangeRateRMB,
              ]);
              e.applyMoneyInvoice = multiplicationFn([
                e.type == 1 ? item.applyMoney : -item.applyMoney,
                e.exchangeRateInvoice,
              ]);
            }
          });
        } else if (type == 3) {
          e.applyMoney = e.isNewData ? e.surplusMoney : e.applyMoney;
          e.applyMoneyRMB = multiplicationFn([
            e.type == 1 ? e.applyMoney : -e.applyMoney,
            e.exchangeRateRMB,
          ]);
          e.applyMoneyInvoice = multiplicationFn([
            e.type == 1 ? e.applyMoney : -e.applyMoney,
            e.exchangeRateInvoice,
          ]);
          e.isNewData = false;
        } else {
          e.applyMoneyRMB = multiplicationFn([
            e.type == 1 ? e.applyMoney : -e.applyMoney,
            e.exchangeRateRMB,
          ]); //本次开票金额RMB
          e.applyMoneyInvoice = multiplicationFn([
            e.type == 1 ? e.applyMoney : -e.applyMoney,
            e.exchangeRateInvoice,
          ]); //本次开票金额发票币别
        }
        applyMoneyRMB = accumulationFn([applyMoneyRMB, e.applyMoneyRMB]);
        // costMoney += e.applyMoneyInvoice;
        costMoney = accumulationFn([costMoney, e.applyMoneyInvoice]);
        return e;
      });
      this.amountLists[1].value = multiplicationFn([1, applyMoneyRMB], 2); //只有最终结果保留2位小时，之前的计算不保留
      this.amountLists[2].value =
        typeof applyMoneyRMB == "string"
          ? convertCurrency(this.typeConversion(applyMoneyRMB, "number"))
          : convertCurrency(applyMoneyRMB);
      this.$refs.formRef?.setFormModel({
        costMoney: multiplicationFn([1, costMoney], 2),
      });
      this.$refs[ref][0].setNewTableData(data);
    },
    getAttachId(data) {
      this.attachId = data;
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    tableColsConf(tName) {
      return addOreditTableConfig(tName, this.isOperation);
    },
    mixinInitData() {
      this.isInitRes = false;
      const { id } = this.$route.query;
      this.arrRouteIds = id ? [id] : [];
      if (id) {
        // 编辑
        this._getInvoiceDetails(id);
      } else {
        // 新增
        this._getInvoiceAddList();
      }
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
    }),
    totalEntryMoney() {
      return accumulationFn(this.invoiceJournalList.map((e) => e.totalMoney));
    },
  },
  watch: {
    totalEntryMoney(nTotal) {
      // console.log('sum===', nTotal)
      this.getInvoiceEntryMoney();
    },
  },
  created() {
    this["dictionary/getDictionary"]("feeDictionary").then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTabs: () => import("_comp/ComTabs"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    CostAddDrawer: () => import("./costAddDrawer"),
    Attachment: () => import("../components/attachment.vue"),
    UploadFiles: () => import("../components/uploadFiles"),
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.apply-invoice-box {
  padding: 0 20px 14px;
  font-size: 14px;
  color: #1f1f1f;
  background-color: #ffffff;
  margin: 10px 10px 75px 10px;
  min-height: calc(100vh - 150px);

  .details-tabs-btn {
    margin-top: 20px;
    /deep/ .el-tabs__header {
      margin-bottom: 0;
      padding-bottom: 14px;
      border-bottom: 1px solid #e2e2e2;
    }
  }
  .title-txt {
    padding: 5px 0 0 10px;
    font-size: 14px;
    font-weight: 600;
    color: #515151;
  }
  .remark-txt {
    color: #bcbcbc;
    line-height: 20px;
    /* margin-bottom: 6px; */
    padding: 10px 0;
    .iconfont {
      color: #ff813d;
      opacity: 0.8;
    }
  }
  .tableTags-info {
    span {
      line-height: 20px;
      margin-left: 15px;
      color: #5094ff;
    }
  }
  .tableTags-amount {
    width: 100%;
    display: flex;
    align-items: center;
    min-height: 30px;
    justify-content: space-between;
    .tableTags-amount-info {
      margin-left: 70px;
      span {
        &:nth-child(1) {
          margin-left: 30px;
        }
        &:nth-child(2) {
          color: #3179ef;
          margin-left: 30px;
        }
        &:nth-child(3) {
          color: #3179ef;
          margin-left: 30px;
        }
      }
    }
    .tableTags-amount-info {
    }
  }

  .grand-total {
    text-align: left;
    justify-content: flex-start;
    & > span {
      padding-left: 0;
    }
    .subtotal {
      padding-right: 30px;
    }
  }

  .footer-btn {
    padding-top: 15px;
  }
  .table-tit {
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    padding: 10px 0;
  }
  .invoice-form-box1 {
    /deep/ {
      .cols-upload-info {
        display: none;
      }
    }
  }
  .invoice-form-box2 {
    /deep/ {
      .cols-basic-info,
      .cols-upload-info {
        display: none;
      }
    }
  }
  .invoice-form-box3 {
    /deep/ {
      .cols-basic-info {
        display: none;
      }
      .form-column-list {
        flex-direction: column;
        .cols-tabs-info {
          .el-form-item {
            margin-bottom: 0px;
          }
        }
      }
    }
  }
  /deep/ {
    .form-column-list {
      flex-direction: column;
      .cols-tabs-info {
      }
    }
    .invoice-cols-top {
      display: flex;
    }
    .invoice-cols-left {
      max-width: 50%;
      margin-right: 10px;
    }
    .invoice-cols-right {
      max-width: 50%;
      margin-left: 10px;
    }
    .purchaser-cols {
      padding-top: 15px;
      background: hsla(0, 0%, 73.7%, 0.1);
      border-radius: 4px;
      padding-right: 25px;
      padding-bottom: 15px;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    // .nDetails {
    //   .el-form-item--small.el-form-item {
    //     margin-bottom: 10px;
    //   }
    // }
    .el-tabs__nav-scroll {
      padding-bottom: 0 !important;
      &::after {
        display: none;
      }
    }
    .tabs-right-btn {
      left: 200px;
      top: 0px;
    }
    .el-form-item--small.el-form-item.custom-margin {
      margin-bottom: 13px;
    }
  }
  .titleInfo {
    margin-left: 15px;
  }
  .water-bill-info {
    width: calc(100% + 40px);
    position: absolute;
    top: -18px;
    right: -39px;
    z-index: 1;
    padding: 18px 25px 6px;
    background: #f6f9ff;
    box-shadow: 0px 0px 4px 0px #ebebeb;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    overflow: hidden;

    & > div {
      &.title {
        margin-bottom: 6px;
      }
      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .el-form-item__label {
      width: 70px;
      text-align: right;
    }
    .water-bill-money {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 2;
      line-height: 18px;
      padding: 4px 12px;
      color: #ffff;
      background: rgba(102, 165, 255, 0.7);
      border-radius: 0px 0px 0px 12px;
      cursor: pointer;

      span {
        font-weight: bold;
      }
    }
  }
}
</style>
