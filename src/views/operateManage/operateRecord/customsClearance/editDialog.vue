<template>
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="updateFormConfig"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        @handleChange="handleFormChange"
      >
        <template v-slot:examineNum="slotProps">
          <div class="flex">
            <el-checkbox v-model="slotProps.formModel.examineCheck">
              查验
            </el-checkbox>
            <el-input
              :placeholder="slotProps.fieldItem.placeholder"
              v-model="slotProps.formModel.examineNum"
              v-input-limit="{
                value: 0,
                FnLimt: (val) => {
                  $refs && $refs.dialogForm.setFormModel({ examineNum: val });
                },
              }"
            />
          </div>
        </template>
        <template v-slot:tips="slotProps">
          <div class="tips-class">
            * 已添加费用之后：海外代理类型 不可修改，且类型为堡森时
            海外代理不可修改；
          </div>
        </template>
        <template v-slot:agentType="slotProps">
          <div class="agency-slot">
            <div>
              <el-radio-group
                @input="(row) => handleFormChange(row, slotProps.fieldItem.id)"
                v-model="slotProps.formModel.agentType"
              >
                <el-radio
                  v-for="item in slotProps.fieldItem.options"
                  :disabled="true"
                  :label="item.value"
                  :key="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </div>
            <div class="base-flex-align tags">
              <span class="tag-green-color"
                >{{
                  CLEARANCE_TYPE[slotProps.formModel.operationOrderType] ||
                  "--"
                }}{{
                  CLEARANCE_BUSINESS_TYPE[
                    slotProps.formModel.orderBusinessType
                  ] || "--"
                }}</span
              >
              <!-- busTypeFind(slotProps.formModel.busType) -->
              <span class="tag-blue-color clearance-type">{{
                getDictObj("freightType", slotProps.formModel.freightType)
              }}</span>
              <!-- <span class="tag-blue-color" v-if="slotProps.dicsData.nameCn">{{
                slotProps.dicsData.nameCn || "--"
              }}</span> -->
            </div>
          </div>
        </template>
        <template v-slot:agent="slotProps">
          <AutoComplete
            ref="agentRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              searchIdKey: undefined,
              disabled: true,
              handle: (row) => changeAgent(row, slotProps.formModel, 'agent'),
            }"
            :additionalParam="{
              typeList: slotProps.formModel.agentType == 0 ? '0' : '3',
              isOverseasAgent:
                slotProps.formModel.agentType == 0 ? 1 : undefined,
            }"
          />
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
// 清关信息(编辑)
import {
  newPopClearancePut,
  popClearanceInfoSave,
  getclearanceRegisterInfo,
  popClearanceDetail,
  warehousingRegistrationPut,
} from "@/api/performance/record";
import { getAvailableParams } from "@/utils/index";
import { typeConversion } from "@/utils/index"; // 数据类型转换
import { BUS_TYPE } from "@/utils/mixin";
import { getClearanceGenerateNumber } from "@/api/performance/record.js";
import {
  editDialogForm,
  warehouseDlgForm,
  examineDlgForm,
  trailerDlgForm,
  inspectionDlgForm,
  dynamicVerifice,
} from "./model";
import {
  CLEARANCE_TYPE,
  CLEARANCE_BUSINESS_TYPE,
} from "../components/recordModel";
export default {
  data() {
    return {
      CLEARANCE_TYPE,
      CLEARANCE_BUSINESS_TYPE,
      customDialogConfig: {
        useFooter: "footer",
        footer: [
          {
            text: "保存",
            type: "primary",
            handleClick: () => {
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
      updateFormConfig: {
        formModel: {},
        httpRequest: this.addOrEditTrailerInfo, // 表单提交接口
        successFunction: () => {
          this.$refs.customDialog.hide();
          this.$emit("handleSuccess");
        }, // 表单提交成功回调
        size: "small",
        labelWidth: "100px",
      },
    };
  },
  methods: {
    changeAgent(row, formModel, type) {
      const { agentType, freightType, operationOrderId } = formModel;
      const params = {
        freightType,
        operationOrderId,
        overseasAgency: row,
        overseasAgencyType: agentType,
      };
      getClearanceGenerateNumber(params).then((e) => {
        const { mblNum = "", nlCode = "", ontainerSno = "" } = e.data || {};
        this.$refs.dialogForm?.setFormModel({
          nlCode,
          mblNum,
          ontainerSno,
        });
      });
    },
    addOrEditTrailerInfo(formModel) {
      const { type_num, ...formParams } = formModel;
      let params = {
        ...formParams,
      };
      if (type_num === 3 || type_num === 4) {
        // 散货拖车登记/拖车结束
        return newPopClearancePut(params);
      }
      // console.log("formModel===", params, type_num);
      if (type_num === 0) {
        //清关登记编辑
        params.status = 1;
        return newPopClearancePut(params);
      }
      if (type_num === 1) {
        const { registerNo, bailorPeople, putWarehousing, ...params_1 } =
          params;
        return warehousingRegistrationPut({
          ...params_1,
          warehouseId: putWarehousing.value,
          putWarehousing: putWarehousing.label,
        });
      }
      if (type_num === 2) {
        if (params.isReject == 1) {
          // 查验打回
          params.rejectRemark = params.msg;
          params.status = 1;
          delete params.msg;
          delete params.trajectoryTime;
        } else {
          delete params.isReject;
          params.status = 2;
        }
        return newPopClearancePut(params);
      }
      if (type_num === 5) {
        const sTime = new Date(params.checkStartTime).getTime();
        const eTime = new Date(params.checkEndTime).getTime();
        if (!params.checkEndTime || sTime > eTime) {
          this.msgError("查验结束时间不能小于登记时间");
          return new Promise((resolve, reject) => {
            return reject();
          });
        }
        params.isCheck = 1;
        return popClearanceInfoSave(params);
      }
    },
    async show(row = {}) {
      const type_num = row.type_num || 0;
      const titArr = [
        "清关信息(编辑)",
        ["预计提拆柜", "入仓登记"][row.packingMethod || 0],
        "清关放行",
        "拖车登记",
        "拖车结束",
        "查验登记",
      ];
      const dlgWidth = ["727px", "650px", "506px", "506px", "506px", "506px"];
      this.customDialogConfig.title = titArr[type_num];
      this.customDialogConfig.width = dlgWidth[type_num];
      if ([1].includes(type_num)) {
        this.$set(this.updateFormConfig, "labelWidth", "102px");
      }
      if ([2, 3, 4, 5].includes(type_num)) {
        this.$set(this.updateFormConfig, "labelWidth", "115px");
      }
      const dlgFormConfig = [
        editDialogForm(!!row.customsBroker),
        warehouseDlgForm(row.packingMethod, row.salesman),
        examineDlgForm(),
        trailerDlgForm(),
        trailerDlgForm(1),
        inspectionDlgForm(),
      ][type_num];
      const dlgFormLists = [
        {
          fieldList: [
            {
              // width: 500,
              rows: [
                {
                  cols: dlgFormConfig.columns,
                },
              ],
            },
          ],
        },
      ];
      const dlgFormRules = dlgFormConfig.formRules;
      this.$set(this.updateFormConfig, "lists", dlgFormLists);
      this.$set(this.updateFormConfig, "formRules", dlgFormRules);
      switch (type_num) {
        case 0:
          const desData =
            (await getclearanceRegisterInfo(row.operationOrderId)).data || {};
          const { agentType = "0", costCount } = desData;
          //需要根据是否绑定费用来动态获取FORMRULES
          const haveCostCount = costCount > 0 ? true : false;
          const formRules =
            !haveCostCount || (!haveCostCount && agentType == 1)
              ? {
                  ...this.updateFormConfig.formRules,
                  agent: dynamicVerifice.agent,
                }
              : this.updateFormConfig.formRules;
          this.updateFormConfig = {
            ...this.updateFormConfig,
            isAttachFileId: true,
            formModel: {
              ...desData,
              pdo: this.typeConversion(desData?.pdo),
              pod: this.typeConversion(desData?.pod),
              declareTime: desData.declareTime,
              type_num,
              agentType: agentType ? typeConversion(agentType) : "0",
            },
            formRules,
          };
          break;
        case 1:
          const des_data_1 =
            (await popClearanceDetail(row.operationOrderId)).data || {};
          const getKeys = [
            "nlCode",
            "bailorPeopleName",
            "operationMainName",
            "businessNnitName",
            "registerNo",
            "bailorPeople",
            "operationOrderNo",
          ];
          const params_obj_1 = getAvailableParams(getKeys, {
            webOriginalDataObj: des_data_1,
          });
          this.updateFormConfig.formModel = {
            ...row,
            ...params_obj_1,
            operationOrderIds: [row.operationOrderId], // 保存时传数组
            type_num,
          };
          break;
        default:
          this.updateFormConfig.formModel = {
            ...row,
          };
      }
      this.$refs.customDialog.show();
    },
    handleFormChange(e, type) {
      console.log("e", e);
      console.log("type", type);
      if (type === "isReject") {
        this.$set(
          this.updateFormConfig.lists[0].fieldList[0].rows[0],
          "cols",
          examineDlgForm(e == 0).columns
        );
        if (e == 1) {
          this.$refs.dialogForm?.$refs.myForm?.clearValidate("trajectoryTime");
        }
      } else if (type == "agentType") {
        const { costCount } = this.updateFormConfig.formModel;
        const haveCostCount =
          costCount == 0 || costCount == null ? false : true;
        const ruleValide =
          !haveCostCount || (haveCostCount && e == 1)
            ? {
                agent: dynamicVerifice.agent,
              }
            : {};
        const removeRule = haveCostCount && e == 1 ? ["agent"] : [];
        this.$refs.dialogForm?.setFormRules(ruleValide, removeRule);
        this.$refs.agentRef?.querySearchAsync("", { isDefaultSelectVal: true });
      }
    },
    busTypeFind(val) {
      const obj = BUS_TYPE.find((e) => e.value == val) || {};
      return obj.label || "--";
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.clearance-type {
  margin: 0 5px;
}
.agency-slot {
  display: flex;
  .tags {
    height: 32px;
    margin-left: 5px;
  }
}
.tips-class {
  color: #3179ef;
}
</style>
