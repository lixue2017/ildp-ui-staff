import { contactsOperationAddress } from "@/views/operateManage/seaTransOperate/Details/model.js";
const MODEL_COL_1 = {
  span: 8,
  id: "insureNo",
  label: "保险单号：",
  type: "txt",
};
export const tabsConfig = {
  columns: [
    {
      label: "基本信息",
      key: 1,
    },
    {
      label: "货物信息",
      key: 2,
    },
    {
      label: "拖车信息",
      key: 3,
    },
    {
      label: "报关信息",
      key: 4,
    },
    {
      label: "账单信息",
      key: 5,
    },
    {
      label: "附件信息",
      key: 10,
    },
    {
      label: "操作记录",
      key: 11,
    },
  ],
  active: 1,
};

export const draftInfo = {
  title: "基本信息",
  titleClass: "-1",
  rows: [
    {
      cols: [
        {
          span: 8,
          id: "countryName",
          label: "国家：",
          placeholder: "请选择国家",
          type: "txt",
        },
        {
          span: 8,
          id: "orderBusinessType",
          label: "业务类型：",
          placeholder: "--",
          type: "radio",
          disable: true,
          options: [
            { value: "3", label: "拖车+报关" },
            { value: "2", label: "仅拖车" },
          ],
        },
        {
          span: 8,
          id: "portOfLoading",
          label: "装运港：",
          placeholder: "请选择装运港",
          type: "txt",
        },
        {
          span: 8,
          id: "destinationPort",
          label: "目的港：",
          placeholder: "--",
          type: "txt",
        },
        {
          span: 24,
          id: "remark",
          label: "备注信息：",
          placeholder: "--",
          type: "text",
          disable: true,
          tipWidth: "600px",
        },
      ],
    },
  ],
};

export const certificateInfo = {
  title: "基本信息",
  titleClass: "-1",
  rows: [
    {
      cols: [
        {
          span: 8,
          id: "countryName",
          label: "国家：",
          placeholder: "请选择国家",
          type: "txt",
        },
        {
          span: 8,
          id: "orderBusinessType",
          label: "业务类型：",
          placeholder: "--",
          type: "radio",
          disable: true,
          options: [
            { value: "4", label: "仅报关" },
            { value: "5", label: "仅出证" },
          ],
        },
        {
          span: 8,
          id: "customsDeclarationType",
          label: "报关方式：",
          placeholder: "--",
          type: "radio",
          disable: true,
          options: [
            { value: "1", label: "无单证" },
            { value: "2", label: "自备单证" },
          ],
        },
        {
          span: 8,
          id: "portOfLoading",
          label: "装运港：",
          placeholder: "请选择装运港",
          type: "txt",
        },
        {
          span: 8,
          id: "destinationPort",
          label: "目的港：",
          placeholder: "--",
          type: "txt",
        },
        {
          span: 24,
          id: "remark",
          label: "备注信息：",
          placeholder: "--",
          type: "text",
          disable: true,
          tipWidth: "600px",
        },
      ],
    },
  ],
};

export const basicInfoConfig = {
  lists: [
    {
      fieldList: [
        // { ...draftInfo },
        {
          // className: 'border-top-solid',
          title: "基本信息",
          titleClass: "-1",
          rows: [
            {
              cols: [
                {
                  ...contactsOperationAddress(),
                  label: "发货人",
                  id: "shipper_address",
                  txtObjKey: "shipper",
                },
                {
                  ...contactsOperationAddress(),
                  label: "收货人",
                  id: "consignee_address",
                  txtObjKey: "consignee",
                },
                {
                  ...contactsOperationAddress(),
                  label: "通知人",
                  id: "notifier_address",
                  txtObjKey: "notifier",
                },

                // {
                //   span: 24,
                //   id: "shipper",
                //   label: "发货人",
                //   placeholder: "--",
                //   labelClassName: "item-label-title",
                //   type: "slot",
                //   disable: true,
                //   labelWidth: "100px",
                // },
                // {
                //   span: 24,
                //   id: "consignee",
                //   label: "收货人",
                //   labelClassName: "item-label-title",
                //   placeholder: "--",
                //   type: "slot",
                //   disable: true,
                //   labelWidth: "100px",
                // },
                // {
                //   span: 24,
                //   id: "notifier",
                //   label: "通知人",
                //   labelClassName: "item-label-title",
                //   placeholder: "--",
                //   type: "slot",
                //   disable: true,
                //   labelWidth: "100px",
                // }
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const cardConfig = [
  {
    bgColor: "#ECF3FF",
    icon: "yunshu1",
    type: "slot",
    prop: "addr",
    labelColor: "#5094FF",
    valueColor: "#5094FF",
  },
  {
    bgColor: "#FFF3EC",
    type: "slot",
    prop: "orderNo",
    valueColor: "#FF985C",
  },
  {
    bgColor: "#ECECFF",
    icon: "icon-zhongliang",
    label: "计重重量(KG)",
    prop: "realFreightWeight",
    labelColor: "#B1B1FF",
    valueColor: "#7676FF",
  },
  {
    bgColor: "#D2F1FF",
    icon: "icon-tiji",
    label: "计费体积(CBM)",
    prop: "realFreightVolume",
    labelColor: "#64CFFF",
    valueColor: "#13B5FF",
  },
];

export const customsConfig = {
  lists: [
    {
      fieldList: [
        {
          title: "报关信息",
          titleClass: "-1",
          rows: [
            {
              cols: [
                {
                  span: 8,
                  id: "code",
                  label: "报关编号：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "cusBId",
                  label: "报关行：",
                  placeholder: "--",
                  type: "txt",
                  basicType: "clientIdentity",
                },
                {
                  span: 8,
                  id: "dcNumbers",
                  label: "报关单号：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "exportInfo",
                  label: "",
                  placeholder: "--",
                  type: "slot",
                  basicType: "importExportType",
                },
                {
                  span: 8,
                  id: "declareTime",
                  label: "申报日期：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "releaseTime",
                  label: "放行日期：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注说明：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "accessory",
                  label: "附件资料：",
                  type: "slot",
                  disable: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const billConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 4,
                  id: "platform",
                  label: "应付：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "custNo",
                  label: " 实付：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "ys",
                  label: "应收：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "ss",
                  label: "实收：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 4,
                  id: "skl",
                  label: "收款率：",
                  placeholder: "--",
                  type: "txt",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const billTableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    label: "编号",
    prop: "no",
    showOverflowTooltip: true,
  },
  {
    label: "类型",
    prop: "type",
    showOverflowTooltip: true,
  },
  {
    label: "往来单位",
    prop: "wldw",
    showOverflowTooltip: true,
  },
  {
    label: "币种",
    prop: "bz",
    showOverflowTooltip: true,
  },
  {
    label: "费用类型",
    prop: "fylx",
    showOverflowTooltip: true,
  },
  {
    label: "折合金额",
    prop: "zhje",
    showOverflowTooltip: true,
  },
  {
    label: "状态",
    prop: "zt",
    showOverflowTooltip: true,
  },
  {
    label: "发票状态",
    prop: "fpzt",
    showOverflowTooltip: true,
  },
  {
    label: "创建人",
    prop: "cjr",
    showOverflowTooltip: true,
  },
  {
    label: "主体",
    prop: "ztt",
    showOverflowTooltip: true,
  },
  {
    label: "创建时间",
    prop: "cjsj",
    showOverflowTooltip: true,
  },
];
