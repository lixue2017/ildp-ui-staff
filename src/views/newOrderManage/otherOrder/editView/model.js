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

const EDIT_COL_1 = {
  span: 8,
  id: "countryId",
  label: "国家：",
  selectLabelKey: "countryName",
  placeholder: "请选择",
  type: "autocomplete",
  category: "country",
  defaultProp: {
    value: "id",
    label: "twoCode,nameCn",
  },
};
const EDIT_COL_2 = {
  span: 8,
  id: "portOfLoadingId",
  label: "装运港：",
  selectLabelKey: "portOfLoading",
  placeholder: "请选择",
  ...httpPortPublicSelect(),
};
const EDIT_COL_3 = {
  span: 8,
  id: "destinationPortId",
  label: "目的港：",
  selectLabelKey: "destinationPort",
  placeholder: "请选择",
  ...httpPortPublicSelect(),
};

const EDIT_COL_4 = {
  span: 8,
  id: "customerId",
  label: "委托人：",
  placeholder: "委托人",
  noClearable: true,
  ...httpgetCustlist({ status: 3, isQueryFirstDept: 1 }),
};

const config = {
  lists: [
    {
      fieldList: [
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                EDIT_COL_4,
                EDIT_COL_1,
                {
                  span: 8,
                  id: "orderBusinessType",
                  label: "业务类型：",
                  type: "radio",
                  basicType: "orderBusinessType",
                  hideList: [0, 1, 2, 3],
                },
                {
                  span: 8,
                  id: "customsDeclarationType",
                  label: "报关方式：",
                  type: "radio",
                  basicType: "customsDeclarationType",
                  hideList: [0],
                },
                EDIT_COL_2,
                EDIT_COL_3,
                {
                  span: 8,
                  id: "customerOrderSn",
                  label: "客户单号：",
                  placeholder: "请输入客户单号",
                  type: "text",
                },
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
                  inputWidth: "335px",
                },
                {
                  span: 24,
                  id: "consignee",
                  label: "收货人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择收货人",
                  type: "slot",
                  inputWidth: "335px",
                  showClearanceCustoms: true,
                },
                {
                  span: 24,
                  id: "notifier",
                  label: "通知人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择通知人",
                  type: "slot",
                  inputWidth: "335px",
                },
              ],
            },
          ],
        },
        // {
        //   rows: [
        //     {
        //       cols: [
        //         {
        //           span: 24,
        //           id: "tableData",
        //           labelWidth: "0",
        //           type: "slot",
        //         },
        //       ],
        //     },
        //   ],
        // },
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
  //仅报关
  dacLists: [
    {
      fieldList: [
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                EDIT_COL_4,
                EDIT_COL_1,
                {
                  span: 8,
                  id: "orderBusinessType",
                  label: "业务类型：",
                  type: "radio",
                  basicType: "orderBusinessType",
                  hideList: [0, 1, 2, 3],
                },
                {
                  span: 8,
                  id: "customsDeclarationType",
                  label: "报关方式：",
                  type: "radio",
                  basicType: "customsDeclarationType",
                  hideList: [0],
                },
                EDIT_COL_2,
                EDIT_COL_3,
                {
                  span: 8,
                  id: "customerOrderSn",
                  label: "客户单号：",
                  placeholder: "请输入客户单号",
                  type: "text",
                },
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
                  inputWidth: "335px",
                },
                {
                  span: 24,
                  id: "consignee",
                  label: "收货人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择收货人",
                  type: "slot",
                  inputWidth: "335px",
                  showClearanceCustoms: true,
                },
                {
                  span: 24,
                  id: "notifier",
                  label: "通知人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择通知人",
                  type: "slot",
                  inputWidth: "335px",
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

  //仅出证
  icLists: [
    {
      fieldList: [
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                EDIT_COL_4,
                EDIT_COL_1,
                {
                  span: 8,
                  id: "orderBusinessType",
                  label: "业务类型：",
                  type: "radio",
                  basicType: "orderBusinessType",
                  hideList: [0, 1, 2, 3],
                },
                {
                  span: 8,
                  id: "currencyId",
                  label: "清关币别：",
                  placeholder: "-请选择-",
                  type: "autocomplete",
                  category: "currency",
                },
                EDIT_COL_2,
                EDIT_COL_3,
                {
                  span: 8,
                  id: "customerOrderSn",
                  label: "客户单号：",
                  placeholder: "请输入客户单号",
                  type: "text",
                },
                {
                  span: 0,
                  id: "customsDeclarationType",
                  type: "slot",
                  basicType: "customsDeclarationType",
                  hideList: [0],
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
                  inputWidth: "335px",
                },
                {
                  span: 24,
                  id: "consignee",
                  label: "收货人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择收货人",
                  type: "slot",
                  inputWidth: "335px",
                  showClearanceCustoms: true,
                },
                {
                  span: 24,
                  id: "notifier",
                  label: "通知人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择通知人",
                  type: "slot",
                  inputWidth: "335px",
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
  //拖车
  trailerLists: [
    {
      fieldList: [
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                EDIT_COL_4,
                EDIT_COL_1,
                {
                  span: 8,
                  id: "orderBusinessType",
                  label: "业务类型：",
                  type: "radio",
                  basicType: "orderBusinessType",
                  hideList: [0, 1, 4, 5],
                },
                EDIT_COL_2,
                EDIT_COL_3,
                {
                  span: 8,
                  id: "customerOrderSn",
                  label: "客户单号：",
                  placeholder: "请输入客户单号",
                  type: "text",
                },
                // {
                //   span: 16,
                //   id: "remark",
                //   label: "备注信息：",
                //   placeholder: "请输入备注信息",
                //   type: "text",
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
                  inputWidth: "335px",
                },
                {
                  span: 24,
                  id: "consignee",
                  label: "收货人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择收货人",
                  type: "slot",
                  inputWidth: "335px",
                  showClearanceCustoms: true,
                },
                {
                  span: 24,
                  id: "notifier",
                  label: "通知人",
                  labelClassName: "item-label-title",
                  placeholder: "请选择通知人",
                  type: "slot",
                  inputWidth: "335px",
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
