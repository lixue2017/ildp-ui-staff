import { toFixedNum } from "@/utils/instructions";
import { httpUserSelect } from "@/comModel/httpSelect";

const EDIT_COL_1 = {
  span: 12,
  id: "name",
  label: "司机姓名：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_2 = {
  span: 12,
  id: "phone",
  label: "司机手机号：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_3 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  placeholder: "请输入",
  type: "textarea",
  maxlength: 500,
};
export const editFormColumns = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [EDIT_COL_1, EDIT_COL_2, EDIT_COL_3],
            },
          ],
        },
      ],
    },
  ];
};
export const editFormRules = {
  phone: [{ required: true, message: "请输入司机手机号", trigger: "blur" }],
};

const EDIT_PAGE_TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const EDIT_PAGE_TABLE_COL_2 = {
  prop: "orderNumber",
  label: "工作单号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_3 = {
  prop: "shortName",
  label: "委托人",
  minWidth: 120,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_4 = {
  prop: "shipmentId",
  label: "Shipment Id",
  minWidth: 120,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_5 = {
  prop: "referenceId",
  label: "Reference Id",
  minWidth: 120,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_6 = {
  prop: "shippingMark",
  label: "唛头",
  minWidth: 120,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_7 = {
  prop: "boxNumber",
  label: "箱号",
  minWidth: 110,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_8 = {
  prop: "boxCount",
  label: "箱数",
  width: 76,
  showOverflowTooltip: true,
  decimal: 0,
  align: "right",
};
const EDIT_PAGE_TABLE_COL_9 = {
  prop: "boxLength",
  label: "长*宽*高/CM",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (r) =>
    `${toFixedNum(r.boxLength)}*${toFixedNum(r.boxWidth)}*${toFixedNum(
      r.boxHeight
    )}`,
};
const EDIT_PAGE_TABLE_COL_10 = {
  prop: "boxVolume",
  label: "体积小计m³",
  width: 90,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const EDIT_PAGE_TABLE_COL_11 = {
  prop: "boxWeight",
  label: "毛重小计KG",
  width: 90,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const EDIT_PAGE_TABLE_COL_12 = {
  prop: "transactionWarehouseCode",
  label: "收货地",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (r) =>
    `${r.transactionWarehouseCode || "--"}/${
      r.transactionWarehouseName || "--"
    }`,
};
const EDIT_PAGE_TABLE_COL_99 = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: 80,
};

export const editTableColumns = () => {
  const EDIT_PAGE_TABLE_COLS_1 = [
    {
      ...EDIT_PAGE_TABLE_COL_0,
      fixed: "left",
    },
    {
      ...EDIT_PAGE_TABLE_COL_2,
      fixed: "left",
    },
    EDIT_PAGE_TABLE_COL_3,
    EDIT_PAGE_TABLE_COL_4,
    EDIT_PAGE_TABLE_COL_5,
    EDIT_PAGE_TABLE_COL_6,
    EDIT_PAGE_TABLE_COL_7,
    {
      ...EDIT_PAGE_TABLE_COL_8,
      customRow: true,
      request: true,
      editCellKeyName: "temp_secondId",
      isEditEasyCell: true,
      fieldItem: {
        type: "inputNumber",
        maxNumKey: "temp_boxCount",
        minGreaterZero: true,
        requiredKeyArr: ["boxCount"],
      },
    },
    EDIT_PAGE_TABLE_COL_9,
    EDIT_PAGE_TABLE_COL_10,
    EDIT_PAGE_TABLE_COL_11,
    EDIT_PAGE_TABLE_COL_12,
    EDIT_PAGE_TABLE_COL_99,
  ];
  return EDIT_PAGE_TABLE_COLS_1;
};

/** 编辑页 Drawer 抽屉 */
const SEARCH_DRAWER_COL_1 = {
  // span: 24,
  id: "orderNumber",
  label: "工作单号：",
  placeholder: "请输入", // （空格隔开查询多个）
  type: "text",
  // maxlength: 1850,
};
const SEARCH_DRAWER_COL_2 = {
  id: "beginTime",
  label: "预计入仓时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_DRAWER_COL_3 = {
  id: "salesmanId",
  label: "业务员：",
  ...httpUserSelect(),
};
const SEARCH_DRAWER_COL_4 = {
  id: "shortName",
  label: "客户简称：",
  placeholder: "请输入",
  type: "text",
};
export const searchDrawerFormCols = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_DRAWER_COL_1,
                SEARCH_DRAWER_COL_2,
                SEARCH_DRAWER_COL_3,
                SEARCH_DRAWER_COL_4,
              ],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_DRAWER_COL_1 = {
  type: "selection",
  align: "center",
  width: 50,
};

const DRAWER_TABLE_COL_2 = {
  labelTop: "客户简称",
  labelBottom: "业务员",
  headerTopBottom: true,
  prop: "shortName",
  bottomProp: "salesmanName",
  columnTopBottom: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const DRAWER_TABLE_COL_3 = {
  labelTop: "Shipment Id",
  labelBottom: "Reference Id",
  headerTopBottom: true,
  prop: "shipmentId",
  bottomProp: "referenceId",
  columnTopBottom: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const DRAWER_TABLE_COL_4 = {
  labelTop: "唛头",
  labelBottom: "箱号",
  headerTopBottom: true,
  prop: "shippingMark",
  bottomProp: "boxNumber",
  columnTopBottom: true,
  width: 198,
  showOverflowTooltip: true,
};
const DRAWER_TABLE_COL_5 = {
  prop: "putWarehouseTime",
  label: "预计入仓时间",
  width: 120,
  showOverflowTooltip: true,
};
export const tableDrawerCols = () => [
  EDIT_PAGE_TABLE_COL_0,
  TABLE_DRAWER_COL_1,
  EDIT_PAGE_TABLE_COL_2,
  DRAWER_TABLE_COL_2,
  DRAWER_TABLE_COL_3,
  DRAWER_TABLE_COL_4,
  EDIT_PAGE_TABLE_COL_8,
  DRAWER_TABLE_COL_5,
  EDIT_PAGE_TABLE_COL_9,
  EDIT_PAGE_TABLE_COL_10,
  EDIT_PAGE_TABLE_COL_11,
];
