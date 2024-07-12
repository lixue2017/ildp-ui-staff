import {
  httpFBAWarehouseSelect,
  httpPartitionSelect,
  httpLocationShelfSelect,
  httpCurrentWarehouseSelect,
} from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

const warehouse = {
  span: 8,
  id: "warehouseId",
  label: `${overseaLangObj.dq_wz || "当前位置"}：`,
  noClearable: true,
  noPaging: true,
  isAutoInitRequest: true,
  className: "margin-bottom-0",
  // ...httpFBAWarehouseSelect('2'),
  ...httpCurrentWarehouseSelect(),
  // getCustomData: (item, dics) => {
  //   const { nationTwoCode, nationName,id } = item
  //   const { address, warehouseName, warehouseMainId } = item.cusWarehouse || {}
  //   let title = item.warehouseCode
  //   if (warehouseName) {
  //     title += `/${warehouseName}`
  //   }
  //   let subtitle = ''
  //   if (dics.dicsData.warehouseType) {
  //     subtitle += dics.dicsData.warehouseType[item.platformType]?.nameCn || '--'
  //   }
  //   if (nationTwoCode) {
  //     subtitle += `${subtitle ? '/' : ''}${nationTwoCode}`
  //   }
  //   if (nationName) {
  //     subtitle += `[${nationName}]`
  //   }
  //   if (address) {
  //     subtitle += `${subtitle ? '/' : ''}${address}`
  //   }
  //   return {
  //     key: item['warehouseId'],
  //     label: title,
  //     // value: item[itemId],
  //     value: id,//需要传主单ID
  //     title: title,
  //     subtitle,
  //   }
  // }
};

const warehousePartition = {
  span: 8,
  id: "warehousePartitionId",
  label: `${overseaLangObj.sz_qq() || "区域"}：`,
  labelWidth: "50px",
  noClearable: true,
  focusLoad: true,
  noPaging: true,
  isAutoInitRequest: true,
  className: "margin-bottom-0",
  refreshRequest: false,
  ...httpPartitionSelect(),
};
const warehouseTray = {
  span: 8,
  id: "shelfId",
  label: `${overseaLangObj.goods_shelves() || "货架"}：`,
  labelWidth: "50px",
  focusLoad: true,
  noPaging: true,
  isAutoInitRequest: true,
  className: "margin-bottom-0",
  refreshRequest: false,
  ...httpLocationShelfSelect(26),
};

const careList = [
  {
    label: overseaLangObj.phj_zs || "排货架总数",
    prop: "racksTotal",
    color: "#515151",
    background: "#8B8B8B",
    img: "racksTotalImg",
  },
  {
    label: overseaLangObj.sy_usage || "使用数",
    prop: "usage",
    color: "#5094FF",
    img: "usageImg",
  },
  {
    label: overseaLangObj.idle_num || "空闲数",
    prop: "idleNum",
    color: "#53C88A",
    img: "idleNumImg",
  },
];

export { warehouse, warehousePartition, warehouseTray, careList };
