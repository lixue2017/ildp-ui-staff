import {
  httpWarehousePublicSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import {
  httpUserSelect,
  httpGetOdaSettings,
  httpCostTypeSelect,
} from "@/comModel/httpSelect";
import {
  logisticsProductList,
  costPartitionSchemeList,
} from "@/api/warehouse/basic";

const SEARCH_COLS_1 = {
  id: "beginTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "codeLike",
  label: "规则编码：",
  placeholder: "规则编码",
  type: "text",
};
const SEARCH_COLS_3 = {
  id: "warehouseId",
  label: "计费仓：",
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
};
const SEARCH_COLS_4 = {
  id: "logisticsProductId",
  label: "物流产品：",
  placeholder: "物流产品",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power:true,
  }),
};
const SEARCH_COLS_5 = {
  id: "costOdaSettingsId",
  label: "ODA服务：",
  placeholder: "ODA服务",
  ...httpLogisticsChannelListSelect({
    httpRequest: costPartitionSchemeList,
    stateKey: "stateEq",
    type: 2,
  }),
};
const SEARCH_COLS_6 = {
  id: "settleCostTypeId",
  label: "费用类型：",
  placeholder: "费用类型",
  ...httpCostTypeSelect({ type: 2, descs: "9" }),
};
const SEARCH_COLS_7 = {
  id: "createUserId",
  label: "创建人：",
  placeholder: "创建人",
  ...httpUserSelect(),
};
const SEARCH_COLS_8 = {
  id: "stateIn",
  label: "状态：",
  placeholder: "状态",
  type: "select",
  basicType: "costSaleOptPriceState",
  multiple: true,
};
const SEARCH_COLS_9 = {
  id: "codeLike",
  label: "ODA编码：",
  placeholder: "ODA编码",
  type: "text",
};
const SEARCH_COLS_10 = {
  id: "nameLike",
  label: "ODA名称：",
  placeholder: "ODA名称(中英文)",
  type: "text",
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "code",
  label: "规则编码",
  minWidth: 120,
  fixed: "left",
  columnLink: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "warehouseName",
  label: "计费仓",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "logisticsProductName",
  label: "物流产品",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "costOdaSettingsName",
  label: "ODA服务名称",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "settleCostTypeName",
  label: "费用类型",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "fastening",
  label: "扣件",
  minWidth: 80,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_7 = {
  prop: "customerNotification",
  label: "客户通知",
  minWidth: 100,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_8 = {
  prop: "channelSupport",
  label: "渠道支持",
  minWidth: 100,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_9 = {
  prop: "startTime",
  label: "有效开始时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "endTime",
  label: "有效结束时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "createUserName",
  label: "创建人",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "updateTime",
  label: "最后操作时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "state",
  label: "状态",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "costSaleOptPriceState",
  dotColor: true,
  fixed: "right",
};
const TABLE_COLS_14 = {
  prop: "code",
  label: "ODA编码",
  minWidth: 120,
  fixed: "left",
  columnLink: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "nameCn",
  label: "中文名称",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  prop: "nameEn",
  label: "英文名称",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  prop: "costOdaAreaCount",
  label: "匹配区域数",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_18 = {
  prop: "remark",
  label: "备注",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_20 = {
  prop: "updateUserName",
  label: "最后修改人",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 150,
  columnOperation: true,
  showOverflowTooltip: true,
  fixed: "right",
};

const ruleSearchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
  SEARCH_COLS_6,
  SEARCH_COLS_7,
  SEARCH_COLS_8,
];
const setSearchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_9,
  SEARCH_COLS_10,
  SEARCH_COLS_8,
];
const searchColumns = (tab) => ({
  ...(tab == 2
    ? {
        fold: false, // 模糊搜索是否需要展开按钮
        labelWidth: "72px",
      }
    : {}),
  searchNum: {
    1: ruleSearchColumns,
    2: setSearchColumns,
  }[tab].length,
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: {
                1: ruleSearchColumns,
                2: setSearchColumns,
              }[tab],
            },
          ],
        },
      ],
    },
  ],
});
const ruleTableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  // TABLE_COLS_9,
  // TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_12,
  TABLE_COLS_19,
  TABLE_COLS_13,
  TABLE_COLS_OPERATION,
];
const setTableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_14,
  TABLE_COLS_15,
  TABLE_COLS_16,
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_11,
  TABLE_COLS_19,
  TABLE_COLS_20,
  TABLE_COLS_12,
  TABLE_COLS_13,
  // TABLE_COLS_OPERATION
];

export { searchColumns, ruleTableColumns, setTableColumns };
