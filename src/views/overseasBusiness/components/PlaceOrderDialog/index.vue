<template>
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    @onClose="handleClose"
  >
    <template v-slot:content>
      <template v-if="dialogVisible">
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          @handleChange="handleChange"
        />

        <ComTabs :tabsConfig="tabsConfig">
          <template v-slot:slotTabsRight>
            <!-- <el-radio-group
              :disabled="
                !!(
                  costCountObj.deliveryCostCount ||
                  costCountObj.warehouseCostCount
                )
              "
              v-model="showTabNum"
              v-if="tabsRightObj[tabType].length > 1"
            >
              <template v-for="item in tabsRightObj[tabType]">
                <el-radio :key="item.value" :label="item.value">{{
                  item.label
                }}</el-radio>
              </template>
            </el-radio-group> -->
            <el-checkbox
              :disabled="!!costCountObj[item.value]"
              v-for="item in tabsRightObj[tabType]"
              :key="item.value"
              v-model="showTabNum"
              :true-label="item.value"
              false-label=""
              >{{ item.label }}</el-checkbox
            >
          </template>
          <template v-for="tab in tabsConfig.tabs">
            <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
              <ComForm
                :ref="`tabsForm${tab.name}`"
                :formConfig="tabsFormConfig[tab.name]"
                class="tabs-form"
                @handleChange="(...data) => handleChange(...data, tab.name)"
              >
                <template v-slot:agent="slotProps">
                  <AutoComplete
                    ref="agentRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      ...slotProps.fieldItem,
                      refreshRequest: agentRefreshRequest,
                    }"
                    :additionalParam="{
                      typeList: slotProps.formModel.agentType == 0 ? '0' : '3',
                      isOverseasAgentTow:
                        slotProps.formModel.agentType == 0 ? 1 : undefined,
                    }"
                  />
                </template>
                <template v-slot:deliverAgent="slotProps">
                  <AutoComplete
                    ref="deliverAgentRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      ...slotProps.fieldItem,
                      refreshRequest: deliverAgentRefreshRequest,
                    }"
                    :additionalParam="{
                      typeList:
                        slotProps.formModel.delivertAgentType == 0 ? '0' : '3',
                      isOverseasAgentTow:
                        slotProps.formModel.delivertAgentType == 0
                          ? 1
                          : undefined,
                    }"
                  />
                </template>
                <template v-slot:startPortId="slotProps">
                  <AutoComplete
                    ref="startPortRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      ...slotProps.fieldItem,
                      refreshRequest: portRefreshRequest,
                      disabledArr: [slotProps.formModel.endPortId],
                    }"
                    :additionalParam="{
                      typeList:
                        slotProps.formModel.transportMode == 0
                          ? '0,1,2'
                          : '3,4',
                    }"
                  />
                </template>
                <template v-slot:endPortId="slotProps">
                  <AutoComplete
                    ref="endPorttRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      ...slotProps.fieldItem,
                      refreshRequest: portRefreshRequest,
                      disabledArr: [slotProps.formModel.startPortId],
                    }"
                    :additionalParam="{
                      typeList:
                        slotProps.formModel.transportMode == 0
                          ? '0,1,2'
                          : '3,4',
                    }"
                  />
                </template>
                <template v-slot:deliveryPlace="slotProps">
                  <AutoComplete
                    ref="deliveryPlaceRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      ...slotProps.fieldItem,
                      refreshRequest: deliveryPlaceRefreshRequest,
                      disabled: !customerId,
                      placeholder: !customerId
                        ? '请先选择委托人'
                        : slotProps.fieldItem.placeholder,
                    }"
                    :additionalParam="{
                      customerId: customerId,
                    }"
                    @selectHandleChange="
                      (val) =>
                        handleChange(val, slotProps.fieldItem.id, tab.name)
                    "
                  />
                </template>
              </ComForm>
            </el-tab-pane>
          </template>
        </ComTabs>
      </template>
    </template>
  </ComDialog>
</template>

<script>
import {
  getDirecrClearanceInfo,
  getDeliveryClearanceInfo,
  getWarehouseClearanceInfo,
  saveOverseaOrder,
  clearanceRegister,
  removeClearance,
} from "@/api/operateRecord/customsClearance";
import { formCom, customsClearance, delivery, warehousing } from "./model";
import { msgBox } from "@/utils/confirmBox.js";
import { handleDetailData } from "@/views/overseasBusiness/components/utils.js";
export default {
  props: {
    tabType: {
      type: Number,
      default: 1, // 1=清关信息 2=派送登记 3=存仓入库
    },
    title: {
      type: String,
      default: "海外清关",
    },
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTabs: () => import("_comp/ComTabs"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    const tabsObj = {
      1: {
        label: "清关信息",
        name: "1",
        prop: "directClearance",
        req: getDirecrClearanceInfo,
      },
      2: {
        label: "派送登记",
        name: "2",
        prop: "devlierClearce",
        req: getDeliveryClearanceInfo,
      },
      3: {
        label: "存仓入库",
        name: "3",
        prop: "warehouseClearanceDto",
        req: getWarehouseClearanceInfo,
      },
    };
    const tabsParam = {
      1: {
        label: "清关",
        value: 1,
      },
      2: {
        label: "派送",
        value: 2,
      },
      3: {
        label: "存仓入库",
        value: 3,
      },
    };
    return {
      dialogVisible: false,
      tabsObj,
      tabsRightObj: {
        1: [tabsParam[2], tabsParam[3]],
        2: [tabsParam[1]],
        3: [tabsParam[1]],
      },
      tabsConfig: {
        activeName: `${this.tabType}`,
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [],
      },
      customDialogConfig: {
        title: this.title,
        width: "760px",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "确定",
            type: "primary",
            handleClick: this.handleSave,
          },
        ],
      },
      formConfig: {
        ...formCom(),
      },
      tabsFormConfig: {
        1: {
          formModel: { agentType: "0", transportMode: "0" },
          ...customsClearance(),
          labelWidth: "102px",
        },
        2: {
          formModel: { delivertAgentType: "0", deliveryPlaceType: "" },
          ...delivery,
          labelWidth: "115px",
        },
        3: { ...warehousing, labelWidth: "102px" },
      },
      showTabNum: "",
      overseaBusinessTypes: [],
      agentRefreshRequest: false,
      deliverAgentRefreshRequest: false,
      deliveryPlaceRefreshRequest: false,
      portRefreshRequest: false,
      customerId: "",
      costCountObj: {},
      dataObj: {},
    };
  },
  watch: {
    showTabNum(val, oldVal) {
      const types = [this.tabType];
      if (this.dataObj[oldVal]?.id && this.dialogVisible) {
        this.handleConfirmBox(oldVal, this.dataObj[oldVal]?.id)
          .catch(() => {
            this.showTabNum = oldVal;
          })
          .then(() => {
            if (val) {
              types.push(val);
            }
            this.tabsConfig.activeName = `${this.tabType}`;
            this.overseaBusinessTypes = types;
            this.handleTabs(types);
          });
      } else {
        if (val) {
          types.push(val);
        }
        this.tabsConfig.activeName = `${this.tabType}`;
        this.overseaBusinessTypes = types;
        this.handleTabs(types);
      }
    },
  },
  methods: {
    getDetails(id) {
      const req = this.tabsObj[this.tabType].req;
      return req(id).then((res) => {
        return handleDetailData(res.data);
      });
    },
    async show({ types = [this.tabType], ...row }) {
      const { id } = row;
      const formData = id ? await this.getDetails(id) : {};
      const {
        directClearanceOrderDetail,
        deliveryClearanceOrderDeatail,
        warehouseOrderDetailVo,
        productCount,
        ...data
      } = formData;
      this.customerId = data.bailorPeopleId;
      const directCostCount = directClearanceOrderDetail?.costCount,
        deliveryCostCount = deliveryClearanceOrderDeatail?.costCount,
        warehouseCostCount = warehouseOrderDetailVo?.costCount;
      if (
        directClearanceOrderDetail ||
        deliveryClearanceOrderDeatail ||
        warehouseOrderDetailVo
      ) {
        this.formConfig = {
          formModel: {
            ...this.formConfig.formModel,
            ...data,
          },
          ...formCom(
            directCostCount || deliveryCostCount || warehouseCostCount,
            productCount
          ),
        };
        const dataObj = {
          1: directClearanceOrderDetail,
          2: deliveryClearanceOrderDeatail,
          3: warehouseOrderDetailVo,
        };
        this.dataObj = dataObj;
        types = [this.tabType, ...types.filter((k) => k !== this.tabType)];
        types.forEach((k) => {
          this.tabsFormConfig[k].formModel = {
            ...this.tabsFormConfig[k].formModel,
            ...(dataObj[k] || {}),
          };
          if (k === 1) {
            this.tabsFormConfig[k] = {
              ...this.tabsFormConfig[k],
              ...customsClearance(
                directCostCount,
                directClearanceOrderDetail?.agentType
              ),
              labelWidth: "102px",
            };
          }
        });
      }
      this.overseaBusinessTypes = types;
      this.handleTabs(types);
      if (types[1]) {
        this.showTabNum = types[1];
      }
      this.costCountObj = {
        1: directCostCount,
        2: deliveryCostCount,
        3: warehouseCostCount,
      };
      this.dialogVisible = true;
      this.$refs.customDialog.show();
    },
    handleTabs(types = this.types) {
      this.types = types;
      this.tabsConfig.tabs = types.map((type) => this.tabsObj[type]);
      console.log("this.tabs", this.tabs);
    },
    handleChange(val, prop, tabName) {
      console.log(val, prop, tabName);
      const param = {};
      switch (prop) {
        case "agentType":
          param.agent = "";
          param.agentName = "";
          this.agentRefreshRequest = !this.agentRefreshRequest;
          break;
        case "delivertAgentType":
          param.deliverAgent = "";
          param.deliverAgentName = "";
          this.deliverAgentRefreshRequest = !this.deliverAgentRefreshRequest;
          break;
        case "deliveryPlace":
          if (val) {
            param.deliveryPlaceType = val.type;
            param.deliveryPlaceAddress = val.address;
          } else {
            param.deliveryPlaceType = "";
            param.deliveryPlaceAddress = "";
          }
          break;
        case "bailorPeopleId":
          this.customerId = val;
          if (this.overseaBusinessTypes.includes(2)) {
            tabName = 2;
            param.deliveryPlace = "";
            param.deliveryPlaceName = "";
            param.deliveryPlaceType = "";
            param.deliveryPlaceAddress = "";
            if (val) {
              this.$nextTick(() => {
                this.deliveryPlaceRefreshRequest =
                  !this.deliveryPlaceRefreshRequest;
              });
            }
          }
          break;
        case "transportMode":
          param.startPortId = "";
          param.startPortName = "";
          param.endPortId = "";
          param.endPortName = "";
          this.$nextTick(() => {
            this.portRefreshRequest = !this.portRefreshRequest;
          });
          break;
        default:
          break;
      }
      if (Object.keys(param).length && tabName) {
        this.$refs[`tabsForm${tabName}`][0].setFormModel(param);
      }
    },
    async handleSave() {
      const arr = [this.$refs.dialogForm.validateAll()];
      const params = {
        ...this.$refs.dialogForm.getFormParams(),
        overseaBusinessTypes: this.overseaBusinessTypes,
      };
      this.overseaBusinessTypes.map((type) => {
        const data = {
          ...this.$refs[`tabsForm${type}`][0].getFormParams(),
        };
        if (type === 2) {
          if (typeof data.deliveryPlace !== "number") {
            data.deliveryPlace = data.deliveryPlace.id;
          }
          data.isInsure = data.isInsure ? 1 : 0;
        }
        params[this.tabsObj[type].prop] = data;
        arr.push(this.$refs[`tabsForm${type}`][0].validateAll(type));
      });
      Promise.all(arr)
        .then(() => {
          console.log("=================");
          console.log(params);
          const httpReq = params.id ? clearanceRegister : saveOverseaOrder;
          httpReq(params).then(() => {
            this.$emit("handleSuccess");
            this.handleClose();
            this.$refs.customDialog.hide();
          });
        })
        .catch(({ param }) => {
          console.log(param);
          if (param) {
            this.tabsConfig.activeName = `${param}`;
          }
        });
    },
    handleClose() {
      setTimeout(() => {
        this.dialogVisible = false;
        this.showTabNum = "";
        this.customerId = "";
        this.formConfig = {
          formModel: {},
          ...formCom(),
        };
        this.tabsFormConfig[1].formModel = {
          agentType: "0",
          transportMode: "0",
        };
        this.tabsFormConfig[2].formModel = {
          delivertAgentType: "0",
          deliveryPlaceType: "",
        };
        this.tabsFormConfig[3].formModel = {};
      }, 500);
    },
    handleNoCustomer() {
      if (!this.customerId) this.$message.error("请先选择委托人！");
      return new Promise((resolve, reject) => {
        resolve({
          data: [],
        });
      });
    },
    handleConfirmBox(type, id) {
      const typeTitle = {
        1: "清关",
        2: "派送",
        3: "存仓入库",
      }[type];
      const msg = `确认之后不存在于${typeTitle}列表，你还要继续吗？`;
      const title = `“${typeTitle}”已存在于派送列表`;
      const className = "el-icon-warning text-warning";
      return new Promise((resolve, reject) => {
        msgBox(
          this,
          { title, className, msg, showCancelButton: true },
          () => {
            // this.comRepeatedRequest(this, removeClearance, {
            //   id,
            //   removeSource: type,
            // }).then(() => {
            //   this.$emit("handleSuccess");
            //   const data = {
            //     1: { agentType: "0", transportMode: "0" },
            //     2: { delivertAgentType: "0", deliveryPlaceType: "" },
            //     3: {},
            //   };
            //   this.tabsFormConfig[type].formModel = {
            //     ...data[type],
            //   };
            // });
            resolve();
          },
          () => {
            reject();
          }
        );
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .com-tabs .tabs-right-btn {
    top: 10px;
  }
  .el-dialog__body {
    padding: 20px 50px 20px 40px;
  }
  .el-tabs__item {
    color: #8b8b8b;
    &.is-active {
      color: #5094ff;
    }
  }
  .el-tabs__active-bar {
    background-color: #5094ff;
  }
  .el-radio {
    margin-right: 15px;
  }
  .el-radio__label {
    padding-left: 4px;
  }
  .form-class .el-input.is-disabled {
    .el-input__inner {
      &::placeholder,
      &::-webkit-input-placeholder,
      &::-moz-placeholder,
      &::-ms-input-placeholder {
        color: #fa7a7a;
      }
    }
  }
}
.delivery-place {
  height: 32px;
  cursor: pointer;
}
</style>
