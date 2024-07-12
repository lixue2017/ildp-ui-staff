import {
  httpFBAWarehouseSelect,
  httpPartitionSelect,
  httpLocationTypeSelect,
} from "@/comModel/warehouse";
import {
  httpCustomerSelect,
  httpPOSTApiConfigGetPage,
} from "@/comModel/httpSelect";
import { toFixedNum } from "@/utils/instructions";
import overseaLangObj from "@/language/overseasLang.js";

const EDIT_COL_1 = {
  span: 12,
  id: "warehouseCode",
  label: `${overseaLangObj.ck_dm || "仓库代码"}：`,
  type: "txt",
};
const EDIT_COL_2 = {
  span: 12,
  id: "warehouseName",
  label: `${overseaLangObj.ck_name || "仓库名称"}：`,
  type: "txt",
};
const EDIT_COL_3 = {
  span: 12,
  id: "nationTwoCode",
  label: `${overseaLangObj.gj_country || "国家"}：`,
  type: "txt",
  render: (row) => `${row.nationTwoCode}[${row.nationName}]`,
};
const EDIT_COL_4 = {
  span: 12,
  id: "platformType",
  label: `${overseaLangObj.rk_type("平台类型")}：`,
  type: "txt",
  basicType: "warehouseType",
};
const EDIT_COL_5 = {
  span: 24,
  id: "detailAddress",
  label: `${overseaLangObj.dz_address("仓库地址")}：`,
  type: "txt",
  className: "detail-address",
};
const EDIT_COL_6 = {
  span: 12,
  id: "contacts",
  label: `${overseaLangObj.lxr_contacts || "联系人"}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_7 = {
  span: 12,
  id: "timezone",
  label: "时区：",
  placeholder: "此处选择时区",
  type: "select",
  basicType: "status",
};
const EDIT_COL_8 = {
  span: 12,
  id: "phone",
  label: `${overseaLangObj.lx_dh_telephone("联系人电话")}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_9 = {
  span: 12,
  id: "type",
  label: `${overseaLangObj.lx_type("类型")}：`,
  type: "radio",
  basicType: "haveWarehouseType",
};
const EDIT_COL_10 = {
  span: 12,
  id: "email",
  label: `${overseaLangObj.contact_email("联系邮箱")}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_11 = {
  span: 12,
  id: "totalAcreage",
  label: `${overseaLangObj.ck_zmj || "仓库总面积"}：`,
  placeholder: "请输入",
  type: "slot",
};
const EDIT_COL_12 = {
  span: 24,
  id: "remark",
  label: `${overseaLangObj.bz_remark("简介")}：`,
  placeholder: "请输入",
  type: "textarea",
};
const EDIT_COL_13 = {
  span: 12,
  id: "customerComId",
  selectLabelKey: "customerComName",
  label: "关联分公司：",
  ...httpCustomerSelect({ clientIdentity: 0 }),
};
const EDIT_COL_14 = {
  span: 12,
  id: "apiId",
  selectLabelKey: "apiName",
  label: "api：",
  ...httpPOSTApiConfigGetPage({
    apiType: 2,
  }),
};

export const editFormCols = () => {
  return {
    columns: [
      EDIT_COL_1,
      EDIT_COL_2,
      EDIT_COL_3,
      EDIT_COL_4,
      EDIT_COL_5,
      EDIT_COL_13,
      EDIT_COL_9,
      EDIT_COL_6,
      // EDIT_COL_7,
      EDIT_COL_8,

      EDIT_COL_10,
      EDIT_COL_11,
      EDIT_COL_14,
      EDIT_COL_12,
    ],
    formRules: {
      contacts: [{ required: true, message: "请填写联系人", trigger: "blur" }],
      customerComId: [
        { required: true, message: "请选择关联分公司", trigger: "change" },
      ],
      type: [{ required: true, message: "请选择类型", trigger: "change" }],
    }, // 表单校验规则
  };
};

const EDIT_COL_2_1 = (warehouseId) => {
  return {
    span: 24,
    id: "warehouseId",
    label: `${overseaLangObj.ck_lb("所属仓库")}：`,
    ...httpFBAWarehouseSelect("2", { warehouseId }),
  };
};
const EDIT_COL_2_1_SEE = {
  span: 24,
  id: "warehouseName",
  label: `${overseaLangObj.ck_lb("所属仓库")}：`,
  type: "txt",
};
const EDIT_COL_2_2 = {
  span: 24,
  id: "code",
  label: `${overseaLangObj.fq_code || "分区代码"}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_2_3 = {
  span: 24,
  id: "nameCn",
  label: `${overseaLangObj.fq_cn_name("分区名称(CN)")}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_2_4 = {
  span: 24,
  id: "nameEn",
  label: `${overseaLangObj.fq_en_name("分区名称(EN)")}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_2_5 = {
  span: 24,
  id: "type",
  label: `${overseaLangObj.fq_type || "分区类型"}：`,
  type: "radio",
  basicType: "warehousePartitionType",
};
const EDIT_COL_2_6 = {
  span: 24,
  id: "remark",
  label: `${overseaLangObj.bz_remark()}：`,
  placeholder: "请输入",
  type: "textarea",
  maxlength: 200,
};
export const partitionFormCols = (isSee, rowId, warehouseId) => {
  const EDIT_SEE_COL_2_1 =
    isSee || rowId ? EDIT_COL_2_1_SEE : EDIT_COL_2_1(warehouseId);
  const partitionCols = [
    EDIT_SEE_COL_2_1,
    EDIT_COL_2_2,
    EDIT_COL_2_3,
    EDIT_COL_2_4,
    EDIT_COL_2_5,
    EDIT_COL_2_6,
  ];
  if (isSee) {
    return {
      columns: partitionCols.map((e) => {
        let colItem = {
          ...e,
          type: e.type !== "radio" ? "txt" : e.type,
          placeholder: "--",
        };
        if (e.type === "radio") {
          colItem.disable = true;
        }
        return colItem;
      }),
    };
  }
  return {
    columns: partitionCols,
    formRules: {
      warehouseId: [
        { required: true, message: "请选择所属仓库", trigger: "change" },
      ],
      code: [{ required: true, message: "请填写分区代码", trigger: "blur" }],
      nameCn: [
        { required: true, message: "请填写分区名称(CN)", trigger: "blur" },
      ],
      type: [{ required: true, message: "请选择分区类型", trigger: "change" }],
    }, // 表单校验规则
  };
};

const EDIT_COL_3_2 = {
  span: 24,
  id: "warehouseName",
  label: `${overseaLangObj.ck_lb("所属仓库")}：`,
  type: "txt",
};
const EDIT_COL_3_3 = (warehouseId) => {
  return {
    span: 24,
    id: "type",
    label: `${overseaLangObj.kw_lx("库位类型")}：`,
    noSlotLabel: true,
    ...httpLocationTypeSelect(warehouseId),
  };
};
const EDIT_COL_3_4 = {
  span: 12,
  id: "freightShelfId",
  label: `${overseaLangObj.goods_shelves("排货架")}：`,
  max: 200,
  type: "slot",
};
const EDIT_COL_3_4_2 = {
  span: 6,
  id: "rowNo",
  labelWidth: "0px",
  type: "slot",
};
const EDIT_COL_3_4_3 = {
  span: 6,
  id: "no",
  labelWidth: "0px",
  type: "slot",
};
const EDIT_COL_3_5 = {
  span: 24,
  id: "code",
  label: `${overseaLangObj.kw_location("库位代码")}：`,
  type: "txt",
};
const EDIT_COL_3_6 = {
  span: 24,
  id: "pickingFreightType",
  label: `${overseaLangObj.jh_type || "拣货类型"}：`,
  type: "radio",
  basicType: "pickingFreightType",
};

export const locationFormCols = (Fn, isSee, warehouseId) => {
  const EDIT_COL_3_1 = {
    span: 24,
    id: "warehousePartitionId",
    label: `${overseaLangObj.fq_name("库位分区")}：`,
    isBackAll: true,
    ...httpPartitionSelect(warehouseId),
    handle: (val) => {
      // 选中值发生变化时触发
      Fn && Fn(val);
    },
  };
  let locationCols = [EDIT_COL_3_1, EDIT_COL_3_2, EDIT_COL_3_3(warehouseId)];
  if (!isSee) {
    locationCols = [
      ...locationCols,
      EDIT_COL_3_4,
      EDIT_COL_3_4_2,
      EDIT_COL_3_4_3,
    ];
  }
  locationCols = [...locationCols, EDIT_COL_3_5, EDIT_COL_3_6, EDIT_COL_2_6];
  if (isSee) {
    return {
      columns: locationCols.map((e) => {
        if (e.id === "warehousePartitionId") {
          e.id = "warehousePartitionName";
        }
        if (e.id === "type") {
          e.id = "typeName";
        }
        let colItem = {
          ...e,
          type: e.type !== "radio" ? "txt" : e.type,
          placeholder: "--",
        };
        if (e.type === "radio") {
          colItem.disable = true;
        }
        return colItem;
      }),
    };
  }
  return {
    columns: locationCols,
    formRules: {
      warehousePartitionId: [
        { required: true, message: "请选择库位分区", trigger: "change" },
      ],
      type: [{ required: true, message: "请选择库位类型", trigger: "change" }],
      freightShelfId: [
        { required: true, message: "请填写排货架", trigger: "blur" },
        {
          message: "排货架不能输入中文",
          pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
          trigger: "blur",
        },
      ],
      rowNo: [
        { required: true, message: "请填写几排", trigger: "blur" },
        {
          message: "排数不能输入中文",
          pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
          trigger: "blur",
        },
      ],
      no: [
        { required: true, message: "请填写多少号", trigger: "blur" },
        {
          message: "号不能输入中文",
          pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
          trigger: "blur",
        },
      ],
      pickingFreightType: [
        { required: true, message: "请选择拣货类型", trigger: "change" },
      ],
    }, // 表单校验规则
  };
};

const EDIT_COL_4_1 = {
  span: 24,
  id: "code",
  label: `${overseaLangObj.kw_lx_dm || "库位类型代码"}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_4_2 = {
  span: 24,
  id: "nameCn",
  label: `${overseaLangObj.lx_cn_name || "类型名称(CN)"}：`,
  noSlotLabel: true,
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_4_3 = {
  span: 24,
  id: "nameEn",
  label: `${overseaLangObj.lx_en_name || "类型名称(EN)"}：`,
  placeholder: "请输入",
  type: "text",
};
const EDIT_COL_4_4 = (warehouseId) => {
  return {
    span: 24,
    id: "warehouseId",
    label: `${overseaLangObj.ck_lb("所属仓库")}：`,
    ...httpFBAWarehouseSelect("2", { warehouseId }),
  };
};
const EDIT_COL_4_5 = {
  span: 12,
  id: "length",
  label: `${overseaLangObj.c_length()}：`,
  placeholder: "长度",
  type: "slot",
};
const EDIT_COL_4_6 = {
  span: 12,
  id: "width",
  label: `${overseaLangObj.k_width()}：`,
  placeholder: "宽度",
  type: "slot",
};
const EDIT_COL_4_7 = {
  span: 12,
  id: "height",
  label: `${overseaLangObj.g_height()}：`,
  placeholder: "高度",
  type: "slot",
};
const EDIT_COL_4_8 = {
  span: 12,
  id: "volume",
  label: `${overseaLangObj.tj_m_volume || "体积/m³"}：`,
  type: "txt",
  decimal: 4,
};
const SEE_COL_4_1 = {
  span: 24,
  id: "ckgSee",
  label: `${overseaLangObj.c_k_g()}：`,
  type: "txt",
  render: (row) =>
    `${toFixedNum(row.length)} * ${toFixedNum(row.width)} * ${toFixedNum(
      row.height
    )}`,
};
const SEE_COL_4_2 = {
  span: 24,
  id: "tjSee",
  label: `${overseaLangObj.tj_m_volume || "体积/m³"}：`,
  type: "txt",
  decimal: 4,
};

export const locationTypeFormCols = (isSee, warehouseId) => {
  const locationTypeCols = [
    EDIT_COL_4_1,
    EDIT_COL_4_2,
    EDIT_COL_4_3,
    EDIT_COL_4_4(warehouseId),
  ];
  if (isSee) {
    const seeLocationTypeCols = locationTypeCols.map((e) => {
      if (e.id === "warehouseId") {
        e.id = "warehouseName";
      }
      return {
        ...e,
        type: "txt",
        placeholder: "--",
      };
    });
    return {
      columns: [
        ...seeLocationTypeCols,
        SEE_COL_4_1,
        SEE_COL_4_2,
        {
          ...EDIT_COL_2_6,
          type: "txt",
          placeholder: "--",
        },
      ],
    };
  }
  return {
    columns: [
      ...locationTypeCols,
      EDIT_COL_4_5,
      EDIT_COL_4_6,
      EDIT_COL_4_7,
      EDIT_COL_4_8,
      EDIT_COL_2_6,
    ],
    formRules: {
      code: [
        { required: true, message: "请填写库位类型代码", trigger: "blur" },
      ],
      nameCn: [
        { required: true, message: "请填写类型名称(CN)", trigger: "blur" },
      ],
      length: [{ required: true, message: "请填写长度", trigger: "blur" }],
      width: [{ required: true, message: "请填写宽度", trigger: "blur" }],
      height: [{ required: true, message: "请填写高度", trigger: "blur" }],
    }, // 表单校验规则
  };
};
