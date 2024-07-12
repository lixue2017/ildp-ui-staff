import * as comModel from '../../editTrailer/model.js'
import { httpCustomerSelect } from '@/comModel/httpSelect'
const FORM_COL_DLG_1 = {
  id: "operationOrderNum",
  label: "工作单号：",
  placeholder: "--",
  labelWidth: "102px",
  span: 8,
  type: "txt"
}
const FORM_COL_DLG_2 = {
  id: "shipCompany",
  label: "船公司：",
  placeholder: "--",
  labelWidth: "102px",
  span: 8,
  type: "txt"
}
const FORM_COL_DLG_3 = {
  id: "shipName",
  label: "船名/ 航次：",
  labelWidth: "102px",
  span: 8,
  type: "txt",
  render: row => `${row.shipName || '--'}/${row.shipSecond || '--'}`
}
const FORM_COL_DLG_4 = {
  id: "boxCode_obj",
  label: "整柜信息：",
  placeholder: "此处选择整柜信息",
  labelWidth: "102px",
  span: 8,
  type: "txt",
}
const FORM_COL_DLG_5 = {
  id: "cabinOpenTime",
  label: "开舱日期：",
  placeholder: "--",
  labelWidth: "102px",
  span: 8,
  type: "txt"
}
const FORM_COL_DLG_6 = {
  id: "cutGateTime",
  label: "截关日期：",
  placeholder: "--",
  labelWidth: "102px",
  span: 8,
  type: "txt"
}
const FORM_COL_DLG_7 = {
  id: "sono",
  label: "SO No.：",
  placeholder: "--",
  labelWidth: "102px",
  span: 8,
  type: "txt"
}
const FORM_COL_DLG_8 = {
  span: 8,
  id: "totalWeight",
  label: "货物预计重量：",
  labelWidth: "102px",
  placeholder: "--",
  type: "txt"
}
const FORM_COL_DLG_9 = {
  span: 8,
  id: "ontainerSno",
  label: "箱号：",
  placeholder: "--",
  labelWidth: "102px",
  type: "text"
}
const FORM_COL_DLG_10 = {
  span: 8,
  id: "pickBoxId",
  label: "提货地点：",
  labelWidth: "102px",
  placeholder: "--",
  type: "txt"
}
const FORM_COL_DLG_11 = {
  span: 8,
  id: "returnBoxId",
  label: "还柜地点：",
  labelWidth: "102px",
  placeholder: "--",
  type: "txt"
}
const FORM_COL_DLG_12 = {
  span: 8,
  id: "sealingStripSno",
  label: "封号：",
  labelWidth: "102px",
  placeholder: "--",
  type: "text"
}
const FORM_COL_DLG_13 = {
  id: "trailerRowId",
  label: "拖车行：",
  labelWidth: "102px",
  placeholder: "拖车行",
  span: 8,
  ...httpCustomerSelect({ clientIdentity: 3 })
}
const FORM_COL_DLG_14 = {
  span: 16,
  id: "dispatchRemark",
  label: "调度备注：",
  labelWidth: "102px",
  placeholder: "此处填写调度备注",
  type: "text",
}
const FORM_COL_DLG_15 = {
  id: "slotGoodsAddress",
  labelWidth: "0px",
  seeDiffSlot: true,
  span: 24,
  type: "slot"
}
const FORM_COL_DLG_16 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  labelWidth: "65px",
  placeholder: "此处填写备注信息",
  type: "textarea",
  disable:true
}
export const config = () => {
  console.log('formCols', comModel)

  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COL_DLG_1,
                FORM_COL_DLG_2,
                FORM_COL_DLG_3,
                FORM_COL_DLG_4,
                FORM_COL_DLG_5,
                FORM_COL_DLG_6,
                FORM_COL_DLG_7,
                FORM_COL_DLG_8,
                FORM_COL_DLG_9,
                FORM_COL_DLG_10,
                FORM_COL_DLG_11,
                FORM_COL_DLG_12,
                FORM_COL_DLG_13,
                FORM_COL_DLG_14,
                FORM_COL_DLG_15,
                FORM_COL_DLG_16
              ]
            },
          ],
        },
      ],
    },
  ]
}
