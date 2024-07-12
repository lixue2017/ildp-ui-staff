import { toFixedNum } from "@/utils/instructions";
import { multiplicationFn } from "@/utils/instructions";

const FormColumns = [
  {
    span: 6,
    id: "phone",
    label: "司机手机号：",
    placeholder: "司机手机号",
    type: "text",
  },
  {
    span: 6,
    id: "name",
    label: "司机姓名：",
    placeholder: "司机姓名",
    type: "text",
  },
];
const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: FormColumns,
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    phone: [{ required: true, message: "请输入司机手机号", trigger: "change" }],
  },
};

export const tableColumns = (isSee) => [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    type: "selection",
    width: 50,
    align: "center",
  },
  {
    label: "Shipment ID",
    prop: "shipmentId",
    showOverflowTooltip: true,
    minWidth: 100,
  },
  {
    label: "Reference ID",
    prop: "referenceId",
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    label: "唛头",
    prop: "shippingMark",
    showOverflowTooltip: true,
    minWidth: 100,
  },
  {
    label: "箱号",
    prop: "boxNumber",
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    label: "箱数",
    prop: isSee ? "quantity" : "boxCount",
    align: "right",
    showOverflowTooltip: true,
    width: 106,
    decimal: 0,
    customRow: !isSee,
    request: !isSee,
    editCellKeyName: "temp_secondId",
    isEditEasyCell: true,
    fieldItem: {
      type: "inputNumber",
      maxNumKey: "temp_boxCount",
      minGreaterZero: true,
      requiredKeyArr: ["boxCount"],
    },
  },
  {
    label: "长*宽*高/CM",
    prop: "boxSize",
    showOverflowTooltip: true,
    minWidth: 120,
    render: (row) => {
      return `${toFixedNum(row.boxLength, 1) || 0}*${
        toFixedNum(row.boxWidth, 1) || 0
      }*${toFixedNum(row.boxHeight, 1) || 0}`;
    },
  },
  {
    label: "体积小计(m³)",
    prop: "totalVolume",
    decimal: 3,
    align: "right",
    showOverflowTooltip: true,
    width: 106,
    render: (row) =>
      multiplicationFn([row.boxVolume, row.boxCount], 3, "string"),
  },
  {
    label: "毛重小计(KG)",
    prop: "totalWeight",
    decimal: 2,
    align: "right",
    showOverflowTooltip: true,
    width: 106,
    render: (row) =>
      multiplicationFn([row.boxWeight, row.boxCount], 2, "string"),
  },
  {
    label: "收货地",
    prop: "warehouseCode",
    showOverflowTooltip: true,
    minWidth: 120,
    render: (r) => {
      return `${r.transactionWarehouseCode || "--"}/${
        r.transactionWarehouseName || "--"
      }`;
    },
  },
];
// export const grossTotal = [
//   {
//     label: "箱数：",
//     prop: "totalBoxCount",
//     decimal: 0,
//     val: 0,
//   },
//   {
//     label: "体积小计(m³)：",
//     prop: "totalVolume",
//     decimal: 2,
//     val: 0,
//   },
//   {
//     label: "毛重小计(KG)：",
//     prop: "totalWeight",
//     decimal: 2,
//     val: 0,
//   },
// ];

export { config };
