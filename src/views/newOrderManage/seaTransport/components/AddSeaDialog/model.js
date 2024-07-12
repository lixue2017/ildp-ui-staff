import { POSITIVE_NUMBER } from "@/utils/mixin";
import {
  httpgetCustlist,
  httpPortPublicSelect,
} from "@/comModel/httpSelect.js";
import { FORM_ROW_201 } from "@/views/newOrderManage/components/model.js";
const config = (showList) => ({
  lists: [
    {
      fieldList: [
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                {
                  span: 6,
                  id: "customerId",
                  label: "委托人：",
                  placeholder: "委托人",
                  ...httpgetCustlist({ status: 3, isQueryFirstDept: 1 }),
                },
                {
                  span: 6,
                  id: "transportMode",
                  label: "运输方式：",
                  type: "radio",
                  basicType: "transportMode",
                  hideList: [3, 4],
                },
                {
                  span: 6,
                  id: "orderBusinessType",
                  label: "业务类型：",
                  type: "radio",
                  basicType: "orderBusinessType",
                  hideList: [2, 3, 4, 5],
                },
                {
                  span: 6,
                  id: "countryId",
                  label: "目的国：",
                  placeholder: "请选择目的国",
                  type: "autocomplete",
                  category: "country",
                  defaultProp: {
                    value: "id",
                    label: "twoCode,nameCn",
                  },
                },
                {
                  span: 6,
                  id: "customsClearanceType",
                  label: "清关类型：",
                  type: "radio",
                  basicType: "customsClearanceType",
                },
                {
                  span: 6,
                  id: "tradeClause",
                  label: "贸易条款：",
                  placeholder: "-请选择-",
                  type: "select",
                  basicType: "tradeClause",
                  showList,
                },
                {
                  span: 6,
                  id: "declareCurrencyId",
                  label: "清关币别：",
                  placeholder: "-请选择-",
                  type: "autocomplete",
                  category: "currency",
                },
                {
                  span: 6,
                  id: "insured",
                  text: "单独购买保险",
                  type: "singleCheckbox",
                },
                {
                  span: 6,
                  id: "portOfLoadingId",
                  label: "装运港：",
                  placeholder: "请选择装运港",
                  ...httpPortPublicSelect("0"),
                },
                {
                  span: 6,
                  id: "destinationPortId",
                  label: "目的港：",
                  placeholder: "请选择目的港",
                  ...httpPortPublicSelect("0"),
                },
                // {
                //   span: 6,
                //   id: "insuranceAmount",
                //   label: "保险金额：",
                //   type: "slot",
                // },
                {
                  span: 12,
                  id: "customerOrderSn",
                  label: "客户单号：",
                  placeholder: "请输入客户单号",
                  type: "text",
                  maxlength: 256,
                },
                // {
                //   span: 24,
                //   id: "remark",
                //   label: "备注信息：",
                //   type: "textarea",
                //   placeholder: "限字数255个",
                //   maxlength: 255,
                //   rows: 3
                // },
              ],
            },
          ],
        },
        {
          className: "border-bottom-solid margin-top-14",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "shipperId",
                  label: "发货人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择发货人",
                  inputWidth: "408px",
                  type: "slot",
                  noClearable: true,
                },
                {
                  span: 24,
                  id: "consigneeId",
                  label: "收货人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择收货人",
                  inputWidth: "408px",
                  type: "slot",
                  noClearable: true,
                },
                {
                  span: 24,
                  id: "notifierId",
                  label: "通知人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择通知人",
                  inputWidth: "408px",
                  type: "slot",
                },
              ],
            },
          ],
        },
        FORM_ROW_201(),
      ],
    },
  ],
  formRules: {
    customerId: [
      { required: true, message: "请选择委托人", trigger: "change" },
    ],
    transportMode: [
      { required: true, message: "请选择运输方式", trigger: "change" },
    ],
    orderBusinessType: [
      { required: true, message: "请选择业务类型", trigger: "change" },
    ],
    // customsClearanceType: [
    //   { required: true, message: "请选择清关类型", trigger: "change" },
    // ],
    tradeClause: [
      { required: true, message: "请选择贸易条款", trigger: "change" },
    ],
    countryId: [{ required: true, message: "请选择目的国", trigger: "change" }],
    portOfLoadingId: [
      { required: true, message: "请选择装运港", trigger: "change" },
    ],
    destinationPortId: [
      { required: true, message: "请选择目的港", trigger: "change" },
    ],
    // declareCurrencyId: [
    //   { required: true, message: "请选择清关币别", trigger: "change" },
    // ],
    insuranceAmount: [
      {
        message: "保险金额不能为负数",
        pattern: POSITIVE_NUMBER,
      },
    ],
    shipperId: [{ required: true, message: "请选择发货人", trigger: "change" }],
    consigneeId: [
      { required: true, message: "请选择收货人", trigger: "change" },
    ],
  },
});
export { config };
