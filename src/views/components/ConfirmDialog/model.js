import { getSizeList } from "@/api/common";
import {
  httpDeptUserSelect,
  httpAccountSubjectSelect,
  httpRoleDeptUserSelect,
  httpgetCustlist,
} from "@/comModel/httpSelect";
import overseaLangObj from "@/language/overseasLang.js";

const FORM_COL_1 = {
  span: 12,
  id: "bankAccount",
  label: "银行账号：",
  placeholder: "此处填写银行账号",
  type: "text",
};
const FORM_COL_2 = {
  span: 12,
  id: "currency",
  label: "币别：",
  placeholder: "请选择币别",
  type: "autocomplete",
  category: "currency",
  isAutoInitRequest: true,
};
const FORM_COL_3 = {
  span: 12,
  id: "openingBank",
  label: "开户行：",
  placeholder: "此处填写开户行",
  type: "text",
};
const FORM_COL_4 = {
  span: 12,
  id: "openingBankEn",
  label: "BANK NAME：",
  placeholder: "此处填写BANK NAME",
  type: "text",
};
const FORM_COL_5 = {
  span: 12,
  id: "accountName",
  label: "账号名称：",
  placeholder: "此处填写账号名称",
  maxlength: 80,
  type: "text",
};
const FORM_COL_6 = {
  span: 12,
  id: "accountNameEn",
  label: "ACCOUNT NAME：",
  placeholder: "此处填写ACCOUNT NAME",
  type: "text",
};
const FORM_COL_7 = {
  span: 24,
  id: "openAddress",
  label: "公司地址：",
  placeholder: "此处填写公司地址",
  type: "text",
};
const FORM_COL_8 = {
  span: 24,
  id: "openAddressEn",
  label: "BANK ADDRESS：",
  placeholder: "此处填写BANK ADDRESS",
  type: "text",
};
const FORM_COL_9 = {
  span: 12,
  id: "taxNumber",
  label: "纳税号：",
  placeholder: "此处填写纳税号",
};
const FORM_COL_10 = {
  span: 24,
  id: "invoiceTitle",
  label: "swift code：",
  placeholder: "此处填写swift code",
};
const FORM_COL_11 = {
  span: 12,
  id: "phone",
  label: "电话：",
  placeholder: "此处填写电话",
};
const FORM_COL_12 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "此处填写备注",
};
const FORM_COL_13 = {
  span: 3,
  id: "isDefault",
  text: "设为默认",
  type: "singleCheckbox",
};
const FORM_COL_14 = {
  span: 3,
  id: "isApplyInvoice",
  text: "是否开票",
  type: "singleCheckbox",
};

// 联系人信息
const contactsForm = {
  title: "联系人信息",
  width: "900px",
  labelWidth: "85px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "name",
                  label: "姓名：",
                  placeholder: "此处填写联系人姓名",
                  type: "text",
                },
                {
                  span: 12,
                  id: "gender",
                  label: "性别：",
                  type: "radio",
                  basicType: "gender",
                },
                {
                  span: 12,
                  id: "contactPhone",
                  label: "联系电话：",
                  placeholder: "此处填写联系电话",
                  type: "text",
                },
                {
                  span: 12,
                  id: "email",
                  label: "联系邮箱：",
                  placeholder: "此处填写联系邮箱",
                  type: "text",
                  maxlength: 255,
                },
                {
                  span: 12,
                  id: "department",
                  label: "部门：",
                  placeholder: "此处填写联系人所在部门",
                  type: "text",
                },
                {
                  span: 12,
                  id: "job",
                  label: "职务：",
                  placeholder: "此处填写联系人职务",
                  type: "text",
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注：",
                  placeholder: "此处填写备注",
                  type: "textarea",
                },
                {
                  span: 24,
                  id: "isDefault",
                  text: "设为默认",
                  type: "singleCheckbox",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    name: [{ required: true, message: "请填写姓名", trigger: "blur" }],
    gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
    contactPhone: [
      { required: true, message: "请输入联系电话", trigger: "blur" },
    ],
  },
};

const CONTACT_ADDRESS_FORM_COL_1 = {
  span: 12,
  id: "addresName",
  label: "公司名称：",
  placeholder: "此处填写公司名称",
  type: "text",
};
const CONTACT_ADDRESS_FORM_COL_2 = {
  span: 12,
  id: "addressType",
  label: "地址类型：",
  type: "radio",
  basicType: "addressType",
};
const CONTACT_ADDRESS_FORM_COL_3 = {
  span: 12,
  id: "contacts",
  label: "联系人：",
  placeholder: "此处填写联系人姓名",
  type: "text",
};
const CONTACT_ADDRESS_FORM_COL_4 = {
  span: 12,
  id: "phone",
  label: "联系电话：",
  placeholder: "此处填写联系电话",
  type: "text",
};
const CONTACT_ADDRESS_FORM_COL_5 = {
  span: 24,
  id: "detailsAddr",
  label: "详细地址：",
  placeholder: "此处填写详细地址",
  type: "textarea",
  maxlength: 255,
};
const CONTACT_ADDRESS_FORM_COL_6 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "此处填写备注",
  type: "textarea",
  maxlength: 255,
};
const CONTACT_ADDRESS_FORM_COL_7 = {
  span: 12,
  id: "isDefault",
  text: "设为默认",
  type: "singleCheckbox",
};
// 联系地址
const contactAddressForm = {
  title: "联系地址",
  width: "850px",
  labelWidth: "100px",
  className: "content-padding-20",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                CONTACT_ADDRESS_FORM_COL_1,
                CONTACT_ADDRESS_FORM_COL_2,
                CONTACT_ADDRESS_FORM_COL_3,
                CONTACT_ADDRESS_FORM_COL_4,
                CONTACT_ADDRESS_FORM_COL_5,
                CONTACT_ADDRESS_FORM_COL_6,
                CONTACT_ADDRESS_FORM_COL_7,
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    addresName: [
      { required: true, message: "请输入公司名称", trigger: "blur" },
    ],
    contacts: [{ required: true, message: "请填写联系人", trigger: "blur" }],
    phone: [{ required: true, message: "请填写联系电话", trigger: "blur" }],
    // province: [
    //   { required: true, message: "请填写省(州)", trigger: "blur" },
    // ],
    // city: [
    //   { required: true, message: "请填写城市", trigger: "blur" },
    // ],
    addressType: [
      { required: true, message: "请选择地址类型", trigger: "blur" },
    ],
    // area: [
    //   { required: true, message: "请填写区", trigger: "blur" },
    // ],
    detailsAddr: [
      { required: true, message: "请填写详细地址", trigger: "blur" },
    ],
  },
};

// 银行账号信息
const bankAccountForm = (bankObj) => {
  const BANK_COLS = [
    FORM_COL_1, //银行账号
    FORM_COL_2, //币别
    FORM_COL_3, //开户行
    FORM_COL_4, //bank name
    FORM_COL_5, //账号名称
    FORM_COL_6, //account name
    FORM_COL_10, //swift code
    FORM_COL_7, //公司地址
    FORM_COL_8, //BANK ADDRESS
    FORM_COL_9, //纳税号
    FORM_COL_11, //phone
    FORM_COL_12, //remark
    FORM_COL_13, //isDefault
    FORM_COL_14, //是否开票
  ];

  let bankFormRules = {
    bankAccount: [
      { required: true, message: "请输入银行账号", trigger: "blur" },
    ],
    openingBank: [{ required: true, message: "请输入开户行", trigger: "blur" }],
    openAddress: [
      { required: true, message: "请输入公司地址", trigger: "blur" },
    ],
    invoiceTitle: [
      { required: true, message: "swift code不能为空", trigger: "blur" },
    ],
    accountName: [
      { required: true, message: "账号名称不能为空", trigger: "blur" },
    ],
    currency: [{ required: true, message: "请选择币别", trigger: "change" }],
  };

  if (bankObj?.isSelectCustomer) {
    BANK_COLS.unshift({
      span: 24,
      id: "customerId",
      label: "所属公司：",
      placeholder: "请选择",
      ...httpgetCustlist({
        ids: bankObj?.customerIds,
      }),
      searchIdKey: "id",
    });

    bankFormRules.customerId = [
      { required: true, message: "请选择所属公司", trigger: "change" },
    ];
  }

  return {
    title: "银行账号信息",
    width: "900px",
    labelWidth: "128px",
    className: "content-padding-20",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: BANK_COLS,
              },
            ],
          },
        ],
      },
    ],
    formRules: bankFormRules,
  };
};

// 开通登录账号
const openAccountForm = {
  title: "开通登录账号",
  width: "420px",
  labelWidth: "110px",
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
                  id: "loginName",
                  label: "登录账号名：",
                  placeholder: "请设置登录账号名",
                  type: "text",
                },
                {
                  span: 24,
                  id: "password",
                  label: "登录密码：",
                  placeholder: "请设置登录账号密码",
                  type: "password",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    loginName: [
      { required: true, message: "请设置登录账号名", trigger: "blur" },
    ],
    password: [
      { required: true, message: "请设置登录账号密码", trigger: "blur" },
      {
        pattern: /^\S{6,}$/,
        message: "密码不能少于6位数",
        trigger: "blur",
      },
    ],
  },
};

// 重置登录密码
const resetPWForm = {
  title: "重置登录密码",
  width: "420px",
  className: "content-padding-20",
  labelWidth: "110px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "loginName",
                  label: "登录账号名：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "password",
                  label: "设置新密码：",
                  placeholder: "请设置登录账号密码",
                  type: "password",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    loginPW: [
      { required: true, message: "请设置登录账号密码", trigger: "blur" },
      {
        pattern: /^\S{6,}$/,
        message: "密码不能少于6位数",
        trigger: "blur",
      },
    ],
  },
};

// 审核
const verifyForm = {
  title: "审核",
  width: "450px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "nameCn",
                  label: "客户名称：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "nickName",
                  label: "负责员工：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "status",
                  label: "审核结果：",
                  type: "radio",
                  options: [
                    {
                      label: "通过",
                      value: 3,
                    },
                    {
                      label: "驳回",
                      value: 2,
                    },
                  ],
                },
                {
                  span: 24,
                  id: "auditingRemark",
                  label: "说明：",
                  type: "textarea",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    auditingRemark: [
      { required: false, message: "请填写驳回原因", trigger: "blur" },
    ],
  },
};

// 更换客户归属
export const USER_COL_FN_5 = (deptId) => {
  return {
    span: 24,
    id: "followUserId",
    label: "负责员工：",
    selectLabelKey: "userNickName",
    ...httpDeptUserSelect(deptId),
  };
};
const changeBelongForm = (obj, deptFn) => {
  const { deptId, userId } = obj || {};
  return {
    title: "更换客户归属",
    width: "450px",
    labelWidth: "120px",
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
                    id: "nameCn",
                    label: "客户名称：",
                    placeholder: "--",
                    type: "txt",
                  },
                  {
                    span: 24,
                    id: "businessOwnershipName",
                    label: "客户归属：",
                    placeholder: "--",
                    type: "txt",
                  },
                  {
                    span: 24,
                    id: "nickName",
                    label: "负责员工：",
                    placeholder: "--",
                    type: "txt",
                  },
                  {
                    span: 24,
                    id: "businessOwnership",
                    label: "新客户归属：",
                    selectLabelKey: "businessOwnershipName",
                    ...httpAccountSubjectSelect({
                      userId,
                      isQueryFirstDept: 1,
                    }),
                    handle: (val) => {
                      deptFn && deptFn(val);
                    },
                  },

                  // {
                  //   span: 24,
                  //   id: "followUserId",
                  //   label: "新负责员工：",
                  //   placeholder: "请选择负责员工",
                  //   ...httpRoleDeptUserSelect()
                  // },

                  USER_COL_FN_5(deptId),
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      businessOwnership: [
        { required: true, message: "请选择客户归属", trigger: "change" },
      ],
      followUserId: [
        { required: true, message: "请选择负责员工", trigger: "change" },
      ],
    },
  };
};

// 新增（编辑）舱位
const shippingSpaceForm = {
  title: "新增舱位",
  width: "450px",
  // labelWidth: "120px",
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
                  id: "sono",
                  label: "So No.：",
                  placeholder: "此处填写So No.",
                  type: "text",
                },
                {
                  span: 24,
                  id: "boxModelId",
                  label: "柜型：",
                  placeholder: "请选择舱位柜型",
                  type: "autocomplete",
                  httpRequest: getSizeList,
                },
                {
                  span: 24,
                  id: "isCabinRelease",
                  label: "是否放仓：",
                  placeholder: "请选择舱位柜型",
                  type: "radio",
                  options: [
                    { label: "否", value: 0 },
                    { label: "是", value: 1 },
                  ],
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注说明：",
                  placeholder: "请填写备注说明",
                  type: "textarea",
                },
                // {
                //   span: 24,
                //   id: "name",
                //   label: "航次：",
                //   placeholder: "--",
                //   type: "txt",
                // },
                // {
                //   span: 24,
                //   id: "flightName",
                //   label: "船名：",
                //   placeholder: "--",
                //   type: "txt",
                // },
                // {
                //   span: 24,
                //   id: "sailOpenTime",
                //   label: "开航期：",
                //   placeholder: "--",
                //   type: "txt",
                // },
                {
                  span: 24,
                  id: "attachId",
                  // label: "清关资料：",
                  labelWidth: "0px",
                  type: "customUploadFile",
                  disable: false,
                  detailDisplay: false, // 详情一行显示
                  noAcceptExplain: true, //详情是否显示说明文字
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    sono: [{ required: true, message: "请输入So No.", trigger: "blur" }],
    boxModelId: [
      { required: true, message: "请选择舱位柜型", trigger: "change" },
    ],
    isCabinRelease: [
      { required: true, message: "请选择是否放仓", trigger: "change" },
    ],
  },
};
// 物流轨迹时间确认
const timeConfirmForm = (timeConfig = {}) => {
  const {
    timeId = "trajectoryTime",
    timeLabel = "轨迹跟踪时间",
    remarkId = "msg",
    timeValueFormat = "yyyy/MM/dd hh:mm:ss",
  } = timeConfig;
  return {
    title: "物流轨迹时间确认",
    width: "480px",
    labelWidth: "94px",
    labelPosition: "top",
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
                    id: timeId,
                    label: `${timeLabel}：`,
                    labelWidth: "114px",
                    placeholder: `此处填写${timeLabel}`,
                    type: "datetime",
                    valueFormat: timeValueFormat,
                  },
                  {
                    span: 24,
                    id: remarkId,
                    labelWidth: "114px",
                    label: "轨迹内容：",
                    placeholder: "此处填写轨迹内容",
                    type: "textarea",
                    rows: 3,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      time: [
        { required: true, message: `请输入${timeLabel}`, trigger: "blur" },
      ],
      remark: [{ required: true, message: "请输入轨迹内容", trigger: "blur" }],
    },
  };
};

// 更换成员
const changeMembersForm = {
  title: "更换成员",
  width: "420px",
  labelWidth: "110px",
  // className: 'content-padding-20',
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "overseasOperator",
                  label: "海外操作员：",
                  ...httpRoleDeptUserSelect(),
                },
                {
                  span: 24,
                  id: "csOperator",
                  label: "长沙操作员：",
                  ...httpRoleDeptUserSelect(),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    overseasOperator: [
      { required: true, message: "请选择海外操作员", trigger: "change" },
    ],
    csOperator: [
      { required: true, message: "请选择长沙操作员", trigger: "change" },
    ],
  },
};

// 审核
const billVerifyForm = {
  title: "审核",
  width: "450px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "status",
                  label: "审核结果",
                  type: "radio",
                  options: [
                    {
                      label: "通过",
                      value: 1,
                    },
                    {
                      label: "驳回",
                      value: 2,
                    },
                  ],
                },
                {
                  span: 24,
                  id: "auditRemark",
                  label: "备注说明：",
                  type: "textarea",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    status: [{ required: true, message: "请选择审核结果", trigger: "change" }],
  },
};

// 账单确认
const billConfirmForm = {
  title: "账单审核",
  width: "450px",
  labelWidth: "100px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                // {
                //   span: 24,
                //   id: "status",
                //   label: "审核结果：",
                //   type: "radio",
                //   options: [
                //     {
                //       label: '通过',
                //       value: 0,
                //     }, {
                //       label: '驳回',
                //       value: 1,
                //     }
                //   ]
                // },
                {
                  span: 24,
                  id: "resultRemark",
                  label: "备注：",
                  type: "textarea",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    status: [{ required: true, message: "请选择审核结果", trigger: "change" }],
  },
};

// 修改跟踪号
const changeTrackNoForm = {
  title: overseaLangObj.xg_gzh || "修改跟踪号",
  width: "420px",
  labelWidth: "92px",
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
                  id: "reminder",
                  label: "",
                  labelWidth: "0",
                  content: overseaLangObj.xg_gzh_sm,
                  type: "slot",
                },
                {
                  span: 24,
                  id: "traceNumber",
                  label: `${overseaLangObj.tracking_no || "跟踪单号"}：`,
                  placeholder: "请输入",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    traceNumber: [
      { required: true, message: "请输入跟踪单号", trigger: "blur" },
    ],
  },
};

// 打回或确认说明
const repulseForm = (confObj) => {
  const {
    title = "审核驳回",
    id = "remark",
    label = "驳回说明：",
    message = "请输入驳回说明",
    rulesKye = "remark",
    maxlength,
  } = confObj || {};
  return {
    title,
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
                    id,
                    label,
                    placeholder: "请输入",
                    type: "textarea",
                    maxlength,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      [rulesKye]: [{ required: true, message, trigger: "blur" }],
    },
  };
};

export const dialogOptions = {
  contacts: contactsForm,
  contactAddress: contactAddressForm,
  bankAccount: bankAccountForm,
  openAccount: openAccountForm,
  resetPW: resetPWForm,
  verify: verifyForm,
  changeBelong: changeBelongForm,
  shippingSpace: shippingSpaceForm,
  timeConfirm: timeConfirmForm,
  changeMembers: changeMembersForm,
  billVerify: billVerifyForm,
  billConfirm: billConfirmForm,
  changeTrackNo: changeTrackNoForm,
  textareaDialog: repulseForm,
};

// 电商，传统订单编辑页面新增清关方式
export const customsClearanceMeansCols = (row = {}) => {
  const { ref } = row;
  const hideTypeLists = {
    vatClearanceListRef: [2, 3, 4],
    eoriClearanceListRef: [1, 3, 4],
    bondClearanceListRef: [1, 2],
    ClearanceAutoComplete: [],
  };
  return {
    title: "上传资料",
    width: "470px",
    labelWidth: "75px",
    isAttachFileId: true,
    uploadFormConfig: {
      uploadData: {
        attachType: "customsClearance", // 上传参数清关资料
      },
    },
    simpleCustomCols: [
      {
        span: 24,
        id: "customsClearanceType",
        label: "类型：",
        type: "radio",
        basicType: "customsClearanceMode",
        hideList: hideTypeLists[ref],
      },
      {
        span: 24,
        id: "code",
        label: "编号：",
        placeholder: "请输入清关编号",
        type: "text",
        maxlength: 50,
      },
      {
        span: 24,
        id: "remark",
        label: "说明：",
        placeholder: "请补充说明",
        type: "textarea",
        maxlength: 1000,
      },
      {
        span: 24,
        id: "attachId",
        fileLabel: "清关文件",
        labelWidth: "20px",
        type: "customUploadFile",
        uploadData: {
          attachType: "customsClearance",
        },
      },
    ],
    formRules: {
      customsClearanceType: [
        { required: true, message: "请选择类型", trigger: "change" },
      ],
      code: [{ required: true, message: "请输入清关编号", trigger: "blur" }],
      // attachId: [
      //   { required: true, message: "请上传清关文件", trigger: "change" },
      // ],
    },
  };
};
