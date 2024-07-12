export const config = {
  lists: [
    {
      fieldList: [
        {
          className: 'border-bottom-solid',
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "operationOrderNum",
                  label: "操作工作单：",
                  placeholder: "--",
                  type: "slot",
                },
                {
                  span: 12,
                  id: "bailorPeople",
                  label: "委托人：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "hBlNo",
                  label: "H B/L No.：",
                  placeholder: "--",
                  type: "slot",
                },
                {
                  span: 12,
                  id: "shipCompany",
                  label: "航空/船公司：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "issuingMethod",
                  label: "签发方式：",
                  type: "radio",
                  basicType: 'issuingMethod',
                },
                {
                  span: 12,
                  id: "destinationPort",
                  label: "目的港：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "accountCycle",
                  label: "结算方式：",
                  type: "select",
                  basicType: 'accountCycle'
                },
                {
                  span: 12,
                  id: "releaseMethod",
                  label: "放单方式：",
                  type: "radio",
                  basicType: 'releaseMethod',
                },
                {
                  span: 12,
                  id: "takeMethod",
                  label: "取单方式：",
                  type: "radio",
                  basicType: 'takeMethod',
                },
                {
                  span: 12,
                  id: "isPrintTakeEntrust",
                  text: "取单委托书已打印",
                  type: "singleCheckbox"
                },
                {
                  span: 12,
                  id: "customerExpress",
                  label: "寄客户快递：",
                  type: "slot",
                  basicType: 'express',
                },
                {
                  span: 12,
                  id: "filialeExpress",
                  label: "寄分公司快递：",
                  type: "slot",
                  basicType: 'express',
                  labelWidth: "105px"
                },
              ],
            },
          ],
        },
        {
          className: 'border-bottom-solid',
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "remarkLabel",
                  labelWidth: "75px",
                  label: "备注说明",
                  type: "txt",
                  className: "custom-remark"
                },
                {
                  span: 24,
                  id: "remark",
                  labelWidth: "0px",
                  placeholder: "备注说明（最多200字）",
                  type: "textarea",
                  maxlength: 200,
                  rows: 3
                }
              ],
            },
          ],
        },
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "attachId",
                  labelWidth: "0",
                  type: "slot",
                  disable: true
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {}
}
