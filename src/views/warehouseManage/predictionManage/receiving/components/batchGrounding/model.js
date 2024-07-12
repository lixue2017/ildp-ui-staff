import { getDictObj } from "@/utils/index";
import { postBatchPushLocation } from "@/api/warehouse/manage";
import overseaLangObj from "@/language/overseasLang.js";

/** 退仓有引用 */
export const httpPushLocationSelect = () => {
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: postBatchPushLocation,
    getCustomData: (item) => {
      return {
        key: item.id,
        value: item.id,
        label: `${item.kuqu || "--"}${item.kuwei || ""}(${
          getDictObj("warehousePartitionType", item.kuqulwixing) || "--"
        })`,
      };
    },
  };
};

export const tableBatchColumn = () => {
  return [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      prop: "customerShortName",
      label: overseaLangObj.wtr_customer || "委托人",
      minWidth: 140,
      showOverflowTooltip: true,
    },
    {
      prop: "storageMode",
      label: overseaLangObj.storage_type || "存库方式",
      showOverflowTooltip: true,
      // fontColor: true,
      width: 90,
      basicType: "wmsStorageMode",
    },
    {
      prop: "traySn",
      label: overseaLangObj.tp_bh || "托盘编号",
      minWidth: 140,
      showOverflowTooltip: true,
    },
    {
      prop: "locationSlot",
      label: overseaLangObj.sj_location || "上架库位",
      minWidth: 160,
      customRow: true,
      request: true,
      fieldItem: {
        id: "kwId",
        // selectLabelKey: "kqkw", // 导入时显示的属性名
        size: "mini",
        ...httpPushLocationSelect(),
      },
    },
  ];
};
