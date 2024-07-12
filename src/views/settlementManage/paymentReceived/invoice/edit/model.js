import {
  httpRoleDeptUserSelect,
  httpCrmListSelect,
  httpBusinessAddressSelect,
  httpInvoiceCurrencySelect,
  httpSettleAccountsSalesman,
} from "@/comModel/httpSelect";
import {
  SEARCH_SETTLEMENT_COL_1,
  SEARCH_SETTLEMENT_COL_2,
} from "@/views/settlementManage/components/comModel.js";
import { getAddressIdsInfo } from "@/api/customerManage/customerList.js";
import { formatMoney } from "@/utils/index";

const EDIT_FORM_COL_1 = {
  span: 12,
  id: "invoiceType",
  label: "发票类型：",
  type: "radio",
  placeholder: "请选择",
  basicType: "invoiceType",
};
const EDIT_FORM_COL_2 = {
  span: 12,
  id: "invoiceCurrencyObj",
  label: "发票币别：",
  placeholder: "请选择",
  isBackAll: true,
  noClearable: true,
  ...httpInvoiceCurrencySelect(),
};
const EDIT_FORM_COL_3 = {
  span: 12,
  id: "invoiceMedium",
  label: "发票介质：",
  type: "radio",
  className: "white-space-nowrap",
  infoTip: `<div class="title">电子(纸质)发票：</div>
		<div class="info">1. 客户公对公付款(开票抬头与付款抬头一致)；</div>
		<div class="info">2. 客户通过其他公司或个人对公付款(开票抬头与付款抬头不一致，必须提供付款委托书)；</div>
		<div class="info">3. 客户通过境外主体付人民币到公司浦发银行(浦发银行需要提供发票才能入账)；</div>
		<div class="title margin-top">销账发票：</div>
		<div class="info">1. 客户通过第三方支付平台对公付款；</div>
		<div class="info">2. 客户通过境外主体对公付外币；</div>
		<div class="info">3. 境外客户委托个人对公付款；</div>
		<div class="info">4. 客户通过个人付款到现金账户；</div>
		<div class="info">5. 客户付款到公司第三方支付平台账户(寻汇)；</div>`,
  placeholder: "请选择",
  basicType: "invoiceMedium",
};
const EDIT_FORM_COL_4 = {
  span: 12,
  id: "invoiceDate",
  label: "开票日期：",
  placeholder: "--",
  type: "txt",
  // placeholder: "年/月/日",
  // type: "date",
  // valueFormat: "yyyy-MM-dd"
};
const EDIT_FORM_COL_5 = {
  span: 6,
  id: "invoiceCode",
  label: "发票代码：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_FORM_COL_6 = {
  span: 6,
  id: "invoiceNumber",
  label: "发票号码：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_FORM_COL_7 = {
  // 发票币别合计
  span: 12,
  id: "costMoney",
  label: "合计金额 ：",
  placeholder: "合计金额",
  type: "slot",
};
const EDIT_FORM_COL_8 = {
  // 本位币合计
  span: 12,
  id: "costRMBMoney",
  customLabel: true,
  slotLabel: "合计金额：",
  type: "slot",
};
const EDIT_FORM_COL_9 = {
  span: 12,
  id: "bigCostMoney",
  label: "金额(大写)：",
  placeholder: "--",
  type: "txt",
};

const EDIT_FORM_COL_10 = {
  span: 12,
  id: "salesman",
  selectLabelKey: "salesmanName",
  label: "业务员：",
  placeholder: "请选择",
  ...httpSettleAccountsSalesman(),
  type: "slot",
};
const EDIT_FORM_COL_11 = {
  span: 12,
  id: "drawer",
  selectLabelKey: "drawerName",
  label: "开票人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
};
const EDIT_FORM_COL_12 = {
  span: 12,
  id: "reviewer",
  selectLabelKey: "reviewerName",
  label: "复核人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
};
const EDIT_FORM_COL_33 = {
  // 占位用
  span: 12,
  id: "xx_apply_33",
  type: "slot",
};

const EDIT_FORM_COL_201 = {
  span: 6,
  id: "customerEmail",
  label: "客户邮箱：",
  placeholder: "请输入",
  type: "text",
  maxlength: 126,
};
const EDIT_FORM_COL_203 = {
  span: 6,
  id: "expressPaymentMethod",
  label: "运费方式：",
  type: "radio",
  placeholder: "请选择",
  dicsStr: "web_freight_mode",
  customDicsArr: [0, 1],
};
const EDIT_FORM_COL_205 = {
  span: 12,
  id: "expressCompany",
  label: "快递公司：",
  type: "txt",
  placeholder: "--",
  basicType: "express",
};
const EDIT_FORM_COL_206 = {
  span: 12,
  id: "expressOrder",
  label: "快递单号：",
  type: "txt",
  placeholder: "--",
};
const EDIT_FORM_COL_207 = {
  span: 6,
  id: "acceptObj",
  label: "收件人：",
  placeholder: "请选择",
};
const EDIT_FORM_COL_208 = {
  span: 6,
  id: "expressAcceptTelephone",
  label: "电话：",
  type: "text",
  placeholder: "请输入",
};
const EDIT_FORM_COL_209 = {
  span: 6,
  id: "expressAcceptCountry",
  label: "收件人公司：",
  type: "text",
  placeholder: "请输入",
};
const EDIT_FORM_COL_210 = {
  span: 6,
  id: "expressGiveDate",
  label: "寄件日期：",
  type: "txt",
};
const EDIT_FORM_COL_211 = {
  span: 12,
  id: "expressAcceptAddress",
  label: "收件人地址：",
  type: "text",
  placeholder: "请输入",
};
const EDIT_FORM_COL_212 = {
  span: 12,
  id: "costMoney",
  label: "发票金额：",
  type: "txt",
  fontTxtColor: "#5094ff",
  render: (r) =>
    `${formatMoney(r.costMoney)} ${r.invoiceCurrencyObj?.currencyCode || ""}`,
};
const EDIT_FORM_COL_213 = {
  span: 12,
  id: "operator",
  selectLabelKey: "operatorName",
  label: "操作员：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};

const EDIT_FORM_COL_301 = {
  span: 12,
  id: "buyerObj",
  label: "购买方：",
  placeholder: "请选择",
  noClearable: true,
  className: "custom-margin",
};
const EDIT_FORM_COL_302 = {
  span: 12,
  id: "buyerInvoiceTitle",
  label: "抬头：",
  type: "txt",
  txtCopy: true,
  className: "custom-margin",
  placeholder: "--",
};
const EDIT_FORM_COL_303 = {
  span: 12,
  id: "buyerAccountsBank",
  label: "开户行：",
  type: "txt",
  txtCopy: true,
  className: "custom-margin",
  placeholder: "--",
};
const EDIT_FORM_COL_304 = {
  span: 12,
  id: "buyerAccount",
  label: "开户账号：",
  type: "txt",
  txtCopy: true,
  className: "custom-margin",
  placeholder: "--",
};
const EDIT_FORM_COL_305 = {
  span: 12,
  id: "buyerDutyParagraph",
  label: "税号：",
  type: "text",
  placeholder: "--",
};
const EDIT_FORM_COL_306 = {
  span: 12,
  id: "buyerTelephone",
  label: "电话：",
  type: "text",
  placeholder: "--",
};
const EDIT_FORM_COL_307 = {
  span: 24,
  id: "buyerAddress",
  label: "公司地址：",
  type: "text",
  placeholder: "--",
};
const EDIT_FORM_COL_308 = {
  span: 24,
  id: "buyerInvoiceRequire",
  label: "购买方发票要求：",
  labelWidth: "105px",
  type: "textarea",
  placeholder: "请输入",
};
const EDIT_FORM_COL_309 = {
  span: 24,
  id: "uploadFile",
  labelWidth: "0px",
  type: "slot",
};
const EDIT_FORM_COL_401 = {
  span: 12,
  id: "sellerObj",
  label: " 销售方：",
  placeholder: "请选择",
  noClearable: true,
  className: "custom-margin",
};
const EDIT_FORM_COL_402 = {
  span: 12,
  id: "sellerInvoiceTitle",
  label: "抬头：",
  type: "txt",
  txtCopy: true,
  className: "custom-margin",
  placeholder: "--",
};
const EDIT_FORM_COL_403 = {
  span: 12,
  id: "sellerAccountsBank",
  label: "开户行：",
  type: "txt",
  txtCopy: true,
  className: "custom-margin",
  placeholder: "--",
};
const EDIT_FORM_COL_404 = {
  span: 12,
  id: "sellerAccount",
  label: "开户账号：",
  type: "txt",
  txtCopy: true,
  className: "custom-margin",
  placeholder: "--",
};
const EDIT_FORM_COL_405 = {
  span: 12,
  id: "sellerDutyParagraph",
  label: "税号：",
  type: "txt",
  placeholder: "--",
};
const EDIT_FORM_COL_406 = {
  span: 12,
  id: "sellerTelephone",
  label: "电话：",
  type: "txt",
  placeholder: "--",
};
const EDIT_FORM_COL_407 = {
  span: 24,
  id: "sellerAddress",
  label: "公司地址：",
  type: "txt",
};
const EDIT_FORM_COL_408 = {
  span: 24,
  id: "sellerRemark",
  label: "销售方发票备注：",
  labelWidth: "105px",
  type: "textarea",
  placeholder: "请输入",
};
const EDIT_FORM_COL_409 = {
  span: 12,
  id: "waterBillPayer",
  prop: "bankReceiptBuyerId",
  title: "水单信息(付款方)",
  type: "slot",
  labelWidth: "0px",
  className: "custom-margin",
  list: [
    {
      span: 24,
      id: "bankReceiptBuyerAccountName",
      label: "水单抬头：",
      type: "txt",
      txtCopy: true,
      placeholder: "--",
    },
    {
      span: 24,
      id: "bankReceiptBuyerOpeningBank",
      label: "开户行：",
      type: "txt",
      txtCopy: true,
      placeholder: "--",
    },
    {
      span: 24,
      id: "bankReceiptBuyerBankAccount",
      label: "开户账号：",
      type: "txt",
      txtCopy: true,
      placeholder: "--",
    },
  ],
};
const EDIT_FORM_COL_450 = {
  span: 12,
  id: "waterBillPayee",
  prop: "bankReceiptSellerId",
  title: "水单信息(收款方)",
  type: "slot",
  labelWidth: "0px",
  className: "custom-margin",
  list: [
    {
      span: 24,
      id: "bankReceiptSellerAccountName",
      label: "水单抬头：",
      type: "txt",
      txtCopy: true,
      placeholder: "--",
    },
    {
      span: 24,
      id: "bankReceiptSellerOpeningBank",
      label: "开户行：",
      type: "txt",
      txtCopy: true,
      placeholder: "--",
    },
    {
      span: 24,
      id: "bankReceiptSellerBankAccount",
      label: "开户账号：",
      type: "txt",
      txtCopy: true,
      placeholder: "--",
    },
  ],
};

export const editFormConfig = (obj) => {
  const {
    currencyHandle,
    addresseeHandle,
    buyHandle,
    handleBuyCreate,
    saleHandle,
    businessCompany,
    dealingsCompany,
    invoiceMedium,
    isDetails,
    pageType,
    isBind,
    bankReceiptId,
  } = obj || {};
  let EDIT_FORM_COLS_1 = [
    //发票信息
    EDIT_FORM_COL_1,
    EDIT_FORM_COL_10,
    EDIT_FORM_COL_3,
    EDIT_FORM_COL_213,
    // EDIT_FORM_COL_4,
    // EDIT_FORM_COL_7,
    // EDIT_FORM_COL_9,
    // EDIT_FORM_COL_8,
  ];
  let EDIT_FORM_COLS_2 = [
    {
      ...EDIT_FORM_COL_2,
      ...(isBind
        ? {
            type: "txt",
            render: (row) =>
              (row.invoiceCurrencyObj && row.invoiceCurrencyObj.currencyCode) ||
              "--",
          }
        : { handle: currencyHandle }),
    },
    EDIT_FORM_COL_212,
    EDIT_FORM_COL_11,
    EDIT_FORM_COL_12,
  ];
  let EDIT_FORM_COLS_3 = [
    //购买方信息
    // {
    //   span: 24,
    //   id: "slotApplyTit",
    //   type: "slot",
    //   labelWidth: "0px",
    //   titleTxt: "购买方"
    // },
    {
      ...EDIT_FORM_COL_301,
      ...httpCrmListSelect({
        customerIds: dealingsCompany, // 购买方-往来单位
      }),
      isBackAll: true,
      showCreate: true,
      handleCreate: handleBuyCreate,
      handle: buyHandle,
    },
    ...(bankReceiptId ? [EDIT_FORM_COL_409] : []),
    {
      ...EDIT_FORM_COL_302,
      ...(bankReceiptId ? { span: 24, tipWidth: "calc(50% - 85px)" } : {}),
    },
    {
      ...EDIT_FORM_COL_303,
      ...(bankReceiptId ? { span: 24, tipWidth: "calc(50% - 85px)" } : {}),
    },
    {
      ...EDIT_FORM_COL_304,
      ...(bankReceiptId ? { span: 24, tipWidth: "calc(50% - 85px)" } : {}),
    },
    EDIT_FORM_COL_305,
    EDIT_FORM_COL_306,
    EDIT_FORM_COL_307,
    // EDIT_FORM_COL_308
  ];
  let EDIT_FORM_COLS_4 = [
    //销售方信息
    // {
    //   span: 24,
    //   id: "slotApplyTit",
    //   type: "slot",
    //   labelWidth: "0px",
    //   titleTxt: "销售方"
    // },
    {
      ...EDIT_FORM_COL_401,
      ...httpCrmListSelect({
        customerId: businessCompany,
      }),
      isBackAll: true,
      type: "slot",
      handle: saleHandle,
    },
    ...(bankReceiptId ? [EDIT_FORM_COL_450] : []),
    {
      ...EDIT_FORM_COL_402,
      ...(bankReceiptId ? { span: 24, tipWidth: "calc(50% - 85px)" } : {}),
    },
    {
      ...EDIT_FORM_COL_403,
      ...(bankReceiptId ? { span: 24, tipWidth: "calc(50% - 85px)" } : {}),
    },
    {
      ...EDIT_FORM_COL_404,
      ...(bankReceiptId ? { span: 24, tipWidth: "calc(50% - 85px)" } : {}),
    },
    EDIT_FORM_COL_405,
    EDIT_FORM_COL_406,
    EDIT_FORM_COL_407,
    // EDIT_FORM_COL_408
  ];
  let EDIT_FORM_COLS_5 = [
    EDIT_FORM_COL_201,
    // EDIT_FORM_COL_33,
    EDIT_FORM_COL_203,
    // EDIT_FORM_COL_33,
    // EDIT_FORM_COL_205,
    // EDIT_FORM_COL_206,
    {
      ...EDIT_FORM_COL_207,
      ...httpBusinessAddressSelect({
        httpRequest: getAddressIdsInfo,
        customerId: dealingsCompany,
      }),
      isBackAll: true,
      handle: addresseeHandle,
    },
    EDIT_FORM_COL_210,
    EDIT_FORM_COL_208,
    EDIT_FORM_COL_209,
    EDIT_FORM_COL_211,
    EDIT_FORM_COL_308,
    // EDIT_FORM_COL_408
  ];

  // 发票详情与开票表单
  let CLASS_KET_1 = "";
  let CLASS_KET_2 = "";
  let CLASS_KET_3 = "nDetails";
  let CLASS_KET_4 = "nDetails";
  if (isDetails) {
    const SEE_FORM_COLS_5 = (str) => {
      return {
        invoicingDetail_1: [
          {
            ...EDIT_FORM_COL_201,
            type: "txt",
          },
          {
            ...EDIT_FORM_COL_203,
            disable: true,
          },
        ],
        invoicingDetail_2: [
          {
            ...EDIT_FORM_COL_211,
            type: "txt",
            span: str === "see" ? 24 : 12,
          },
          {
            ...EDIT_FORM_COL_308,
            type: "txt",
          },
          {
            ...EDIT_FORM_COL_408,
            type: str === "see" ? "txt" : "textarea",
          },
        ],
      };
    };

    let EDIT_KTY_401 = ["slotApplyTit", "waterBillPayee", "waterBillPayer"]; //销售方
    // 开票页面需要编辑的项
    if (pageType === "invoicing") {
      CLASS_KET_1 = "nDetails";
      CLASS_KET_2 = "nDetails";
      EDIT_FORM_COLS_1 = [
        {
          ...EDIT_FORM_COL_1,
          disable: true,
        },
        {
          ...EDIT_FORM_COL_2,
          id: "invoiceCurrencyCode",
          type: "txt",
        },
        {
          ...EDIT_FORM_COL_3,
          disable: true,
        },
        {
          ...EDIT_FORM_COL_10,
          id: "salesmanName",
          type: "txt",
        },
      ];

      EDIT_FORM_COLS_2 = [
        {
          ...EDIT_FORM_COL_212,
          render: (r) =>
            `${formatMoney(r.costMoney)} ${r.invoiceCurrencyCode || ""}`,
        },
        EDIT_FORM_COL_33,
        EDIT_FORM_COL_33,
      ];

      EDIT_FORM_COLS_5 = [
        ...SEE_FORM_COLS_5().invoicingDetail_1,
        {
          ...EDIT_FORM_COL_11,
          span: 6,
        },
        {
          ...EDIT_FORM_COL_12,
          span: 6,
        },
        {
          ...EDIT_FORM_COL_207,
          type: "txt",
          id: "expressAcceptName",
        },
        EDIT_FORM_COL_210,
        EDIT_FORM_COL_5,
        EDIT_FORM_COL_6,
        {
          ...EDIT_FORM_COL_208,
          type: "txt",
        },
        {
          ...EDIT_FORM_COL_209,
          type: "txt",
        },
        ...SEE_FORM_COLS_5().invoicingDetail_2,
      ];
    } else {
      CLASS_KET_1 = "";
      CLASS_KET_2 = "";
      CLASS_KET_3 = ""; //调整购买方和销售方的行距
      CLASS_KET_4 = "";
      EDIT_FORM_COLS_1 = [];
      EDIT_FORM_COLS_2 = [];
      EDIT_FORM_COLS_5 = [
        ...SEE_FORM_COLS_5("see").invoicingDetail_1,
        EDIT_FORM_COL_210,
        {
          label: "开票人：",
          id: "drawerName",
          type: "txt",
          span: 6,
        },
        {
          ...EDIT_FORM_COL_207,
          type: "txt",
          id: "expressAcceptName",
        },
        {
          ...EDIT_FORM_COL_208,
          type: "txt",
        },
        {
          ...EDIT_FORM_COL_209,
          type: "txt",
        },
        {
          label: "复核人：",
          id: "reviewerName",
          type: "txt",
          span: 6,
        },
        ...SEE_FORM_COLS_5("see").invoicingDetail_2,
      ];
    }

    EDIT_FORM_COLS_3 = EDIT_FORM_COLS_3.map((e) => {
      return {
        ...e,
        type: EDIT_KTY_401.includes(e.id) ? e.type : "txt",
        id: e.id === "buyerObj" ? "buyerName" : e.id,
      };
    });

    EDIT_FORM_COLS_4 = EDIT_FORM_COLS_4.map((e) => {
      return {
        ...e,
        type: EDIT_KTY_401.includes(e.id) ? e.type : "txt",
        id: e.id === "sellerObj" ? "sellerName" : e.id,
      };
    });
  }

  return [
    {
      className: "invoice-cols-top",
      scaleWidth: 1,
      fieldList: [
        {
          rowClassName: "invoice-cols-left",
          rows: [
            {
              colClassName: `${CLASS_KET_1}`,
              cols: EDIT_FORM_COLS_1,
            },
            {
              colClassName: `purchaser-cols ${CLASS_KET_3}`,
              cols: EDIT_FORM_COLS_3,
            },
          ],
        },
        {
          rowClassName: "invoice-cols-right",
          rows: [
            {
              colClassName: `${CLASS_KET_2}`,
              cols: EDIT_FORM_COLS_2,
            },
            {
              colClassName: `purchaser-cols ${CLASS_KET_4}`,
              cols: EDIT_FORM_COLS_4,
            },
          ],
        },
      ],
    },
    {
      scaleWidth: 1,
      fieldList: [
        {
          rows: [
            {
              colClassName: "cols-tabs-info",
              cols: [
                {
                  ...EDIT_FORM_COL_33,
                  span: 24,
                  id: "slotTabs",
                  labelWidth: "0px",
                },
              ],
            },
            {
              colClassName: "cols-basic-info",
              cols: EDIT_FORM_COLS_5,
            },
            {
              colClassName: "cols-upload-info",
              cols: [EDIT_FORM_COL_309],
            },
          ],
        },
      ],
    },
  ];
};

// 动态校验
export const dynamicVerifice = {
  // 电子发票邮箱必填，纸质发票运费方式必填
  customerEmail: [
    { required: true, message: "请输入客户邮箱", trigger: "blur" },
  ],
  expressPaymentMethod: [
    { required: true, message: "请选择运费方式", trigger: "change" },
  ],
  acceptObj: [{ required: true, message: "请选择收件人", trigger: "change" }],
  expressAcceptTelephone: [
    { required: true, message: "请输入电话", trigger: "blur" },
  ],
  expressAcceptCountry: [
    { required: true, message: "请输入收件人公司", trigger: "blur" },
  ],
  expressAcceptAddress: [
    { required: true, message: "请输入收件人地址", trigger: "blur" },
  ],
  expressCompany: [
    { required: true, message: "请选择快递公司", trigger: "change" },
  ],
  expressOrder: [
    { required: true, message: "请输入快递单号", trigger: "blur" },
  ],
  buyerDutyParagraph: [
    { required: true, message: "请补充购买方税号", trigger: "change" },
  ],
  buyerTelephone: [
    { required: true, message: "请补充购买方电话", trigger: "change" },
  ],
};
export const editFormRules = (obj) => {
  const { pageType, invoiceMedium, invoiceCurrencyObj, invoiceType } =
    obj || {};
  if (pageType === "invoicing") {
    // 开票页面
    let invoicingRules = {
      invoiceCode: [
        { required: true, message: "请输入发票代码", trigger: "blur" },
      ],
      invoiceNumber: [
        { required: true, message: "请输入发票号码", trigger: "blur" },
      ],
      drawer: [{ required: true, message: "请选择开票人", trigger: "change" }],
      reviewer: [
        { required: true, message: "请选择复核人", trigger: "change" },
      ],
    };
    if (invoiceMedium == 1) {
      // invoicingRules.expressCompany = dynamicVerifice.expressCompany;
      // invoicingRules.expressOrder = dynamicVerifice.expressOrder;
    }
    return invoicingRules;
  }

  let rulesObj = {
    invoiceType: [
      { required: true, message: "请选择发票类型", trigger: "change" },
    ],
    invoiceCurrencyObj: [
      { required: true, message: "请选择发票币别", trigger: "change" },
    ],
    invoiceMedium: [
      { required: true, message: "请选择发票介质", trigger: "change" },
    ],
    buyerObj: [
      { required: true, message: "请选择购买方名称/抬头", trigger: "change" },
    ],
    buyerInvoiceTitle: [
      { required: true, message: "请补充购买方抬头", trigger: "change" },
    ],
    buyerAccountsBank: [
      { required: true, message: "请补充购买方开户行", trigger: "change" },
    ],
    buyerAccount: [
      { required: true, message: "请补充购买方开户账号", trigger: "change" },
    ],
    buyerDutyParagraph: [
      { required: true, message: "请补充购买方税号", trigger: "change" },
    ],
    buyerTelephone: [
      { required: true, message: "请补充购买方电话", trigger: "change" },
    ],
    buyerAddress: [
      { required: true, message: "请补充购买方公司地址", trigger: "change" },
    ],

    sellerObj: [
      { required: true, message: "请选择销售方销售单位", trigger: "change" },
    ],
    sellerInvoiceTitle: [
      { required: true, message: "请补充销售方抬头", trigger: "change" },
    ],
    sellerAccountsBank: [
      { required: true, message: "请补充销售方开户行", trigger: "change" },
    ],
    sellerAccount: [
      { required: true, message: "请补充销售方开户账号", trigger: "change" },
    ],
    sellerDutyParagraph: [
      { required: true, message: "请补充销售方税号", trigger: "change" },
    ],
    sellerTelephone: [
      { required: true, message: "请补充销售方电话", trigger: "change" },
    ],
    sellerAddress: [
      { required: true, message: "请补充销售方公司地址", trigger: "change" },
    ],
    operator: [{ required: true, message: "请选择操作员", trigger: "change" }],
    salesman: [{ required: true, message: "请选择业务员", trigger: "change" }],
    drawer: [{ required: true, message: "请选择开票人", trigger: "change" }],
  };
  if (invoiceMedium == 1) {
    rulesObj.expressPaymentMethod = dynamicVerifice.expressPaymentMethod;
    rulesObj.acceptObj = dynamicVerifice.acceptObj;
    rulesObj.expressAcceptTelephone = dynamicVerifice.expressAcceptTelephone;
    rulesObj.expressAcceptCountry = dynamicVerifice.expressAcceptCountry;
    rulesObj.expressAcceptAddress = dynamicVerifice.expressAcceptAddress;
  } else {
    rulesObj.customerEmail = dynamicVerifice.customerEmail;
  }
  const { value } = invoiceCurrencyObj;

  if (invoiceType == 0 && value == 1) {
    // 增值税普通发票+RMB
    delete rulesObj.buyerTelephone;
  } else if (invoiceType == 1 && value == 1) {
    // 增值税专用发票+RMB
    // delete rulesObj.buyerDutyParagraph
  } else if (value != 1) {
    //非RMB
    delete rulesObj.buyerDutyParagraph;
    delete rulesObj.buyerTelephone;
  }
  return rulesObj;
};

const EDIT_TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const EDIT_TABLE_COL_1 = {
  prop: "dutiableService",
  label: "货物或应税劳务名称",
  customRow: true,
  request: true,
  minWidth: 150,
};
const EDIT_TABLE_COL_2 = {
  prop: "num",
  label: "数量",
  customRow: true,
  request: true,
  minWidth: 120,
  decimal: 4,
};
const EDIT_TABLE_COL_3 = {
  prop: "price",
  label: "单价",
  customRow: true,
  request: true,
  minWidth: 120,
  colFormat: "thousandthMark",
  decimal: 2,
};
const EDIT_TABLE_COL_4 = {
  prop: "totalMoney",
  label: "金额(含税)",
  minWidth: 120,
  colFormat: "thousandthMark",
  decimal: 2,
};
const EDIT_TABLE_COL_5 = {
  prop: "unit",
  label: "单位",
  customRow: true,
  request: true,
  minWidth: 80,
};
const EDIT_TABLE_COL_6 = {
  prop: "taxMoney",
  label: "税额",
  customRow: true,
  request: true,
  minWidth: 120,
  colFormat: "thousandthMark",
  decimal: 2,
};
const EDIT_TABLE_COL_7 = {
  prop: "inTaxMoney",
  label: "金额(不含税)",
  minWidth: 120,
  colFormat: "thousandthMark",
  decimal: 2,
};
const EDIT_TABLE_COL_30 = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: "right",
  width: 110,
};

const EDIT_TABLE_COL_201 = {
  prop: "type",
  label: "类型",
  width: 80,
  fontColor: true,
  basicType: "billType",
  align: "center",
};
const EDIT_TABLE_COL_202 = {
  prop: "costName",
  label: "费用名称",
  showOverflowTooltip: true,
  width: 80,
};
const EDIT_TABLE_COL_203 = {
  prop: "orderNo",
  label: "工作单号",
  showOverflowTooltip: true,
  minWidth: 120,
};
const EDIT_TABLE_COL_204 = {
  prop: "salesmanName",
  label: "业务员",
  showOverflowTooltip: true,
  width: 100,
};
const EDIT_TABLE_COL_205 = {
  prop: "settleType",
  label: "结算方式",
  showOverflowTooltip: true,
  minWidth: 120,
  basicType: "settleType",
};
const EDIT_TABLE_COL_206 = {
  prop: "isIncludeTax",
  label: "含税",
  showOverflowTooltip: true,
  width: 50,
  align: "center",
  render: (row) => (!!row.isIncludeTax ? "是" : "否"),
};
const EDIT_TABLE_COL_207 = {
  prop: "totalMoney",
  label: "金额",
  align: "right",
  showOverflowTooltip: true,
  width: 80,
  colFormat: "thousandthMark",
  decimal: 2,
};
const EDIT_TABLE_COL_208 = {
  prop: "currencyCode",
  label: "币别",
  showOverflowTooltip: true,
  align: "center",
  width: 60,
};
const EDIT_TABLE_COL_209 = {
  prop: "createTime",
  label: "创建时间",
  showOverflowTooltip: true,
  minWidth: 150,
};
const EDIT_TABLE_COL_210 = {
  prop: "invoiceMoney",
  labelTop: "已开发票金额",
  labelBtm: "(包含开票中)",
  showOverflowTooltip: true,
  align: "right",
  customHeader: true,
  minWidth: 100,
  colFormat: "thousandthMark",
  decimal: 2,
};
const EDIT_TABLE_COL_211 = {
  prop: "surplusMoney",
  label: "本次最多开票金额",
  showOverflowTooltip: true,
  align: "right",
  minWidth: 125,
  colFormat: "thousandthMark",
  decimal: 2,
};
const EDIT_TABLE_COL_212 = {
  prop: "applyMoney",
  label: "本次开票金额",
  showOverflowTooltip: true,
  align: "right",
  customRow: true,
  request: true,
  minWidth: 110,
  maxNumKey: "surplusMoney",
  colFormat: "thousandthMark",
  decimal: 2,
};
const EDIT_TABLE_COL_213 = {
  prop: "billNo",
  label: "对账单号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_214 = {
  prop: "applyMoneyRMB",
  labelTop: "本次开票金额",
  labelBtm: "(折RMB)",
  align: "right",
  minWidth: 100,
  decimal: 4,
  colFormat: "thousandthMark",
  customHeader: true,
  showOverflowTooltip: true,
};
const EDIT_TABLE_COL_215 = {
  prop: "applyMoneyInvoice",
  labelTop: "本次开票金额",
  labelBtm: "(折发票币别)",
  align: "right",
  minWidth: 100,
  decimal: 4,
  colFormat: "thousandthMark",
  customHeader: true,
  showOverflowTooltip: true,
};

const EDIT_TABLE_COL_222 = {
  prop: "orderBusinessType",
  label: "业务类型",
  showOverflowTooltip: true,
  minWidth: 100,
  fixed: "left",
  basicType: "orderBusinessType",
};
const TABLE_COLS_1 = [
  EDIT_TABLE_COL_0,
  EDIT_TABLE_COL_1,
  EDIT_TABLE_COL_2,
  EDIT_TABLE_COL_3,
  EDIT_TABLE_COL_4,
  EDIT_TABLE_COL_5,
  EDIT_TABLE_COL_6,
  EDIT_TABLE_COL_7,
  EDIT_TABLE_COL_30,
];
const TABLE_COLS_2 = [
  {
    ...EDIT_TABLE_COL_0,
    fixed: "left",
  },
  {
    ...EDIT_TABLE_COL_201,
    fixed: "left",
  },
  {
    ...EDIT_TABLE_COL_202,
    fixed: "left",
  },
  EDIT_TABLE_COL_222,
  {
    ...EDIT_TABLE_COL_203,
    fixed: "left",
  },
  {
    ...EDIT_TABLE_COL_213,
    fixed: "left",
  },
  EDIT_TABLE_COL_204,
  // EDIT_TABLE_COL_205,
  EDIT_TABLE_COL_206,
  EDIT_TABLE_COL_207,
  EDIT_TABLE_COL_208,
  EDIT_TABLE_COL_210,
  {
    ...EDIT_TABLE_COL_211,
    label: "剩余开票金额",
  },
  EDIT_TABLE_COL_212,
  {
    ...EDIT_TABLE_COL_214,
    className: "applyMoneyClass",
  },
  {
    ...EDIT_TABLE_COL_215,
    className: "applyMoneyClass",
  },
  EDIT_TABLE_COL_30,
  EDIT_TABLE_COL_209,
];

const EDIT_TABLE_COL_216 = {
  type: "index",
  align: "center",
  width: 50,
};
const EDIT_TABLE_COL_217 = {
  prop: "result",
  label: "结果",
  showOverflowTooltip: true,
  width: 120,
};
const EDIT_TABLE_COL_218 = {
  prop: "step",
  label: "业务节点",
  showOverflowTooltip: true,
  width: 130,
};
const EDIT_TABLE_COL_219 = {
  prop: "auditRemark",
  label: "审核备注",
  showOverflowTooltip: true,
  minWidth: 160,
};
const EDIT_TABLE_COL_220 = {
  prop: "auditBy",
  label: "操作人",
  showOverflowTooltip: true,
  width: 120,
};
const EDIT_TABLE_COL_221 = {
  prop: "auditTime",
  label: "操作时间",
  showOverflowTooltip: true,
  width: 160,
};
const DETAIL_TABLE_COLS_4 = [
  EDIT_TABLE_COL_216,
  EDIT_TABLE_COL_217,
  EDIT_TABLE_COL_218,
  EDIT_TABLE_COL_219,
  EDIT_TABLE_COL_220,
  EDIT_TABLE_COL_221,
];
export const editTableConfig = (tName = "1") => {
  return [TABLE_COLS_1, TABLE_COLS_2][tName - 1];
};

const addOrEditCostConfig = (isOperation) => [
  {
    ...EDIT_TABLE_COL_0,
    fixed: "left",
  },
  {
    ...EDIT_TABLE_COL_201,
    fixed: "left",
  },
  {
    ...EDIT_TABLE_COL_202,
    fixed: "left",
  },
  EDIT_TABLE_COL_222,
  {
    ...EDIT_TABLE_COL_203,
    fixed: "left",
  },
  {
    ...EDIT_TABLE_COL_213,
    fixed: "left",
  },
  EDIT_TABLE_COL_204,
  // EDIT_TABLE_COL_205,
  EDIT_TABLE_COL_206,
  EDIT_TABLE_COL_207,
  EDIT_TABLE_COL_208,
  EDIT_TABLE_COL_210,
  EDIT_TABLE_COL_211,
  {
    ...EDIT_TABLE_COL_212,
    ...(!isOperation
      ? {
          customRow: false,
          request: false,
        }
      : {}),
  },
  EDIT_TABLE_COL_214,
  EDIT_TABLE_COL_215,
  EDIT_TABLE_COL_209,
  ...(isOperation ? [EDIT_TABLE_COL_30] : []),
];

const DETAIL_TABLE_COLS_1 = TABLE_COLS_1.filter(
  (e) => e.prop !== "operation"
).map((e) => {
  const { customRow, request, ...nE } = e;
  return {
    ...nE,
  };
});
const DETAIL_TABLE_COLS_2 = TABLE_COLS_2.filter(
  (e) => e.prop !== "operation"
).map((e) => {
  const { customRow, request, ...nE } = e;
  return {
    ...nE,
  };
});

// 发票详情表格
export const detailTableConfig = (tName = "1") => {
  console.log("tName", tName);
  return [DETAIL_TABLE_COLS_1, DETAIL_TABLE_COLS_2, [], DETAIL_TABLE_COLS_4][
    tName - 1
  ];
};

export const addOreditTableConfig = (tName = "1", isOperation) => {
  //发票新增和修改
  return [
    TABLE_COLS_1,
    addOrEditCostConfig(isOperation),
    [],
    DETAIL_TABLE_COLS_4,
  ][tName - 1];
};

/** 添加相关信息抽屉 */
const SEARCH_DRAWER_COL_1 = {
  id: "billNo",
  label: "账单号码：",
  placeholder: "账单号码",
  type: "text",
};
const SEARCH_DRAWER_COL_2 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "工作单号",
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
                SEARCH_SETTLEMENT_COL_1,
                SEARCH_SETTLEMENT_COL_2,
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
const TABLE_DRAWER_COL_2 = {
  prop: "billNo",
  label: "账单号码",
  showOverflowTooltip: true,
  minWidth: 120,
};
export const tableDrawerCols = () => [
  EDIT_TABLE_COL_0,
  TABLE_DRAWER_COL_1,
  TABLE_DRAWER_COL_2,
  EDIT_TABLE_COL_202,
  EDIT_TABLE_COL_207,
  EDIT_TABLE_COL_208,
  {
    ...EDIT_TABLE_COL_210,
    customHeader: false,
    label: "已开票金额",
  },
  {
    ...EDIT_TABLE_COL_211,
    label: "剩余金额",
  },
  EDIT_TABLE_COL_203,
];

export const cardConfig = [
  {
    backgroundColor: "#FFF4EE",
    topLabel: "业务员",
    topValue: "salesmanName",
    topDictVal: "",
    middleLabel: "操作员",
    middleValue: "operatorName",
    middleDictVal: "",
    bottomLabel: "开票日期",
    bottomValue: "invoiceDate",
    bottomDictVal: "",
    fontColor: "#FA541C",
  },
  {
    backgroundColor: "#EBECFE",
    topLabel: "发票类型",
    topValue: "invoiceType",
    bottomLabel: "发票介质",
    bottomValue: "invoiceMedium",
    fontColor: "#6C2CD6",
    topDictVal: "invoiceType",
    bottomDictVal: "invoiceMedium",
  },
  {
    backgroundColor: "#ECF2FF",
    topLabel: "发票币别",
    topValue: "invoiceCurrencyCode",
    bottomLabel: "开票金额",
    bottomValue: "costMoney",
    fontColor: "#3179EF",
    topDictVal: "",
    bottomDictVal: "",
    decimal: 2,
  },
  {
    backgroundColor: "#D1F1FE",
    topLabel: "发票代码",
    topValue: "invoiceCode",
    bottomLabel: "发票号",
    bottomValue: "invoiceNumber",
    fontColor: "#409EFF",
    topDictVal: "",
    bottomDictVal: "",
    labelList: [
      {
        label: "水单号",
        value: "bankReceiptNo",
        dictVal: "",
      },
    ],
  },
];
