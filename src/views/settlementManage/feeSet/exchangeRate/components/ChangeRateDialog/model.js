const FORM_COLS_1 = {
  span:6,
	id: "byMonth",
	label: "统计月份：",
  placeholder: "年-月",
  type: "month",
  valueFormat: "yyyy-MM",
	clearable: false,
  pickerOptions: {
    disabledDate(time) {
			// 只能选择本月与下月
			const curData = new Date();
      const y = curData.getFullYear();
      const m = curData.getMonth();
			if (m < 11) {
				return y !== time.getFullYear() || time.getMonth() < m || time.getMonth() > m + 1;
			}
			// 上下月跨年时;
			return (y !== time.getFullYear() && y + 1 !== time.getFullYear()) ||
				(y + 1 !== time.getFullYear() && time.getMonth() < 11) ||
				(y !== time.getFullYear() && time.getMonth() > 0);
		},
  }
}

const FORM_COLS_2 = {
  span: 6,
  id: "defFunCurrency",
  label: "本位币：",
  type: "txt",
  render:(row)=>{
    const {defFunCurrencyCode,defFunCurrencyName}=row
    return `${defFunCurrencyCode}${defFunCurrencyName}`
  }
}
const FORM_COLS_3 = {
  span: 6,
  id: "defAuxCurrency",
  label: "辅助币：",
  type: "txt",
  render:(row)=>{
    const {defAuxCurrencyCode,defAuxCurrencyName}=row
    return `${defAuxCurrencyCode}${defAuxCurrencyName}`
  }
}
const FORM_COLS_4 = {
  span: 6,
  id: "customerName",
  label: "所属主体：",
  type: "txt"
}



const TABLE_COLS_1 = {
  label: "货币名称",
  prop: "currencyName",
  showOverflowTooltip: true,
}
const TABLE_COLS_2 = {
  label: "货币代码",
  prop: "currencyCode",
  align: "center",
  showOverflowTooltip: true,
}
const TABLE_COLS_3 = {
  label: "货币符号",
  prop: "currencySymbol",
  align: "center",
  showOverflowTooltip: true,
}
const TABLE_COLS_4 = {
  label: "本位币汇率",
  prop: "funCurrencyCost",
  minWidth: 125,
  customRow: true,
  showOverflowTooltip: true,
  placeholder: "对RMB汇率",
  className: "head-blue",
  align: "right"
}
const TABLE_COLS_5 = {
  label: "辅助币汇率",
  prop: "auxCurrencyCost",
  minWidth: 125,
  customRow: true,
  showOverflowTooltip: true,
  placeholder: "对USD汇率",
  className: "head-blue",
  align: "right"
}
const TABLE_COLS_6 = {
  label: "发票本位币汇率",
  prop: "funCurrencyInvoice",
  minWidth: 130,
  // customRow: true,
  showOverflowTooltip: true,
  className: "head-orange",
  placeholder: "对RMB汇率",
  align: "right"
}
const TABLE_COLS_7 = {
  label: "发票辅助币汇率",
  prop: "auxCurrencyInvoice",
  minWidth: 130,
  // customRow: true,
  showOverflowTooltip: true,
  className: "head-orange",
  placeholder: "对USD汇率",
  align: "right"
}
const TABLE_COLS_8 = {
  prop: "funCurrencyVoucher",
  label: "凭证汇率",
  minWidth: 130,
  // customRow: true,
	placeholder: "凭证汇率",
  align: "right"
}


export const config = {
  formLists: [
    FORM_COLS_1,
    FORM_COLS_2,
    FORM_COLS_3,
    FORM_COLS_4
  ],
  tableColumn: [
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
    TABLE_COLS_6,
    TABLE_COLS_7,
    TABLE_COLS_8,
		// TABLE_COLS_8
  ],
}
