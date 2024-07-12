import { httpUserSelect, httpEnterprisetSelect,httpRoleDeptUserSelect } from "@/comModel/httpSelect";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";

const FORM_COLS_1 = {
  span: 12,
  id: "jobNo",
  label: "工作单号：",
  type: "txt",
};
const FORM_COLS_2 = {
  span: 12,
  id: "overseaBusinessTypesName",
  label: "业务类型：",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 12,
  id: "agentType",
  label: "清关代理类型：",
  type: "radio",
  dicsStr: "overseasAgent_type",
  customDicsArr: [0, 1],
};
const FORM_COLS_4 = {
  span: 12,
  id: "agent",
  label: "海外代理：",
  placeholder: "请选择海外代理",
  ...httpEnterprisetSelect(),
  selectLabelKey: "agentName",
  type: "slot",
};
const FORM_COLS_5 = {
  span: 12,
  id: "bailorPeopleName",
  label: "清关委托人：",
  type: "txt",
};
const FORM_COLS_6 = {
  span: 12,
  id: "form_xx_6",
  label: "清关业务单位：",
  type: "txt",
};
const FORM_COLS_7 = {
  span: 12,
  id: "nlCode",
  label: "清关单号：",
  placeholder: "清关单号",
  type: "text",
};
const FORM_COLS_8 = {
  span: 12,
  id: "overseasOperator",
  label: "清关操作员：",
  placeholder: "请选择海外操作员",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
  selectLabelKey: "overseasOperatorName",
};
// const FORM_COLS_8_2 = {
//   span: 12,
//   id: "operator",
//   label: "操作员：",
//   placeholder: "请选择操作员",
//   ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
// };
const FORM_COLS_9 = {
  span: 12,
  id: "warehouseId",
  label: "入海外仓：",
  placeholder: "请选择入海外仓",
  ...httpWarehousePublicSelect({
    typeList: "2",
    flagAvailable: "h",
    isHaveComId: 1,
  }),
  type: "slot",
  selectLabelKey: "warehouseName",
  showTag: true,
  // tagPosition: true,
  tagId: "packingMethod",
  tagColor: "#35D06F",
  basicType: "freightType",
};
const FORM_COLS_10 = {
  span: 12,
  id: "warehousingTime",
  label: "预计入库日期：",
  type: "date",
  placeholder: "年-月-日",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_11 = {
  span: 12,
  id: "delivertAgentType",
  label: "派送代理类型：",
  type: "radio",
  dicsStr: "overseasAgent_type",
  customDicsArr: [0, 1],
};
const FORM_COLS_12 = {
  span: 12,
  id: "deliverAgent",
  label: "派送海外代理：",
  placeholder: "请选择海外代理",
  ...httpEnterprisetSelect(),
  selectLabelKey: "deliverAgentName",
  type: "slot",
};
const FORM_COLS_13 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入备注信息（2000字）",
  type: "textarea",
  maxlength: 2000,
};
const FORM_COLS_14 = {
  span: 12,
  id: "ontainerSno",
  label: "国内登记号：",
  placeholder: "国内登记号",
  type: "text",
};
const FORM_COLS_15 = {
  span: 12,
  id: "expectWarehouseType",
  label: "预报入库仓：",
  placeholder:"请选择预报入库仓",
  type: "select",
  basicType:"clearanceReservationWarehouse"
};
const FORM_COLS_16 = {
  span: 12,
  id: "reachTime",
  label: "ETA：",
  placeholder: "请选择ETA",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};


const formColumns = (type1, type2,overseaBusinessTypes=[]) => [
  FORM_COLS_1,//工作单号
  FORM_COLS_2,//业务类型
  ...(type1 === 1 ? [FORM_COLS_3, FORM_COLS_4, FORM_COLS_7, FORM_COLS_8] : []),
  ...([type1, type2].includes(2) ? [FORM_COLS_11, FORM_COLS_12] : []),
  ...(type2 === 3 ? [FORM_COLS_9, FORM_COLS_10] : []),
  ...(overseaBusinessTypes.includes(1)?[FORM_COLS_14,FORM_COLS_15]:overseaBusinessTypes.includes(2)?[FORM_COLS_14]:[]),
  FORM_COLS_16,
  ...(type1==2?[FORM_COLS_8]:[]),
  FORM_COLS_13,
];

export const config = (type1, type2,overseaBusinessTypes) => ({
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: formColumns(type1, type2,overseaBusinessTypes),
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    agent: [
      {
        required: true,
        message: "请选择海外代理",
        trigger: "change",
      },
    ],
    overseasOperator: [
      {
        required: true,
        message: "请选择海外操作员",
        trigger: "change",
      },
    ],
    operator: [
      {
        required: true,
        message: "请选择海外操作员",
        trigger: "change",
      },
    ],
    warehouseId: [
      {
        required: true,
        message: "请选择入海外仓",
        trigger: "change",
      },
    ],
    warehousingTime: [
      {
        required: true,
        message: "请选择预计入库日期",
        trigger: "change",
      },
    ],
    reachTime: [
      {
        required: true,
        message: "请选择ETA",
        trigger: "change",
      },
    ],
    delivertAgentType: [
      {
        required: true,
        message: "请选择派送代理类型",
        trigger: "change",
      },
    ],
    deliverAgent: [
      {
        required: true,
        message: "请选择海外代理",
        trigger: "change",
      },
    ],
    expectWarehouseType: [
      {
        required: true,
        message: "请选择预报入库仓",
        trigger: "change",
      },
    ],
  },
});


