import { getListSingle } from "@/api/operateRecord/DOCManage"
import { httpUserSelect } from '@/comModel/httpSelect'

export const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "type",
                  label: "扣货类型：",
                  type: "radio",
                  options: [
                    { label: "清关扣货", value: 0 },
                    { label: "报关扣货", value: 1 },
                    { label: "单票扣货", value: 2 },
                  ]
                },
                {
                  span: 12,
                  id: "company",
                  label: "扣货单位：",
                  placeholder: "此处填写扣货单位",
                  type: "text",
                },
                {
                  span: 12,
                  id: "operationOrderId",
                  label: "工作单：",
                  placeholder: "请选择工作单",
                  type: "autocomplete",
                  // defaultKey: 'id',
                  isBackAll: true,
                  isAutoInitRequest: true,
                  httpRequest: (params) => getListSingle({
                    ...params,
                    operationOrderNum:params.nameCn,
                    statusSearch: '2,3,4,6,9',
                    popDetainStatus:"1"
                  }),
                  getCustomData: (item) => {
                    return {
                      key: item.id,
                      value: item.id,
                      label: `${item.operationOrderNum}`
                    }
                  }
                },
                {
                  span: 12,
                  id: "followUserid",
                  label: "跟进操作员：",
                  placeholder: "请选择操作员",
                  ...httpUserSelect()
                },
                {
                  span: 12,
                  id: "detainTime",
                  label: "扣货时间：",
                  placeholder: "年/月/日",
                  type: "date",
                  // valueFormat: "yyyy-MM-dd"
                },
                {
                  span: 12,
                  id: "busUserid",
                  label: "跟进业务员：",
                  placeholder: "请选择业务员",
                  ...httpUserSelect()
                },
                {
                  span: 12,
                  id: "agent",
                  label: "订舱代理：",
                  placeholder: "--",
                  type: "slot",
                  // render: (rows) => {
                  //   return rows.operationOrderId.bookingSpaceProxyName?rows.operationOrderId.bookingSpaceProxyName:'--'
                  // }
                },
                // {
                //   span: 12,
                //   id: "shipCompany",
                //   label: "船公司：",
                //   placeholder: "--",
                //   type: "slot",
                //   // render:(rows)=>{
                //   //   return rows.operationOrderId.shipCompany?rows.operationOrderId.shipCompany:'--'
                //   // }
                // },
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
                  labelWidth: "57px",
                  label: "备注说明",
                  type: "txt",
                  className: "custom-remark"
                },
                {
                  span: 23,
                  id: "remark",
                  labelWidth: "0px",
                  placeholder: "备注说明（最多200字）",
                  type: "textarea"
                }
              ],
            },
          ],
        },
        {
          rows: [
            {
              cols: [
                // {
                //   span: 24,
                //   labelWidth: "100px",
                //   label: "附件资料",
                //   type: "txt",
                //   className: "custom-remark"
                // },
                {
                  span: 24,
                  id: "attachId",
                  labelWidth: "0px",
                  type: "customUploadFile",
                  // className: "custom-remark"
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    type: [
      { required: true, message: "请选择扣货类型", trigger: "change" },
    ],
    operationOrderId: [
      { required: true, message: "请选择工作单", trigger: "change" },
    ],
    followUserid: [
      { required: true, message: "请选择跟进操作员", trigger: "change" },
    ],
    busUserid: [
      { required: true, message: "请选择跟进业务员", trigger: "change" },
    ],
  }
}
