
export const config = {
  lists: [
    {
      fieldList: [
        {
          className: 'border-bottom-solid margin-top-14',
          rows: [
            {
              cols: [

                {
                  span: 6,
                  id: "code",
                  label: "扣货编号：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 6,
                  id: "type",
                  label: "扣货类型：",
                  placeholder: "--",
                  type: "txt",
                  basicType:"docType"
                },
                {
                  span: 6,
                  id: "joinOrder",
                  label: "关联整柜编号：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 6,
                  id: "salesmanName",
                  label: "跟进业务员：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 6,
                  id: "company",
                  label: "扣货单位：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 6,
                  id: "detainTime",
                  label: "扣货时间：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 6,
                  id: "operationOrderNum",
                  label: "工作单：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 6,
                  id: "releaseTime",
                  label: "放货时间：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 6,
                  id: "agent",
                  label: "订舱代理：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 6,
                  id: "operatorName",
                  label: "跟进操作员：",
                  placeholder: "--",
                  type: "txt",
                },
              ]
            },
          ],
        },
        {
          className: 'border-bottom-solid margin-top-14',
          rows: [
            {
              cols: [
                {
                  span: 24,
                  labelWidth: "77px",
                  label: "备注说明",
                  type: "txt",
                  className: "custom-remark",
                },
                {
                  span: 24,
                  id: "remark",
                  labelWidth: '0px',
                  placeholder: "--",
                  type: "textarea",
                  disable: true
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
                  labelWidth: "77px",
                  label: "附件资料",
                  type: "txt",
                  className: "custom-remark"
                },
                {
                  span: 24,
                  id: "accessory",
                  labelWidth: '0px',
                  type: "slot",
                  className: "custom-remark",
                  disable: true
                },
              ],
            },
          ],
        },
      ],
    }
  ],
  formRules: {}
}
