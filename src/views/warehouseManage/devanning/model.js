import overseaLangObj from "@/language/overseasLang.js";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";

const strippingSearchCols = {
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  id: "createTime",
                  label: `${overseaLangObj.yy_cg_date}：`,
                  oneLineTipLabel: true,
                  startPlaceholder: "开始日期",
                  endPlaceholder: "结束日期",
                  type: "daterange",
                  valueFormat: "yyyy-MM-dd",
                },
                {
                  id: "bailorPeople",
                  label: `${overseaLangObj.wtr_customer}：`,
                  placeholder: "请输入",
                  type: "text",
                },
                {
                  id: "sortBoxRegisterNo",
                  label: `${overseaLangObj.gn_djh}：`,
                  oneLineTipLabel: true,
                  placeholder: "请输入",
                  type: "text",
                },
                {
                  id: "nlCode",
                  label: `${overseaLangObj.nl_no}：`,
                  placeholder: "请输入",
                  type: "text",
                },
                {
                  id: "actualTime",
                  label: `${overseaLangObj.sj_cg_date()}：`,
                  oneLineTipLabel: true,
                  startPlaceholder: "开始日期",
                  endPlaceholder: "结束日期",
                  type: "daterange",
                  valueFormat: "yyyy-MM-dd",
                },
                {
                  id: "orderOperationNum",
                  label: `${overseaLangObj.gz_dh}：`,
                  placeholder: "请输入",
                  type: "text",
                },
                {
                  id: "ontainerSno",
                  label: `${overseaLangObj.gh_container_no}：`,
                  placeholder: "请输入",
                  type: "text",
                },
                {
                  id: "intendDevannBusinessSource",
                  label: `${overseaLangObj.yw_type}：`,
                  placeholder: "请选择",
                  type: "select",
                  basicType: "intendDevannBusinessSource",
                },
                {
                  id: "statusList",
                  label: `${overseaLangObj.zt_status}：`,
                  placeholder: "状态（多选）",
                  type: "select",
                  multiple: true,
                  basicType: "strippingStatus",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const TABLE_COL_1 = {
  prop: "nlcode",
  label: overseaLangObj.nl_no || "NL编号",
  showOverflowTooltip: true,
  minWidth: 140,
  sortable: true,
  customRow: true,
  fixed: "left",
};
const strippingTableCols = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    ...TABLE_COL_1,
    sortable: true,
  },
  {
    prop: "sortBoxRegisterNo",
    label: overseaLangObj.gn_djh || "国内登记号",
    showOverflowTooltip: true,
    minWidth: 130,
    sortable: true,
    fixed: "left",
  },
  {
    prop: "orderOperationNum",
    label: overseaLangObj.gz_dh || "工作单号",
    showOverflowTooltip: true,
    minWidth: 140,
    sortable: true,
    customRow: true,
    fixed: "left",
  },
  {
    prop: "intendDevannBusinessSource",
    label: overseaLangObj.yw_type || "业务类型",
    showOverflowTooltip: true,
    minWidth: 96,
    sortable: true,
    fontColor: true,
    basicType: "intendDevannBusinessSource",
  },
  {
    prop: "bailorPeople",
    label: overseaLangObj.wtr_customer || "委托人",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "ontainerSno",
    label: overseaLangObj.gh_container_no || "柜号",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "realFreightBoxInfo",
    label: overseaLangObj.gx_gl || "柜型柜量",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "splitBoxTime",
    label: overseaLangObj.yy_cg_date || "预约拆柜时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140,
  },
  {
    prop: "actualSplitBoxTime",
    label: overseaLangObj.sj_cg_date("实际拆柜时间"),
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 126,
  },
  {
    prop: "boxRemark",
    label: overseaLangObj.bz_remark() || "备注",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "trailerName",
    label: overseaLangObj.tc_gs || "拖车公司",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "overseasOperator",
    label: overseaLangObj.hw_operator || "海外操作员",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
  },
  // {
  //   prop: "csOperator",
  //   label: "长沙操作员",
  //   sortable: true,
  //   showOverflowTooltip: true,
  //   minWidth: 120
  // },
  {
    prop: "boxStatus",
    label: overseaLangObj.zt_status || "状态",
    sortable: true,
    dotColor: true,
    showOverflowTooltip: true,
    minWidth: 76,
    basicType: "strippingStatus",
    fixed: "right",
  },
  {
    prop: "operation",
    label: overseaLangObj.cz_operation || "操作",
    width: 152,
    fixed: "right",
    columnOperation: true,
  },
];

export { strippingSearchCols, strippingTableCols };

/**
 * 操作单详情节点与清关有引用
 */
export const realityCabinetCols = (obj) => {
  const { salesman } = obj || {};
  return {
    title: overseaLangObj.sj_tcg("实际提拆柜"),
    width: "500px",
    labelWidth: overseaLangObj.yu_yan_lang === "en-us" ? "152px" : "105px",
    simpleCustomCols: [
      {
        span: 24,
        id: "actualSplitBoxTime",
        label: `${overseaLangObj.sj_cg_date("拆柜时间")}：`,
        placeholder: "日期",
        type: "datetime",
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        noSlotLabel: true,
      },
      {
        span: 24,
        id: "warehouseId",
        selectLabelKey: "putWarehousing",
        isSelectLabelParam: true,
        label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
        ...httpWarehousePublicSelect({
          typeList: "2",
          isHaveComId: 1,
          flagAvailable: "h",
          salesman,
          permissionType: 2,
        }),
      },
      {
        span: 24,
        id: "devanningRemark",
        label: `${overseaLangObj.bz_remark("备注")}：`,
        placeholder: "请输入",
        type: "textarea",
        maxlength: 500,
      },
    ],
    formRules: {
      actualSplitBoxTime: [
        { required: true, message: `请选择时间`, trigger: "change" },
      ],
      warehouseId: [
        { required: true, message: `请选择入库仓`, trigger: "change" },
      ],
    },
  };
};

const SEARCH_COL_1 = {
  id: "gndjh",
  label: `${overseaLangObj.gn_djh || "国内登记号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_2 = {
  id: "nlCode",
  label: `${overseaLangObj.nl_no}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "orderSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "stateList",
  label: `${overseaLangObj.zt_status}：`,
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "shelvePlanState",
};

export const pkSearchColumns = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_COL_1, SEARCH_COL_2, SEARCH_COL_3, SEARCH_COL_4],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_PK_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_PK_COL_1 = {
  prop: "gndjh",
  label: overseaLangObj.gn_djh || "国内登记号",
  minWidth: 130,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_PK_COL_2 = {
  prop: "nlCode",
  label: overseaLangObj.nl_no,
  minWidth: 130,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_PK_COL_3 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 130,
  // sortable: true,
  showOverflowTooltip: true,
  // columnLink: true,
};
const TABLE_PK_COL_4 = {
  prop: "rkcCode",
  label: overseaLangObj.ck_lb("所属仓库"),
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_PK_COL_5 = {
  prop: "cgOrRcYySj",
  label: "拆柜/入仓预约时间",
  minWidth: 130,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_PK_COL_6 = {
  prop: "cgOrRcSjSj",
  label: "卸柜时间",
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_PK_COL_7 = {
  prop: "state",
  label: overseaLangObj.zt_status || "状态",
  // sortable: true,
  dotColor: true,
  minWidth: 76,
  basicType: "shelvePlanState",
};
const TABLE_PK_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  // fixed: "right",
  width: 166,
};
export const pkTableColumns = () => {
  return [
    TABLE_PK_COL_0,
    TABLE_PK_COL_1,
    TABLE_PK_COL_2,
    TABLE_PK_COL_3,
    TABLE_PK_COL_4,
    TABLE_PK_COL_5,
    TABLE_PK_COL_6,
    TABLE_PK_COL_7,
    TABLE_PK_COL_99,
  ];
};
