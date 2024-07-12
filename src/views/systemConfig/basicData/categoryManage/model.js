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
        label: "品类名称：",
        placeholder: "品类名称",
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
        sortable:true,
        width: 150,
    },
    {
        prop: "nameCn",
        label: "品类名称(CN)",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "nameEn",
        label: "品类名称(EN)",
        width: 150,
        sortable:true,
        showOverflowTooltip: true
    },
    {
        prop: "declarePrice",
        label: "最低申报价",
        width: 150,
        sortable:true,
    },
    {
        prop: "customsCode",
        label: "商品海关编码",
        width: 150,
        sortable:true,
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
    },
    {
        prop: "parentName",
        label: "上级名称",
        width: 150,
        sortable:true,
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
    label: "全部",
    children: [{
        id: 1,
        label: "摩托车&摩托车配件",
        children: [{
            id: 11,
            label: "摩托车配件"
        }]
    }, {
        id: 2,
        label: "婴儿用品",
        children: [{
            id: 21,
            label: "婴儿用具"
        }, {
            id: 22,
            label: "婴儿安全与健康"
        }, {
            id: 23,
            label: "洗护用品"
        }, {
            id: 24,
            label: "汽车安全座椅"
        }, {
            id: 25,
            label: "婴儿纸尿片"
        }, {
            id: 26,
            label: "喂哺用品"
        }]
    }, {
        id: 3,
        label: "数码相机/摄像机"
    }, {
        id: 4,
        label: "商业及工业"
    }]
}]



export { searchColumns, tableColumns, DATA_STATUS, treeData };
