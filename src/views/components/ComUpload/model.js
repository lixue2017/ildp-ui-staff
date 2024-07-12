import { getToken } from "@/utils/auth";

const ENV_BASE_API = process.env.VUE_APP_BASE_API;

export const defaultParams = {
  type: "picture-card",
  className: "card-uploader",
  name: "files",
  headers: { Authorization: "Bearer " + getToken() },
  url: ENV_BASE_API + "/customer/order/attach/uploads",
  uploadData: {}, //上传接口参数
  showFileList: true,
  imgUrl: "",
  limit: 100, //上传数量限制
  multiple: false, //是否可多选上传
  fileList: [], //上传文件列表
  autoUpload: true, //设置为true时beforeAvatarUpload才生效
  fragmentationUpload: true, // 默认设置20m以上分片上传
  fragmentationSize: 20 * 1024 * 1024, // 文件大于20m分片上传
  size: 100, //文件大小
  accept: ".jpeg, .jpg, .png, .bmp", //上传文件格式
  text: {
    btnText: "点击上传",
    tipsText: "大小不超过5M，支持jpg、png、bmp格式", //动态文案
  },
};

export const defaultTextParams = {
  ...defaultParams,
  type: "text",
  className: "text-uploader",
  fileList: [],
  size: 1000,
  multiple: true, //是否可多选上传
  accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.rar,.zip",
  text: {
    btnText: "点击上传",
  },
};

export const crmFileUploadUrl = ENV_BASE_API + "/crm/attach/fileUpload";
export const WATER_BILL_TEMPLATE =
  ENV_BASE_API + "/common/download/template?fileName=waterBillTemplate.xlsx"; // 结算管理/水单模板/后续需要选择公司
export const NEW_WATER_BILL_TEMPLATE =
  ENV_BASE_API + "/common/download/template?fileName=waterBillAccTemplate.xlsx"; // 结算管理/水单模板/后续不需要选公司
export const importWaterBillUrl = ENV_BASE_API + "/settle/bank/receipt/import"; // 结算管理/导入水单
export const newImportWaterBillUrl =
  ENV_BASE_API + "/settle/bank/receipt/importAcc"; // 结算管理/新导入水单，配合NEW_WATER_BILL_TEMPLATE使用
export const IMPORT_COST_PARTITION_TEMPLATE =
  "https://www.baosencloud.com/profile/upload/partitionTemplate.xlsx"; // 一件代发方案/基础信息/分区信息、分区明细模板
export const importCostPartition =
  ENV_BASE_API + "/costPartitionInfo/importExcel"; // 一件代发方案/基础信息/分区信息、分区明细导入

/**
 * 附件类型：不确定类型传 -1
 * 整箱POD=10;订单POD=20;客户下单=30;POA资料=40;订舱资料=50;报关放行资料=60;
 * 客户拖车资料=70;拖车资料=80;清关资料=90;客户报关资料=100;保险资料=110;个人报销=120;
 * 付款=121;借款=122;发票=123;应付账单合同=124;应付账单发票=125;收款水单=126;付款水单=127;
 * 收款核销=128;付款核销=129;应付账单其他=130;应收账单合同=131;付款申请=132;
 * 发票附件=140;
 * 清关直清订单=160;清关派送订单=161;清关存仓订单=162;一件代发快递面单=150;未知退仓认领=250
 * 企业合同=200
 *
 * resultType=1 返回URL
 */
export const fileTypeUploadUrl =
  ENV_BASE_API + "/customer/order/attach/uploadsNew";
export const importGoodsRelationProduct =
  ENV_BASE_API + "/customer/product/preview/importGoodsRelationProduct"; // 已核实导入货物

export const importClearanceProductInvoice =
  ENV_BASE_API + "/clearanceGoods/importClearanceProductInvoice"; // 导入单箱发票
export const INVOICE_EC_IMPORT_TEMPLATE =
  "https://www.baosencloud.com/profile/upload/invoiceEcImportTemplate.xlsx"; // 单箱发票模板
// 分片文件上传
export const chunkFileUploadUrl =
  ENV_BASE_API + "/customer/order/attach/chunkFileUpload1";
// 合并分片上传文件
export const chunkMergeUploadUrl =
  ENV_BASE_API + "/customer/order/attach/merge";
export const IMPORT_STORAGE_URL =
  ENV_BASE_API + "/warehouse/location/documentListing"; // 导入上架
export const CRM_ATTACH_URL = ENV_BASE_API + "/crm/attach/fileUpload"; // CRM上传附件
export const FOLLOW_IMPORT_EXCEL = ENV_BASE_API + "/crm/follow/importExcel"; // crm导入跟进任务
export const CONTACT_IMPORT_EXCEL =
  ENV_BASE_API + "/crm/salesLeadsContact/importExcel"; // crm导入联系人
