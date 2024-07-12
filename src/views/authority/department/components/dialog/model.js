import { getWarehouseOneselfList } from "@/api/system/dept";
const FORM_COL_1 = {
  span: 12,
  id: "deptName",
  labelWidth: "100px",
  label: "选择部门：",
  placeholder: "--",
  type: "txt",
};
const FORM_COL_2 = {
  span: 12,
  id: "isOperateMain",
  labelWidth: "100px",
  label: "经营主体：",
  placeholder: "--",
  type: "slot",
};
const FORM_COL_3 = {
  span: 24,
  id: "wareHouses",
  label: "客户可选仓：",
  placeholder: "请选择客户可选仓",
  type: "autocomplete",
  isAutoInitRequest: true,
  multiple: true,
  isBackAll: true,
  defaultKey: "warehouseMainId",
  labelWidth: "100px",
  httpRequest: getWarehouseOneselfList,
  getCustomData: (item) => {
    return {
      label: `${item.warehouseCode}/${item.warehouseName}`,
      value: item.warehouseMainId,
    };
  },
};
const FORM_COL_4 = {
  span: 24,
  id: "overseasDeptWarehouses",
  label: "可操作海外仓：",
  placeholder: "请选择可操作海外仓",
  type: "autocomplete",
  isAutoInitRequest: true,
  multiple: true,
  isBackAll: true,
  defaultKey: "warehouseMainId",
  labelWidth: "100px",
  httpRequest: getWarehouseOneselfList,
  getCustomData: (item) => {
    return {
      label: `${item.warehouseCode}/${item.warehouseName}`,
      value: item.warehouseMainId,
    };
  },
};
const FORM_COL_5 = {
  span: 24,
  id: "tips",
  labelWidth: "100px",
  placeholder: "--",
  type: "slot",
};
export const config = (isOperateMain) => ({
  maintainLists: {
    title: "维护仓库",
    lists: [
      {
        width: 550,
        fieldList: [
          {
            rows: [
              {
                cols: [
                  FORM_COL_1,
                  FORM_COL_2,
                  ...(isOperateMain ? [FORM_COL_3] : []),
                  FORM_COL_4,
                  FORM_COL_5,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      // verificationBy: [
      //   { required: true, message: "请选择财务核销人", trigger: "change" },
      // ],
    },
  },
});
