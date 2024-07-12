import { formatMoney } from '@/utils/index'

const TIME_COL_1 = {
	span: 12,
  id: "exchangeRate",
  label: "购汇汇率：",
  type: "txt",
	decimal: 4
}
const TIME_COL_2 = {
	span: 12,
  id: "sdTime",
  label: "水单时间：",
  type: "txt",
}
const TIME_COL_3 = {
	span: 12,
  id: "serviceCharge",
  label: "手续费：",
  type: "txt",
	render: row => `${formatMoney(row.serviceCharge)}${row.serviceChargeCoinType || ''}`
}
const TIME_COL_4 = {
	span: 12,
  id: "exchangeLoss",
  label: "汇兑损益：",
  type: "txt",
	decimal: 4
}

export const timeFormCols = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                TIME_COL_1,
								TIME_COL_2,
								TIME_COL_3,
								TIME_COL_4,
              ]
            },
          ],
        },
      ],
    },
  ]
}