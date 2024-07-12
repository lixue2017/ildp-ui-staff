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
          :formConfig="{
            ...formConfig,
            lists: config({
              ...formConfig.formModel,
              cwRoleFlow: cwRole
            }),
          }"
          class="dialog-form"
          @handleChange="handleChange"
          v-if="
            $refs.customDialog &&
            $refs.customDialog.dialogVisible &&
            refreshForm
          "
        >
          <template v-for="item in ['currencyId','claimBy']" v-slot:[item]="slotProps">
						<AutoComplete
							:key="item"
							:formModel="slotProps.formModel"
							:fieldItem="{
								...slotProps.fieldItem,
								handle: ()=>changeCollectionAccount(slotProps.formModel,item),
							}"
              :additionalParam="{
                status:item == 'claimBy' ? 0 : undefined
							}"
						/>
					</template>
          <template v-slot:businessCompany="slotProps">
						<AutoComplete
							key="businessCompanyRef"
							:formModel="slotProps.formModel"
							:fieldItem="{
								...slotProps.fieldItem,
								handle: (row)=>changeBusinessCompany(row),
							}"
              :additionalParam="{
                queryType:1
							}"
						/>
          </template>
					<template v-slot:accountId="slotProps">
            <!-- 收款账号 -->
						<AutoComplete
							ref="accountRef"
							:formModel="slotProps.formModel"
							:fieldItem="{
								...slotProps.fieldItem,
                getSearchOptions:(rows)=> changeAccountId(rows,slotProps.formModel.accountId),
								disabled: slotProps.formModel.type == 2 ? !slotProps.formModel.applicant : !slotProps.formModel.claimBy,
							}"
							:additionalParam="{
								currencyId:slotProps.formModel.currencyId,
                clientIdentity: 9, //员工身份
                relationUserId: slotProps.formModel.type == 0 ? slotProps.formModel.claimBy : expenseInit.applicant,
							}"
						/>
						<!-- customerId: slotProps.formModel.type == 2 ? slotProps.formModel.applicant : slotProps.formModel.claimBy, -->
					</template>
          <template v-slot:tableDataLoan="slotProps">
            <CostTable ref="CostTableRef" v-show="billList.length" />
          </template>
          <template v-slot:totalMoney="slotProps">
            <el-input-number
              v-model="slotProps.formModel.totalMoney"
              size="mini"
              :placeholder="slotProps.fieldItem.placeholder"
              :min="0"
              :controls="false"
              v-input-number-limit="{
                value: slotProps.fieldItem ? slotProps.fieldItem.decimal : null,
              }"
              @change="() => handleChange(slotProps.formModel,'totalMoney')"
            ></el-input-number>
          </template>
          <template v-slot:dealingsCompanyName="slotProps">
            <AutoComplete
              ref="dealingsCompanyNameRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem.config,
                handle: (val) =>
                  handleGetOpeningBank(
                    'dealingsCompanyName',
                    slotProps.formModel
                  ),
              }"
              :additionalParam="{
              }"
            />
          </template>
          <template v-slot:bankAccount="slotProps">
            <AutoComplete
              ref="bankAccountRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem.config,
                handle: (val) =>
                  handleGetOpeningBank('bankAccount', slotProps.formModel),
              }"
              :additionalParam="{
                cusIde:(slotProps.formModel.dealingsCompanyName&&slotProps.formModel.dealingsCompanyName.cusIde)||slotProps.formModel.dealingsCompanyName,
              }"
            />
          </template>
          <template v-slot:tableData="slotProps">
            <div class="comFrom-table-title">
              <span class="form-title-1 cost-req">费用明细</span>
              <el-button type="primary" @click="addCost(slotProps.formModel)" style="height: 28px"
                >新增费用</el-button
              >
            </div>
            <div>
              <ComTable
                ref="tableRef"
                :columnConfig="tableConfig.columnConfig"
                :columnData="tableConfig.columnData"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'type'">
                    <el-select
                      size="mini"
                      v-model="slotProps.row.type"
                      style="width: 100%"
                      :clearable="false"
                      @change="calcTotal"
                    >
                      <el-option
                        v-for="selectItem in dictBillType"
                        :key="Number(selectItem.value || 0)"
                        :label="selectItem.nameCn"
                        :value="Number(selectItem.value || 0)"
                      />
                    </el-select>
                  </template>
                  <template v-if="slotProps.prop === 'costName'">
                    <AutoComplete
                      size="mini"
                      :formModel="slotProps.row"
                      :fieldItem="slotProps.column.fieldItem"
                      defaultKey="id"
                    />
                  </template>
                  <template v-if="slotProps.prop === 'currencyName'">
                    <AutoComplete
                      size="mini"
                      :formModel="slotProps.row"
                      :fieldItem="{
                        id: 'currencyId',
                        selectLabelKey: 'currencyCode',
                        size: 'mini',
                        placeholder: '币别',
                        disabled:true,
                        httpRequest: getCurrencyList,
                        isBackAll: true,
                        defaultProp: {
                          value: 'id',
                          label: 'code,nameCn',
                        },
                        handle: (val) => handleCurrency(slotProps.row, val),
                      }"
                    />
                  </template>
                  <template v-if="slotProps.prop === 'money'">
                    <el-input-number
                      v-model="slotProps.row.money"
                      :controls="false"
                      placeholder="金额"
                      v-input-number-limit="2"
                      :precision="2"
                      size="mini"
                      @change="calcTotal"
                    />
                  </template>
                  <template v-if="slotProps.prop === 'remark'">
                    <el-input
                      type="text"
                      size="mini"
                      v-model="slotProps.row.remark"
                      placeholder="备注"
                      maxlength="250"
                    />
                  </template>
                  <template v-if="slotProps.prop === 'operation'">
                    <div class="operation-content">
                      <div class="operation-Btn">
                        <el-button
                          class="operate-icon"
                          size="small"
                          type="text"
                          @click="
                            handleDelete(slotProps.row, slotProps.rowIndex)
                          "
                        >
                          删除
                        </el-button>
                      </div>
                    </div>
                  </template>
                </template>
              </ComTable>
              <div class="grand-total" v-if="subtotalMoney">
                <span class="title">小计：</span>
                <span>{{ subtotalMoney }}</span>
              </div>
              <div
                class="required"
                v-if="noBillList && !tableConfig.columnData.length"
              >
                {{ reqText }}
              </div>
            </div>
          </template>
        </ComForm>
      </template>
    </ComDialog>
  </div>
</template>


<script>
import { mapState } from "vuex";
import {
  config,
  formRules,
  addIndividualVerification,
  handleParams,
} from "./model";
import { getCurrencyList } from "@/api/basicData/index";
import { querySearchList,GETAddressAccountInfoByName,GETAddressAccountInfoByCus } from "@/api/common";
import {
  addExpensePersonal,
  updateExpensePersonal,
  addExpenseApply,
  updateExpenseApply,
  addExpenseBorrow,
  updateExpenseBorrow,
  addExpensePayee,
  updateExpensePayee,
  getSettleExpenseInfo,
  amountInWords,
  postRefundableBalance,
  GETBorrowBill,
  GETExpenseIsInternalPer
} from "@/api/settlementManage/paymentReceived";

import {convertCurrency} from "@/utils/index.js"
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    CostTable: () =>
      import(
        "@/views/settlementManage/paymentReceived/components/payOffsetDialog/components/costTable/index.vue"
      ),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    expenseInit: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      config,
      getCurrencyList,
      confirmClose: false,
      status: "",
      customDialogConfig: {
        width: "1100px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "保存并提交",
            type: "primary",
            handleClick: () => {
              this.status = 1;
							this.noBillList = true;
              this.$refs.dialogForm?.submitForm();
            },
          },
          {
            text: "保存",
            type: "primary",
            handleClick: () => {
              this.status = 0;
              this.noBillList = true;
              this.$refs.dialogForm?.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        isAttachFileId: true,
        httpRequest: this.submitBefore, // 表单提交接口
        successFunction: this.handleFormSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "92px",
        formRules, // 表单校验规则
        uploadFormConfig: {
          type: "picture",
        },
      },
      noBillList: false,
      reqText: "请添加费用明细",
      tableConfig: {
        // getQueryParams: this.getQueryParams,
        // httpRequest: getExpenseList,
        columnConfig: addIndividualVerification.lists,
        columnData: [],
      },
      subtotalMoney: "",
      reqsAdd: {
        0: addExpensePersonal,
        1: addExpenseApply,
        2: addExpenseBorrow,
        3: addExpensePayee,
      },
      reqsUpdate: {
        0: updateExpensePersonal,
        1: updateExpenseApply,
        2: updateExpenseBorrow,
        3: updateExpensePayee,
      },
      refreshForm: true,
      billList:[],
    };
  },
  computed: {
    ...mapState({
      dictBillType: (state) => state.dictionary.dicsData.billType,
      dictRoles: (state) => state.dictionary.dicsData.userRoles || [],
      dictUserRoles: (state) => state.user.userInfo.roles || [],
    }),
    cwRole() {
      // 判断角色是否为财务
      const roleObj = this.dictRoles.find((e) => e.value === "CW") || {};
      const roleArr = roleObj.nameCn?.split(",") || [];
      return this.dictUserRoles.some((e) => roleArr.includes(e.roleKey));
    },
    tableColumnData() {
      return this.tableConfig.columnData.map((e) => ({
        type: e.type,
        currencyId: e.currencyId,
        money: e.money || 0,
      }));
    },
  },
  created() {},
  mounted() {
  },
  methods: {
    async show(row = {}, oType) {
      if (row.id) {
        const {rows}=await GETAddressAccountInfoByCus({id:row.accountId})
        const res = await getSettleExpenseInfo(row.id);
        row = {
          ...res.data,
          dealingsCompanyName:rows&&rows[0].cusIde,
          dealingsCompanyShortName:rows&&rows[0].accountName
        } || {};
        if (oType === "copy") {
          delete row.id;
        }
      }
      this.customDialogConfig.title = `财务报账单(${row.id ? "编辑" : "新增"})`;
      const {
        type,
        flowType,
        borrowMoney = this.expenseInit.borrowMoney,
        billInfoList = [],
        dealingsCompany,
        dealingsCompanyName,
        claimBy,
        claimByName,
        staffPayrollId=undefined,
        accountName=null,
        ...data
      } = row;
      //类型初始化为第一个选项，流程需要判断是否为财务账号和记账主体是否为国内，都满足就默认内部单，有一个不满足就默认付款  ascription 1国内 2国外
      const {ascription}=this.expenseInit
      this.formConfig.formModel = {
        spareMoney: 0,
        ...data,
        ...(row.id?{}:this.expenseInit),//修改取详情接口返回的数据，
        type: `${type || "0"}`,
        // flowType: `${
        //   this.typeConversion(flowType) || (this.cwRole ? "0" : "1")
        // }`,
        flowType:row.id?this.typeConversion(flowType):this.cwRole?ascription==1?'0':'1':'1',
        borrowMoney,
        // dealingsCompany:
        //   type === 3
        //     ? dealingsCompanyName
        //     : dealingsCompany || dealingsCompanyName,
        dealingsCompany,
        dealingsCompanyName,
        claimBy: claimBy || this.expenseInit.applicant,
        claimByName: claimByName || this.expenseInit.applicantName,
        staffPayrollId,
        accountName,
      };
      const tKey =
        this.formConfig.formModel.type + this.formConfig.formModel.flowType;
      this.checkFormRules(tKey);
      this.formConfig.labelWidth = type == 2 ? "128px" : "92px";
    //   this.formConfig.lists = this.getFormConfigLists({
    //     ...this.formConfig.formModel,
    //     haveInSideRule
    // });
    this.$refs.dialogForm?.setFormModel(this.formConfig.formModel);
      this.tableConfig.columnData = (billInfoList || []).map((item) => ({
        ...item,
        id: oType === "copy" ? undefined : item.id,
        currency: `${item.currencyCode}[${item.currencyName}]`,
      }));
      if(type==2){
        this.handleChange(row,'totalMoney')
      }
      this.calcTotal();
      // this.getCurrency(row.id);//有ID也在这里面显示窗口
      if (row.id || oType === "copy") {
        this.$refs.customDialog.show();
      } else {
        // 新增默认币别
        this.getCurrency();
      }
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    submitBefore(params) {
      params = handleParams(params);
      return new Promise((resolve, reject) => {
        // if (params.type === '3' && this.status === 1) {
        // 	this.$message.warning('收款单暂时只支持录入，不可提交')
        // 	return reject();
        // }

        let data = {};
        for (let key in params) {
          params[key] && (data[key] = params[key]);
        }
        const { type, id } = data;
        if (type != 2) { // 借款不要明细
					const billList = this.tableConfig.columnData;
					data.billList = [];
					if (!billList.length) return reject();
					for (let key in billList) {
						const item = billList[key];
						if (
							(!item.type && item.type !== 0) ||
							!item.costId ||
							!item.currencyCode ||
							!item.money
						) {
							this.$message.error("费用明细中类型、费用名称、币种或金额为必填");
							return reject();
						}
						const { type, flowType, currencyId, ...obj } = item;
						data.billList.push({
							...obj,
							type: Number(type),
							flowType: Number(flowType),
							currencyId:
								typeof currencyId === "object" ? currencyId?.id : currencyId,
						});
					}
        }
        if(type==1){
          const {dealingsCompanyName,bankAccount,...obj}=data
          data={
            ...obj,
            // dealingsCompany:id?dealingsCompany:dealingsCompanyName?.customerId||dealingsCompanyName,
            bankAccount:bankAccount?.bankAccount||bankAccount,
          }
        }
        if(type==2){
          data={
            ...data,
            billList:this.billList
          }
        }
        if(type==3){
          const {bankAccount,dealingsCompanyName,...obj}=data
          data={
            ...obj,
            // dealingsCompany:id?dealingsCompany:dealingsCompanyName?.customerId||dealingsCompanyName,
            bankAccount:bankAccount?.bankAccount||bankAccount,
          }
        }
        if (data.attIds) {
          data.attIds = data.attIds.split(",");
        }
        data.status = this.status;
        this.noBillList = false;
        if (id) {
          return this.reqsUpdate[type](data)
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        }
        return this.reqsAdd[type](data)
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    handleFormSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    getFormConfigLists({ type = 0, flowType = 0,WEB_MENETYPE=undefined }) {
      return config({ type, flowType, cwRoleFlow: this.cwRole, WEB_MENETYPE});
    },
    handleChange(row, types) {
      if (["type", "flowType", "borrowMoney", "monthBy"].includes(types)) {
        this._postRefundableBalance();
      }
      if (types === "type" || types === "flowType") {
				this.changeCollectionAccount(row,types); // 先重置后切换模板
        const { currencyId,monthBy,dealingsCompanyName,bankAccount, ...nFormData } =
          this.$refs.dialogForm?.getFormParams();
        const { type, flowType } = nFormData;
        let key = this.typeConversion(type) + this.typeConversion(flowType);
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          ...nFormData,
        };
        if (
          ["1", "2"].includes(this.typeConversion(type)) &&
          this.typeConversion(flowType) === "2"
        ) {
          // 角色不是财务隐藏财务内部单
          const cwType = this.cwRole ? "0" : "1";
          this.formConfig.formModel.flowType = cwType;
          key = this.typeConversion(type) + cwType;
        }
        if (type === "3") {
          // 收款类型切换
          if (["1", "2"].includes(flowType)) {
            this.formConfig.formModel.flowType = "0";
            key = this.typeConversion(type) + "0";
          }
        } else {
          if (flowType === "3") {
            this.formConfig.formModel.flowType = "0";
            key = this.typeConversion(type) + "0";
          }
        }
        if (types == "type") {
          this.calcTotal();
        }
        if(types === "type"&&type==2){
          this.GETBorrowBillFunc(this.$refs.dialogForm?.getFormParams())
        }
        this.refreshForm = false;
        this.checkFormRules(key);
        // this.formConfig.lists = config({ type, cwRoleFlow: this.cwRole }, key);
        this.formConfig.labelWidth = type == 2 ? "128px" : "92px";
        this.$nextTick(() => {
          this.refreshForm = true;
        });
      }  else if (types == "totalMoney") {
        //仅借款-借款金额
        this.GETBorrowBillFunc(row)
        const {totalMoney}=row
        const capitalMoney= convertCurrency(totalMoney)
        this.$refs.dialogForm?.setFormModel({
          amountWords: capitalMoney, // 借款大写
        });
      }else if(types=='currencyId'){
        const {type}=this.$refs.dialogForm?.getFormParams()
        if(type==2){
          this.GETBorrowBillFunc(row)
        }else{
          this.changeBillCurrency({type:'currencyId'})
        }
      }
    },
    GETBorrowBillFunc(row){
      // 借款获取费用明细
      const {currencyId=undefined,totalMoney=undefined}=row
        const params = {
          currencyId,
          totalMoney,
        };
        GETBorrowBill(params).then((res)=>{
          const { rows } = res;
          this.billList=rows
          this.$refs.CostTableRef?.setTableData(this.billList);
        })
    },
    changeBillCurrency(row) {
      //除借款外更换费用明细币别
      const { type } = row;
      let currency = undefined,
        currencyCode = undefined;
      if (type == "currencyId") {
        const { currencyId: id } = this.$refs.dialogForm?.getFormParams();
        currency = id;
        currencyCode=['RMB','USD','GBP','HKD','EUR','VND','SGD'][id-1]
      } else if (type == "type") {
        const { currencyId: id, currencyCode: name } =
          this.formConfig.formModel;
        currency = id;
        currencyCode = name;
      }
      this.tableConfig.columnData = this.tableConfig.columnData.map((e) => {
        return {
          ...e,
          currency,
          currencyCode,
          currencyId:currency
        };
      });
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
    },
    handleCurrency(row, item) {
      row.currencyId = item.id;
      row.currencyCode = item.code || item.nameEn;
			this.calcTotal();
    },
    changeBusinessCompany(row={}) {
      const {id,label,ascription}=row
      let flowType=undefined
      if((this.cwRole&&ascription==1)){
        //财务账号且国内主体
        flowType='0'
      }else{
        flowType='1'
      }
      this.formConfig.formModel={
        ...this.formConfig.formModel,
        businessCompany:id,
        businessCompanyName:label,
        ascription,
        flowType
      }
      this.$refs.dialogForm?.setFormModel(this.formConfig.formModel);
      this.refreshForm = false;
      this.$nextTick(() => {
        this.refreshForm = true;
      });
      // this.$nextTick(() => {
      //   this.$refs.dialogForm?.renewForm();
      // });
    },
		changeCollectionAccount(row={},key=undefined) {
      const {type}=row
      if(type==2&&key=='currencyId'){
        //借款的时候改变币种需要重新获取账单明细
        this.handleChange(row,'currencyId')
      }else if(key=="type"&&['0','1','3'].includes(row)){
        this.changeBillCurrency({type:"type"})
      }else if(type==0&&key=='currencyId'){
        this.changeBillCurrency({type:'currencyId'})
      }
			this.$refs.accountRef?.changeFocusRequest();
		},
    calcTotal() {
      //type 0个人报销 1付款申请 2借款 3收款    0,1,2应付金额为正，应收为负   3相反
      const { type,WEB_MENETYPE } =
        this.$refs.dialogForm?.getFormParams() ||
        this.formConfig.formModel ||
        {};
      const list = this.tableConfig.columnData || [];
			this.subtotalMoney = "";
      if (!list.length) return;
      // currencyCode--币种   money--金额  type--类型
      let moneyArr = [];

      list.forEach((e) => {
        //e.type 0应付  1应收
        if (e.currencyCode && e.money && e.type !== undefined) {
          const curIndex = moneyArr.findIndex(
            (m) => m.currencyCode === e.currencyCode
          );
          if (curIndex > -1) {
            if ((type == 3 && e.type == 1) || (type != 3 && e.type !== 1)) {
              moneyArr[curIndex].money += +e.money;
            } else {
              moneyArr[curIndex].money -= +e.money;
            }
          } else {
            let money;
            if ((type == 3 && e.type == 1) || (type != 3 && e.type !== 1)) {
              money = +e.money;
            } else {
              money = -e.money;
            }
            moneyArr.push({
              type: e.type,
              currencyCode: e.currencyCode,
              money,
            });
          }
        }
      });
      if (WEB_MENETYPE == "monthWage" && moneyArr.length == 1) {
        //仅工资记录，修改明细的金额和币种改变小计，小计改变后同步到发票金额，如果小计结果为负数，发票金额为0,目前只处理单币种，多币种不处理，等产品(huiheng)给出新方案后再修改
        const money = this.toFixedNum(moneyArr[0].money,2);
        this.$refs.dialogForm?.setFormModel({
          invoiceMoney: money,
        });
      }
      this.subtotalMoney = moneyArr
        .map((e) => this.formatMoney(e.money) + e.currencyCode)
        .join(" + ");
    },
    addCost(row) {
      // 默认应付
      const { currencyId = undefined, currencyCode = undefined } = row;
      this.tableConfig.columnData = [
        {
          type: 0,
          currencyId,
          currencyCode,
        },
        ...this.tableConfig.columnData,
      ];
      this.$refs.tableRef.setNewTableData(this.tableConfig.columnData);
    },

    handleDelete(row, index) {
      this.tableConfig.columnData.splice(index, 1);
      this.$refs.tableRef.setNewTableData(this.tableConfig.columnData);
			this.calcTotal();
    },
    checkFormRules(typeKey) {
      this.formConfig.afterMounted = () => {
        if (["20", "21"].includes(typeKey)) {
          // 借款类型-预计还款日期非必填
          // this.$refs.dialogForm?.setFormRules({}, ["latestPaymentDate"]);
        } else {
          // this.$refs.dialogForm?.setFormRules(formRules.latestPaymentDate);
        }
      };
    },

    _postRefundableBalance() {
      // 应退余额
      const { type, flowType, borrowMoney, monthBy, currencyId } =
        this.$refs.dialogForm?.getFormParams() || {};
      if (this.typeConversion(type) !== "0") {
        return;
      }
      const opt = {
        type,
        flowType,
        borrowMoney,
        currencyId,
        monthBy,
        billList: this.tableColumnData,
      };
      postRefundableBalance(opt).then((res) => {
        this.$refs.dialogForm.setFormModel(
          {
            spareMoney: res.data?.spareMoney || 0,
          },
          true,
          "changeAttr"
        );
      });
    },
    getCurrency() {
      // 获取币别-默认人名币
      querySearchList({
        type: "currency",
        pageNum: 1,
        pageSize: 999,
      }).then((res) => {
        let rmbObj={}
          rmbObj = (res.rows || []).find((e) => e.code === "RMB") || {};
          this.formConfig.formModel.currencyId = rmbObj.id;
          this.formConfig.formModel.currencyCode = rmbObj.code;
        this.$refs.customDialog.show();
      });
    },
    changeAccountId(rows=[],val){
      //如果初始化接口返回的数据中不包括原有的收款账号就置空
      const ids=rows.map((e)=>e.id)
      if(!ids.includes(val)){
        this.$refs.accountRef?.changeFocusRequest();
      }
    },
    handleGetOpeningBank(key, row) {
      const { dealingsCompanyName, bankAccount } = row;
      if (key == "dealingsCompanyName") {
        this.$refs.bankAccountRef.changeFocusRequest();
        this.$refs.dialogForm?.setFormModel({
          openingBank:'',
          bankAccount:'',
          dealingsCompanyShortName:dealingsCompanyName.accountName||dealingsCompanyName
        });
      } else if(key == "bankAccount"&&bankAccount) {
        const params = {
          cusIde:dealingsCompanyName&&dealingsCompanyName.cusIde||dealingsCompanyName,
          bankAccount: bankAccount.bankAccount || bankAccount,
        };
        GETAddressAccountInfoByName(params).then((res) => {
          const { accountName=null,openingBank,customerId=-1,id=null } = res.rows[0] || {};
          this.$refs.dialogForm?.setFormModel({
            accountName:accountName?accountName:dealingsCompanyName.accountName||dealingsCompanyName,
            openingBank,
            dealingsCompany:customerId,
            accountId:id
          });
        });
      }
    },
  },
  watch: {
    tableColumnData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this._postRefundableBalance();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.audit-dialog {
  .comFrom-table-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    .cost-req::before {
      content: "*";
      color: #fa7a7a;
      margin-right: 4px;
      font-weight: 400;
    }
  }

  /deep/ {
    .text-disable {
      .el-input__inner {
        background-color: #f9f9f9;
        border-color: #bcbcbc;
        color: #a5a5a5;
        cursor: not-allowed;
        border: 1px solid #bcbcbc;
        border-radius: 4px;
        padding-left: 15px;
      }
    }
    .table-data.el-form-item--small.el-form-item {
      margin-bottom: 0px;
    }
  }
  .grand-total > span {
    padding-left: 0;
  }
  .required {
    color: #fa7a7a;
    font-size: 12px;
  }
}
</style>
