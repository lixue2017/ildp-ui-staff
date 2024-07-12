import { DATA_STATUS, LEVEL } from "@/utils/mixin"
const searchColumns = [
  {
    span: 8,
    id: "beginTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    span: 8,
    id: "nameCn",
    label: "品类名称：",
    placeholder: "品类名称",
    type: "text",
  },
  {
    span: 8,
    id: "gradeStr",
    label: "级别：",
    placeholder: "级别（多选）",
    type: "select",
    multiple: true,
    options: LEVEL
  }
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "code",
    label: "编码",
    width: 150,
  },
  {
    prop: "nameCn",
    label: "品类名称(CN)",
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: "nameEn",
    label: "品类名称(EN)",
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: "declarePrice",
    label: "最低申报价",
    width: 150,
  },
  {
    prop: "customsCode",
    label: "商品海关编码",
    width: 150,
  },
  {
    prop: "grade",
    label: "级别",
    width: 50,
  },
  {
    prop: "parentCode",
    label: "上级编码",
    width: 150,
  },
  {
    prop: "parentName",
    label: "上级名称",
    width: 150,
  },
  {
    prop: "status",
    label: "状态",
    width: 80,
    customRow: true
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 200,
    fixed: 'right',
  },
  {
    prop: "createBy",
    label: "创建人",
    minWidth: 120,
    fixed: 'right',
  }
]

const treeData = [{
  id: 1,
  label: "电商订单",
  children: [{}]
},
{
  id: 2,
  label: "传统海运订单",
  children: [{}]
},
{
  id: 3,
  label: "传统空运订单",
  children: [{}]
},
{
  id: 4,
  label: "海运操作单",
  children: [{}]
},
{
  id: 5,
  label: "空运操作单",
  children: [{}]
},
{
  id: 6,
  label: "航次信息",
  children: [{ label: "离港", id: 99 }, { label: "到港", id: 98 }]
},
{
  id: 7,
  label: "堡森装柜信息",
  children: [{}]
},
{
  id: 8,
  label: "同行批次登记",
  children: [{}]
},
{
  id: 9,
  label: "拖车信息",
  children: [{}]
},
{
  id: 10,
  label: "报关信息",
  children: [{}]
},
{
  id: 11,
  label: "提单信息",
  children: [{}]
},
{
  id: 12,
  label: "清关信息",
  children: [{}]
},
{
  id: 13,
  label: "扣放货信息",
  children: [{}]
},]



const config = {
  lists: [
    {
      className: 'direction-class',
      fieldList: [
        {
          rowClassName: 'row-class',
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "GJMC",
                  label: "轨迹名称：",
                  placeholder: "请输入轨迹名称",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "KHLX",
                  label: "层级：",
                  type: "radio",
                  basicType: "trajectoryLv",
                  disable: true,
                },
                {
                  span: 24,
                  id: "GJCZY",
                  label: "节点图标：",
                  placeholder: "请选择",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "KHDW",
                  label: "类型：",
                  placeholder: "--",
                  type: "radio",
                  disable: true,
                  basicType: "trajectoryType"
                },
                {
                  span: 24,
                  id: "KH",
                  label: "节点显示(客户)：",
                  placeholder: "请输入",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "YG",
                  label: "节点显示(员工)：",
                  placeholder: "请输入",
                  type: "txt",
                },
              ],
            },
          ],
        },
        {
          rowClassName: 'row-class',
          rows: [
            {
              cols: [
                // {
                //   span: 4,
                //   labelWidth: "50px",
                //   label: "内容",
                //   type: "txt",
                // },
                // {
                //   span: 20,
                //   id: "typein",
                //   type: "radio",
                //   labelWidth: '0px',
                //   options: [
                //     { label: "默认生成", value: 0 },
                //     { label: "页面确认", value: 1 },
                //   ]
                // },
                {
                  span: 24,
                  id: "editTitle",
                  labelWidth: '0px',
                  type: "slot",
                },
                {
                  span: 24,
                  id: "remark",
                  labelWidth: '0px',
                  type: "slot",
                }
              ],
            },
          ],
        },
        {
          rowClassName: 'row-class',
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "selectTabs",
                  labelWidth: '0px',
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
    // GJMC: [
    //   { required: true, message: "请输入轨迹名称", trigger: "blur" },
    // ],
    // KHLX: [
    //   { required: true, message: "请选择层级", trigger: "change" },
    // ],
    // GJCZY: [
    //   { required: true, message: "请选择节点图标", trigger: "change" },
    // ],
    // KHDW: [
    //   { required: true, message: "请选择类型", trigger: "change" },
    // ],
    // KH: [
    //   { required: true, message: "请输入客户节点显示", trigger: "blur" },
    // ],
    // YG: [
    //   { required: true, message: "请输入员工节点显示", trigger: "blur" },
    // ],
    // remark: [
    //   { required: true, message: "请输入内容", trigger: "change" },
    // ],
  }
}
export { searchColumns, tableColumns, DATA_STATUS, treeData, config };
