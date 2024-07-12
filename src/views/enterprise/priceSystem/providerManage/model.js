import { DATA_STATUS } from '@/utils/mixin'
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
    label: "服务商代码：",
    placeholder: "服务商代码",
    type: "text",
  },
  {
    id: "name",
    label: "服务商名称：",
    placeholder: "服务商名称",
    type: "text",
  },
  {
    id: "statusList",
    label: "状态：",
    placeholder: "状态(多选)",
    type: "select",
    multiple: true,
    options: DATA_STATUS
  },
  {
    id: "serviceType",
    label: "服务商类型：",
    type: "select",
    basicType: "serviceType",
    // options: [
    //   {
    //     label: "-服务商类型-",
    //     value: "",
    //   },
    // ]
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
    label: "服务商代码",
    customRow: true,
    sortable: true,
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: "simpleName",
    label: "服务商简称",
    showOverflowTooltip: true,
    sortable: true,
    width: 120
  },
  {
    prop: "name",
    label: "服务商名称",
    showOverflowTooltip: true,
    sortable: true,
    width: 120
  },
  {
    prop: "accountCycle",
    label: "结算周期",
    width: 120,
    basicType: "accountCycle",
    basicTypeVal: "accountCycle",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    prop: "serviceType",
    label: "服务商类型",
    showOverflowTooltip: true,
    sortable: true,
    basicType: "serviceType",
    basicTypeVal: "serviceType",
    minWidth: 120
  },
  {
    prop: "status",
    label: "状态",
    sortable: true,
    customRow: true,
    width: 80
  },
  {
    prop: "createBy",
    sortable: true,
    label: "创建人",
    width: 120
  },
  {
    prop: "createTime",
    sortable: true,
    label: "创建日期",
    width: 145
  },
  {
    label: "操作",
    prop: "operation",
    customRow: true,
    fixed: 'right',
    width: 250
  },
]


const updateConfig = {
  addLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [{
                span: 12,
                id: "code",
                label: "服务商代码：",
                placeholder: "此处填写服务商代码",
                type: "text"
              },
              {
                span: 12,
                id: "simpleName",
                label: "服务商简称：",
                placeholder: "此处填写服务商简称",
                type: "text"
              },
              {
                span: 24,
                id: "name",
                label: "服务商全称：",
                placeholder: "此处填写服务商全称",
                type: "text",
              },
              {
                span: 24,
                id: "accountCycle",
                label: "结算周期：",
                type: "radio",
                basicType: "accountCycle",
              },
              {
                span: 24,
                id: "serviceType",
                label: "服务商类型：",
                type: "multiCheckbox",
                width: 122,
                basicType: "serviceType",
              },
              {
                span: 24,
                id: "companyAddr",
                label: "公司地址：",
                placeholder: "此处填写公司地址",
                type: "text",
              },
              {
                span: 24,
                id: "remark",
                label: "备注：",
                placeholder: "备注信息在200字以内",
                type: "textarea"
              }
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
              cols: [{
                span: 12,
                id: "code",
                label: "服务商代码：",
                placeholder: "此处填写服务商代码",
                type: "text",
                disable: true
              },
              {
                span: 12,
                id: "simpleName",
                label: "服务商简称：",
                placeholder: "此处填写服务商简称",
                type: "text",
                disable: true
              },
              {
                span: 24,
                id: "name",
                label: "服务商全称：",
                placeholder: "此处填写服务商全称",
                type: "text",
                disable: true
              },
              {
                span: 24,
                id: "accountCycle",
                label: "结算周期：",
                type: "radio",
                basicType: "accountCycle",
              },
              {
                span: 24,
                id: "serviceType",
                label: "服务商类型：",
                type: "multiCheckbox",
                width: 122,
                basicType: "serviceType",
              },
              {
                span: 24,
                id: "companyAddr",
                label: "公司地址：",
                placeholder: "此处填写公司地址",
                type: "text"
              },
              {
                span: 24,
                id: "remark",
                label: "备注：",
                placeholder: "备注信息在200字以内",
                type: "text"
              }],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    code: [
      { required: true, message: "请输入服务商代码", trigger: "blur" },
    ],
    simpleName: [
      { required: true, message: "请输入服务商简称", trigger: "blur" },
    ],
    name: [
      { required: true, message: "请输入服务商全称", trigger: "blur" },
    ],
  }, // 表单校验规则
}


const detailColumns = [{
  span: 12,
  id: "code",
  label: "服务商代码：",
  placeholder: "此处填写服务商代码",
  type: "text",
  disable: true
},
{
  span: 12,
  id: "simpleName",
  label: "服务商简称：",
  placeholder: "此处填写服务商简称",
  type: "text",
  disable: true
},
{
  span: 24,
  id: "name",
  label: "服务商全称：",
  placeholder: "此处填写服务商全称",
  type: "text",
  disable: true
},
{
  span: 24,
  id: "accountCycle",
  label: "结算周期：",
  type: "radio",
  basicType: "accountCycle",
  disable: true
},
{
  span: 24,
  id: "serviceType",
  label: "服务商类型：",
  type: "multiCheckbox",
  basicType: "serviceType",
  width: 122,
  disable: true
},
{
  span: 24,
  id: "companyAddr",
  label: "公司地址：",
  placeholder: "此处填写公司地址",
  type: "txt"
},
{
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "备注信息在200字以内",
  type: "txt"
}]

export { searchColumns, tableColumns, updateConfig, detailColumns };
