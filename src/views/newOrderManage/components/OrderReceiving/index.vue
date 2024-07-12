
<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        @handleChange="handleChange"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
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
            >
              {{ orderType[slotProps.formModel.operationOrderType].nameCn
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
              className: slotProps.fieldItem.className
                ? slotProps.fieldItem.className
                : extraParams.bookingSpaceProxy.className,
              disabled: slotProps.fieldItem.disabled
                ? slotProps.fieldItem.disabled
                : extraParams.bookingSpaceProxy.disabled,
            }"
            :additionalParam="{
              typeList: extraParams.bookingSpaceProxy.typeList,
            }"
          />
        </template>
        <template v-slot:overseasAgency="slotProps">
          <AutoComplete
            v-if="extraParams.overseasAgency.isChangeProxy"
            ref="overseasAgencyRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              className: slotProps.fieldItem.className
                ? slotProps.fieldItem.className
                : extraParams.overseasAgency.className,
              disabled: slotProps.fieldItem.disabled
                ? slotProps.fieldItem.disabled
                : extraParams.overseasAgency.disabled,
            }"
            :additionalParam="{
              typeList: extraParams.overseasAgency.typeList,
            }"
          />
        </template>
        <template v-slot:transactionWarehouse="slotProps">
          <AutoComplete
            v-if="extraParams.transactionWarehouse.isChangeProxy"
            ref="transactionWarehouseRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              className: slotProps.fieldItem.className
                ? slotProps.fieldItem.className
                : extraParams.transactionWarehouse.className,
              disabled: slotProps.fieldItem.disabled
                ? slotProps.fieldItem.disabled
                : extraParams.transactionWarehouse.disabled,
            }"
            :additionalParam="{
              typeList: extraParams.transactionWarehouse.typeList,
            }"
          />
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import { takeOrders, getSalesman } from "@/api/operateManage/common.js";
import { config, formConfig, FORMRULES_CONFIG } from "./model";
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
      extraData: {},
      customDialogConfig: {
        title: "接单",
        width: "750px",
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
          typeList: 0, //接口额外参数
          isChangeProxy: true, //刷新DOM
          className: "", //隐藏ICON
          disabled: false, //置灰不可操作
        },
        overseasAgency: {
          typeList: 0,
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
      },
      orderData: {
        isEligible: 0, //订单是否为海运，目的国为欧盟和英国的订单，为MOCK数据之后替换成接口返回
        isTradeClause: 0, //贸易条款是否为DDP\DDU\DAP
        bookingSpaceProxy: "", //中进宝ID
      },
    };
  },
  methods: {
    submitFormRequest(formModel) {
      if (typeof formModel.salesman === "string") {
        formModel.salesman = formModel.salesmanId;
      }
      delete formModel.salesmanId;
      formModel.operationOrderNum && delete formModel.operationOrderNum;
      const params = {
        ...formModel,
        customsClearanceType:
          formModel.customsClearanceType || formModel.customsClearanceType === 0
            ? formModel.customsClearanceType
            : null,
      };
      return takeOrders(params);
    },
    async show(row, type, typeOrder) {
      console.log("row", row);
      this.type = type; //encasementWay-装箱类型   0为整柜FCL    1为散货LCL
      this.extraData = row; //列表数据
      await this.getOrderData(row);
      const {
        id: orderId,
        orderType,
        orderNum,
        number,
        orderBusinessType = type != 4 ? 0 : "",
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
        transactionWarehousePlatformType,
        transactionWarehouseCode,
        transactionWarehouseName,
        routeCode,
      } = row;
      getSalesman({
        orderId,
        orderType: orderType || 2, //2电商 3海运 4空运 56其他，电商没返回默认2其他有返回
      }).then((res) => {
        const { isEligible, isTradeClause } = this.orderData;
        const { lists, defaultModel, formRules } = formConfig(
          {
            type,
            isEligible, //订单是否为海运，目的国为欧盟和英国的订单，为MOCK数据之后替换成接口返回    电商接单判断
            isTradeClause, //贸易条款是否为DDP\DDU\DAP    海运空运接单判断
            operationOrderType, //判断是否为海运订单 0-海运  1空运
          },
          this.extraParams
        );
        this.transactionWarehouseCodeName =
          transactionWarehouseCode + "/" + transactionWarehouseName; //拼接交货仓CODE和NAME
        this.formConfig = {
          ...this.formConfig,
          formModel: {
            orderId,
            orderType: orderType || 2,
            operationOrderNum: `${type}`.indexOf("3") > -1 ? number : orderNum,
            orderBusinessType,
            freightType:
              `${type}`.indexOf("3") > -1 ? encasementWay : freightType,
            ...defaultModel,
            salesman: res.data.userName,
            salesmanId: res.data.userId,
            operationOrderType,
            customsClearanceType,
            tradeClause,
            bailorPeople,
            putWarehouseTime,
            orderCreateBy,
            country: countryId, // 国家
            customerId,
            bookingSpaceProxy: encasementWay == 0 ? customerId : "",
            deptId,
            transactionWarehousePlatformType, //交货仓拼接好字段
            transactionWarehouseCode,
            transactionWarehouseName,
            insuredAmount: insuredAmount || insuranceAmount,
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
        console.log("this.formConfig", this.formConfig.formModel);
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleChange(row, id) {
      //电商海运空运其他订单，接单弹窗中的各种判断与页面展示修改
      //this.type  1-传统整柜  2-传统散货  3-0-电商整柜   3-1-电商散货    4其他订单
      let ruleValide = {}; //ruleValide需要新增的表单校验
      let removeRule = []; //removeRule需要移除的表单校验
      if (this.type == "3-1") {
        if (id === "proxyType") {
          //头程代理类型   0--堡森   1-同行
          let bookingSpaceProxy = null;
          switch (row) {
            case "0":
              this.extraParams.bookingSpaceProxy.typeList = 0;
              this.extraParams.bookingSpaceProxy.disabled = true;
              this.extraParams.bookingSpaceProxy.className =
                "auto-dis-no-icon auto-dis-search";
              bookingSpaceProxy = this.orderData.bookingSpaceProxy; //默认中进宝
              break;
            default:
              this.extraParams.bookingSpaceProxy.typeList = 3;
              this.extraParams.bookingSpaceProxy.disabled = false;
              this.extraParams.bookingSpaceProxy.className = "";
              bookingSpaceProxy = "";
              break;
          }
          this.extraParams.bookingSpaceProxy.isChangeProxy = false;
          this.$refs.dialogForm?.setFormModel({
            bookingSpaceProxy,
          });
          console.log(this.formConfig.formModel);
          this.$nextTick(() => {
            this.extraParams.bookingSpaceProxy.isChangeProxy = true;
          });
        } else if (id === "overseasAgencyType") {
          //海外代理类型  0--堡森  1--代理   2--头程同行
          switch (row) {
            case "0":
              this.extraParams.overseasAgency.typeList = 0;
              this.extraParams.overseasAgency.disabled = false;
              this.extraParams.overseasAgency.className = "";
              ruleValide = {
                overseasAgency: FORMRULES_CONFIG["overseasAgency"],
              };
              break;
            case "1":
              this.extraParams.overseasAgency.typeList = 3;
              this.extraParams.overseasAgency.disabled = false;
              this.extraParams.overseasAgency.className = "";
              ruleValide = {
                overseasAgency: FORMRULES_CONFIG["overseasAgency"],
              };
              break;
            case "2":
              this.extraParams.overseasAgency.disabled = true;
              this.extraParams.overseasAgency.className =
                "auto-dis-no-icon auto-dis-search";
              removeRule = ["overseasAgency"];
              break;
          }
          this.extraParams.overseasAgency.isChangeProxy = false;
          this.$refs.dialogForm?.setFormRules(ruleValide, removeRule); //根据用户的选择新增与删除校验
          this.$nextTick(() => {
            this.extraParams.overseasAgency.isChangeProxy = true;
          });
        }
      } else if (this.type == "3-0") {
        if (id === "containerTrailer") {
          //containerTrailer  集装箱拖车     0-客户自拖   1-仓库集货
          switch (row) {
            case "0":
              this.extraParams.transactionWarehouse.disabled = true;
              this.extraParams.transactionWarehouse.className =
                "auto-dis-no-icon auto-dis-search";
              this.$refs.dialogForm?.setFormModel({
                transactionWarehouse: "",
              });
              removeRule = ["transactionWarehouse"];
              break;
            default:
              this.extraParams.transactionWarehouse.typeList = 2;
              this.extraParams.transactionWarehouse.disabled = false;
              this.extraParams.transactionWarehouse.className = "";
              ruleValide = {
                transactionWarehouse: FORMRULES_CONFIG["transactionWarehouse"],
              };
              break;
          }
          this.extraParams.transactionWarehouse.isChangeProxy = false;
          this.$refs.dialogForm?.setFormRules(ruleValide, removeRule); //根据用户的选择新增与删除校验
          this.$nextTick(() => {
            this.extraParams.transactionWarehouse.isChangeProxy = true;
          });
        } else if (id === "overseasAgencyType") {
          //海外代理类型  0--堡森  1--代理   2--头程同行
          switch (row) {
            case "0":
              this.extraParams.overseasAgency.typeList = 0;
              break;
            case "1":
              this.extraParams.overseasAgency.typeList = 3;
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
      } else if (this.type == "1" || this.type == "2") {
        if (id === "overseasAgencyType") {
          //海外代理类型  0--堡森  1--代理   2--头程同行
          this.extraParams.overseasAgency.isChangeProxy = false;
          this.$refs.dialogForm?.setFormModel({
            overseasAgency: "",
          });
          this.$nextTick(() => {
            this.extraParams.overseasAgency.isChangeProxy = true;
          });
        }
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
          this.orderData.bookingSpaceProxy = res.rows[0].id;
        });
      }
      if (tradeClause) {
        const tradeClauseLists = this.dictionary.dicsData.tradeClause;
        const nRow = tradeClauseLists.filter((e) => e.value == tradeClause);
        const { nameCn } = nRow[0];
        if (nameCn == "DDP" || nameCn == "DDU" || nameCn == "DAP") {
          this.orderData.isTradeClause = 1;
        }
      }
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
  width: 90px;
  margin-left: 10px;
}
</style>
