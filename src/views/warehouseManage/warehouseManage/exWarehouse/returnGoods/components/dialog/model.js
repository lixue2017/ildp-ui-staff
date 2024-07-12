import{httpGetReturnGoodsDetailLocationList ,httpGetReturnGoodsDetailTrayListVo} from "@/comModel/httpSelect.js"

const DIALOG_FORM_1 = {
  id: "slotTable",
  type: "slot",
  labelWidth: "0px",
};

const DIALOG_TABLE_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};

const DIALOG_TABLE_1 = {
  prop: "sku",
  label: "产品SKU",
  showOverflowTooltip: true,
};
const DIALOG_TABLE_2 = {
  prop: "waitReurnNum",
  label: "待还数量",
  showOverflowTooltip: true,
};
const DIALOG_TABLE_3 = {
  prop: "oldLocationId",
  label: "库位",
  customRow:true,
  fieldItem: {
    id: "oldLocationId",
    size: "mini",
    placeholder: "请选择库位",
    currData:true,
    selectLabelKey:"oldLocationCode",
    ...httpGetReturnGoodsDetailLocationList(),
  },
  showOverflowTooltip: true,
};
const DIALOG_TABLE_4 = {
  prop: "oldTrayId",
  label: "托盘",
  customRow:true,
  fieldItem: {
    id: "oldTrayId",
    size: "mini",
    placeholder: "请选择托盘",
    selectLabelKey:"oldTraySn",
    ...httpGetReturnGoodsDetailTrayListVo(),
  },
  showOverflowTooltip: true,
};
const DIALOG_TABLE_5 = {
  prop: "locationNum",
  label: "库位库存",
  showOverflowTooltip: true,
};

const DIALOG_TABLE_6 = {
  prop: "actualReturnNum",
  label: "还货数量",
  showOverflowTooltip: true,
  customRow:true,
};

export const customDialogCols = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [DIALOG_FORM_1],
          },
        ],
      },
    ],
  },
];
export const dialogTable = [
  DIALOG_TABLE_INDEX,
  DIALOG_TABLE_1,
  DIALOG_TABLE_2,
  DIALOG_TABLE_3,
  DIALOG_TABLE_4,
  DIALOG_TABLE_5,
  DIALOG_TABLE_6,
];
