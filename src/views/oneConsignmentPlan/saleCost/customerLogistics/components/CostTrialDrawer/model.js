import {
  httpWarehousePublicSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import {
  httpProductSkuSelect,
  httpCountrySelect,
  httpCustomerSelect,
} from "@/comModel/httpSelect";
import { logisticsProductList } from "@/api/warehouse/basic";

const FORM_COLS_1 = {
  span: 12,
  id: "wmsId",
  label: "计费仓：",
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
  selectLabelKey: "wmsName",
};
const FORM_COLS_2 = {
  span: 12,
  id: "logisticsProductId",
  label: "物流产品：",
  placeholder: "请选择物流产品",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
  }),
  selectLabelKey: "logisticsProductName",
};
const FORM_COLS_3 = {
  span: 12,
  id: "customerId",
  label: "客户代码：",
  placeholder: "请选择客户代码",
  ...httpCustomerSelect(),
};
const FORM_COLS_4 = {
  span: 12,
  id: "khdj",
  label: "客户等级：",
  placeholder: "请选择客户等级",
  type: "select",
  basicType: "priceGrade",
};
const FORM_COLS_5 = {
  span: 12,
  id: "goodsPackType",
  label: "包装类型：",
  placeholder: "包装类型",
  type: "select",
  basicType: "goodsPackType",
};
const FORM_COLS_6 = {
  span: 12,
  id: "destinationCountryId",
  label: "目的国：",
  placeholder: "请选择目的国",
  ...httpCountrySelect,
};
const FORM_COLS_7 = {
  span: 12,
  id: "multiSelect",
  type: "multiCheckbox",
  options: [
    {
      value: 1,
      label: "签名服务",
    },
    {
      value: 2,
      label: "保险服务",
    },
  ],
};
const FORM_COLS_8 = {
  span: 12,
  id: "postalCode",
  label: "邮编：",
  placeholder: "请输入邮编",
  type: "text",
};
const FORM_COLS_9 = {
  span: 12,
  id: "insuranceAmount",
  label: "保险金额：",
  placeholder: "请输入保险金额",
  type: "inputNumber",
  numDecimal: 2,
};
const FORM_COLS_10 = {
  span: 12,
  id: "province",
  label: "省/州：",
  placeholder: "请输入省/州",
  type: "text",
};
const FORM_COLS_11 = {
  span: 12,
  id: "totalDeclaredAmount",
  label: "总申报价值：",
  placeholder: "请输入总申报价值",
  type: "inputNumber",
  numDecimal: 2,
};
const FORM_COLS_12 = {
  span: 12,
  id: "city",
  label: "府/城市：",
  placeholder: "请输入府/城市",
  type: "text",
};
const FORM_COLS_13 = {
  span: 24,
  id: "detailedAddress",
  label: "地址：",
  placeholder: "请输入地址",
  type: "text",
};
const FORM_COLS_14 = {
  span: 12,
  id: "volume",
  label: "体积(CM)：",
  placeholder: "请输入体积",
  type: "slot",
};
const FORM_COLS_15 = {
  span: 12,
  id: "weight",
  label: "重量(KG)：",
  placeholder: "总重量",
  type: "inputNumber",
  numDecimal: 2,
};

const FORM_RIGHT_1 = {
  span: 12,
  id: "product",
  labelWidth: "15px",
  ...httpProductSkuSelect(),
  isBackAll: true,
  type: "slot",
};

const FORM_RIGHT_2 = {
  span: 12,
  id: "skuNum",
  label: "SKU数：",
  // labelWidth: "55px",
  placeholder: "产品数",
  type: "inputNumber",
  numDecimal: 0,
};

const FORM_RIGHT_3 = {
  span: 12,
  id: "skuTypeNum",
  label: "SKU种类数：",
  placeholder: "产品类数",
  type: "inputNumber",
  numDecimal: 0,
};

const formColumns = [
  FORM_COLS_1,//计费仓
  FORM_RIGHT_1,//产品
  FORM_COLS_2,//物流产品
  FORM_COLS_14,//体积
  FORM_COLS_3,//客户代码
  FORM_COLS_15,//重量
  FORM_COLS_6,//目的国
  FORM_RIGHT_2,//SKU数
  FORM_COLS_8,//邮编
  FORM_RIGHT_3,//SKU类
  FORM_COLS_13,//地址
  // FORM_COLS_4,//客户等级
  // FORM_COLS_5,//包装类型
  // FORM_COLS_7,
  // FORM_COLS_9,//保险金额
  // FORM_COLS_10,//省/州
  // FORM_COLS_11,//总申报价值
  // FORM_COLS_12,//府/城市
];
export const formConfig = {
  lists: [
    {
      width: 690,
      className: "form-left",
      fieldList: [
        {
          rows: [
            {
              cols: formColumns,
            },
          ],
        },
      ],
    },
    {
      className: "form-right",
      fieldList: [
        // {
        //   rows: [
        //     {
        //       cols: [FORM_RIGHT_1],
        //     },
        //   ],
        // },
        {
          rows: [
            {
              cols: [
                {
                  id: "tableSlot",
                  labelWidth: "0",
                  type: "slot",
                },
              ],
            },
          ],
        },
        // {
        //   rows: [
        //     {
        //       cols: [FORM_RIGHT_2, FORM_RIGHT_3],
        //     },
        //   ],
        // },
      ],
    },
  ],
  formRules: {
    wmsId: [
      {
        required: true,
        message: "请选择计费仓",
        trigger: "change",
      },
    ],
    logisticsProductId: [
      {
        required: true,
        message: "请选择物流产品",
        trigger: "change",
      },
    ],
    destinationCountryId: [
      {
        required: true,
        message: "请选择目的国",
        trigger: "change",
      },
    ],
    customerId: [
      {
        required: true,
        message: "请选择客户代码",
        trigger: "change",
      },
    ],
    weight: [
      {
        required: true,
        message: "请输入重量",
        trigger: "change",
      },
    ],
    skuNum: [
      {
        required: true,
        message: "请输入SKU数",
        trigger: "change",
      },
    ],
    length: [
      {
        required: true,
        message: "请输入长度",
        trigger: "change",
      },
    ],

  },
};
