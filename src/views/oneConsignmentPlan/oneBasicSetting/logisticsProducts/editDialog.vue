<template>
  <ComDialog
    ref="editDialogRef"
    :customDialog="editDialogConfig"
    :dialogBoxCenter="true"
    :confirmClose="modeType !== 1"
  >
    <template v-slot:content>
      <div
        class="dialog-content"
        v-if="
          isInitDialog &&
          $refs.editDialogRef &&
          $refs.editDialogRef.dialogVisible
        "
      >
        <ComForm
          ref="dialogFormRef"
          :formConfig="editFormConfig"
          class="dialog-form"
          @handleChange="handleFormChange"
        >
          <template v-slot:bindFbaList="slotProps">
            <AutoComplete
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                disabled: slotProps.formModel.bindAllFba,
              }"
            />
          </template>
          <template v-slot:apiId="slotProps">
            <AutoComplete
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                disabled: ['1','3'].includes(slotProps.formModel.transportMethod),
              }"
            />
          </template>
        </ComForm>

        <ComTabs :tabsConfig="tabsFormConfig">
          <template v-for="tab in tabsFormConfig.tabs">
            <el-tab-pane
              :disabled="
                modeType === 1 && tabsFormConfig.activeName !== tab.name
              "
              :label="tab.label"
              :name="tab.name"
              :key="tab.name"
            >
              <keep-alive>
                <ComForm
                  :ref="`tabFormRef${tab.name}`"
                  :formConfig="tabFormConf(tab.name)"
                  v-if="tabsFormConfig.activeName === tab.name"
                >
                </ComForm>
              </keep-alive>
            </el-tab-pane>
          </template>
        </ComTabs>
      </div>
    </template>
  </ComDialog>
</template>

<script>
import {
  postLogisticsProduct,
  getLogisticsProductInfo,
  putLogisticsProduct,
} from "@/api/warehouse/basic";
import { comSaveRepeatedRequest } from "@/api/common";
import {
  editDlgFormCols,
  dlgFormRules,
  dlgTabFormCols,
  dlgTabFormRules,
  otherServicesOptions,
  EDIT_KEY_ARR,
  SAVE_TAB_KEY_ARR_1,
} from "./model";

export default {
  data() {
    return {
      editDialogConfig: {
        width: "1080px",
        title: "物流产品",
        footer: [],
      },
      editFooter: [
        {
          text: "暂存",
          type: "primary",
          handleClick: () => {
            this.saveState = 0;
            this.saveDlgForm();
          },
        },
        {
          text: "保存并启用",
          type: "primary",
          handleClick: () => {
            this.saveState = 1;
            this.saveDlgForm();
          },
        },
      ],
      seeEditBtn: {
        text: "修改",
        type: "primary",
        handleClick: () => {
          this.isInitDialog = false; // 重新加载表单模板
          this.tempRow.web_mode_type = 0;
          this.$nextTick(() => {
            this.editShow(this.tempRow);
          });
        },
      },
      seeEnableBtn: {
        text: "启用",
        type: "primary",
        handleClick: () => {
          comSaveRepeatedRequest(
            putLogisticsProduct,
            this.editFormConfig.formModel.id
          ).then(() => {
            this.$refs.editDialogRef.hide();
            this.tempRow.webEditSuccess && this.tempRow.webEditSuccess();
          });
        },
      },
      closeFooter: [
        {
          text: "取消",
          plain: true,
          handleClick: () => {
            this.$refs.editDialogRef.handleClose();
          },
        },
      ],
      tabsFormConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          // 字典词-logisticsProductBillingMode
          {
            label: "标准模式",
            name: "1",
          },
          // {
          //   label: "比较模式(销售价)",
          //   name: "2",
          // },
          // {
          //   label: "比较模式(成本价)",
          //   name: "3",
          // },
        ],
      },
      editFormConfig: {
        formModel: {},
        labelWidth: "105px",
      },
      editTabFormConfig: {
        formModel: {},
        labelWidth: "105px",
      },
      modeType: 0, // 0-编辑，1-查看
      saveState: 0,
      tempRow: {}, // 临时数据
      isInitDialog: true,
      tabFormConfig: {},
    };
  },
  methods: {
    async editShow(obj) {
      const { web_mode_type, ...row } = obj || {};
      let nRow = row;
      if (row.id) {
        // 编辑与查看
        nRow =
          (await this.comRepeatedRequest(this, getLogisticsProductInfo, row.id))
            .data || {};
      }

      this.modeType = web_mode_type;
      this.tempRow = obj;
      this.tabsFormConfig.activeName =
        this.typeConversion(nRow.billingMode) || "1";
      const footerBtn =
        web_mode_type === 1
          ? [
              ...(nRow.state === 0 ? [this.seeEditBtn] : []), // 草稿
              ...(nRow.state !== 1 ? [this.seeEnableBtn] : []), // 草稿与禁用
            ]
          : this.editFooter;
      this.editDialogConfig.footer = footerBtn.concat(this.closeFooter);

      if (nRow.id) {
        // 编辑与详情
        let { standard, salesPriceCompare, costPriceCompare, nameCn, ...fRow } =
          nRow;
        this.editFormConfig.formModel = {
          ...fRow,
          transportMethod: this.typeConversion(fRow.transportMethod),
          nameCn,
        };
        if (nRow.billingMode == 1) {
          this.editTabFormConfig.formModel = {
            ...standard,
            otherServicesChecks: otherServicesOptions.filter(
              (oKey) => standard[oKey]
            ),
            startEndMoney: standard.computeBegin || standard.computeEnd,
            computeUnit: this.typeConversion(standard.computeUnit),
            billingWeight: this.typeConversion(standard.billingWeight),
            fbaBillingWeight: this.typeConversion(standard.fbaBillingWeight),
            returnFreightType: this.typeConversion(standard.returnFreightType),
            WEBProductName: nameCn,
          };
        }

        if (nRow.billingMode == 2) {
          this.editTabFormConfig.formModel = {
            ...salesPriceCompare,
            priceCompareRules: this.typeConversion(
              salesPriceCompare.priceCompareRules
            ),
          };
        }

        if (nRow.billingMode == 3) {
          this.editTabFormConfig.formModel = {
            ...costPriceCompare,
            priceCompareRules: this.typeConversion(
              costPriceCompare.priceCompareRules
            ),
            billingWeight: this.typeConversion(costPriceCompare.billingWeight),
            fbaBillingWeight: this.typeConversion(
              costPriceCompare.fbaBillingWeight
            ),
          };
        }
      } else {
        this.editFormConfig.formModel = {
          transportMethod: "2",
          publicSales: true,
        };
        this.editTabFormConfig.formModel = {
          computeUnit: "1",
        };
      }

      this.editFormConfig = {
        ...this.editFormConfig,
        formRules: dlgFormRules(web_mode_type === 1),
        lists: editDlgFormCols(web_mode_type === 1 ),
      };
      this.isInitDialog = true; // 查看时点击修改改变模板
      this.$refs.editDialogRef.show();
    },
    handleFormChange(val, key) {
      if (key == "transportMethod") {
        if (["1", "3"].includes(val)) {
          this.$refs.dialogFormRef?.setFormModel({
            apiId:null
          })
        }
      }
    },
    saveDlgForm() {
      const rulesArr = [this.$refs.dialogFormRef.validateAll()];
      rulesArr.push(
        this.$refs[
          `tabFormRef${this.tabsFormConfig.activeName}`
        ][0].validateAll()
      );
      Promise.all(rulesArr).then(() => {
        this.editDlgRequest();
      });
    },
    editDlgRequest() {
      const { activeName } = this.tabsFormConfig;
      let formData = this.$refs.dialogFormRef?.saveFormParams(EDIT_KEY_ARR);
      formData.billingMode = activeName;
      formData.state = this.saveState;

      if (activeName === "1") {
        const formTabData1 =
          this.$refs[`tabFormRef${activeName}`][0]?.saveFormParams(
            SAVE_TAB_KEY_ARR_1
          );
        let { otherServicesChecks, ...sTabObj1 } = formTabData1 || {};
        let standard = otherServicesOptions.reduce((sOpt, sKey) => {
          sOpt[sKey] = otherServicesChecks.some((c) => c === sKey);
          return sOpt;
        }, sTabObj1);
        Object.assign(formData, {
          standard,
        });
        // console.log('==', standard)
      }

      if (activeName === "2") {
        const SAVE_TAB_KEY_ARR_2 = [
          "id",
          "priceCompareRules",
          "isTracking",
          "logisticsProductIdList",
        ];
        let salesPriceCompare =
          this.$refs[`tabFormRef${activeName}`][0]?.saveFormParams(
            SAVE_TAB_KEY_ARR_2
          );
        Object.assign(formData, {
          salesPriceCompare,
        });
      }

      if (activeName === "3") {
        const SAVE_TAB_KEY_ARR_3 = [
          "id",
          "priceCompareRules",
          "isTracking",
          "measureVolume",
          "fbaMeasureVolume",
          "billingWeight",
          "fbaBillingWeight",
          "logisticsChannelIdList",
        ];
        let costPriceCompare =
          this.$refs[`tabFormRef${activeName}`][0]?.saveFormParams(
            SAVE_TAB_KEY_ARR_3
          );
        Object.assign(formData, {
          costPriceCompare,
        });
      }
      comSaveRepeatedRequest(postLogisticsProduct, formData).then(() => {
        this.msgSuccess("保存成功");
        this.$refs.editDialogRef.hide();
        this.tempRow.webEditSuccess && this.tempRow.webEditSuccess();
      });
    },
    tabFormConf(tName) {
      return {
        ...this.editTabFormConfig,
        lists: dlgTabFormCols(tName, this.modeType === 1),
        formRules: dlgTabFormRules(tName, this.modeType === 1),
      };
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    ComTabs: () => import("_comp/ComTabs"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-content {
  /deep/ {
    .el-tabs__active-bar {
      background-color: #5094ff;
    }
    .el-tabs__item.is-active {
      color: #5094ff;
    }
  }
}
</style>
