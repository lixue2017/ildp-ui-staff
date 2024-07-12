<template>
  <ComDialog
    ref="dialogRef"
    :customDialog="editDialogConfig"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <template v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible">
        <ComForm
          ref="dlgFormRef"
          :formConfig="dlgFormConfig"
          @handleChange="handleChange"
        >
          <template v-slot:targetWmsId="slotProps">
            <AutoComplete
              :formModel="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
              :additionalParam="{
                includTypeList: '0,1,2,3',
                customerId: slotProps.formModel.customerId,
                idNe: slotProps.formModel.warehouseId,
              }"
            />
          </template>
          <template v-slot:targetTrayId="slotProps">
            <AutoComplete
              :formModel="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
              :additionalParam="{
                storageMode:
                  slotProps.formModel.storageMode != 2
                    ? 2
                    : (tableColumnData[0] || {}).storageType,
                [['orIdEq', 'idNe'][
                  slotProps.formModel.isAllSelection ? 0 : 1
                ]]: slotProps.formModel.trayId,
                warehouseId: slotProps.formModel.warehouseId,
              }"
            />
          </template>
        </ComForm>

        <ComTable
          ref="tableRef"
          :tableHeight="tableAutoHeight"
          :columnConfig="tableDialogColumn(dlgFormConfig.formModel.storageMode)"
          :columnData="tableColumnData"
        >
        </ComTable>
      </template>
    </template>
  </ComDialog>
</template>

<script>
import { mapActions } from "vuex";
import { postStorageToPs, postStorageToCc } from "@/api/warehouse/manage";
import { dialogFormCols, dialogFormRules, tableDialogColumn } from "./model";

export default {
  data() {
    return {
      tableDialogColumn,
      editDialogConfig: {
        width: "905px",
        title: "",
        useFooter: "footer",
        footer: [
          {
            text: this.overseaLangObj.qr_confirm() || "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.dlgFormRef.submitForm();
            },
          },
          {
            text: this.overseaLangObj.qx_cancel() || "取消",
            plain: true,
            handleClick: () => {
              this.$refs.dialogRef.hide();
            },
          },
        ],
      },
      dlgFormConfig: {
        formModel: {},
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "115px" : "90px",
        formRules: dialogFormRules(), // 表单校验规则
        httpRequest: this.handleSave, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
      },
      tableColumnData: [],
      dialogObj: {},
    };
  },
  methods: {
    handleChange(v, k) {
      // console.log('v, k==', v, k)
      if (k === "isNew") {
        this.dlgFormConfig.lists = dialogFormCols(v, {
          storageMode: this.dlgFormConfig.formModel.storageMode,
        });
      }
    },
    convertShow(list, obj) {
      const { successFn, ...nObj } = obj || {};
      this.dialogObj = { successFn };
      this.tableColumnData = list;
      this.dlgFormConfig.formModel = {
        ...nObj,
        allItemFlag: nObj.isAllSelection,
        targetTraySnName: nObj.isAllSelection ? obj.traySn : undefined,
        targetTrayId: nObj.isAllSelection ? obj.trayId : undefined,
        isNew: 0, // 默认已有托盘
      };
      this.$set(
        this.dlgFormConfig,
        "lists",
        dialogFormCols(0, {
          isDisable: nObj.isAllSelection,
          storageMode: nObj.storageMode, // 0-SKU 1-按箱 2-大货中转
        })
      );
      this.editDialogConfig.title =
        nObj.storageMode == 2
          ? this.overseaLangObj.zh_cc("转存仓")
          : this.overseaLangObj.zh_ps("转派送");
      this.$refs.dialogRef.show();
    },
    handleSave(fData) {
      // console.log("fData===", fData);
      const { distributionType, targetWmsId, allItemFlag } = fData;
      let opt = {
        allItemFlag,
        sourceTrayId: fData.trayId,
        itemList: this.tableColumnData.map((e) => ({
          storageId: e.storageId,
          wriIdList: e.wriIdList,
        })),
      };
      if (fData.isNew === 0) {
        opt.targetTrayId = fData.targetTrayId;
      }
      if (fData.storageMode == 2) {
        return postStorageToCc({
          wmsId: fData.warehouseId,
          ...opt,
        });
      }
      return postStorageToPs({
        distributionType, // : 1
        targetWmsId, // : 863
        sourceWmsId: fData.warehouseId,
        ...opt,
      });
    },
    handleSuccess() {
      this.$refs.dialogRef.hide();
      this.dialogObj.successFn && this.dialogObj.successFn();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["distributionType"]);
  },
  computed: {
    tableAutoHeight() {
      const tableLen = this.tableColumnData.length;
      return tableLen > 8 ? `${9 * 39 + 54}px` : undefined;
    },
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
