import { httpUserSelect } from "@/comModel/httpSelect";
const SEARCH_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

const SEARCH_COLS_2 = {
  id: "titleLike",
  label: "模板名称：",
  placeholder: "请输入",
  type: "text",
};

const SEARCH_COLS_3 = {
  id: "subjectLike",
  label: "邮件主题：",
  placeholder: "请输入",
  type: "text",
};

const SEARCH_COLS_4 = {
  id: "stateEq",
  label: "状态：",
  placeholder: "请选择",
  type: "select",
  basicType: "status",
};

const SEARCH_COLS_5 = {
  id: "tagLike",
  label: "模板标识：",
  placeholder: "请输入",
  type: "text",
};

const SEARCH_COLS_6 = {
  id: "createUserId",
  label: "创建人：",
  ...httpUserSelect(),
};

// const SEARCH_COLS_7 = {
//   id: "mailContentLike",
//   label: "模板内容：",
//   placeholder: "请输入",
//   type: "text",
// };

// const SEARCH_COLS_8 = {
//   id: "versionNoLike",
//   label: "版本号：",
//   placeholder: "请输入",
//   type: "text",
// };

const searchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  // SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
  SEARCH_COLS_6,
  // SEARCH_COLS_7,
  // SEARCH_COLS_8,
];

const searchConfig = {
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchColumns,
            },
          ],
        },
      ],
    },
  ],
  searchNum: searchColumns.length,
};
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};

const TABLE_COLS_1 = {
  label: "模板标识",
  prop: "tag",
  minWidth: 120,
  columnLink: true,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
};

const TABLE_COLS_2 = {
  label: "模板名称",
  prop: "title",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};

// const TABLE_COLS_3 = {
//   label: "邮件业务端",
//   prop: "msgBusiness",
//   minWidth: 120,
//   sortable: true,
//   showOverflowTooltip: true,
// };

const TABLE_COLS_4 = {
  label: "邮件主题",
  prop: "subject",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_5 = {
  label: "抄送人邮箱",
  prop: "defaultCcRecipient",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};

// const TABLE_COLS_6 = {
//   label: "模板内容",
//   prop: "mailContent",
//   minWidth: 400,
//   sortable: true,
//   customRow: true,
//   showOverflowTooltip: true,
// };

const TABLE_COLS_7 = {
  label: "创建时间",
  prop: "createTime",
  width: 148,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_8 = {
  label: "创建人",
  prop: "createUserName",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_9 = {
  label: "状态",
  prop: "state",
  width: 72,
  dotColor: true,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "status",
};

const TABLE_COLS_operation = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  width: 122,
  fixed: "right",
};

const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  // TABLE_COLS_4,
  TABLE_COLS_5,
  // TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_operation,
];

const FORM_COLS_1 = {
  span: 12,
  id: "title",
  label: "模板名称：",
  placeholder: "请输入",
  type: "text",
};

const FORM_COLS_2 = {
  span: 12,
  id: "defaultCcRecipient",
  label: "抄送人邮箱：",
  placeholder: "请输入（多个使用‘|’隔开）",
  type: "text",
  maxlength: 200,
};

const FORM_COLS_3 = {
  span: 24,
  id: "subject",
  label: "邮件主题：",
  placeholder: "请输入（输入‘%s’进行转译已选参数）",
  type: "textarea",
  maxlength: 500,
};

const FORM_COLS_4 = {
  span: 12,
  id: "mailTemplateNo",
  label: "模板标识：",
  type: "txt",
};

const FORM_COLS_5 = {
  span: 24,
  id: "optionContentSlot",
  label: "可选参数：",
  type: "slot",
};

const FORM_COLS_6 = {
  span: 24,
  id: "content",
  label: "模板内容(中文)：",
  type: "slot",
};

const FORM_COLS_7 = {
  span: 12,
  id: "updateTime",
  label: "最后修改时间：",
  type: "txt",
};

const FORM_COLS_8 = {
  span: 12,
  id: "updateUserName",
  label: "最后修改人：",
  type: "txt",
};
const FORM_COLS_9 = {
  span: 24,
  id: "selectedContentSlot",
  label: "已选参数：",
  type: "slot",
};

const FORM_COLS_10 = {
  span: 24,
  id: "optionTitleSlot",
  label: "主题参数：",
  type: "slot",
};
const FORM_COLS_11 = {
  span: 24,
  id: "selectedTitleSlot",
  label: "已选主题参数：",
  type: "slot",
};

const addColumns = [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_3,
  // FORM_COLS_4,
  FORM_COLS_5,
  // FORM_COLS_9,
  FORM_COLS_6,
];

const editColumns = [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_10,
  FORM_COLS_11,
  FORM_COLS_3,
  FORM_COLS_5,
  FORM_COLS_9,
  FORM_COLS_6,
];

const detailColumns = [
  { ...FORM_COLS_1, type: "txt" },
  {
    ...FORM_COLS_2,
    type: "txt",
    placeholder: "--",
    txtTagArr: [
      {
        basicType: "status",
        basicTypeVal: "state",
      },
    ],
  },
  { span: 24, id: "subjectSlot", label: "邮件主题：", type: "slot" },
  // FORM_COLS_4,
  FORM_COLS_6,
  FORM_COLS_7,
  FORM_COLS_8,
];

const formRules = {
  title: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
  subject: [{ required: true, message: "请输入邮件主题", trigger: "blur" }],
  content: [{ required: true, message: "请输入模板内容", trigger: "blur" }],
};

const formConfig = (type) => ({
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols:
                type === 1
                  ? editColumns
                  : type === 2
                  ? editColumns
                  : detailColumns,
            },
          ],
        },
      ],
    },
  ],
  formRules: type === 1 || type === 2 ? formRules : {},
});

export { tableColumns, searchConfig, formConfig };
