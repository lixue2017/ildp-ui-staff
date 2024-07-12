export const cardConfig = [
  {
    backgroundColor: "#ECF3FF",
    topLabel: "委托人",
    topValue: "createNickName",
    topDictVal: "",
    labelColor: "#80B1FF",
    valueColor: "#5094FF",
  },
  {
    backgroundColor: "#FFF3EC",
    topLabel: "工作单号",
    topValue: "number",
    labelColor: "#FF985C",
    valueColor: "#FF813D",
  },
  {
    title: "合计应收/应付(RMB)",
    backgroundColor: "#ECECFF",
    topLabel: "应收",
    topValue: "totalReceiveRMB",
    bottomLabel: "应付",
    bottomValue: "totalPayRMB",
    labelColor: "#B1B1FF",
    valueColor: "#7676FF",
    decimal: 2,
  },
  {
    title: "合计实收/实付(RMB)",
    backgroundColor: "#D2F1FF",
    topLabel: "实收",
    topValue: "totalRealityReceiveRMB",
    bottomLabel: "实付",
    bottomValue: "totalRealityPayRMB",
    labelColor: "#64CFFF",
    valueColor: "#13B5FF",
    decimal: 2,
  },
];

export const titleConfig = (row = {}) => {
  const { viewDetailsSource } = row;
  return {
    columnConfig: [
      // 标题左侧label，数据取值formModel
      {
        label: "创建人",
        prop: "createBy",
      },
      {
        label: "创建时间",
        prop: "createTime",
      },
      ...(viewDetailsSource == "webWarehouseOutbound"
        ? []
        : [
            {
              label: "业务员",
              prop: "salesmanName",
            },
          ]),
    ],
  };
};

const TB_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};

const TB_COL_5 = {
  label: "合计",
  prop: "totalLabelingNum",
  width: 80,
  showOverflowTooltip: true,
};
const TB_COL_6 = {
  label: "备注",
  prop: "remark",
  minWidth: 150,
  showOverflowTooltip: true,
};
const TB_COL_7 = {
  label: "附件",
  prop: "attachList",
  minWidth: 150,
  showOverflowTooltip: true,
  customRow: true,
  editCellKeyName: "temp_secondId",
  isEditEasyCell: true,
  fieldItem: {
    type: "attachList",
  },
};

export const tbTableColumns = (obj) => {
  const { cType } = obj || {};
  const TB_COL_1 = {
    label: "关联货物",
    prop: "goodsName",
    minWidth: 136,
    showOverflowTooltip: true,
  };
  const TB_COL_2 = {
    label: "单位",
    prop: "labelingType",
    width: 72,
    showOverflowTooltip: true,
    basicType: "outboundLabelingType",
  };
  const TB_COL_3 = {
    label: "贴标数量",
    prop: "labelingNumOfGoods",
    width: 82,
    showOverflowTooltip: true,
  };
  const TB_COL_4 = {
    label: "每单位贴标数量",
    prop: "labelingNumOfUnit",
    width: 108,
    showOverflowTooltip: true,
  };

  const TB_COL_8 = {
    label: "产品SKU",
    prop: "productName",
    minWidth: 136,
    showOverflowTooltip: true,
  };

  let TB_COLS_1 = [TB_COL_0];
  if (cType == 1) {
    // 整箱
    TB_COLS_1.push(TB_COL_1, TB_COL_2, TB_COL_8);
  } else {
    TB_COLS_1.push(
      {
        ...TB_COL_1,
      },
      TB_COL_2
    );
  }
  return [...TB_COLS_1, TB_COL_3, TB_COL_4, TB_COL_5, TB_COL_6, TB_COL_7];
};
