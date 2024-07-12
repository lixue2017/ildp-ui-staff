const Add_FOEM_COL_1 = {
  span: 24,
  id: "code",
  label: "航线代码：",
  placeholder: "请输入航线代码",
  type: "text",
}
const Add_FOEM_COL_2 = {
  span: 24,
  id: "lineType",
  label: "航线类型：",
  placeholder: "请选择航线类型",
  basicType: 'transportMode',
  type: "radio",
  hideList:[4]
}
const Add_FOEM_COL_3 = {
  span: 24,
  id: "nameCn",
  label: "航线组名称(CN)：",
  placeholder: "请输入航线组名称(CN)",
  type: "text",
}
const Add_FOEM_COL_4 = {
  span: 24,
  id: "nameEn",
  label: "航线组名称(EN)：",
  placeholder: "请输入航线组名称(EN)",
  type: "text",
}
const Add_FOEM_COL_5 = {
  span: 24,
  id: "routeCode",
  label: "航线路径编码：",
  placeholder: "请输入航线路径编码",
  type: "text",
}
const Add_FOEM_COL_6 = {
  span: 24,
  id: "isPublic",
  label: "是否公共：",
  placeholder: "请选择航次信息是否公共",
  type: "radio",
  options:[
    {label:"否",value:"0"},
    {label:"是",value:"1"}
  ]
}
const Add_FOEM_COL_7 = {
  span: 24,
  labelWidth: "120px",
  label: "备注说明:",
  type: "txt",
  className: "custom-remark"
}
const Add_FOEM_COL_8 = {
  span: 24,
  id: "remark",
  labelWidth: "120px",
  placeholder: "备注说明（最多200字）",
  type: "textarea",
  maxlength: 200,
  rows: 3
}


export const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                Add_FOEM_COL_1,
                Add_FOEM_COL_2,
                Add_FOEM_COL_3,
                Add_FOEM_COL_4,
                Add_FOEM_COL_5,
                Add_FOEM_COL_6,
              ],
            },
          ],
        },
        {
          rows: [
            {
              cols: [
                Add_FOEM_COL_7,
                Add_FOEM_COL_8
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    code: [
      { required: true, message: "请输入航线代码", trigger: "change" },
    ],
    lineType: [
      { required: true, message: "请输入航线类型", trigger: "change" },
    ],
    nameCn: [
      { required: true, message: "请输入航线组名称(CN)", trigger: "change" },
    ],
    nameEn: [
      { required: true, message: "请输入航线组名称(EN)", trigger: "change" },
    ],
  }
}
