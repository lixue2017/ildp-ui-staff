import {
  httpUserSelect,
  httpCustomerSelect,
  httpRoleDeptUserSelect,
} from "@/comModel/httpSelect";
import {
  httpFBAWarehouseSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import { getDictObj } from "@/utils/index";
import overseaLangObj from "@/language/overseasLang.js";
import { logisticsProductList } from "@/api/warehouse/basic";

const SEARCH_COL_1 = {
  id: "createTime",
  label: `${overseaLangObj.create_time || "创建时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "warehouseName",
  label: "所在仓库：",
  placeholder: "所在仓库",
  type: "text",
  // ...httpFBAWarehouseSelect('2')
};
const SEARCH_COL_3 = {
  id: "pickingNumber",
  label: `${overseaLangObj.jh_dh || "拣货单号"}：`,
  placeholder: "请输入拣货单号(空格隔开查询多个)",
  maxlength: 1850,
  residueCol: 2,
  type: "text",
};
const SEARCH_COL_4 = {
  id: "createBy",
  label: "创建人：",
  placeholder: "创建人",
  type: "text",
};
const SEARCH_COL_5 = {
  id: "pickingType",
  label: "订单拣货数量：",
  placeholder: "请选择",
  type: "select",
  basicType: "pickingType",
};
const SEARCH_COL_6 = {
  id: "stateList",
  label: `${overseaLangObj.zt_status || "状态"}：`,
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "pickingStatus",
  hideList: [4, 5, 6],
};

const SEARCH_COL_7 = {
  id: "orderNumbers",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_8 = {
  id: "orderType",
  label: `${overseaLangObj.lx_type() || "类型"}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "labelingBusinessType",
};
const SEARCH_COL_9 = {
  id: "logisticsProductId",
  label: `${overseaLangObj.wl_cp("物流产品")}：`,
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
  }),
};

const SEARCH_TAB_1 = [
  SEARCH_COL_3,
  SEARCH_COL_1,
  SEARCH_COL_7,
  SEARCH_COL_6,
  SEARCH_COL_8,
  SEARCH_COL_9,
  SEARCH_COL_5,
];
export const searchColumns = (idx) => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_TAB_1][idx],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_SELECTION = {
  type: "selection",
  width: 50,
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
  prop: "pickingNumber",
  label: overseaLangObj.jh_dh || "拣货单号",
  fixed: "left",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "pickingType",
  label: "订单拣货数量",
  minWidth: 120,
  sortable: true,
  basicType: "pickingType",
};
const TABLE_COL_3 = {
  prop: "orderType",
  label: overseaLangObj.order_type || "订单类型",
  minWidth: 96,
  showOverflowTooltip: true,
  sortable: true,
  basicType: "labelingBusinessType",
};
const TABLE_COL_4 = {
  prop: "orderCount",
  label: overseaLangObj.order_num || "订单数",
  minWidth: 80,
  align: "right",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "productCount",
  label: overseaLangObj.product_total || "产品总数",
  align: "right",
  minWidth: 96,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "userName",
  label: overseaLangObj.ph_ry || "配货员",
  minWidth: 86,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "createBy",
  label: overseaLangObj.cjr_create || "创建人",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "updateTime",
  label: overseaLangObj.last_modified() || "最后修改时间",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "warehouseName",
  label: "所在仓库",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => `${row.warehouseCode}/${row.warehouseName}`,
};
const TABLE_COL_12 = {
  prop: "printCount",
  label: "打印次数",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "pickingStatus",
  label: overseaLangObj.zt_status || "状态",
  dotColor: true,
  minWidth: 85,
  sortable: true,
  fixed: "right",
  basicType: "pickingStatus",
  showOverflowTooltip: true,
};
const TABLE_COL_13_DETAIL = {
  prop: "orderStatus",
  label: overseaLangObj.zt_status || "状态",
  dotColor: true,
  minWidth: 85,
  sortable: true,
  fixed: "right",
  basicType: "outStorageStatus",
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "outWarehouseWays",
  label: overseaLangObj.delivery_ps_fs || "派送方式",
  minWidth: 95,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "transportMethod",
  render: (cRow, cNameCn) => {
    if (cRow.outWarehouseWays && cRow.outWarehouseWays.length > 1) {
      return (
        getDictObj("transportMethod", cRow.outWarehouseWays).join(", ") || "--"
      );
    }
    return cNameCn;
  },
};
const TABLE_COL_15 = {
  prop: "orderNumbers",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 180,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_16 = {
  prop: "logisticsProduct",
  label: overseaLangObj.wl_cp("物流产品"),
  minWidth: 130,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_17 = {
  prop: "orderTotleWeight",
  label: "订单总量",
  align: "right",
  minWidth: 96,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_98 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  customRow: true,
  // columnOperation: true,
  fixed: "right",
  width: 188,
};

const TABLE_TAB_1 = [
  TABLE_COL_0,
  TABLE_COL_SELECTION,
  {
    ...TABLE_COL_1,
    columnLink: true,
  },
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_17,
  TABLE_COL_5,
  TABLE_COL_15,
  TABLE_COL_7,
  TABLE_COL_14,
  TABLE_COL_16,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  // TABLE_COL_12,
  {
    ...TABLE_COL_13,
    fixed: "right",
  },
  TABLE_COL_98,
];
export const tableColumns = (tab = 0) => {
  return [TABLE_TAB_1][tab];
};

/*
 拣货单添加/编辑
*/
const EDIT_PAGE_COL_1 = {
  span: 6,
  id: "pickingNumber",
  label: `${overseaLangObj.jh_dh || "拣货单号"}：`,
  type: "txt",
};
const EDIT_PAGE_COL_2 = {
  span: 6,
  id: "orderType",
  label: `${overseaLangObj.order_type || "订单类型"}：`,
  basicType: "labelingBusinessType",
};
const EDIT_PAGE_COL_3 = {
  span: 6,
  id: "warehouseId",
  label: "所在仓库：",
  placeholder: "所在仓库",
  ...httpFBAWarehouseSelect("2"),
};
const EDIT_PAGE_COL_4 = (isSee) => {
  const PAGE_COM_COL_4 = {
    span: 6,
    id: "pickingMemberId",
    label: `${overseaLangObj.ph_ry || "配货员"}：`,
    placeholder: isSee ? "--" : "请选择",
  };
  return isSee
    ? {
        ...PAGE_COM_COL_4,
        id: "userName",
        type: "txt",
      }
    : {
        ...PAGE_COM_COL_4,
        ...httpRoleDeptUserSelect(),
        multiple: true,
        isAutoInitRequest: true,
        // selectLabelKey: 'pickingMemberName',
        type: "slot",
      };
};
const EDIT_PAGE_COL_5 = {
  span: 6,
  id: "pickingType",
  label: `订单拣货数量：`,
  basicType: "pickingType",
};
export const editFormColumns = (pageFormObj = {}) => {
  const { isPrint: isSee, orderTypeFn, pickingTypeFn } = pageFormObj;
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                EDIT_PAGE_COL_1,
                {
                  ...EDIT_PAGE_COL_2,
                  placeholder: isSee ? "--" : "订单类型",
                  type: isSee ? "txt" : "select",
                  disabled: false,
                  handle: (val) => {
                    orderTypeFn && orderTypeFn(val);
                  },
                },
                {
                  ...EDIT_PAGE_COL_5,
                  placeholder: isSee ? "--" : "请选择",
                  type: isSee ? "txt" : "select",
                  disabled: false,
                  handle: (val) => {
                    pickingTypeFn && pickingTypeFn(val);
                  },
                },
                EDIT_PAGE_COL_4(isSee),
              ],
            },
          ],
        },
      ],
    },
  ];
};
export const editFormRules = () => {
  return {
    orderType: [
      { required: true, message: "请选择订单类型", trigger: "change" },
    ],
    pickingType: [
      { required: true, message: "请选择订单拣货数量", trigger: "change" },
    ],
    pickingMemberId: [
      { required: true, message: "请选择配货员", trigger: "change" },
    ],
  };
};

const EDIT_PAGE_TABLE_COL_0 = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const EDIT_PAGE_TABLE_COL_1 = {
  prop: "number",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 170,
  fixed: "left",
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_2 = {
  prop: "traceNumber",
  label: overseaLangObj.tracking_no || "跟踪号",
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_3 = {
  prop: "address",
  label: overseaLangObj.dz_address() || "地址",
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_4 = {
  prop: "productSku",
  label: overseaLangObj.cp_sku || "产品SKU",
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_5 = {
  prop: "productName",
  label: overseaLangObj.cp_name || "产品名称",
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_1_5 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer_name || "客户名称",
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_6 = {
  prop: "quantity",
  label: overseaLangObj.sl_num || "数量",
  minWidth: 120,
  align: "right",
  decimal: 0,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_7 = {
  prop: "trayNumber",
  label: overseaLangObj.tp_bh || "托盘编号",
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_8 = {
  prop: "locationCode",
  label: overseaLangObj.kw_location("所在库位"),
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_9 = {
  prop: "type_xx",
  label: overseaLangObj.rk_type("入库类型"),
  minWidth: 130,
  showOverflowTooltip: true,
  render: (row) => ["整箱", "SKU"][row.type] || "--",
};
const EDIT_PAGE_TABLE_COL_10 = {
  prop: "orderNum",
  label: overseaLangObj.batch_number || "批次号",
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_11 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer("客户"),
  minWidth: 130,
  showOverflowTooltip: true,
};
const EDIT_PAGE_TABLE_COL_12 = {
  prop: "logisticsProduct",
  label: overseaLangObj.wl_cp("物流产品"),
  minWidth: 130,
  showOverflowTooltip: true,
  render: (r) =>
    `${r.logisticsProductCode || "--"}[${r.logisticsProductNameCn || "--"}]`,
};
const EDIT_PAGE_TABLE_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  customRow: true,
  fixed: "right",
  width: "120px",
};
export const editTableColumns = (isSee) => {
  const EDIT_PAGE_TABLE_COLS = [
    EDIT_PAGE_TABLE_COL_0, //
    EDIT_PAGE_TABLE_COL_1, //工作单号
    EDIT_PAGE_TABLE_COL_6, //数量
    EDIT_PAGE_TABLE_COL_2, //跟踪号
    EDIT_PAGE_TABLE_COL_4, //产品SKU
    EDIT_PAGE_TABLE_COL_5, //产品名称
    EDIT_PAGE_TABLE_COL_7, //托盘编号
    EDIT_PAGE_TABLE_COL_8, //所在库位
    EDIT_PAGE_TABLE_COL_10, //批次号
    EDIT_PAGE_TABLE_COL_3, //地址
    EDIT_PAGE_TABLE_COL_1_5, //客户名称
    EDIT_PAGE_TABLE_COL_9, //入库类型
  ];
  return isSee
    ? EDIT_PAGE_TABLE_COLS
    : [...EDIT_PAGE_TABLE_COLS, EDIT_PAGE_TABLE_COL_99];
};

const SEARCH_DRAWER_COL_1 = {
  id: "number",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_DRAWER_COL_2 = {
  id: "traceNumber",
  label: `${overseaLangObj.tracking_no || "跟踪号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_DRAWER_COL_3 = {
  id: "address",
  label: `${overseaLangObj.sh_address || "目的地址"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_DRAWER_COL_4 = {
  id: "productSku",
  label: `${overseaLangObj.cp_sku || "产品SKU"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_DRAWER_COL_6 = {
  id: "customerId",
  label: `${overseaLangObj.kh_customer("客户")}：`,
  ...httpCustomerSelect(),
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
                SEARCH_COL_9,
                SEARCH_DRAWER_COL_6,
                // SEARCH_DRAWER_COL_2,
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
  EDIT_PAGE_TABLE_COL_1, //工作单号
  EDIT_PAGE_TABLE_COL_11, // 客户
  EDIT_PAGE_TABLE_COL_12, // 物流产品
  EDIT_PAGE_TABLE_COL_4, //产品SKU
  EDIT_PAGE_TABLE_COL_6, //数量
];

const SEARCH_DETAIL_COL_6 = {
  id: "type",
  label: "出库类型：",
  placeholder: "出库类型",
  type: "select",
  basicType: "labelingBusinessType",
};
const SEARCH_DETAIL_COL_8 = {
  id: "trayNumber",
  label: "托盘编号：",
  placeholder: "托盘编号",
  type: "text",
};
const SEARCH_DETAIL_COL_9 = {
  id: "orderNum",
  label: "批次号：",
  placeholder: "批次号",
  type: "text",
};
const SEARCH_DETAIL_COL_10 = {
  id: "userName",
  label: "配货员：",
  placeholder: "--",
  type: "txt",
};
const SEARCH_DETAIL_TAB_1 = [
  {
    ...SEARCH_COL_1,
    label: "关联时间：",
  },
  SEARCH_COL_6,
  SEARCH_COL_3,
  SEARCH_DRAWER_COL_1,
  SEARCH_DRAWER_COL_2,
  SEARCH_DETAIL_COL_6,
  SEARCH_DRAWER_COL_4,
  SEARCH_DETAIL_COL_8,
  SEARCH_DETAIL_COL_9,
];
//

const pickConfig = [
  //拣货单详情Form配置
  EDIT_PAGE_COL_1,
  {
    ...EDIT_PAGE_COL_2,
    type: "txt",
  },
  {
    ...EDIT_PAGE_COL_5,
    type: "txt",
  },
  SEARCH_DETAIL_COL_10,
];

export const pickingListDetails = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: pickConfig,
          },
        ],
      },
    ],
  },
];

export const searchDetailColumns = (idx) => {
  return [
    {
      // className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_DETAIL_TAB_1, SEARCH_DETAIL_TAB_1][idx],
            },
          ],
        },
      ],
    },
  ];
};

const DETAIL_TABLE_COL_3 = {
  prop: "type",
  label: "出库类型",
  fixed: "left",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "labelingBusinessType",
};
const DETAIL_TABLE_COL_5 = {
  prop: "xx_des_5",
  label: "PAD拣货数",
  minWidth: 100,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_6 = {
  prop: "xx_des_6",
  label: "配货数",
  minWidth: 100,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_7 = {
  prop: "xx_des_7",
  label: "已扫描数",
  minWidth: 100,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_9 = {
  prop: "isSticker",
  label: overseaLangObj.tb_labeling("需贴标"),
  minWidth: 100,
  align: "center",
  basicType: "pickStickerStatus",
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_10 = {
  prop: "stickerType",
  label: overseaLangObj.db_zt || "打包状态",
  minWidth: 100,
  align: "center",
  showOverflowTooltip: true,
  basicType: "pickPackStatus",
};
const DETAIL_TABLE_COL_16 = {
  prop: "boxNumber",
  label: "箱号",
  minWidth: 130,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_20 = {
  prop: "predictionTime",
  label: overseaLangObj.gl_time || "关联时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_21 = {
  prop: "area",
  label: overseaLangObj.sz_qq("所在区域"),
  minWidth: 130,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_22 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer_name || "客户名称",
  minWidth: 100,
  showOverflowTooltip: true,
};

const DETAIL_TABLE_COL_TAB_COM = (tCol) => [
  TABLE_COL_0,
  ...(tCol === 1 ? [TABLE_COL_SELECTION] : []),
  EDIT_PAGE_TABLE_COL_1, //工作单号
  {
    ...EDIT_PAGE_TABLE_COL_6,
    fixed: "left",
  }, //数量
  EDIT_PAGE_TABLE_COL_2, //跟踪号
  EDIT_PAGE_TABLE_COL_4, //产品SKU
];
const DETAIL_TABLE_COL_TAB_1 = [
  ...DETAIL_TABLE_COL_TAB_COM(1),
  EDIT_PAGE_TABLE_COL_5, //产品名称
  EDIT_PAGE_TABLE_COL_7, //托盘编号
  DETAIL_TABLE_COL_21, //所在区域
  EDIT_PAGE_TABLE_COL_8, //所在库位
  DETAIL_TABLE_COL_9, //需贴标
  DETAIL_TABLE_COL_10, //打包状态
  EDIT_PAGE_TABLE_COL_10, //批次号
  EDIT_PAGE_TABLE_COL_3, //地址
  DETAIL_TABLE_COL_22, //客户信息
  DETAIL_TABLE_COL_20, //关联时间
  TABLE_COL_13_DETAIL,
];
const DETAIL_TABLE_COL_TAB_2 = [
  ...DETAIL_TABLE_COL_TAB_COM(),
  EDIT_PAGE_TABLE_COL_10, //批次号
  DETAIL_TABLE_COL_9, //需贴标
  DETAIL_TABLE_COL_10, //打包状态
  EDIT_PAGE_TABLE_COL_3, //地址
  DETAIL_TABLE_COL_22, //客户信息
  DETAIL_TABLE_COL_20, //关联时间
  TABLE_COL_13_DETAIL,
];
export const tableDetailCols = (tab = 0) => {
  return [DETAIL_TABLE_COL_TAB_1, DETAIL_TABLE_COL_TAB_2][tab];
};
