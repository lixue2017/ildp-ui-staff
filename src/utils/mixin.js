/**
 * orderType, // 操作单类型（2-电商，3,4-传统 3-传统海运 4-传统空运）
 */

export const SYSTEM = "/system";

export const POSITIVE_NUMBER =
  /^(([1-9][0-9]*(\.)?[0-9]*)|(0(\.)([0-9]*))|(0))$/; //正数和0
export const POSITIVE_WHOLE_NUMBER = /^[+]{0,1}(\d+)$/; //正整数包括0 （不包括0为/^[1-9]\d*$/）
export const POSITIVE_PHONE = /^[\d- ]*$/;

export const DATA_STATUS = [
  {
    label: "草稿",
    value: 0,
    color: "#FAAD14",
  },
  {
    label: "已启用",
    value: 1,
    color: "#52C41A",
  },
  {
    label: "已禁用",
    value: 2,
    color: "#BCBCBC",
  },
];

export const TAX_ID_OPTION = [
  {
    label: "公司",
    value: 0,
  },
  {
    label: "个人",
    value: 1,
  },
  {
    label: "护照",
    value: 2,
  },
  {
    label: "其他",
    value: 3,
  },
];

// export const LEVEL = [
//   {
//     label: '1级',
//     value: 1
//   }, {
//     label: '2级',
//     value: 2
//   }, {
//     label: '3级',
//     value: 3
//   }
// ]

export const ADDRESS_TYPE = [
  {
    label: "寄送地址",
    value: "0",
  },
  {
    label: "寄单地址",
    value: "1",
  },
  {
    label: "提货地址",
    value: "2",
  },
];

export const CUSTOMER_CHECKBOX = [
  {
    label: "轨迹公开查询",
    value: 1,
  },
  {
    label: "邮件订阅",
    value: 2,
  },
  {
    label: "按客户渠道出账单",
    value: 3,
  },
];
export const DATA_ROUTETYPE = [
  {
    label: "空运",
    value: 0,
  },
  {
    label: "海运",
    value: 1,
  },
  {
    label: "陆运",
    value: 2,
  },
  {
    label: "铁路",
    value: 3,
  },
];
export const DATA_PUBLICTYPE = [
  {
    label: "×否",
    value: 0,
  },
  {
    label: "√是",
    value: 1,
  },
];

export const DATA_SIZE = [
  {
    label: "20",
    value: 1,
  },
  {
    label: "40",
    value: 2,
  },
  {
    label: "45",
    value: 3,
  },
  {
    label: "52",
    value: 4,
  },
  {
    label: "53",
    value: 5,
  },
];
export const DATA_BOX = [
  {
    label: "FL",
    value: 1,
  },
  {
    label: "FR",
    value: 2,
  },
  {
    label: "G1",
    value: 3,
  },
  {
    label: "G2",
    value: 4,
  },
  {
    label: "GP",
    value: 5,
  },
  {
    label: "H1",
    value: 6,
  },
  {
    label: "H2",
    value: 7,
  },
  {
    label: "HD",
    value: 8,
  },
  {
    label: "HQ",
    value: 9,
  },
  {
    label: "HQRF",
    value: 10,
  },
  {
    label: "NOR",
    value: 11,
  },
  {
    label: "OT",
    value: 12,
  },
  {
    label: "RF",
    value: 13,
  },
  {
    label: "RH",
    value: 14,
  },
];

export const ATTACH_TYPE = [
  {
    label: "合同资料",
    value: "customerContract",
  },
  {
    label: "营业执照",
    value: "customerBusinessBicense",
  },
  {
    label: "其他资料",
    value: "customerOther",
  },
  {
    label: "发票资料",
    value: "invoiceInfo",
  },
  {
    label: "财务资料",
    value: "financeInfo",
  },
];

export const BUS_TYPE = [
  {
    label: "单票",
    value: 0,
  },
  {
    label: "整柜",
    value: 1,
  },
  {
    label: "拼柜",
    value: 2,
  },
];

// 拖车起运地/目的地
export const WAREHOUSE_TYPE = [
  "提货地址",
  "联系人地址",
  "港口",
  "自建仓",
  "非自建仓",
  "仓库",
];

export default {
  data() {
    return {};
  },
  methods: {
    getStatus(type) {
      const ret = DATA_STATUS.find((item) => item.value === type);
      return (ret && ret.label) || "";
    },
    getAttachType(type) {
      const ret = ATTACH_TYPE.find((item) => item.value === type);
      return (ret && ret.label) || "";
    },
  },
};
