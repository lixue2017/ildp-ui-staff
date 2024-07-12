import { getUserList } from "@/api/common";
import {
  httpWarehousePublicSelect,
  httpDeliveryChannelSelect,
} from "@/comModel/warehouse";
import { getContactsPublicList } from "@/api/publicInterface/index.js";
import {
  httpUserSelect,
  httpLogisticsCustomerSelect,
} from "@/comModel/httpSelect";

const SEARCH_COLS_1 = {
  id: "beginTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "companyName",
  label: "创建企业：",
  placeholder: "请选择",
  type: "autocomplete",
  searchParamName: "companyNameCn",
  httpRequest: getUserList,
  defaultProp: {
    value: "companyNameCn",
    label: "companyNameCn",
  },
};
const SEARCH_COLS_3 = {
  id: "number",
  label: "订单编号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
  maxlength: 1850,
	residueCol: 2,
};
const SEARCH_COLS_4 = {
  id: "deliveryWarehouseid",
  label: "发货仓：",
  placeholder: "请选择",
  ...httpWarehousePublicSelect({ itemId: "id" }),
};
const SEARCH_COLS_5 = {
  id: "deliveryChannelid",
  label: "派送渠道：",
  placeholder: "请选择",
  ...httpDeliveryChannelSelect(),
};
const SEARCH_COLS_6 = {
  id: "contactsid",
  label: "收件人：",
  placeholder: "请选择",
  type: "autocomplete",
  searchParamName: "orderSearch",
  httpRequest: (params) => getContactsPublicList({ ...params, typeList: 0 }),
  getCustomData: (item) => {
    return {
      key: item.id,
      label: `${item.name}(${item.phone})`,
      value: item.id,
      title: `${item.name}(${item.phone})/${item.company}`,
      subtitle: `${item.address}`,
    };
  },
};
const SEARCH_COLS_7 = {
  id: "receivingWarehouseid",
  label: "收货仓：",
  placeholder: "请选择",
  ...httpWarehousePublicSelect({ typeList: "0,1", itemId: "id" }),
};
const SEARCH_COLS_8 = {
  id: "state",
  label: "状态：",
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "outStorageStatus",
};
const SEARCH_COLS_9 = {
  id: "operationMain",
  label: "所属公司：",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COLS_10 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "请选择",
  ...httpUserSelect(),
};
const SEARCH_COLS_11 = {
  id: "trackingSnList",
  label: "跟踪单号：",
  placeholder: "请输入跟踪单号",
  type: "text",
};


const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  label: "订单编号",
  prop: "number",
  // customRow: true,
  columnLink: true,
  columnCopyTxt: true,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
  minWidth: 160,
};
const TABLE_COLS_2 = {
  label: "保险服务",
  prop: "insurance",
  customRow: true,
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_3 = {
  label: "订单类型",
  prop: "orderType",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
  render: (row) => {
    return row.orderType == "1" ? "平台订单" : "整箱出库";
  },
};
const TABLE_COLS_4 = {
  label: "发货仓(海外仓)",
  prop: "deliveryWarehouse",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 140,
  render: (row) =>
    row.deliveryWarehouse
      ? `${row.deliveryWarehouse.code}/${row.deliveryWarehouse.name}`
      : "--",
};
const TABLE_COLS_5 = {
  label: "收货仓(FBA仓)",
  prop: "receivingWarehouse",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 140,
  render: (row) =>
    row.receivingWarehouse
      ? `${row.receivingWarehouse.code}/${row.receivingWarehouse.name}`
      : "--",
};
const TABLE_COLS_6 = {
  label: "收件人",
  prop: "contacts",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  // render: (rows) => {
  //   return rows.orderType == 1 ? `${rows.contacts}(${rows.phone})` : '--'
  // }
};
const TABLE_COLS_7 = {
  label: "派送渠道",
  prop: "deliveryChannel",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  render: (r) => `${r.tcode}[${r.tname}]`,
};
const TABLE_COLS_8 = {
  label: "产品类型",
  prop: "productType",
  sortable: true,
  width: 100,
};
const TABLE_COLS_9 = {
  label: "产品总数",
  prop: "productTotal",
  minWidth: 100,
  sortable: true,
  align: "right",
};
const TABLE_COLS_10 = {
  label: "产品信息",
  prop: "product",
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
  basicType: "productSituation",
  basicTypeVal: "foreignExportParam",
};
const TABLE_COLS_11 = {
  label: "状态",
  prop: "status",
  sortable: true,
  dotColor: true,
  width: 100,
  basicType: "outStorageStatus",
  fixed: "right",
};
const TABLE_COLS_12 = {
  label: "委托人",
  prop: "createNickName",
  sortable: true,
  width: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  label: "创建时间",
  prop: "createTime",
  sortable: true,
  width: 180,
};
const TABLE_COLS_14 = {
  label: "唛头",
  prop: "sku",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  label: "平台编码",
  prop: "productCode",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_16 = {
  label: "产品名称(EN)",
  prop: "productNameEn",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 110,
};
const TABLE_COLS_17 = {
  label: "产品长宽高(CM)",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: (rows) => {
    return rows.productLength
      ? `${rows.productLength}*${rows.productWidth}*${rows.productHigh}`
      : "--";
  },
};
const TABLE_COLS_18 = {
  label: "库存数量",
  prop: "quantityInventory",
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COLS_19 = {
  label: "数量",
  prop: "quantity",
  width: 80,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COLS_20 = {
  label: "产品总价",
  prop: "productPrice",
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  minWidth: 150,
};
const TABLE_COLS_21 = {
  label: "产品信息",
  prop: "product",
  customRow: true,
  sortable: true,
  basicType: "productSituation",
  basicTypeVal: "foreignExportParam",
};
const TABLE_COLS_22 = {
  label: "客户箱号",
  prop: "cusBoxNumber",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_23 = {
  label: "仓库箱号",
  prop: "warehouseBoxNumber",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_24 = {
  label: "SKU",
  prop: "sku",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_25 = {
  label: "单箱SKU数",
  prop: "productCount",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_26 = {
  label: "单箱重量",
  prop: "warehousingWeight",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_27 = {
  label: "库存箱数",
  prop: "quantityInventory",
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COLS_28 = {
  label: "出库箱数",
  prop: "quantity",
  width: 80,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COLS_29 = {
  label: "平台编码",
  prop: "productCode",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_30 = {
  label: "产品名称(EN)",
  prop: "productNameEn",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_31 = {
  label: "产品长宽高(CM)",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => {
    return row.productLength
      ? `${row.productLength}*${row.productWidth}*${row.productHigh}`
      : "--";
  },
};
const TABLE_COLS_32 = {
  label: "产品总价",
  prop: "productPrice",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_33 = {
  label: "箱号",
  prop: "boxNumber",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_34 = {
  label: "订单备注",
  prop: "orderRemark",
  sortable: true,
  width: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_35 = {
  prop: "operationMainName",
  label: "所属公司",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_36 = {
  prop: "salesmanName",
  label: "业务员",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_37 = {
  prop: "trackingSn",
  label: "跟踪单号",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COLS_99 = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: "90px",
};

const overseasOrder = {
  //海外订单
  search: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COLS_1,
                SEARCH_COLS_2,
                SEARCH_COLS_3,
                SEARCH_COLS_4,
                SEARCH_COLS_5,
                SEARCH_COLS_6,
                SEARCH_COLS_7,
                SEARCH_COLS_8,
              ],
            },
          ],
        },
      ],
    },
  ],
  lists: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
    TABLE_COLS_6,
    TABLE_COLS_7,
    TABLE_COLS_8,
    TABLE_COLS_9,
    TABLE_COLS_10,
    TABLE_COLS_11,
    TABLE_COLS_12,
    TABLE_COLS_13,
  ],
};

export const platformOrderConfig = (obj) => {
  const { pageType } = obj || {};
  // const companyLabel = pageType === "webOperationView" ? "委托人" : "创建企业";
  const companyLabel = "委托人";
  const numberLabel = pageType === "webOperationView" ? "工作单号" : "订单编号";
  return {
    // 一件代发订单
    searchCols: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  SEARCH_COLS_1,
                  {
                    ...SEARCH_COLS_2,
                    label: `${companyLabel}：`,
                    httpRequest: (params) =>
                      getUserList({
                        queryType: pageType === "webOrderView" ? 1 : undefined,
                        ...params,
                      }),
                  },
                  {
                    ...SEARCH_COLS_3,
                    label: `${numberLabel}：`,
                  },
                  {
                    ...SEARCH_COLS_4,
                    id: "warehouseId",
                    ...httpWarehousePublicSelect(),
                  },
                  SEARCH_COLS_5,
                  ...(pageType === "webOrderView"
                    ? []
                    : [
                        {
                          ...SEARCH_COLS_7,
                          ...httpWarehousePublicSelect({ typeList: "0,1" }),
                        },
                      ]),
                  SEARCH_COLS_8,
                  SEARCH_COLS_9,
                  SEARCH_COLS_10,
                  SEARCH_COLS_11
                ],
              },
            ],
          },
        ],
      },
    ],
    tableCols: [
      TABLE_COLS_INDEX,
      {
        ...TABLE_COLS_1,
        label: numberLabel,
      },
      TABLE_COLS_2,
      TABLE_COLS_4,
      TABLE_COLS_37,
      TABLE_COLS_6,
      TABLE_COLS_35,
      TABLE_COLS_7,
      TABLE_COLS_8,
      TABLE_COLS_9,
      TABLE_COLS_10,
      TABLE_COLS_34,
      {
        ...TABLE_COLS_12,
        label: companyLabel,
      },
      TABLE_COLS_13,
      TABLE_COLS_36,
      TABLE_COLS_11,
      ...(pageType === "webOrderView" ? [{...TABLE_COLS_99,width:'140px'}] : []), // 订单操作栏
    ],
  };
};

export const FBAorder = {
  //FBA订单
  search: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COLS_1,
                {
                  ...SEARCH_COLS_2,
                  label: "委托人：",
                  httpRequest: (params) =>
                    getUserList({
                      queryType: 1,
                      ...params,
                    }),
                },
                SEARCH_COLS_3,
                {
                  ...SEARCH_COLS_4,
                  id: "warehouseId",
                  ...httpWarehousePublicSelect(),
                },
                SEARCH_COLS_5,
                {
                  ...SEARCH_COLS_7,
                  ...httpWarehousePublicSelect({ typeList: "0,1" }),
                },
                SEARCH_COLS_8,
                SEARCH_COLS_9,
                SEARCH_COLS_10,
              ],
            },
          ],
        },
      ],
    },
  ],
  lists: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_37,
    TABLE_COLS_35,
    TABLE_COLS_36,
    TABLE_COLS_4,
    TABLE_COLS_5,
    // TABLE_COLS_6,
    TABLE_COLS_7,
    TABLE_COLS_8,
    TABLE_COLS_9,
    TABLE_COLS_10,
    {
      ...TABLE_COLS_34,
      prop: "remark",
    },
    TABLE_COLS_11,
    {
      ...TABLE_COLS_12,
      label: "委托人",
    },
    TABLE_COLS_13,
    TABLE_COLS_99, // 订单操作栏
  ],
};

export { overseasOrder };
