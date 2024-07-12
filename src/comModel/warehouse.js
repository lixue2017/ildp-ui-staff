// 仓库地址
// import * as comModel from '@/comModel/warehouse.js'
import {
  getPrivateWarehouseList,
  getCustomerWarehouseList,
  getTotalWarehouseList,
} from "@/api/common";
import {
  getPartitionList,
  getLocationTypeList,
  getPackingList,
  getLocationList,
  getWarehouseShelfList,
  logisticsChannelList,
  logisticsProductList,
} from "@/api/warehouse/basic";
import { warehouseShelfLayer } from "@/api/warehouse/manage";
import {
  getWmsForecast,
  getForecastList,
  trayList,
} from "@/api/warehouse/prediction";
import { getWarehousePublicList } from "@/api/publicInterface/index.js";
import { getTrailerAddressList } from "@/api/performance/record";
import { getWarehouseListByDeptId } from "@/api/system/dept";
import { getDeliveryPlaceList } from "@/api/operateRecord/customsClearance";
import { WAREHOUSE_TYPE } from "@/utils/mixin";

/**
 * FBA仓库 statusList: '1' // 状态已启用
 * '0,1,2,3' // 平台类型
 * '2': 自建仓
 */
export const httpFBAWarehouseSelect = (
  platformTypeList = "0,1,2,3",
  obj = {}
) => {
  const { itemId = "warehouseId", itemValue, warehouseId, ...nObj } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getPrivateWarehouseList(
        { ...params, statusList: "1", warehouseId },
        platformTypeList
      ),
    getCustomData: (item, dics) => {
      const { nationTwoCode, nationName } = item;
      const { address, warehouseName, warehouseMainId } =
        item.cusWarehouse || {};
      let title = item.warehouseCode;
      if (warehouseName) {
        title += `/${warehouseName}`;
      }
      let subtitle = "";
      if (dics.dicsData.warehouseType) {
        subtitle +=
          dics.dicsData.warehouseType[item.platformType]?.nameCn || "--";
      }
      if (nationTwoCode) {
        subtitle += `${subtitle ? "/" : ""}${nationTwoCode}`;
      }
      if (nationName) {
        subtitle += `[${nationName}]`;
      }
      if (address) {
        subtitle += `${subtitle ? "/" : ""}${address}`;
      }
      return {
        key: item[itemId],
        label: title,
        // value: item[itemId],
        value: itemValue ? item[itemValue] : warehouseMainId, //需要传主单ID
        title: title,
        subtitle,
        ...nObj, // 拖车编辑需要传递附加参数
      };
    },
  };
};

/**
 * 仓库公共接口 - 主表ID
 * typeList 类型(0 Amazon-亚马逊  1 Jumia-Jumia仓库平台  2自建仓  3三方仓 4私人仓)
 *  *flagAvailable:y+typeList:2,3 为查询国内仓
 * type 部门管理权限类型 1-客户可选仓 2-可操作海外仓
 */
export const httpWarehousePublicSelect = (obj = {}) => {
  const {
    typeList = "2",
    itemId = "parentId",
    flagAvailable,
    isHaveComId,
    salesman,
    permissionType,
    topFlag,
    dataStatusIn,
    customerId,
    countryId,
    includTypeList,
  } = obj;
  return {
    type: "autocomplete",
    searchIdKey: itemId,
    searchParamName: "name",
    httpRequest: (params) => {
      let { sParentMultipleIds, ...nParams } = params;
      if (sParentMultipleIds && sParentMultipleIds.length) {
        nParams.mainIdIn = sParentMultipleIds.join(","); // 多选时的ID查询
      }
      return getWarehousePublicList({
        typeList,
        flagAvailable,
        salesman,
        topFlag,
        type: permissionType,
        dataStatusIn,
        customerId,
        countryId,
        includTypeList,
        ...nParams,
        isHaveComId,
      });
    },
    getCustomData: (item) => {
      const title = `${item.code || "--"}/${item.name || "--"}`;
      return {
        key: item[itemId],
        label: title,
        subtitle: item.address,
        title,
        value: item[itemId],
      };
    },
  };
};

/**
 * 海外提派订单-发货地址
 */
export const httpDeliveryPlaceSelect = (obj = {}) => {
  const { itemId = "id" } = obj;
  return {
    type: "autocomplete",
    searchIdKey: itemId,
    httpRequest: (params) => getDeliveryPlaceList({ ...params }),
    getCustomData: (item) => {
      return {
        key: item[itemId],
        label: item.code,
        subtitle: item.address,
        title: item.code,
        value: item[itemId],
      };
    },
  };
};

/**
 * 目的地
 */
export const httpWarehouseList = {
  type: "autocomplete",
  httpRequest: (params) =>
    getCustomerWarehouseList({
      warehouseCode: params.name,
      nationId: 1, // 国家
      pageNum: params.pageNum,
      pageSize: params.pageSize,
    }),
  getCustomData: (item) => {
    let labelTit = item.warehouseCode;
    if (item.warehouseName) {
      labelTit += `[${item.warehouseName}]`;
    }
    return {
      label: labelTit,
      value: item.id,
      title: labelTit,
      subtitle: item.address,
      consigneeWarehouseCode: item.warehouseCode,
      platformType: item.platformType,
    };
  },
};

/**
 * 获取运送地址
 * 仓库/提货地址/联系人地址
 * shipperType: 0提货地址  1联系人  2港口  3自建仓  4 非自建仓  5仓库
 */
export const httpTotalWarehouseList = (obj) => {
  const { customerId } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getTotalWarehouseList({
        ...params,
        customerId, // 拖车取值范围
      }),
    getCustomData: (item) => {
      const labelTit = item.name || "--";
      const subtitle = `${WAREHOUSE_TYPE[item.shipperType || 0]}/${
        item.addressDetail || "--"
      }`;
      return {
        label: labelTit,
        value: item.childId,
        id: item.childId,
        title: labelTit,
        shipperType: item.shipperType,
        subtitle,
      };
    },
  };
};

/**
 * 当前所在仓
 */
export const httpCurrentWarehouseSelect = (data = {}) => {
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) =>
      getWarehouseListByDeptId({
        ...params,
        ...data,
      }),
    defaultProp: {
      value: "warehouseMainId",
      label: "warehouseCode,warehouseName",
    },
  };
};

/**
 * 一般拖车获取地址信息
 * 仓库/提货地址/联系人地址
 * shipperType: 0提货地址  1联系人  2港口  3自建仓  4 非自建仓  5仓库
 */
export const httpTrailerAddressList = (obj) => {
  const { operationId, type = 2 } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getTrailerAddressList({
        ...params,
        operationOrderId: operationId,
        type, // 2-操作单全部地址
      }),
    getCustomData: (item) => {
      const labelTit = item.name || "--";
      const subtitle = `${WAREHOUSE_TYPE[item.shipperType || 0]}/${
        item.addressDetail || "--"
      }`;
      return {
        label: labelTit,
        value: item.addressId,
        id: item.addressId,
        title: labelTit,
        shipperType: item.shipperType,
        subtitle,
      };
    },
  };
};

/**
 * 库位分区
 * statusSearch: 1 // 已启用
 */
export const httpPartitionSelect = (warehouseId) => {
  return {
    type: "autocomplete",
    searchParamName: "code",
    httpRequest: (params) => {
      const { name, ...nParams } = params;
      return getPartitionList({
        warehouseId,
        ...nParams,
        statusSearch: 1,
      });
    },
    getCustomData: (item) => {
      const { code, nameCn, warehouseName } = item;
      let labelTit = code;
      if (nameCn) {
        labelTit += `[${nameCn}]`;
      }
      return {
        label: labelTit,
        value: item.id,
        title: labelTit,
        subtitle: warehouseName,
      };
    },
  };
};

/**
 * 库位管理
 * statusSearch: 1 // 已启用
 * isMove:1  默认传1，只要不为空就会过滤掉中转数据
 */
export const httpLocationSelect = (row = {}) => {
  const { statusSearch = "1", ...nObj } = row;
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) =>
      getLocationList({
        ...params,
        statusSearch,
        ...nObj,
      }),
    getCustomData: (item, dics, dictObj) => {
      const { code, warehouseName, warehousePartitionName } = item;
      let subregionName = warehousePartitionName; // 库位类型
      if (dictObj.nameCn) {
        subregionName = `${subregionName}/${dictObj.nameCn}`;
      }
      let subtitle = [warehouseName, subregionName];
      return {
        label: code,
        value: item.id,
        title: code,
        subtitleMultiline: subtitle,
      };
    },
  };
};

/**
 * 库位类型
 * statusSearch: 1 // 已启用
 */
export const httpLocationTypeSelect = (warehouseId) => {
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) =>
      getLocationTypeList({
        warehouseId,
        statusSearch: 1,
        ...params,
      }),
  };
};

/**
 * 货架查询
 * statusSearch: 1 // 已启用
 */
export const httpLocationShelfSelect = (warehouseId) => {
  return {
    type: "autocomplete",
    noPage: true,
    httpRequest: (params) => {
      return getWarehouseShelfList({
        ...params,
        warehouseId: warehouseId ? warehouseId : params.warehouseId,
      }).then((res) => {
        return {
          total: res.total || (res.data || res.rows || []).length,
          rows: res.data || res.rows || [],
        };
      });
    },
    getCustomData: (item) => {
      return {
        label: `${item.label || `${item}排货架`}`,
        value: item.value || item,
      };
    },
  };
};

/**
 * 包材信息
 * statusSearch: 1 // 已启用
 */
export const httpPackingSelect = (statusSearch = "1") => {
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getPackingList({
        ...params,
        statusSearch,
      }),
  };
};

/**
 * 仓库/排货架
 */
export const httpFreightShelSelect = (obj = {}) => {
  const { warehouseId, partitionType } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return warehouseShelfLayer({ partitionType, warehouseId, ...params });
    },
    searchParamName: "warehouseName",
    getCustomData: (item) => {
      const { freightShelfId, warehousePartitionId, rowNo, warehouseName } =
        item;
      const label = `${warehouseName} ${rowNo}层`;
      return {
        label,
        value: `${warehousePartitionId}_${freightShelfId}_${rowNo}`,
        title: label,
      };
    },
  };
};

/**
 * 入库预报/电商头程
 */
export const httpEcommerceSelect = () => {
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getForecastList({
        ...params,
        statusList: "0", // 0-待入库
      }),
    getCustomData: (item) => {
      const { orderOperationNum } = item;
      const label = `${orderOperationNum}`;
      return {
        label,
        value: item.id,
        title: label,
      };
    },
  };
};

/**
 * 入库预报/FBA退仓预报
 * orderType 0: FBA退仓预报 1: WMS入仓单
 */
export const httpWmsForecastSelect = (orderType = 0) => {
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getWmsForecast({
        ...params,
        orderType,
        statusSearch: 2, // 2-待入库
      }),
    getCustomData: (item) => {
      const { orderNum } = item;
      const label = `${orderNum}`;
      return {
        label,
        value: item.id,
        title: label,
      };
    },
  };
};

/**
 * 入库预报/托盘编号
 */
export const httpTraySelect = (obj) => {
  const { customerId, storageMode, oldTrayId } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) =>
      trayList({
        customerId,
        storageMode,
        oldTrayId,
        ...params,
      }),
    getCustomData: (item) => {
      const { trayNum, locationCode } = item;
      const label = `${trayNum}(${locationCode ? locationCode : "待上架"})`;
      return {
        label,
        value: item.id,
        title: label,
      };
    },
  };
};

/**
 * 一件代发方案/物流渠道列表
 * stateEq: 1 // 已启用
 */
export const httpLogisticsChannelListSelect = (obj) => {
  const {
    httpRequest = logisticsChannelList,
    stateKey = "stateEq",
    power = undefined,
    type,
  } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) =>
      httpRequest({
        [stateKey]: 1,
        ...params,
        type,
        power,
      }),
    getCustomData: (item) => {
      const { code, nameCn, nameEn } = item;
      let labelTit = code;
      if (nameCn) {
        labelTit += `[${nameCn}]`;
      }
      return {
        label: labelTit,
        value: item.id,
        title: labelTit,
        subtitle: nameEn,
      };
    },
  };
};

/**
 * 派送方式
 */
export const httpDeliveryChannelSelect = () => {
  return {
    type: "autocomplete",
    searchParamName: "codeLike",
    httpRequest: (params) => {
      const { name, ...nParams } = params;
      return logisticsProductList({
        stateIn: "1",
        ...nParams,
      });
    },
    defaultProp: {
      value: "id",
      label: "code,nameCn",
    },
  };
};
