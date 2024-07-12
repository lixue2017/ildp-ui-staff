import { httpCabinetTypeSelect, httpBoxSelect } from "@/comModel/httpSelect.js";
const GOODS_TABLE_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const GOODS_TABLE_1 = {
  label: "唛头",
  prop: "maitou",
  minWidth: 120,
  showOverflowTooltip: true,
  request: true,
  fieldItem: {
    type: "textarea",
  },
};
const GOODS_TABLE_2 = {
  label: "数量",
  prop: "warehousingQuantity",
  minWidth: 80,
  align: "center",
  showOverflowTooltip: true,
  request: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 0,
  },
};
const GOODS_TABLE_3 = {
  label: "包装",
  prop: "packTypeId",
  minWidth: 130,
  showOverflowTooltip: true,
  basicType: "packagingCode",
  request: true,
  fieldItem: {
    type: "select",
    basicType: "packagingCode",
  },
};
const GOODS_TABLE_4 = {
  label: "货物信息(品名)",
  prop: "productName",
  minWidth: 160,
  showOverflowTooltip: true,
  request: true,
  fieldItem: {
    type: "textarea",
  },
};
const GOODS_TABLE_5 = {
  label: "海关编码",
  prop: "customsCode",
  minWidth: 150,
  showOverflowTooltip: true,
  request: true,
  fieldItem: {
    type: "number",
  },
};
const GOODS_TABLE_6 = {
  label: "毛重",
  prop: "warehousingTotalWeight",
  minWidth: 100,
  align: "right",
  showOverflowTooltip: true,
  request: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 2,
  },
  decimal: 2,
};
const GOODS_TABLE_7 = () => {
  const decimal = 3;
  // (freightType === "0" && isMainBill === 0) || orderType !== "2" ? 3 : 2;
  return {
    label: "立方/CBM",
    prop: "warehousingTotalVolume",
    minWidth: 100,
    align: "right",
    showOverflowTooltip: true,
    request: true,
    fieldItem: {
      type: "inputNumber",
      decimal,
    },
    decimal,
  };
};
const GOODS_TABLE_8 = {
  label: "柜型",
  prop: "boxSizeId",
  minWidth: 120,
  showOverflowTooltip: true,
  request: true,
  fieldItem: {
    ...httpCabinetTypeSelect,
    selectLabelKey: "boxSizeCode",
  },
};
const GOODS_TABLE_EC_8 = ({ operationOrderId, freightType }) => ({
  label: "柜型",
  prop: "boxSizeId",
  minWidth: 120,
  showOverflowTooltip: true,
  request: true,
  fieldItem: {
    ...httpBoxSelect({ operationOrderId, freightType }),
    isBackAll: true,
    selectLabelKey: "boxSizeCode",
    getCustomData: (item) => {
      const { id, boxSizeCode, sono } = item;
      const label = `${sono ? `${sono}#` : ""}${boxSizeCode || "--"}`;
      return {
        key: id,
        value: id,
        label,
        title: label,
      };
    },
  },
});
const GOODS_TABLE_9 = {
  label: "箱号",
  prop: "ontainerSno",
  minWidth: 160,
  showOverflowTooltip: true,
  request: false,
  fieldItem: {
    type: "text",
  },
};
const GOODS_TABLE_10 = {
  label: "封号",
  prop: "sealingStripSno",
  minWidth: 160,
  showOverflowTooltip: true,
  request: false,
  fieldItem: {
    type: "text",
  },
};
const GOODS_TABLE_11 = {
  label: "工作单号",
  prop: "operationOrderNum",
  minWidth: 120,
  showOverflowTooltip: true,
  columnLink: true,
  renderLinkHide: (row) => !row.canEditInvoice,
};
const GOODS_TABLE_12 = {
  label: "柜重/KG",
  prop: "containerWeight",
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const GOODS_TABLE_OPERATION = {
  fixed: "right",
  label: "操作",
  prop: "operation",
  customRow: true,
  showOverflowTooltip: true,
  width: 80,
};

export const tradition_goods = (isEdit, params = {}) => {
  const lists = [
    GOODS_TABLE_INDEX,
    GOODS_TABLE_9,
    GOODS_TABLE_10,
    { ...GOODS_TABLE_2, label: "件数" },
    GOODS_TABLE_3,
    {
      ...(params.freightType == 0 ? GOODS_TABLE_EC_8(params) : GOODS_TABLE_8),
      label: "箱型",
      prop: isEdit ? GOODS_TABLE_8.prop : "boxSizeCode",
      request: false,
    },
    GOODS_TABLE_6,
    GOODS_TABLE_7(params),
  ];
  const column = [];
  const formLists = {};
  if (isEdit) {
    lists.forEach((item) => {
      if (item.prop) {
        column.push({
          ...item,
          customRow: true,
          showOverflowTooltip: false,
        });
        if (item.fieldItem) {
          formLists[item.prop] = {
            ...item.fieldItem,
            placeholder: item.fieldItem.placeholder || item.label,
            request: item.request,
          };
        }
      } else {
        column.push({
          ...item,
        });
      }
    });
    column.push(GOODS_TABLE_OPERATION);
  } else {
    column.push(...lists);
  }
  return {
    column,
    formLists,
  };
};

export const eCommerce_goods = (isEdit, params, type) => {
  const lists = [
    GOODS_TABLE_INDEX,
    GOODS_TABLE_1,
    GOODS_TABLE_2,
    GOODS_TABLE_3,
    GOODS_TABLE_4,
    GOODS_TABLE_5,
    GOODS_TABLE_6,
    GOODS_TABLE_7(params),
  ];
  const column = [];
  const formLists = {};
  const { isMainBill } = params;
  if (isEdit && (isMainBill !== 1 || type !== 1) && isMainBill !== 3) {
    lists.forEach((item) => {
      if (item.prop) {
        column.push({
          ...item,
          customRow: true,
          showOverflowTooltip: false,
        });
        if (item.fieldItem) {
          formLists[item.prop] = {
            ...item.fieldItem,
            placeholder: item.fieldItem.placeholder || item.label,
            request: item.request,
          };
        }
      } else {
        column.push({
          ...item,
        });
      }
    });
    column.push(GOODS_TABLE_OPERATION);
  } else {
    column.push(lists[0]);
    if ((isMainBill === 1 && type === 1) || isMainBill === 3) {
      //主单MBL
      column.push(GOODS_TABLE_11);
    }
    column.push(...lists.slice(2));
  }
  return {
    column,
    formLists,
  };
};

export const eCommerce_box = (isEdit, params, type) => {
  const { isMainBill, freightType, orderType } = params;
  const lists = [
    GOODS_TABLE_INDEX,
    // GOODS_TABLE_EC_8(params),
    GOODS_TABLE_8,
    GOODS_TABLE_9,
    GOODS_TABLE_10,
  ];
  const lclBoxCol =
    type == 0 &&
    orderType == "2" &&
    freightType == "1" &&
    [0].includes(isMainBill);
  if (isMainBill === 0 || lclBoxCol) {
    lists.push(
      ...[GOODS_TABLE_2, GOODS_TABLE_3, GOODS_TABLE_6, GOODS_TABLE_7(params)]
    );
  }
  if ([1, 3].includes(isMainBill)) {
    // lists.push(GOODS_TABLE_12, GOODS_TABLE_3);
    lists.push(
      {
        ...GOODS_TABLE_12,
        fieldItem: {
          // type:'text'
          type: "inputNumber",
          max: 99999999.99,
          isEdit: true,
        },
      },
      GOODS_TABLE_3
    );
  }
  const column = [];
  const formLists = {};
  if (
    isEdit &&
    (![3, 9].includes(isMainBill) || lclBoxCol) &&
    !(isMainBill === 1 && type === 0)
  ) {
    // HBL只能预览
    lists.forEach((item) => {
      if (item.fieldItem) {
        column.push({
          ...item,
          customRow: true,
          showOverflowTooltip: false,
        });
        formLists[item.prop] = {
          ...item.fieldItem,
          placeholder: item.fieldItem.placeholder || item.label,
          request: item.request,
        };
      } else {
        column.push({
          ...item,
        });
      }
    });
    if (![1, 3].includes(isMainBill)) {
      // 主单不能操作
      column.push(GOODS_TABLE_OPERATION);
    }
  } else {
    column.push(
      ...[
        GOODS_TABLE_INDEX,
        {
          // ...GOODS_TABLE_EC_8(params),
          ...GOODS_TABLE_8,
          prop: "boxSizeCode",
        },
        GOODS_TABLE_9,
        GOODS_TABLE_10,
      ]
    );
    if ([1, 3].includes(isMainBill)) {
      // 主单不能操作
      column.push(GOODS_TABLE_12, GOODS_TABLE_3);
    }
  }
  return {
    column,
    formLists,
  };
};
