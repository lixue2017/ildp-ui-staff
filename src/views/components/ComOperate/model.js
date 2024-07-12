const prediction = [
  // {
  //   id: 'addBill',
  //   span: 24,
  //   text: '新增帐单信息',
  // },
  // {
  //   id: 'lookLog',
  //   span: 12,
  //   text: '查看日志',
  // }
];

export const config = {
  status: {
    operation: "orderStatus",
    eCommerce: "orderStatus",
    inStoragePredic: "aogStatus",
    outStoragePredic: "outStorageStatus",
    hideList: [], //原本为9，已与后端确认9为已作废状态，现已作废为99
  },
  btnList: {
    operation: [
      // {
      //   id: 'addBill',
      //   span: 24,
      //   text: '新增帐单信息',
      // },
      // {
      //   id: 'createdBill',
      //   span: 24,
      //   disabled:true,
      //   text: '生成对账单',
      // },
      // {
      //   id: 'registration',
      //   span: 12,
      //   text: '扣货登记',
      // },
      {
        id: "changeMembers",
        span: 24,
        text: "更换成员",
      },
      // {
      //   id: "dispatchVehicles",
      //   span: 24,
      //   text: "约车",
      // },
      {
        id: "nodeConfig", // 传统操作单显示
        span: 24,
        text: "节点配置",
      },
      {
        id: "estimatedDeparture",
        span: 12,
        text: "预计离港",
        nodeId: 17,
      },
      {
        id: "expectedArrival",
        span: 12,
        text: "预计到港",
        nodeId: 23,
      },
      {
        id: "editGoodsAddress",
        span: 12,
        text: "维护货物地址",
        nodeId: 44,
      },
      // {
      //   id: "changeContent",
      //   span: 24,
      //   text: "内容更改",
      //   btnType: "dropdown",
      //   dropdownArr: [
      //     {
      //       name: "收发通更换",
      //       value: "1",
      //     },
      //     {
      //       name: "内容更换",
      //       value: "2",
      //     },
      //   ],
      // },
      {
        id: "sofaTownChange",
        span: 12,
        text: "收发通更换",
      },
      {
        id: "contentChange",
        span: 12,
        text: "内容更换",
      },
      {
        id: "batchExportZip",
        span: 24,
        text: "箱单发票导出",
      },
      {
        id: "printMarks",
        span: 24,
        text: "打印唛头",
      },
      // {
      //   id: 'trackTracking',
      //   span: 12,
      //   text: '轨迹跟踪',
      // }, {
      //   id: 'lookLog',
      //   span: 12,
      //   text: '查看日志',
      // }
    ],
    eCommerce: [
      // {
      //   id: 'addBill',
      //   span: 24,
      //   text: '新增帐单信息',
      // },
      {
        id: "registration",
        span: 12,
        text: "扣货登记",
      },
      {
        id: "changeNewMembers",
        span: 12,
        text: "更换成员",
      },
    ],
    inStoragePredic: prediction,
    outStoragePredic: prediction,
  },
};

export const customInsuranceForm = () => {
  return {
    title: "保险确认",
    width: "480px",
    labelWidth: "103px",
    // labelPosition: "top",
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
                    span: 24,
                    id: "operationOrderNum",
                    label: "业务单：",
                    placeholder: "--",
                    type: "txt",
                  },
                  {
                    span: 24,
                    id: "trajectoryTime",
                    label: `轨迹跟踪时间：`,
                    placeholder: `此处填写轨迹跟踪时间`,
                    type: "datetime",
                    valueFormat: "yyyy/MM/dd hh:mm:ss",
                  },
                  {
                    span: 24,
                    id: "insureNo",
                    label: "保险单号：",
                    placeholder: "保险单号",
                    maxlength: 64,
                    type: "text",
                  },
                  {
                    span: 24,
                    id: "insuranceAttachId",
                    attachIdKeyName: "insuranceAttachId",
                    fileLabel: "上传保单",
                    labelWidth: "0px",
                    type: "customUploadFile",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      trajectoryTime: [
        { required: true, message: `请选择轨迹跟踪时间`, trigger: "change" },
      ],
      insuranceAttachId: [
        { required: true, message: "请上传保单", trigger: "change" },
      ],
    },
  };
};

const FORM_COL_1 = {
  span: 24,
  id: "estimatedTime",
  placeholder: "日期",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};

// 表单模板
export const formDlgCols = (obj) => {
  const { modelType = "departure" } = obj || {};
  const title = modelType === "arrival" ? "预计到港" : "预计离港";
  return {
    title,
    width: "520px",
    labelWidth: "105px",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  {
                    ...FORM_COL_1,
                    label: `${title}时间：`,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      estimatedTime: [
        { required: true, message: `请选择时间`, trigger: "change" },
      ],
    },
  };
};

export const soNoCols = {
  title: "登记sono",
  width: "450px",
  labelWidth: "80px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "sono",
                  label: "SO No.：",
                  placeholder: "请输入SO No.",
                  type: "text",
                  maxlength: 50,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    sono: [{ required: true, message: "请输入SO NO.", trigger: "blur" }],
  },
};
