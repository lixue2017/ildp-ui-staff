import {
  httpUserSelect,
  httpPortPublicSelect,
  httpCabinetTypeSelect,
  httpRouteSelect,
  httpAirFlightSelect,
  httpHaveAirFlightSelect,
} from "@/comModel/httpSelect";
const FORM_COLS_1 = {
  id: "cutGateTime",
  label: "截关日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_2 = {
  id: "sono",
  label: "SO No.：",
  placeholder: "请输入So No.",
  type: "text",
};
const FORM_COLS_3 = {
  id: "flightName",
  label: "船名/船次：",
  placeholder: "请输入船名/船次",
  type: "text",
};
const FORM_COLS_4 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "请输入业务员",
  ...httpUserSelect(),
};
const FORM_COLS_5 = {
  id: "sailOpenTime",
  label: "开航时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_6 = {
  id: "startPort",
  label: "起运港：",
  placeholder: "请输入起运港",
  selectLabelKey: "UNCHARTED_FORM_6",
  ...httpPortPublicSelect("0"),
};
const FORM_COLS_7 = {
  id: "endPort",
  label: "目的港：",
  placeholder: "请输入目的港",
  selectLabelKey: "UNCHARTED_FORM_7",
  ...httpPortPublicSelect("0"),
};
const FORM_COLS_8 = {
  id: "boxId",
  label: "柜型：",
  placeholder: "请选择柜型",
  selectLabelKey: "UNCHARTED_FORM_8",
  ...httpCabinetTypeSelect,
};
const FORM_COLS_9 = {
  id: "routeId",
  label: "航线信息：",
  placeholder: "请选择航线信息",
  ...httpRouteSelect(),
};
const FORM_COLS_10 = {
  id: "routeNoMangeCode",
  label: "航次编码：",
  placeholder: "请输入航次编码",
  type: "text",
};
const FORM_COLS_11 = {
  id: "isCabinRelease",
  label: "放舱情况：",
  placeholder: "请选择放舱情况",
  type: "select",
  dicsStr: "web_whether",
  customDicsArr: [1, 0],
};
const FORM_COLS_12 = {
  id: "isCabinet",
  label: "做柜情况：",
  placeholder: "请选择做柜情况",
  type: "select",
  dicsStr: "web_whether",
  customDicsArr: [1, 0],
};
const FORM_COLS_13 = {
  id: "operationOrderNum",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text",
};
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "sono",
  label: "SO No.",
  minWidth: 120,
  align: "left",
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "isCabinRelease",
  label: "已放舱",
  width: 100,
  align: "center",
  sortable: true,
  dicsStr: "web_whether",
  customDicsArr: [1, 0],
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "routeNoMangeCode",
  label: "航次编号",
  width: 120,
  align: "left",
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "routeManageCode",
  label: "航线",
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "orderNum",
  label: "关联工作单号",
  align: "left",
  width: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "salesmanName",
  label: "业务员",
  align: "left",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "startPortName",
  label: "起运港",
  align: "left",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "endPortName",
  label: "目的港",
  align: "left",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "boxModelCode",
  label: "柜型",
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "cutGateTime",
  label: "截关日期",
  width: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "etaTime",
  label: "ETA",
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "isCabinet",
  label: "做柜情况",
  width: 120,
  align: "center",
  sortable: true,
  dicsStr: "web_whether",
  customDicsArr: [1, 0],
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "flightName",
  label: "船名/航名",
  width: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  prop: "routeNoMangeName",
  label: "船次/航次",
  width: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "updateTime",
  label: "最后修改时间",
  width: 140,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  prop: "createBy",
  label: "创建人",
  width: 100,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  prop: "remark",
  label: "备注",
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  width: 120,
  sortable: true,
  // customRow: true,
  columnOperation: true,
  fixed: "right",
  showOverflowTooltip: true,
};

export const ecPendApproval = () => {
  const config = {
    lists: [
      FORM_COLS_1,
      FORM_COLS_2,
      FORM_COLS_10,
      FORM_COLS_13,
      FORM_COLS_3,
      FORM_COLS_4,
      FORM_COLS_5,
      FORM_COLS_6,
      FORM_COLS_7,
      FORM_COLS_8,
      FORM_COLS_9,
      FORM_COLS_11,
      FORM_COLS_12,
    ],
    tableColumns: [
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
      TABLE_COLS_12,
      TABLE_COLS_13,
      TABLE_COLS_14,
      TABLE_COLS_15,
      TABLE_COLS_16,
      TABLE_COLS_17,
      TABLE_COLS_OPERATION,
    ],
  };
  return config;
};

const DIALOG_COLS_1 = {
  span: 24,
  id: "routeNoManageId",
  label: "关联航次：",
  isBackAll: true,
  defaultKey: "id",
  placeholder: "",
  ...httpAirFlightSelect,
};
const DIALOG_COLS_2 = {
  span: 12,
  id: "sono",
  label: "So No.：",
  placeholder: "请输入So No.",
  type: "text",
};
const DIALOG_COLS_3 = {
  span: 12,
  id: "boxModelId",
  label: "柜型：",
  placeholder: "请选择柜型",
  ...httpCabinetTypeSelect,
  defaultProp: {
    value: "id",
    label: "code",
  },
};
const DIALOG_COLS_4 = {
  span: 24,
  id: "remark",
  label: "备注说明：",
  type: "textarea",
};
const DIALOG_COLS_5 = {
  SPAN: 24,
  id: "isCabinRelease",
  label: "是否放舱：",
  placeholder: "请选择是否放舱",
  type: "radio",
  dicsStr: "web_whether",
  customDicsArr: [1, 0],
};
const DIALOG_COLS_6 = {
  span: 24,
  id: "attachId",
  fileLabel: "放舱资料",
  labelWidth: "35px",
  type: "customUploadFile",
};
export const filesUpload = (row) => {
  const { getstatus } = row;
  return {
    title: "编辑舱位",
    width: "700px",
    labelWidth: "103px",
    isAttachFileId: true,
    className: "content-padding-20",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  {
                    ...DIALOG_COLS_1,
                    getSearchOptions: getstatus,
                  },
                  DIALOG_COLS_2,
                  DIALOG_COLS_3,
                  DIALOG_COLS_4,
                  DIALOG_COLS_5,
                  DIALOG_COLS_6,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      routeNoManageId: [
        { required: true, message: `请选择关联航次`, trigger: "blur" },
      ],
      sono: [{ required: true, message: `请输入So No`, trigger: "blur" }],
      boxModelId: [{ required: true, message: `请选择柜型`, trigger: "blur" }],
      isCabinRelease: [
        { required: true, message: `请选择是否放舱`, trigger: "blur" },
      ],
      // attachId: [
      //   { required: true, message: `请传入附件`, trigger: "blur" }
      // ],
    },
  };
};
