<template>
  <div>
    <ComDialog
      ref="dialogRef"
      :customDialog="editDialogConfig"
      :dialogBoxCenter="true"
    >
      <template v-slot:content>
        <div v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible">
          <ComForm ref="bgFormRef" :formConfig="packageFormConfig" />
          <div class="base-flex-between" style="padding-bottom: 10px">
            <div></div>
            <div>
              <el-button
                type="primary"
                size="small"
                @click="() => handleAddSku()"
                >新增产品</el-button
              >
            </div>
          </div>
          <ComTable
            ref="bgTableRef"
            :columnConfig="tablePackageColumn({ isUnClaim: true })"
            :columnData="[]"
            :rowOperationBtnListFn="(r) => tableBtnList"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'locationSlot'">
                <AutoComplete
                  :ref="`selectProductRef${slotProps.row.temp_secondId}`"
                  v-if="isMixinSelectProduct"
                  :formModel="slotProps.row"
                  :fieldItem="{
                    ...slotProps.column.fieldItem,
                    disabled: !packageDialogObj.customerId,
                    showCreate: true,
                    selectEmitItem: true,
                    selectLabelKey: 'skuLabel',
                    searchIdKey: 'id',
                    handleCreate: () =>
                      handleMixinAddSkuFn(
                        `selectProductRef${slotProps.row.temp_secondId}`,
                        packageDialogObj.customerId
                      ),
                    handle: (e, sObj) => changeSku(sObj, slotProps.row),
                  }"
                  :additionalParam="{
                    customerId: packageDialogObj.customerId,
                  }"
                />
              </template>
            </template>
          </ComTable>
        </div>
      </template>
    </ComDialog>

    <AddProductDialog
      ref="addProductRef"
      @onSuccess="handleMixinAddSkuSuccess"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { addReturnWmsPackageList } from "@/api/warehouse/process";
import { getArrayDuplicateData } from "@/utils/confirmBox";
import { mixinTableOperationRow } from "_comp/ComTable/tableOperation/rowOperationMixin.js";
import { mixinSelectAddSku } from "@/views/ComMixins/selectAddSku.js";
import {
  claimPackageFormCols,
  claimFormRules,
  tablePackageColumn,
} from "./model";

export default {
  mixins: [mixinTableOperationRow, mixinSelectAddSku],
  data() {
    return {
      tablePackageColumn,
      editDialogConfig: {
        width: "700px",
        title: "货物信息",
        useFooter: "footer",
        footer: [
          {
            text: this.overseaLangObj.bc_save("保存"),
            type: "primary",
            handleClick: () => {
              this.handleSave();
            },
          },
          {
            text: this.overseaLangObj.qx_cancel("取消"),
            plain: true,
            handleClick: () => {
              this.$refs.dialogRef.handleClose();
            },
          },
        ],
      },
      packageFormConfig: {},
      tableBtnList: [
        {
          text: this.overseaLangObj.yc_delete("删除"),
          color: "#FF6767",
          handleClick: (r) => this.handleMixinDirectlyDel(r),
        },
      ],
      packageDialogObj: {},

      mixinTableRef: "bgTableRef",
    };
  },
  methods: {
    showDlg(obj) {
      this.mixinTableDataArr = []; // 重置
      this.packageDialogObj = obj || {};
      this.packageFormConfig = {
        formModel: {
          type: "1", // 默认包裹
          trackSn: obj.trackSn,
        },
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "105px" : "95px",
        httpRequest: this.handleFormRequest,
        successFunction: () => {
          this.$refs.dialogRef.hide();
          obj.successFn && obj.successFn();
        },
        afterMounted: () => {
          setTimeout(() => {
            this.handleAddSku();
          }, 20);
        },
        lists: claimPackageFormCols({
          wmsId: obj.warehouseId,
          handle: (v, tObj) => {
            if (tObj?.customerId !== obj.customerId) {
              this.isMixinSelectProduct = false;
              this.$set(this.packageDialogObj, "customerId", tObj?.customerId);
              this.$nextTick(() => {
                this.isMixinSelectProduct = true;
              });
              const nArr = this.mixinTableDataArr.map((e) => ({
                num: e.num,
                rBtnUpdate: true,
              }));
              this.setTableMixinData(nArr);
            }
          },
        }),
        formRules: claimFormRules,
      };
      this.$refs.dialogRef.show();
    },
    handleAddSku() {
      this.mixinAddTableOpnData([
        {
          rBtnUpdate: true,
        },
      ]);
    },
    handleSave() {
      if (this.mixinTableDataArr.length) {
        const rRuleObj = {
          ruleMsg: {
            cpmId: "SKU",
            num: "数量",
          },
          ruleCallBack: () => {
            const repeatObj = getArrayDuplicateData(
              this.mixinTableDataArr,
              ["cpmId"],
              this,
              {
                cpmId: "SKU",
              }
            );
            return !repeatObj.cpmId;
          },
        };
        this.handleMixinSaveAll(rRuleObj, () => {
          this.$refs.bgFormRef?.submitForm();
        });
      } else {
        this.msgError("请新增产品");
      }
    },
    handleFormRequest(fData) {
      const items = this.mixinTableDataArr.map((ele) => {
        const { cpmId, num, singleWeight, sku } = ele || {};
        return { cpmId, num, singleWeight, sku };
      });
      return addReturnWmsPackageList([
        {
          ...fData,
          forecast: true,
          items,
        },
      ]);
    },

    changeSku(sObj, row) {
      const { sku, cusProduct } = sObj || {};
      row.sku = sku;
      row.singleWeight = cusProduct?.productWeight;
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["packageType"]);
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
