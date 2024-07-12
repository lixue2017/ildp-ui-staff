export const checkboxOptions = (tName) => {
  return [
    {
      value: 0,
      label: tName === "2" ? "应付" : "个人",
    },
    {
      value: 1,
      label: tName === "2" ? "应收" : "部门",
    },
    ...(tName == 2
      ? []
      : [
          {
            value: 10,
            label: "内部单",
          },
        ]),
  ];
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};

const TABLE_COLS_1 = {
  prop: "type",
  label: "类型",
  width: 80,
  sortable: true,
  // customRow: true,
  fontColor: true, //表格字体颜色
  showOverflowTooltip: true,
  basicType: "departmentDic",
};
const TABLE_COLS_2 = {
  prop: "deptName",
  label: "配置部门",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "appointUserName",
  label: "配置人员",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "levelName30",
  label: "一级审核人",
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "levelName20",
  label: "二级审核人",
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "levelName10",
  label: "三级审核人",
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "levelName1",
  label: "总经理",
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "levelName110",
  label: "出纳经理",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "levelName100",
  label: "财务经理",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "levelName11",
  label: "总经理",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "deptMainName",
  label: "所属公司",
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_201 = {
  prop: "identityName",
  label: "往来单位类型",
  sortable: true,
  width: 125,
  align: "center",
  // render: (r) => (r.rulesType ? ["堡森", "个人"][r.rulesType - 1] : "--"),
};
const TABLE_COL_202 = {
  prop: "type",
  label: "类型",
  sortable: true,
  fontColor: true,
  width: 80,
  basicType: "billType",
};
const TABLE_COL_203 = {
  prop: "obj",
  label: "对象",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_204 = {
  prop: "appointUserName",
  label: "指定审核人",
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => {
    const { isAppoint, appointUser, user } = row;
    if(isAppoint==1){
      return appointUser
    }else{
      return user
    }
  },
};
const TABLE_COL_205 = {
  prop: "remark",
  label: "备注",
  sortable: true,
  minWidth: 180,
  showOverflowTooltip: true,
};

const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
  columnOperation: true,
  fixed: "right",
};

export const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_OPERATION,
];

export const tableBillColumns = () => {
  return [
    TABLE_COLS_INDEX,
    TABLE_COL_201,
    TABLE_COL_202,
    TABLE_COL_203,
    TABLE_COL_204,
    TABLE_COL_205,
    TABLE_COLS_OPERATION,
  ];
};
