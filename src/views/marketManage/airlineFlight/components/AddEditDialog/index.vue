<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      class="airline-dialog"
    >
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="
            $refs.customDialog &&
            $refs.customDialog.dialogVisible &&
            Object.keys(dictionary.dicsData).length
          "
          @handleChange="handleChange"
        >
          <template v-slot:flightByName="slotProps">
            <div class="diaLogPortType">
              <el-input
                v-model="slotProps.formModel.flightByName"
                placeholder="请填写船名/航班名"
                @change="(val) => handleChange(val, 'flightByName')"
              ></el-input>

              <span class="tag-green-color ml5">{{
                getDictObj(dictionary.dicsData.orderType, reqsParams.orderType)
              }}</span>
            </div>
          </template>
          <template v-slot:tableData>
            <EstimatedCost
              ref="estimatedCostRef"
              :formData="estimatedData"
              :packingMode="packingMode"
              :showSelectFreight="true"
              @handleChange="handleEstimated"
            />
          </template>
        </ComForm>
      </template>
    </ComDialog>
    <SoNoCheckIn ref="soNoCkInDialog" @close="hide" />
  </div>
</template>

<script>
import {
  operationBooking,
  addAirFlight,
  editAirFlight,
} from "@/api/marketManage/airline";
import { config } from "./model";
import { parseTime } from "@/utils/ruoyi";
import { mapActions, mapState } from "vuex";
import { addPeerShipping } from "@/api/marketManage/airline";
import { typeConversion } from "@/utils/index";
import { addSono, getRouteNoBookingInfo } from "@/api/marketManage/airline.js";
import { msgBox } from "@/utils/confirmBox.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    SoNoCheckIn: () =>
      import(
        "@/views/marketManage/forBooking/components/SoNoCheckIn/index.vue"
      ),
    EstimatedCost: () =>
      import(
        "@/views/marketManage/freightRate/components/EstimatedCost/index.vue"
      ),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      status: 0,
      customDialogConfig: {
        title: "航次信息",
        width: "850px",
        dataStatus: 0,
        appendToBody: this.appendToBody,
        useFooter: "footer",
        type: "",
      },
      footerSubmit: [
        {
          text: "确定",
          type: "primary",
          handleClick: () => {
            this.status = 1; //1为确认数据
            this.customDialogConfig.dataStatus = 1;
            this.$refs.dialogForm.submitForm();
          },
        },
      ],
      footerClose: [
        {
          text: "取消",
          plain: true,
          handleClick: () => {
            this.$refs.customDialog.handleClose();
          },
        },
      ],
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "120px",
        lists: config().lists, // 表单渲染列表
        formRules: config().formRules, // 表单校验规则
        visibleAll: true,
      },
      reqsParams: {},
      estimatedData: {},
      packingMode: 0,
      freightRateId: "",
      isFlight: false,
      currFlight: {},
    };
  },
  created() {
    this["dictionary/getDictionary"]("marketManage");
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleEstimated(val) {
      this.freightRateId = val;
    },
    submitFormRequest(formModel) {
      // if (!this.freightRateId && this.$refs.estimatedCostRef) {
      //   return this.$refs.estimatedCostRef.getEstimatedCost();
      // }
      if (this.status === 0) {
        return new Promise((resolve) => {
          resolve({
            isHaveFlightName: formModel.flightName?.flightName || "", // 已有航班名
            id: formModel.flightName?.id || undefined,
            ...this.addFormModel(formModel),
            sono: formModel.sono,
            openSoNoSign: "checkIn",
            freightRateId: this.freightRateId,
          });
        });
      } else if (this.status === 1) {
        let params = {
          ...this.addFormModel(formModel),
          id: formModel.id || "",
          status:
            this.type === "edit"
              ? formModel.status
              : this.customDialogConfig.dataStatus,
          freightRateId: this.freightRateId,
        };
        // console.log("params", params);
        if (this.isFlight) {
          const editList = {
            add: addAirFlight,
            edit: editAirFlight,
          };
          return editList[this.type](params);
        }
        return operationBooking(params);
      }
    },
    changeFlightName(row) {
      //手动切换已有航班名
      this.setDlgFormModel(row);
    },
    async show(row, isFlight) {
      const { WEB_ids, lineType } = row;
      this.currFlight = {};
      this.isFlight = isFlight;
      if (row.type == 1) {
        row.bookType = 10;
      } else if (row.type == 2) {
        row.bookType = 20;
      }
      this.estimatedData = {
        orderId: row.orderId,
        orderType: row.orderType,
        shippingMode: row.shippingMode,
      };
      this.packingMode = Number(row.freightType || 0);
      if (row.operationType) {
        //市场订舱登记会进入这个判断
        const { operationOrderId } = row;
        const initData = await getRouteNoBookingInfo(operationOrderId);
        const { cabinProxyId, startPort, endPort, sameIndustryProxyId } =
          initData?.data || {};
        this.reqsParams = {
          ...row,
        };
        this.type = "add";
        const typeFooter = this.footerSoNo(row.freightType, row.isMainBill);
        this.customDialogConfig = {
          ...this.customDialogConfig,
          title: "航次信息(新增)",
          width: "820px",
          footer: [...typeFooter, ...this.footerClose],
        };
        this.formConfig = {
          ...this.formConfig,
          formModel: {
            cabinProxyId,
            sameIndustryProxyId,
            startPort,
            endPort,
            operationOrderId,
          },
          lists: config({
            isFlight,
            changeFlightName: this.changeFlightName,
            lineType,
          })[
            row.isMainBill == 0 && row.freightType == "1"
              ? "traditionLists"
              : "lists"
          ],
        };
      } else {
        this.formConfig = {
          ...this.formConfig,
          lists: config({
            isFlight,
            changeFlightName: this.changeFlightName,
            ids: WEB_ids,
            lineType,
          })[row.id ? "editLists" : "lists"],
          formRules: config({
            isFlight,
            changeFlightName: this.changeFlightName,
          }).formRules,
        };
        if (row.id) {
          this.type = "edit";
          const typeFooter = this.footerSubmit;
          this.customDialogConfig = {
            ...this.customDialogConfig,
            title: "航次信息(编辑)",
            width: "820px",
            footer: [...typeFooter, ...this.footerClose],
          };
          const {
            routeId,
            routeCode,
            routeName,
            shipCompanyId,
            shipCompany,
            ...eRow
          } = row;
          this.formConfig.formModel = {
            ...eRow,
            flightByName: row.flightName,
            route: routeId
              ? {
                  id: routeId,
                  value: routeId,
                  code: routeCode,
                  label: routeName,
                }
              : "",
            shipCompany: {
              id: shipCompanyId,
              value: shipCompanyId,
              nameCn: shipCompany,
            },
            startPort: typeConversion(row.startPort, "number"),
            endPort: typeConversion(row.endPort, "number"),
            transfer: typeConversion(row.transfer, "number"),
          };
        } else {
          this.type = "add";
          this.customDialogConfig = {
            ...this.customDialogConfig,
            title: "航次信息(新增)",
            width: "820px",
            footer: [...this.footerSubmit, ...this.footerClose],
          };
          this.formConfig.formModel = {
            sailOpenTime: new Date(),
            cabinOpenTime: new Date(),
            cutGateTime: new Date(),
            cabinProxyName: "",
            startPort: row.startPort && typeConversion(row.startPort, "number"),
            endPort: row.endPort && typeConversion(row.endPort, "number"),
          };
        }
      }
      this.$refs.customDialog.show();
    },
    footerSoNo(freightType, isMainBill) {
      return [
        {
          text:
            freightType === "1" && isMainBill === 0 ? "确定" : "继续登记SoNo",
          type: "primary",
          handleClick: () => {
            this.status = 0; // 0 为登记Sono
            this.$refs.dialogForm.submitForm();
          },
        },
      ];
    },
    hide() {
      this.$emit("handleSuccess");
      this.currFlight = {};
      this.$refs.customDialog.hide();
    },
    addFormModel(formModel) {
      const { undefined, airGroup, code, routeName, status, ...newModel } =
        formModel;
      return {
        flightName: newModel.flightByName,
        routeId: newModel.route?.id || null,
        routeCode: newModel.route?.code || null,
        routeName: newModel.route?.label || null,
        lineType: newModel.route?.lineType || null, //需要航线
        cabinProxyId: newModel.cabinProxyId,
        sameIndustryProxyId: newModel.sameIndustryProxyId,
        shipCompanyId: newModel.shipCompany?.id,
        shipCompany: newModel.shipCompany?.nameCn,
        sailOpenTime: parseTime(newModel.sailOpenTime, "{y}-{m}-{d}"),
        cabinOpenTime: parseTime(newModel.cabinOpenTime, "{y}-{m}-{d}"),
        cutGateTime: parseTime(newModel.cutGateTime, "{y}-{m}-{d}"),
        etaTime: newModel.etaTime,
        name: newModel.name,
        ...(this.isFlight
          ? {
              startPort: newModel.startPort,
              endPort: newModel.endPort,
              transfer: newModel.transfer,
            }
          : {
              startPortId: newModel.startPort,
              endPortId: newModel.endPort,
              transferId: newModel.transfer,
            }),
        remark: newModel.remark,
        operationOrderId: newModel.operationOrderId,
        status: 1,
      };
    },
    setDlgFormModel(e) {
      const params = {
        // flightName: e.flightName,
        flightByName: e.flightName || "",
        name: e.name || "",
        // routeId: e.routeId || "",
        route: {
          id: e.routeId,
          value: e.routeId,
          code: e.routeCode,
          label: e.routeName,
        },
        // shipCompany: e.shipCompanyId || "",
        shipCompany: {
          id: e.shipCompanyId,
          value: e.shipCompanyId,
          nameCn: e.shipCompany,
        },
        cabinProxyId: e.cabinProxyId,
        cabinProxyName: e.cabinProxyName,
        sameIndustryProxyId: typeConversion(e.sameIndustryProxyId, "number"),
        etaTime: e.etaTime || "",
        cutGateTime: e.cutGateTime || "",
        cabinOpenTime: e.cabinOpenTime || "",
        sailOpenTime: e.sailOpenTime || "",
        startPort: typeConversion(e.startPort, "number"),
        endPort: typeConversion(e.endPort, "number"),
        transfer: typeConversion(e.transfer, "number"),
        remark: e.remark || "",
      };
      this.$refs.dialogForm?.setFormModel(params);
      // this.estimatedData.startPortId = params.startPort;
      // this.estimatedData.endPortId = params.endPort;
      // this.$nextTick(() => {
      //   this.$refs.estimatedCostRef.renewFreight();
      // });
    },
    handleChange(val, prop) {
      if (prop === "flightName") {
        const {
          id,
          cabinProxyId,
          cabinProxyName,
          flightName,
          name,
          endPort,
          endPortName,
          startPort,
          startPortName,
          sameIndustryProxyId,
        } = val || {};
        this.currFlight = {
          id,
          cabinProxyId,
          sameIndustryProxyId,
          cabinProxyName,
          endPortName,
          startPortName,
          flightByName: flightName,
          name,
          endPort,
          startPort,
        };
        this.estimatedData.routeNoManageId = id;
        this.$nextTick(() => {
          this.$refs.estimatedCostRef?.renewFreight();
        });
      }
      if (
        [
          "cabinProxyId",
          "sameIndustryProxyId",
          "flightByName",
          "name",
          "endPort",
          "startPort",
        ].includes(prop)
      ) {
        if (this.currFlight.id) {
          const key = [
            "cabinProxyId",
            "sameIndustryProxyId",
            "flightByName",
            "name",
            "endPort",
            "startPort",
          ].find((item) => item === prop);
          if (this.currFlight[key] != val) {
            this.confirmBox(prop);
          }
        }
      }
    },
    confirmBox(prop) {
      const msg =
        "起运港、目的港、船名/航班名、船次/航次、订舱代理修改后为新的船/航班，无关联运价可选";
      const title = "确认提示";
      const className = "el-icon-warning text-warning";
      msgBox(
        this,
        { title, className, msg },
        () => {
          this.currFlight = {};
          this.estimatedData.routeNoManageId = "";
          this.$nextTick(() => {
            this.$refs.estimatedCostRef?.renewFreight();
          });
        },
        () => {
          const {
            cabinProxyId,
            cabinProxyName,
            sameIndustryProxyId,
            sameIndustryProxyName,
            endPortName,
            startPortName,
            flightByName,
            name,
            endPort,
            startPort,
          } = this.currFlight;
          const params = {};
          switch (prop) {
            case cabinProxyId:
              params.cabinProxyId = cabinProxyId;
              params.cabinProxyName = cabinProxyName;
              break;
            case endPort:
              params.endPort = endPort;
              params.endPortName = endPortName;
              break;
            case startPort:
              params.startPort = startPort;
              params.startPortName = startPortName;
              break;
            case flightByName:
              params.flightByName = flightByName;
              break;
            case name:
              params.name = name;
              break;
            case sameIndustryProxyId:
              params.sameIndustryProxyId = sameIndustryProxyId;
              params.sameIndustryProxyName = sameIndustryProxyName;
              break;
            default:
              break;
          }
          this.$refs.dialogForm.setFormModel(params);
        }
      );
    },
    handleSuccess(res = {}) {
      let { openSoNoSign, isHaveFlightName, id, sono, ...nRes } = res;
      if (openSoNoSign === "checkIn") {
        const isSoNoEdit =
          isHaveFlightName && isHaveFlightName === nRes.flightName;
        if (isSoNoEdit) {
          nRes.id = id;
        }
        // const addOrEditAirFlight = isSoNoEdit ? editAirFlight : addAirFlight;
        operationBooking(nRes).then((aRes) => {
          if (aRes.data) {
            const {
              orderType,
              operationOrderId,
              orderNo,
              freightType,
              isMainBill,
              operationOrderIds,
            } = this.reqsParams;
            if (freightType === "1" && isMainBill === 0) {
              // const oParams = {
              //   operationOrderId, // 操作单id
              //   operationOrderIds, //操作单集合
              //   orderNo, // 操作单号
              //   routeId: aRes.data, // 航次
              //   remark: nRes.remark, // 备注
              //   sono,
              // };
              const oParams = {
                routeNoManageId: aRes.data, //航次id
                sono: sono, //sono号
                orderId: operationOrderId, //操作单id
                // boxModelId: 1, //散货没有柜型
              };
              addSono(oParams).then((res) => {
                this.$emit("handleSuccess", res.data, aRes);
                this.hide();
              });
              // addPeerShipping(oParams).then((res) => {
              //   this.$emit("handleSuccess", res.data);
              //   this.hide();
              // });
            } else {
              this.openSoNoCheckIn(aRes.data);
            }
          }
        });
      } else {
        const params = this.$refs.dialogForm.getFormParams();
        this.$emit("handleAddSuccess", res.data, params);
        this.$emit("handleSuccess", res.data);
        this.hide();
      }
    },
    openSoNoCheckIn(routeId) {
      // console.log(this.formConfig);
      this.reqsParams = {
        ...this.reqsParams,
        routeId,
      };
      this.$refs.soNoCkInDialog.show(this.reqsParams, this.isEdit);
    },
  },
};
</script>
<style lang="scss" scoped>
.airline-dialog {
  /deep/ {
    .el-radio {
      margin-right: 10px;
    }
  }
  .mark-icon {
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 12px;
    margin-left: 5px;
    border: 1px solid #66a5ff;
  }
}
.diaLogPortType {
  display: flex;
  align-items: center;
  .el-tag {
    margin-left: 10px;
  }
}
</style>
