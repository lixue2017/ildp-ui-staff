<template>
  <div class="detail-table">
    <!-- <ComForm class="billForm" :formConfig="formConfig"></ComForm> -->
    <div :class="['title', 'base-flex-between', title ? '' : 'margin-tit']">
      <div class="title-left">{{ title || "" }}</div>
      <div class="title-right">
        <div
          v-for="(btnItem, i) in nBtnArr()"
          :key="i"
          class="right-button"
          :class="btnItem.className"
        >
          <template v-if="btnItem.btnType === 'btnTemp'">
            <el-divider direction="vertical"></el-divider>
            <el-checkbox v-model="isBatchBillChecked">批量</el-checkbox>
          </template>
          <el-button
            size="small"
            type="primary"
            :disabled="
              btnItem.isDisable &&
              ((isBatchBillChecked
                ? btnItem.btnType !== 'btnTemp'
                : btnItem.btnType === 'btnTemp') ||
                !selectionRows.length)
            "
            v-if="!btnItem.isShow || addBtnShow"
            :plain="btnItem.plain"
            round
            @click="btnItem.handleBtnClick"
          >
            {{ btnItem.text }}
          </el-button>
        </div>
        <ComColumnConf
          :tableCols="tableAllMixinConfig(tabsConfig.activeName)"
          :tName="tabsConfig.activeName"
          :columnConfObj="{ btnRound: true }"
          @setColumnConf="setColumnMixinConf"
        />
      </div>
    </div>
    <div class="bill-dis-grid" v-if="billInfoList && billInfoList.length">
      <div v-if="billInfoTotalList.length" class="bill-item-box">
        <template v-for="(bItem, bIdx) in billInfoTotalList">
          <p class="conversion-txt1" :key="bIdx">{{ bItem.label }}：</p>
          <p class="conversion-txt2" :key="`${bIdx}_2`">
            {{ formatMoney(bItem.value, 4) }}
          </p>
        </template>
      </div>
      <div
        v-for="(bItem, bIdx) in billInfoList"
        :key="bIdx"
        class="bill-item-box"
      >
        <template>
          <p class="bill-item-txt1">{{ bItem.currency }}</p>
          <p class="bill-item-txt2">
            应收：<span>{{ formatMoney(bItem.paymentMoney, 2) }}</span>
          </p>
          <p class="bill-item-txt2">
            应付：<span>{{ formatMoney(bItem.payeeMoney, 2) }}</span>
          </p>
          <p class="bill-item-txt2">
            利润：<span>{{ formatMoney(bItem.profitMoney, 2) }}</span>
          </p>
        </template>
      </div>
    </div>
    <!-- :columnConfig="tableConfig.columnConfig" -->
    <ComTable
      v-if="mixinShowTable"
      ref="tableConfig"
      :tableHeight="tableHeight()"
      :columnConfig="tableMixinConfig(tabsConfig.activeName)"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="() => getDefaultQueryParams()"
      @onSelectionChange="onSelectionChange"
      :selectionRow="selectionRowEvt"
      :selectionTableRow="[...selectionRows]"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'type'">
          <template v-if="!slotProps.row.isUpdate">
            <span
              :style="{
                color: slotProps.dicsList && slotProps.dicsList.color,
              }"
              >{{ slotProps.dicsList.nameCn }}</span
            >
          </template>
          <template v-else>
            <el-select
              size="mini"
              v-model="slotProps.row.type"
              style="width: 100%"
              @change="(e) => typeChange(e, slotProps.row)"
              :clearable="false"
            >
              <el-option
                v-for="selectItem in dictionary.dicsData.billType"
                :key="Number(selectItem.value || 0)"
                :label="selectItem.nameCn"
                :disabled="
                  limitType &&
                  extraData.isBussiness === 1 &&
                  addBtnShow &&
                  !paramObj.isWebEdit
                    ? selectItem.value === '0'
                    : false
                "
                :value="Number(selectItem.value || 0)"
              />
            </el-select>
          </template>
        </template>
        <template v-if="slotProps.prop === 'dealingsCompanyName'">
          <template v-if="!slotProps.row.isUpdate">
            {{ slotProps.row.dealingsCompanyName }}
          </template>
          <template v-else>
            <AutoComplete
              :formModel="slotProps.row"
              :fieldItem="{
                id: 'dealingsCompany',
                size: 'mini',
                selectLabelKey: 'dealingsCompanyName',
                placeholder: '往来单位',
                searchParamName: 'name',
                httpRequest: (row) => getforeclose(accMain.id, row),
                defaultProp: {
                  value: 'id',
                  label: 'nameCn',
                },
              }"
              :additionalParam="{
                addCostFlag:true
              }"
              defaultKey="id"
            />
          </template>
        </template>
        <template v-if="slotProps.prop === 'costName'">
          <template v-if="!slotProps.row.isUpdate">
            {{ slotProps.row.costName }}
          </template>
          <template v-else>
            <AutoComplete
              size="mini"
              :formModel="slotProps.row"
              :fieldItem="slotProps.column.fieldItem"
            />
          </template>
        </template>
        <template v-if="slotProps.prop === 'currency'">
          <template v-if="!slotProps.row.isUpdate">
            {{ slotProps.row.currencyCode }}
          </template>
          <template v-else>
            <AutoComplete
              size="mini"
              :formModel="slotProps.row"
              :fieldItem="slotProps.column.fieldItem"
            />
          </template>
        </template>
        <template v-if="slotProps.prop === 'unitPrice'">
          <template v-if="!slotProps.row.isUpdate">
            {{ formatMoney(slotProps.row.unitPrice) }}
          </template>
          <template v-else>
            <el-input-number
              v-model="slotProps.row.unitPrice"
              :controls="false"
              placeholder="单价"
              :max="slotProps.column.max"
              v-input-number-limit="2"
              size="mini"
              @change="(val) => handleMoney(slotProps.row, val, 'num')"
            />
          </template>
        </template>
        <template v-if="slotProps.prop === 'num'">
          <template v-if="!slotProps.row.isUpdate">
            {{ toFixedNum(slotProps.row.num, slotProps.column.decimal) }}
          </template>
          <template v-else>
            <el-input-number
              v-model="slotProps.row.num"
              :controls="false"
              placeholder="数量"
              :max="slotProps.column.max"
              v-input-number-limit="slotProps.column.decimal"
              size="mini"
              @change="(val) => handleMoney(slotProps.row, val, 'unitPrice')"
            />
          </template>
        </template>
        <template v-if="slotProps.prop === 'prepaidCollect'">
          <template v-if="!slotProps.row.isUpdate">
            <span>{{ slotProps.dicsList.nameCn || "--" }}</span>
          </template>
          <template v-else>
            <el-select
              size="mini"
              v-model="slotProps.row.prepaidCollect"
              style="width: 100%"
              :clearable="false"
            >
              <el-option
                v-for="selectItem in dictionary.dicsData.paymentType"
                :key="Number(selectItem.value || 0)"
                :label="selectItem.nameCn"
                :value="Number(selectItem.value || 0)"
              />
            </el-select>
          </template>
        </template>
        <template v-if="slotProps.prop === 'isIncludeTax'">
          <template v-if="!slotProps.row.isUpdate">
            <i
              class="el-icon-circle-check"
              v-if="slotProps.row.isIncludeTax"
            ></i>
            <span v-else>--</span>
          </template>
          <template v-else>
            <el-checkbox
              v-model="slotProps.row.isIncludeTax"
              @change="(val) => handleChangeTax(slotProps.row, val)"
            />
          </template>
        </template>
        <template v-if="slotProps.prop === 'taxRate'">
          <template v-if="!slotProps.row.isUpdate">
            {{ slotProps.row.taxRate || "--" }}
          </template>
          <template v-else>
            <el-input-number
              v-model="slotPropsRow(slotProps.row, slotProps.prop).taxRate"
              :controls="false"
              placeholder="税率%"
              v-input-number-limit="2"
              size="mini"
            />
          </template>
        </template>
        <template v-if="slotProps.prop === 'remark'">
          <template v-if="!slotProps.row.isUpdate">
            {{ slotProps.row.remark || "--" }}
          </template>
          <template v-else>
            <el-input
              type="text"
              size="mini"
              v-model="slotProps.row.remark"
              placeholder="备注"
              maxlength="250"
            />
          </template>
        </template>
        <template v-if="slotProps.prop === 'billNo'">
          <span
            class="primary-text-btn"
            @click="handleDetail(slotProps.row)"
            v-if="slotProps.row.billNo"
          >
            {{ slotProps.row.billNo }}
          </span>
          <span v-else>--</span>
        </template>
        <template v-if="slotProps.prop === 'operation'">
          <div class="operation-content" v-if="getCanEdit(slotProps.row)">
            <div
              class="operation-Btn"
              v-for="(item, index) in tableConfig.statusList[
                slotProps.row.isUpdate
              ]"
              :key="index"
            >
              <el-button
                class="operate-icon"
                size="small"
                type="text"
                :style="{
                  color: item.color,
                }"
                @click="item.handleClick(slotProps.row, slotProps.rowIndex)"
              >
                {{ item.text }}
              </el-button>
            </div>
          </div>
          <span v-else>--</span>
        </template>
      </template>
    </ComTable>

    <ProfitTable
      ref="profitRef"
      :profitData="{
        orderId: formModel.id,
        orderType:
          extraData.isBussiness && !extraData.isClearance
            ? formModel.orderType
            : undefined,
        businessType: paramObj.businessType || 0 /* 订单默认为 0*/,
        billingMain: extraData.billingMain || undefined,
        currencyIdConfig: formModel.currencyIdConfig, //如果账单合计需要展示动态币别，需要从详情返回并传入 可用币别集合
        convertCurrencyIdConfig: formModel.convertCurrencyIdConfig, //如果账单合计需要展示动态折合币别，需要从详情返回并传入 可用折合币别集合
        ...(extraData.isClearance ? { isBussiness: paramObj.isBussiness } : {}),
      }"
      @getTotalList="getTotalList"
    />

    <CopyDlgBill ref="copyDlgRef" />
    <AddCostTempDlg ref="tempDlgRef" />
    <RelatedQuotation ref="relatedQuotationRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { chargeInfo, formConfig } from "./model";
import { msgBox } from "@/utils/confirmBox.js";
import { getAccmainCus, getforeclose } from "@/api/common";
import {
  settleAccountsOrderList,
  addSettleAccounts,
  updateSettleAccounts,
  deleteSettleAccounts,
  postBatchOperate,
  batchGenerateBill,
} from "@/api/settlementManage/statementManage";
import { httpCostTypeSelect } from "@/comModel/httpSelect";
import { duplicateRemoval } from "@/utils/index";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinBillCostTemplate } from "./components/mixinCostTemplate.js";
import { getNowDate } from "@/utils/index.js";
import { multiplicationFn } from "@/utils/instructions";

export default {
  mixins: [mixinColsConf, mixinBillCostTemplate],
  props: {
    formModel: {
      type: Object,
      default: () => {
        return {};
      },
    },
    extraData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    paramObj: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: "",
    },
    addBtnShow: {
      type: Boolean,
      default: true,
    },
    getQueryParams: {
      type: Function,
      default: null,
    },
    billingMainId: {
      type: Number,
      default: null,
    },
    hideBtnCopy: {
      type: Boolean,
      default: false,
    },
    limitType: {
      type: Boolean,
      default: true,
    },
    relatedBtnShow: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    CopyDlgBill: () => import("./copyDlgBill"),
    ProfitTable: () => import("./components/profitTable.vue"),
    ComColumnConf: () => import("_comp/ComColumnConf"),
    RelatedQuotation: () =>
      import(
        "@/views/enquiryManage/customerQuotation/components/RelatedQuotation"
      ),
  },
  data() {
    return {
      chargeInfo,
      getforeclose,
      httpCostTypeSelect,
      formConfig: {
        formModel: {},
        httpRequest: () => {}, // 表单提交接口
        successFunction: () => {}, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
        formRules: {}, // 表单校验规则
        visibleAll: true,
        labelWidth: "70px",
        lists: formConfig.lists,
      },
      btnArr: [
        ...(this.relatedBtnShow
          ? [
              {
                text: "关联报价",
                isShow: true,
                btnType: "relatedQuotation",
                handleBtnClick: this.handleRelatedQuotation,
              },
            ]
          : []),
        {
          text: "复制账单",
          plain: true,
          isShow: true,
          btnType: "btnCopy",
          handleBtnClick: this.handleCopy,
        },
        {
          text: "全部保存",
          plain: true,
          btnType: "btnSave",
          handleBtnClick: this.handleSaveAll,
        },
        {
          text: "批量删除",
          plain: true,
          btnType: "btnDel",
          handleBtnClick: () => {
            const ids = this.selectionRows
              .filter((ele) => this.getCanEdit(ele))
              .map((e) => e.id);
            if (ids.length) {
              this.handleDelete({
                id: ids.join(","),
              });
            } else {
              this.msgError("请选择可删除行");
            }
          },
        },
        {
          text: "新增费用",
          handleBtnClick: () => this.addBill(),
          isShow: true,
        },
        {
          text: "费用模板",
          handleBtnClick: () => this.addCostTemp(),
          isShow: true,
        },
        {
          text: "批量编辑",
          handleBtnClick: this.handleEditAll,
          isShow: true,
        },
        {
          text: "生成对账单",
          handleBtnClick: this.createdBill,
          isDisable: true,
        },
        {
          text: "批量生成对账单",
          handleBtnClick: this.batchGenerateBill,
          isDisable: true,
        },
        {
          text: "生成费用模板",
          btnType: "btnTemp",
          className: "rg-btn-temp",
          handleBtnClick: () => this.mCreatedCostTemp(),
          isDisable: true,
        },
      ],
      tableConfig: {
        // columnConfig: chargeInfo.columns,
        httpRequest: this.settleAccountsOrderList,
        // httpRequest: getTraditionListAll,
        statusList: {
          0: [
            {
              text: "修改",
              handleClick: this.handleEdit,
            },
            {
              text: "复制",
              handleClick: this.handleSingleCopy,
            },
            {
              text: "删除",
              handleClick: this.handleDelete,
              color: "#FF6767",
            },
          ],
          1: [
            {
              text: "保存",
              handleClick: this.handleSave,
            },
            {
              text: "取消",
              handleClick: this.handleCancel,
            },
          ],
        },
      },
      accMain: {},
      currRow: {},
      isBatchSave: false,
      billInfoList: [],
      billInfoTotalList: [],
      billList: [],
      selectionRows: [], //用户选择账单数组
      tabsConfig: {
        activeName:
          this.extraData.isBussiness === 1 && !this.addBtnShow ? "2" : "1", // 列设置使用
      },
      mixinTableColArr: [
        chargeInfo.columns,
        chargeInfo.columns.filter((e) => e.prop !== "operation"),
      ],
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "billType",
      "paymentType",
      "accountBillStatus",
    ]);
    // if (this.extraData.isBussiness === 1 && !this.addBtnShow) {
    // 订单详情账单
    // this.$set(
    //   this.tableConfig,
    //   "columnConfig",
    //   chargeInfo.columns.filter((e) => e.prop !== "operation")
    // );
    // }
    // const { isBussiness, isClearance } = this.extraData; //isBussiness=1为订单    订单照旧   操作单取operateMain过滤新增账单-往来单位
    // if (isBussiness == 1 && !isClearance) {
    // getAccmainCus().then((res) => {
    //   const { id } = res.data;
    //   this.accMain = {
    //     id,
    //   };
    // });
    // } else {
    const { operateMain } = this.formModel;
    this.accMain = {
      id: operateMain,
    };
    // }
  },
  methods: {
    handleMoney(row, val, key) {
      const tax = row.isIncludeTax ? row.taxRate || 0 : 0;
      const totalMoney = (Number(row[key] || 0) * Number(val || 0)).toFixed(2);
      const taxMoney = ((totalMoney || 0) * (Number(tax || 0) / 100)).toFixed(
        2
      );
      const inTaxMoney = ((totalMoney || 0) - taxMoney).toFixed(2);
      row.totalMoney = totalMoney;
      row.taxMoney = taxMoney;
      row.inTaxMoney = inTaxMoney;
    },
    handleChangeTax(row, val) {
      if (val > 99) {
        val = 99;
      }
      if (row.isIncludeTax && val < 1) {
        val = 1;
      }
      const taxMoney = (
        (row.totalMoney || 0) *
        (Number(val || 0) / 100)
      ).toFixed(2);
      row.taxMoney = taxMoney;
      row.inTaxMoney = ((row.totalMoney || 0) - taxMoney).toFixed(2);
    },
    handleDetail(row) {
      this.$router.push({
        path: "/settlementManagement/statementManage/editBillManage",
        query: {
          id: row.reconciliationId,
          backPath: this.$route.fullPath,
          activeTab: "3", // 1为新增，2为修改，3为详情
        },
      });
    },
    getDefaultQueryParams() {
      if (this.getQueryParams) {
        return this.getQueryParams();
      }
      const { isBussiness, isClearance, billingMain } = this.extraData;
      if (isBussiness || isBussiness === 0) {
        return {
          isBussiness,
          orderType: this.formModel.orderType,
          orderId: this.formModel.id, // 操作单id
          number: this.formModel.number || this.formModel.orderNum,
          ...(isClearance
            ? {
                businessType: this.paramObj.businessType,
              }
            : {}),
          billingMain,
        };
      }
      return {
        businessType: this.paramObj.businessType, //0操作单 1订舱单 2拼柜单 3清关单 4订单,
        orderId: this.formModel.id, // 操作单id
        billingMain,
      };
    },
    refreshTable() {
      this.$emit("handleSaveSuccess");
      this.$refs.profitRef?.profitRefresh(); // 刷新利润表
      this.$refs.tableConfig.refreshTable(true);
    },
    handleDelete(row) {
      if (row.id) {
        const msg = "删除操作不可逆！";
        const title = "删除提示";
        const className = "el-icon-warning text-warning";
        msgBox(this, { title, className, msg }, () => {
          deleteSettleAccounts(row.id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.refreshTable();
          });
        });
      }
    },
    settleAccountsOrderList(rows) {
      console.log("rows", rows);
      const addList = this.billList.filter((item) => !item.id && item.isUpdate);
      const updateList = this.billList.filter(
        (item) => item.id && item.isUpdate
      );
      return settleAccountsOrderList(rows).then((res) => {
        const [arr1, ...arr] = res.data?.billInfoList || [];
        console.log("arr", arr);
        this.billInfoList = arr || [];
        if (this.isBatchSave) {
          // 批量保存后刷新数据
          this.billList = (res.data?.billList || []).map((e) => {
            return {
              ...e,
              isUpdate: 0,
            };
          });
          this.$refs.tableConfig.setNewTableData(this.billList);
          this.isBatchSave = false;
          return;
        }
        const newList = (res.data?.billList || []).map((item) => {
          const index = updateList.findIndex((u) => u.id === item.id);
          if (index > -1) {
            return {
              ...updateList[index],
            };
          }
          return {
            ...this.getUpdateBillData(),
            ...item,
            isUpdate: 0,
          };
        });
        this.billList = [...addList, ...newList];
        this.$refs.tableConfig.setNewTableData(this.billList);
        // 编辑后更新详情头部的账单金额
        if (this.isCreatedRequest) {
          this.$emit("changeRequest");
        }
        this.isCreatedRequest = true;
      });
    },
    confirmGenerateBill(num) {
      return new Promise((resolve) => {
        const title = "提示";
        const className = "el-icon-success text-success";
        const msg = `确定将${num}条费用生成对账单？`;
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    batchGenerateBill() {
      const billIds = this.selectionRows.map((item) => item.id);
      this.confirmGenerateBill(billIds.length).then(() => {
        batchGenerateBill({
          billIds,
        }).then(() => {
          this.onSelectionChange();
          this.refreshTable();
        });
      });
    },
    createdBill() {
      const rows = this.selectionRows;
      //生成对账单与账单信息有关
      this.$message.closeAll();
      const { billingMain, dealingsCompany, type, currencyId } = rows[0];
      const typeIndex = rows.findIndex((e) => type !== e.type);
      if (typeIndex > -1) {
        return this.$message.error("应收应付类型不一致不可生成账单");
      }
      const index = rows.findIndex(
        (e) =>
          billingMain !== e.billingMain || dealingsCompany !== e.dealingsCompany
      );
      if (index > -1) {
        return this.$message.error("计费主体与往来单位不一致不可生成账单");
      }
      const currencyIndex = rows.findIndex((e) => currencyId !== e.currencyId);
      if (type === 0 && currencyIndex > -1) {
        return this.$message.error("货币不一致不可生成账单");
      }
      const nextFu = () => {
        const rowIds = rows.map((e) => e.id);
        const idRows = duplicateRemoval(rowIds).join(",");
        this.selectionRows = []; // 先清空选中项
        this.$router.push({
          path: "/settlementManagement/statementManage/editBillManage",
          query: {
            idRows,
            backPath: this.$route.fullPath,
            activeTab: "1", // 1为新增，2为修改，3为详情
          },
        });
      };
      if (currencyIndex > -1) {
        this.confirmNext().then(() => {
          nextFu();
        });
      } else {
        nextFu();
      }
    },
    confirmNext() {
      return new Promise((resolve) => {
        const title = "警告提示";
        const className = "el-icon-warning text-warning";
        const msg = "币别不一致是否进入下一步！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    addDefaultVal() {
      return {
        type: 1, // 新增默认值
        dealingsCompany: "",
        dealingsCompanyName: "",
        costName: "",
        currency: "",
        unitPrice: undefined,
        num: 1,
        totalMoney: "",
        prepaidCollect: 0,
        isIncludeTax: "",
        taxRate: undefined,
        remark: "",
        isGenerateStatement: 0,
        isUpdate: 1,
        newAdd: true,
      };
    },
    addBill(row = {}) {
      const data = Object.keys(row).length ? row : this.getAddBillData();
      this.billList = [
        {
          ...this.addDefaultVal(),
          ...data,
        },
        ...this.billList,
      ];
      this.$refs.tableConfig.setNewTableData(this.billList);
    },
    addCostTemp() {
      this.$refs.tempDlgRef?.editShow({
        addTempSuccess: (arr) => {
          if (arr?.length) {
            const addList = arr.map((ele) => {
              if (!ele.dealingsCompany) {
                delete ele.dealingsCompany; // 模板无值时取默认值
                delete ele.dealingsCompanyName;
              }
              ele.isIncludeTax = !!ele.isIncludeTax;
              return {
                ...this.addDefaultVal(),
                totalMoney: multiplicationFn([ele.num, ele.unitPrice]),
                ...this.getAddBillData(),
                ...ele,
              };
            });
            console.log("addList==", addList);
            this.billList = [...addList, ...this.billList];
            this.$refs.tableConfig.setNewTableData(this.billList);
          }
        },
      });
    },
    handleSave(formModel, idx, callBack) {
      const { orderType, taxRate = null } = formModel;
      const params = {
        ...formModel,
        taxRate,
        orderTypes: [orderType ? Number(orderType) : 2],
        isBussiness:
          formModel.isBussiness || formModel.isBussiness === 0
            ? formModel.isBussiness
            : "",
      };
      if (params.orderTypes && params.businessType === 4) {
        //判断是否为电商头程和传统订单
        const orderType = params.orderTypes.toString();
        if ("2,3,4,5,6".includes(orderType)) {
          params.businessType = 0;
          params.isBussiness = 1;
        }
      }
      let errArr = [];

      params.isIncludeTax = params.isIncludeTax ? 1 : 0;
      params.isMakeInvoice =
        params.type == 0 ? (params.isMakeInvoice ? 1 : 0) : 0;
      delete params.undefined;
      delete params.temp_secondId;

      const verMsg = {
        type: "类型",
        costId: "费用名称",
        dealingsCompanyName: "往来单位",
        currencyId: "币别",
        unitPrice: "单价",
        num: "数量",
      };
      const nonZeroKeys = ["unitPrice", "num"]; // 必填且不能为0
      if (params.isIncludeTax) {
        verMsg.taxRate = "税率";
      }
      for (let key in verMsg) {
        if (!params[key]) {
          if (nonZeroKeys.includes(key)) {
            errArr.push(verMsg[key]);
          } else {
            if (params[key] !== 0) {
              errArr.push(verMsg[key]);
            }
          }
          // return this.$message.error(verMsg[key]);
        }
      }
      if (errArr.length) {
        let idxTit = idx ? `序号${idx}行` : "";
        this.msgError(`${idxTit}请输入或选择${errArr.join("、")}`);
        return false;
      }

      // if (this.isVoyageBill === "createBill") {
      //   params.billingMain = formModel.nBillingMain;
      //   delete params.nBillingMain
      // }
      if (this.billingMainId) {
        params.billingMain = this.billingMainId; // 航次信息详情费用主体默认为市场部，暂时不可更改 10/26
      } else {
        params.billingMain = this.accMain.id;
      }
      params.costName && delete params.costName;
      if (callBack) {
        // 走批量保存
        callBack && callBack(params);
        return true;
      }
      if (params.id) {
        updateSettleAccounts(params).then(() => {
          formModel.isUpdate = 0;
          this.refreshTable();
        });
      } else {
        addSettleAccounts(params).then(() => {
          formModel.isUpdate = 0;
          this.refreshTable();
        });
      }
    },
    // 编辑账单
    handleEdit(row) {
      row.isIncludeTax = !!row.isIncludeTax;
      row.isUpdate = 1;
      // this.$emit("handleUpdateBill", row);
      const isSelectEdit = this.selectionRows.some((e) => e.id === row.id);
      // 选中后修改需重置选择项
      if (isSelectEdit) {
        this.onSelectionChange(this.selectionRows);
      }
      this.currRow[row.id] = {
        ...row,
      };
    },
    handleSingleCopy(row) {
      const params = {
        ...row,
        orderTypes: [row.orderType],
        isBussiness:
          this.extraData.isBussiness || this.extraData.isBussiness === 0
            ? this.extraData.isBussiness
            : row.isBussiness,
        isCopy: 1,
        accountingTime: getNowDate("-"), //复制账单的时候，记账日期为当天
      };
      delete params.id;
      addSettleAccounts(params).then((res) => {
        this.refreshTable();
      });
    },
    // 新增账单
    getAddBillData() {
      const oDate = new Date();
      const y = oDate.getFullYear();
      const m = oDate.getMonth() + 1;
      const d = oDate.getDate();
      const accountingTime = `${y}-${m > 9 ? m : "0" + m}-${
        d > 9 ? d : "0" + d
      }`;
      const {
        operationOrderNum,
        orderNum,
        number,
        jobNo,
        id: orderId,
        deptId,
        accMain: billingMain,
        // customerShortName, // 用该字段时，需要后台返回对应的ID
        customerName: dealingsCompanyName = "",
        customerId: dealingsCompany = "",
        orderType,
        isSortBox,
        sortBoxId,
        // operationOrderNum
      } = this.formModel;
      return {
        businessType: 0, //0操作单 1订舱单 2拼柜单 3清关单 4订单
        orderId, //订单id
        orderNum: operationOrderNum || orderNum || number || jobNo, //订单号
        deptId,
        billingMain,
        dealingsCompany,
        dealingsCompanyName,
        // dealingsCompanyName: dealingsCompanyName || customerShortName || "",
        orderType,
        boxType: isSortBox,
        // operationOrderNum,
        sortBoxId: isSortBox ? sortBoxId : "",
        accountingTime,
        ...this.extraData,
      };
    },
    // 编辑账单
    getUpdateBillData() {
      const {
        operationOrderNum: orderNum,
        id: orderId,
        deptId,
        accMain: billingMain,
      } = this.formModel;
      return {
        businessType: 0, //0操作单 1订舱单 2拼柜单 3清关单 4订单
        orderId, //订单id
        orderNum, //订单号
        deptId,
        billingMain,
      };
    },
    handleCancel(row) {
      if (row.newAdd && !this.currRow[row.id]) {
        // 新增没有ID，有排序取消不能用index值删除，需要用唯一key计算出排序后的index
        const rIndex = this.billList.findIndex(
          (e) => e.temp_secondId === row.temp_secondId
        );
        if (rIndex > -1) {
          this.billList.splice(rIndex, 1);
          this.$refs.tableConfig.setNewTableData(this.billList);
        }
        return;
      }
      Object.keys(row).forEach((e) => {
        row[e] = this.currRow[row.id][e];
      });
      row.isIncludeTax = row.isIncludeTax ? 1 : 0;
      row.isUpdate = 0;
    },
    handleCopy() {
      this.$refs.copyDlgRef?.editShow(
        {
          ...this.formModel,
          isBussiness: this.extraData.isBussiness ? 1 : 0, // 复制参数 1-订单 0-操作单
        },
        {
          editSuccess: () => {
            this.refreshTable();
            // console.log('editSuccess==', val)
          },
        }
      );
    },
    // 批量编辑
    handleEditAll() {
      const allData = this.$refs.tableConfig.tableData;
      allData.map((row) => {
        if (this.getCanEdit(row) && !row.isUpdate) {
          this.handleEdit(row);
        }
        return row;
      });
    },
    getCanEdit(row) {
      return (
        !row.isGenerateStatement &&
        row.contactsIsGenerate != 1 &&
        !row.lockOrder &&
        !row.billNo &&
        (this.limitType &&
        this.extraData.isBussiness === 1 &&
        this.addBtnShow &&
        !this.paramObj.isWebEdit
          ? row.type === 1
          : true)
      ); // 订单详情接单后只可操作应收类型
    },
    handleSaveAll() {
      let billInfos = [];
      let filtArr = [];
      if (!this.billList.length) {
        return;
      }
      for (let [i, ele] of this.billList.entries()) {
        if (ele.isUpdate) {
          filtArr.push(i);
          const isLoop = this.handleSave(ele, i + 1, (opt) => {
            billInfos.push(opt);
          });
          if (!isLoop) break;
        }
      }
      if (billInfos.length && filtArr.length === billInfos.length) {
        // console.log('批量保存')
        const { customerId, id } = this.formModel;
        const opt = {
          type: 2,
          customerId,
          orderId: id,
          billInfos,
        };
        postBatchOperate(opt).then(() => {
          this.isBatchSave = true;
          this.refreshTable();
        });
      }
    },
    handleRelatedQuotation() {
      console.log(this.formModel);
      this.$refs.relatedQuotationRef.show(this.formModel);
    },
    typeChange(val, row) {
      // 电商与传统操作单详情新增账单切换类型
      const {
        customerName,
        customerId,
        bookingSpaceProxy,
        bookingSpaceProxyName,
        orderType,
      } = this.formModel;
      if (!row.id && [2, 3, 4].includes(orderType) && bookingSpaceProxy) {
        if (val === 1) {
          row.dealingsCompany = customerId;
          row.dealingsCompanyName = customerName;
        } else {
          row.dealingsCompany = bookingSpaceProxy;
          row.dealingsCompanyName = bookingSpaceProxyName;
        }
      }
    },
    onSelectionChange(rows = []) {
      if (this.isBatchBillChecked) {
        this.selectionRows = rows || [];
      } else {
        //选择相应的账单
        const nRows = rows.filter(
          // (e) => e.isGenerateStatement !== 1 && !e.isUpdate && !e.lockOrder
          (e) => e.isGenerateStatement !== 1 && !e.isUpdate && !e.billNo
        );
        // this.selectionRows = nRows;
        const row = nRows[0] || {};
        this.selectionRows = nRows.filter(
          (e) =>
            // e.billingMain === row.billingMain &&
            // e.dealingsCompanyName === row.dealingsCompanyName && //往来单位
            e.type === row.type //收付类型
          //  && (row.type === 0 ? e.currencyId === row.currencyId : true) // 应付类型币别不一致不可生成账单
        );
      }
      this.$refs.tableConfig?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
      // this.createdBillBtn.disabled = !rows.length;
      // this.$emit("createdBill", this.selectionRows);
    },
    selectionRowEvt(row) {
      // 列表条件选择，不满足条件置灰
      if (this.isBatchBillChecked) {
        return true;
      }
      // if (row.isGenerateStatement === 1 || row.isUpdate || row.lockOrder) {
      if (row.isGenerateStatement === 1 || row.isUpdate || row.billNo) {
        //1已经生成过对账单，0未生成过对账单，排除已经生成过对账单的账单
        return false;
      }
      const rSome = this.selectionRows.some(
        (e) =>
          // e.billingMain === row.billingMain && // 计费主体
          // e.dealingsCompanyName === row.dealingsCompanyName && //往来单位
          e.type === row.type //收付类型
        //  &&(row.type === 0 ? e.currencyId === row.currencyId : true) // 应付类型币别不一致不可生成账单
      );
      if (this.selectionRows.length && !rSome) {
        return false;
      }
      return true;
    },
    tableHeight() {
      const lent = this.billList.length || 0;
      const { showTableNum = 10 } = this.extraData || {};
      return lent > showTableNum ? `${showTableNum * 50}px` : null;
    },
    nBtnArr() {
      if (this.extraData.isBussiness === 1) {
        if (this.addBtnShow && !this.paramObj.isWebEdit) {
          return this.btnArr.filter((e) => e.btnType !== "btnCopy");
        } else {
          return this.btnArr.filter(
            (e) => this.addBtnShow || e.btnType !== "btnSave"
          );
        }
      }
      if (this.hideBtnCopy) {
        return this.btnArr.filter((e) => e.btnType !== "btnCopy");
      }
      return this.btnArr;
    },
    costTrial(row) {
      const data = this.getAddBillData();
      const costTrial = row.map((e) => {
        const { price, quantity, costId, costName } = e;
        return {
          type: e.type, // 新增默认值
          currency: "",
          unitPrice: price || undefined,
          num: quantity || undefined,
          prepaidCollect: 0,
          isIncludeTax: "",
          taxRate: "",
          remark: "",
          isGenerateStatement: 0,
          totalMoney: (Number(1) * Number(e.unitPrice || 0)).toFixed(2),
          isUpdate: 1,
          newAdd: true,
          ...data,
          dealingsCompany: e.dealingsCompany.customerId,
          dealingsCompanyName: e.dealingsCompany.customerName || "",
          currencyId: e.currencyId.id,
          currencyCode: e.currencyId.nameCn,
          costId,
          costName,
        };
      });
      this.billList = costTrial.concat(this.billList);
      this.$refs.tableConfig.setNewTableData(this.billList);
    },
    slotPropsRow(row, key) {
      // 无值时改为undefined，否则会显示数字 0
      row[key] = row[key] === null ? undefined : row[key];
      return row;
    },
    getTotalList(row = {}) {
      //上方的币别利润折合只需要从下方的合计利润中取前两个折合币种集合，不再从接口获取了
      const { equivalentProfitList = {}, filterEquivalentCURRList = [] } = row;
      this.billInfoTotalList = [];
      (filterEquivalentCURRList || []).map((e) => {
        const { code } = e;
        if (this.billInfoTotalList.length < 2) {
          this.billInfoTotalList.push({
            label: `利润折合${code}`,
            value: equivalentProfitList[`equivalentProfit${code}`],
          });
        }
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style lang="scss" scoped>
.detail-table {
  // margin-top: -22px;
  /deep/ .tableData .table-header-cell {
    background-color: #f8f8f8;
  }

  .text-align-left {
    /deep/ {
      .el-input__inner {
        padding-right: 0;
      }
    }
  }
  .title {
    &.margin-tit {
      // margin-bottom: 5px;
      margin: 10px 0px;
    }
    .title-left {
      font-size: 14px;
      font-weight: bold;
      line-height: 22px;
      padding: 14px 0 11px;
      color: #515151;
    }
    .title-right {
      display: flex;
      .right-button + .right-button {
        margin-left: 10px;
        &.rg-btn-temp {
          margin-left: 0;
        }
      }
      .el-checkbox {
        margin-right: 5px;
      }
    }
    .radio {
      font-size: 13px;
      .el-radio {
        margin-right: 6px;
      }
      /deep/ {
        .el-radio__label {
          padding-left: 0;
        }
      }
    }
    .checkbox {
      font-size: 13px;
      padding: 0 35px;
      /deep/ .el-checkbox__label {
        padding-left: 0;
      }
      /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
        background-color: #5094ff;
        border-color: #5094ff;
        &::after {
          border-color: #fff;
        }
      }
    }
  }

  .el-icon-circle-check {
    font-size: 16px;
    color: #53c88a;
  }
  .pics-box {
    img {
      width: 50px;
      height: 40px;
      vertical-align: middle;
    }
  }
  .operation-content {
    display: flex;
    .operation-Btn {
      margin-right: 5px;
    }
  }
}
</style>
