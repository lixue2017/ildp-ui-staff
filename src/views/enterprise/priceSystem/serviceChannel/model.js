
import {
  getCustServiceNameList,
  getProviderName
} from "@/api/priceSystem/provider.js";
import { httpEnterprisetSelect } from "@/comModel/httpSelect.js"

const searchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "code",
    label: "服务渠道代码：",
    placeholder: "服务渠道代码",
    type: "text",
  },
  {
    id: "nameCn",
    label: "服务渠道名称：",
    placeholder: "服务渠道名称",
    type: "text",
  },
  {
    id: "statusList",
    label: "状态：",
    placeholder: "状态(多选)",
    type: "select",
    multiple: true,
    basicType: "status"
  },
  {
    id: "providerSimpleName",
    label: "服务商简称：",
    placeholder: "服务商简称",
    type: "text"
  },
  {
    id: "freightType",
    label: "装箱方式：",
    placeholder: "请选择装箱方式",
    type: "select",
    basicType: "freightType"
  },
  {
    id: "outWarehouseWay",
    label: "出库方式：",
    placeholder: "请选择出库方式",
    type: "select",
    basicType: "out_warehouse_way"
  },
  {
    id: "transportType",
    label: "运输方式：",
    placeholder: "请选择运输方式",
    type: "select",
    basicType: "transportMode"
  },
];
const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "code",
    label: "服务渠道代码",
    columnLink: true,
    sortable: true,
    align: "left",
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: "nameCn",
    label: "渠道名称(CN)",
    minWidth: 140,
    align: "left",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "nameEn",
    label: "渠道名称(EN)",
    minWidth: 140,
    align: "left",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "freightType",
    label: "装箱方式",
    minWidth: 140,
    align: "left",
    sortable: true,
    showOverflowTooltip: true,
    basicType: "freightType"
  },
  {
    prop: "outWarehouseWay",
    label: "出库方式",
    minWidth: 120,
    align: "center",
    showOverflowTooltip: true,
    sortable: true,
    basicType: "out_warehouse_way"
  },
  {
    prop: "transportType",
    label: "运输方式",
    minWidth: 120,
    align: "center",
    showOverflowTooltip: true,
    sortable: true,
    basicType: "transportMode"
  },
  {
    prop: "custServiceName",
    label: "后线服务员",
    minWidth: 140,
    align: "left",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "providerCode",
    label: "服务商代码",
    minWidth: 120,
    align: "left",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "providerSimpleName",
    label: "服务商简称",
    minWidth: 120,
    align: "left",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "weightCounter",
    label: "计费重单位",
    width: 120,
    sortable: true,
    align: "left",
    showOverflowTooltip: true,
    basicType: "weightCounter",
    basicTypeVal: "weightCounter",
  },
  {
    prop: "channelGroup",
    label: "渠道分组",
    width: 120,
    sortable: true,
    align: "left",
    showOverflowTooltip: true,
    basicType: "channelGroup",
    basicTypeVal: "channelGroup",
  },
  {
    prop: "status",
    label: "状态",
    dotColor: true,
    sortable: true,
    width: 80,
    align: "left",
    basicType: "status",
    basicTypeVal: "status"
  },
  {
    prop: "createBy",
    label: "创建人",
    align: "left",
    sortable: true,
    width: 120,
  },
  {
    prop: "createTime",
    label: "创建日期",
    align: "right",
    sortable: true,
    width: 160,
  },
  {
    label: "操作",
    prop: "operation",
    columnOperation: true,
    fixed: 'right',
    width: '150px'
  },
]

const EDIT_DLG_COL_1 = {
  span: 12,
  id: "code",
  label: "服务渠道代码：",
  placeholder: "此处填写服务渠道代码",
  type: "text"
}
const EDIT_DLG_COL_2 = {
  span: 12,
  id: "serviceProviderId",
  label: "所属服务商：",
  placeholder: "选择所属服务商",
  type: "autocomplete",
  httpRequest: getProviderName,
  defaultProp: {
    value: 'id',
    label: 'name'
  }
}
const EDIT_DLG_COL_3 = {
  span: 12,
  id: "nameCn",
  label: "渠道名称(CN)：",
  placeholder: "此处填写服务渠道名称(CN)",
  type: "text",
}
const EDIT_DLG_COL_4 = {
  span: 12,
  id: "nameEn",
  label: "渠道名称(EN)：",
  placeholder: "此处填写服务渠道名称(EN)",
  type: "text",
}
const EDIT_DLG_COL_5 = {
  span: 12,
  id: "simpleName",
  label: "服务渠道简称：",
  placeholder: "此处填写服务渠道简称",
  type: "text",
}
const EDIT_DLG_COL_6 = {
  span: 12,
  id: "custServiceId",
  label: "后线客服员：",
  placeholder: "选择后线客服员",
  type: "autocomplete",
  httpRequest: getCustServiceNameList,
  defaultProp: {
    value: 'id',
    label: 'nickName'
  }
}
const EDIT_DLG_COL_7 = {
  span: 12,
  id: "weightCounter",
  label: "计费重单位：",
  placeholder: "请选择",
  type: "select",
  basicType: "weightCounter",
}
const EDIT_DLG_COL_8 = {
  span: 12,
  id: "channelGroup",
  label: "渠道分组：",
  placeholder: "请选择",
  type: "select",
  basicType: "channelGroup",
}
const EDIT_DLG_COL_9 = {
  span: 12,
  id: "outWarehouseWay",
  label: "出库方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "out_warehouse_way",
  hideList: [20]
}
const EDIT_DLG_COL_10 = {
  span: 12,
  id: "transportType",
  label: "运输方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "transportMode",
  hideList: [1, 2, 4]
}
const EDIT_DLG_COL_11 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "备注信息在200字以内",
  type: "textarea"
}
const EDIT_DLG_COL_12 = {
  span: 12,
  id: "freightType",
  label: "装箱方式：",
  placeholder: "请选择装箱方式",
  type: "radio",
  basicType: "freightType",
}
const EDIT_DLG_COL_COM = [
  EDIT_DLG_COL_5,//渠道名称简称
  EDIT_DLG_COL_12,//装箱方式
  {
    ...EDIT_DLG_COL_10,
    type: "radio"
  },//运输方式
  {
    ...EDIT_DLG_COL_9,
    type: "radio"
  },//出库方式
  EDIT_DLG_COL_7,//计费重单位
  EDIT_DLG_COL_6,//后线客服员
  EDIT_DLG_COL_8,//渠道分组
  EDIT_DLG_COL_11//备注
]
const updateConfig = {
  addLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                EDIT_DLG_COL_1,//服务渠道代码
                {
                  ...EDIT_DLG_COL_2,//所属服务商
                  ...httpEnterprisetSelect({ typeList: 3 })
                },
                EDIT_DLG_COL_3,//渠道名称CN
                EDIT_DLG_COL_4,//渠道名称EN
                ...EDIT_DLG_COL_COM
              ],
            },
          ],
        },
      ],
    },
  ],
  editLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...EDIT_DLG_COL_1,
                  type: "txt",
                  placeholder: '--'
                },
                {
                  ...EDIT_DLG_COL_2,
                  ...httpEnterprisetSelect({ typeList: 3 })
                },
                {
                  ...EDIT_DLG_COL_3,
                  type: "txt",
                  placeholder: '--'
                },
                {
                  ...EDIT_DLG_COL_4,
                  type: "txt",
                  placeholder: '--'
                },
                ...EDIT_DLG_COL_COM
              ]
            }],
        },
      ],
    },
  ],
  formRules: {
    code: [
      { required: true, message: "请输入服务渠道代码", trigger: "blur" },
    ],
    serviceProviderId: [
      { required: true, message: "请输入所属服务商", trigger: "blur" },
    ],
    nameCn: [
      { required: true, message: "请输入渠道名称(CN)", trigger: "blur" },
    ],
    nameEn: [
      { required: true, message: "请输入渠道名称(EN)", trigger: "blur" },
    ],
    outWarehouseWay: [
      { required: true, message: "请选择出库方式", trigger: "change" },
    ],
    transportType: [
      { required: true, message: "请选择运输方式", trigger: "change" },
    ],
    freightType: [
      { required: true, message: "请选择装箱方式", trigger: "change" },
    ],
  }, // 表单校验规则
}


const detailColumns = [{
  ...EDIT_DLG_COL_1,
  type: "txt",
  placeholder: '--'
},
{
	span: 12,
  id: "providerName",
	label: "所属服务商：",
  type: "txt",
	txtTagArr: [{
		basicType: "status",
  	basicTypeVal: "status",
	}]
},
{
  ...EDIT_DLG_COL_3,
  type: "txt",
  placeholder: '--'
},
{
  ...EDIT_DLG_COL_4,
  type: "txt",
  placeholder: '--'
},
{
  ...EDIT_DLG_COL_12,
  type: "txt"
},
{
  ...EDIT_DLG_COL_9,
  placeholder: "--",
  type: "txt",
},
{
  ...EDIT_DLG_COL_10,
  placeholder: "--",
  type: "txt",
},
{
  ...EDIT_DLG_COL_5,
  type: "txt",
  placeholder: '--'
},
{
  span: 12,
  id: "custServiceName",
  label: "后线客服员：",
  type: "txt",
},
{
  ...EDIT_DLG_COL_7,
  placeholder: "--",
  type: "txt",
},
{
  ...EDIT_DLG_COL_8,
  placeholder: "--",
  type: "txt",
},
{
  span: 24,
  id: "remark",
  label: "备注：",
  type: "txt"
}]

export { searchColumns, tableColumns, updateConfig, detailColumns };
