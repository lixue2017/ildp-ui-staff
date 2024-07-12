import { httpGetServiceChannel } from '@/comModel/httpSelect.js'
import { POSITIVE_EN } from '@/utils/mixin'
const config = {
  lists: [
    {
      fieldList: [
        {
          className: 'border-bottom-solid',
          rows: [
            {
              cols: [
                {
                  span: 9,
                  id: "consignerContactAndCompany",
                  label: "发货人",
                  labelWidth: "76px",
                  labelClassName: "item-label-title",
                  placeholder: "发货公司名称",
                  type: "text",
                  maxlength: 100
                },
                {
                  span: 2,
                  id: "consignerCountryId",
                  selectLabelKey: "consignerCountryName",
                  labelWidth: "0",
                  type: "autocomplete",
                  placeholder: '国家',
                  category: 'country',
                  defaultProp: {
                    value: 'id',
                    label: 'twoCode,nameCn',
                  },
                  className: "country"
                },
                {
                  span: 9,
                  id: "consignerCompanyAddress",
                  labelWidth: "0",
                  type: "text",
                  placeholder: "发货公司地址",
                  className: "address",
                  maxlength: 255
                }
              ],
            },
          ],
        },
        {
          className: 'border-bottom-solid',
          rows: [
            {
              cols: [
                {
                  span: 9,
                  id: "consigneeContactAndCompany",
                  label: "收货人",
                  labelWidth: "76px",
                  labelClassName: "item-label-title",
                  placeholder: "收货公司名称",
                  type: "text",
                  maxlength: 100
                },
                {
                  span: 2,
                  id: "consigneeCountryId",
                  selectLabelKey: "consigneeCountryName",
                  labelWidth: "0",
                  type: "autocomplete",
                  placeholder: '国家',
                  category: 'country',
                  defaultProp: {
                    value: 'id',
                    label: 'twoCode,nameCn',
                  },
                  className: "country"
                },
                {
                  span: 9,
                  id: "consigneeCompanyAddress",
                  labelWidth: "0",
                  type: "text",
                  placeholder: "收货公司地址",
                  className: "address",
                  maxlength: 255
                },
                {
                  span: 6,
                  id: "customsClearanceType",
                  label: "VAT/EORI/POA：",
                  labelWidth: "176px",
                  type: "text",
                  placeholder: "VAT号",
                  maxlength: 50,
                },
                {
                  span: 3,
                  id: "customsClearanceType1",
                  labelWidth: "0px",
                  type: "text",
                  placeholder: "EORI号",
                  maxlength: 50,
                }
              ],
            },
          ],
        },
        {
          className: 'border-bottom-solid',
          rows: [
            {
              cols: [
                // {
                //   span: 5,
                //   id: "serviceChannelId",
                //   label: "运输方式：",
                //   placeholder: "请选择运输方式",
                //   defaultKey: 'id',
                //   searchIdKey: "id",
                //   selectLabelKey: "serviceChannel",
                //   noClearable: true,
                //   labelWidth: "76px",
                //   ...httpGetServiceChannel(),
                // },                
                {
                  span: 6,
                  id: "headTransportMode",
                  label: "头程运输方式：",
                  placeholder: "头程运输方式",
                  type: "select",
                  basicType: "headTransportMode",
                },
                {
                  span: 6,
                  id: "outWarehouseWay",
                  label: "尾程运输方式：",
                  placeholder: "尾程运输方式",
                  type: "select",
                  basicType: "outWarehouseWay",
                },
                {
                  span: 6,
                  id: "encasementWay",
                  label: "装箱方式：",
                  placeholder: "装箱方式",
                  type: "slot",
                  basicType: "freightType",
                },
                {
                  span: 6,
                  id: "space",
                  type: "slot",
                },
                {
                  span: 6,
                  id: "reportCustomsWayId",
                  label: "报关方式：",
                  type: "select",
                  basicType: "customsDeclarationType"
                },
                {
                  span: 6,
                  id: "clearanceType",
                  label: "清关类型：",
                  type: "radio",
                  basicType: 'customsClearanceType',
                },
                {
                  span: 6,
                  id: "reportCurrencyId",
                  label: "清关币别：",
                  placeholder: "-请选择-",
                  type: "autocomplete",
                  category: "currency",
                  // selectLabelKey: "reportCurrency",
                  defaultProp: {
                    value: 'id',
                    label: 'code,nameCn'
                  }
                },
                {
                  span: 6,
                  id: "cusOrderNumber",
                  label: "客户单号：",
                  placeholder: "此处填写客户单号",
                  type: "text",
                  maxlength: 256
                },
              ]
            },
          ],
        },
        {
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
      ],
    }
  ],
  formRules: {
    consignerContactAndCompany: [
      { required: true, message: "请输入发货人", trigger: "change" },
      POSITIVE_EN
    ],
    consignerCountryId: [
      { required: true, message: "请选择国家", trigger: "change" },
      POSITIVE_EN
    ],
    consignerCompanyAddress: [
      { required: true, message: "请输入发货公司地址", trigger: "change" },
      POSITIVE_EN
    ],
    consigneeContactAndCompany: [
      { required: true, message: "请输入收货人", trigger: "change" },
      POSITIVE_EN
    ],
    consigneeCountryId: [
      { required: true, message: "请选择国家", trigger: "change" },
      POSITIVE_EN
    ],
    consigneeCompanyAddress: [
      { required: true, message: "请输入收货公司地址", trigger: "change" },
      POSITIVE_EN
    ],
    serviceChannelId: [
      { required: true, message: "请选择运输方式", trigger: "change" }
    ],
    headTransportMode: [
      { required: true, message: "请选择头程运输方式", trigger: "change" }
    ],
    outWarehouseWay: [
      { required: true, message: "请选择尾程运输方式", trigger: "change" }
    ],
    encasementWay: [
      { required: true, message: "请选择装箱方式", trigger: "change" }
    ],
    customsClearanceType: [
      POSITIVE_EN
    ],
    customsClearanceType1: [
      POSITIVE_EN
    ],
  }
}


export { config };