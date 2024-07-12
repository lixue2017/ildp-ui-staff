import { getUserList, getAccmainCus, getforeclose } from "@/api/common"
import { settleCostTypeList } from "@/api/settlementManage/feeSet";
import { getCurrencyList } from "@/api/basicData/index";
import { getBazaarList } from "@/api/common"

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
                  span: 7,
                  id: "type",
                  label: "应收应付：",
                  type: "radio",
                  basicType: 'billType',
                },
                {
                  span: 5,
                  id: "isMakeInvoice",
                  text: "应付需开票",
                  type: "slot",
                  labelWidth: "10px"
                },
                {
                  span: 12,
                  id: "orderNum",
                  label: "业务单：",
                  placeholder: "--",
                  type: "slot",
                  basicType: "settlementBusinessType",
                  basicTypeVal: "businessType"
                },
                {
                  span: 12,
                  id: "billingMain",
                  label: "计费主体：",
                  type: "txt",
                  placeholder: "--",
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
                      dataStatus: '1'
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
                  id: "dealingsCompanyName",
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
                  id: "num",
                  label: "数量/单价：",
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
                  id: "totalMoney",
                  label: "金额：",
                  type: "txt",
                  placeholder: "--",
                  disable: true
                },
                {
                  span: 12,
                  id: "isIncludeTax",
                  labelWidth: "40px",
                  type: "slot",
                },
                {
                  span: 12,
                  id: "accountingTime",
                  label: "记账时间：",
                  placeholder: "----年--月",
                  type: "txt",
                },
                {
                  span: 6,
                  id: "inTaxMoney",
                  label: "不含税金额：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 6,
                  id: "taxMoney",
                  labelWidth: "70px",
                  label: "税额：",
                  placeholder: "0",
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
                  labelWidth: "58px",
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
      { required: true, message: "请选择应收/应付", trigger: "change" },
    ],
    costId: [
      { required: true, message: "请选择费用名称", trigger: "change" },
    ],
    dealingsCompanyName: [
      { required: true, message: "请选择往来单位", trigger: "change" },
    ],
    num: [
      { required: true, message: "请输入数量", trigger: "blur" },
    ],
    unitPrice: [
      { required: true, message: "请输入单价", trigger: "blur" },
    ],
    currencyId: [
      { required: true, message: "请选择币别", trigger: "change" },
    ],
  }
}

export const EDIT_FORM_COL_1 = {
  id: "nBillingMain", // 临时ID，用于保存时赋值
  type: "autocomplete",
  placeholder: "计费主体",
  httpRequest: getBazaarList,
  defaultProp: {
    value: 'id',
    label: 'nameCn,nameEn'
  }
}

export const EDIT_FORM_RULES_1 = {
  nBillingMain: [
    { required: true, message: "请选择计费主体", trigger: "change" },
  ],
}