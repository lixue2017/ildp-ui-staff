<template>
  <div>
    <ComDialog
      ref="dialogRef"
      :customDialog="dialogConfig"
      :confirmClose="false"
      :dialogBoxCenter="true"
    >
      <template v-slot:content>
        <ComForm
          class="content-form-box"
          v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible"
          ref="formRef"
          :formConfig="contentFormConfig"
          @handleChange="handleChange"
        >
          <template
            v-for="(sItem, sIdx) in currencySlotArr"
            v-slot:[sItem.numKey]="{ formModel, fieldItem }"
          >
            <div class="flex-space-between number-select" :key="`c_${sIdx}`">
              <el-input-number
                :placeholder="fieldItem.placeholder"
                v-model="formModel[sItem.numKey]"
                v-input-number-limit="fieldItem.decimal"
                :controls="false"
              />
              <el-select
                v-model="formModel[sItem.currencyKey]"
                placeholder="币别"
              >
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </template>
          <template v-slot:serveAdjust="slotProps">
            <div class="slot-title">
              <div class="form-title">
                <span>服务调整</span>
              </div>
              <div>
                <el-checkbox
                  v-model="slotProps.formModel[slotProps.fieldItem.id]"
                  :disabled="slotProps.fieldItem.disabled"
                  >{{ slotProps.fieldItem.text }}</el-checkbox
                >
              </div>
            </div>
          </template>
          <template v-slot:trailerSlot="slotProps">
            <div class="slot-title">
              <div class="form-title">
                <span>集装箱拖车</span>
              </div>
              <div>
                <span>拖车类型：</span>
                <el-radio-group
                  v-model="slotProps.formModel[slotProps.fieldItem.id]"
                  :placeholder="slotProps.fieldItem.placeholder"
                  :disabled="slotProps.fieldItem.disabled"
                  @change="
                    handleChange(
                      slotProps.formModel[slotProps.fieldItem.id],
                      'containerTrailer'
                    )
                  "
                >
                  <el-radio
                    v-for="selectItem in dictionary[
                      slotProps.fieldItem.basicType
                    ]"
                    :key="selectItem.value"
                    :label="selectItem.value"
                    >{{ selectItem.nameCn }}</el-radio
                  >
                </el-radio-group>
              </div>
            </div>
          </template>
          <template v-slot:bookingSpaceProxy="slotProps">
            <AutoComplete
              ref="bookingRef"
              v-if="
                slotProps.formModel.operationOrderType == 0 &&
                slotProps.formModel.freightType == 1
              "
              :formModel="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
              :additionalParam="{
                typeList: [0, 3][slotProps.formModel.proxyType || 1],
              }"
            />
            <AutoComplete
              ref="bookingRef"
              v-else
              :formModel="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
              :additionalParam="{
                freightType:
                  slotProps.formModel.isPublic == 1
                    ? slotProps.formModel.freightType
                    : undefined,
                orderId:
                  slotProps.formModel.isPublic == 1
                    ? slotProps.formModel.orderId
                    : undefined,
                orderType:
                  slotProps.formModel.isPublic == 1
                    ? slotProps.formModel.orderType
                    : undefined,
                typeList: slotProps.formModel.isPublic == 1 ? 3 : undefined,
                ids:
                  slotProps.formModel.isPublic == 1
                    ? undefined
                    : slotProps.formModel.customerIds,
              }"
            />
          </template>

          <template v-slot:transactionWarehouse="slotProps">
            <AutoComplete
              ref="transactionWarehouseRef"
              :formModel="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
              :additionalParam="{
                flagAvailable: 'y',
                salesman: slotProps.formModel.salesman,
              }"
            />
          </template>

          <template v-slot:overseasAgency="slotProps">
            <template v-if="slotProps.formModel.overseasAgencyType === '2'">
              <!-- 类型为头程同行：海外代理取订舱代理的值 -->
              {{ slotProps.formModel.bookingSpaceProxyName || "--" }}
            </template>
            <AutoComplete
              v-else
              ref="overseasRef"
              :formModel="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
              :additionalParam="{
                isOverseasAgent: [1][slotProps.formModel.overseasAgencyType],
                typeList: [0, 3][slotProps.formModel.overseasAgencyType],
              }"
            />
          </template>
        </ComForm>
      </template>
    </ComDialog>
    <!-- <div v-if="!$route.query.id" @click="() => show('50000605', {})">show</div> -->
  </div>
</template>

<script>
import { querySearchList } from "@/api/common";
import { deepCopy } from "@/utils/index";
import {
  getOperationContentInfo,
  putOperationContent,
  getNodeState,
} from "@/api/operateManage/common";
import { mapActions,mapState } from "vuex";
import { contentFormCols, contentFormRules } from "./model.js";
import {
  getOrderConfigList,
  getOperationOrderConfigList,
} from "@/api/order/firstTransport.js";
export default {
  props: {},
  data() {
    return {
      dialogConfig: {
        appendToBody: true,
        width: "900px",
        footer: [
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.formRef.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.dialogRef.hide();
            },
          },
        ],
      },
      contentFormConfig: {
        formModel: {},
        labelWidth: "110px",
      },
      currencySlotArr: [
        {
          numKey: "insuredAmount", // 保险金额
          currencyKey: "insuranceAmountCurrency",
        },
      ],
      unitList: [],
      tempTrailerCols: [],
      configRes: {},
      noEcSeaLcl: true,
    };
  },
  computed: {
    ...mapState({
      dictionary: (state) => state.dictionary.dicsData,
    }),
  },
  methods: {
    handleChange(v, k) {
      // console.log('v, k==', v, k)
      const { orderType, freightType, operationOrderType, proxyType } =
        this.contentFormConfig.formModel;
      if ([2, 3, 4].includes(orderType)) {
        // 电商、传统
        switch (k) {
          case "containerTrailer":
            if (freightType === 0) {
              // 拖车类型 - 仓库集货才可编辑交货仓、预计交仓时间
              const trailerCols = this.tempTrailerCols.filter(
                (e) => e.id === k || v === "1"
              );
              this.$set(
                this.contentFormConfig.lists[0].fieldList[2].rows[0],
                "cols",
                trailerCols
              );
            }
            break;
          case "proxyType":
            const { config } = this.configRes;
            let customerIds = "",
              isPublic = undefined;
            if (
              !(operationOrderType == 0 && freightType == 1) &&
              orderType == 2
            ) {
              const data = config.filter((e) => e.value == v)[0];
              customerIds = data.customerIds;
              isPublic = data.isPublic;
              this.$refs.bookingRef?.setLabel({
                label: v == 1 ? "同行代理：" : "订舱代理：",
                placeholder: v == 1 ? "请选择同行代理" : "请选择订舱代理",
              });
            }
            this.$refs.formRef.setFormModel({
              bookingSpaceProxy: "",
              bookingSpaceProxyName: "",
              customerIds,
              isPublic,
            });
            this.$refs.bookingRef?.changeFocusRequest();
            break;
          case "overseasAgencyType":
            this.$refs.overseasRef?.changeFocusRequest();
            if (v === "2") {
              this.$refs.formRef?.setFormRules({}, ["overseasAgency"]);
            } else {
              this.$refs.formRef?.setFormRules({
                overseasAgency: contentFormRules({ orderType }).overseasAgency,
              });
            }
            this.$refs.formRef.setFormModel({
              overseasAgency: "",
              overseasAgencyName: "",
            });
            break;
          default:
            break;
        }
      } else {
        // 其他
        if (k === "orderBusinessType") {
          const idKey = v === "4" ? "reportCurrencyId" : "reportCustomsWay";
          const trailerCols = this.tempTrailerCols.filter(
            (e) => e.id !== idKey
          );
          this.$set(
            this.contentFormConfig.lists[0].fieldList[1].rows[0],
            "cols",
            trailerCols
          );
        }
      }
    },
    async show(
      oId,
      {
        isStaff = undefined,
        httpRequest = putOperationContent,
        successFunction = () => {},
      }
    ) {
      const res = await this.comRepeatedRequest(this, getOperationContentInfo, {
        oId,
      });
      const {
        operationOrderId,
        orderId,
        orderType,
        platform,
        reportCustomsWay,
        customsClearanceType,
        freightType,
        isMainBill,
        isWarehousing,
        transportMode,
        overseasAgencyType,
        outWarehouseWay,
        isClearance,
        operationOrderType, //0海运 1空运
        isTradeClauseD, //TRUE包含D开头的贸易条款  FALSE不包括
        headTransportMode
      } = res.data || {};
      let insureNodeRes = {};
      if ([2, 3, 4].includes(orderType)) {
        // 49 - 保险节点
        insureNodeRes =
          (await getNodeState({ operationOrderId: oId, nodeId: 49 })).data ||
          {};
      }
      /*
				freightType  0-FCL整柜 1-LCL散货
				isMainBill 是否主单 0-否 1-是, 9-子单
			*/
      const modeType = ["FCL", "LCL"][freightType];
      if (isMainBill === 1 && freightType === 0) {
        // FCL需要特殊处理主单的场景, 主单依据：is_main_bill = 1
        res.data.containerTrailer = "1";
        res.data.proxyType = "0";
      }
      const { proxyType } = res.data || {};
      this.noEcSeaLcl =
        !(operationOrderType == 0 && freightType == 1) && orderType == 2;
      if (![5, 6].includes(orderType)) {
        const httpRequest = orderId
          ? getOrderConfigList(orderId, orderType == 2 ? 1 : 2)
          : getOperationOrderConfigList(operationOrderId);
        await httpRequest.then((cRes = {}) => {
          this.configRes.config = cRes.data;
          cRes.data.map((e) => {
            if (e.value == proxyType) {
              this.configRes = {
                ...this.configRes,
                params: {
                  customerIds: e.customerIds,
                  isPublic: e.isPublic,
                },
              };
            }
          });
        });
      }
      const containerTrailer = this.typeConversion(res.data?.containerTrailer);
      const orderBusinessType = this.typeConversion(
        res.data?.orderBusinessType
      );
      this.contentFormConfig = {
        ...this.contentFormConfig,
        formModel: {
          ...res.data,
          ...this.configRes.params,
          containerTrailer,
          orderBusinessType,
          platform: this.typeConversion(platform),
          reportCustomsWay: this.typeConversion(reportCustomsWay),
          customsClearanceType: this.typeConversion(customsClearanceType),
          proxyType: this.typeConversion(proxyType, "number"),
          transportMode: this.typeConversion(transportMode),
          overseasAgencyType: this.typeConversion(overseasAgencyType),
          isWarehousing: this.typeConversion(isWarehousing),
          outWarehouseWay: this.typeConversion(outWarehouseWay),
          headTransportMode: this.typeConversion(headTransportMode)
        },
        httpRequest: (fData) => {
          if ([2, 3, 4].includes(orderType)) {
            if (freightType === 0 && fData.containerTrailer !== "1") {
              fData.transactionWarehouse = "";
              fData.warehousingTime = "";
            }
            if (fData.overseasAgencyType === "2") {
              fData.overseasAgency = fData.bookingSpaceProxy;
            }
          }
          return httpRequest({
            ...fData,
            isStaff,
          });
        },
        successFunction,
        formRules: contentFormRules({ modeType, orderType, isMainBill }),
        lists: contentFormCols({
          modeType,
          isMainBill,
          orderType,
          freightType,
          insureState: insureNodeRes?.state,
          isClearance,
          operationOrderType,
          configRes: this.configRes.config,
          proxyType,
          isTradeClauseD,
          headTransportMode
        }),
        afterMounted: () => {
          if ([2, 3, 4].includes(orderType)) {
            // 电商与传统
            if (freightType === 0) {
              this.tempTrailerCols = deepCopy(
                this.contentFormConfig.lists[0].fieldList[2].rows[0].cols
              );
            }
            this.handleChange(containerTrailer, "containerTrailer");
          } else {
            // 其他操作单
            this.tempTrailerCols = deepCopy(
              this.contentFormConfig.lists[0].fieldList[1].rows[0].cols
            );
            this.handleChange(orderBusinessType, "orderBusinessType");
          }
        },
      };

      this.dialogConfig.title = `${
        [2, 3, 4].includes(orderType) ? modeType : ""
      }修改`;
      await this["dictionary/getDictionary"]([
        "orderPlatform",
        "customsDeclarationType",
        "customsClearanceType",
        "orderBusinessType",
        "transportMode",
        "containerTrailerType",
      ]);
      this.getCurrency();
    },
    getCurrency() {
      // 获取币别
      const { insuranceAmountCurrency } = this.contentFormConfig.formModel;
      if (this.unitList.length) {
        this.contentFormConfig.formModel.insuranceAmountCurrency =
          insuranceAmountCurrency || this.unitList[0].value;
        this.$refs.dialogRef.show();
        return;
      }
      querySearchList({
        type: "currency",
        pageNum: 1,
        pageSize: 999,
      }).then((res) => {
        this.unitList = (res.rows || []).map((c) => ({
          label: c.code,
          value: c.id,
        }));
        this.contentFormConfig.formModel.insuranceAmountCurrency =
          insuranceAmountCurrency || this.unitList[0].value;
        this.$refs.dialogRef.show();
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content-form-box {
  .number-select {
    /deep/ {
      .el-input-number {
        .el-input__inner {
          border-radius: 4px 0 0 4px;
        }
      }
      .el-select {
        .el-input__inner {
          border-left: none;
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }
}
.slot-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .form-title {
    font-size: 14px;
    font-weight: bold;
    padding-left: 10px;
    border-left: 2px solid #00adb2;
    margin: 6px 0 24px;
    color: #515151;
  }
}
</style>
