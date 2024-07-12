<template>
  <div>
    <ComDialog ref="customDialog" :customDialog="customDialogConfig">
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          @handleChange="handleChange"
          v-if="
            $refs.customDialog &&
            $refs.customDialog.dialogVisible &&
            Object.keys(dictionary.dicsData).length
          "
        >
          <template v-slot:sonoTable="slotProps">
            <SonoTable
              ref="SonoTableRef"
              :formData="{
                ...slotProps.formModel,
                routeNoMangeName: estimatedData.routeNoMangeName,
              }"
            />
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
          <template v-slot:tips>
            <div class="form-tips">
              * 如存在同一航次中转站订舱的请复制新增登记信息
            </div>
          </template>
          <template v-slot:flightName="slotProps">
            <AutoComplete
              v-if="NAME_RESET"
              ref="flightNameRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                handle: changeflightName,
              }"
              :additionalParam="{
                cabinProxyId: slotProps.formModel.bookingSpaceProxyId
                  ? slotProps.formModel.bookingSpaceProxyId
                  : slotProps.formModel.operateMainId,
                sameIndustryProxyId: slotProps.formModel.sameIndustryProxyId,
                freightType: slotProps.formModel.freightType,
                type: slotProps.formModel.operationOrderType == 1 ? 3 : 0,
                startPortIds: slotProps.formModel.startPortId
                  ? slotProps.formModel.startPortId
                  : undefined,
                endPortIds: slotProps.formModel.endPortId
                  ? slotProps.formModel.endPortId
                  : undefined,
              }"
            />
          </template>
          <template
            v-for="(aItem, aIdx) in [
              'sameIndustryProxyId',
              'shipCompany',
              'route',
            ]"
            v-slot:[aItem]="slotProps"
          >
            <AutoComplete
              :ref="`${aItem}Ref`"
              :key="aIdx"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                disabled: slotProps.formModel.voyageType == 0 ? true : false,
              }"
            />
          </template>
          <template
            v-for="(eItem, eIdx) in ['flightByName', 'name']"
            v-slot:[eItem]="slotProps"
          >
            <el-input
              v-if="slotProps.formModel.freightType == 1"
              v-model="slotProps.formModel[eItem]"
              :disabled="slotProps.formModel.voyageType == 0 ? true : false"
              :placeholder="slotProps.fieldItem.placeholder"
              :key="eIdx"
            >
            </el-input>
            <AutoComplete
              v-else-if="
                eItem == 'name' &&
                slotProps.formModel.freightType == 0 &&
                NAME_RESET
              "
              :ref="`${eItem}Ref`"
              :key="eIdx"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                handle: changeName,
                handleCreate: addName,
                refreshRequest: refreshRequestRoute,
                disabled: fclNoSono,
              }"
              :additionalParam="{
                startPortIds: slotProps.formModel.startPortId
                  ? slotProps.formModel.startPortId
                  : undefined,
                endPortIds: slotProps.formModel.endPortId
                  ? slotProps.formModel.endPortId
                  : undefined,
                freightType: slotProps.formModel.freightType,
                type: slotProps.formModel.operationOrderType == 1 ? 3 : 0,
              }"
            />
          </template>

          <template
            v-for="(pItem, pIdx) in [
              'sailOpenTime',
              'etaTime',
              'cabinOpenTime',
              'cutGateTime',
            ]"
            v-slot:[pItem]="slotProps"
          >
            <el-date-picker
              v-model="slotProps.formModel[pItem]"
              :key="pIdx"
              type="date"
              :disabled="slotProps.formModel.voyageType == 0 ? true : false"
              :value-format="slotProps.fieldItem.valueFormat"
              :placeholder="slotProps.fieldItem.placeholder"
            >
            </el-date-picker>
          </template>
          <template v-slot:titleDes="slotProps">
            <span class="titleDes-class">* 整柜请先维护航次 和SONo</span>
          </template>
        </ComForm>
      </template>
    </ComDialog>
    <AddEditDialog ref="dialog" @handleAddSuccess="handleAddSuccess" />
  </div>
</template>

<script>
import { getConfig, getRules, formRulesLists } from "./model";
import { mapActions, mapState } from "vuex";
import {
  getSonoGroupBoxModelList,
  operationBooking,
  POSTRouteNoManageFcl,
  addOperateSono,
  POSTOrderIsolateConfig,
} from "@/api/marketManage/airline.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    SonoTable: () => import("./components/sono"),
    EstimatedCost: () =>
      import(
        "@/views/marketManage/freightRate/components/EstimatedCost/index.vue"
      ),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    AddEditDialog: () =>
      import(
        "@/views/marketManage/airlineFlight/components/AddEditDialog/index.vue"
      ),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      status: 0,
      customDialogConfig: {
        title: "航次信息",
        width: "950px",
        dataStatus: 0,
        useFooter: "footer",
        type: "",
        footer: [
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              // this.status = 1; //1为确认数据
              // this.customDialogConfig.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "100px",
        visibleAll: true,
      },
      estimatedData: {},
      packingMode: 0,
      freightRateId: "",
      submitBtnType: "",
      NAME_RESET: true, //重置已有航次
      refreshRequestRoute: false,
      fclNoSono: false,
    };
  },
  created() {
    // this.changeAirline();
    this["dictionary/getDictionary"]("marketManage");
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    submitFormRequest(formModel) {
      const {
        id,
        name,
        freightType,
        remark,
        flightName,
        sameIndustryProxyId,
        sono,
        flightByName,
        shipCompany,
        route,
        sailOpenTime,
        etaTime,
        cabinOpenTime,
        cutGateTime,
        voyageType,
        startPortId,
        endPortId,
      } = formModel;
      if (freightType == 1) {
        //LCL
        const params = {
          id: voyageType == 1 ? undefined : flightName.id, //已登记传已经订舱ID，新航次不传
          sameIndustryProxyId,
          sono,
          flightByName,
          flightName: flightByName,
          name,
          shipCompany,
          shipCompanyId: shipCompany?.id
            ? shipCompany.id
            : shipCompany
            ? shipCompany
            : "",
          route,
          routeId: route?.id ? route?.id : route ? route : "",
          sailOpenTime,
          etaTime,
          cabinOpenTime,
          cutGateTime,
          remark,
          freightRateId: this.freightRateId, //运价ID
          operationOrderId: id,
          startPortId,
          endPortId,
        };
        return new Promise((resolve, reject) => {
          operationBooking(params)
            .then((res) => {
              const { data } = res;
              const obj = {
                routeNoManageId: data,
                sono,
                orderId: id,
              };
              addOperateSono(obj).then((sRes) => {
                resolve(sRes);
              }).catch(() => reject());
            })
            .catch(() => reject());
        });
      } else {
        //FCL
        const sonoObj = this.$refs.SonoTableRef?.getSonoObj();
        const params = {
          ...sonoObj,
          id: name.id || name,
          routeNoManageId: name.id || name,
          operationOrderId: id,
          freightRateId: this.freightRateId, //运价ID
          remark,
          startPortId,
          endPortId,
        };
        return this.submitBtnType == "register"
          ? POSTRouteNoManageFcl(params)
          : operationBooking(params);
      }
    },
    show(row, btnType, fclNoSono) {
      this.submitBtnType = btnType;
      const {
        orderId,
        orderType,
        operationOrderType,
        shippingMode,
        freightType,
        startPortId,
        endPortId,
        bookingSpaceProxyId,
        bookingSpaceProxy,
        operateMain,
        sameIndustryProxyId,
        operateMainId,
        flightId,
        flightName,
        shipCompanyId,
        shipCompanyName,
      } = row;
      this.estimatedData = {
        orderId,
        orderType,
        shippingMode,
      };
      this.fclNoSono = !!fclNoSono;
      this.customDialogConfig.title =
        freightType == 1 ? "LCL订舱登记" : "FCL订舱登记";
      this.packingMode = Number(freightType || 0);
      this.formConfig = {
        ...this.formConfig,
        formModel: {
          ...row,
          voyageType: "1", //航次类型默认新航次
          shipCompanyName: "",
          routeName: "",
          flightName,
          name: flightId,
          bookingSpaceProxy: bookingSpaceProxy
            ? bookingSpaceProxy
            : operateMain,
          shipCompany: shipCompanyId,
          shipCompanyName,
        },
        lists: getConfig({
          freightType,
          startPortId,
          endPortId,
          handlePort: this.changePort,
          operationOrderType,
          sameIndustryProxyId,
          btnType, //解绑与登记SONO不展示运价关联
        }),
        formRules: getRules({ freightType }),
      };
      if (flightId && flightId != null && freightType == 0) {
        //fcl登记SONO
        this.changeName({ id: flightId }, "register");
      }
      this.$refs.customDialog.show();
    },
    changeName(row = {}, type) {
      if (row?.id) {
        const { id: routeNoManageId, flightName, name, code } = row;
        const routeNoMangeName = `${flightName ? flightName : "--"}/${
          name ? name : "--"
        }/${code ? `(${code})` : ""}`;
        this.estimatedData = {
          ...this.estimatedData,
          routeNoManageId,
          routeNoMangeName,
        };
        const { id } = this.formConfig.formModel;
        const params = {
          orderId: id,
          routeNoManageId,
        };
        getSonoGroupBoxModelList(params).then((res) => {
          if (type == "register") {
            const { rows } = res;
            const { id } = this.formConfig.formModel;
            const arr = rows.map((e) => {
              const { data } = e;
              let sono = [];
              data.map((sonE) => {
                if (sonE.orderId == id) {
                  sono.push(sonE.id);
                }
              });
              return {
                ...e,
                sono,
              };
            });
            this.$refs.SonoTableRef?.setData(arr);
          } else {
            const { rows } = res;
            const { startPort, endPort, id } = row;
            this.$refs.dialogForm?.setFormModel({
              name: id,
              flightName,
              startPortId: this.typeConversion(startPort, "number"),
              endPortId: this.typeConversion(endPort, "number"),
            });
            this.$refs.SonoTableRef?.setData(rows);
            this.refreshRequestRoute = !this.refreshRequestRoute;
          }
          // this.NAME_RESET = false;
          // this.$nextTick(() => {
          //   this.NAME_RESET = true;
          // });
        });
      } else {
        this.$refs.SonoTableRef?.setData([]);
      }
    },
    changePort(val, type) {
      //切换起运港和目的港重新调用航次查询接口
      if (type == 1) {
        //Lcl
        this.$refs.flightNameRef?.changeFocusRequest();
      } else {
        //FCL
        this.$refs.nameRef[0].changeFocusRequest();
      }
    },
    changeflightName(e) {
      this.estimatedData = {
        ...this.estimatedData,
        routeNoManageId: e.id,
      };
      const params = {
        flightByName: e.flightName || "",
        name: e.name || "",
        route: e.routeId,
        routeName: e.routeName,
        shipCompany: e.shipCompanyId,
        shipCompanyName: e.shipCompany,
        cabinProxyId: this.typeConversion(e.cabinProxyId, "number"),
        sameIndustryProxyId: this.typeConversion(
          e.sameIndustryProxyId,
          "number"
        ),
        etaTime: e.etaTime || "",
        cutGateTime: e.cutGateTime || "",
        cabinOpenTime: e.cabinOpenTime || "",
        sailOpenTime: e.sailOpenTime || "",
        // startPort: this.typeConversion(e.startPort, "number"),
        // endPort: this.typeConversion(e.endPort, "number"),
        startPortId: this.typeConversion(e.startPort, "number"),
        endPortId: this.typeConversion(e.endPort, "number"),
        transfer: this.typeConversion(e.transfer, "number"),
        remark: e.remark || "",
      };
      this.$refs.dialogForm?.setFormModel(params);
      this.NAME_RESET = false;
      this.$nextTick(() => {
        this.NAME_RESET = true;
      });
    },
    handleEstimated(val) {
      this.freightRateId = val;
    },
    hide() {
      this.$emit("handleSuccess");
      this.$refs.customDialog.hide();
    },
    handleSuccess(res = {}) {
      this.$emit("handleSuccess", res.data);
      this.hide();
    },
    addName(row = {}) {
      //新增航次
      const { startPortId: startPort, endPortId: endPort } =
        this.formConfig.formModel;
      POSTOrderIsolateConfig().then((res) => {
        const { data } = res;
        this.$refs.dialog.show(
          { ...row, startPort, endPort, WEB_ids: data },
          true
        );
      });
    },
    handleChange(v, k) {
      if (k == "voyageType") {
        let ruleValide = {}; //ruleValide需要新增的表单校验
        let removeRule = []; //removeRule需要移除的表单校验
        switch (v) {
          case "0":
            ruleValide = {
              flightName: formRulesLists["flightName"],
            };
            break;
          case "1":
            removeRule = ["flightName"];
            break;
        }
        this.$refs.dialogForm?.setFormRules(ruleValide, removeRule); //根据用户的选择新增与删除校验
      }
    },
    handleAddSuccess(id, row) {
      const { flightByName: flightName, name, code, startPort, endPort } = row;
      const params = {
        id,
        startPort,
        endPort,
        flightName,
        name,
        code,
      };
      this.changeName(params);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-tips {
  color: #5094ff;
  border-bottom: 1px solid #e2e2e2;
}
.titleDes-class {
  color: #5094ff;
}
</style>
