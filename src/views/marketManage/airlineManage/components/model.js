import { getAirGroupList } from "@/api/marketManage/airline.js";
import { getContactsPublicList } from "@/api/publicInterface/index.js"; //公共接口
import {
  httpPortPublicSelect,
  httpCustomerSelect,
  shipCompanyList,
  httpCountrySelect,
  httpCompanySelect,
  httpEnterprisetSelect,
  httpContactsSelect,
} from "@/comModel/httpSelect.js";
import {httpWarehousePublicSelect} from"@/comModel/warehouse.js"

const Add_FOEM_COL_1 = {
  span: 12,
  id: "routeCodeId",
  label: "航线组：",
  isBackAll: true,
  placeholder: "请选择航线组",
  type: "autocomplete",
  labelWidth: "120px",
  selectLabelKey: "routeCodeName",
  isAutoInitRequest: true,
  httpRequest: (rows) => getAirGroupList({ ...rows, status: 1 }),
  defaultProp: {
    value: "id",
    label: "code,nameCn",
  },
  type:'slot'
};
const Add_FOEM_COL_2 = {
  span: 12,
  id: "lineTypeName",
  label: "航线类型：",
  placeholder: "--",
  type: "txt",
};
const Add_FOEM_COL_3 = {
  span: 12,
  id: "code",
  label: "航线代码：",
  placeholder: "请输入航线代码",
  type: "text",
};
const Add_FOEM_COL_4 = {
  span: 12,
  id: "nameCn",
  label: "航线名称：",
  placeholder: "请输入航线名称",
  type: "text",
};

const Add_FOEM_COL_5 = {
  span: 12,
  id: "shipCompany",
  label: "航空/船公司：",
  // isBackAll: true,
  placeholder: "请选择航空/船公司",
  labelWidth: "120px",
  ...shipCompanyList(),
};
const Add_FOEM_COL_6 = {
  span: 12,
  id: "routeProxy",
  label: "航线代理：",
  placeholder: "请选择航线代理",
  basicType: "clientIdentity",
  hideList: [2, 3, 4],
  type: "radio",
};
const Add_FOEM_COL_7 ={
    span: 12,
    id: "startPort",
    label: "起运港：",
    // isBackAll: true,
    placeholder: "请选择起运港",
    type: "autocomplete",
    labelWidth: "120px",
    ...httpPortPublicSelect(),
    type:"slot"
  }
const Add_FOEM_COL_8 ={
    span: 12,
    id: "endPort",
    label: "目的港：",
    // isBackAll: true,
    placeholder: "请选择目的港",
    type: "autocomplete",
    labelWidth: "120px",
    ...httpPortPublicSelect(),
    type:"slot"
  }
const Add_FOEM_COL_9 ={
    span: 12,
    id: "transfer",
    label: "中转港：",
    // isBackAll: true,
    placeholder: "请选择中转港",
    type: "autocomplete",
    labelWidth: "120px",
    ...httpPortPublicSelect(),
    type:"slot"
  }
const Add_FOEM_COL_10 = {
  span: 24,
  labelWidth: "120px",
  label: "备注说明:",
  type: "txt",
  className: "custom-remark",
};
const Add_FOEM_COL_11 = {
  span: 24,
  id: "remark",
  labelWidth:'0px',
  placeholder: "备注说明（最多200字）",
  type: "textarea",
  maxlength: 200,
  rows: 3,
};
const Add_FOEM_COL_12 = {
  span: 12,
  id: "isSortBox",
  text: "堡森拼柜",
  type: "singleCheckbox",
};

const Add_FOEM_COL_13 = {
  span: 12,
  id: "boxCwmId",
  label: "国内集货仓：",
  placeholder: "请选择国内集货仓",
  ...httpWarehousePublicSelect({
    flagAvailable: "y",
    typeList: "2,3",
  }),
};
const Add_FOEM_COL_14 = {
  span: 12,
  id: "boxCustomerId",
  label: "拼柜委托客户：",
  placeholder: "请选择拼柜委托客户",
  ...httpCompanySelect({
    status: '0,1,2,3,4,5',
    isQueryFirstDept: 1,
    pageNum: 1,
    pageSize: 20
  }),
  currData: true,
  type:'slot'
};
const Add_FOEM_COL_15 = {
  span: 12,
  id: "boxCountryId",
  label: "目的国：",
  placeholder: "请选择目的国",
  ...httpCountrySelect,
};
const Add_FOEM_COL_16 = {
  span: 12,
  id: "boxOperateMain",
  label: "拼柜主体：",
  placeholder: "请选择拼柜主体",
  ...httpCompanySelect({
    status: '0,1,2,3,4,5',
    isQueryFirstDept: 1,
    pageNum: 1,
    pageSize: 20
  }),
  type:'slot'
};
const Add_FOEM_COL_17 = {
  span: 12,
  id: "boxConsigneeId",
  label: "收货人：",
  placeholder: "请选择收货人",
  type: "autocomplete",
  ...httpContactsSelect({ contactsType: 0 }),
  type:'slot'
};
const Add_FOEM_COL_18 = {
  span: 12,
  id: "boxBookingSpaceProxy",
  label: "拼柜订舱代理：",
  placeholder: "请选择拼柜订舱代理",
  ...httpEnterprisetSelect({ typeList: "0,3",isQueryFirstDept: 1 }),
  type:'slot'
};
const Add_FOEM_COL_19 = {
  span: 12,
  id: "boxConsignerId",
  label: "发货人：",
  placeholder: "请选择发货人",
  type: "autocomplete",
  ...httpContactsSelect({ contactsType: 1 }),
  type:'slot'
};
const Add_FOEM_COL_20 = {
  span: 12,
  id: "boxSalesman",
  label: "业务员：",
  placeholder: "--",
  type: "txt",
  render:(row)=>{
    const {boxSalesmanName}=row
    return boxSalesmanName
  }
};
const Add_FOEM_COL_21 = {
  span: 12,
  id: "boxNotifierId",
  label: "通知人：",
  placeholder: "请选择通知人",
  type: "autocomplete",
  ...httpContactsSelect(),
  type:'slot'
};
const Add_FOEM_COL_22 = {
  span: 12,
  id: "nameEn",
  label: "拼柜名称：",
  placeholder: "请输入拼柜名称",
  type: "text",
};
export const config=(row={})=>{
  const {isSortBox}=row
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  Add_FOEM_COL_1,//航线组
                  Add_FOEM_COL_2,//航线类型
                  Add_FOEM_COL_3,//航线代码
                  Add_FOEM_COL_4,//航线名称
                  Add_FOEM_COL_7,//起运港
                  Add_FOEM_COL_8,//目的港
                  Add_FOEM_COL_9,//中转港
                  Add_FOEM_COL_5,//航空船公司
                  Add_FOEM_COL_12,//内部收款账号
                  ...(isSortBox?[
                    Add_FOEM_COL_22,
                    Add_FOEM_COL_13,
                    Add_FOEM_COL_14,
                    Add_FOEM_COL_15,
                    Add_FOEM_COL_16,
                    Add_FOEM_COL_17,
                    Add_FOEM_COL_18,
                    Add_FOEM_COL_19,
                    Add_FOEM_COL_20,
                    Add_FOEM_COL_21
                  ]:[])
                ],
              },
            ],
          },
          {
            rows: [
              {
                cols: [Add_FOEM_COL_10, Add_FOEM_COL_11],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      routeCodeId: [{ required: true, message: "请选择航线组", trigger: "change" }],
      code: [{ required: true, message: "请输入航线代码", trigger: "change" }],
      nameCn: [{ required: true, message: "请输入航线名称", trigger: "change" }],
      // shipCompany: [
      //   { required: true, message: "请选择航空/船公司", trigger: "change" },
      // ],
      routeProxy: [
        { required: true, message: "请选择航线代理", trigger: "change" },
      ],
      startPort: [
        { required: true, message: "请选择起运港", trigger: "change" },
      ],
      endPort: [
        { required: true, message: "请选择目的港", trigger: "change" },
      ],
      boxCwmId: [
        { required: true, message: "请选择国内集货仓", trigger: "change" },
      ],
      boxCustomerId: [
        { required: true, message: "请选择拼柜委托客户", trigger: "change" },
      ],
      boxCountryId: [
        { required: true, message: "请选择目的国", trigger: "change" },
      ],
      boxOperateMain: [
        { required: true, message: "请选择拼柜主体", trigger: "change" },
      ],
      boxConsigneeId: [
        { required: true, message: "请选择收货人", trigger: "change" },
      ],
      boxBookingSpaceProxy: [
        { required: true, message: "请选择拼柜订舱代理", trigger: "change" },
      ],
      boxConsignerId: [
        { required: true, message: "请选择发货人", trigger: "change" },
      ],
      nameEn: [
        { required: true, message: "请输入拼柜名称", trigger: "change" },
      ],
    },
  }
}
// export const config = {
//   lists: [
//     {
//       fieldList: [
//         {
//           rows: [
//             {
//               cols: [
//                 Add_FOEM_COL_1,//航线组
//                 Add_FOEM_COL_2,//航线类型
//                 Add_FOEM_COL_3,//航线代码
//                 Add_FOEM_COL_4,//航线名称
//                 Add_FOEM_COL_7,//起运港
//                 Add_FOEM_COL_8,//目的港
//                 Add_FOEM_COL_9,//中转港
//                 Add_FOEM_COL_5,//航空船公司
//                 Add_FOEM_COL_12
//               ],
//             },
//           ],
//         },
//         {
//           rows: [
//             {
//               cols: [Add_FOEM_COL_10, Add_FOEM_COL_11],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   formRules: {
//     airGroup: [{ required: true, message: "请选择航线组", trigger: "change" }],
//     code: [{ required: true, message: "请输入航线代码", trigger: "change" }],
//     name: [{ required: true, message: "请输入航线名称", trigger: "change" }],
//     shipCompany: [
//       { required: true, message: "请选择航空/船公司", trigger: "change" },
//     ],
//     routeProxy: [
//       { required: true, message: "请选择航线代理", trigger: "change" },
//     ],
//     startPortName: [
//       { required: true, message: "请选择起运港", trigger: "change" },
//     ],
//     endPortName: [
//       { required: true, message: "请选择目的港", trigger: "change" },
//     ],
//   },
// };
