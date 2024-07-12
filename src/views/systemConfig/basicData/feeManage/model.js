import { DATA_STATUS } from "@/utils/mixin"
const searchColumns = [
    {
        id: "beginTime",
        label: "创建时间：",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        type: "daterange",
        valueFormat: "yyyy-MM-dd"
    },
    {
        id: "code",
        label: "费用代码：",
        placeholder: "费用代码",
        type: "text",
    },
    {
        id: "nameCn",
        label: "费用名称：",
        placeholder: "费用名称",
        type: "text",
    },
    {
        id: "describes",
        label: "描述：",
        placeholder: "描述",
        type: "text",
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
        label: "费用代码",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "nameCn",
        label: "费用名称(CN)",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "nameEn",
        label: "费用名称(EN)",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "describes",
        label: "描述",
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "status",
        label: "状态",
        width: 80,
        sortable:true,
        customRow: true
    },
    {
        prop: "createTime",
        label: "创建时间",
        width: 200,
        sortable:true,
        fixed: 'right',
    },
    {
        prop: "createBy",
        label: "创建人",
        width: 120,
        sortable:true,
        fixed: 'right',
    }
]



export { searchColumns, tableColumns, DATA_STATUS };
