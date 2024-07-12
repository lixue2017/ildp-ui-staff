import {
  httpgetCustlist,
  httpPortPublicSelect,
} from "@/comModel/httpSelect.js";
import { FORM_ROW_201 } from "@/views/newOrderManage/components/model.js";

const config = {
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
                  id: "customerId",
                  label: "委托人：",
                  placeholder: "委托人",
                  ...httpgetCustlist({ status: 3, isQueryFirstDept: 1 }),
                },
                {
                  span: 12,
                  id: "countryId",
                  label: "国家：",
                  placeholder: "请选择国家",
                  type: "autocomplete",
                  category: "country",
                  defaultProp: {
                    value: "id",
                    label: "twoCode,nameCn",
                  },
                },
                {
                  span: 12,
                  id: "orderBusinessType",
                  label: "业务类型：",
                  type: "radio",
                  basicType: "orderBusinessType",
                  hideList: [0, 1, 4, 5],
                },
                {
                  span: 12,
                  id: "portOfLoadingId",
                  label: "装运港：",
                  placeholder: "请选择装运港",
                  ...httpPortPublicSelect(),
                },
                {
                  span: 12,
                  id: "customerOrderSn",
                  label: "客户单号：",
                  placeholder: "请输入客户单号",
                  type: "text",
                },
                {
                  span: 12,
                  id: "destinationPortId",
                  label: "目的港：",
                  placeholder: "请选择目的港",
                  ...httpPortPublicSelect(),
                },
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
                  id: "shipper",
                  label: "发货人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择发货人",
                  inputWidth: "400px",
                  type: "slot",
                },
                {
                  span: 24,
                  id: "consignee",
                  label: "收货人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择收货人",
                  inputWidth: "400px",
                  type: "slot",
                },
                {
                  span: 24,
                  id: "notifier",
                  label: "通知人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择通知人",
                  inputWidth: "400px",
                  type: "slot",
                  lastChild: true,
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
    countryId: [{ required: true, message: "请选择国家", trigger: "change" }],
    orderBusinessType: [
      { required: true, message: "请选择业务类型", trigger: "change" },
    ],

    portOfLoadingId: [
      { required: true, message: "请选择装运港", trigger: "change" },
    ],
    destinationPortId: [
      { required: true, message: "请选择目的港", trigger: "change" },
    ],
    // shipper: [
    //   { required: true, message: "请选择发货人", trigger: "change" },
    // ],
    // consignee: [
    //   { required: true, message: "请选择收货人", trigger: "change" },
    // ],
  },
};

export { config };
