import { getChargeStaff } from "@/api/customerManage/customerList.js";
export const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "verificationBy",
                  label: "核销人：",
                  placeholder: "请选择核销人",
                  type: "autocomplete",
                  httpRequest: getChargeStaff,
                  defaultProp: {
                    value: 'id',
                    label: 'nickName'
                  }
                },
                {
                  span: 24,
                  id: "verificationTime",
                  label: "销账时间：",
                  placeholder: "年/月/日",
                  type: "datetime",
                  valueFormat: "yyyy-MM-dd hh:mm:ss"
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注说明：",
                  type: "textarea",
                  maxlength: 200,
                  rows: 3,
                },
              ],
            },
          ],
        }
      ],
    },
  ],
  formRules: {
    verificationBy: [
      { required: true, message: "请选择核销人", trigger: "change" },
    ],
    verificationTime: [
      { required: true, message: "请选择销账时间", trigger: "change" },
    ]
  }
}