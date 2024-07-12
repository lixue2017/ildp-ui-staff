<template>
  <div class="app-content-container">
    <ComDetailTop
      :title="/*详情*/ `对账单`"
      ref="detailTopRef"
      class="title-sides-margin-none"
      :titConfig="activeTab == '3' ? accountTopConfig : {}"
      :formModel="formConfig.formModel"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{ formData.billNo ? `(${formData.billNo})` : "" }}
        </span>
      </template>
    </ComDetailTop>

    <template v-if="activeTab === '3' && formShow">
      <!-- 详情 -->
      <div class="detail-top-content">
        <StatementInfoDetails
          :processRecords="processRecordCols(formData)"
          :formConfig="{
            ...formDetailsConfig(),
            formModel: formConfig.formModel,
          }"
        />
        <StatementCurrencyDetails :currencyAccountObj="formConfig.formModel">
          <template>
            <AccountInfo
              :fieldItem="{ disable: true }"
              :accountInfoList="formData.accountInfoList || []"
            />
          </template>
        </StatementCurrencyDetails>
      </div>
      <StatementDetails
        :activeTab="activeTab"
        :formData="formData"
        :formConfig="formConfig"
        @detailUploadFn="keepTableList"
      >
        <div class="two-way-bill base-flex-align">
          <div style="margin-right: 30px" v-if="formData.type === 0">
            <el-checkbox
              v-model="formConfig.formModel.bankReceiptState"
              disabled
              :true-label="1"
              >水单认领</el-checkbox
            >
          </div>
          <div v-if="formConfig.formModel.joinBillId">
            <span>双向对账单：</span>
            <span
              class="primary-text-btn"
              @click="handleDetails(formConfig.formModel.joinBillId)"
            >
              {{ formConfig.formModel.joinBillNo }}
            </span>
          </div>
        </div>
      </StatementDetails>
    </template>
    <template v-if="activeTab !== '3'">
      <!-- 新增与编辑 -->
      <ComForm
        class="basic-info"
        ref="basicInfoForm"
        :formConfig="formConfig"
        v-if="formShow"
      >
        <template v-slot:accountInfo="slotProps">
          <AccountInfo
            ref="accountInfoRef"
            :fieldItem="{
              ...slotProps.fieldItem,
              handleCreate: addAccountInfo,
            }"
            :formModel="slotProps.formModel"
            :accountInfoList="formData.accountInfoList"
            @handleSelect="handleAccountSelect"
            :maxLength="slotProps.formModel.type == 1 ? 3 : 1"
            v-if="
              (Object.keys(formData).length && activeTab === '1') ||
              (activeTab !== '1' && formData.accountInfoList)
            "
            :getQueryParams="getQueryParams"
          />
        </template>
        <template v-slot:type="slotProps">
          <el-select
            v-model="slotProps.formModel.type"
            :placeholder="slotProps.fieldItem.placeholder"
            @change="handleChangeType"
          >
            <el-option
              v-for="item in slotProps.dicsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
        <!-- <template v-slot:joinBillNo="slotProps">
					<span
						v-if="slotProps.formModel.joinBillNo"
						class="primary-text-btn"
						@click="handleDetails(slotProps.formModel.joinBillId)"
					>
						{{ slotProps.formModel.joinBillNo }}
					</span>
					<span v-else>--</span>
				</template> -->
      </ComForm>

      <BillTable
        :basicConfig="{ display: activeTab === '3', activeTab }"
        :billFormData="formData"
        :columnList="formData.accountsBillInfoList"
        :formModel="formConfig.formModel"
        @getFriDetail="getFriDetail"
        @handleSave="handleSave"
        @goBack="back"
        v-if="
          activeTab === '1' ||
          (activeTab !== '1' && formData.accountsBillInfoList)
        "
      >
        <!-- <template v-slot:historySlot>
					<BillHistoryTable
						v-if="activeTab === '3' && isShowHistoryTable"
						:historyModel="{
							...formConfig.formModel,
						}"
						:httpRequest="getBankReceiptRecord"
						@getEmptyList="getEmptyList"
					/>
				</template> -->

        <template v-slot:fileSlot>
          <UploadFile
            v-if="formShow"
            :fileData="{
              type: formData.type,
              ...formConfig.formModel,
              isSee: activeTab === '3',
            }"
            @attachIdList="getAttachIdList"
            @seeUploadFn="keepTableList"
          />
          <ComForm
            class="preview-form-image"
            :formConfig="waterBillConf"
            v-if="
              activeTab === '3' &&
              waterBillConf.formModel.picUrl &&
              waterBillConf.formModel.picUrl.length &&
              formShow
            "
          >
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
          </ComForm>
        </template>
      </BillTable>
    </template>

    <template v-if="activeTab === '3' && formShow">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(item, index) in getOperationBtn()">
          <el-button
            v-throttle
            :key="index"
            @click="item.handleClick(formData)"
            >{{ item.text }}</el-button
          >
        </template>
      </div>
    </template>

    <ConfirmDialog ref="confirmDialog" :dictionary="dictionary.dicsData" />
    <RecordDrawer ref="recordRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>
<script>
import {
  addBill,
  getBillDetail,
  exitBill,
  confirmBill,
  submitBill,
  deleteBillDetail,
  recheckBill,
  putBankReceiptState,
  // getBankReceiptRecord,
} from "@/api/settlementManage/statementManage";
import {
  formConfig,
  payFormConfig,
  collectionFormConfig,
  detailsCols,
  processRecordCols,
  accountTopConfig,
} from "./model";
import { waterBillCols } from "@/views/settlementManage/paymentReceived/taskList/editModel.js";
import { addBankInfo } from "@/api/customerManage/customerList.js";
import { mapActions, mapState } from "vuex";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { editInvoiceDialogCols } from "@/views/settlementManage/paymentReceived/invoice/model.js";
import { POSTBillApplyInvoice } from "@/api/settlementManage/paymentReceived.js";
import { customMessageBox } from "@/utils/confirmBox.js";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    BillTable: () => import("./components/BillTable"),
    // BillHistoryTable: () => import("./components/BillTable/historyBill"),
    UploadFile: () => import("./components/UploadFile"),
    StatementDetails: () => import("./components/statementDetails"),
    StatementCurrencyDetails: () =>
      import("./components/statementDetails/currencyList"),
    StatementInfoDetails: () =>
      import("./components/statementDetails/paymentInfo"),
    AccountInfo: () => import("../components/AccountInfo"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    RecordDrawer: () => import("../components/recordDrawer"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    return {
      // getBankReceiptRecord,
      accountTopConfig,
      processRecordCols,
      formConfig: {
        formModel: {
          status: 1,
        },
        httpRequest: this.submitForm, // 表单提交接口
        successFunction: (res) => {
          if (this.activeTab === "1" && res?.data) {
            // 新增后跳转到详情
            this["tagsView/delView"](this.$route).then(() => {
              // 关闭当前页面，防止反复保存
              this.$router.replace({
                path: "/settlementManagement/statementManage/editBillManage",
                query: {
                  id: res.data,
                  activeTab: "3", // 1为新增，2为修改，3为详情
                  backPath: this.$route.query.backPath,
                },
              });
            });
          } else {
            this.$refs.detailTopRef?.comReBack({ isBackRefresh: true });
          }
        }, // 表单提交成功回调
        labelWidth: "100px",
        lists: [],
        formRules: {}, // 表单校验规则
      },
      waterBillConf: {
        // 水单图片
        formModel: {},
        labelWidth: "70px",
        lists: waterBillCols,
      },
      formShow: false,
      formData: {},
      activeTab: "",
      attIds: [],
      footBtnList: [
        {
          text: "水单认领",
          isType: [0, "0"],
          showType: 31,
          handleClick: () => this.handleClaim(),
        },
        {
          text: "取消水单认领",
          isType: [0, "0"],
          showType: 32,
          handleClick: () => this.handleCancelClaim(),
        },
        {
          text: "修改发票号",
          type: "editInvoice",
          showType: 7,
          isJoinBs: [0],
          isType: [0, "0"],
          hasPermission: ["settlementManagement:invoice:numEdit"],
          handleClick: this.handleEditInvoice,
        },
        {
          text: "确 认",
          type: "confirm",
          showType: 0,
          handleClick: (row) => {
            this.handleConfirm("0");
          },
        },
        {
          text: "打 回",
          type: "confirm",
          showType: 0,
          handleClick: (row) => {
            this.handleConfirm("1");
          },
        },
        {
          text: "提 交",
          type: "submit",
          showType: 1,
          handleClick: (row) => {
            this.handleSubmit("1");
          },
        },
        {
          text: "修 改",
          type: "edit",
          showType: 2,
          handleClick: this.handleEdit,
        },
        {
          text: "删 除",
          type: "delete",
          showType: 3,
          handleClick: (row) => {
            this.handleDelete();
          },
        },
        {
          text: "通 过",
          type: "confirm",
          showType: 5,
          handleClick: this.handlePass,
        },
        {
          text: "打 回",
          type: "confirm",
          showType: 6,
          handleClick: (row) => {
            this.handleRepulse(row);
          },
        },
        {
          text: "付款记录",
          showType: 16,
          handleClick: (row) => {
            this.$refs.recordRef?.show(row.id, row.type);
          },
        },
        {
          text: "关 闭",
          type: "close",
          showType: 30,
          handleClick: this.back,
        },
      ],
      // isShowHistoryTable: true,
    };
  },
  computed: {
    // ...mapState(["dictionary"]),
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
      dictionary: (state) => state.dictionary,
    }),
  },
  created() {},
  mounted() {
    const { activeTab, id } = this.$route.query;
    this.activeTab = activeTab;
    if (activeTab === "3") {
      this.formConfig.formRules = {};
    }
    if (id) {
      this.getBillDetail(id);
    }
    // idRows批量生成对账单在子组件中获取调用
    this["dictionary/getDictionary"]("billDictionary");
  },
  methods: {
    ...mapActions(["dictionary/getDictionary", "tagsView/delView"]),
    getBillDetail(id) {
      /** 编辑与详情调用，新增账单初始值为表格返回值 */
      this.formShow = false;
      // this.isShowHistoryTable = true;
      getBillDetail(id).then((res) => {
        const { payType, type, picUrl, ...resData } = res.data;
        if (res.data.serialCode) {
          const sIndex = this.footBtnList.findIndex((s) => s.showType === 16);
          this.footBtnList[sIndex].text = `${["付", "收"][type]}款记录`;
        }
        this.formData = {
          ...res.data,
          accountsBillInfoList: res.data.accountsBillInfoList || [],
          accountInfoList: res.data.accountInfoList || [],
        };
        this.formConfig.formModel = {
          ...resData,
          type: this.typeConversion(type, "string"),
          payType: this.typeConversion(payType),
          accountInfo: this.formData.accountInfoList,
        };
        this.waterBillConf.formModel = {
          picUrl,
        };

        this.getListsOrRules(res.data);
      });
    },

    getListsOrRules(row) {
      //根据状态确定是收款还是付款
      const { type } = row || {}; //0是付款  1是收款
      if (this.activeTab != 3) {
        switch (type) {
          case 0:
          case "0":
            this.formConfig.lists = payFormConfig.editlists;
            this.formConfig.formRules = payFormConfig.formRules;
            break;
          case 1:
          case "1":
            this.formConfig.lists = collectionFormConfig.editlists;
            this.formConfig.formRules = collectionFormConfig.formRules;
            break;
        }
      }
      this.formShow = true;
    },
    handleChangeType(val) {
      const { invoiceMoney, ...nFormData } =
        this.$refs.basicInfoForm?.getFormParams(); //获取最新的表单提交数据
      this.formConfig.formModel = {
        ...this.formConfig.formModel,
        ...nFormData,
      };
      this.$refs.basicInfoForm?.setFormModel({
        invoiceMoney: this.formConfig.formModel.invoiceMoney,
      });
      this.getListsOrRules({ type: val });
    },
    getFriDetail(row) {
      if (this.activeTab === "1") {
        const {
          dealingsCompany,
          dealingsCompanyName,
          businessCompanyName,
          businessCompany,
          billingMainName,
          billingMain,
          settleCycle,
          type,
          currencyId,
        } = row;
        this.formData = {
          type: this.typeConversion(type, "string"),
          dealingsCompany,
          dealingsCompanyName,
          settleType: settleCycle,
          businessCompany: businessCompany || billingMain,
          businessCompanyName: businessCompanyName || billingMainName,
        };
        this.formConfig.formModel = {
          ...this.formData,
          currencyId,
        };
        this.getListsOrRules(row);
      }
    },
    getQueryParams() {
      const { type } = this.$refs.basicInfoForm?.getFormModelVal() || {};
      const { dealingsCompany, businessCompany } = this.formData;
      if (type == 1) {
        // 应收
        return {
          type: 0,
          customerId: businessCompany,
        };
      }
      return {
        customerId: dealingsCompany,
      };
    },
    handleSave(formData) {
      this.selectData = formData;
      this.$refs.basicInfoForm.submitForm();
    },
    handleAccountSelect(list = []) {
      this.$refs.basicInfoForm.setFormModel({
        accountInfo: [...list],
      });
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.basicInfoForm.validateField("accountInfo");
        });
      });
      this.formData.accountInfoList = [...list];
    },
    back() {
      this.$refs.detailTopRef?.comReBack();
    },
    submitForm(formData) {
      if (!this.selectData.rows.length) {
        return new Promise((resolve, reject) => {
          reject();
        });
      }
      const ids = this.selectData.rows.map((e) => e.id);
      const {
        lastPayTime,
        payType,
        accountInfo,
        remark,
        checkNo,
        currencyId,
        type,
        invoiceMoney,
      } = formData;
      const { id, dealingsCompany, settleType, businessCompany } =
        this.formData;
      const { convertBaseMoney, convertHelpMoney, ...totalObj } =
        this.selectData.total || {};

      let errMsg = [];
      if (!accountInfo || !accountInfo.length) {
        errMsg.push("账号信息");
      }
      if ([0, "0"].includes(type) && totalObj.status == 1) {
        // 提交时校验/草稿不用校验
        if (!this.attIds.length) {
          errMsg.push("附件资料");
        }
      }
      if (errMsg.length) {
        this.msgError(`${errMsg.join("、")}不能为空`);
        return new Promise((resolve, reject) => {
          reject();
        });
      }

      const accountIds = accountInfo.map((e) => e.id);

      let params = {
        type,
        dealingsCompany,
        currencyId,
        checkNo,
        settleType,
        businessCompany,
        lastPayTime,
        payType,
        accountInfo: accountIds.join(","),
        remark,
        billIds: ids,
        attIds: this.attIds,
        ...totalObj,
        convertBaseMoney: Math.abs(convertBaseMoney),
        convertHelpMoney: Math.abs(convertHelpMoney),
        invoiceMoney: type == 1 ? undefined : invoiceMoney,
      };
      if (!params.payType) {
        delete params.payType;
      }
      if (id) {
        params.id = id;
        return exitBill(params);
      }
      return addBill(params);
    },
    getAttachIdList(data) {
      this.attIds = data;
    },
    getOperationBtn() {
      const { userId } = this.curUserInfo;
      let { status, serialCode, createId, isJoinBs, type, bankReceiptState } =
        this.formConfig.formModel;
      // status  0草稿   1待对账   2复核中  3:已对账  4已驳回   11待认领   20待核销   30已核销
      const { toReview } = this.$route.query;
      let btnArr = [];
      if (["10", "20"].includes(toReview)) {
        if (toReview === "10" && status !== 1) {
          status = 99;
        }
        if (toReview === "20" && status !== 2) {
          status = 99;
        }
      } else {
        if (![0, 4].includes(status)) {
          // 其他页面进入只有草稿、已驳回状态才能操作
          status = 99;
        }
      }
      switch (status) {
        case 0:
        case 4:
          btnArr = [1, 2, 3];
          break;
        case 1:
          btnArr = [0, 7];
          break;
        case 2:
          btnArr = [5, 6, 7];
          break;
        case 11:
          btnArr = [7];
          break;
        case 20:
          btnArr = [7];
          break;
        case 30:
          btnArr = [7];
          break;
        case 99: //详情页面
          btnArr = [7];
          break;
      }
      if (serialCode) {
        btnArr.push(16);
      }

      if (this.activeTab == "3" && [20, 30].includes(this.formData.status)) {
        if (bankReceiptState === 0) {
          btnArr.push(31);
        }
        if (bankReceiptState === 1) {
          btnArr.push(32);
        }
      }
      const arr = this.footBtnList.filter((e) => {
        const { showType, hasPermission } = e;
        return (
          [...btnArr, 30].includes(showType) &&
          ((hasPermission ? hasBtnPermits(hasPermission) : true) ||
            userId == createId) && //角色权限
          (e.isJoinBs ? e.isJoinBs.includes(isJoinBs) : true) && //0非双向  1双向
          (e.isType ? e.isType.includes(type) : true)
        );
      });
      return arr;
      // return this.footBtnList.filter((e) =>
      //   [...btnArr, 30].includes(e.showType)
      // );
    },
    handleConfirm(status) {
      //账单确认
      const { id, rejectNum, type } = this.formData;

      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "账单审核",
          label: "备注：",
          id: "resultRemark",
          rulesKey: status == 1 ? "resultRemark" : "",
        }),
        formModel: {
          status,
          id,
          rejectNum: rejectNum || 0,
          settleType: [2, 1][type],
        },
        httpRequest: confirmBill,
        successFunction: () => {
          this.keepTableList();
        },
      });
    },
    handleClaim() {
      // 水单认领
      const { id } = this.formData;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "水单认领",
          label: "备注说明：",
          rulesKey: "not_required",
          maxlength: 200,
        }),
        httpRequest: ({ remark }) => {
          return putBankReceiptState({
            bankReceiptState: 1,
            id,
            remark,
          });
        },
        successFunction: () => {
          this.keepTableList();
        },
      });
    },
    handleCancelClaim() {
      // 取消水单认领
      const { id } = this.formData;
      customMessageBox(
        this,
        {
          msgTitle: "水单认领取消之后不可恢复",
          msgTxt1: "",
          msgTxt2: "你还要继续吗？",
          httpMsgRequest: () =>
            putBankReceiptState({
              bankReceiptState: 0,
              id,
            }),
        },
        () => {
          this.keepTableList();
        }
      );
    },
    handleEditInvoice(row) {
      const { invoiceMoney, id, checkNo } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: editInvoiceDialogCols(),
        formModel: {
          id: [id],
          invoiceMoney,
          invoiceNumber: checkNo,
        },
        httpRequest: POSTBillApplyInvoice,
        successFunction: this.keepTableList,
      });
    },
    handleSubmit() {
      //提交，草稿→待对账
      this.comRepeatedRequest(this, submitBill, { id: this.formData.id }).then(
        () => {
          this.$message.success("提交成功");
          this.keepTableList();
        }
      );
    },
    handleDelete() {
      //删除
      this.$refs.confirmDialog.delete().then(() => {
        deleteBillDetail(this.formData.id).then(() => {
          this.$message.success("删除成功");
          this.$refs.detailTopRef?.comReBack({ isBackRefresh: true });
        });
      });
    },
    handleEdit() {
      //修改
      this.$router.push({
        path: "/settlementManagement/statementManage/editBillManageJump",
        query: {
          id: this.formData.id,
          activeTab: "2", // 1为新增，2为修改，3为详情
          backPath: this.$refs.detailTopRef.newPathUrl(),
        },
      });
    },
    keepTableList() {
      const { id } = this.$route.query;
      this.getBillDetail(id);
    },
    handlePass() {
      const { id } = this.$route.query;
      const params = {
        ids: [id],
        status: 0,
      };
      this.comRepeatedRequest(this, recheckBill, params).then(() => {
        this.$message.success("提交成功");
        this.goNextPage();
      });
    },
    goNextPage() {
      //详情通过或打回后页面获取下一个订单的数据
      const { id, pageSign } = this.$route.query;
      if (!pageSign || id == pageSign) {
        this.back();
      } else {
        this.$refs.detailTopRef?.deleteUrlIdList(id);
        setTimeout(() => {
          this.$refs.detailTopRef?.handleClick("next");
        });
      }
      // const { id } = this.$route.query;
      // var newPageSign = [];
      // const pageSign = this.$route.query.pageSign.split(",");
      // if (pageSign.length === 1) {
      //   this.back();
      //   return;
      // }
      // pageSign.map((item, index) => {
      //   if (id == item) {
      //     pageSign.splice(index, 1);
      //     newPageSign = pageSign;
      //     return;
      //   }
      // });
      // this.$route.query.id = newPageSign[0];
      // this.$route.query.pageSign = newPageSign.toString();
      // const newUrl =
      //   this.$route.path +
      //   `?id=${newPageSign[0]}` +
      //   `&path=${this.$route.query.path}` +
      //   `&activeTab=${this.$route.query.activeTab}` +
      //   `&pageSign=${newPageSign.toString()}`;
      // window.history.replaceState("", "", newUrl);
      // this.getBillDetail(newPageSign[0]);
    },
    handleRepulse(row) {
      this.$refs.confirmDialog.handleFormDialog("textareaDialog", {
        formModel: {
          status: 1,
          ids: [row.id],
        },
        httpRequest: recheckBill,
        successFunction: this.goNextPage,
      });
    },
    formDetailsConfig() {
      return {
        labelWidth: "100px",
        lists: detailsCols(this.formData.type),
      };
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getBillDetail(id);
      }
    },
    addAccountInfo(row) {
      const { type, businessCompany, dealingsCompany } = this.formData; //0应付 1应收
      this.$refs.confirmDialog.handleFormDialog("bankAccount", {
        httpRequest: (bankData) => {
          return addBankInfo({
            ...bankData,
            isDefault: bankData.isDefault ? 1 : 0,
            isApplyInvoice: bankData.isApplyInvoice ? 1 : 0,
          });
        },
        successMessage: "提交成功", // 成功提示
        successFunction: () => {
          this.$refs.accountInfoRef.refresh();
        }, // 接口成功回调
        formModel: {
          customerId: [dealingsCompany, businessCompany][type], // 0应付 1应收
          dataStatus: 1,
          isDefault: true,
        },
      });
    },
    handleDetails(id) {
      // this.$router.push({
      // 	path: "/settlementManagement/statementManage/editBillManage",
      // 	query: {
      // 		id,
      // 		activeTab: "3", // 1为新增，2为修改，3为详情
      // 	},
      // });
      this.$route.query.id = id; // 用于更新列表
      this.getBillDetail(id);
    },
    // getEmptyList(bool) {
    //   this.isShowHistoryTable = bool;
    // },
  },
};
</script>
<style lang="scss" scoped>
.app-content-container {
  /deep/ {
    .bill-left {
      height: 100%;
      border-right: 1px solid #e2e2e2;
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
    .bill-right {
      padding-left: 40px;
      .el-col:last-child {
        .el-form-item--small.el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .history-bill-box {
      padding-top: 5px;
    }
  }
  .basic-info {
    margin-top: 15px;
    .content-dealingsCompanyName {
      & > span:nth-child(1) {
        color: rgb(49, 121, 239);
        margin-right: 10px;
      }
    }
    // /deep/.col-8 {
    //   color: rgb(49, 121, 239);
    // }
  }
  .preview-form-image {
    margin-top: 20px;
  }
  .detail-top-content {
    display: flex;
    /deep/ .account-info {
      .care {
        margin-left: 0px;
      }
    }
  }
  .two-way-bill {
    font-weight: 600;
    margin-right: 15px;
  }
}
</style>
