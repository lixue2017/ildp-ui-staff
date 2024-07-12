import overseaLangObj from "@/language/overseasLang.js";
import { httpProductSkuSelect } from "@/comModel/httpSelect";
import { MAX_SKU_NUM } from "@/utils/instructions.js";
import { getReturnWmsOrderList } from "@/api/warehouse/process";

export const selectReturnWmsOrderList = (obj) => {
  const { wmsId, customerId, stateList, stateNeList = ["4"] } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "orderSn",
    httpRequest: (params) => {
      delete params.name;
      return getReturnWmsOrderList({
        stateNeList, // 4 - 默认过滤已完结订单
        stateList,
        customerId,
        wmsId, // 仓库
        ...params,
      });
    },
    getCustomData: (item) => {
      return {
        key: item.id,
        value: item.id,
        label: item.orderSn,
        title: item.orderSn,
        subtitle: item.customerShortName,
      };
    },
  };
};

const ADD_COL_1 = {
  span: 12,
  id: "type",
  label: "包裹类型：",
  type: "select",
  placeholder: "请选择",
  basicType: "packageType",
};
const ADD_COL_2 = {
  span: 12,
  id: "trackSn",
  label: "包裹跟踪号：",
  placeholder: "请输入",
  type: "text",
};
const ADD_COL_3 = {
  span: 12,
  id: "rwoId",
  label: "退仓单号：",
};
const ADD_COL_4 = {
  span: 12,
  id: "expectedWarehousingTime",
  label: "入仓时间：",
  placeholder: "年-月-日",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
export const packageFormCols = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [ADD_COL_1, ADD_COL_2],
            },
          ],
        },
      ],
    },
  ];
};

export const formRules = {
  type: [{ required: true, message: "请选择包裹类型", trigger: "change" }],
  trackSn: [{ required: true, message: "请输入包裹号", trigger: "blur" }],
};

export const claimPackageFormCols = (obj) => {
  const { handle, wmsId } = obj || {};
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...ADD_COL_2,
                  type: "txt",
                },
                ADD_COL_1,
                {
                  ...ADD_COL_3,
                  selectLabelKey: "orderSn",
                  ...selectReturnWmsOrderList({ wmsId }),
                  selectEmitItem: true,
                  noClearable: true,
                  handle,
                },
                ADD_COL_4,
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const claimFormRules = {
  type: [{ required: true, message: "请选择包裹类型", trigger: "change" }],
  rwoId: [{ required: true, message: "请选择退仓单号", trigger: "change" }],
};

const WMS_TABLE_COL_99 = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  width: 90,
  // fixed: "right",
  columnOperation: true,
};
export const tablePackageColumn = (obj) => {
  const { isUnClaim } = obj || {};
  return [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      prop: "locationSlot",
      label: "SKU",
      minWidth: 160,
      customRow: true,
      request: isUnClaim,
      fieldItem: {
        id: "cpmId",
        size: "mini",
        // selectLabelKey: "sku",
        // selectEmitItem: true,
        ...httpProductSkuSelect("1,3"),
      },
    },
    {
      prop: "num",
      label: overseaLangObj.sh_num || "收货数量",
      width: 130,
      decimal: 0,
      customRow: true,
      request: true,
      editCellKeyName: "temp_secondId",
      isEditEasyCell: true,
      fieldItem: {
        type: "inputNumber",
        max: MAX_SKU_NUM,
        min: 1,
      },
    },
    WMS_TABLE_COL_99,
  ];
};
