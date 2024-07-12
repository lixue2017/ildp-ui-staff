<template>
  <div class="apply-invoice-box">
    <ComDetailTop
      :title="`${pageType === 'invoicing' ? '开票' : '发票详情'}`"
      :config="pageType === 'invoicing' ? invoicingTabConfig : tabConfig"
      ref="detailTopRef"
      :formModel="formConfig.formModel"
      @handleClick="handleTopClick"
      class="title-sides-margin-none"
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
        <span
          class="subtitle"
          v-if="
            pageType === 'invoicing' && formConfig.formModel.isRateChange == 1
          "
        >
          <i class="iconfont queshi2" />
          跨月发票汇率变化对金额产生影响，请驳回修正后再提交。
        </span>
        <span v-if="formConfig.formModel.dealDate"
          >交易日期：{{ formConfig.formModel.dealDate }}</span
        >
      </template>
    </ComDetailTop>
    <HeadCard
      :formModel="formConfig.formModel"
      :formConfig="cardConfig"
      v-if="pageType !== 'invoicing'"
    />
    <ComForm
      v-if="showSearchForm && isInitRes"
      ref="formRef"
      :formConfig="editFormConf()"
      :class="`invoice-form-box${tabsConfig.activeName}`"
    >
      <!-- <template v-slot:costMoney="slotProps">
        <div>
          <span>{{ slotProps.formModel.costMoney || "--" }}</span>
          <span>{{ slotProps.formModel.invoiceCurrencyCode || "" }}</span>
        </div>
      </template> -->

      <!-- <template
        v-if="formConfig.formModel.invoiceCurrencyCode !== 'RMB'"
        v-slot:costRMBMoneyLabel="slotProps"
      >
        {{ slotProps.fieldItem.slotLabel }}
      </template>
      <template
        v-if="formConfig.formModel.invoiceCurrencyCode !== 'RMB'"
        v-slot:costRMBMoney="slotProps"
      >
        {{ slotProps.formModel.costRMBMoney || "--" }}RMB
      </template> -->

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
      <template v-slot:slotTabs>
        <ComTabs class="details-tabs-btn" :tabsConfig="tabsConfig">
          <template v-for="tab in tabsConfig.tabs">
            <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            </el-tab-pane>
          </template>
          <template v-slot:slotTabsRight>
            <!-- <div class="tableTags-info">
							<span
								>分录金额合计：{{ toFixedNum(slotProps.formModel.costRMBMoney) || 0 }} RMB</span
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
            </div>
          </template>
        </ComTabs>
        <div
          v-for="tab in tabsConfig.tabs"
          :key="tab.name"
          v-show="
            tabsConfig.activeName === tab.name &&
            (tabsConfig.activeName == 1 ||
              tabsConfig.activeName == 2 ||
              tabsConfig.activeName == 4)
          "
          :style="tabsConfig.activeName == 4 && 'margin-top: 20px;'"
        >
          <div v-show="tabsConfig.activeName === '1'" class="table-tit">
            分录信息
          </div>
          <div v-show="tabsConfig.activeName === '2'" class="base-flex-between">
            <div class="remark-txt">
              <i class="iconfont queshi2" />
              销售方和购买方是中进宝和湖南时，发票汇率使用的是账单创建月份的发票汇率，其他公司使用的是开票时汇率。
            </div>
            <el-button
              v-debounce
              type="primary"
              @click="handleExport"
              :loading="is_temp_throttle"
              v-if="pageType !== 'invoicing'"
            >
              导出明细
            </el-button>
          </div>
          <ComTable
            :ref="`tableRef${tab.name}`"
            :columnConfig="tableColsConf(tab.name)"
            :httpRequest="tableConf.httpRequest"
            :getQueryParams="getTableQueryParams"
            :isMountedRequest="false"
            :pagination="false"
          >
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
          >小计(RMB)：{{ toFixedNum(formConfig.formModel.costRMBMoney) }}
        </span>
        <span>金额大写：{{ formConfig.formModel.bigCostMoney || "" }}</span>
      </div> -->
          <div class="grand-total" v-show="tabsConfig.activeName === '2'">
            <div class="cost-total">
              <template v-for="(mItem, mIndex) in subtotalMoney">
                <div class="money-item" :key="mIndex">
                  <span class="title">{{ mItem.label }}</span>
                  <template v-for="(cItem, key, index) in mItem.moneyList">
                    <span :key="key">
                      {{ index == 0 ? `${cItem}${key}` : `+${cItem}${key}` }}
                    </span>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:uploadFile>
        <Attachment
          :fileData="{
            id: arrRouteIds,
            type: 2,
          }"
        />
      </template>
    </ComForm>

    <ConfirmDialog ref="confirmDlgRef" />

    <div class="base-flex-between footer-btn" v-if="pageType === 'invoicing'">
      <div class="order-footer">
        <el-button
          type="primary"
          @click="btnSubmitForm"
          v-debounce
          :loading="isBtnLoading"
          size="small"
        >
          保 存
        </el-button>
        <el-button @click="() => reBack({ isBackTip: true })" size="small">
          取 消
        </el-button>
      </div>
    </div>
    <template v-else>
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <!-- <template v-for="(btn, index) in footBtn">
          <el-button
            v-if="
              (btn.isAllBtn ||
              btn.btnStatus.includes(formConfig.formModel.status))&&
              (btn.isCreatedUser ? curUserInfo.userId==formConfig.formModel.taskCreateBy:true)
            "
            :type="btn.type"
            v-hasPermi="btn.hasPermission"
            @click="btn.handleClick"
            :key="index"
          >
            {{ btn.text }}
          </el-button>
        </template> -->
        <template v-for="(btn, index) in getFootBtn()">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { accumulationFn, subtractFn } from "@/utils/instructions";
import { mapActions, mapState } from "vuex";
import {
  postInvoicingVoid,
  getJournalDetails,
  getInvoiceRecordList,
  invoiceApplyDetails,
  postInvoiceCheck,
  setInvoiceApply,
  postInvoicingReject,
  deleteInvoiceList,
  getInvoiceOperatorInfo,
  POSTMaintainInvoice,
  getApplyBankReceipt,
  exportInvoiceCost,
} from "@/api/settlementManage/paymentReceived";
import {
  editFormConfig,
  detailTableConfig,
  editFormRules,
  cardConfig,
} from "@/views/settlementManage/paymentReceived/invoice/edit/model";
import { msgTipBox } from "@/utils/confirmBox.js";
import { editInvoiceDialogCols } from "@/views/settlementManage/paymentReceived/invoice/model.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  props: {
    pageType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      cardConfig,
      tabConfig: {
        columnConfig: [
          // 标题右侧label，数据取值formModel
          {
            label: "创建人",
            prop: "createBy",
          },
          {
            label: "创建时间",
            prop: "createTime",
          },
        ],
        rightBtn: [
          // 右侧按钮集合
          {
            icon: "el-icon-arrow-left",
            text: "上一条",
            iconPosition: "left",
            type: "pre",
          },
          {
            icon: "el-icon-arrow-right el-icon--right",
            text: "下一条",
            type: "next",
          },
          {
            icon: "iconfont icon-fanhui",
            text: "返回",
            type: "back",
            className: "back",
          },
        ],
      },
      invoicingTabConfig: {
        columnConfig: [
          // 标题右侧label，数据取值formModel
          {
            label: "创建人",
            prop: "createBy",
          },
          {
            label: "提交时间",
            prop: "checkTime",
          },
        ],
      },
      formConfig: {
        formModel: {},
        labelWidth: "80px",
        httpRequest: this.handleSave, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
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
          {
            label: "操作记录",
            name: "4",
          },
        ],
      },
      tableConf: {
        httpRequest: () => {},
      },
      tempList1: [],
      tempList2: [],
      footBtn: [
        {
          text: "提交",
          btnStatus: [0, 3],
          hasPermission: ["settlementManagement:invoice:saveSubmit"],
          handleClick: this.handleSubmit,
        },
        {
          text: "修改",
          btnStatus: [0, 3],
          handleClick: this.handleEdit,
        },
        {
          text: "删除",
          btnStatus: [0, 3],
          handleClick: this.handleDelete,
        },
        {
          text: "驳回",
          btnStatus: [1],
          handleClick: this.handleReject,
          hasPermission: ["settlementManagement:invoice:reject"],
        },
        {
          text: "开票",
          btnStatus: [1],
          handleClick: this.handleInvoicing,
          hasPermission: ["settlementManagement:invoice:openInvoice"],
        },
        {
          text: "修改发票号",
          btnStatus: [2],
          handleClick: this.handleEditInvoice,
          hasPermission: ["settlementManagement:invoice:numEdit"],
        },
        {
          text: "作废",
          btnStatus: [2],
          handleClick: this.handleVoid,
          hasPermission: ["settlementManagement:invoice:cancel"],
        },
        {
          text: "关闭",
          isAllBtn: true,
          handleClick: this.reBack,
        },
      ],
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
      subtotalMoney: [],
      showSearchForm: false, // 先加载字典词
      isInitRes: true,
      arrRouteIds: [],
      is_temp_throttle: false,
    };
  },
  methods: {
    // 开票保存
    btnSubmitForm() {
      this.$refs.formRef?.$refs["myForm"].validate((valid) => {
        if (valid) {
          const msg = "开票之后，开票信息不可修改，你还要继续吗？";
          const title = "请确定开票信息正确无误";
          msgTipBox(this, { title, msg }, () => {
            this.$refs.formRef?.submitForm();
          });
        } else {
          if (this.tabsConfig.activeName !== "1") {
            this.msgError("请确认其他页签下是否有必填项未填写完整");
          }
        }
      });
    },
    handleSave(formData) {
      const { idArr } = this.formConfig.formModel;
      const {
        invoiceCode,
        invoiceNumber,
        drawer,
        reviewer,
        // expressCompany,
        // expressOrder,
        sellerRemark,
      } = formData;
      const opt = {
        id: idArr,
        invoiceCode,
        invoiceNumber,
        drawer,
        reviewer,
        // expressCompany,
        // expressOrder,
        remark: sellerRemark,
      };
      return setInvoiceApply(opt);
    },
    handleSuccess() {
      this.msgSuccess("开票成功");
      this.reBack();
    },

    handleReject() {
      const { id } = this.formConfig.formModel;
      this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
        confObj: {
          title: "确定要驳回开票申请？",
        },
        formModel: {},
        httpRequest: ({ remark }) => {
          const opt = {
            id,
            remark,
          };
          return postInvoicingReject(opt);
        },
        successFunction: this.reBack,
      });
    },
    handleVoid() {
      const { id, serialCode } = this.formConfig.formModel;
      this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
        confObj: {
          title: `确定要作废发票${serialCode}？`,
          label: "作废说明：",
          message: "请输入作废说明",
        },
        formModel: {},
        httpRequest: ({ remark }) => {
          const opt = {
            id,
            remark,
          };
          return postInvoicingVoid(opt);
        },
        successFunction: this.reBack,
      });
    },
    handleInvoicing() {
      const { id } = this.formConfig.formModel;
      this.$router.replace({
        path: "/settlementManagement/invoice/invoicing",
        query: {
          id,
          backPath: this.$refs.detailTopRef.newPathUrl(),
        },
      });
    },
    handleEdit() {
      const { id } = this.formConfig.formModel;
      this.$router.push({
        path: "/settlementManagement/invoice/editInvoice",
        query: {
          id,
          backPath: this.$refs.detailTopRef.newPathUrl(),
        },
      });
    },
    handleSubmit() {
      const { id } = this.formConfig.formModel;
      postInvoiceCheck({ id }).then(() => {
        this.msgSuccess("提交成功");
        this.reBack();
      });
    },
    handleDelete() {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      msgTipBox(this, { title, msg }, () => {
        const { id } = this.formConfig.formModel;
        deleteInvoiceList(id).then(() => {
          this.msgSuccess("删除成功");
          this.reBack();
        });
      });
    },

    editFormConf() {
      const { pageType } = this;
      const { invoiceMedium, isBind, bankReceiptId } =
        this.formConfig.formModel;
      return {
        ...this.formConfig,
        className: pageType ? "" : "detail-see-form",
        formRules: pageType
          ? editFormRules({
              invoiceMedium,
              pageType,
            })
          : {},
        lists: editFormConfig({
          isBind: !!isBind,
          bankReceiptId,
          pageType, // 开票模板
          invoiceMedium, // 判断电子与纸质发票
          isDetails: true, // 详情模板
        }),
      };
    },
    _getInvoiceDetails() {
      this.isInitRes = false;
      const { id, ids } = this.$route.query;
      const idArr = id ? [id] : ids.split(",");
      this.arrRouteIds = idArr;
      Promise.all([
        invoiceApplyDetails({ id: idArr }),
        getApplyBankReceipt({ invoiceId: id }),
      ]).then(([applyDetails, applyBankReceipt]) => {
        const nRes = applyDetails.data || {};
        const { invoiceCurrencyId, costRMBMoney, bigCostMoney } =
          applyDetails.data;
        const {dealDate}=applyBankReceipt.data||{}
        this.formConfig.formModel = {
          ...applyBankReceipt.data,
          ...nRes,
          idArr,
          invoiceType: this.typeConversion(nRes.invoiceType),
          invoiceMedium: this.typeConversion(nRes.invoiceMedium),
          expressPaymentMethod: this.typeConversion(nRes.expressPaymentMethod),
          dealDate
        };
        this.amountLists[1].value = costRMBMoney;
        this.amountLists[2].value = bigCostMoney;
        getJournalDetails({ invoiceId: idArr }).then((res) => {
          //获取发票分录
          let totalMoney = 0;
          this.tempList1 = (res.rows || []).map((e) => {
            totalMoney += e.totalMoney;
            return e;
          });
          this.amountLists[0].value = totalMoney;
          this.$refs[`tableRef${1}`][0].setNewTableData(this.tempList1);
        });

        getInvoiceRecordList({ invoiceId: idArr, invoiceCurrencyId }).then(
          (res) => {
            //获取相关信息
            let applyMoneyRMB = 0;
            this.tempList2 = (res.rows || []).map((e) => {
              e.applyMoneyRMB = e.applyMoney * e.exchangeRateRMB;
              e.applyMoneyInvoice = e.applyMoney * e.exchangeRateInvoice;
              applyMoneyRMB += e.applyMoneyRMB;
              return e;
            });
            this.getCostTotal(res.rows || []);
            this.$refs[`tableRef${2}`][0].setNewTableData(this.tempList2);
          }
        );
        getInvoiceOperatorInfo({ id }).then((res) => {
          //获取操作记录
          this.$refs[`tableRef${4}`][0].setNewTableData(res.rows);
        });

        this.isInitRes = true;
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this._getInvoiceDetails();
      }
    },
    reBack(backObj) {
      this.$refs.detailTopRef?.comReBack(backObj);
    },
    tableColsConf(tName) {
      return detailTableConfig(tName);
    },
    getTableQueryParams() {
      return {};
    },
    handleEditInvoice(row) {
      const { invoiceNumber, id } = this.formConfig.formModel;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: editInvoiceDialogCols({ menuType: "Invoice" }),
        formModel: {
          id: [id],
          invoiceNumber,
        },
        httpRequest: POSTMaintainInvoice,
        successFunction: this._getInvoiceDetails,
      });
    },
    getFootBtn() {
      const { status, taskCreateBy } = this.formConfig.formModel;
      const { userId } = this.curUserInfo;
      const arr = this.footBtn.filter((e) => {
        return (
          ((e.hasPermission ? hasBtnPermits(e.hasPermission) : true) ||
            taskCreateBy == userId) &&
          (e.isAllBtn || e.btnStatus.includes(status))
        );
      });
      //与列表保持一致，列表就是根据条件判断后，再在comtable组件里判断v-hasPermi，最后再决定展示的内容
      const list = arr.filter((e) => {
        return e.hasPermission ? hasBtnPermits(e.hasPermission) : true;
      });
      return list;
    },
    getCostTotal(rows = []) {
      const money1 = this.getMultiCurrency(rows, {
        currencyKey: "currencyCode",
        moneyKey: "totalMoney",
      });
      const money2 = this.getMultiCurrency(rows, {
        currencyKey: "currencyCode",
        moneyKey: "invoiceMoney",
      });
      const money3 = this.getMultiCurrency(rows, {
        currencyKey: "currencyCode",
        moneyKey: "surplusMoney",
      });
      this.subtotalMoney = [
        {
          label: "金额小计:",
          moneyList: money1,
        },
        {
          label: "已开发票金额:",
          moneyList: money2,
        },
        {
          label: "剩余开票金额:",
          moneyList: money3,
        },
      ];
    },
    getMultiCurrency(rows = [], params) {
      const { currencyKey, moneyKey } = params;
      let moneyObj = {};
      rows.map((e) => {
        const { type } = e;
        if (!moneyObj[e[currencyKey]]) {
          if (type == 1) {
            moneyObj[e[currencyKey]] = e[moneyKey];
          } else {
            moneyObj[e[currencyKey]] = -e[moneyKey];
          }
        } else {
          if (type == 1) {
            moneyObj[e[currencyKey]] = accumulationFn(
              [moneyObj[e[currencyKey]], e[moneyKey]],
              2
            );
          } else {
            moneyObj[e[currencyKey]] = subtractFn(
              [moneyObj[e[currencyKey]], e[moneyKey]],
              2
            );
          }
        }
      });
      // console.log(Object.entries(moneyObj))
      return moneyObj;
    },
    handleExport() {
      const { id, invoiceCurrencyId } = this.formConfig.formModel;
      const params = {
        invoiceId: [id],
        invoiceCurrencyId,
      };
      comFileDownload(this, exportInvoiceCost, params);
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  created() {
    this["dictionary/getDictionary"]("feeDictionary").then(() => {
      this.showSearchForm = true;
    });
  },
  mounted() {
    if (this.pageType !== "invoicing") {
      this._getInvoiceDetails();
    }
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTabs: () => import("_comp/ComTabs"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ConfirmDialog: () => import("@/views/components/ConfirmDialog"), // 审核弹窗
    HeadCard: () => import("./headCard"),
    Attachment: () => import("./attachment.vue"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
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
  margin: 10px 10px 70px 10px;
  min-height: calc(100vh - 150px);
  /deep/ {
    .applyMoneyClass {
      font-weight: bold;
    }
    .detail-see-form {
      .upload-title {
        margin-top: 0;
      }
    }
  }
  .subtitle {
    color: red;
    i {
      color: #ff813d;
    }
  }

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
      margin-left: 170px;
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
    .cost-total {
      display: flex;

      .money-item {
        padding-right: 20px;
      }
      .title {
        width: 52px;
      }
    }
  }
  .footer-btn {
    padding-top: 15px;
  }
  .table-tit {
    // color: #5094ff;
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    // background: hsla(0, 0%, 73.7%, 0.1);
    padding: 10px 0;
    // margin-bottom: 10px;
  }
  // &.invoicing-details {
  //   .details-tabs-btn {
  //     /deep/ .el-tabs__header {
  //       margin-bottom: 10px;
  //     }
  //   }
  //   .table-tit {
  //     margin: 10px 0;
  //   }
  // }
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
    }
  }
  .invoice-form-box4 {
    /deep/ {
      .cols-basic-info,
      .cols-upload-info {
        display: none;
      }
    }
  }
  /deep/ {
    .form-column-list {
      flex-direction: column;
    }
    .invoice-cols-top {
      display: flex;
    }
    .invoice-cols-left {
      max-width: 50%;
      margin-right: 10px;
      flex: 1;
    }
    .invoice-cols-right {
      max-width: 50%;
      margin-left: 10px;
      flex: 1;
    }
    .purchaser-cols {
      padding-top: 10px;
      background: hsla(0, 0%, 73.7%, 0.1);
      border-radius: 4px;
      padding-right: 25px;
      padding-bottom: 10px;
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-top: 15px;
    }
    .nDetails {
      .el-form-item--small.el-form-item {
        margin-bottom: 0px;
      }
    }
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
  }
  .water-bill-info {
    width: calc(100% + 50px);
    position: absolute;
    top: -14px;
    right: -39px;
    z-index: 1;
    padding: 12px 21px 2px;
    background: #f6f9ff;
    box-shadow: 0px 0px 4px 0px #ebebeb;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    overflow: hidden;

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
