import { getUserList } from "@/api/common.js";
import { httpWarehousePublicSelect } from '@/comModel/warehouse'
const searchColumns = [
  {
    id: "beginTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "customerName",
    label: "委托人：",
    placeholder: "委托人",
    type: "autocomplete",
    searchParamName: "companyNameCn",
    httpRequest: getUserList,
    defaultProp: {
      value: 'companyNameCn',
      label: 'companyNameCn'
    },
    labelWidth: '120px'
  },
  {
    id: "orderNum",
    label: "退仓单号：",
    placeholder: "退仓单号",
    type: "text"
  },
  {
    id: "enterWarehouse",
    label: "目的仓：",
    placeholder: "目的仓",
    ...httpWarehousePublicSelect({ itemId: "id" }),
  },
  {
    id: "isDeficiencyProduct",
    label: "产品信息：",
    placeholder: "产品信息",
    type: "select",
    basicType: 'productSituation'
  },
  {
    id: "referenceCode",
    label: "参考编号：",
    placeholder: "参考编号",
    type: "text",
    labelWidth: "120px"
  },
  {
    startId: "packingNumStart",
    endId: "packingNumEnd",
    label: "包裹数：",
    startPlaceholder: "包裹数<",
    endPlaceholder: "≤包裹数",
    type: "rangeSelect",
  },
  {
    startId: "productNumStart",
    endId: "productNumEnd",
    label: "产品数：",
    startPlaceholder: "产品数<",
    endPlaceholder: "≤产品数",
    type: "rangeSelect",
  },
  {
    id: "statusSearch",
    label: "状态：",
    placeholder: "状态（多选）",
    type: "select",
    multiple: true,
    basicType: 'aogStatus',
    hideList: [0, 2]
  },
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: 'left'
  },
  {
    prop: "orderNum",
    label: "退仓单号",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
    customRow: true,
    fixed: 'left'
  },
  {
    prop: "referenceCode",
    label: "参考编号",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 130,
    fixed: 'left'
  },
  {
    prop: "warehouseName",
    label: "目的仓",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 150
  },
  {
    prop: "packingNum",
    label: "包裹数",
    sortable: true,
    showOverflowTooltip: true,
    align: "right",
    minWidth: 100
  },
  {
    prop: "productNum",
    label: "SKU数",
    sortable: true,
    showOverflowTooltip: true,
    align: "right",
    minWidth: 100
  },
  {
    prop: "isDeficiencyProduct",
    label: "产品信息",
    sortable: true,
    showOverflowTooltip: true,
    customRow: true,
    width: 100,
    basicType: 'productSituation'
  },
  {
    prop: "enterWarehouseTime",
    label: "入库时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120
  },
  {
    prop: "putawayTime",
    label: "上架时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120
  },
  {
    prop: "createTime",
    label: "创建时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 150
  },
  {
    prop: "predictEnterWarehouseTime",
    label: "预计入仓时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140
  },
  {
    prop: "firstTakeFreightTime",
    label: "首次收货时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140
  },
  {
    prop: "orderStatus",
    label: "状态",
    sortable: true,
    showOverflowTooltip: true,
    width: 100,
    basicType: 'aogStatus'
  },
  {
    prop: "remark",
    label: "备注",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "customerName",
    label: "委托人",
    sortable: true,
    showOverflowTooltip: true,
    fixed: 'right',
    minWidth: 120
  },
  {
    prop: "operation",
    label: "操作",
    width: 100,
    fixed: 'right',
    customRow: true
  }
]

const warehouseConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "type",
                  label: "退仓原因：",
                  placeholder: "--",
                  type: "txt",
                  basicType: 'inStorageSource'
                },
                {
                  span: 12,
                  id: "referenceCode",
                  label: "参考编号：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 24,
                  id: "remark",
                  label: "补充说明：",
                  placeholder: "--",
                  type: "txt"
                },
              ],
            },
          ],
        },
        {
          className: 'border-top-solid',
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
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "accessory",
                  labelWidth: "0",
                  type: "slot",
                  disable: true
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
                  labelWidth: "56px",
                  label: "接单备注",
                  type: "txt",
                  className: "custom-remark",
                },
                {
                  span: 24,
                  id: "receiveRemark",
                  labelWidth: '0px',
                  type: "txt",
                }
              ],
            },
          ],
        },
      ],
    }
  ]
}

const goodsTableColumns = {
  grossTotal: [
    {
      label: 'SKU类数：',
      prop: 'sku',
      type: 'category'
    },
    {
      label: 'SKU总数：',
      prop: 'forecastNum'
    }
  ],
  config: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "包裹跟踪号",
      prop: "trackingNum",
      showOverflowTooltip: true,
    },
    {
      label: "SKU",
      prop: "sku",
      showOverflowTooltip: true,
    },
    {
      label: "平台编码",
      prop: "userSetCode",
      showOverflowTooltip: true,
    },
    {
      label: "产品名称(CN)",
      prop: "productNameCn",
      showOverflowTooltip: true,
      minWidth: 100,
    },
    {
      label: "产品长宽高(CM)",
      minWidth: 120,
      showOverflowTooltip: true,
      render: (rows) => {
        return rows.length ? `${rows.length}*${rows.width}*${rows.height}` : '--'
      }
    },
    {
      label: "预报数",
      prop: "forecastNum",
      width: 120,
      showOverflowTooltip: true,
    },
    {
      label: "LPN数",
      prop: "lpnNum",
      showOverflowTooltip: true,
    }
  ]
}

export { searchColumns, tableColumns, warehouseConfig, goodsTableColumns };
