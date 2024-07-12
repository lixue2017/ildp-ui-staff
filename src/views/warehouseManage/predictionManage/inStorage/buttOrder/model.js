import { contactsOperationAddress } from "@/views/operateManage/seaTransOperate/Details/model.js";
import overseaLangObj from "@/language/overseasLang.js";

const forecastSearchCols = {
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
                  label: `${overseaLangObj.yj_rc_sj || "预计入仓时间"}：`,
                  startPlaceholder: "开始日期",
                  endPlaceholder: "结束日期",
                  type: "daterange",
                  valueFormat: "yyyy-MM-dd",
                },
                {
                  id: "orderOperationNum",
                  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
                  placeholder: "请输入",
                  type: "text",
                },
                {
                  id: "sortBoxRegisterNo",
                  label: `${overseaLangObj.gn_djh || "国内登记号"}：`,
                  placeholder: "请输入",
                  type: "text",
                },
                {
                  id: "nlCode",
                  label: `${overseaLangObj.nl_no || "NL单号"}：`,
                  placeholder: "请输入",
                  type: "text",
                },
                {
                  id: "actualTime",
                  label: `${overseaLangObj.sj_rc_sj || "实际入仓时间"}：`,
                  startPlaceholder: "开始日期",
                  endPlaceholder: "结束日期",
                  type: "daterange",
                  valueFormat: "yyyy-MM-dd",
                },
                {
                  id: "bailorPeople",
                  label: `${overseaLangObj.wtr_customer || "委托人"}：`,
                  placeholder: "请输入",
                  type: "text",
                },
                {
                  id: "freightType",
                  label: `${overseaLangObj.zx_fs || "装箱方式"}：`,
                  placeholder: "请选择",
                  type: "select",
                  basicType: "freightType",
                },
                {
                  id: "statusList",
                  label: `${overseaLangObj.zt_status || "状态"}：`,
                  placeholder: "状态（多选）",
                  type: "select",
                  multiple: true,
                  basicType: "inStorageStatus",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const TABLE_COL_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "nlcode",
  label: overseaLangObj.nl_no || "NL单号",
  showOverflowTooltip: true,
  minWidth: 140,
  sortable: true,
  fixed: "left",
};

const forecastTableCols = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  TABLE_COL_SELECTION,
  {
    prop: "orderOperationNum",
    // label: "工作单号",
    label: overseaLangObj.gz_dh,
    showOverflowTooltip: true,
    minWidth: 140,
    // customRow: true,
    cPageNoKey: "/warehouseManage/inStorage/buttOrderDetails",
    cOrderIdKey: "orderOperationId",
    columnLink: true,
    fixed: "left",
  },
  {
    prop: "sortBoxRegisterNo",
    label: overseaLangObj.gn_djh,
    showOverflowTooltip: true,
    minWidth: 130,
    sortable: true,
    fixed: "left",
  },
  {
    ...TABLE_COL_1,
    cPageNoKey: "/overseasBusiness/customsClearanceInfo",
    cOrderIdKey: "clearanceId",
    columnLink: true,
  },
  {
    prop: "bailorPeople",
    label: overseaLangObj.wtr_customer || "委托人",
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "headTransportModeName",
    label: overseaLangObj.tc_xs_fs || "头程运输方式",
    showOverflowTooltip: true,
    minWidth: 130,
  },
  {
    prop: "outWarehouseWayName",
    label: overseaLangObj.wc_xs_fs || "尾程运输方式",
    showOverflowTooltip: true,
    minWidth: 130,
  },
  {
    prop: "freightType",
    label: overseaLangObj.zx_fs || "装箱方式",
    showOverflowTooltip: true,
    minWidth: 100,
    align: "center",
    basicType: "freightType",
  },
  // {
  //   prop: "skuClassCount",
  //   label: "SKU数",
  //   decimal: 0,
  //   align: "right",
  //   showOverflowTooltip: true,
  //   width: 100
  // },
  {
    prop: "skuCount",
    label: overseaLangObj.sku_total || "SKU总数",
    decimal: 0,
    align: "right",
    showOverflowTooltip: true,
    width: 100,
  },
  {
    prop: "realFreightWeight",
    label: overseaLangObj.total_weight("总重量/KG"),
    decimal: 2,
    align: "right",
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "realFreightVolume",
    label: overseaLangObj.total_volume("总体积/CBM"),
    decimal: 2,
    align: "right",
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "consigneeCodes",
    label: overseaLangObj.sh_address || "目的地址",
    showOverflowTooltip: true,
    render: (rows) => {
      return rows.consigneeCodes?.length
        ? `${rows.consigneeCodes.length}个: ${rows.consigneeCodes.join("、")}`
        : "--";
    },
    minWidth: 120,
  },
  {
    prop: "warehousingTime",
    label: overseaLangObj.yj_rc_sj || "预计入仓时间",
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "realWarehousingTime",
    label: overseaLangObj.sj_rc_sj || "实际入仓时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 126,
  },
  {
    prop: "warehouseStatus",
    label: overseaLangObj.zt_status || "状态",
    showOverflowTooltip: true,
    dotColor: true,
    width: 86,
    fixed: "right",
    basicType: "inStorageStatus",
  },
  {
    prop: "operation",
    label: overseaLangObj.cz_operation || "操作",
    width: 120,
    fixed: "right",
    columnOperation: true,
  },
];

const cardConfig = [
  // {
  //   bgColor: '#ECF3FF',
  //   icon: 'yunshu1',
  //   type: 'slot',
  //   prop: 'addr',
  //   labelColor: '#80B1FF',
  //   valueColor: '#5094FF'
  // },
  // {
  //   bgColor: '#FFF3EC',
  //   labelTop: '工作单号：',
  //   labelBtm: 'NL单号：',
  //   propTop: 'operationOrderNum',
  //   propBtm: 'nlCode',
  //   labelColor: '#FF985C',
  //   valueColor: '#FF985C'
  // },
  {
    // 数据不对，先隐藏 2023/02/03
    //   bgColor: '#ECECFF',
    //   title: '合计应收',
    //   labelTop: '本位币：',
    //   labelBtm: '辅助币：',
    //   propTop: 'receivableRMB',
    //   propBtm: 'receivableUSD',
    //   labelColor: '#B1B1FF',
    //   valueColor: '#7676FF',
    //   decimal: 2
  },
  {
    //   bgColor: '#D2F1FF',
    //   title: '合计应付',
    //   labelTop: '本位币：',
    //   labelBtm: '辅助币：',
    //   propTop: 'payableRMB',
    //   propBtm: 'payableUSD',
    //   labelColor: '#64CFFF',
    //   valueColor: '#13B5FF',
    //   decimal: 2
  },
];

const SEE_FORM_COL_1 = {
  span: 8,
  id: "customerBeLongName",
  label: `${overseaLangObj.ck_gs || "仓库归属"}：`,
  type: "txt",
};
const SEE_FORM_COL_2 = {
  span: 8,
  id: "warehouseName",
  label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
  type: "txt",
};
const SEE_FORM_COL_3 = {
  span: 8,
  id: "warehousingTime",
  label: `${overseaLangObj.yj_rc_sj || "预计入仓时间"}：`,
  type: "txt",
};
const SEE_FORM_COL_4 = {
  span: 8,
  id: "operateMainName",
  label: `${overseaLangObj.wtr_customer || "委托人"}：`,
  type: "txt",
};
const SEE_FORM_COL_5 = {
  span: 8,
  id: "freightType",
  label: `${overseaLangObj.zx_fs || "装箱方式"}：`,
  type: "txt",
  basicType: "freightType",
};
const SEE_FORM_COL_6 = {
  span: 8,
  id: "sortBoxRegisterNo",
  label: `${overseaLangObj.gn_djh || "国内登记号"}：`,
  type: "txt",
};

export const storehouseLists = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEE_FORM_COL_1,
              SEE_FORM_COL_2,
              SEE_FORM_COL_3,
              SEE_FORM_COL_4,
              SEE_FORM_COL_5,
              SEE_FORM_COL_6,
            ],
          },
        ],
      },
    ],
  },
];


const TABS_COL_1={
  label: overseaLangObj.ax_sh || "按箱收货",
  key: 0,
}

const TABS_COL_2={
  label: overseaLangObj.a_sku_sh || "按SKU收货",
  key: 40,
}
const tabsConfig = (row={}) => {
  const {isBox,isSku}=row
  return {
    columns: [
      ...(isBox?[TABS_COL_1]:[]),
      ...(isSku?[TABS_COL_2]:[]),
      {
        label: overseaLangObj.cc_ps || "存仓派送",
        key: 8,
      },
      {
        label: overseaLangObj.base_info || "基本信息",
        key: 1,
      },
      {
        label: overseaLangObj.ps_delivery_info || "派送信息",
        key: 20,
      },
      {
        label: overseaLangObj.bill_info || "账单信息",
        key: 2,
      },
      {
        label: overseaLangObj.logistics_trajectory || "物流信息",
        key: 3,
      },
    ],
    active: 1,
  };
};

const basicInfoConfig = {
  lists: [
    {
      fieldList: [
        {
          title: overseaLangObj.base_info || "基本信息",
          titleClass: "-1",
          rows: [
            {
              cols: [
                {
                  ...contactsOperationAddress(),
                  label: overseaLangObj.fhr_shipper || "发货人",
                  id: "cusConsigner_address",
                  txtObjKey: "cusConsigner",
                },
                {
                  ...contactsOperationAddress(12),
                  label: overseaLangObj.shr_consignee || "收货人",
                  id: "cusConsignee_address",
                  txtObjKey: "cusConsignee",
                },
                {
                  ...contactsOperationAddress(),
                  label: overseaLangObj.tzr_notifier || "通知人",
                  id: "cusNotifier_address",
                  txtObjKey: "cusNotifier",
                },
              ],
            },
          ],
        },
        // {
        //   rows: [
        //     {
        //       cols: [
        //         {
        //           span: 24,
        //           id: "tableData",
        //           labelWidth: "0",
        //           type: "slot",
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
    },
  ],
};

//收货配置
const takeDeliveryConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 5,
                  id: "rkNo",
                  label: "头程入库单号：",
                  placeholder: "--",
                  type: "txt",
                  labelWidth: "110px",
                },
                {
                  span: 5,
                  id: "company",
                  label: "委托单位：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "boxNumber",
                  label: "预报箱数：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "sku",
                  label: "SKU类数：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "skuCount",
                  label: "SKU数：",
                  placeholder: "--",
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

export {
  forecastSearchCols,
  forecastTableCols,
  tabsConfig,
  basicInfoConfig,
  takeDeliveryConfig,
};
