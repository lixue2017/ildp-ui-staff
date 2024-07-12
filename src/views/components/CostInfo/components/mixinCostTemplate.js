import { getAvailableParams } from "@/utils/index";
import { postAddCostTemp } from "@/api/settlementManage/feeSet";
import { costTempDialogCols } from "../model.js";

/** 账单费用模板 */
export const mixinBillCostTemplate = {
  data() {
    return {
      isBatchBillChecked: false,
    };
  },
  methods: {
    mCreatedCostTemp() {
      const getKeys = [
        "type",
        "prepaidCollect",
        "isIncludeTax",
        "unitPrice",
        "num",
        "taxRate",
        "dealingsCompanyName",
        "dealingsCompany",
        "costName",
        "costId",
        "currencyCode",
        "currencyId",
      ];
      const itemList = this.selectionRows.map((ele) => {
        return getAvailableParams(getKeys, {
          webOriginalDataObj: ele,
        });
      });
      // console.log("this.selectionRows==", itemList);

      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: costTempDialogCols(),
        formModel: {
          costNum: itemList.length,
        },
        httpRequest: (param) => {
          return postAddCostTemp({
            itemList,
            name: param.name,
          });
        },
        successFunction: () => {
          this.onSelectionChange();
          this.msgSuccess("操作成功");
        },
      });
    },
  },
  watch: {
    isBatchBillChecked(isChecked) {
      if (!isChecked) {
        this.onSelectionChange();
      }
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AddCostTempDlg: () => import("./costTempDlg.vue"),
  },
};
