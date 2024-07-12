import { getChargeStaff, getAccmainCus, getforeclose, getBillingMain, getAllUser } from "@/api/common"
import { settleCostTypeList } from "@/api/settlementManage/feeSet";
import { getCurrencyList } from "@/api/basicData/index";
export const config = {
  lists: [
    {
      fieldList: [
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "type",
                  label: "应收应付：",
                  type: "radio",
                  basicType: 'billType'
                },
                {
                  span: 12,
                  id: "applicant",
                  label: "申请人：",
                  placeholder: "请选择申请人",
                  type: "autocomplete",
                  searchParamName: "nickName",
                  httpRequest: (params) => getAllUser({ ...params }),
                  defaultProp: {
                    value: 'userId',
                    label: 'userName,nickName'
                  }
                },
                {
                  span: 12,
                  id: "billingMain",
                  label: "计费主体：",
                  placeholder: "请选择计费主体",
                  type: "autocomplete",
                  httpRequest: getBillingMain,
                  defaultProp: {
                    value: 'id',
                    label: 'code,nameCn'
                  },
                },
                {
                  span: 12,
                  id: "costId",
                  label: "费用名称：",
                  type: "autocomplete",
                  placeholder: "费用名称",
                  httpRequest: (formData) => {
                    delete formData.cnName
                    return settleCostTypeList({
                      ...formData,
                      type: '1'
                    })
                  },
                  searchParamName: "cnName",
                  defaultProp: {
                    value: 'id',
                    label: 'costCode,cnName'
                  }
                },
                {
                  span: 12,
                  id: "dealingsCompany",
                  label: "往来单位：",
                  type: "autocomplete",
                  placeholder: "往来单位",
                  searchParamName: "companyNameCn",
                  httpRequest: (rows) => {
                    return getAccmainCus().then((res) => {
                      return getforeclose(res.data.id, { name: rows.name })
                    })
                  },
                  defaultProp: {
                    value: 'id',
                    label: 'nameCn'
                  },
                },
                {
                  span: 12,
                  id: "prepaidCollect",
                  label: "到付预付：",
                  type: "radio",
                  basicType: 'paymentType'
                },
                {
                  span: 12,
                  id: "totalMoney",
                  label: "金额：",
                  type: "slot",
                },
                {
                  span: 12,
                  id: "currencyId",
                  label: "币别：",
                  type: "autocomplete",
                  httpRequest: getCurrencyList,
                  defaultProp: {
                    value: 'id',
                    label: 'code,nameCn'
                  }
                },
                {
                  span: 12,
                  id: "isIncludeTax",
                  labelWidth: "40px",
                  type: "slot",
                },
                {
                  span: 12,
                  id: "taxMoney",
                  labelWidth: "70px",
                  label: "税额：",
                  placeholder: "0",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "inTaxMoney",
                  label: "不含税金额：",
                  placeholder: "--",
                  type: "txt",
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
      ],
    },
  ],
  formRules: {
    type: [
      { required: true, message: "请选择应收/应付", trigger: "blur" },
    ],
    applicant: [
      { required: true, message: "请选择申请人", trigger: "blur" },
    ],
    billingMain: [
      { required: true, message: "请选择计费主体", trigger: "blur" },
    ],
    costId: [
      { required: true, message: "请选择费用名称", trigger: "blur" },
    ],
    totalMoney: [
      { required: true, message: "请输入金额", trigger: "blur" },
    ],
    currencyId: [
      { required: true, message: "请选择币别", trigger: "blur" },
    ],
  }
}
