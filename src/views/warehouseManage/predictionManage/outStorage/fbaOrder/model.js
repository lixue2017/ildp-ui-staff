import { getUserList } from "@/api/common";
import {
  httpWarehousePublicSelect,
  httpDeliveryChannelSelect,
} from "@/comModel/warehouse";
import {
  httpUserSelect,
  httpLogisticsCustomerSelect,
} from "@/comModel/httpSelect";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COL_1 = {
  id: "beginTime",
  label: `${overseaLangObj.create_time || "创建时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "companyName",
  label: `${overseaLangObj.wtr_customer || "委托人"}：`,
  type: "autocomplete",
  searchParamName: "companyNameCn",
  httpRequest: getUserList,
  defaultProp: {
    value: "companyNameCn",
    label: "companyNameCn",
  },
};
const SEARCH_COL_3 = {
  id: "number",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
// {
//   id: "deliveryWarehouseid",
//   label: "发货仓：",
//   placeholder: "请选择发货仓",
//   ...httpWarehousePublicSelect({ itemId: "parentId" }),
// }
const SEARCH_COL_4 = {
  id: "deliveryChannelid",
  label: `${overseaLangObj.ps_qd || "派送方式"}：`,
  ...httpDeliveryChannelSelect(),
};
const SEARCH_COL_5 = {
  id: "receivingWarehouseid",
  label: `${overseaLangObj.sh_ck || "收货仓"}：`,
  ...httpWarehousePublicSelect({ typeList: "0,1", itemId: "parentId" }),
};
const SEARCH_COL_6 = {
  id: "state",
  label: `${overseaLangObj.zt_status || "状态"}：`,
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "outStorageStatus",
  hideList: [0, 7],
};
const SEARCH_COL_7 = {
  id: "operationMain",
  label: "所属公司：",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COL_8 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "请选择",
  ...httpUserSelect(),
};
const SEARCH_COL_9 = {
  id: "number",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
  maxlength: 1850,
  residueCol: 2,
};

export const searchColumns = (vType) => {
  return [
    SEARCH_COL_1,
    SEARCH_COL_2,
    ...(vType !== "fbaPathWarehouse" ? [SEARCH_COL_9] : [SEARCH_COL_3]),
    SEARCH_COL_4,
    SEARCH_COL_5,
    SEARCH_COL_6,
    ...(vType !== "fbaPathWarehouse" ? [SEARCH_COL_7, SEARCH_COL_8] : []),
  ];
};

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "number",
  label: overseaLangObj.gz_dh || "工作单号",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 180,
  // customRow: true,
  columnLink: true,
  columnCopyTxt: true,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "createNickName",
  label: overseaLangObj.wtr_customer || "委托人",
  sortable: true,
  showOverflowTooltip: true,
  width: 120,
  fixed: "left",
};
const TABLE_COL_3 = {
  label: overseaLangObj.ck_lb("发货仓"),
  prop: "deliveryWarehouse",
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 150,
  render: (row) =>
    row.deliveryWarehouse
      ? `${row.deliveryWarehouse.code}/${row.deliveryWarehouse.name}`
      : "--",
};
const TABLE_COL_4 = {
  label: overseaLangObj.shc_fba_c || "收货仓(FBA仓)",
  prop: "receivingWarehouse",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 140,
  render: (row) =>
    row.receivingWarehouse
      ? `${row.receivingWarehouse.code}/${row.receivingWarehouse.name}`
      : "--",
};
const TABLE_COL_5 = {
  prop: "storageBin",
  label: "库位",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COL_6 = {
  label: overseaLangObj.ck_fs || "出库方式",
  prop: "issueType",
  sortable: true,
  minWidth: 100,
  dicsStr: "issue_type",
  customDicsArr: [0, 1],
};
const TABLE_COL_7 = {
  prop: "tcode",
  label: overseaLangObj.ps_qd || "派送渠道",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  render: (row) => {
    return `${row.tcode || "--"}[${row.tname || "--"}]`;
  },
};
const TABLE_COL_8 = {
  prop: "productType",
  label: overseaLangObj.sku_num() || "SKU数",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COL_9 = {
  prop: "productTotal",
  label: overseaLangObj.zsl_sku || "总数",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "referenceNumber",
  label: overseaLangObj.zz_bg_gzh || "最终包裹跟踪号",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COL_11 = {
  prop: "remark",
  label: overseaLangObj.order_remark || "订单备注",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COL_12 = {
  prop: "createBy",
  label: overseaLangObj.czr_operator || "操作人",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COL_13 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  sortable: true,
  showOverflowTooltip: true,
  width: 120,
};
const TABLE_COL_14 = {
  prop: "status",
  label: overseaLangObj.zt_status || "状态",
  width: 100,
  dotColor: true,
  sortable: true,
  basicType: "outStorageStatus",
  fixed: "right",
};
const TABLE_COL_15 = {
  prop: "operationMainName",
  label: "所属公司",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COL_16 = {
  prop: "salesmanName",
  label: "业务员",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 120,
};

const TABLE_OPERATION = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  width: 120,
  fixed: "right",
  customRow: true,
};

export const tableColumns = (vType) => {
  const TABLE_COLS_FIXED = [
    TABLE_COL_0,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    ...(vType !== "fbaPathWarehouse" ? [TABLE_COL_15, TABLE_COL_16] : []),
    // TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_7,
    TABLE_COL_8,
    TABLE_COL_9,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_13,
    TABLE_COL_14,
  ];
  return [
    ...TABLE_COLS_FIXED,
    ...(vType !== "fbaPathOperation" ? [TABLE_OPERATION] : []),
  ];
};

// const cardConfig = [
//   {
//     bgColor: '#ECF3FF',
//     type: 'slot',
//     prop: 'createNickName',
//     label: "委托人",
//     labelColor: '#80B1FF',
//     valueColor: '#5094FF'
//   },
//   {
//     bgColor: '#FFF3EC',
//     type: 'slot',
//     label: '工作单号',
//     prop: 'number',
//     labelColor: '#FF985C',
//     valueColor: '#FF985C'
//   },
//   {
//     bgColor: '#ECECFF',
//     title: '合计应收',
//     labelTop: '本位币：',
//     labelBtm: '辅助币：',
//     propTop: 'bwCurrency',
//     propBtm: 'fzCurrency',
//     labelColor: '#B1B1FF',
//     valueColor: '#7676FF'
//   },
//   {
//     bgColor: '#D2F1FF',
//     title: '合计应付',
//     labelTop: '本位币：',
//     labelBtm: '辅助币：',
//     propTop: 'bwCurrency',
//     propBtm: 'fzCurrency',
//     labelColor: '#64CFFF',
//     valueColor: '#13B5FF'
//   },
// ]

const tabsConfig = {
  columns: [
    {
      label: overseaLangObj.base_info || "基本信息",
      key: 1,
    },
    {
      label: overseaLangObj.cargo_details || "货物信息",
      key: 20,
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
      key: 7,
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
  label: `${overseaLangObj.ck_lb("发货仓")}：`,
  type: "txt",
  render: (row) =>
    `${row.deliveryWarehouse?.code || "--"}/${
      row.deliveryWarehouse?.name || ""
    }`,
  txtClassName: "base-flex-align",
  txtTagArr: [
    {
      tagColor: "green",
      tagKey: "web_delivery_tag",
    },
  ],
};
const DETAILS_FORM_COL_3 = {
  span: 8,
  id: "insurance",
  label: `${overseaLangObj.insurance_services || "保险服务"}：`,
  type: "singleCheckbox",
  disabled: true,
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
  id: "platformStore",
  label: `${overseaLangObj.platform_store || "平台店铺"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_7 = {
  span: 8,
  id: "amazonReferenceNumber",
  label: `${overseaLangObj.amazon_ckh || "Amazon参考号"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_8 = {
  span: 8,
  id: "amazonDeliveryNumber",
  label: `${overseaLangObj.amazon_fhh || "Amazon发货号"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_9 = {
  span: 8,
  id: "vat",
  label: "仓库增值信息：",
  label: `${overseaLangObj.ck_zz_info || "仓库增值信息"}：`,
  // placeholder: "no service data.",
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

export const warehouseTypeCols = (viewType) => {
  let warehouseRows = [
    {
      rows: [
        {
          cols: [
            {
              span: 24,
              id: "receivingWarehouse",
              label: `${overseaLangObj.sh_ck || "收货仓"}：`,
              render: (row) =>
                `${row.receivingWarehouse?.code || "--"}/${
                  row.receivingWarehouse?.name || ""
                }`,
              type: "txt",
              txtClassName: "base-flex-align",
              txtTagArr: [
                {
                  tagKey: "web_receiving_tag",
                },
              ],
            },
            {
              span: 24,
              id: "receivingWarehouse_address",
              type: "txt",
              txtObjKey: "receivingWarehouse",
              txtLineCols: [
                {
                  iconColClass: "el-icon-location-outline",
                  txtColKey: "address",
                },
              ],
            },
          ],
        },
      ],
    },
    // {
    // 	className: 'border-top-solid',
    // 	rows: [
    // 		{
    // 			cols: [
    // 				{
    // 					span: 24,
    // 					id: "tableData",
    // 					labelWidth: "0",
    // 					type: "slot",
    // 				},
    // 			],
    // 		},
    // 	],
    // }
  ];
  if (viewType === "webOrderOutbound") {
    // 订单-FBA出库详情
    warehouseRows.push({
      className: "border-top-solid",
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

export { tabsConfig, tickerConfig, truckConfig, expressConfig };
