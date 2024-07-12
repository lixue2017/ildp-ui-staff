import { httpUserSelect } from "@/comModel/httpSelect";
const SEARCH_COLS_1 = {
  id: "createTime",
  label: "发送时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

const SEARCH_COLS_2 = {
  id: "recipientLike",
  label: "收件人邮箱：",
  placeholder: "请输入",
  type: "text",
};

const SEARCH_COLS_3 = {
  id: "subjectLike",
  label: "模板主题：",
  placeholder: "请输入",
  type: "text",
};

// const SEARCH_COLS_4 = {
//   id: "sendStatus",
//   label: "发送状态：",
//   placeholder: "状态(默认全部)",
//   type: "select",
//   dicsStr: 'send_status',
//   customDicsArr: [1, 2]
// }

const SEARCH_COLS_5 = {
  id: "ccRecipientLike",
  label: "抄送人邮箱：",
  placeholder: "请输入",
  type: "text",
};

const SEARCH_COLS_6 = {
  id: "createUserId",
  label: "创建人：",
  ...httpUserSelect(),
};

const searchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  // SEARCH_COLS_4,
  SEARCH_COLS_5,
  SEARCH_COLS_6,
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
  label: "收件人",
  prop: "recipient",
  minWidth: 120,
  columnLink: true,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
};

const TABLE_COLS_2 = {
  label: "邮件主题",
  prop: "subject",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_3 = {
  label: "抄送人",
  prop: "ccRecipient",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_4 = {
  // label: "发送状态",
  // prop: "sendStatus",
  // minWidth: 120,
  // sortable: true,
  // dicsStr: 'send_status',
  // customDicsArr: [1, 2]
};

const TABLE_COLS_5 = {
  // label: "失败原因",
  // prop: "sendResult",
  // minWidth: 400,
  // sortable: true,
  // showOverflowTooltip: true,
};

const TABLE_COLS_6 = {
  label: "创建人",
  prop: "createUserName",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_7 = {
  label: "发送时间",
  prop: "createTime",
  width: 150,
  sortable: true,
  showOverflowTooltip: true,
};

const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  // TABLE_COLS_4,
  // TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
];

export { tableColumns, searchConfig };
