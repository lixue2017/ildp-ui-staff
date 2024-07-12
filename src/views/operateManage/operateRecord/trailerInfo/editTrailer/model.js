import {
  httpOperationListSelect,
  httpPortPublicSelect,
  httpCustomerSelect,
  httpBoxSelect,
  httpOtherFreightSelect,
} from "@/comModel/httpSelect";
import {
  httpTotalWarehouseList,
  httpTrailerAddressList,
} from "@/comModel/warehouse";
import { getGeneralJobNo } from "@/api/operateRecord/DOCManage";
import { toFixedNum } from "@/utils/instructions";

/**
 *  "shipperType": "0"  // 仓库类型  0提货地址  1联系人  2港口  3自建仓  4 非自建仓  5仓库
 */
const FORM_COL_DLG_1 = {
  id: "operationOrderNum",
  label: "工作单号：",
  placeholder: "--",
  span: 8,
  type: "txt",
};
const FORM_COL_DLG_2 = {
  id: "shipCompany",
  label: "船公司：",
  placeholder: "请输入",
  span: 8,
  type: "text",
};
const FORM_COL_DLG_3 = {
  id: "shipName",
  label: "船名/ 航次：",
  span: 5,
  type: "text",
  placeholder: "船名",
  className: "col-right-0",
};
const FORM_COL_DLG_3_1 = {
  id: "shipSecond",
  labelWidth: "0px",
  span: 3,
  type: "text",
  placeholder: "航次",
};
const FORM_COL_DLG_4 = {
  id: "boxCode_obj",
  label: "整柜信息：",
  placeholder: "请选择",
  span: 8,
  isBackAll: true,
};
const FORM_COL_DLG_5 = {
  id: "cabinOpenTime",
  label: "开舱日期：",
  span: 8,
  placeholder: "请选择日期",
  type: "date",
  valueFormat: "yyyy/MM/dd",
};
const FORM_COL_DLG_6 = {
  id: "cutGateTime",
  label: "截关日期：",
  span: 8,
  placeholder: "请选择日期",
  type: "datetime",
  valueFormat: "yyyy/MM/dd HH:mm",
};
const FORM_COL_DLG_7 = {
  id: "sono",
  label: "SO No.：",
  placeholder: "请输入",
  span: 8,
  type: "text",
};
const FORM_COL_DLG_8 = {
  span: 8,
  id: "totalWeight",
  label: "货物预计重量：",
  placeholder: "请输入",
  type: "inputNumber",
  numDecimal: 2,
  unit: "KG",
};
const FORM_COL_DLG_9 = {
  id: "ontainerSno",
  label: "箱号：",
  placeholder: "请输入",
  span: 8,
  type: "text",
};
const FORM_COL_DLG_10 = {
  id: "pickBoxId",
  label: "提柜地点：",
  placeholder: "请选择",
  span: 8,
  ...httpPortPublicSelect("0,3", {
    shipperType: 2,
  }),
};
const FORM_COL_DLG_11 = {
  id: "returnBoxId",
  label: "还柜地点：",
  placeholder: "请选择",
  span: 8,
  ...httpPortPublicSelect("0,3", {
    shipperType: 2,
  }),
};
const FORM_COL_DLG_12 = {
  id: "sealingStripSno",
  label: "封号：",
  placeholder: "请输入",
  span: 8,
  type: "text",
};
const FORM_COL_DLG_13 = {
  id: "trailerRowId",
  label: "托车行：",
  placeholder: "请选择",
  span: 8,
  ...httpCustomerSelect({ clientIdentity: 3 }),
};
const FORM_COL_DLG_13_1 = {
  id: "containerWeight",
  label: "柜重：",
  placeholder: "柜重",
  span: 8,
  type: "inputNumber",
  numDecimal: 2,
  unit: "KG",
};
const FORM_COL_DLG_14 = {
  span: 24,
  id: "dispatchRemark",
  label: "调度备注：",
  placeholder: "请输入",
  type: "textarea",
};
const FORM_COL_DLG_15 = {
  id: "slotGoodsAddress",
  labelWidth: "0px",
  seeDiffSlot: true,
  span: 24,
  type: "slot",
};
const FORM_COL_DLG_16 = {
  span: 24,
  id: "weighStifling",
  labelWidth: "0px",
  type: "multiCheckbox",
  options: [
    {
      label: "过磅",
      value: 1,
    },
    {
      label: "熏蒸",
      value: 2,
    },
  ],
};
const FORM_COL_DLG_17 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  labelWidth: "65px",
  placeholder: "请输入",
  type: "textarea",
};
const FORM_COL_DLG_18 = {
  id: "slotDestinationAddress",
  labelWidth: "0px",
  seeDiffSlot: true,
  span: 24,
  type: "slot",
};
const FORM_COL_DLG_19 = {
  span: 24,
  id: "attachId",
  labelWidth: "0px",
  fileLabel: "图片上传",
  type: "customUploadFile",
};
const FORM_COL_DLG_20 = {
  span: 24,
  id: "slotImgList",
  label: "图片资料：",
  labelWidth: "65px",
  seeDiffSlot: true,
  type: "slot",
};

// 一般拖车进度反馈
const generalTrailer = () => {
  return [
    {
      ...FORM_COL_DLG_13,
      id: "trailerRowname",
      label: "拖车公司：",
      type: "txt",
      placeholder: "拖车公司",
      span: 12,
    },
    FORM_COL_DLG_1,
    {
      ...FORM_COL_DLG_17,
      type: "txt",
      labelWidth: "102px",
      placeholder: "--",
    },
    {
      ...FORM_COL_DLG_14,
      span: 24,
    },
    FORM_COL_DLG_15,
    FORM_COL_DLG_18,
    FORM_COL_DLG_19,
  ];
};

// 集装箱到港
const arrivalForm = (obj) => {
  const { boxFn, goodsBoxSelect = {}, modelType } = obj || {};
  let arrivalCol = [
    FORM_COL_DLG_1,
    FORM_COL_DLG_2,
    FORM_COL_DLG_3,
    FORM_COL_DLG_3_1,
    {
      ...FORM_COL_DLG_4,
      ...goodsBoxSelect,
      handle: boxFn,
    },
    FORM_COL_DLG_5,
    FORM_COL_DLG_6,
    FORM_COL_DLG_7,
    FORM_COL_DLG_8,
    FORM_COL_DLG_9,
    FORM_COL_DLG_10,
    FORM_COL_DLG_11,
    FORM_COL_DLG_12,
    FORM_COL_DLG_13,
    FORM_COL_DLG_13_1,
    FORM_COL_DLG_14,
  ];
  if (modelType === "progress") {
    return arrivalCol;
  } else {
    return arrivalCol.concat([
      FORM_COL_DLG_15,
      FORM_COL_DLG_16,
      FORM_COL_DLG_17,
    ]);
  }
};
// 查看
const seeTrailerFn = (arr, editArr = []) => {
  const nArr = arr.filter(
    (e) => !["weighStifling", "shipSecond"].includes(e.id)
  );
  const SEE_KEY_1 = {
    boxCode_obj: "boxCode",
    pickBoxId: "pickPort",
    returnBoxId: "returnPort",
    trailerRowId: "shortName",
    operationOrderObj: "operationOrderNum",
  };
  const SEE_KTY_2 = [
    {
      id: "shipName",
      type: "txt",
      span: 8,
      render: (row) => `${row.shipName || "--"}/${row.shipSecond || "--"}`,
    },
    {
      id: "totalWeight",
      render: (row) => `${toFixedNum(row.totalWeight)}KG`,
    },
    {
      id: "containerWeight",
      render: (row) => `${toFixedNum(row.containerWeight)}KG`,
    },
  ];
  return nArr.map((e) => {
    const SEE_KTY_OBJ = SEE_KTY_2.find((k) => k.id === e.id);
    const IS_EDIT_COL = editArr.length && editArr.includes(e.id);
    // 进度反馈可编辑的项
    if (IS_EDIT_COL) {
      return e;
    }
    return {
      ...e,
      placeholder: "--",
      type: e.seeDiffSlot ? "slot" : "txt",
      id: SEE_KEY_1[e.id] || e.id,
      ...SEE_KTY_OBJ,
    };
  });
};
const seeArrivalForm = seeTrailerFn([...arrivalForm(), FORM_COL_DLG_20]);

// 集装箱拖车到港进度反馈
const arrivalFeedback = () => {
  const seeProgressCol = seeTrailerFn(arrivalForm({ modelType: "progress" }), [
    "ontainerSno",
    "sealingStripSno",
    "trailerRowId",
    "containerWeight",
    "dispatchRemark",
  ]);
  return [
    ...seeProgressCol,
    {
      ...FORM_COL_DLG_16,
      labelWidth: "102px",
    },
    FORM_COL_DLG_15,
    {
      ...FORM_COL_DLG_17,
      type: "txt",
      placeholder: "--",
    },
    FORM_COL_DLG_19,
  ];
};

// 集装箱离港
const departureForm = (obj) => {
  const { handleFn, goodsBoxSelect = {}, modelType, boxFn } = obj || {};
  let arrivalCol = [
    FORM_COL_DLG_1,
    FORM_COL_DLG_2,
    FORM_COL_DLG_3,
    FORM_COL_DLG_3_1,
    {
      ...FORM_COL_DLG_4,
      ...goodsBoxSelect,
      handle: boxFn,
    },
    FORM_COL_DLG_5,
    FORM_COL_DLG_6,
    FORM_COL_DLG_7,
    {
      ...FORM_COL_DLG_8,
      label: "货物实际重量：",
    },
    FORM_COL_DLG_9,
    FORM_COL_DLG_10,
    FORM_COL_DLG_11,
    FORM_COL_DLG_12,
    FORM_COL_DLG_13,
    FORM_COL_DLG_13_1,
    FORM_COL_DLG_14,
  ];
  if (modelType === "progress") {
    return arrivalCol;
  } else {
    return arrivalCol.concat([
      FORM_COL_DLG_18,
      FORM_COL_DLG_16,
      FORM_COL_DLG_17,
    ]);
  }
};

const seeDepartureForm = seeTrailerFn([...departureForm(), FORM_COL_DLG_20]);

// 集装箱拖车离港进度反馈
const departureFeedback = () => {
  const seeProgressCol = seeTrailerFn(
    departureForm({ modelType: "progress" }),
    ["ontainerSno", "sealingStripSno", "trailerRowId", "dispatchRemark"]
  );
  return [
    ...seeProgressCol,
    {
      ...FORM_COL_DLG_16,
      labelWidth: "102px",
    },
    FORM_COL_DLG_15,
    {
      ...FORM_COL_DLG_17,
      type: "txt",
      placeholder: "--",
    },
    FORM_COL_DLG_19,
  ];
};

// 一般拖车
const addOtherForm = (handleFn, strView) => {
  const FORM_COL_DLG_302 =
    strView === "operationTrailer"
      ? {
          id: "operationOrderNum", // 操作详情节点
          type: "txt",
        }
      : {
          id: "operationOrderObj",
          placeholder: "请选择",
          noClearable: true,
          isBackAll: true,
          selectLabelKey: "operationOrderNum",
          ...httpOperationListSelect({
            httpRequest: getGeneralJobNo,
            statusSearch: "",
          }),
          handle: handleFn,
        };
  return [
    {
      ...FORM_COL_DLG_13,
      label: "拖车公司：",
      placeholder: "拖车公司",
      selectLabelKey: "shortName",
      span: 12,
    },
    {
      span: 12,
      label: "工作单号：",
      ...FORM_COL_DLG_302,
    },
    {
      ...FORM_COL_DLG_17,
      labelWidth: "102px",
    },
    {
      ...FORM_COL_DLG_14,
      span: 24,
    },
    FORM_COL_DLG_15,
    FORM_COL_DLG_18,
  ];
};

// 一般拖车查看详情
const seeWarehouseArrival = seeTrailerFn([...addOtherForm(), FORM_COL_DLG_20]);

export const editTrailerForm = (colObj = {}) => {
  const {
    tName = "1",
    isSee = false,
    boxFn,
    operationId,
    orderId,
    orderType,
    operationFn,
    operationBtn,
    webViewSource,
  } = colObj;
  let goodsBoxSelect = {};
  if (["1", "2"].includes(tName)) {
    // 5,6 - 其他操作单拖车
    goodsBoxSelect = [5, 6].includes(orderType)
      ? httpOtherFreightSelect({
          orderId,
          orderType,
        })
      : httpBoxSelect({
          operationOrderId: operationId,
        });
  }
  let cols = [];
  if (operationBtn) {
    // 进度反馈
    switch (tName) {
      case "1":
        cols = arrivalFeedback();
        break;
      case "2":
        cols = departureFeedback();
        break;
      case "3":
        cols = generalTrailer();
        break;
    }
  } else {
    if (!isSee) {
      // 编辑状态
      switch (tName) {
        case "1":
          cols = arrivalForm({ boxFn, goodsBoxSelect });
          break;
        case "2":
          cols = departureForm({ boxFn, goodsBoxSelect });
          break;
        default:
          cols = addOtherForm(operationFn, webViewSource);
      }
    } else if (isSee) {
      // 查看状态
      switch (tName) {
        case "1":
          cols = seeArrivalForm;
          break;
        case "2":
          cols = seeDepartureForm;
          break;
        default:
          cols = seeWarehouseArrival;
      }
    }
  }
  return [
    {
      fieldList: [
        {
          width: 960,
          rows: [
            {
              cols,
            },
          ],
        },
      ],
    },
  ];
};

// 表单校验规则
export const formRules = (type) => {
  const txt = type == 0 ? "拖车行" : "拖车公司";
  let editRules = {};
  if (type == 1) {
    editRules = {
      trailerRowId: [
        { required: true, message: `请选择${txt}`, trigger: "change" },
      ],
      operationOrderObj: [
        { required: true, message: `请选择工作单号`, trigger: "change" },
      ],
    };
  } else {
    editRules = {
      boxCode_obj: [
        { required: true, message: "请选择整柜信息", trigger: "change" },
      ],
      pickBoxId: [
        { required: true, message: "请选择提柜地点", trigger: "change" },
      ],
      totalWeight: [
        { required: true, message: "请输入货物重量", trigger: "change" },
      ],
    };
  }
  return editRules;
};

const FORM_ADDRESS_COL_1 = {
  span: 13,
  id: "address_obj",
  label: "地址信息：",
  placeholder: "此处选择地址",
};
const FORM_ADDRESS_COL_2 = {
  span: 11,
  id: "company",
  label: "公司：",
  placeholder: "此处填写公司",
  type: "text",
};
const FORM_ADDRESS_COL_3 = {
  span: 9,
  id: "contactPhone",
  label: "联系人信息：",
  type: "slot",
};
const FORM_ADDRESS_COL_4 = {
  span: 4,
  id: "contactName",
  label: "",
  labelWidth: "0px",
  type: "slot",
};
const FORM_ADDRESS_COL_5 = {
  span: 11,
  id: "presentTime",
  label: "到场时间：",
  placeholder: "此处选择到场时间",
  type: "datetime",
  valueFormat: "yyyy/MM/dd HH:mm:ss",
};
const FORM_ADDRESS_COL_6 = {
  span: 24,
  id: "addressDetail",
  label: "地址：",
  placeholder: "此处填写地址",
  type: "textarea",
};
const FORM_ADDRESS_COL_7 = {
  span: 24,
  id: "editSlotBtn",
  label: "",
  labelWidth: "0px",
  type: "slot",
};

const SEE_FORM_ADDRESS_COL_1 = {
  span: 8,
  id: "presentTime",
  label: "到场时间：",
  type: "txt",
};
const SEE_FORM_ADDRESS_COL_2 = {
  span: 8,
  id: "company",
  label: "公司：",
  type: "txt",
};
const SEE_FORM_ADDRESS_COL_3 = {
  span: 8,
  id: "contactName",
  label: "联系人信息：",
  type: "txt",
  render: (row) => `${row.contactName || "--"}/${row.contactPhone || "--"}`,
};
const SEE_FORM_ADDRESS_COL_4 = {
  span: 16,
  id: "addressDetail",
  // label: "地址：",
  labelWidth: "0px",
  type: "slot",
};
const SEE_FORM_ADDRESS_COL_5 = {
  span: 8,
  id: "seeSlotBtn",
  label: "",
  labelWidth: "0px",
  type: "slot",
};
export const addressCols = (aObj = {}) => {
  const { addressFn, customerId, tabType = 0, operationId } = aObj;
  const httpAddressList =
    tabType === 0
      ? httpTotalWarehouseList({
          customerId,
        })
      : httpTrailerAddressList({
          operationId, // 一般拖车查询全部
        });
  return [
    {
      ...FORM_ADDRESS_COL_1,
      isBackAll: true,
      autoSlotRight: true,
      autoClassName: "base-flex-between",
      ...httpAddressList,
      handle: addressFn,
    },
    FORM_ADDRESS_COL_2,
    FORM_ADDRESS_COL_3,
    FORM_ADDRESS_COL_4,
    FORM_ADDRESS_COL_5,
    FORM_ADDRESS_COL_6,
    // FORM_ADDRESS_COL_7
  ];
};
const SEE_FORM_ADDRESS_COLS = [
  SEE_FORM_ADDRESS_COL_1,
  SEE_FORM_ADDRESS_COL_2,
  SEE_FORM_ADDRESS_COL_3,
  SEE_FORM_ADDRESS_COL_4,
  SEE_FORM_ADDRESS_COL_5,
];
export const addressForm = (colObj = {}) => {
  const { itemEdit, ...cObj } = colObj;
  return [
    {
      fieldList: [
        {
          width: itemEdit ? null : 960,
          rows: [
            {
              cols: itemEdit ? addressCols(cObj) : SEE_FORM_ADDRESS_COLS,
            },
          ],
        },
      ],
    },
  ];
};

// 地址表单校验规则
export const addressFormRules = () => {
  let editRules = {
    company: [{ required: true, message: "请填写公司", trigger: "change" }],
    contactPhone: [
      { required: true, message: "请填写手机号", trigger: "change" },
    ],
    contactName: [{ required: true, message: "请填写姓名", trigger: "change" }],
    addressDetail: [
      { required: true, message: "请填写地址", trigger: "change" },
    ],
    presentTime: [
      { required: true, message: "请选择到场时间", trigger: "change" },
    ],
  };
  return editRules;
};

//进度反馈与查看详情共用，ROW有数值就是进度反馈，没数值就是查看详情
export const feedbackFormRules = (row) => {
  let editRules = {};
  if (row) {
    editRules = {
      ontainerSno: [
        { required: true, message: "请输入箱号", trigger: "change" },
      ],
      sealingStripSno: [
        { required: true, message: "请输入封号", trigger: "change" },
      ],
    };
  }
  return editRules;
};
