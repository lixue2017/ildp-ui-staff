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
        id: "nameCn",
        label: "国家名称：",
        placeholder: "国家名称",
        type: "text",
    },
    {
        id: "twoCode",
        label: "国家编码：",
        placeholder: "国家二字码/国家三字码",
        type: "text",
    },
    {
        id: "routeCode",
        label: "航线代码：",
        placeholder: "航线代码",
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
        prop: "nameCn",
        label: "国家名称(CN)",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "nameEn",
        label: "国家名称(EN)",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "twoCode",
        label: "国家二字码",
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "threeCode",
        label: "国家三字码",
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "number",
        label: "数字",
        sortable:true,
    },
    {
        prop: "routeCode",
        label: "航线代码",
        sortable:true,
    },
    {
        prop: "customsUrl",
        label: "需要清关资料",
        sortable:true,
        showOverflowTooltip: true,
        render: (row) => {
            const arr = row.customsUrl ? row.customsUrl.split("&") : []
            let str = ""
            arr.forEach(item => {
                str += `✓${item} `
            });
            return str
        },
        width: 150
    },
    {
        prop: "status",
        label: "状态",
        width: '80px',
        sortable:true,
        customRow: true
    },
    {
        prop: "createTime",
        label: "创建时间",
        width: '200px',
        sortable:true,
        fixed: 'right',
    },
    {
        prop: "createBy",
        label: "创建人",
        sortable:true,
        minWidth: 120,
        fixed: 'right',
    }
]


export { searchColumns, tableColumns, DATA_STATUS };
