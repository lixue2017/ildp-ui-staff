
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}
const TABLE_COLS_1 = {
  prop: "country",
  label: "国家",
  minWidth: 120,
  fixed: "left",
  showOverflowTooltip: true,
  render: (row) => {
    const { nameCn, nameEn } = row.country || {}
    return `${nameCn}/${nameEn}`
  }
}
const TABLE_COLS_2 = {
  prop: "province",
  label: "省/州",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "city",
  label: "府/城市",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COLS_4 = {
  prop: "startPostalCode",
  label: "邮编",
  minWidth: 100,
  showOverflowTooltip: true
}
const TABLE_COLS_5 = {
  prop: "endPostalCode",
  label: "结束邮编",
  minWidth: 100,
  showOverflowTooltip: true
}
const TABLE_COLS_6 = {
  prop: "postalType",
  label: "邮编类型",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "postalType"
}
const TABLE_COLS_7 = {
  prop: "postalDeliveryArea",
  label: "邮域",
  minWidth: 140,
  showOverflowTooltip: true
}
const TABLE_COLS_8 = {
  prop: "countryType",
  label: "整个国家ODA",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "countryOda"
}
const TABLE_COLS_9 = {
  prop: "settleCostType",
  label: "ODA类型",
  minWidth: 200,
  showOverflowTooltip: true,
  render: (row) => {
    const { cnName, costCode } = row.settleCostType || {}
    return cnName || costCode ? `${cnName || '--'}[${costCode || ' --'}]` : '--'
  }
}
const TABLE_COLS_10 = {
  prop: "matchingType",
  labelTop: "匹配类型",
  labelBottom: "(用于邮编类型：加拿大邮编)",
  minWidth: 200,
  headerTopBottom: true,
  showOverflowTooltip: true,
  basicType: "odaMatchingType"
}
export const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10
]