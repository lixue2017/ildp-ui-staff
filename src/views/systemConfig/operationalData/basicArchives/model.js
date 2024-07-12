import { DATA_STATUS, LEVEL } from "@/utils/mixin";
import { getBasicArchivesTreeList } from "@/api/operationalData";
const searchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd",
  },
  {
    id: "name",
    label: "字典值：",
    placeholder: "字典值",
    type: "text",
  },
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    showOverflowTooltip: true,
  },
  {
    prop: "type",
    label: "字典类型",
    width: 96,
    showOverflowTooltip: true,
  },
  // {
  //   prop: "code",
  //   label: "CODE",
  //   width: 150,
  //   showOverflowTooltip: true
  // },
  {
    prop: "value",
    label: "数值(value)",
    minWidth: 118,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "nameCn",
    label: "字典值(CN)",
    minWidth: 130,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "nameEn",
    label: "字典值(EN)",
    minWidth: 130,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "code",
    label: "CODE",
    width: 90,
    showOverflowTooltip: true,
  },
  // {
  //   prop: "explains",
  //   label: "说明",
  //   width: 50,
  //   showOverflowTooltip: true
  // },
  {
    prop: "expandVal",
    label: "拓展值",
    width: 90,
    showOverflowTooltip: true,
  },
  {
    prop: "remark",
    label: "备注",
    width: 120,
    className: "wrap-cell-remark",
    // customRow: true,
    // showOverflowTooltip: true
  },
  {
    prop: "serialNo",
    label: "顺序号",
    width: 82,
    sortable: true,
  },
  {
    prop: "status",
    label: "状态",
    width: 60,
    basicType: "normalShutdown",
    dotColor: true,
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 133,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "createBy",
    label: "创建人",
    width: 76,
    showOverflowTooltip: true,
  },
  {
    label: "操作",
    prop: "operation",
    // customRow: true,
    columnOperation: true,
    // fixed: 'right',
    width: 86,
  },
];

const dictionaryType = {
  columns: [
    {
      span: 24,
      id: "name",
      label: "类型名称：",
      placeholder: "此处填写类型名称",
      type: "text",
      maxlength: 80,
    },
    {
      span: 24,
      id: "type",
      label: "字典类型：",
      placeholder: "此处填写字典类型",
      type: "text",
      maxlength: 80,
    },
  ],
  formRules: {
    name: [{ required: true, message: "请填写类型名称", trigger: "blur" }],
    // type: [
    //   { required: true, message: "请填写字典类型", trigger: "blur" },
    // ],
  }, // 表单校验规则
};

const dataDictionary = {
  columns: [
    {
      span: 24,
      id: "type",
      label: "类型名称：",
      placeholder: "请选择字典类型",
      type: "autocomplete",
      defaultKey: "id",
      isBackAll: true,
      httpRequest: (params) =>
        getBasicArchivesTreeList({
          name: params.nameCn,
          pageNum: 1,
          pageSize: 9999,
        }),
      getCustomData: (item, dics) => {
        const title = item.name;
        return {
          key: item.id,
          label: title,
          value: item.id,
          title: title,
        };
      },
    },
    {
      span: 24,
      id: "value",
      label: "数值(value)：",
      placeholder: "此处填写数值(value)",
      type: "text",
      maxlength: 80,
    },
    {
      span: 24,
      id: "nameCn",
      label: "字典值(CN)：",
      placeholder: "此处填写字典值(CN)",
      type: "text",
      maxlength: 80,
    },
    {
      span: 24,
      id: "nameEn",
      label: "字典值(EN)：",
      placeholder: "此处填写字典值(EN)",
      type: "text",
      maxlength: 80,
    },
    {
      span: 24,
      id: "code",
      label: "CODE：",
      placeholder: "请输入",
      type: "text",
    },
    {
      span: 24,
      id: "expandVal",
      label: "拓展值：",
      placeholder: "此处填写拓展值",
      type: "text",
    },
    {
      span: 24,
      id: "serialNo",
      label: "顺序号：",
      placeholder: "此处填写顺序号",
      type: "text",
      inputType: "number",
    },
    {
      span: 24,
      id: "remark",
      resize: "vertical",
      label: "备注：",
      placeholder: "此处填写备注",
      type: "textarea",
    },
  ],
  formRules: {
    type: [{ required: true, message: "请选择字典类型", trigger: "change" }],
    nameCn: [{ required: true, message: "请填写字典值(CN)", trigger: "blur" }],
  }, // 表单校验规则
};

export {
  searchColumns,
  tableColumns,
  DATA_STATUS,
  dictionaryType,
  dataDictionary,
};
