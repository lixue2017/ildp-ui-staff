/**
 * 下载URL import { requestUrl } from "@/api/downloadUrl";
 */
export const requestUrl = {
  // post请求接口
  postBatchBillDownloadUrl: "/settle/bill/batchDownDzd", // 应收应付对账单批量下载
  postBatchPaymentDownloadUrl: "/settle/bill/batchDownFksqd", // 付款申请单批量下载
  postPlatformExportFeesUrl: "/settle/accounts/exportFees", // 一件代发导出费用
  urlDownloadDeliveryNote: "/distributionAttachRef/batchDownAttach", // 批量下载快递

  // 下载模板
  getListingTemplate:
    "https://www.baosencloud.com/profile/upload/documentListing.xls", // 存仓上架模板
};
