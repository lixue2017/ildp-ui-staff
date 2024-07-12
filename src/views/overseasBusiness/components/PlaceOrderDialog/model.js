import { httpFollowUserIdAndKa, httpCountrySelect, httpUserSelect, httpEnterprisetSelect, httpPortPublicSelect, shipCompanyList } from "@/comModel/httpSelect"
import { httpWarehousePublicSelect, httpDeliveryPlaceSelect, httpDeliveryChannelSelect } from '@/comModel/warehouse';
const FORM_COLS_1 = {
  span: 12,
  id: "bailorPeopleId",
  label: "委托人：",
  placeholder: "委托人",
  ...httpFollowUserIdAndKa(),
  selectLabelKey: "bailorPeopleName"
}
const FORM_COLS_2 = {
  span: 12,
  id: "countryId",
  label: "目的国：",
  placeholder: "目的国",
  ...httpCountrySelect,
  selectLabelKey: "countryName"
}
const FORM_COLS_3 = {
  span: 12,
  id: "nlCode",
  label: "NL编号：",
  placeholder: "NL编号",
  type: "text",
  maxlength: 50
}
const FORM_COLS_4 = {
  span: 12,
  id: "overseasOperator",
  label: "操作员：",
  placeholder: "请选择海外操作员",
  ...httpUserSelect(),
  selectLabelKey: "overseasOperatorName"
}
// 清关信息
const FORM_COLS_1_1 = {
  span: 12,
  id: "agentType",
  label: "海外代理类型：",
  type: "radio",
  dicsStr: 'overseasAgent_type',
  customDicsArr: [0, 1],
}
const FORM_COLS_1_2 = {
  span: 12,
  id: "agent",
  label: "清关海外代理：",
  placeholder: "请选择海外代理",
  ...httpEnterprisetSelect(),
  selectLabelKey: "agentName",
  type: "slot"
}
const FORM_COLS_1_3 = {
  span: 12,
  id: "customsBroker",
  label: "清关行：",
  placeholder: "请选择清关行",
  ...httpEnterprisetSelect({ typeList: "3" }),
  selectLabelKey: "customsBrokerName"
}
const FORM_COLS_1_4 = {
  span: 12,
  id: "declareTime",
  label: "申报日期：",
  type: "date",
  placeholder: "年-月-日",
  valueFormat: "yyyy-MM-dd",
}
const FORM_COLS_1_5 = {
  span: 12,
  id: "pdo",
  label: "DO：",
  placeholder: "请选择DO",
  type: "select",
  basicType: "do"
}
const FORM_COLS_1_6 = {
  span: 12,
  id: "pod",
  label: "POD：",
  placeholder: "请选择POD",
  type: "select",
  basicType: "pod"
}
const FORM_COLS_1_7 = {
  span: 12,
  id: "mblNum",
  label: "MBL号：",
  placeholder: "请输入MBL号",
  type: "text",
  maxlength: 50
}
const FORM_COLS_1_8 = {
  span: 12,
  id: "registerNo",
  label: "箱号：",
  placeholder: "请输入箱号",
  type: "text",
  maxlength: 50
}
const FORM_COLS_1_9 = {
  span: 12,
  id: "airlineCompany",
  label: "船司/航司：",
  placeholder: "请选择船司/航司",
  ...httpEnterprisetSelect({ typeList: "3" }),
  selectLabelKey: "airlineCompanyName"
}
const FORM_COLS_1_10 = {
  span: 12,
  id: "transportMode",
  label: "运输方式：",
  placeholder: "请选择运输方式",
  type: "radio",
  basicType: "transportMode",
  hideList: [1, 2, 4]
}
const FORM_COLS_1_11 = {
  span: 12,
  id: "startPortId",
  label: "起运港：",
  placeholder: "请选择起运港",
  ...httpPortPublicSelect(),
  selectLabelKey: 'startPortName',
  type: "slot",
}
const FORM_COLS_1_12 = {
  span: 12,
  id: "endPortId",
  label: "目的港：",
  placeholder: "请选择目的港",
  ...httpPortPublicSelect(),
  selectLabelKey: 'endPortName',
  type: "slot",
}
const FORM_COLS_1_13 = {
  span: 12,
  id: "flightName",
  label: "船名/航名：",
  placeholder: "请输入船名/航名",
  type: "text",
  maxlength: 50
}
const FORM_COLS_1_14 = {
  span: 12,
  id: "voyageNumber",
  label: "船次/航次：",
  placeholder: "请输入船次/航次",
  type: "text",
  maxlength: 50
}
const FORM_COLS_1_15 = {
  span: 12,
  id: "departureTime",
  label: "ETD：",
  type: "date",
  placeholder: "年-月-日",
  valueFormat: "yyyy-MM-dd",
}
const FORM_COLS_1_16 = {
  span: 12,
  id: "reachTime",
  label: "ETA：",
  type: "date",
  placeholder: "年-月-日",
  valueFormat: "yyyy-MM-dd",
}
const FORM_COLS_1_17 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  type: "textarea",
}
// 派送登记
const FORM_COLS_2_1 = {
  span: 12,
  id: "delivertAgentType",
  label: "派送代理类型：",
  type: "radio",
  dicsStr: 'overseasAgent_type',
  customDicsArr: [0, 1],
}
const FORM_COLS_2_2 = {
  span: 12,
  id: "deliverAgent",
  label: "派送海外代理：",
  placeholder: "请选择海外代理",
  ...httpEnterprisetSelect(),
  selectLabelKey: "deliverAgentName",
  type: "slot",
}
const FORM_COLS_2_3 = {
  span: 12,
  id: "deliveryPlace",
  label: "发货地址：",
  placeholder: "请选择发货地址",
  ...httpDeliveryPlaceSelect(),
  selectLabelKey: "deliveryPlaceName",
  searchParamName: "code",
  isBackAll: true,
  type: "slot",
  showTag: true,
  tagPosition: true,
  tagId: "deliveryPlaceType",
  tagColor: "#35D06F",
  basicType: "clearanceDeliveryPlaceType"
}
const FORM_COLS_2_4 = {
  span: 12,
  id: "companyName",
  label: "名称：",
  type: "text",
  maxlength: 2000
}
const FORM_COLS_2_5 = {
  span: 24,
  id: "deliveryPlaceAddress",
  label: "地址：",
  type: "textarea"
}
const FORM_COLS_2_6 = {
  span: 12,
  id: "logisticsChannelId",
  label: "派送渠道：",
  placeholder: "请选择",
  ...httpDeliveryChannelSelect(),
  selectLabelKey: "logisticsChannelName",
}
const FORM_COLS_2_7 = {
  span: 12,
  id: "isInsure",
  type: "singleCheckbox",
  text: "保险服务"
}
const FORM_COLS_2_8 = {
  span: 12,
  id: "platformStore",
  label: "平台店铺：",
  placeholder: "请输入平台店铺",
  type: "text",
  maxlength: 100
}
const FORM_COLS_2_9 = {
  span: 12,
  id: "referenceNumber",
  label: "参考号：",
  placeholder: "请输入参考号",
  type: "text",
  maxlength: 100
}
const FORM_COLS_2_10 = {
  span: 12,
  id: "amazonDeliveryNumber",
  label: "Amazon发货号：",
  placeholder: "请输入Amazon发货号",
  type: "text",
  maxlength: 100
}
const FORM_COLS_2_11 = {
  span: 12,
  id: "amazonReferenceNumber",
  label: "Amazon参考号：",
  placeholder: "请输入Amazon参考号",
  type: "text",
  maxlength: 100
}
const FORM_COLS_2_12 = {
  span: 24,
  id: "remark",
  label: "派送备注：",
  placeholder: "请输入派送备注",
  type: "textarea",
}
// 存仓入库
const FORM_COLS_3_1 = {
  span: 12,
  id: "warehouseId",
  label: "入库仓：",
  placeholder: "请选择入库仓",
  ...httpWarehousePublicSelect({ typeList: '2', isHaveComId: 1 }),
  selectLabelKey: "warehouseName",
}
const FORM_COLS_3_2 = {
  span: 12,
  id: "warehousingTime",
  label: "预计入库日期：",
  type: "date",
  placeholder: "年-月-日",
  valueFormat: "yyyy-MM-dd",
}
const FORM_COLS_3_3 = {
  span: 12,
  id: "traceNumber",
  label: "跟踪号：",
  placeholder: "请输入跟踪号",
  type: "text",
  maxlength: 100
}
const FORM_COLS_3_4 = {
  span: 12,
  id: "referenceNumber",
  label: "参考编号：",
  placeholder: "请输入参考编号",
  type: "text",
  maxlength: 100
}
const FORM_COLS_3_5 = {
  span: 12,
  id: "warehousingSource",
  label: "入库来源：",
  type: "multiCheckbox",
  basicType: "downListWarehousingSource"
}
const FORM_COLS_3_6 = {
  span: 12,
  id: "packingMethod",
  label: "装箱方式：",
  type: "radio",
  basicType: "freightType"
}
const FORM_COLS_3_7 = {
  span: 24,
  id: "remark",
  label: "入仓备注：",
  placeholder: "请输入入仓备注",
  type: "textarea",
}
const formConfigFn = ({ lists, fieldList }) => ({
  size: "small",
  labelWidth: "75px",
  lists: [
    {
      fieldList: fieldList || [
        {
          rows: [
            {
              cols: lists || [],
            },
          ],
        },
      ],
    },
  ]
})
const formCom = (costCount, productCount) => ({
  ...formConfigFn({
    lists: [
      {
        ...FORM_COLS_1,
        ...costCount || productCount ? {
          id: "bailorPeopleName",
          type: "txt"
        } : {}
      },
      FORM_COLS_2,
      FORM_COLS_3,
      FORM_COLS_4
    ]
  }),
  formRules: {
    bailorPeopleId: [{
      required: true, message: "请选择委托人", trigger: "change"
    }],
    countryId: [{
      required: true, message: "请选择目的国", trigger: "change"
    }],
    nlCode: [{
      required: true, message: "请输入NL编号", trigger: "change"
    }]
  }
})

const customsClearance = (costCount, agentType) => ({
  ...formConfigFn({
    fieldList: [{
      className: 'border-bottom-solid',
      rows: [
        {
          cols: [
            { ...FORM_COLS_1_1, disable: !!costCount },
            {
              ...FORM_COLS_1_2,
              ...agentType == 0 && costCount ? {
                id: "agentName",
                type: "txt"
              } : {}
            },
            FORM_COLS_1_3,
            FORM_COLS_1_4,
            FORM_COLS_1_5,
            FORM_COLS_1_6,
            FORM_COLS_1_7,
            FORM_COLS_1_8
          ],
        },
      ],
    }, {
      rows: [
        {
          cols: [
            FORM_COLS_1_9,
            FORM_COLS_1_10,
            FORM_COLS_1_11,
            FORM_COLS_1_12,
            FORM_COLS_1_13,
            FORM_COLS_1_14,
            FORM_COLS_1_15,
            FORM_COLS_1_16,
            FORM_COLS_1_17
          ],
        },
      ],
    }]
  }),
  formRules: {
    agentType: [{
      required: true, message: "请选择海外代理类型", trigger: "change"
    }],
    agent: [{
      required: true, message: "请选择海外代理", trigger: "change"
    }],
    customsBroker: [{
      required: true, message: "请选择清关行", trigger: "change"
    }],
    transportMode: [{
      required: true, message: "请选择运输方式", trigger: "change"
    }],
  }
})

const delivery = {
  ...formConfigFn({
    fieldList: [{
      className: 'border-bottom-solid',
      rows: [
        {
          cols: [
            FORM_COLS_2_1,
            FORM_COLS_2_2,
            FORM_COLS_2_3,
            FORM_COLS_2_4,
            FORM_COLS_2_5,
          ]
        }
      ]
    }, {
      rows: [
        {
          cols: [
            FORM_COLS_2_6,
            FORM_COLS_2_7,
            FORM_COLS_2_8,
            FORM_COLS_2_9,
            FORM_COLS_2_10,
            FORM_COLS_2_11,
            FORM_COLS_2_12,
          ]
        }
      ]
    }]
  }),
  formRules: {
    delivertAgentType: [{
      required: true, message: "请选择代理类型", trigger: "change"
    }],
    deliverAgent: [{
      required: true, message: "请选择海外代理", trigger: "change"
    }],
    deliveryPlace: [{
      required: true, message: "请选择发货地址", trigger: "change"
    }],
    logisticsChannelId: [{
      required: true, message: "请选择派送渠道", trigger: "change"
    }],
    referenceNumber: [{
      required: true, message: "请输入参考号", trigger: "change"
    }],
    amazonDeliveryNumber: [{
      required: true, message: "请输入Amazon发货号", trigger: "change"
    }],
    amazonReferenceNumber: [{
      required: true, message: "请输入Amazon参考号", trigger: "change"
    }]
  }
}

const warehousing = {
  ...formConfigFn({
    lists: [
      FORM_COLS_3_1,
      FORM_COLS_3_2,
      FORM_COLS_3_3,
      FORM_COLS_3_4,
      FORM_COLS_3_5,
      FORM_COLS_3_6,
      FORM_COLS_3_7,
    ]
  }),
  formRules: {
    warehouseId: [{
      required: true, message: "请选择入库仓", trigger: "change"
    }],
    warehousingTime: [{
      required: true, message: "请选择预计入库日期", trigger: "change"
    }],
    traceNumber: [{
      required: true, message: "请输入跟踪号", trigger: "change"
    }],
    packingMethod: [{
      required: true, message: "请选择装箱方式", trigger: "change"
    }]
  }
}

export { formCom, customsClearance, delivery, warehousing }
