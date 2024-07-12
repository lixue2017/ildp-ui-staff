import { httpTraySelect } from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

const fixedConfig = [
  {
    span: 24,
    id: "bailorPeople",
    label: `${overseaLangObj.wtr_customer || "委托客户"}：`,
    type: "txt",
  },
  {
    span: 24,
    id: "storageMode",
    label: `${overseaLangObj.cc_fs || "存仓方式"}：`,
    type: "radio",
    dicsStr: "storageMode",
    customDicsArr: [0, 1, 2], // 对象属性名
    customDicsVal: "storageMode",
    // options: [
    //   {
    //     value: "2",
    //     label: 'SKU存仓'
    //   }, {
    //     value: "1",
    //     label: '整箱存仓'
    //   }
    // ],
    disable: true,
  },
];
const config_1 = {
  span: 24,
  id: "isNew",
  label: `${overseaLangObj.tp_type || "托盘类型"}：`,
  type: "radio",
  options: [
    {
      value: 1,
      label: overseaLangObj.new_tray || "新托盘",
    },
    {
      value: 0,
      label: overseaLangObj.yy_tray || "已有托盘",
    },
  ],
};
const config_2 = {
  span: 24,
  id: "trayNumObj",
  label: `${overseaLangObj.tp_bh || "托盘编号"}：`,
  ...httpTraySelect(),
  isBackAll: true,
  type: "slot",
};

const config_3 = {
  span: 24,
  id: "remark",
  label: `${overseaLangObj.bz_remark() || "备注"}：`,
  placeholder: "请输入",
  type: "textarea",
  maxlength: 200,
};
export const config = (isNew) => {
  if (isNew) {
    return {
      lists: [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: [...fixedConfig, config_1, config_3],
                },
              ],
            },
          ],
        },
      ],
      formRules: {},
    };
  }
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [...fixedConfig, config_1, config_2],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      trayNumObj: [
        { required: true, message: "请选择托盘编号", trigger: "change" },
      ],
    },
  };
};

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_M_COL_3 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh_fn("单号"),
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_M_COL_12 = {
  prop: "shipmentId",
  label: "Shipment ID",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_M_COL_13 = {
  prop: "sku",
  label: "SKU",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_M_COL_9 = {
  prop: "totalNum",
  label: overseaLangObj.tp_total_num || "总数量",
  width: 90,
  showOverflowTooltip: true,
  align: "right",
  decimal: 0,
};
export const tableTrayMovingColumns = () => {
  return [
    TABLE_COL_0,
    TABLE_M_COL_3,
    TABLE_M_COL_12,
    TABLE_M_COL_13,
    TABLE_M_COL_9,
  ];
};
