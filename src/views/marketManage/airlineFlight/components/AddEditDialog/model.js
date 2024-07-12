import {
  httpPortPublicSelect,
  httpEnterprisetSelect,
  httpHaveAirFlightSelect,
  httpRouteSelect,
  shipCompanyList,
} from "@/comModel/httpSelect.js";
const txtRules = {
  message: "此处不能输入中文",
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur",
};

const EDIT_FORM_COL_1 = {
  span: 12,
  id: "flightName",
  label: "已有航班名：",
  isBackAll: true,
  labelWidth: "120px",
  placeholder: "请选择已有航班名",
  ...httpHaveAirFlightSelect(),
};
const EDIT_FORM_COL_2 = {
  span: 12,
  id: "nbsp",
  type: "slot",
};
const EDIT_FORM_COL_3 = {
  span: 12,
  id: "flightByName",
  label: "船名/航班名：",
  placeholder: "此处填写船名/航班名",
  type: "text",
};

const EDIT_FORM_COL_4 = {
  span: 12,
  id: "name",
  label: "船次/航次：",
  placeholder: "此处填写船次/航次",
  type: "text",
};
const EDIT_FORM_COL_5 = {
  span: 12,
  id: "route",
  label: "航线信息：",
  placeholder: "请选择航线信息",
  isBackAll: true,
  defaultKey: "id",
  ...httpRouteSelect({ status: 1 }),
};
const EDIT_FORM_COL_6 = {
  span: 12,
  id: "cabinProxyId",
  label: "订舱代理：",
  placeholder: "请选择订舱代理",
  type: "autocomplete",
  defaultKey: "id",
  ...httpEnterprisetSelect({ typeList: "0,3" }), //替换成公共接口，之前是单独接口传了一堆参数替换后不知道会不会有问题
};
const EDIT_FORM_COL_7 = {
  span: 12,
  id: "shipCompany",
  label: "航空/船公司：",
  isBackAll: true,
  placeholder: "请选择航空/船公司",
  ...shipCompanyList(),
};
const EDIT_FORM_COL_8 = {
  span: 12,
  id: "sailOpenTime",
  label: "ETD：",
  placeholder: "年/月/日",
  type: "date",
};
const EDIT_FORM_COL_9 = {
  span: 12,
  id: "cabinOpenTime",
  label: "开舱日期：",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const EDIT_FORM_COL_10 = {
  span: 12,
  id: "cutGateTime",
  label: "截关日期：",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const EDIT_FORM_COL_11 = {
  span: 12,
  id: "etaTime",
  label: "ETA：",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const EDIT_FORM_COL_12 = (typeList) => ({
  span: 12,
  id: "startPort",
  label: "起运港：",
  placeholder: "请选择起运港",
  labelWidth: "120px",
  ...httpPortPublicSelect(typeList),
});
const EDIT_FORM_COL_13 = (typeList) => ({
  span: 12,
  id: "endPort",
  label: "目的港：",
  placeholder: "请选择目的港",
  labelWidth: "120px",
  ...httpPortPublicSelect(typeList),
});
const EDIT_FORM_COL_14 = {
  span: 12,
  id: "transfer",
  label: "中转港：",
  placeholder: "请选择中转港",
  labelWidth: "120px",
  ...httpPortPublicSelect(),
};

const EDIT_FORM_COL_15 = {
  span: 12,
  id: "sono",
  label: "SO No.：",
  placeholder: "此处填写SO No.",
  type: "text",
};

const EDIT_FORM_COL_16 = {
  span: 12,
  id: "sameIndustryProxyId",
  label: "同行代理：",
  placeholder: "请选择同行代理",
  type: "autocomplete",
  defaultKey: "id",
  ...httpEnterprisetSelect({ typeList: "0,3" }), //替换成公共接口，之前是单独接口传了一堆参数替换后不知道会不会有问题
};

const EDIT_FORM_COL_TABLE = {
  className: "margin-bottom-0",
  rows: [
    {
      cols: [
        {
          span: 24,
          id: "tableData",
          labelWidth: "0",
          type: "slot",
        },
      ],
    },
  ],
};
const EDIT_FORM_COL_REMARK = {
  rows: [
    {
      cols: [
        {
          span: 24,
          labelWidth: "60px",
          label: "备注说明",
          type: "txt",
          className: "custom-remark",
        },
        {
          span: 24,
          id: "remark",
          labelWidth: "0",
          placeholder: "备注说明",
          type: "textarea",
          rows: 3,
          maxlength: 200,
        },
      ],
    },
  ],
};

export const config = (row = {}) => {
  const { isFlight, changeFlightName, ids, lineType } = row;
  let typeList = "0,1,2,3,4";
  if (lineType || lineType === 0) {
    typeList = lineType;
  }
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  {
                    ...EDIT_FORM_COL_1,
                    handle: changeFlightName,
                  }, //已有航班名
                  EDIT_FORM_COL_5, //航线信息
                  EDIT_FORM_COL_12(typeList), //起运港
                  EDIT_FORM_COL_13(typeList), //目的港
                  EDIT_FORM_COL_3, //船名/航班名
                  {
                    ...EDIT_FORM_COL_6,
                    ...httpEnterprisetSelect({
                      typeList: "0,3",
                      ids,
                      isQueryFirstDept: 1,
                    }),
                    selectLabelKey: "cabinProxyName",
                  }, //订舱代理
                  EDIT_FORM_COL_16, //同行代理
                  EDIT_FORM_COL_4, //船次/航次
                  EDIT_FORM_COL_7, //航空/船公司
                  EDIT_FORM_COL_9, //开舱日期
                  EDIT_FORM_COL_10, //截关日期
                  EDIT_FORM_COL_8, //开航期,原型为ETD，就用开航期
                  EDIT_FORM_COL_11, //ETA
                  // EDIT_FORM_COL_2,//占位符
                  // EDIT_FORM_COL_14,//中转港
                ],
              },
            ],
          },
          ...(isFlight ? [] : [EDIT_FORM_COL_TABLE]),
          EDIT_FORM_COL_REMARK,
        ],
      },
    ],
    editLists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  EDIT_FORM_COL_5, //航线信息
                  EDIT_FORM_COL_2, //占位符
                  EDIT_FORM_COL_12(typeList), //起运港
                  EDIT_FORM_COL_13(typeList), //目的港
                  EDIT_FORM_COL_4, //船次/航次
                  {
                    ...EDIT_FORM_COL_6,
                    ...httpEnterprisetSelect({
                      typeList: "0,3",
                      ids,
                      isQueryFirstDept: 1,
                    }),
                    selectLabelKey: "cabinProxyName",
                  }, //订舱代理
                  EDIT_FORM_COL_16, //同行代理
                  EDIT_FORM_COL_3, //船名/航班名
                  EDIT_FORM_COL_7, //航空/船公司
                  EDIT_FORM_COL_8, //开航期,原型为ETD，就用开航期
                  EDIT_FORM_COL_11, //ETA
                  EDIT_FORM_COL_9, //开舱日期
                  EDIT_FORM_COL_10, //截关日期
                  // EDIT_FORM_COL_14,//中转港
                ],
              },
            ],
          },
          // EDIT_FORM_COL_TABLE,
          EDIT_FORM_COL_REMARK,
        ],
      },
    ],

    traditionLists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  {
                    ...EDIT_FORM_COL_1,
                    handle: changeFlightName,
                  }, //已有航班名
                  EDIT_FORM_COL_2,
                  {
                    ...EDIT_FORM_COL_3,
                    basicType: "orderType",
                    basicTypeVal: "flightByName",
                    type: "slot",
                  },
                  EDIT_FORM_COL_4,
                  EDIT_FORM_COL_5,
                  EDIT_FORM_COL_6,
                  EDIT_FORM_COL_7,
                  EDIT_FORM_COL_15,
                  EDIT_FORM_COL_8,
                  EDIT_FORM_COL_9,
                  EDIT_FORM_COL_10,
                  EDIT_FORM_COL_11,
                  EDIT_FORM_COL_12(typeList),
                  EDIT_FORM_COL_13(typeList),
                  EDIT_FORM_COL_14,
                ],
              },
            ],
          },
          EDIT_FORM_COL_TABLE,
          EDIT_FORM_COL_REMARK,
        ],
      },
    ],
    formRules: {
      shipCompany: [
        { required: true, message: "请输入航空/船公司", trigger: "change" },
      ],
      cabinProxyId: [
        { required: true, message: "请选择订舱代理", trigger: "change" },
      ],
      flightByName: [
        { required: true, message: "请输入船名/航班名", trigger: "change" },
        txtRules,
      ],
      sono: [{ required: true, message: "请输入SO No.", trigger: "change" }],
      name: [
        { required: true, message: "请输入船次/航次", trigger: "change" },
        txtRules,
      ],
      sailOpenTime: [
        { required: true, message: "请选择ETD", trigger: "change" },
      ],
      etaTime: [{ required: true, message: "请选择ETA", trigger: "change" }],
      endPort: [{ required: true, message: "请选择目的港", trigger: "change" }],
      startPort: [
        { required: true, message: "请选择起运港", trigger: "change" },
      ],
    },
  };
};
