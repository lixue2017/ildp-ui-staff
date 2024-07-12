<template>
  <!-- 电商LCL接单 -->
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        @handleChange="handleChange"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:tips="slotProps">
          <span class="form-tips"
            >* 只有目的地为欧盟和英国，海运散货才可以走拼柜</span
          >
        </template>
        <template v-slot:isWarehousing="slotProps">
          <el-radio-group v-model="slotProps.formModel.isWarehousing" disabled>
            <el-radio :key="1" :label="1">是</el-radio>
            <el-radio :key="0" :label="0">否</el-radio>
          </el-radio-group>
          <el-input
            class="Warehouse"
            v-model="transactionWarehouseCodeName"
            disabled
            :title="transactionWarehouseCodeName"
          ></el-input>
        </template>

        <template v-slot:operationOrderNum="slotProps">
          <div class="space-nowrap">
            {{ slotProps.formModel.operationOrderNum }}
            <el-tag
              type="success"
              size="mini"
              color="#35D06F1A"
              :style="{
                color: '#35D06F',
              }"
              v-if="slotProps.formModel.operationOrderType !== 2"
              >{{ orderType[slotProps.formModel.operationOrderType].nameCn
              }}{{
                Number(slotProps.formModel.orderBusinessType) === 1
                  ? "进口"
                  : "出口"
              }}</el-tag
            >
            <el-tag
              type="success"
              size="mini"
              color="#66A5FF1A"
              :style="{
                color: '#66A5FF',
              }"
              class="tag-margin-5"
              v-if="slotProps.dicsData.nameCn"
              >{{ slotProps.dicsData.nameCn }}</el-tag
            >
          </div>
        </template>
        <template v-slot:bookingSpaceProxy="slotProps">
          <AutoComplete
            v-if="extraParams.bookingSpaceProxy.isChangeProxy"
            ref="bookingSpaceProxyRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              className: extraParams.bookingSpaceProxy.className,
              disabled: extraParams.bookingSpaceProxy.disabled,
              handle: handleBookingSpaceProxy,
            }"
            :additionalParam="{
              typeList:
                slotProps.formModel.WEBproxyTypeIsPublic == 1
                  ? extraParams.bookingSpaceProxy.typeList
                  : undefined,
              orderId:
                slotProps.formModel.WEBproxyTypeIsPublic == 1
                  ? formConfig.formModel.orderId
                  : undefined,
              orderType:
                slotProps.formModel.WEBproxyTypeIsPublic == 1
                  ? formConfig.formModel.orderType
                  : undefined,
              ids:
                slotProps.formModel.WEBproxyTypeIsPublic == 1
                  ? undefined
                  : slotProps.formModel.WEBcustomerIds,
              freightType: slotProps.formModel.WEBproxyTypeIsPublic
                ? 1
                : undefined,
              // notTypeList: slotProps.formModel.proxyType == 1 ? 0 : undefined,
              isQueryFirstDept:
                slotProps.formModel.proxyType == 1 ? 1 : undefined,
            }"
          />
        </template>
        <template v-slot:overseasAgency="slotProps">
          <template v-if="slotProps.formModel.overseasAgencyType == '2'">
            <!-- 类型为头程同行：海外代理取订舱代理的值 -->
            {{ slotProps.formModel.bookingSpaceProxyName || "--" }}
          </template>
          <template v-else>
            <AutoComplete
              v-if="extraParams.overseasAgency.isChangeProxy"
              ref="overseasAgencyRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                className: extraParams.overseasAgency.className,
                disabled: extraParams.overseasAgency.disabled,
              }"
              :additionalParam="{
                typeList: extraParams.overseasAgency.typeList,
                isOverseasAgent: extraParams.overseasAgency.isOverseasAgent,
              }"
            />
          </template>
        </template>
        <template v-slot:transactionWarehouse="slotProps">
          <AutoComplete
            v-if="extraParams.transactionWarehouse.isChangeProxy"
            ref="transactionWarehouseRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              className: extraParams.transactionWarehouse.className,
              disabled: extraParams.transactionWarehouse.disabled,
            }"
            :additionalParam="{
              typeList: extraParams.transactionWarehouse.typeList,
              salesman: slotProps.formModel.salesman,
              flagAvailable: 'y',
            }"
          />
        </template>
        <template v-slot:salesAssistant="slotProps">
          <AutoComplete
            v-if="extraParams.salesAssistant.isChangeProxy"
            ref="salesAssistantRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              getSearchOptions: getSalesAssistant,
              isAutoInitRequest: true,
            }"
            :additionalParam="{
              kaid: extraParams.salesAssistant.typeList,
            }"
          />
        </template>
        <template v-slot:quotationSheetId="slotProps">
          <AutoComplete
            ref="quotationSheetRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              disabled: !slotProps.formModel.bookingSpaceProxy,
              refreshRequest: quotationRefreshRequest,
            }"
            :additionalParam="{
              ...(slotProps.formModel.proxyType == 1
                ? { sameIndustryProxyId: slotProps.formModel.bookingSpaceProxy }
                : {
                    cabinProxyId: slotProps.formModel.bookingSpaceProxy,
                  }),
              startPortIdEq: slotProps.formModel.startPortIdEq,
              endPortIdEq: slotProps.formModel.endPortIdEq,
            }"
          />
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { takeOrders, getSalesman } from "@/api/operateManage/common.js";
import {
  formConfig,
  formRulesLists,
} from "@/views/newOrderManage/components/orderReceive/model.js";
import { mapState } from "vuex";
import { getCrmInfoPublicList } from "@/api/publicInterface/index.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      orderType: [
        {
          color: "#35D06F",
          nameCn: "海运",
        },
        {
          color: "#35D06F",
          nameCn: "空运",
        },
      ],
      type: 1,
      customDialogConfig: {
        title: "接单",
        width: "850px",
        dataStatus: 0,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "保存",
            type: "primary",
            handleClick: () => {
              this.customDialogConfig.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
        lists: [], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      transactionWarehouseCodeName: "",
      extraParams: {
        //接单弹窗中的动态参数
        bookingSpaceProxy: {
          typeList: 3, //接口额外参数
          isChangeProxy: true, //刷新DOM
          className: "", //隐藏ICON
          disabled: false, //置灰不可操作
        },
        overseasAgency: {
          typeList: 0,
          isOverseasAgent: undefined,
          isChangeProxy: true,
          className: "",
          disabled: false,
        },
        transactionWarehouse: {
          typeList: 0,
          isChangeProxy: true,
          className: "",
          disabled: false,
        },
        salesAssistant: {
          isChangeProxy: false,
          typeList: 0,
        },
      },
      orderData: {
        isEligible: 0, //订单是否为海运，目的国为欧盟和英国的订单，为MOCK数据之后替换成接口返回
        isTradeClause: 0, //贸易条款是否为DDP\DDU\DAP
        bookingSpaceProxy: "", //中进宝ID
      },
      dicts: [],
      quotationRefreshRequest: false,
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const { operationOrderNum, proxyType, bookingSpaceProxy, ...nFormModel } =
        formModel;
      const params = {
        ...nFormModel,
        customsClearanceType:
          formModel.customsClearanceType || formModel.customsClearanceType === 0
            ? formModel.customsClearanceType
            : null,
        proxyType,
        bookingSpaceProxy: proxyType == 1 ? undefined : bookingSpaceProxy,
        sameIndustryProxy: proxyType == 1 ? bookingSpaceProxy : undefined,
      };
      return takeOrders(params);
    },
    async show(row, type, dicts) {
      this.type = type;
      this.dicts = dicts;
      const { proxyTypeDicts } = dicts;
      await this.getOrderData(row);
      const {
        id: orderId,
        orderType,
        orderNum,
        number,
        orderBusinessType,
        encasementWay,
        freightType,
        operationOrderType,
        customsClearanceType,
        tradeClause,
        bailorPeople,
        proxyType,
        createBy: orderCreateBy,
        putWarehouseTime,
        countryId,
        customerId, // 客户id
        deptId, // 部门id
        insuredAmount,
        insuranceAmount,
        transactionWarehouse,
        transactionWarehousePlatformType,
        transactionWarehouseCode,
        transactionWarehouseName,
        routeCode,
        headTransportMode,
        endPort,
        startPort,
      } = row;
      getSalesman({
        orderId,
        orderType: orderType || 2,
      }).then((res) => {
        const { lists, defaultModel, formRules, title } = formConfig(
          {
            type,
            operationOrderType, //判断是否为海运订单 0-海运  1空运
            routeCode, // 8,9为英国欧盟
            salesmanChange: (row) => {
              this.getSalesAssistantKaid(row);
            },
            containerTrailerChange: (row) => {
              this.getTransactionWarehouse(row);
            },
            quotationParams: {
              quotedPriceStateEq: 7,
              packingModeEq: freightType,
              shippingModeEq: [1, 2][
                [3, 4].includes(headTransportMode) ? 1 : 0
              ],
              customerIdEq: customerId,
            },
          },
          this.extraParams,
          dicts
        );
        // let bookingSpaceProxy = "";
        // if (type === "3-0") {
        //   //整柜默认客户ID
        //   // bookingSpaceProxy = customerId;
        // } else {
        //   if (operationOrderType == 0 && (routeCode == 8 || routeCode == 9)) {
        //     //散货如果是海运且国家为欧盟或英国，默认中进宝
        //     // bookingSpaceProxy = this.orderData.bookingSpaceProxy;
        //   }
        // }
        this.extraParams.salesAssistant.typeList = res.data?.userId;
        this.transactionWarehouseCodeName =
          transactionWarehouseCode + "/" + transactionWarehouseName; //拼接交货仓CODE和NAME
        this.customDialogConfig.title = title;
        this.formConfig = {
          ...this.formConfig,
          formModel: {
            orderId,
            orderType: orderType || 2,
            operationOrderNum: `${type}`.indexOf("3") > -1 ? number : orderNum,
            orderBusinessType: orderBusinessType
              ? orderBusinessType
              : type != 4
              ? 0
              : "",
            freightType:
              `${type}`.indexOf("3") > -1 ? encasementWay : freightType,
            // ...(config[type].defaultModel || {}),
            ...defaultModel,
            salesman: res.data?.userId,
            salesmanName: res.data?.userName,
            operationOrderType,
            customsClearanceType,
            // bookingSpaceProxy: bookingSpaceProxy, //电商FCL默认带出订舱代理   customerId客户ID
            tradeClause,
            bailorPeople,
            putWarehouseTime,
            orderCreateBy,
            country: countryId, // 国家
            customerId,
            deptId,
            transactionWarehouse:
              type == "3-1" ? transactionWarehouse : undefined,
            // transactionWarehousePlatformType, //交货仓拼接好字段
            // transactionWarehouseCode,
            // transactionWarehouseName,
            insuredAmount: insuredAmount || insuranceAmount,
            WEBproxyTypeIsPublic: proxyTypeDicts[0].isPublic, //仅用于动态配置
            WEBcustomerIds: proxyTypeDicts[0].customerIds, //仅用于动态配置
            endPortIdEq: endPort,
            startPortIdEq: startPort,
          },
          lists: [
            {
              fieldList: [
                {
                  rows: [
                    {
                      cols: lists,
                    },
                  ],
                },
              ],
            },
          ],
          formRules: formRules,
        };
        // if (typeof this.formConfig.formModel.proxyType === "number") {
        //   this.formConfig.formModel.proxyType = JSON.stringify(
        //     this.formConfig.formModel.proxyType
        //   );
        // }
        // if ((orderType == 2 || !orderType) && proxyType) {
        //   this.formConfig.formModel.proxyType = proxyType;
        // }
        // this.$refs.dialogForm?.setFormModel(this.formConfig.formModel);
        this.$nextTick(() => {
          this.extraParams.salesAssistant.isChangeProxy = true;
        });
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleChange(row, id) {
      let ruleValide = {}; //ruleValide需要新增的表单校验
      let removeRule = []; //removeRule需要移除的表单校验
      if (this.type == "3-0" && ["overseasAgencyType"].includes(id)) {
        //电商整柜
        if (id === "overseasAgencyType") {
          switch (row) {
            case "0":
              this.extraParams.overseasAgency.typeList = 0;
              this.extraParams.overseasAgency.isOverseasAgent = 1;
              break;
            default:
              this.extraParams.overseasAgency.typeList = 3;
              this.extraParams.overseasAgency.isOverseasAgent = undefined;
              break;
          }
          this.extraParams.overseasAgency.isChangeProxy = false;
          this.$refs.dialogForm?.setFormModel({
            overseasAgency: "",
          });
          this.$nextTick(() => {
            this.extraParams.overseasAgency.isChangeProxy = true;
          });
        }
      } else if (this.type == "3-1" && ["overseasAgencyType"].includes(id)) {
        //电商散货
        if (id === "overseasAgencyType") {
          //海外代理类型  0--堡森  1--代理   2--头程同行
          let { bookingSpaceProxy } = this.$refs.dialogForm?.getFormParams();
          switch (row) {
            case "0":
              this.extraParams.overseasAgency.typeList = 0;
              this.extraParams.overseasAgency.isOverseasAgent = 1;
              this.extraParams.overseasAgency.disabled = false;
              this.extraParams.overseasAgency.className = "";
              bookingSpaceProxy = "";
              ruleValide = {
                overseasAgency: formRulesLists["overseasAgency"],
              };
              break;
            case "1":
              this.extraParams.overseasAgency.typeList = 3;
              this.extraParams.overseasAgency.isOverseasAgent = undefined;
              this.extraParams.overseasAgency.disabled = false;
              this.extraParams.overseasAgency.className = "";
              bookingSpaceProxy = "";
              ruleValide = {
                overseasAgency: formRulesLists["overseasAgency"],
              };
              break;
            case "2":
              this.extraParams.overseasAgency.typeList =
                this.extraParams.bookingSpaceProxy.typeList;
              this.extraParams.overseasAgency.isOverseasAgent = undefined;
              this.extraParams.overseasAgency.disabled = true;
              this.extraParams.overseasAgency.className =
                "auto-dis-no-icon auto-dis-search";
              removeRule = ["overseasAgency"];
              break;
          }
          this.extraParams.overseasAgency.isChangeProxy = false;
          this.$refs.dialogForm?.setFormRules(ruleValide, removeRule); //根据用户的选择新增与删除校验
          this.$refs.dialogForm?.setFormModel({
            overseasAgency: bookingSpaceProxy,
          });
          this.$nextTick(() => {
            this.extraParams.overseasAgency.isChangeProxy = true;
          });
        }
      } else if (id === "proxyType") {
        const { proxyTypeDicts } = this.dicts;
        const { isPublic, customerIds } =
          (proxyTypeDicts || []).filter((e) => e.value == row)[0] || [];
        this.$refs.dialogForm?.setFormModel({
          WEBproxyTypeIsPublic: isPublic,
          WEBcustomerIds: customerIds,
          bookingSpaceProxy: "",
          bookingSpaceProxyName: "",
        });
        this.$refs?.bookingSpaceProxyRef.changeFocusRequest();
      }
    },
    getSalesAssistant(rows) {
      //当前业务员下面的“销售助理”，默认带出第1个；
      this.$refs.dialogForm?.setFormModel({
        salesAssistant: rows[0]?.userId,
      });
    },
    getSalesAssistantKaid(row) {
      this.extraParams.salesAssistant.isChangeProxy = false;
      this.extraParams.salesAssistant.typeList = row;
      this.$refs.dialogForm?.setFormModel({
        salesAssistant: "",
      });
      this.$nextTick(() => {
        this.extraParams.salesAssistant.isChangeProxy = true;
      });
    },
    getTransactionWarehouse(row) {
      //集装箱拖车修改后改变国内交货仓
      let ruleValide = {}; //ruleValide需要新增的表单校验
      let removeRule = []; //removeRule需要移除的表单校验
      switch (row) {
        case "0":
        case "2":
          this.extraParams.transactionWarehouse.disabled = true;
          this.extraParams.transactionWarehouse.className =
            "auto-dis-no-icon auto-dis-search";
          removeRule = ["transactionWarehouse"];
          break;
        default:
          this.extraParams.transactionWarehouse.typeList = 2;
          this.extraParams.transactionWarehouse.disabled = false;
          this.extraParams.transactionWarehouse.className = "";
          ruleValide = {
            transactionWarehouse: formRulesLists["transactionWarehouse"],
          };
          break;
      }
      this.extraParams.transactionWarehouse.isChangeProxy = false;
      this.$refs.dialogForm?.setFormRules(ruleValide, removeRule); //根据用户的选择新增与删除校验
      this.$refs.dialogForm?.setFormModel({
        transactionWarehouse: "",
        transactionWarehouseName: "",
      });
      this.$nextTick(() => {
        this.extraParams.transactionWarehouse.isChangeProxy = true;
      });
    },
    handleBookingSpaceProxy(row) {
      const formParams = this.$refs.dialogForm?.getFormParams();
      const { overseasAgencyType } = formParams;
      this.quotationRefreshRequest = !this.quotationRefreshRequest;
      if (overseasAgencyType == 2) {
        this.$refs.dialogForm?.setFormModel({
          overseasAgency: row,
        });
        this.extraParams.overseasAgency.isChangeProxy = false;
        this.$nextTick(() => {
          this.extraParams.overseasAgency.isChangeProxy = true;
        });
      }
    },
    async getOrderData(row) {
      //用来做以下两个判断
      //贸易条款是否为DDP\DDU\DAP    海运空运接单判断
      //订单是否为海运，目的国为欧盟和英国的订单，为MOCK数据之后替换成接口返回    电商接单判断
      this.orderData.isEligible = 0;
      this.orderData.isTradeClause = 0;
      this.orderData.bookingSpaceProxy = "";
      const { operationOrderType, routeCode, tradeClause } = row;
      if (operationOrderType == 0 && (routeCode == "8" || routeCode == "9")) {
        await getCrmInfoPublicList({ code: "ZJB" }).then((res) => {
          this.orderData.isEligible = 1;
          this.orderData.bookingSpaceProxy = res.rows[0]?.id;
        });
      }
      // if (tradeClause) {
      //   const tradeClauseLists = this.dictionary.dicsData.tradeClause;
      //   const nRow = tradeClauseLists.filter((e) => e.value == tradeClause);
      //   const { nameCn } = nRow[0];
      //   if (nameCn == "DDP" || nameCn == "DDU" || nameCn == "DAP") {
      //     this.orderData.isTradeClause = 1;
      //   }
      // }
    },

    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-margin-5 {
  margin-left: 5px;
}
.space-nowrap {
  white-space: nowrap;
}
.Warehouse {
  width: 160px;
  margin-left: 10px;
}
/deep/ {
  .form-tips {
    color: #3179ef;
  }
}
</style>
