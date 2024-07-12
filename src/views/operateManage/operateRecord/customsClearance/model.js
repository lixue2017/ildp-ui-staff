import * as comModel from "../components/recordModel";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import {
  httpRoleDeptUserSelect,
  httpCustomerSelect,
  httpEnterprisetSelect,
} from "@/comModel/httpSelect";
import overseaLangObj from "@/language/overseasLang.js";

const EDIT_COL_1 = {
  span: 12,
  id: "overseasOperator",
  selectLabelKey: "overseasOperatorName",
  label: "海外操作员：",
  ...httpRoleDeptUserSelect(),
};
const EDIT_COL_2 = {
  span: 12,
  id: "csOperator",
  selectLabelKey: "csOperatorName",
  label: "长沙操作员：",
  ...httpRoleDeptUserSelect(),
};
const EDIT_COL_3 = {
  span: 12,
  id: "nlCode",
  label: "清关单号：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_4 = {
  span: 12,
  id: "mblNum",
  label: "MBL号：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_5 = {
  span: 12,
  id: "ontainerSno",
  label: "柜号：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_6 = {
  span: 12,
  id: "bailorPeople",
  label: "委托人：",
  type: "txt",
};
const EDIT_COL_7 = {
  span: 12,
  id: "tradeClause",
  labelWidth: "0",
  type: "slot",
  basicType: "tradeClause",
};
const EDIT_COL_8 = {
  id: "pdo",
  span: 12,
  label: "DO：",
  placeholder: "DO",
  type: "select",
  basicType: "do",
};
const EDIT_COL_9 = {
  id: "pod",
  span: 12,
  label: "POD：",
  placeholder: "POD",
  type: "select",
  basicType: "pod",
};
const EDIT_COL_10 = {
  id: "customsBroker",
  selectLabelKey: "customsBrokerCode",
  span: 12,
  label: "清关行：",
  placeholder: "清关行",
  ...httpCustomerSelect({ clientIdentity: 3 }),
};
const EDIT_COL_11 = {
  span: 12,
  id: `declareTime`,
  label: "申报日期：",
  placeholder: "此处选择申报日期",
  type: "date",
  valueFormat: "yyyy/MM/dd",
};
const EDIT_COL_12 = {
  span: 24,
  id: "customsClearanceRemark",
  label: "备注说明：",
  placeholder: "此处填写备注说明",
  type: "textarea",
};
const EDIT_COL_13 = {
  span: 12,
  id: "agentType",
  label: "海外代理类型：",
  type: "slot",
  basicType: "overseasAgencyType",
};
const EDIT_COL_14 = {
  span: 12,
  id: "businessNnitName",
  label: "业务单位：",
  type: "txt",
};
const EDIT_COL_15 = {
  span: 12,
  id: "agent",
  label: "海外代理：",
  ...httpEnterprisetSelect(),
  type: "slot",
};
const EDIT_COL_16 = {
  span: 12,
  id: "overseasOperator",
  // selectLabelKey: "csOperatorName",
  label: "操作员：",
  ...httpRoleDeptUserSelect(),
};
const EDIT_COL_17 = {
  span: 12,
  id: `reachTime`,
  label: "ETA：",
  placeholder: "请选择",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const EDIT_COL_18 = {
  span: 12,
  id: `departureTime`,
  label: "ETD：",
  placeholder: "此处选择ETD",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const EDIT_COL_SLOT = {
  span: 24,
  type: "slot",
};
// 编辑弹窗
export const editDialogForm = () => {
  return {
    columns: [
      {
        ...EDIT_COL_SLOT,
        labelWidth: "0px",
        id: "tips",
      },
      EDIT_COL_13, //海外代理类型
      EDIT_COL_6, //委托人
      EDIT_COL_15, //海外代理
      EDIT_COL_14, //业务单位
      // EDIT_COL_7,
      EDIT_COL_3, //清关单号
      EDIT_COL_16,
      EDIT_COL_4, //MBL单号
      EDIT_COL_8, //DO
      EDIT_COL_5, //箱号
      EDIT_COL_9, //POD
      EDIT_COL_10, //报关行
      EDIT_COL_17, //ETA
      EDIT_COL_11, //申报日期
      EDIT_COL_18, //ETD
      EDIT_COL_12, //备注说明
    ],
    formRules: {
      customsBroker: [
        { required: true, message: "请选择报关行", trigger: "change" },
      ],
      nlCode: [
        { required: true, message: "请输入清关单号", trigger: "change" },
      ],
      reachTime: [{ required: true, message: "请选择ETA", trigger: "change" }],
      ontainerSno: [{ required: true, message: "请输入柜号", trigger: "blur" }],
    }, // 表单校验规则
  };
};

export const dynamicVerifice = {
  // 电子发票邮箱必填，纸质发票运费方式必填
  agent: [{ required: true, message: "请选择海外代理", trigger: "change" }],
};
const WAREHOUSE_COLS_1 = {
  span: 12,
  id: "nlCode",
  label: "NL编号：",
  type: "txt",
  labelWidth: "76px",
};
const WAREHOUSE_COLS_2 = {
  span: 12,
  id: "operationOrderNo",
  label: "工作单号：",
  type: "txt",
};
const WAREHOUSE_COLS_3 = {
  span: 12,
  id: "bailorPeopleName",
  label: "委托人：",
  type: "txt",
  labelWidth: "76px",
};
const WAREHOUSE_COLS_4 = {
  span: 12,
  id: "operationMainName",
  label: "客户所属公司：",
  type: "txt",
};
const WAREHOUSE_COLS_5 = (salesman) => ({
  span: 12,
  id: "putWarehousing",
  label: "入库仓：",
  isBackAll: true,
  ...httpWarehousePublicSelect({
    typeList: "2",
    isHaveComId: 1,
    flagAvailable: "h",
    salesman,
    permissionType: 2,
  }),
  labelWidth: "76px",
});
const WAREHOUSE_COLS_6 = {
  span: 12,
  id: "splitBoxTime",
  label: "拆柜预约：",
  placeholder: "拆柜预约时间",
  type: "datetime",
  valueFormat: "yyyy/MM/dd HH:mm:ss",
};
const WAREHOUSE_COLS_7 = {
  span: 12,
  id: "customsTrailer",
  label: "拖车行：",
  placeholder: "拖车行",
  ...httpCustomerSelect({ clientIdentity: 3 }),
  labelWidth: "76px",
};
const WAREHOUSE_COLS_8 = {
  span: 12,
  id: "businessNnitName",
  label: "海外业务单位：",
  type: "txt",
};
const WAREHOUSE_COLS_9 = {
  span: 24,
  id: "boxRemark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
  labelWidth: "76px",
  maxlength: 500,
};

// 入仓登记弹窗
export const warehouseDlgForm = (type = 0, salesman) => ({
  columns: [
    WAREHOUSE_COLS_1,
    WAREHOUSE_COLS_2,
    WAREHOUSE_COLS_3,
    WAREHOUSE_COLS_4,
    WAREHOUSE_COLS_5(salesman),
    [
      WAREHOUSE_COLS_6,
      {
        ...WAREHOUSE_COLS_6,
        label: "预计入仓时间：",
        placeholder: "预计入仓时间",
      },
    ][type],
    ...(type == 1 ? [WAREHOUSE_COLS_7] : []),
    WAREHOUSE_COLS_8,
    WAREHOUSE_COLS_9,
  ],
  formRules: {
    putWarehousing: [
      { required: true, message: "请选择入库仓", trigger: "change" },
    ],
    splitBoxTime: [
      { required: true, message: "请选择拆柜预约时间", trigger: "change" },
    ],
  }, // 表单校验规则
});
// 审核查验弹窗
export const examineDlgForm = (isCheckTime = true) => {
  let examineCols = [
    {
      span: 24,
      id: "isReject",
      label: "查验结果：",
      type: "radio",
      value: 0, // 默认值
      options: [
        {
          label: "放行登记",
          value: 0,
        },
        // {
        //   label: '打回登记',
        //   value: 1,
        // }
      ],
    },
  ];
  if (isCheckTime) {
    examineCols.push({
      span: 24,
      id: "trajectoryTime",
      label: "海关放行日期：",
      placeholder: "此处选择放行日期",
      type: "datetime",
      valueFormat: "yyyy/MM/dd HH:mm:ss",
    });
  }
  return {
    columns: [
      ...examineCols,
      // {
      //   span: 24,
      //   id: "examineNum",
      //   label: "查验信息：",
      //   type: "slot",
      //   placeholder: '查验数量'
      // },
      {
        span: 24,
        id: "msg",
        label: "备注说明：",
        placeholder: "此处填写备注说明",
        type: "textarea",
      },
    ],
    formRules: {
      isReject: [
        { required: true, message: "请选择查验结果", trigger: "blur" },
      ],
      trajectoryTime: [
        { required: true, message: "请选择放行日期", trigger: "blur" },
      ],
    }, // 表单校验规则
  };
};
// 拖车登记/拖车结束 弹窗
export const trailerDlgForm = (trailerType = 0) => {
  const TRAILER_DLG_COL = [
    {
      id: "releaseTime",
      label: "拖车登记时间：",
      placeholder: "此处选择拖车登记时间",
    },
    {
      id: "endReleaseTime",
      label: "拖车结束时间：",
      placeholder: "此处选择拖车结束时间",
    },
  ];
  const REMARK_ID_COL = ["trailerStartRemark", "trailerEndRemark"];
  return {
    columns: [
      {
        type: "date",
        ...TRAILER_DLG_COL[trailerType],
        span: 24,
      },
      {
        span: 24,
        id: REMARK_ID_COL[trailerType],
        label: "备注说明：",
        placeholder: "此处填写备注说明",
        type: "textarea",
      },
    ],
    formRules: {
      releaseTime: [
        { required: true, message: "请选择拖车登记时间", trigger: "blur" },
      ],
      endReleaseTime: [
        { required: true, message: "请选择拖车结束时间", trigger: "blur" },
      ],
    }, // 表单校验规则
  };
};
// 详情/查验登记 弹窗
export const inspectionDlgForm = () => {
  return {
    columns: [
      {
        span: 24,
        id: "checkStartTime",
        label: "查验登记时间：",
        placeholder: "此处选择查验登记时间",
        type: "datetime",
        valueFormat: "yyyy/MM/dd HH:mm:ss",
      },
      {
        span: 24,
        id: "checkEndTime",
        label: "查验结束时间：",
        placeholder: "此处选择查验结束时间",
        type: "datetime",
        valueFormat: "yyyy/MM/dd HH:mm:ss",
      },
      {
        span: 24,
        id: "remark",
        label: "备注说明：",
        placeholder: "此处填写备注说明",
        type: "textarea",
      },
    ],
    formRules: {
      checkStartTime: [
        { required: true, message: "请选择查验登记时间", trigger: "change" },
      ],
      checkEndTime: [
        { required: true, message: "请选择查验结束时间", trigger: "change" },
      ],
    }, // 表单校验规则
  };
};

//交接信息表格共用COLS
const handoverDetailCols = [
  {
    prop: "customerCode",
    label: overseaLangObj.kh_customer("委托人编码"),
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    prop: "bailorPeople",
    label: overseaLangObj.wtr_customer || "委托人",
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    prop: "vatNo",
    label: "VAT No.",
    minWidth: 160,
    showOverflowTooltip: true,
  },
  {
    prop: "eoriNo",
    label: "EORI No.",
    minWidth: 160,
    showOverflowTooltip: true,
  },
  {
    prop: "customsClearanceType",
    label: overseaLangObj.qg_fs || "清关方式",
    // customRow: true,
    width: 80,
    basicType: "customsClearanceType",
  },
  {
    prop: "orderOperationNum",
    label: overseaLangObj.gz_dh || "工作单号",
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    prop: "remark",
    label: overseaLangObj.bz_info || "备注信息",
    minWidth: 150,
    showOverflowTooltip: true,
  },
  // {
  //   prop: "realFreightCount",
  //   label: "件数",
  //   showOverflowTooltip: true
  // },
  // {
  //   prop: "realFreightWeight",
  //   label: "重量(KG)",
  //   decimal: 2,
  //   width: 120,
  //   showOverflowTooltip: true
  // },
  // {
  //   prop: "realFreightVolume",
  //   label: "体积(CBM)",
  //   decimal: 2,
  //   width: 120,
  //   showOverflowTooltip: true
  // },
  // {
  //   prop: "isCheck",
  //   label: "是否查验",
  //   minWidth: 80,
  //   render: row => row.isCheck ? '是' : '否'
  // },
  // {
  //   prop: "checkStartTime",
  //   label: "查验时间",
  //   minWidth: 130,
  //   showOverflowTooltip: true
  // },
  // {
  //   prop: "checkEndTime",
  //   label: "查验结束时间",
  //   minWidth: 130,
  //   showOverflowTooltip: true
  // },
  {
    prop: "businessUnitName",
    label: overseaLangObj.yw_unit || "业务单位",
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    prop: "operatorName",
    label: overseaLangObj.czy_operator || "操作员",
    minWidth: 100,
    showOverflowTooltip: true,
  },
];
const DOVER_COLS_1 = {
  prop: "xdfp",
  label: overseaLangObj.xd_fp || "箱单发票",
  minWidth: 80,
  customRow: true,
};
const DOVER_COLS_2 = {
  prop: "hblzl",
  label: overseaLangObj.hbl_zl || "HBL资料",
  minWidth: 80,
  customRow: true,
};
const DOVER_COLS_3 = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: "right",
  width: "80px",
};

export const tableDetailCols = (orderType) => {
  if (orderType == 2) {
    //电商
    return [
      {
        prop: "indexSlot",
        width: 60,
        align: "center",
        customRow: true,
      },
      ...handoverDetailCols,
      DOVER_COLS_1,
      DOVER_COLS_2,
      // DOVER_COLS_3
    ];
  } else {
    //传统订单
    return [
      {
        type: "index",
        width: 50,
        align: "center",
      },
      ...handoverDetailCols,
      DOVER_COLS_2,
      // DOVER_COLS_3
    ];
  }
};

const DETAIL_COL_201 = {
  span: 6,
  id: "createTime",
  label: "交接日期：",
  type: "txt",
};
const DETAIL_COL_202 = {
  span: 6,
  id: "ontainerSno",
  label: `${overseaLangObj.xh_container_no || "箱号"}：`,
  type: "txt",
};
const DETAIL_COL_203 = {
  span: 6,
  id: "pdo",
  label: "DO：",
  basicType: "do",
  fontColor: true,
  type: "txt",
};
const DETAIL_COL_204 = {
  span: 6,
  id: "flightName",
  label: `${overseaLangObj.carrier_vessel || "船名/航名"}：`,
  type: "txt",
};
const DETAIL_COL_205 = {
  span: 6,
  id: "customsBrokerName",
  label: `${overseaLangObj.qgh_customs_clearance || "清关行"}：`,
  oneLineTipLabel: true,
  type: "txt",
};
const DETAIL_COL_206 = {
  span: 6,
  id: "boxModelName",
  label: `${overseaLangObj.gx_gl || "柜型柜量"}：`,
  type: "txt",
};
const DETAIL_COL_207 = {
  span: 6,
  label: "POD：",
  id: "pod",
  basicType: "pod",
  fontColor: true,
  type: "txt",
};
const DETAIL_COL_208 = {
  span: 6,
  id: "voyageNumber",
  label: `${overseaLangObj.voyage_flight || "船次/航次"}：`,
  type: "txt",
};
const DETAIL_COL_209 = {
  span: 6,
  id: "declareTime",
  label: `${overseaLangObj.sb_rq_date || "申报日期"}：`,
  type: "txt",
};
const DETAIL_COL_210 = {
  span: 6,
  id: "putWarehousing",
  label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
  type: "txt",
};
const DETAIL_COL_211 = {
  span: 6,
  id: "splitBoxTime",
  label: `${overseaLangObj.un_locker_reservation || "拆柜预约"}：`,
  oneLineTipLabel: true,
  type: "txt",
};
const DETAIL_COL_212 = {
  span: 6,
  id: "customsReleaseTime",
  label: `${overseaLangObj.customs_release_date || "海关放行日期"}：`,
  oneLineTipLabel: true,
  type: "txt",
};
const DETAIL_COL_213 = {
  span: 6,
  id: "airlineCompanyName",
  label: `${overseaLangObj.cgs_hk_gs || "船/航空公司"}：`,
  type: "txt",
};

export const detailInfoCols = [
  {
    ...DETAIL_COL_201,
    span: 8,
  },
  // {
  //   span: 8,
  //   id: "businessUnit",
  //   label: "业务单位：",
  //   placeholder: "--",
  //   type: "txt"
  // },
  {
    span: 8,
    id: "operatorName",
    label: "交接操作人：",
    type: "txt",
  },
  {
    ...DETAIL_COL_205,
    span: 8,
  },
  {
    span: 8,
    id: "overseasOperatorName",
    label: "海外操作员：",
    type: "txt",
  },
  {
    span: 8,
    id: "csOperatorName",
    label: "长沙操作员：",
    type: "txt",
  },
  {
    ...DETAIL_COL_206,
    span: 8,
  },
  {
    ...DETAIL_COL_209,
    span: 8,
  },
  {
    ...DETAIL_COL_212,
    span: 8,
  },
  {
    span: 24,
    id: "remark",
    label: "交接备注：",
    type: "txt",
  },
  {
    span: 24,
    id: "customsClearanceRemark",
    label: "清关备注：",
    type: "txt",
  },
  // {
  //   span: 24,
  //   id: "attachId",
  //   label: "清关资料：",
  //   type: "customUploadFile",
  //   disable: true,
  //   detailDisplay: true
  // }
];

export const warehousingCols = [
  {
    ...DETAIL_COL_210,
    span: 12,
  },
  {
    ...DETAIL_COL_211,
    span: 12,
  },
  {
    span: 24,
    id: "boxRemark",
    label: "备注：",
    placeholder: "--",
    type: "txt",
  },
];

export const trailerCols = [
  //通过操作单ID查询，字段变更
  {
    span: 8,
    id: "code",
    label: "拖车编号：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "shortName",
    label: "拖车公司：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "deliveryTime",
    label: "要求送达时间：",
    placeholder: "--",
    type: "txt",
    labelWidth: "105px",
  },
  {
    span: 8,
    id: "slotQyd",
    label: "起运地：",
    type: "slot",
  },
  {
    span: 8,
    id: "slotMdi",
    label: "目的地：",
    type: "slot",
  },
  {
    span: 24,
    id: "shipperName",
    label: "起运地址：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 24,
    id: "consigneeName",
    label: "目的地址：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 24,
    id: "trailerRemark",
    label: "备注信息：",
    placeholder: "--",
    type: "txt",
  },
];

export const detailFromCols = (type = 0) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                // DETAIL_COL_201, // 交接日期
                DETAIL_COL_202, // 箱号
                DETAIL_COL_203, // DO
                DETAIL_COL_207, // POD
                DETAIL_COL_204, // 船名/航名
                DETAIL_COL_205, // 清关行
                DETAIL_COL_206, // 柜型柜量
                DETAIL_COL_213, // 船/航空公司
                DETAIL_COL_208, // 船次/航次
                DETAIL_COL_209, // 申报日期
                DETAIL_COL_210, // 入库仓
                DETAIL_COL_211, // 拆柜预约
                DETAIL_COL_212, //海关放行日期
                // {
                //   span: 6,
                //   id: "ETATime",
                //   label: "ETA：",
                //   labelWidth: "78px",
                //   type: "txt",
                // },
                // {
                //   span: 6,
                //   id: "aimCountry",
                //   label: "目的国：",
                //   labelWidth: "66px",
                //   type: "slot"
                // }
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const clearanceFiles = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "attachId",
                  label: "MBL资料：",
                  type: "customUploadFile",
                  labelWidth: "90px",
                  disable: true,
                  detailDisplay: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};
