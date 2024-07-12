export const config = {
  formLists: [{
    span: 6,
    id: "code",
    label: "航线代码：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "nameCn",
    label: "航线名称(CN)：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "nameEn",
    label: "航线名称(EN)：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "isPublic",
    label: "是否公共：",
    placeholder: "--",
    type: "slot",
  },
  {
    span: 6,
    id: "airlineType",
    label: "航线类型：",
    placeholder: "--",
    type: "slot",
    basicType: "transportMode",
    basicTypeVal: "type",
  },
  {
    span: 6,
    id: "remark",
    label: "备注：",
    placeholder: "--",
    type: "txt",
  }]
}