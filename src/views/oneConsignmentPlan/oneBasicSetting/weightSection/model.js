import {
  httpUserSelect,
  httpLogisticsCustomerSelect,
} from "@/comModel/httpSelect";
import {
  httpCurrentWarehouseSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "nameLike",
  label: "模板名称：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "logisticsChannelIdEq",
  label: "服务商渠道：",
  placeholder: "请选择",
  ...httpLogisticsChannelListSelect(),
};
const SEARCH_COL_4 = {
  id: "warehouseMainIdEq",
  label: "关联仓库：",
  placeholder: "请选择",
  ...httpCurrentWarehouseSelect(),
};
const SEARCH_COL_5 = {
  id: "codeLike",
  label: "模板编码：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_6 = {
  id: "goodsPackTypeEq",
  label: "货物包装类型：",
  type: "select",
  placeholder: "请选择",
  basicType: "goodsPackType",
};
const SEARCH_COL_7 = {
  id: "stateEq",
  label: "状态：",
  type: "select",
  placeholder: "请选择",
  basicType: "status",
};
const SEARCH_COL_8 = {
  id: "createUserIdEq",
  label: "创建人：",
  placeholder: "请选择",
  ...httpUserSelect(),
};
const SEARCH_COL_9 = {
  id: "tempModel",
  label: "计费模式：",
  placeholder: "计费模式",
  type: "select",
  basicType: "weightSectionTempModel",
};

export const searchColumns = () => {
  const SEARCH_COLS_1 = [
    SEARCH_COL_1,
    SEARCH_COL_2,
    // SEARCH_COL_3,
    // SEARCH_COL_4,
    // SEARCH_COL_6,
    SEARCH_COL_5,
    SEARCH_COL_7,
    SEARCH_COL_9,
    SEARCH_COL_8,
  ];
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: SEARCH_COLS_1,
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COL_1 = {
  prop: "code",
  label: "模板编码",
  columnLink: true,
  sortable: true,
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "nameCn",
  label: "模板名称(CN)",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "nameEn",
  label: "模板名称(EN)",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "logisticsChannelName",
  label: "服务商渠道",
  minWidth: 110,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "goodsPackType",
  label: "货物包装类型",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "goodsPackType",
};
const TABLE_COL_6 = {
  prop: "warehouseMainName",
  label: "关联仓库",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "remark",
  label: "备注",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "createTime",
  label: "创建时间",
  sortable: true,
  width: 150,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "createUserName",
  label: "创建人",
  sortable: true,
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "state",
  label: "状态",
  dotColor: true,
  sortable: true,
  width: 80,
  basicType: "status",
};
const TABLE_COLS_11 = {
  prop: "tempModel",
  label: "计费模式",
  sortable: true,
  width: 120,
  showOverflowTooltip: true,
  basicType: "weightSectionTempModel",
};
const TABLE_COLS_12 = {
  prop: "maxWeight",
  label: "最大重量段",
  sortable: true,
  width: 120,
  showOverflowTooltip: true,
};

const TABLE_COL_99 = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: "136px",
};

const TABLE_COLS_1 = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  // TABLE_COL_4,
  // TABLE_COL_5,
  // TABLE_COL_6,
  TABLE_COLS_11,
  TABLE_COLS_12,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_99,
];

export const tableColumns = () => {
  return TABLE_COLS_1;
};

/** 详情编辑页模板 */
const EDIT_COL_1 = {
  span: 8,
  id: "code",
  label: "模板编码：",
  placeholder: "请输入",
  type: "text",
  maxlength: 20,
};
const EDIT_COL_2 = {
  span: 8,
  id: "nameCn",
  label: "模板名称(CN)：",
  placeholder: "请输入",
  type: "text",
  maxlength: 20,
};
const EDIT_COL_3 = {
  span: 8,
  id: "nameEn",
  label: "模板名称(EN)：",
  placeholder: "请输入",
  type: "text",
  maxlength: 30,
};
const EDIT_COL_4 = {
  span: 8,
  id: "goodsPackType",
  label: "货物包装类型：",
  type: "select",
  placeholder: "请选择",
  basicType: "goodsPackType",
};
const EDIT_COL_5 = {
  span: 8,
  id: "logisticsChannelId",
  label: "服务商渠道：",
  placeholder: "请选择",
  ...httpLogisticsChannelListSelect(),
};
const EDIT_COL_6 = {
  span: 8,
  id: "warehouseMainId",
  label: "关联仓库：",
  placeholder: "请选择",
  ...httpCurrentWarehouseSelect(),
};
const EDIT_COL_7 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
  maxlength: 200,
};

export const editOrDetailFormCols = (isSee) => {
  const EDIT_COLS = [
    EDIT_COL_1,
    EDIT_COL_2,
    EDIT_COL_3,
    // EDIT_COL_4,
    // EDIT_COL_5,
    // EDIT_COL_6,
    EDIT_COL_7,
  ];
  const seeKey = {
    warehouseMainId: "warehouseMainName",
    logisticsChannelId: "logisticsChannelName",
  };
  const SEE_COLS = EDIT_COLS.map((e) => {
    return {
      ...e,
      id: seeKey[e.id] || e.id,
      type: "txt",
    };
  });
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: isSee ? SEE_COLS : EDIT_COLS,
            },
          ],
        },
      ],
    },
  ];
};

const txtRules = {
  message: "此处不能输入中文",
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur",
};

export const pageFormRules = () => {
  return {
    code: [
      { required: true, message: "请输入模板编码", trigger: "blur" },
      txtRules,
    ],
    nameCn: [
      { required: true, message: "请输入模板名称(CN)", trigger: "blur" },
    ],
    nameEn: [txtRules],
    goodsPackType: [
      { required: true, message: "请选择货物包装类型", trigger: "change" },
    ],
    logisticsChannelId: [
      { required: true, message: "请选择服务商渠道", trigger: "change" },
    ],
  };
};

export const editOrDetailTableCols = (obj) => {
  const { isSee } = obj || {};
  const TABLE_COL_PAGE_201 = {
    prop: "title",
    label: "标题",
    width: 292,
    customRow: !isSee,
    request: !isSee,
    showOverflowTooltip: isSee,
    maxLength: 20,
  };
  const TABLE_COL_PAGE_202 = {
    prop: "chargingType",
    label: "计费种类",
    width: 150,
    customRow: !isSee,
    request: !isSee,
    showOverflowTooltip: isSee,
    basicType: "chargingType",
    fontColor: true,
  };
  const TABLE_COL_PAGE_203 = {
    prop: "beginWeight",
    label: "开始重量（≥）",
    width: 135,
    customRow: !isSee,
    request: !isSee,
    align: "right",
    decimal: 3,
    showOverflowTooltip: isSee,
  };
  const TABLE_COL_PAGE_204 = {
    prop: "endWeight",
    label: "截止重量段（<）",
    width: 135,
    customRow: !isSee,
    request: !isSee,
    align: "right",
    decimal: 3,
    showOverflowTooltip: isSee,
  };
  const TABLE_COL_PAGE_205 = {
    prop: "chargingSingleWeight",
    label: "计费单重",
    width: 135,
    customRow: !isSee,
    request: !isSee,
    align: "right",
    decimal: 3,
    showOverflowTooltip: isSee,
  };
  const TABLE_COL_PAGE_206 = {
    prop: "remark",
    label: "备注",
    minWidth: 150,
    customRow: !isSee,
    showOverflowTooltip: isSee,
    maxLength: 200,
  };

  return [
    {
      ...TABLE_COL_0,
      width: 36,
    },
    TABLE_COL_PAGE_201,
    TABLE_COL_PAGE_202,
    TABLE_COL_PAGE_203,
    TABLE_COL_PAGE_204,
    TABLE_COL_PAGE_205,
    TABLE_COL_PAGE_206,
    ...(isSee
      ? []
      : [
          {
            ...TABLE_COL_99,
            customRow: true,
            width: 100,
          },
        ]),
  ];
};
