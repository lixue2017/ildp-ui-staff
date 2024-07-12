import { getUserList } from "@/api/common";
import { getPlatformPublicList } from "@/api/publicInterface/index.js";
import {
  httpWarehousePublicSelect,
  httpDeliveryChannelSelect,
} from "@/comModel/warehouse";
import { toFixedNum } from "@/utils/instructions";
import overseaLangObj from "@/language/overseasLang.js";

const searchColumns = [
  {
    id: "beginTime",
    label: `${overseaLangObj.create_time || "创建时间"}：`,
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd",
  },
  {
    id: "companyName",
    label: `${overseaLangObj.wtr_customer || "委托人"}：`,
    type: "autocomplete",
    searchParamName: "companyNameCn",
    httpRequest: getUserList,
    defaultProp: {
      value: "companyNameCn",
      label: "companyNameCn",
    },
  },
  {
    id: "number",
    label: `${overseaLangObj.gz_dh || "工作单号"}：`,
    placeholder: "请输入",
    type: "text",
  },
  // {
  //   id: "deliveryWarehouseid",
  //   label: "发货仓：",
  //   placeholder: "请选择发货仓",
  //   ...httpWarehousePublicSelect({ itemId: "id" }),
  // },
  {
    id: "deliveryChannelid",
    label: `${overseaLangObj.ps_qd || "派送方式"}：`,
    ...httpDeliveryChannelSelect(),
  },
  {
    id: "contacts",
    label: `${overseaLangObj.sj_ry("收件人")}：`,
    placeholder: "请输入收件人/手机号",
    type: "text",
    // type: "autocomplete",
    // searchParamName: 'orderSearch',
    // httpRequest: (params) => getContactsPublicList({ ...params, typeList: 0 }),
    // getCustomData: (item) => {
    //   return {
    //     key: item.id,
    //     label: `${item.name}(${item.phone})`,
    //     value: item.id,
    //     title: `${item.name}(${item.phone})/${item.company}`,
    //     subtitle: `${item.address}`
    //   }
    // }
  },
  {
    id: "state",
    label: `${overseaLangObj.zt_status || "状态"}：`,
    placeholder: "状态（多选）",
    type: "select",
    multiple: true,
    basicType: "outStorageStatus",
    hideList: [0],
  },
  {
    id: "trackingSnList",
    label: "跟踪单号：",
    placeholder: "请输入跟踪单号",
    type: "text",
  },
];

const TABLE_COL_205 = {
  prop: "trackingSn",
  label: "跟踪单号",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 140,
};
const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    prop: "number",
    label: overseaLangObj.gz_dh || "工作单号",
    showOverflowTooltip: true,
    minWidth: 150,
    sortable: true,
    // customRow: true,
    columnLink: true,
    columnCopyTxt: true,
    fixed: "left",
  },
  {
    label: overseaLangObj.ck_lb("发货仓"),
    prop: "deliveryWarehouse",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 150,
    fixed: "left",
    render: (row) =>
      row.deliveryWarehouse
        ? `${row.deliveryWarehouse.code}/${row.deliveryWarehouse.name}`
        : "--",
  },
  // {
  //   prop: "storageBin",
  //   label: "库位",
  //   sortable:true,
  //   showOverflowTooltip: true,
  //   minWidth: 100
  // },
  TABLE_COL_205,
  {
    prop: "contacts",
    label: overseaLangObj.sj_ry("收件人"),
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 100,
    render: (row) => {
      return `${row.contacts}(${row.phone})`;
    },
  },
  {
    prop: "tcode",
    label: overseaLangObj.ps_qd || "派送渠道",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 100,
    render: (row) => {
      return `${row.tcode || "--"}[${row.tname || "--"}]`;
    },
  },
  {
    prop: "productType",
    label: overseaLangObj.sku_num() || "SKU数",
    sortable: true,
    showOverflowTooltip: true,
    width: 82,
  },
  {
    prop: "productTotal",
    label: overseaLangObj.zs_total("总数"),
    sortable: true,
    showOverflowTooltip: true,
    width: 70,
  },
  {
    prop: "traceNumber",
    label: overseaLangObj.zz_bg_gzh || "最终包裹跟踪号",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140,
  },
  {
    prop: "orderRemark",
    label: overseaLangObj.order_remark || "订单备注",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "createNickName",
    label: overseaLangObj.wtr_customer || "委托人",
    sortable: true,
    showOverflowTooltip: true,
    width: 100,
  },
  {
    prop: "createBy",
    label: overseaLangObj.czr_operator || "操作人",
    sortable: true,
    showOverflowTooltip: true,
    width: 100,
  },
  {
    prop: "createTime",
    label: overseaLangObj.create_time || "创建时间",
    sortable: true,
    showOverflowTooltip: true,
    width: 110,
  },
  {
    prop: "status",
    label: overseaLangObj.zt_status || "状态",
    width: 86,
    sortable: true,
    dotColor: true,
    basicType: "outStorageStatus",
    fixed: "right",
  },
  {
    prop: "operation",
    label: overseaLangObj.cz_operation || "操作",
    width: 165,
    fixed: "right",
    columnOperation: true,
  },
];

const tabsConfig = {
  columns: [
    {
      label: overseaLangObj.base_info || "基本信息",
      key: 1,
    },
    {
      label: overseaLangObj.cargo_details || "货物信息",
      key: 7,
    },
    {
      label: overseaLangObj.receivable_payable || "应收应付",
      key: 2,
    },
    // {
    //   label: "贴标信息",
    //   key: 3,
    // },
    // {
    //   label: "快递卡车",
    //   key: 4,
    // },
    {
      label: overseaLangObj.fj_attachment || "附件信息",
      key: 5,
    },
    {
      label: overseaLangObj.logistics_trajectory || "物流信息",
      key: 6,
    },
    {
      label: overseaLangObj.operation_records || "操作记录",
      key: 8,
    },
  ],
  active: 1,
};

const DETAILS_FORM_COL_1 = {
  span: 8,
  id: "operationMainName",
  label: `${overseaLangObj.kh_gs || "客户归属"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_2 = {
  span: 8,
  id: "deliveryWarehouse",
  label: `${overseaLangObj.ck_lb("出库仓")}：`,
  type: "txt",
  render: (row) =>
    `${row.deliveryWarehouse?.code || "--"}/${
      row.deliveryWarehouse?.name || ""
    }`,
  showTag: true,
  tagId: "WEB_DeliveryCustomerName",
  tagColor: "#35D06F",
};
const DETAILS_FORM_COL_3 = {
  span: 8,
  id: "insuranceSlot",
  labelWidth: "0px",
  type: "slot",
};
const DETAILS_FORM_COL_4 = {
  span: 8,
  id: "tLogisticsChannel",
  label: `${overseaLangObj.ps_qd || "派送渠道"}：`,
  type: "txt",
  render: (row) => {
    return `${row.tLogisticsChannel?.code || "--"}[${
      row.tLogisticsChannel?.nameCn || ""
    }]`;
  },
};
const DETAILS_FORM_COL_5 = {
  span: 8,
  id: "referenceNumber",
  label: `${overseaLangObj.ck_bm || "参考号"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_6 = {
  span: 8,
  id: "signSlot",
  labelWidth: "0px",
  type: "slot",
};
const DETAILS_FORM_COL_7 = {
  span: 8,
  id: "traceNumber",
  label: `${overseaLangObj.tracking_no_fn("客户跟踪单号")}：`,
  type: "txt",
};
const DETAILS_FORM_COL_8 = {
  span: 8,
  id: "platform",
  label: `${overseaLangObj.pt_platform || "平台"}：`,
  type: "txt",
  basicType: "orderPlatform",
};
const DETAILS_FORM_COL_9 = {
  span: 8,
  id: "platformStore",
  label: `${overseaLangObj.platform_store || "平台店铺"}：`,
  labelWidth: overseaLangObj.yu_yan_lang === "en-us" ? "124px" : "66px",
  type: "txt",
};

export const fbaWarehouseHeadCols = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                DETAILS_FORM_COL_1,
                DETAILS_FORM_COL_2,
                DETAILS_FORM_COL_3,
                DETAILS_FORM_COL_4,
                DETAILS_FORM_COL_5,
                DETAILS_FORM_COL_6,
                DETAILS_FORM_COL_7,
                DETAILS_FORM_COL_8,
                DETAILS_FORM_COL_9,
              ],
            },
          ],
        },
      ],
    },
  ];
};

const DETAILS_FORM_COL_201 = {
  span: 8,
  id: "channelCode",
  label: `${overseaLangObj.channel_code || "渠道编码"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_202 = {
  span: 8,
  id: "ioss",
  label: "IOSS：",
  type: "txt",
};
const DETAILS_FORM_COL_203 = {
  span: 8,
  id: "ebayPlatformNumber",
  label: `${overseaLangObj.ebay_pt_jyh || "eBay平台交易号"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_204 = {
  span: 8,
  id: "salesAmount",
  label: `${overseaLangObj.dd_xs_je || "订单销售金额"}：`,
  type: "txt",
  render: (r) =>
    `${toFixedNum(r.salesAmount)} ${r.currencyCode || r.currencyId}`,
};
const DETAILS_FORM_COL_205 = {
  span: 8,
  id: "vatDutyParagraph",
  label: `${overseaLangObj.vat_sh || "VAT税号"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_206 = {
  span: 8,
  id: "ebayPlatformId",
  label: `${overseaLangObj.ebay_pt_jy_id || "eBay平台交易ID"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_207 = {
  span: 16,
  id: "deliveryInfo",
  label: `${overseaLangObj.wl_ps_info() || "物流配送信息"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_208 = {
  span: 8,
  id: "ebayPlatform",
  label: `${overseaLangObj.ebay_pt || "eBay平台"}：`,
  type: "singleCheckbox",
  disabled: true,
};

export const warehouseTypeCols = (viewType) => {
  let warehouseRows = [
    {
      rows: [
        {
          cols: [
            DETAILS_FORM_COL_201,
            DETAILS_FORM_COL_202,
            DETAILS_FORM_COL_203,
            DETAILS_FORM_COL_204,
            DETAILS_FORM_COL_205,
            DETAILS_FORM_COL_206,
            DETAILS_FORM_COL_207,
            DETAILS_FORM_COL_208,
          ],
        },
      ],
    },
    {
      className: "border-top-solid",
      rows: [
        {
          cols: [
            {
              span: 24,
              id: "formSlotContacts",
              labelWidth: "0",
              type: "slot",
            },
          ],
        },
      ],
    },
    {
      className: "border-top-solid",
      rows: [
        {
          cols: [
            {
              span: 24,
              id: "tableData",
              labelWidth: "0",
              type: "slot",
            },
          ],
        },
      ],
    },
  ];
  if (viewType === "webOrderOutbound") {
    // 订单-一件代发出库详情
    warehouseRows.push({
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
    });
  }
  return [
    {
      fieldList: warehouseRows,
    },
  ];
};

const warehouseConfig = {
  lists: [
    {
      fieldList: [
        // {
        //   rows: [
        //     {
        //       cols: [
        //         {
        //           span: 24,
        //           id: "deliveryWarehouse",
        //           label: "发货仓：",
        //           placeholder: "--",
        //           type: "slot",
        //           disable: true
        //         },
        //       ],
        //     },
        //   ],
        // },
        {
          className: "border-top-solid",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "formSlotChannel",
                  labelWidth: "0",
                  type: "slot",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const tickerConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 10,
                  id: "stickerType",
                  label: "贴标类型：",
                  type: "radio",
                  basicType: "warehouseLabelType",
                  disable: true,
                },
                {
                  span: 7,
                  id: "stickerCarton",
                  orderKey: "isSort",
                  label: "外箱贴标：",
                  placeholder: "外箱贴标总数",
                  type: "slot",
                },
                {
                  span: 7,
                  id: "stickerSku",
                  orderKey: "isSort",
                  label: "SKU贴标：",
                  placeholder: "产品贴标总数",
                  type: "slot",
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注信息：",
                  type: "txt",
                },
              ],
            },
          ],
        },
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "attachId",
                  label: "",
                  labelWidth: "10px",
                  type: "customUploadFile",
                  disable: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const truckConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 10,
                  id: "code",
                  label: "卡车编号：",
                  type: "txt",
                },
                {
                  span: 14,
                  id: "amazonId",
                  label: "Amazon Appointment ID：",
                  type: "txt",
                  labelWidth: "180px",
                },
                {
                  span: 10,
                  id: "tname",
                  label: "派送渠道：",
                  type: "txt",
                },
                {
                  span: 14,
                  id: "scheduledTime",
                  label: "Scheduled Time：",
                  type: "txt",
                  labelWidth: "180px",
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注信息：",
                  type: "txt",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const expressConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 8,
                  id: "expressOmpany",
                  label: "快递公司：",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "expressNum",
                  label: "快递单号：",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "mailTime",
                  label: "寄件日期：",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "type",
                  label: "目的地类型：",
                  type: "txt",
                  basicType: "destinationType",
                },
                {
                  span: 16,
                  id: "mark",
                  label: "收件人信息：",
                  type: "txt",
                  render: (row) => {
                    return `${row.name}(${row.phone})`;
                  },
                },
                {
                  span: 24,
                  id: "address",
                  label: "收件人地址：",
                  type: "txt",
                },
              ],
            },
          ],
        },
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "attachId",
                  label: "",
                  labelWidth: "10px",
                  type: "customUploadFile",
                  disable: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COL_1 = {
  label: "SKU",
  prop: "sku",
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  label: overseaLangObj.pt_bm || "平台编码",
  prop: "productCode",
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  label: overseaLangObj.product_name_en || "产品名称(EN)",
  prop: "productNameEn",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COL_4 = {
  label: overseaLangObj.product_ckg || "产品长宽高(CM)",
  showOverflowTooltip: true,
  render: (r) =>
    `${toFixedNum(r.productLength, 1)}*${toFixedNum(
      r.productWidth,
      1
    )}*${toFixedNum(r.productHigh, 1)}`,
  columnTopBottom: true,
  renderBottom: (r) =>
    `${toFixedNum(r.wmsProductLength, 1)}*${toFixedNum(
      r.wmsProductWidth,
      1
    )}*${toFixedNum(r.wmsProductHeight, 1)}`,
  minWidth: 120,
};
const TABLE_COL_5 = {
  label: overseaLangObj.kc_sl("库存PCS数"),
  prop: "quantityInventory",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COL_6 = {
  label: overseaLangObj.sl_num_fn("出库PCS数"),
  prop: "quantity",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COL_7 = {
  label: "是否贴标",
  prop: "isSticker",
  width: 80,
  showOverflowTooltip: true,
  basicType: "isSticker",
};
const TABLE_COL_8 = {
  label: overseaLangObj.cp_zj || "产品总价",
  prop: "productPrice",
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COL_9 = {
  label: overseaLangObj.product_info || "产品信息",
  prop: "product",
  customRow: true,
  basicType: "productSituation",
  basicTypeVal: "foreignExportParam",
  align: "right",
};

const TABLE_COL_10 = {
  label: overseaLangObj.zl_weight,
  prop: "productWeight",
  bottomProp: "wmsProductWeight",
  columnTopBottom: true,
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
  bottomDecimal: 2,
};
const TABLE_COL_11 = {
  label: overseaLangObj.tj_m_volume,
  prop: "productVolume",
  bottomProp: "wmsProductVolume",
  columnTopBottom: true,
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  decimal: 3,
  bottomDecimal: 3,
};
export const yGoodsSkuTableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_8,
  TABLE_COL_9,
  // TABLE_COL_7
];
export const yGoodsBoxTableColumns = () => {
  return [
    TABLE_COL_INDEX,
    {
      label: "箱号",
      prop: "goodsName",
      showOverflowTooltip: true,
    },
    {
      label: "单箱长宽高(CM)",
      minWidth: 120,
      showOverflowTooltip: true,
      render: (r) => {
        return r.wmsProductLength
          ? `${toFixedNum(r.wmsProductLength, 1)}*${toFixedNum(
              r.wmsProductWidth,
              1
            )}*${toFixedNum(r.wmsProductHeight, 1)}`
          : "--";
      },
    },
    {
      label: "单箱体积(CBM)",
      prop: "wmsProductVolume",
      showOverflowTooltip: true,
      decimal: 2,
    },
    {
      label: "单箱重量(KG)",
      prop: "wmsProductWeight",
      showOverflowTooltip: true,
      align: "right",
      decimal: 2,
    },
    {
      label: "库存箱数",
      prop: "quantityInventory",
      showOverflowTooltip: true,
      width: 100,
      decimal: 0,
      align: "right",
    },
    {
      label: "出库箱数",
      prop: "quantity",
      showOverflowTooltip: true,
      width: 100,
      decimal: 0,
      align: "right",
    },
  ];
};

export {
  searchColumns,
  tableColumns,
  tabsConfig,
  tickerConfig,
  truckConfig,
  expressConfig,
};
