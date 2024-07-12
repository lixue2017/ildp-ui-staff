import overseaLangObj from "@/language/overseasLang.js";

const PRINT_SEARCH_COL_1 = {
  span: 6,
  id: "orderSn",
  label: `工作单号：`,
  placeholder: "工作单号/拣货单号",
  type: "text",
};
const PRINT_SEARCH_COL_2 = {
  span: 6,
  id: "sku",
  label: `SKU：`,
  placeholder: "请输入",
  type: "text",
};
const PRINT_SEARCH_COL_3 = {
  span: 12,
  id: "isReprint",
  text: "重新打印（勾选后可打印已扫描数据）",
  labelWidth: "10px",
  type: "singleCheckbox",
};

export const printSearchColumns = (options = []) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                PRINT_SEARCH_COL_1,
                // PRINT_SEARCH_COL_2,
                PRINT_SEARCH_COL_3,
                // {
                //   span: 6,
                //   id: "printerName",
                //   label: `打印机名称：`,
                //   placeholder: "请选择",
                //   type: "select",
                //   options,
                // },
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const formRules = {
  // type: [{ required: true, message: "请选择类型", trigger: "change" }],
  // search: [{ required: true, message: "请输入工作单号", trigger: "blur" }],
};

const PRINT_TABLE_COL_0 = {
  type: "index",
  width: 50,
  // fixed: "left",
  align: "center",
};
const PRINT_TABLE_COL_1 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 130,
  showOverflowTooltip: true,
};
const PRINT_TABLE_COL_2 = {
  prop: "trackSn",
  label: overseaLangObj.tracking_no_fn("包裹跟踪号"),
  showOverflowTooltip: true,
  minWidth: 140,
};
const PRINT_TABLE_COL_3 = {
  prop: "sku",
  label: overseaLangObj.cp_sku || "产品SKU",
  minWidth: 130,
  showOverflowTooltip: true,
};
const PRINT_TABLE_COL_4 = {
  label: overseaLangObj.cp_name || "产品名称",
  prop: "cpmName",
  showOverflowTooltip: true,
  minWidth: 100,
};
const PRINT_TABLE_COL_5 = {
  prop: "xx_t_5",
  label: overseaLangObj.tp_bh || "托盘编号",
  minWidth: 130,
  showOverflowTooltip: true,
};
const PRINT_TABLE_COL_6 = {
  prop: "xx_t_6",
  label: overseaLangObj.sz_qq("所在区域"),
  minWidth: 130,
  showOverflowTooltip: true,
};
const PRINT_TABLE_COL_7 = {
  prop: "xx_t_7",
  label: overseaLangObj.kw_location("所在库位"),
  minWidth: 130,
  showOverflowTooltip: true,
};
const PRINT_TABLE_COL_8 = {
  prop: "customerShortName",
  label: overseaLangObj.kh_customer_name || "客户名称",
  minWidth: 130,
  showOverflowTooltip: true,
};
const PRINT_TABLE_COL_9 = {
  prop: "printLableSign",
  label: "扫描状态",
  showOverflowTooltip: true,
  minWidth: 140,
  customRow: true,
};
const PRINT_TABLE_COL_10 = {
  prop: "printLableTime",
  label: "扫描时间",
  showOverflowTooltip: true,
  minWidth: 140,
};
const PRINT_TABLE_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  // fixed: "right",
  width: 80,
};
export const printTableColumns = () => {
  return [
    PRINT_TABLE_COL_0,
    PRINT_TABLE_COL_1,
    PRINT_TABLE_COL_2,
    PRINT_TABLE_COL_3,
    PRINT_TABLE_COL_4,
    // PRINT_TABLE_COL_5,
    // PRINT_TABLE_COL_6,
    // PRINT_TABLE_COL_7,
    PRINT_TABLE_COL_8,
    PRINT_TABLE_COL_9,
    PRINT_TABLE_COL_10,
    PRINT_TABLE_COL_99,
  ];
};
