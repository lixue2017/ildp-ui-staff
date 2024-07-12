import { POSITIVE_NUMBER } from "@/utils/mixin";
import {
  httpgetCustlist,
  httpPortPublicSelect,
} from "@/comModel/httpSelect.js";
import { FORM_ROW_201 } from "@/views/newOrderManage/components/model.js";
const FORM_ROW_1 = {
  // 附件查看列表
  className: "margin-top-14",
  rows: [
    {
      cols: [
        {
          span: 24,
          id: "slotFiles",
          labelWidth: "0",
          type: "slot",
          className: "margin-bottom-0",
        },
      ],
    },
  ],
};
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
                  noClearable: true,
                  ...httpgetCustlist({ status: 3, isQueryFirstDept: 1 }),
                },
                {
                  span: 6,
                  id: "transportMode",
                  label: "运输方式：",
                  placeholder: "请选择运输方式",
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
                  selectLabelKey: "countryName",
                  placeholder: "请选择",
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
                  placeholder: "请选择",
                  type: "select",
                  basicType: "tradeClause",
                  showList,
                },
                {
                  span: 6,
                  id: "declareCurrencyId",
                  label: "清关币别：",
                  selectLabelKey: "declareCurrencyName",
                  placeholder: "请选择",
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
                  selectLabelKey: "portOfLoading",
                  placeholder: "请选择",
                  ...httpPortPublicSelect("0"),
                },
                {
                  span: 6,
                  id: "destinationPortId",
                  label: "目的港：",
                  selectLabelKey: "destinationPort",
                  placeholder: "请选择",
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
                //   span: 8,
                //   id: "empty",
                //   label: "",
                //   type: "txt",
                // },
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
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "shipper",
                  label: "发货人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择发货人",
                  type: "slot",
                  inputWidth: "408px",
                  noClearable: true,
                },
                {
                  span: 24,
                  id: "consignee",
                  label: "收货人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择收货人",
                  type: "slot",
                  maxWidth: "600px",
                  inputWidth: "408px",
                  showClearanceCustoms: true,
                  noClearable: true,
                },
                {
                  span: 24,
                  id: "notifier",
                  label: "通知人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择通知人",
                  type: "slot",
                  inputWidth: "408px",
                },
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
                  id: "tableData",
                  labelWidth: "0",
                  type: "slot",
                },
              ],
            },
          ],
        },
        // FORM_ROW_190(),
        // FORM_ROW_190({
        //   fileLabel: "报关资料上传",
        //   attachIdKeyName: "clearanceAttachId",
        //   attachListKeyName: "clearanceAttachList"
        // }),
        FORM_ROW_1,
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
    tradeClause: [
      { required: true, message: "请选择贸易条款", trigger: "change" },
    ],
    // customsClearanceType: [
    //   { required: true, message: "请选择清关类型", trigger: "change" },
    // ],
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
    consignee: [{ required: true, message: "请选择发货人", trigger: "change" }],
    shipper: [{ required: true, message: "请选择收货人", trigger: "change" }],
    // insuranceAmount: [
    //   {
    //     message: "保险金额不能为负数",
    //     pattern: POSITIVE_NUMBER,
    //   },
    // ],
  },
});

export { config };
