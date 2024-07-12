import { getUserList } from "@/api/common"
import { getContactsPublicList } from "@/api/publicInterface/index.js"
import { httpWarehousePublicSelect, httpDeliveryChannelSelect } from '@/comModel/warehouse'
const searchLists = [
    {
        id: "beginTime",
        label: "创建时间：",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        type: "daterange",
        valueFormat: "yyyy-MM-dd"
    },
    {
        id: "companyName",
        label: "创建来源客户：",
        placeholder: "创建来源客户",
        type: "autocomplete",
        searchParamName: 'companyNameCn',
        httpRequest: getUserList,
        defaultProp: {
            value: 'companyNameCn',
            label: 'companyNameCn'
        },
        labelWidth: "120px"
    },
    {
        id: "number",
        label: "订单编号：",
        placeholder: "订单编号",
        type: "text",
    },
    {
        id: "deliveryWarehouseid",
        label: "发货仓：",
        placeholder: "请选择发货仓",
        ...httpWarehousePublicSelect({ itemId: "id" }),
    },
    {
        id: "deliveryChannelid",
        label: "派送方式：",
        placeholder: "请选择",
        ...httpDeliveryChannelSelect()
    },
    {
        id: "receivingWarehouseid",
        label: "收件人：",
        placeholder: "请选择收件人",
        type: "autocomplete",
        searchParamName: 'orderSearch',
        labelWidth: "120px",
        httpRequest: (params) => getContactsPublicList({ ...params, typeList: 0 }),
        getCustomData: (item) => {
            return {
                key: item.id,
                label: `${item.name}(${item.phone})`,
                value: item.id,
                title: `${item.name}(${item.phone})/${item.company}`,
                subtitle: `${item.address}`
            }
        }
    },
    {
        id: "state",
        label: "状态：",
        placeholder: "状态（多选）",
        type: "select",
        multiple: true,
        basicType: 'outStorageStatus'
    },
]
const searchColumns = {
    searchNum: searchLists.length,
    lists: [
        {
            className: "search-form-width",
            fieldList: [
                {
                    rows: [
                        {
                            cols: searchLists,
                        },
                    ],
                },
            ],
        },
    ]
};

const tableColumns = [
    {
        type: "index",
        width: 50,
        align: "center",
    },
    {
        label: "订单编号",
        prop: "number",
        customRow: true,
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        label: "保险服务",
        prop: "insurance",
        customRow: true,
        minWidth: 80
    },
    {
        label: "发货仓(海外仓)",
        prop: "deliveryWarehouse",
        showOverflowTooltip: true,
        minWidth: 130,
        render: row => row.deliveryWarehouse ? `${row.deliveryWarehouse.code}/${row.deliveryWarehouse.name}` : '--'
    },
    {
        label: "收件人",
        prop: "contacts",
        showOverflowTooltip: true,
        minWidth: 130,
        render: (rows) => {
            return `${rows.contacts}(${rows.phone})`
        }
    },
    {
        label: "派送渠道",
        prop: "deliveryChannel",
        showOverflowTooltip: true,
				minWidth: 120,
				render: r => `${r.tcode}[${r.tname}]`
    },
    {
        label: "产品类型",
        prop: "productType",
        width: 80
    },
    {
        label: "产品总数",
        prop: "productTotal",
        minWidth: 100,
        align: "right"
    },
    {
        label: "产品信息",
        prop: "product",
        customRow: true,
        showOverflowTooltip: true,
        width: 80,
        basicType: 'productSituation',
        basicTypeVal: "foreignExportParam"
    },
    {
        label: "订单备注",
        prop: "orderRemark",
        showOverflowTooltip: true
    },
    {
        label: "状态",
        prop: "status",
        customRow: true,
        width: 100,
        basicType: 'outStorageStatus'
    },
    {
        label: "委托人",
        prop: "createNickName",
        showOverflowTooltip: true
    },
    {
        label: "创建时间",
        prop: "createTime",
        width: 180
    },
]

export { searchColumns, tableColumns };
