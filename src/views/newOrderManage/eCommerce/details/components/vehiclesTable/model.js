export const reservationTable = {
  title: "预约信息",
  grossTotal: [
    {
      label: "件数总数：",
      prop: "totalQuantity",
      decimal: 0,
    },
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      prop: "phone",
      label: "司机手机号",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      prop: "name",
      label: "司机姓名",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      prop: "code",
      label: "预约码",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      prop: "entryDate",
      label: "预约入仓时间",
      minWidth: 160,
      showOverflowTooltip: true,
    },
    {
      prop: "carType",
      label: "车型",
      minWidth: 100,
      basicType: "orderReservationWarehousingCarType",
      showOverflowTooltip: true,
    },
    {
      prop: "licensePlate",
      label: "车牌",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      prop: "orderNumber",
      label: "工作单",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      prop: "warehouseCode",
      label: "入库仓",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      prop: "number",
      label: "件数",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      prop: "unloading",
      label: "卸货人",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      prop: "unloadingPhone",
      label: "卸货人手机号",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      prop: "state",
      label: "状态",
      minWidth: 100,
      basicType: "orderReservationWarehousingState",
      showOverflowTooltip: true,
    },
    {
      prop: "record",
      label: "运输记录",
      minWidth: 100,
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 100,
      showOverflowTooltip: true,
    },
  ],
};
