import { httpQuotationSelect } from "@/comModel/httpSelect";
const FORM_COLS_1 = (obj) => ({
  span: 24,
  id: "quotationSheetId",
  label: "关联报价：",
  placeholder: "请选择报价单",
  ...httpQuotationSelect(obj),
});
export const relatedQuotationConfig = (obj) => ({
  title: "关联报价",
  width: "450px",
  labelWidth: "90px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_1(obj)],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    quotationSheetId: [
      { required: true, message: "请选择关联报价", trigger: "blur" },
    ],
  },
});
