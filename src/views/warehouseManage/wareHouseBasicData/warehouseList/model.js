import {
  httpPartitionSelect,
  httpLocationTypeSelect,
  httpLocationShelfSelect,
} from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COL_1 = {
  id: "createTime",
  label: `${overseaLangObj.create_time || "创建时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "warehouseCode",
  label: `${overseaLangObj.ck_dm || "仓库代码"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "cusWarehouseName",
  label: `${overseaLangObj.ck_name || "仓库名称"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "cusType",
  label: `${overseaLangObj.lx_type("仓库类型")}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "haveWarehouseType",
};
const SEARCH_COL_5 = {
  id: "statusList",
  label: `${overseaLangObj.zt_status || "状态"}：`,
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "status",
  hideList: [0],
};
const SEARCH_TAB_2_COL_2 = {
  id: "code",
  label: "分区代码：",
  label: `${overseaLangObj.fq_code || "分区代码"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_TAB_2_COL_3 = {
  id: "nameCn",
  label: `${overseaLangObj.fq_name("名称")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_TAB_2_COL_4 = {
  id: "statusList",
  label: `${overseaLangObj.zt_status || "状态"}：`,
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "status",
};
const SEARCH_TAB_3_COL_2 = {
  id: "warehousePartitionId",
  label: `${overseaLangObj.ss_qy || "所属区域"}：`,
  // noPaging: true,
  // isAutoInitRequest: true,
  ...httpPartitionSelect(),
  type: "slot",
};
const SEARCH_TAB_3_COL_3 = {
  id: "type",
  label: `${overseaLangObj.kw_lx() || "库位类型"}：`,
  ...httpLocationTypeSelect(),
  type: "slot",
};
const SEARCH_TAB_3_COL_4 = {
  id: "statusSearch",
  label: `${overseaLangObj.zt_status || "状态"}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "status",
};
const SEARCH_TAB_3_COL_5 = {
  id: "pickingFreightType",
  label: `${overseaLangObj.jh_type || "拣货类型"}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "pickingFreightType",
};
const SEARCH_TAB_3_COL_6 = {
  id: "createBy",
  label: "创建人：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_TAB_4_COL_2 = {
  id: "code",
  label: `${overseaLangObj.kw_lx_dm || "库位类型代码"}：`,
  placeholder: "请输入",
  labelWidth: "105px",
  type: "text",
};
const SEARCH_TAB_4_COL_3 = {
  id: "nameCn",
  label: `${overseaLangObj.kw_lx_name || "类型名称"}：`,
  placeholder: "请输入",
  type: "text",
};

const SEARCH_COL_6 = {
  id: "code",
  label: `${overseaLangObj.kw_location() || "库位"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_7 = {
  id: "shelfId",
  label: `${overseaLangObj.goods_shelves("排货架")}：`,
  ...httpLocationShelfSelect(),
  type: "slot",
};
const SEARCH_COL_8 = {
  id: "rowNo",
  label: `${overseaLangObj.djp_floor || "第几排"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_9 = {
  id: "useStatus",
  label: `${overseaLangObj.sy_qk || "使用情况"}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "trueOrFalse",
};

const SEARCH_COL_TAB_1 = [
  {
    ...SEARCH_COL_1,
    label: "修改时间：",
  },
  SEARCH_COL_2,
  SEARCH_COL_3,
  SEARCH_COL_4,
  SEARCH_COL_5,
];
const SEARCH_COL_TAB_2 = [
  SEARCH_COL_1,
  SEARCH_TAB_2_COL_2,
  SEARCH_TAB_2_COL_3,
  SEARCH_TAB_2_COL_4,
];
const SEARCH_COL_TAB_3 = [
  SEARCH_COL_6, //库位
  SEARCH_TAB_3_COL_2, //所属区域
  {
    ...SEARCH_COL_7,
    id: "freightShelfId",
  }, //派货架
  SEARCH_TAB_3_COL_4, //状态
  SEARCH_TAB_3_COL_3, //库位类型
  SEARCH_TAB_3_COL_5, //拣货类型
  SEARCH_COL_8, //第几排
  SEARCH_COL_9,
];
const SEARCH_COL_TAB_4 = [
  SEARCH_COL_1,
  SEARCH_TAB_4_COL_2,
  SEARCH_TAB_4_COL_3,
  SEARCH_TAB_3_COL_4,
];
export const searchColumns = (idx = 0) => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COL_TAB_1,
                SEARCH_COL_TAB_2,
                SEARCH_COL_TAB_3,
                SEARCH_COL_TAB_4,
              ][idx],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_DRAWER_COL_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  // fixed: 'left'
};
const TABLE_COL_1 = {
  prop: "warehouseCode",
  label: overseaLangObj.ck_dm || "仓库代码",
  minWidth: 150,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "cusWarehouse.warehouseName",
  label: overseaLangObj.ck_name || "仓库名称",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "platformType",
  label: overseaLangObj.rk_type("平台类型"),
  minWidth: 120,
  sortable: true,
  basicType: "warehouseType",
};
const TABLE_COL_4 = {
  prop: "cusType",
  label: overseaLangObj.lx_type("仓库类型"),
  sortable: true,
  customRow: true,
  minWidth: 120,
};
const TABLE_COL_5 = {
  prop: "nationTwoCode",
  label: overseaLangObj.gj_country || "国家",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => `${row.nationTwoCode}[${row.nationName}]`,
};
const TABLE_COL_6 = {
  prop: "timezone",
  label: overseaLangObj.dd_time || "当地时间",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "cusWarehouse.contacts",
  label: overseaLangObj.lxr_contacts || "联系人",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "cusWarehouse.detailAddress",
  label: overseaLangObj.xx_dz || "详细地址",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "dataStatus",
  label: overseaLangObj.zt_status_fn("仓库状态"),
  minWidth: 120,
  sortable: true,
  customRow: true,
  basicType: "status",
};
const TABLE_COL_10 = {
  prop: "cusWarehouse.updateBy",
  label: overseaLangObj.last_modified_by || "最后修改人",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "cusWarehouse.updateTime",
  label: overseaLangObj.last_modified() || "最后修改时间",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  // customRow: true,
  columnOperation: true,
  fixed: "right",
  width: 156,
};
const TABLE_COL_13 = {
  prop: "cusWarehouse.customerComName",
  label: overseaLangObj.ss_fgs || "所属分公司",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_2_1 = {
  prop: "code",
  label: overseaLangObj.fq_code || "分区代码",
  customRow: true,
  // minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2_2 = {
  prop: "nameCn",
  label: overseaLangObj.fq_cn_name("名称(CN)"),
  // minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2_3 = {
  prop: "nameEn",
  label: overseaLangObj.fq_en_name("名称(EN)"),
  // minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2_4 = {
  prop: "type",
  label: overseaLangObj.fq_type || "分区类型",
  // minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "warehousePartitionType",
};
const TABLE_COL_2_6 = {
  prop: "remark",
  label: overseaLangObj.bz_remark() || "备注",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2_7 = {
  prop: "status",
  label: overseaLangObj.zt_status || "状态",
  minWidth: 110,
  customRow: true,
  sortable: true,
  basicType: "status",
};
const TABLE_COL_2_8 = {
  prop: "createBy",
  label: overseaLangObj.cjr_create || "创建人",
  minWidth: 98,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2_9 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  minWidth: 136,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_3_1 = {
  prop: "code",
  label: overseaLangObj.kw_location("库位"),
  customRow: true,
  minWidth: 150,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3_2 = {
  prop: "warehouseName",
  label: overseaLangObj.ck_lb("所属仓库"),
  minWidth: 150,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3_3 = {
  prop: "warehousePartitionName",
  label: overseaLangObj.ss_qy || "所属区域",
  minWidth: 150,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3_4 = {
  prop: "typeName",
  label: overseaLangObj.kw_lx() || "库位类型",
  minWidth: 150,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3_5 = {
  prop: "freightShelfId",
  label: overseaLangObj.goods_shelves("排货架"),
  minWidth: 90,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3_6 = {
  prop: "rowNo",
  label: overseaLangObj.djp_floor || "第几排",
  minWidth: 90,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3_7 = {
  prop: "no",
  label: overseaLangObj.ds_num || "多少号",
  minWidth: 90,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3_8 = {
  prop: "pickingFreightType",
  label: overseaLangObj.jh_type || "拣货类型",
  minWidth: 98,
  // sortable: true,
  basicType: "pickingFreightType",
  showOverflowTooltip: true,
};
const TABLE_COL_3_9 = {
  prop: "remark",
  label: overseaLangObj.bz_remark() || "备注",
  // sortable: true,
  minWidth: 150,
  showOverflowTooltip: true,
};
const TABLE_COL_3_10 = {
  prop: "status",
  label: overseaLangObj.zt_status || "状态",
  minWidth: 90,
  dotColor: true,
  // sortable: true,
  showOverflowTooltip: true,
  basicType: "status",
};
const TABLE_COL_3_11 = {
  prop: "useStatus",
  label: overseaLangObj.sy_qk || "使用情况",
  width: 98,
  // sortable: true,
  basicType: "trueOrFalse",
};

const TABLE_COL_4_1 = {
  prop: "code",
  label: overseaLangObj.kw_lx_dm || "库位类型代码",
  customRow: true,
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4_2 = {
  prop: "nameCn",
  label: overseaLangObj.lx_cn_name || "类型名称(CN)",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4_3 = {
  prop: "nameEn",
  label: overseaLangObj.lx_en_name || "类型名称(EN)",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4_5 = {
  prop: "length",
  label: overseaLangObj.c_length() || "长(CM)",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 2,
};
const TABLE_COL_4_6 = {
  prop: "width",
  label: overseaLangObj.k_width() || "宽(CM)",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 2,
};
const TABLE_COL_4_7 = {
  prop: "height",
  label: overseaLangObj.g_height() || "高(CM)",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 2,
};
const TABLE_COL_4_8 = {
  prop: "volume",
  label: overseaLangObj.tj_m_volume || "体积(m³)",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 4,
};
const TABLE_COL_4_9 = {
  prop: "status",
  label: overseaLangObj.zt_status || "状态",
  minWidth: 120,
  sortable: true,
  customRow: true,
  basicType: "status",
};

const TABLE_TAB_1 = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_13,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
];

const TABLE_TAB_2 = [
  TABLE_COL_0,
  TABLE_COL_2_1,
  TABLE_COL_2_2,
  TABLE_COL_2_3,
  TABLE_COL_2_4,
  // TABLE_COL_2_5,
  TABLE_COL_2_6,
  TABLE_COL_2_7,
  TABLE_COL_2_8,
  TABLE_COL_2_9,
  TABLE_COL_12,
];

const TABLE_TAB_3 = [
  TABLE_COL_0,
  TABLE_DRAWER_COL_SELECTION,
  TABLE_COL_3_1,
  // TABLE_COL_3_2,
  TABLE_COL_3_3,
  TABLE_COL_3_4,
  TABLE_COL_3_5,
  TABLE_COL_3_6,
  TABLE_COL_3_7,
  TABLE_COL_3_8,
  TABLE_COL_3_9,
  TABLE_COL_3_11,
  TABLE_COL_3_10,
  {
    ...TABLE_COL_2_8,
    sortable: false,
  },
  {
    ...TABLE_COL_2_9,
    sortable: false,
  },
  TABLE_COL_12,
];

const TABLE_TAB_4 = [
  TABLE_COL_0,
  TABLE_COL_4_1,
  TABLE_COL_4_2,
  TABLE_COL_4_3,
  // TABLE_COL_4_4,
  TABLE_COL_4_5,
  TABLE_COL_4_6,
  TABLE_COL_4_7,
  TABLE_COL_4_8,
  TABLE_COL_4_9,
  TABLE_COL_2_8,
  TABLE_COL_2_9,
  TABLE_COL_12,
];
export const tableColumns = (tab = 0) => {
  return [TABLE_TAB_1, TABLE_TAB_2, TABLE_TAB_3, TABLE_TAB_4][tab];
};

const DETAIL_COL_1 = {
  span: 6,
  id: "type",
  label: `${overseaLangObj.ck_dm || "仓库代码"}：`,
  type: "slot",
  basicType: "haveWarehouseType",
};
const DETAIL_COL_2 = {
  span: 6,
  id: "warehouseName",
  label: `${overseaLangObj.ck_name || "仓库名称"}：`,
  type: "txt",
};
const DETAIL_COL_3 = {
  span: 6,
  id: "nationTwoCode",
  label: `${overseaLangObj.gj_country || "国家"}：`,
  type: "txt",
  render: (row) => `${row.nationTwoCode}[${row.nationName}]`,
};
const DETAIL_COL_4 = {
  span: 6,
  id: "timezone",
  label: `${overseaLangObj.dd_time || "当地时间"}：`,
  type: "txt",
};
const DETAIL_COL_5 = {
  span: 6,
  id: "contacts",
  label: `${overseaLangObj.lxr_contacts || "联系人"}：`,
  type: "txt",
};
const DETAIL_COL_6 = {
  span: 6,
  id: "totalAcreage",
  label: `${overseaLangObj.ck_zmj || "仓库总面积"}：`,
  type: "txt",
};
const DETAIL_COL_7 = {
  span: 12,
  id: "detailAddress",
  label: `${overseaLangObj.dz_address("仓库地址")}：`,
  type: "txt",
};
const DETAIL_COL_8 = {
  span: 6,
  id: "phone",
  label: `${overseaLangObj.lx_dh_telephone("联系人电话")}：`,
  type: "txt",
};
const DETAIL_COL_9 = {
  span: 6,
  id: "email",
  label: `${overseaLangObj.contact_email("联系邮箱")}：`,
  type: "txt",
};
const DETAIL_COL_10 = {
  span: 12,
  id: "remark",
  label: `${overseaLangObj.bz_remark() || "备注"}：`,
  type: "txt",
};

export const detailFromCols = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              DETAIL_COL_1,
              DETAIL_COL_2,
              DETAIL_COL_3,
              DETAIL_COL_4,
              DETAIL_COL_5,
              DETAIL_COL_6,
              DETAIL_COL_7,
              DETAIL_COL_8,
              DETAIL_COL_9,
              DETAIL_COL_10,
            ],
          },
        ],
      },
    ],
  },
];

export const detailLeftTableConfig = [
  TABLE_COL_0,
  {
    ...TABLE_COL_2_1,
    prop: "type",
    basicType: "warehousePartitionType",
    // minWidth: 120
  },
  TABLE_COL_2_2,
  TABLE_COL_2_3,
  {
    ...TABLE_COL_2_7,
    label: "",
    // minWidth: 100
  },
];

export const detailRightTableConfig = [
  TABLE_COL_0,
  TABLE_COL_3_1,
  TABLE_COL_3_2,
  TABLE_COL_3_3,
  TABLE_COL_3_4,
  TABLE_COL_3_8,
  TABLE_COL_3_10,
  TABLE_COL_12,
];
