const TABLE_FILE_COL_99 = {
  label: "操作",
  prop: "operation",
  fixed: "right",
  customRow: true,
  width: 130
}

export const attachTableCols = () => {
  return [
    {
			prop: "attachSlotName",
			label: "附件资料",
			customRow: true,
			width: 450
		},
		{
			prop: "attachSlotType",
			label: "类型",
			customRow: true,
		},
    TABLE_FILE_COL_99
  ]
}