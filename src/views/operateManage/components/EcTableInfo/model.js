import { toFixedNum, interceptNum } from "@/utils/instructions";
import {
  tableColumns_invoice, // 客户箱单
  tableColumns_verify, // 核实货物
  tableColumns_prediction, // 预报货物
} from "../tableModel";
export const customerInvoiceTable = {
  title: "客户箱单发票",
  btnRight: [
    {
      text: "箱单发票导出",
      key: 6,
      canEditInvoice: 1,
      hideMainBill: [3],
    },
    {
      text: "箱单发票导入",
      key: 7,
      canEditInvoice: 1,
      hideMainBill: [3],
    },
    {
      text: "维护箱单发票信息",
      key: 8,
      plain: true,
      canEditInvoice: 1,
      hideMainBill: [3],
    },
  ],
  grossTotal: [
    {
      label: "箱数：",
      prop: "totalBoxCount",
      decimal: 0,
    },
    {
      label: "总体积：",
      prop: "totalVolume",
      decimal: 3,
      util: "CBM",
    },
    {
      label: "总毛重：",
      prop: "totalWeight",
      decimal: 2,
      util: "KG",
    },
  ],
  columns: tableColumns_invoice,
};
export const goodsTable = (isCabinet) => ({
  title: "核实货物信息",
  btnRight: [
    {
      text: "发送邮箱",
      key: "goodsEmail",
      noEncasementWay: [0], // FCL不显示
      plain: true,
    },
    {
      text: "货物导入",
      key: 2,
      invoiceStatus: 2,
      invoice: [1],
      hideMainBill: [3],
    },
    {
      text: "货物导出",
      key: 3,
      invoiceStatus: 2,
      invoice: [1],
      hideMainBill: [3],
    },
    {
      text: "运单导出",
      key: "verifyGoods",
      // showConceal: [0],
    },
    {
      text: "维护货物信息",
      key: 1,
      plain: true,
      showConceal: [0],
      invoice: [1],
      hideMainBill: [3],
    },
  ],
  grossTotal: [
    {
      label: "箱数：",
      prop: isCabinet ? "quantity" : "warehousingQuantity",
      decimal: 0,
    },
    // {
    //   label: '产品数小计：',
    //   prop: 'totalProductCount',
    //   decimal: 0
    // },
    {
      label: "总体积：",
      prop: isCabinet ? "totalVolume" : "warehousingTotalVolume",
      decimal: 2,
      util: "CBM",
    },
    {
      label: "总毛重：",
      prop: isCabinet ? "totalWeight" : "warehousingTotalWeight",
      decimal: 2,
      util: "KG",
    },
  ],
  columns: tableColumns_verify(isCabinet),
});

// invoiceStatus === 2: 订舱代理是中进宝,有排柜节点的话,要把排柜节点走完
export const predictionGoodsTable = {
  title: "预报货物信息",
  btnRight: [
    {
      text: "货物导出",
      key: 3,
      invoiceStatus: 2,
      invoice: [0],
      hideMainBill: [7],
    },
    {
      text: "货物导入",
      key: 5,
      invoiceStatus: 2,
      invoice: [0],
      hideMainBill: [7],
    },
    {
      text: "维护货物信息",
      key: 4,
      plain: true,
      invoiceStatus: 2,
      invoice: [0],
      hideMainBill: [7],
    },
  ],
  grossTotal: [
    {
      label: "箱数：",
      propTop: "calcBoxCount",
      propBtm: "warehousingQuantity",
      decimal: 0,
    },
    {
      label: "总体积：",
      propTop: "calcVolume",
      propBtm: "warehousingTotalVolume",
      decimal: 2,
      util: "CBM",
    },
    {
      label: "总毛重：",
      propTop: "calcWeight",
      propBtm: "warehousingTotalWeight",
      decimal: 2,
      util: "KG",
    },
  ],
  columns: tableColumns_prediction,
};

export const cabinetTable = {
  title: "整柜信息",
  btnRight: [
    {
      text: "登记整柜集装箱",
      key: 0,
      isMainBill: [1, 9],
    },
  ],
  grossTotal: [
    {
      label: "重量(KG)：",
      prop: "warehousingTotalWeight",
      decimal: 2,
    },
    {
      label: "体积(CBM)：",
      prop: "warehousingTotalVolume",
      decimal: 2,
    },
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "柜型",
      prop: "boxSizeCode",
      showOverflowTooltip: true,
      customRow: true,
      width: 100,
    },
    // {
    //   label: "柜量",
    //   prop: "boxCount",
    //   showOverflowTooltip: true,
    //   customRow: true,
    //   decimal: 0,
    //   align: 'right',
    //   minWidth: 100
    // },
    {
      label: "重量(KG)",
      prop: "warehousingTotalWeight",
      showOverflowTooltip: true,
      decimal: 2,
      minWidth: 120,
      // customRow: true,
      align: "right",
    },
    {
      label: "体积(CBM)",
      prop: "warehousingTotalVolume",
      showOverflowTooltip: true,
      decimal: 2,
      minWidth: 120,
      align: "right",
    },
    // {
    //   label: "重量小计(KG)",
    //   prop: "subtotalWeight",
    //   showOverflowTooltip: true,
    //   decimal: 2,
    //   minWidth: 120,
    //   customRow: true,
    //   align: 'right'
    // },
    {
      label: "集装箱编号",
      prop: "ontainerSno",
      minWidth: 120,
      showOverflowTooltip: true,
    },
    {
      label: "密封条编号",
      prop: "sealingStripSno",
      minWidth: 120,
      showOverflowTooltip: true,
    },
    {
      label: "柜重/KG",
      prop: "containerWeight",
      width: 120,
      align: "right",
      decimal: 2,
      showOverflowTooltip: true,
    },
    // {
    //   label: "品名",
    //   prop: "warehousingProductName",
    //   showOverflowTooltip: true
    // },
    // {
    //   label: "海关编码",
    //   prop: "customsCode",
    //   minWidth: 100,
    //   showOverflowTooltip: true
    // },
    {
      label: "SO No.",
      prop: "sono",
      minWidth: 120,
      showOverflowTooltip: true,
    },
  ],
};

export const pickTable = {
  title: "提货信息",
  grossTotal: [
    {
      label: "合计箱数：",
      prop: "takeBoxCount",
    },
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "提货信息",
      prop: "takeInfos",
      showOverflowTooltip: true,
    },
    {
      label: "提货地址",
      prop: "address",
      showOverflowTooltip: true,
    },
    {
      label: "Shipment ID",
      prop: "shipmentId",
      showOverflowTooltip: true,
    },
    {
      label: "FBA箱号",
      prop: "boxNumber",
      showOverflowTooltip: true,
    },
    {
      label: " 提货箱数",
      prop: "takeBoxCount",
      align: "center",
      showOverflowTooltip: true,
    },
  ],
};

export const productTable = {
  title: "产品信息",
  grossTotal: [
    //   {
    //   label: '产品总类：',
    //   prop: 'singleBoxNum'
    // },
    {
      label: "产品总数：",
      prop: "singleBoxNum",
      decimal: 0,
    },
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      prop: "volume",
      width: 70,
      align: "center",
      customRow: true,
    },
    {
      labelTop: "唛头",
      labelBottom: "名称",
      prop: "sku",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
      minWidth: 80,
    },
    {
      labelTop: "HS CODE",
      labelBottom: "ASIN",
      prop: "code",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
    },
    {
      labelTop: "产品毛量(KG)",
      labelBottom: "产品净重(KG)",
      prop: "weight",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
      align: "right",
    },
    {
      labelTop: "申报价格",
      labelBottom: "数量",
      prop: "declaredValue",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
      align: "right",
    },
    {
      labelTop: "型号",
      labelBottom: "品牌",
      prop: "productModel",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
    },
    {
      labelTop: "产品成分",
      labelBottom: "产品用途",
      prop: "businessUse",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
      width: 90,
    },
    {
      labelTop: "Shipment ID",
      labelBottom: "Reference ID",
      prop: "shipmentId",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
    },
  ],
};
