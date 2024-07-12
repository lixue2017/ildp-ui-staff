import {
  httpAllDealingCompanySelect,
  httpCompanySelect,
  httpDeptSelect,
} from "@/comModel/httpSelect";

const SEARCH_COL_2 = {
  id: "belongCustomerId",
  label: "所属公司：",
  placeholder: "请选择",
  ...httpCompanySelect({ status: "0,1,2,3,4,5", isQueryFirstDept: 1 }),
};

const SEARCH_COL_3 = {
  id: "month",
  label: "所属月份：",
  placeholder: "请选择",
  type: "month",
  valueFormat: "yyyy-MM",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  },
};

const SEARCH_COL_4 = {
  id: "expenseBillNo",
  label: "关联报销单号：",
  placeholder: "请输入",
  type: "text",
};

const SEARCH_COL_6 = {
  id: "userName",
  label: "员工名称：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_7 = {
  id: "firstLeveDeptId",
  label: "所属部门：",
  placeholder: "请输入",
  ...httpDeptSelect({isQueryFirstDept:1}),
};
const formConfig = {
  1: {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [SEARCH_COL_2, SEARCH_COL_3, SEARCH_COL_4],
              },
            ],
          },
        ],
      },
    ],
  },
  2: {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [SEARCH_COL_2, SEARCH_COL_3, SEARCH_COL_7, SEARCH_COL_6],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const getFormConfig = (row = {}) => {
  const { tName } = row;
  return formConfig[tName];
};

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};

const TABLE_COL_1 = {
  prop: "belongCustomerName",
  label: "所属公司",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "month",
  label: "月份",
  showOverflowTooltip: true,
  fixed: "left",
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_3 = {
  prop: "staffNum",
  label: "关联员工数",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_4 = {
  prop: "totleMoney",
  label: "合计金额",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_5 = {
  prop: "remark",
  label: "备注",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_6 = {
  prop: "expenseBillNo",
  label: "关联报销单号",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_7 = {
  prop: "expenseBillStatus",
  label: "报销单状态",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  fontColor:true,
  basicType: "expenseStatus",
};
const TABLE_COL_8 = {
  prop: "createBy",
  label: "创建人",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_9 = {
  prop: "createTime",
  label: "创建时间",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_10 = {
  prop: "userName",
  label: "姓名",
  showOverflowTooltip: true,
  fixed: "left",
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_11 = {
  prop: "postName",
  label: "职务",
  showOverflowTooltip: true,
  fixed: "left",
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_12 = {
  prop: "firstLeveDeptName",
  label: "一级部门",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_13 = {
  prop: "secondLeveDeptName",
  label: "二级部门",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_14 = {
  prop: "entryTime",
  label: "入职时间",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_15 = {
  prop: "basicWage",
  label: "基本工资",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_16 = {
  prop: "levelWage",
  label: "级别工资",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_17 = {
  prop: "postWage",
  label: "岗位工资",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_18 = {
  prop: "meritsWage",
  label: "绩效工资",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_19 = {
  prop: "totleWage",
  label: "合计薪资",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  className:"wage-color",
};
const TABLE_COL_20 = {
  prop: "attendanceTime",
  label: "应出勤工时",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_21 = {
  prop: "realityAttendanceTime",
  label: "实际出勤工时",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  className:"wage-color",
};
const TABLE_COL_22 = {
  prop: "realityAttendanceWage",
  label: "实际出勤工资",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_23 = {
  prop: "warehouseMeritsWage",
  label: "仓库绩效",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_24 = {
  prop: "mealAllowance",
  label: "餐补",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_25 = {
  prop: "highTemperatureSubsidy",
  label: "高温补贴",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_26 = {
  prop: "minusSickLeave",
  label: "扣病假",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_27 = {
  prop: "payableWage",
  label: "应发工资",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  className:"wage-color",
};
const TABLE_COL_28 = {
  prop: "endowmentInsurance",
  label: "养老保险",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_29 = {
  prop: "healthInsurance",
  label: "医疗保险",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_30 = {
  prop: "unemploymentInsurance",
  label: "失业保险",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_31 = {
  prop: "housingFund",
  label: "住房公积金",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_32 = {
  prop: "minusSocialSecurity",
  label: "社保补扣部分",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_33 = {
  prop: "minusHousingFund",
  label: "公积金补扣部分",
  showOverflowTooltip: true,
  minWidth: 140,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_34 = {
  prop: "personalIncomeTax",
  label: "个税",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_35 = {
  prop: "loveFund",
  label: "爱心基金",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_36 = {
  prop: "minusTotalAmount",
  label: "应减合计",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  className:"wage-color",
};
const TABLE_COL_37 = {
  prop: "realityWage",
  label: "实发工资",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  className:"wage-color",
};
const TABLE_COL_38 = {
  prop: "status",
  label: "状态",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  fontColor: true,
  fixed: "right",
  basicType: "wageStatus",
};
const TABLE_COL_39 = {
  prop: "housingSupplement",
  label: "房补",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_40 = {
  prop: "minusOther",
  label: "其他扣款",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  columnMoreOperation: true,
  minWidth: 160,
  fixed: "right",
};

export const tableConfig_1 = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_OPERATION,
];
export const tableConfig_2 = [
  TABLE_COL_INDEX,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_2,
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_14,
  TABLE_COL_15,
  TABLE_COL_16,
  TABLE_COL_17,
  TABLE_COL_18,
  TABLE_COL_19,
  TABLE_COL_20,
  TABLE_COL_21,
  TABLE_COL_22,
  TABLE_COL_23,
  TABLE_COL_24,
  TABLE_COL_39,
  TABLE_COL_25,
  TABLE_COL_26,
  TABLE_COL_27,
  TABLE_COL_28,
  TABLE_COL_29,
  TABLE_COL_30,
  TABLE_COL_31,
  TABLE_COL_32,
  TABLE_COL_33,
  TABLE_COL_34,
  TABLE_COL_35,
  TABLE_COL_40,
  TABLE_COL_36,
  TABLE_COL_37,
  TABLE_COL_38,
  // TABLE_COL_OPERATION,
];

const DIALOG_FORM_1 = {
  span: 24,
  id: "belongCustomerId",
  label: "选择公司：",
  placeholder: "请选择公司",
  ...httpCompanySelect({ status: "0,1,2,3,4,5", isQueryFirstDept: 1 }),
  type:"slot"
};
const DIALOG_FORM_2 = {
  span: 24,
  id: "month",
  label: "所属月份：",
  placeholder: "请选择所属月份",
  type: "slot",
  valueFormat: "yyyy-MM",
  pickerOptions: {
    disabledDate(time) {
      // 只能选择上个月
      let nowDate = new Date();
      let month = nowDate.getMonth() ;
      let year = nowDate.getFullYear();
      let date = new Date(year, month, 0);
      return time.getTime() < date.getTime()||time.getTime()>date.getTime()
        // const now = Date.now();
        // const minTime = now - 2 * 30 * 24 * 60 * 60 * 1000;
        // const MaxTime = now - 30 * 24 * 60 * 60 * 1000;
        // return (
        //   time.getTime() < minTime ||
        //   time.getTime() > MaxTime
        // );
    },
  },
};
const DIALOG_FORM_3 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入备注",
  type: "textarea",
  maxlength: 1000,
};

export const customDialogCols = (row = {}) => {
  return {
    title: "新增工资",
    width: "600px",
    labelWidth: "95px",
    simpleCustomCols: [
      DIALOG_FORM_1,
      DIALOG_FORM_2,
      DIALOG_FORM_3,
    ],
    formRules: {
      belongCustomerId: [
        { required: true, message: `请选择公司`, trigger: "change" },
      ],
      month: [{ required: true, message: `请选择月份`, trigger: "change" }],
    },
  };
};


const DIALOG_FORM_4 = {
  span: 24,
  id: "password",
  label: "密码：",
  placeholder: "请输入密码",
  type: "password",
};



export const uploadCheckDialogCols = (row = {}) => {
  return {
    title: "密码校验",
    width: "600px",
    labelWidth: "95px",
    simpleCustomCols: [
      DIALOG_FORM_4
    ],
    formRules: {
    },
  };
};
