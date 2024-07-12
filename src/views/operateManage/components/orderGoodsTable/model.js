import { toFixedNum, interceptNum } from "@/utils/instructions";
import {
  tableColumns_verify, // 核实货物
  tableColumns_prediction, // 预报货物
  tableColumns_quick, // 预报货物-快速下单
} from "../tableModel";

export const orderEcVerifyGoodsCols = () => ({
  title: "核实货物信息",
  btnRight: [
    {
      text: "导出",
      btnKey: 1,
    },
  ],
  totalCol: [
    {
      label: "总箱数：",
      prop: "warehousingQuantity",
      decimal: 0,
    },
    {
      label: "总体积：",
      prop: "warehousingTotalVolume",
      decimal: 2,
      util: "CBM",
    },
    {
      label: "总毛重：",
      prop: "warehousingTotalWeight",
      decimal: 2,
      util: "KG",
    },
  ],
  columns: tableColumns_verify(),
});

export const orderEcGoodsCols = (isQuick) => ({
  title: "预报货物信息",
  totalCol: [
    {
      label: "总箱数：",
      prop: "totalBoxCount",
      vProp: "warehousingQuantity",
      decimal: 0,
    },
    {
      label: "总体积：",
      prop: "totalVolume",
      vProp: "warehousingTotalVolume",
      decimal: 2,
      util: "CBM",
    },
    {
      label: "总毛重：",
      prop: "totalWeight",
      vProp: "warehousingTotalWeight",
      decimal: 2,
      util: "KG",
    },
  ],
  columns: isQuick ? tableColumns_quick : tableColumns_prediction,
});
