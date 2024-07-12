import { httpUserSelect } from '@/comModel/httpSelect'
const TABLE_COL_INDEX = {
  type: 'index',
  align: "center",
  width: 50
}
const TABLE_COL_1 = {
  prop: "customerName",
  label: "公司名称",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  prop: "marktUserName",
  label: "市场订舱",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true,
  render: (row) => {
    const { marktUserName, marktUserNameUserId } = row
    return marktUserName ? `${marktUserNameUserId}(${marktUserName})` : '--'
  }
}
const TABLE_COL_3 = {
  prop: "customsClearanceUserName",
  label: "清关(交接公司)",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true,
  render: (row) => {
    const { customsClearanceUserName, customsClearanceUserId } = row
    return customsClearanceUserName ? `${customsClearanceUserId}(${customsClearanceUserName})` : '--'
  }
}
const TABLE_COL_4 = {
  prop: "warehouseIndirectCustomers",
  label: "(仓库所属公司-间接客户)",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: '第三方订单',
      prop: 'thirdPartyUserName',
      minWidth: 120,
      align: "center",
      showOverflowTooltip: true,
      className: "border-right",
      render: (row) => {
        const { thirdPartyUserName, thirdPartyUserId } = row
        return thirdPartyUserName ? `${thirdPartyUserId}(${thirdPartyUserName})` : '--'
      }
    },
    {
      label: 'FBA出库订单',
      prop: 'fbaOrderUserName',
      minWidth: 120,
      align: "center",
      showOverflowTooltip: true,
      className: "border-right",
      render: (row) => {
        const { fbaOrderUserName, fbaOrderUserId } = row
        return fbaOrderUserName ? `${fbaOrderUserId}(${fbaOrderUserName})` : '--'
      }
    },
    {
      label: '一件代发订单',
      prop: 'overseasPlatformUserName',
      minWidth: 120,
      align: "center",
      showOverflowTooltip: true,
      className: "border-right",
      render: (row) => {
        const { overseasPlatformUserName, overseasPlatformUserId } = row
        return overseasPlatformUserName ? `${overseasPlatformUserId}(${overseasPlatformUserName})` : '--'
      }
    },
    {
      label: 'WMS退仓单',
      prop: 'wmswithdrawalUserName',
      minWidth: 120,
      align: "center",
      showOverflowTooltip: true,
      className: "border-right",
      render: (row) => {
        const { wmswithdrawalUserName, wmswithdrawalUserId } = row
        return wmswithdrawalUserName ? `${wmswithdrawalUserId}(${wmswithdrawalUserName})` : '--'
      }
    },
    {
      label: '对接海外订单',
      prop: 'overseaOrderUserName',
      minWidth: 120,
      align: "center",
      showOverflowTooltip: true,
      className: "border-right",
      render: (row) => {
        const { overseaOrderUserName, overseaOrderUserId } = row
        return overseaOrderUserName ? `${overseaOrderUserId}(${overseaOrderUserName})` : '--'
      }
    },
    {
      label: '仓租订单',
      prop: 'warehouseRentUserName',
      minWidth: 120,
      align: "center",
      showOverflowTooltip: true,
      className: "border-right",
      render: (row) => {
        const { warehouseRentUserName, warehouseRentUserId } = row
        return warehouseRentUserName ? `${warehouseRentUserId}(${warehouseRentUserName})` : '--'
      }
    },
    {
      label: '海外清关订单',
      prop: 'clearanceCustomerUserName',
      minWidth: 120,
      align: "center",
      showOverflowTooltip: true,
      className: "border-right",
      render: (row) => {
        const { clearanceCustomerUserName, clearanceCustomerUserId } = row
        return clearanceCustomerUserName ? `${clearanceCustomerUserId}(${clearanceCustomerUserName})` : '--'
      }
    },
    {
      label: '海外派送订单',
      prop: 'clearanceDeliveryUserName',
      minWidth: 120,
      align: "center",
      showOverflowTooltip: true,
      className: "border-right",
      render: (row) => {
        const { clearanceDeliveryUserName, clearanceDeliveryUserId } = row
        return clearanceDeliveryUserName ? `${clearanceDeliveryUserId}(${clearanceDeliveryUserName})` : '--'
      }
    },
  ]
}
const TABLE_COL_5 = {
  prop: "childSystemUserName",
  label: "子系统接单",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true,
  className: "border-right",
  render: (row) => {
    const { childSystemUserName, childSystemUserId } = row
    return childSystemUserName ? `${childSystemUserId}(${childSystemUserName})` : '--'
  }
}
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  minWidth: 60,
  fixed: 'right',
}
export const tableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_5,
  TABLE_COL_4,
  TABLE_COL_OPERATION
]


const FORM_COLS_1 = {
  span: 24,
  id: "customerName",
  label: "堡森公司：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_2 = {
  span: 24,
  id: "marktUserNameUserId",
  label: "订舱单：",
  placeholder: "请选择",
  ...httpUserSelect({ defaultPropLabel: 'userId,userName', spellType: "kuohao" }),
  type: "slot",
}

const FORM_COLS_3 = {
  span: 24,
  id: "customsClearanceUserId",
  label: "清关单：",
  placeholder: "请选择",
  ...httpUserSelect({ defaultPropLabel: 'userId,userName', spellType: "kuohao" }),
  type: "slot"
}
const FORM_COLS_4 = {
  span: 24,
  id: "thirdPartyUserId",
  label: "第三方订单：",
  placeholder: "请选择",
  ...httpUserSelect({ defaultPropLabel: 'userId,userName', spellType: "kuohao" }),
  type: "slot"
}
const FORM_COLS_5 = {
  span: 24,
  id: "overseasPlatformUserId",
  label: "一件代发订单：",
  placeholder: "请选择",
  ...httpUserSelect({ defaultPropLabel: 'userId,userName', spellType: "kuohao" }),
  type: "slot"
}
const FORM_COLS_6 = {
  span: 24,
  id: "wmswithdrawalUserId",
  label: "WMS退仓单：",
  placeholder: "请选择",
  ...httpUserSelect({ defaultPropLabel: 'userId,userName', spellType: "kuohao" }),
  type: "slot"
}
const FORM_COLS_7 = {
  span: 24,
  id: "overseaOrderUserId",
  label: "对接海外订单：",
  placeholder: "请选择",
  ...httpUserSelect({ defaultPropLabel: 'userId,userName', spellType: "kuohao" }),
  type: "slot"
}
const FORM_COLS_8 = {
  span: 24,
  id: "warehouseRentUserId",
  label: "仓租订单：",
  placeholder: "请选择",
  ...httpUserSelect({ defaultPropLabel: 'userId,userName', spell: "kuohao" }),
  type: "slot"
}
const FORM_COLS_9 = {
  span: 24,
  id: "fbaOrderUserId",
  label: "FBA出库订单：",
  placeholder: "请选择",
  ...httpUserSelect({ defaultPropLabel: 'userId,userName', spell: "kuohao" }),
  type: "slot"
}
export const customDialogCols = () => {
  return {
    title: '修改业务员',
    width: '500px',
    labelWidth: '105px',
    simpleCustomCols: [
      FORM_COLS_1,
      FORM_COLS_2,
      FORM_COLS_3,
      FORM_COLS_4,
      FORM_COLS_9,
      FORM_COLS_5,
      FORM_COLS_6,
      FORM_COLS_7,
      FORM_COLS_8,
    ],
    // formRules: {
    //   xx_502: [
    //     { required: true, message: `请输入库存`, trigger: "blur" }
    //   ]
    // }
  }
}
