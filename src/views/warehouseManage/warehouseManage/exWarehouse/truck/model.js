import { toFixedNum } from "@/utils/instructions";
import {
  httpCustomerSelect,
  httpUserSelect,
  httpLogisticsCustomerSelect,
} from "@/comModel/httpSelect";
import { httpCurrentWarehouseSelect } from "@/comModel/warehouse";
import { getUserList } from "@/api/common.js";
import { accumulationFn } from "@/utils/instructions";

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "companyName",
  label: "委托人：",
  placeholder: "请选择",
  type: "autocomplete",
  httpRequest: getUserList,
  defaultProp: {
    value: "companyNameCn",
    label: "companyNameCn",
  },
  // ...httpCustomerSelect(),
};
const SEARCH_COL_3 = {
  id: "number",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text",
  maxlength: 2000,
};
const SEARCH_COL_4 = {
  id: "affiliatedCompany",
  label: "所属公司：",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COL_5 = {
  // id: "warehouseId",
  // label: "所在仓库：",
  // placeholder: "请选择",
  // ...httpCurrentWarehouseSelect()
};
const SEARCH_COL_6 = {
  id: "detailsAddr",
  label: "收件地址：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_7 = {
  id: "statusList",
  label: "状态：",
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  // basicType: "outStorageStatus",
  // hideList: [0, 1, 2, 3, 4],
  dicsStr: "truck_status",
  customDicsArr: [5, 6, 9], // 对象属性名
};
const SEARCH_COL_8 = {
  id: "wholeCabinetSn",
  label: "国内登记号：",
  placeholder: "请输入",
  type: "text",
};

const SEARCH_TAB_1 = [
  SEARCH_COL_1,
  SEARCH_COL_2,
  SEARCH_COL_3,
  SEARCH_COL_6,
  SEARCH_COL_8,
  SEARCH_COL_4,
];
export const searchColumns = (tab = "1") => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_TAB_1, [...SEARCH_TAB_1, SEARCH_COL_7]][tab - 1],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_SELECTION = {
  type: "selection",
  width: 35,
  fixed: "left",
  align: "center",
};
const TABLE_COL_0 = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_1 = {
  prop: "number",
  label: "工作单号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_1_1 = {
  ...TABLE_COL_1,
  sortable: true,
  customRow: true,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "truckNumber",
  label: "卡车信息编号",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_1_2 = {
  ...TABLE_COL_2,
  sortable: true,
  customRow: true,
  fixed: "left",
};
const TABLE_COL_4 = {
  prop: "weight",
  label: "重量(KG)",
  minWidth: 105,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_COL_5 = {
  prop: "volume",
  label: "体积(m³)",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
};
const TABLE_COL_6 = {
  prop: "markStatus",
  label: "业务类型",
  minWidth: 100,
  sortable: true,
  dicsStr: "deliveryDic",
  customDicsArr: [0, 1, 2],
  // basicType: "labelingBusinessType",
};
const TABLE_COL_11 = {
  prop: "receivingCode",
  label: "收件信息",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "detailsAddr",
  label: "收件地址",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "remark",
  label: "备注",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "productType",
  label: "SKU数",
  minWidth: 80,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  prop: "productTotal",
  label: "箱数",
  minWidth: 75,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_15_1 = {
  prop: "createNickName",
  label: "委托人",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_16 = {
  prop: "createTime",
  label: "创建时间",
  width: "136px",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_17 = {
  prop: "scheduledTime",
  label: "发车时间",
  width: "136px",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_18 = {
  prop: "updateTime",
  label: "最后更新时间",
  width: "136px",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_20 = {
  prop: "status",
  label: "状态",
  customRow: true,
  minWidth: 80,
  // basicType: "outStorageStatus",
  fixed: "right",
  sortable: true,
  showOverflowTooltip: true,
  dicsStr: "truck_status",
  customDicsArr: [4, 5, 6, 9], // 对象属性名
  customDicsVal: "status",
};
const TABLE_COL_20_1 = {
  prop: "freightStatusDes",
  label: "货物状态",
  customRow: true,
  minWidth: 100,
  // basicType: "inOutWarehouseStatus",
  fixed: "right",
  sortable: true,
  showOverflowTooltip: true,
  dicsStr: "freight_status",
  customDicsArr: [0, 1, 2], // 对象属性名
  customDicsVal: "freightStatusDes",
};
const TABLE_COL_21 = {
  prop: "wholeCabinetSn",
  label: "国内登记号",
  minWidth: 110,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_22 = {
  prop: "warehouseName",
  label: "所在仓库",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_23 = {
  prop: "affiliatedCompanyName",
  label: "所属公司",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_99 = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: "right",
  width: "180px",
};
export const tableColumns = (tab = "1") => {
  let newTab = [];
  if (tab === "2") {
    newTab = [TABLE_COL_1_2];
  }
  const TAB_TABLE_COL = [
    { ...TABLE_COL_0, align: tab === "1" ? "right" : "center" },
    ...(tab === "1" ? [TABLE_COL_SELECTION] : []),
    TABLE_COL_1_1,
    ...newTab,
    TABLE_COL_21,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_11,
    // TABLE_COL_12,
    // TABLE_COL_14,
    TABLE_COL_15,
    TABLE_COL_15_1,

    TABLE_COL_16,
    // TABLE_COL_17,
  ];
  if (tab === "2") {
    TAB_TABLE_COL.push(
      ...[
        TABLE_COL_17,
        TABLE_COL_18,
        TABLE_COL_13,
        TABLE_COL_23,
        TABLE_COL_20_1,
        TABLE_COL_20,
      ]
    );
  } else {
    TAB_TABLE_COL.push(
      ...[
        TABLE_COL_18,
        TABLE_COL_13,
        TABLE_COL_23,
        TABLE_COL_20_1,
        TABLE_COL_99,
      ]
    );
  }
  return [...TAB_TABLE_COL];
};

/*
 添加/编辑页
*/
const EDIT_PAGE_COL_1 = {
  span: 14,
  id: "slotPsd",
  label: "派送地：",
  type: "slot",
};
const EDIT_PAGE_COL_2 = {
  span: 14,
  id: "slotPsqd",
  label: "派送渠道：",
  // labelWidth: "185px",
  type: "slot",
};
const EDIT_PAGE_COL_3 = {
  span: 14,
  id: "slotDz",
  label: "",
  type: "slot",
};
const EDIT_PAGE_COL_4 = {
  span: 10,
  id: "amazonId",
  label: "Amazon Appointment ID：",
  labelWidth: "185px",
};
const EDIT_PAGE_COL_5 = {
  span: 14,
  id: "slotZwf",
  label: "",
  type: "slot",
};
const EDIT_PAGE_COL_6 = (isSee) => {
  let col6 = {};
  if (isSee) {
    col6 = {
      placeholder: "--",
      type: "txt",
    };
  } else {
    col6 = {
      placeholder: "Scheduled Time",
      type: "datetime",
      valueFormat: "yyyy/MM/dd HH:mm:ss",
    };
  }
  return {
    span: 10,
    id: "scheduledTime",
    label: "Scheduled Time：",
    labelWidth: "185px",
    ...col6,
  };
};
// 过程记录->派卡车信息详情有引用
export const editFormColumns = (isSee) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                // {
                //   span: 24,
                //   id: "code",
                //   label: "卡车信息：",
                //   placeholder: "--",
                //   type: "txt"
                // },
                {
                  ...EDIT_PAGE_COL_4,
                  placeholder: isSee ? "--" : "Amazon Appointment ID",
                  type: isSee ? "txt" : "text",
                },
                EDIT_PAGE_COL_2,
                EDIT_PAGE_COL_6(isSee),
                EDIT_PAGE_COL_1,
                // EDIT_PAGE_COL_3,
                // EDIT_PAGE_COL_5
              ],
            },
          ],
        },
      ],
    },
  ];
};
export const editFormRules = {
  amazonId: [
    { required: true, message: "请输入Amazon Appointment ID", trigger: "blur" },
  ],
  scheduledTime: [
    { required: true, message: "请输入Scheduled Time", trigger: "blur" },
  ],
};

const EDIT_PAGE_TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const EDIT_PAGE_TABLE_COL_2 = {
  ...TABLE_COL_6,
  label: "订单类型",
};
const EDIT_PAGE_TABLE_COL_3 = {
  ...TABLE_COL_15_1,
  label: "委托人",
};
const EDIT_PAGE_TABLE_COL_4 = {
  prop: "vatType",
  label: "VAT",
  minWidth: 130,
  showOverflowTooltip: true,
  basicType: "customsClearanceMode",
  render: (row, name) => {
    return row.vatCode || name
      ? `${row.vatCode || "--"}/${name || "--"}`
      : "--";
  },
};
const EDIT_PAGE_TABLE_COL_5 = {
  prop: "productTotal",
  label: "箱数",
  minWidth: 120,
  align: "right",
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_8 = {
  ...TABLE_COL_14,
  label: "产品数",
};
const EDIT_PAGE_TABLE_COL_9 = {
  prop: "xx_nr_9",
  label: "Ordee Nr",
  minWidth: 120,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_10 = {
  prop: "nlCode",
  label: "NL编号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_11 = {
  prop: "pltCount",
  label: "PLT",
  minWidth: 120,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_12 = {
  prop: "shipmentId",
  label: "FBAID",
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_13 = {
  prop: "referenceId",
  label: "FBA ref",
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_14 = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: "right",
  width: "100px",
};
// 过程记录->派卡车信息详情有引用
export const editTableColumns = (isSee) => {
  const EDIT_PAGE_TABLE_COLS = [
    EDIT_PAGE_TABLE_COL_0,
    TABLE_COL_1,
    EDIT_PAGE_TABLE_COL_2,
    EDIT_PAGE_TABLE_COL_3,
    EDIT_PAGE_TABLE_COL_4,
    EDIT_PAGE_TABLE_COL_5,
    TABLE_COL_4,
    TABLE_COL_5,
    EDIT_PAGE_TABLE_COL_8,
    EDIT_PAGE_TABLE_COL_9,
    EDIT_PAGE_TABLE_COL_10,
    EDIT_PAGE_TABLE_COL_11,
    EDIT_PAGE_TABLE_COL_12,
    EDIT_PAGE_TABLE_COL_13,
  ];
  return isSee
    ? EDIT_PAGE_TABLE_COLS
    : [...EDIT_PAGE_TABLE_COLS, EDIT_PAGE_TABLE_COL_14];
};

/** 编辑页 Drawer 抽屉 */
const SEARCH_DRAWER_COL_2 = {
  id: "markStatus",
  label: "订单类型：",
  placeholder: "订单类型",
  type: "select",
  dicsStr: "deliveryDic",
  customDicsArr: [0, 1, 2],
  // basicType: "labelingBusinessType"
};
const SEARCH_DRAWER_COL_3 = {
  id: "searchYwdh3",
  label: "目的地址：",
  placeholder: "目的地址",
  type: "text",
};
const SEARCH_DRAWER_COL_4 = {
  id: "companyName",
  label: "委托人：",
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
                SEARCH_COL_3,
                SEARCH_DRAWER_COL_2,
                // SEARCH_DRAWER_COL_3,
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

export const tableDrawerCols = () => [
  TABLE_DRAWER_COL_1,
  TABLE_COL_1,
  EDIT_PAGE_TABLE_COL_2,
  EDIT_PAGE_TABLE_COL_3,
  TABLE_COL_12,
  EDIT_PAGE_TABLE_COL_5,
  EDIT_PAGE_TABLE_COL_9,
  EDIT_PAGE_TABLE_COL_10,
  EDIT_PAGE_TABLE_COL_11,
];

export const getTotalData = (rows = []) => {
  return [
    {
      label: "重量",
      value: accumulationFn(
        rows.map((e) => e.weight),
        2
      ),
    },
    {
      label: "体积",
      value: accumulationFn(
        rows.map((e) => e.volume),
        2
      ),
    },
    {
      label: "箱数",
      value: accumulationFn(
        rows.map((e) => e.productTotal),
        2
      ),
    },
  ];
};
