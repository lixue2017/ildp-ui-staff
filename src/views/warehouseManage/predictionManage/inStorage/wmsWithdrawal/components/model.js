import overseaLangObj from "@/language/overseasLang.js";

export const detailCardConfig = (vType) => {
  const CARD_COL_1 = {
    renderFn: (r) =>
      r.customerBelongId !== r.wmsBelongId
        ? r.customerBelongShortName
        : r.customerShortName,
  };
  return [
    {
      titleLabel: "委托人",
      backgroundColor: "#ECF3FF",
      labelColor: "#80B1FF",
      contentList: [
        {
          valueKey: "customerShortName",
          valueColor: "#5094FF",
          ...(["tc_warehouse"].includes(vType) ? CARD_COL_1 : {}),
        },
      ],
    },
    {
      backgroundColor: "#FFF3EC",
      titleLabel: "工作单号",
      labelColor: "#FF985C",
      contentList: [
        {
          valueKey: "orderSn",
          valueColor: "#FF813D",
        },
      ],
    },
    {
      titleLabel: "合计应收/应付(RMB)",
      backgroundColor: "#ECECFF",
      labelColor: "#B1B1FF",
      valueColor: "#7676FF",
      contentList: [
        {
          label: "应收",
          valueKey: "totalReceiveRMB",
          decimal: 2,
        },
        {
          label: "应付",
          valueKey: "totalPayRMB",
          decimal: 2,
        },
      ],
    },
    {
      titleLabel: "合计实收/实付(RMB)",
      backgroundColor: "#D2F1FF",
      labelColor: "#64CFFF",
      valueColor: "#13B5FF",
      contentList: [
        {
          label: "实收",
          valueKey: "totalRealityReceiveRMB",
          decimal: 2,
        },
        {
          label: "实付",
          valueKey: "totalRealityPayRMB",
          decimal: 2,
        },
      ],
    },
  ];
};

// const DETAILS_FORM_COL_1 = {

// };
const DETAILS_FORM_COL_2 = {
  span: 8,
  id: "wmsCodeName",
  label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
  type: "txt",
  render: (r) => `${r.wmsCode || "--"}/${r.wmsName || "--"}`,
  txtTagArr: [
    {
      tagKey: "wmsBelongCompany",
    },
  ],
};
const DETAILS_FORM_COL_3 = {
  span: 8,
  id: "referenceNo",
  label: `${overseaLangObj.ck_bm || "参考编号"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_4 = {
  span: 8,
  id: "returnType",
  label: `退仓原因：`,
  type: "txt",
  basicType: "returnType",
  fontColor: true,
};

export const warehouseHeadCols = (vType) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 8,
                  id: ["tc_warehouse"].includes(vType)
                    ? "wmsBelongShortName"
                    : "customerBelongShortName",
                  label: `${overseaLangObj.kh_gs || "客户归属"}：`,
                  type: "txt",
                },
                DETAILS_FORM_COL_2,
                DETAILS_FORM_COL_3,
                DETAILS_FORM_COL_4,
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const warehouseOrderTypeCols = () => {
  // 订单-WMS退仓入
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "remark",
                  label: "订单备注",
                  type: "txt",
                  className: "label-top-title",
                  textLineClamp: 5,
                  showMoreTextBtn: true,
                },
                {
                  span: 24,
                  id: "businessRemark",
                  label: "业务备注",
                  type: "textarea",
                  placeholder: "请输入",
                  className: "label-top-title",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};

const GOODS_TABLE_COL_EXPAND = {
  type: "expand",
  prop: "expand",
  customRow: true,
  width: 1,
  // fixed: "left",
};
const GOODS_TABLE_COL_1 = {
  prop: "type",
  label: "类型",
  width: 106,
  showOverflowTooltip: true,
  basicType: "packageType",
};
const GOODS_TABLE_COL_2 = {
  prop: "trackSn",
  label: "包裹跟踪号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const GOODS_TABLE_COL_3 = {
  label: "预计入仓时间",
  prop: "expectedWarehousingTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const GOODS_TABLE_COL_4 = {
  label: "关联单号",
  prop: "joinBusinessSn",
  minWidth: 120,
  showOverflowTooltip: true,
};
const GOODS_TABLE_COL_5 = {
  label: "", // 包裹状态
  prop: "slotState",
  width: 100,
  showOverflowTooltip: true,
  customRow: true,
  basicType: "returnWmsOrderPackageState",
  basicTypeVal: "state",
};

export const detailTableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  GOODS_TABLE_COL_EXPAND,
  GOODS_TABLE_COL_1,
  GOODS_TABLE_COL_2,
  GOODS_TABLE_COL_3,
  GOODS_TABLE_COL_4,
  GOODS_TABLE_COL_5,
];
