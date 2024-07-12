import { DATA_STATUS, LEVEL } from "@/utils/mixin"
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
        label: "名称：",
        placeholder: "名称",
        type: "text",
    },
    {
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
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "nameCn",
        label: "名称(CN)",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "nameEn",
        label: "名称(EN)",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "sortName",
        label: "简称",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "grade",
        label: "级别",
        width: 80,
        sortable:true,
    },
    {
        prop: "parentCode",
        label: "上级编码",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "parentName",
        label: "上级名称",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "country",
        label: "国家",
        width: 150,
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
        minWidth: 120,
        sortable:true,
        fixed: 'right',
    }
]

const treeData = [{
    id: 0,
    label: '全部',
    children: [{
        id: 1,
        label: '中国',
        children: [{
            id: 11,
            label: '北京市'
        }, {
            id: 12,
            label: '天津市'
        }, {
            id: 13,
            label: '河北省'
        }, {
            id: 14,
            label: '山西省'
        }, {
            id: 15,
            label: '广东省'
        }, {
            id: 16,
            label: '内蒙古自治区'
        }]
    }, {
        id: 2,
        label: '美国',
        children: [{
            id: 21,
            label: '阿拉巴马州'
        }]
    }, {
        id: 3,
        label: '荷兰',
    }, {
        id: 4,
        label: '英国',
    }]
}]


export { searchColumns, tableColumns, DATA_STATUS, treeData };
