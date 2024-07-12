import store from "@/store";
import { hostCurrentEnv } from "@/utils/index.js";
import {
  getSizeList,
  bookingAgent,
  getIdentityList,
  getoptMainList,
  getDealingCompany,
  getAllDealingCompany,
  getAllUser,
  querySearchList,
  getDept,
  getCrmList,
  getforeclose,
  getUserByDept,
  getListByFollowUserIdAndKa,
  getTopDeptUser,
  getRelatedRoleUser,
  getPickupAddressList,
  POSTSettleAccountsSalesman,
  GETAddressAccountInfoByName,
  GETAddressAccountInfoByCus,
  getRouteGroup,
  getListNameEnIsSortBox,
  getSalesLeadsSelectPage,
  getDeptByUser,
} from "@/api/common";
import { getSalesLeads } from "@/api/clueManage/salesClue";
import { getChannelList } from "@/api/priceSystem/provider";
import { getConsigneeList } from "@/api/basicInfo/consignee";
import {
  getReturnGoodsDetailLocationList,
  getReturnGoodsDetailTrayListVo,
} from "@/api/warehouse/manage.js";
import {
  getAirlineList,
  getAirFlightList,
  postOperationBookingList,
} from "@/api/marketManage/airline";
import { getCountryList } from "@/api/basicData";
import { getListSingle } from "@/api/operateRecord/DOCManage";
import { getProductInfo } from "@/api/basicInfo/product";
import {
  getUserBy,
  getAddressInfo,
  getCustomerList,
  getContactsInfo,
  getAccountSubjectList,
  getCustlist,
  getBsList,
} from "@/api/customerManage/customerList";
import { getTraditionListAll } from "@/api/trandition/index";
import {
  getPortPublicList,
  getContactsPublicList,
  getCrmInfoPublicList,
} from "@/api/publicInterface/index.js";
import {
  getBysSttleBill,
  getInvoiceCurrency,
  getBankAddressByCustomerId,
  logisticsCustomerInfo,
  logisticsSalesman,
  logisticsDealingsCompany,
  getMarketProfitDC,
  getECSalesman,
  getTraditionSalesman,
  getPaymentTaskList,
  getCashierList,
} from "@/api/settlementManage/paymentReceived";
import {
  getAccountList,
  settleCostTypeList,
  getAccountInfoFromSD,
} from "@/api/settlementManage/feeSet";
import { listUser } from "@/api/system/user";
import {
  getBoxList,
  getServiceChannel,
  getCustomsClearance,
} from "@/api/order/firstTransport.js";
import {
  getOrderInfoList,
  getSettleAccountsRelevancyList,
  GETAccountsOrderInfoList,
} from "@/api/settlementManage/statementManage";
import { getOtherFreightGoodsList } from "@/api/trandition/oceanModel";
import { getContactsList } from "@/api/basicInfo/contacts.js";

import { toFixedNum } from "@/utils/instructions";
import {
  getSchemeList,
  POSTRelationOriginRelations,
  getBillCompanyList,
} from "@/api/costScheme/index.js";
import { getByYeWu } from "@/api/home.js";
import { getClearanceSendInfoList } from "@/api/warehouse/prediction";
import { listDept } from "@/api/system/dept.js";
import {
  getOperateMainList,
  GETQueryListVo,
  POSTOverseasWarehouseSkuPage,
} from "@/api/customerManage/customerList.js";
import {
  getCostOdaSettingsList,
  getCostSpecialChargesRule,
} from "@/api/oneConsignmentPlan/saleSpecialCost";
import { getCostBindCustomer } from "@/api/oneConsignmentPlan/common";
import {
  POSTCusList,
  POSTBaAccount,
  POSTcrmAddress,
} from "@/api/oneConsignmentPlan/customerLv.js";
import {
  getWaitBooking,
  getFreightRateList,
  getFreightRateCostType,
} from "@/api/marketManage/freightRate.js";
import { POSTApiConfigGetPage } from "@/api/warehouse/basic";
import {
  GETConfigMianOrderList,
  getConfigMianOrderListVo,
} from "@/api/container/arrange.js";
import {
  getQuotationSelect,
  pendingRelatedOrderList,
} from "@/api/enquiryManage/customerQuotation";
import {
  getSonoPageLists,
  POSTOrderIsolateConfig,
} from "@/api/marketManage/airline.js";
import { getReturnWmsPackageList } from "@/api/warehouse/process.js";
import { getVisitAndSignInRecord } from "@/api/clueManage/taskRecord.js";
/**
 * 说明：params有附加参数时，以params为准
 * 参考：
 * <template v-slot:sellerObj="slotProps">
    <AutoComplete
      ref="saleRef"
      :formModel="slotProps.formModel"
      :fieldItem="slotProps.fieldItem"
      :additionalParam="{
        currencyId: slotProps.formModel.invoiceCurrencyObj && slotProps.formModel.invoiceCurrencyObj.value
      }"
    />
  </template>
 */

/**
 * 业务员
 */
export const httpUserSelect = (row = {}) => {
  const {
    roleId,
    defaultPropLabel = "userName,nickName",
    spellType = undefined,
  } = row;
  return {
    type: "autocomplete",
    httpRequest: (formModel) => {
      return getAllUser({
        ...formModel,
        roleId,
      });
    },
    searchParamName: "name",
    defaultProp: {
      value: "userId",
      label: defaultPropLabel,
    },
    spellType,
    searchIdKey: "userId",
  };
};

/**
 * 获取自己或自己可视下属
 */
export const httpDeptByUserSelect = (row = {}) => {
  const { defaultPropLabel = "userName,nickName" } = row;
  return {
    type: "autocomplete",
    httpRequest: getDeptByUser,
    searchParamName: "name",
    defaultProp: {
      value: "userId",
      label: defaultPropLabel,
    },
    searchIdKey: "userId",
  };
};

export const httpUserFnSelect = (obj) => {
  const { roleId } = obj || {};
  return {
    ...httpUserSelect(),
    httpRequest: (params) => {
      return getAllUser({
        roleId,
        ...params,
      });
    },
  };
};

export const httpUserSelectName = (obj = {}) => {
  const { key = "userId" } = obj;
  return {
    type: "autocomplete",
    httpRequest: getAllUser,
    searchParamName: "name",
    defaultProp: {
      value: key,
      label: "userName,nickName",
    },
    searchIdKey: key,
  };
};

/**
 * 默认获取顶级部门相关角色的人员/全部相关角色的人员
 */
export const httpRoleDeptUserSelect = (obj) => {
  const { isAllRoleRequest, getRoles, isCrm } = obj || {};
  const envStr = hostCurrentEnv();
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: async (params) => {
      if (getRoles?.length && !store.getters.dictData.roleIdOneByOne) {
        await store.dispatch("dictionary/getDictionary", ["roleIdOneByOne"]);
      }
      const { roleIdOneByOne = [] } = store.getters.dictData;
      const roleIds =
        getRoles && getRoles.length
          ? roleIdOneByOne
              .filter(
                (e) =>
                  e.nameCn === envStr &&
                  getRoles.some((ele) => ele === e.nameEn)
              )
              .map((i) => i.value)
          : [];
      const roleDeptRequest = isAllRoleRequest
        ? getRelatedRoleUser
        : getTopDeptUser;
      return roleDeptRequest({
        roleIdList: roleIds.join(","),
        isCrm,
        ...params,
      });
    },
    defaultProp: {
      value: "userId",
      label: "userName,nickName",
    },
  };
};

/**
 * 收货、发货、通知人/联系人
 */
export const httpContactsSelect = (obj) => {
  const { customerId, contactsType } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      const opt = {
        dataStatus: 1,
        customerId,
        contactsType,
        ...params,
      };
      return getContactsList(opt);
    },
    getCustomData: (item) => {
      const { cusContactsId, company, customerShortName, cusContacts } = item;
      const { contacts, phone, address } = cusContacts || {};
      const title = `${company || "--"}/${contacts || "--"}(${phone || "--"})`;
      return {
        key: cusContactsId,
        value: cusContactsId,
        label: company,
        title,
        subtitle: address,
      };
    },
  };
};

/**
 * 获取清关方式下拉列表
 */
export const httpCustomsClearanceSelect = (obj) => {
  const { cusContactsId, clearanceTypes } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      const opt = {
        cusContactsId,
        clearanceTypes,
        ...params,
      };
      return getCustomsClearance(cusContactsId, opt);
    },
    getCustomData: (item) => {
      const { customsClearanceMode = [] } = store.getters.dictData;
      const { code, id, customsClearanceType } = item;
      const dictObj =
        customsClearanceMode.find((e) => e.value == customsClearanceType) || {};
      const title = `${code || "--"}/${dictObj.nameCn || "--"}`;
      return {
        label: title,
        title,
        key: id,
        value: id,
      };
    },
  };
};

/**
 * 业务员(结算报表用)
 */
export const httpSalesmanSelect = (obj) => {
  const { customerId, httpRequest = logisticsSalesman } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) =>
      httpRequest({
        customerId, // 公司/企业
        ...params,
      }),
    defaultProp: {
      value: "userId",
      label: "userName,nickName",
    },
  };
};

/**
 * 业务员(业务报表用)
 * type: ec(电商)tradition(传统)
 */
export const httpBusinessSalesmanSelect = (obj) => {
  const { httpRequest = getECSalesman, ...data } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) =>
      httpRequest({
        ...data, // 公司/企业
        ...params,
      }),
    defaultProp: {
      value: "userId",
      label: "userName,nickName",
    },
  };
};

/**
 * 所属部门
 */
export const httpDeptSelect = (row = {}) => {
  const { isQueryFirstDept = undefined } = row;
  return {
    type: "autocomplete",
    httpRequest: (formModel) => {
      return getDept({ ...formModel, isQueryFirstDept });
    },
    defaultProp: {
      value: "deptId",
      label: "deptName",
    },
  };
};

/**
 * 所属企业
 */
export const httpEnterprisetSelect = (obj) => {
  const {
    typeList = 0,
    freightType,
    ids,
    isQueryFirstDept = 1, // 根据1级部门过滤数据
  } = obj || {};
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return getCrmInfoPublicList({
        freightType,
        typeList,
        ids,
        isQueryFirstDept,
        ...params,
      });
    },
    getCustomData: (item) => {
      return {
        key: item.id,
        value: item.id,
        label: item.name || "--",
      };
    },
    searchIdKey: "id",
  };
};

/**
 * 柜型
 */
export const httpCabinetTypeSelect = {
  type: "autocomplete",
  httpRequest: getSizeList,
};

/**
 * 根据操作单获取整柜核实信息
 */
export const httpBoxSelect = (obj = {}) => {
  const { operationOrderId, deleted = 0, freightType = 0 } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getBoxList({
        ...params,
        freightType: freightType || 0, // 0=整柜；1=散货
        deleted, // 0-过滤已删除的数据, 1-不过滤
        isFull: 1, // 过滤null
        operationOrderId,
      }),
    getCustomData: (item) => {
      const { id, boxSizeCode, sono } = item;
      const label = `${sono ? `${sono}#` : ""}${boxSizeCode || "--"}`;
      return {
        key: id,
        value: id,
        label,
        title: label,
      };
    },
  };
};

/**
 * 其他操作单获取货物信息
 */
export const httpOtherFreightSelect = (obj = {}) => {
  const { orderId, orderType } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getOtherFreightGoodsList({
        ...params,
        orderId,
        orderType,
      }),
    getCustomData: (item) => {
      const { id, boxCode, sono } = item;
      const label = `${sono ? `${sono}#` : ""}${boxCode || "--"}`;
      return {
        key: id,
        value: id,
        label,
        title: label,
      };
    },
  };
};

/**
 * 服务渠道
 */
export const httpChannelSelect = {
  type: "autocomplete",
  httpRequest: getChannelList,
};

/**
 * 航线
 */
export const httpRouteSelect = (row = {}) => {
  const { status = undefined } = row;
  return {
    type: "autocomplete",
    httpRequest: (params) => getAirlineList({ ...params, status }),
    getCustomData: (item) => {
      return {
        key: item.id,
        value: item.id,
        label: `${item.code}[${item.nameCn}]`,
      };
    },
  };
};

/**
 * 航次列表
 */
export const httpAirFlightSelect = {
  type: "autocomplete",
  httpRequest: getAirFlightList,
  defaultProp: {
    value: "id",
    label: "flightName,name",
  },
};

/**
 * 已有航班
 */
export const httpHaveAirFlightSelect = (row = {}) => {
  const { statusList = "1,2", ...obj } = row;
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getAirFlightList({ ...params, ...obj, statusList }),
    getCustomData: (item, dics) => {
      const title = `${item.code ? item.code : "--"}/${
        item.sono ? item.sono : "--"
      }`;
      const subtitle = `${item.flightName ? item.flightName : "--"}/${
        item.name ? item.name : "--"
      }/${item.shipCompany ? item.shipCompany : "--"}`;
      return {
        key: item.id,
        label: title,
        subtitle,
        title,
        value: item.id,
      };
    },
  };
};

/**
 * 电商海运散货操作单详情更改订舱代理
 */
export const httpLCLBookingSelect = (obj) => {
  // proxyType // 代理类型（0=堡森；1=同行）
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      return postOperationBookingList({ ...params });
    },
    getCustomData: (item) => {
      const { code, shortName } = item;
      const label = `${code || "--"}/${shortName || "--"}`;
      return {
        key: item.id,
        value: item.id,
        label,
        title: label,
      };
    },
    searchIdKey: "id",
  };
};

/**
 * 提货地址
 */
export const httpPickAddressSelect = {
  type: "autocomplete",
  httpRequest: getConsigneeList,
};

/**
 * typeList 0-海运 1-陆运 2-铁路 3-空运 4-快递
 */
export const httpPortPublicSelect = (typeList = "0,1,2,3,4", obj = {}) => {
  const { showLabelFn, ...nObj } = obj || {};
  return {
    type: "autocomplete",
    searchIdKey: "id", // ID定位
    httpRequest: (params) => getPortPublicList({ typeList, ...params }),
    getCustomData: (item) => {
      const { code, name, nameEn } = item;
      const label = nameEn;
      return {
        key: item.id,
        value: item.id,
        label: showLabelFn ? showLabelFn(item) : label,
        title: `${code}/${name}/${nameEn}`,
        ...nObj, // 拖车编辑需要传递附加参数
      };
    },
  };
};

/**
 * 企业地址信息 - 发票收件人
 */
export const httpBusinessAddressSelect = (obj) => {
  const { httpRequest = getAddressInfo, customerId } = obj || {};
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      httpRequest({
        id: customerId,
        ...params,
      }),
    getCustomData: (item) => {
      const title = `${item.contacts || "--"}/${item.phone || "--"}`;
      return {
        key: item.id,
        label: item.contacts,
        value: item.id,
        title,
        subtitle: item.address,
      };
    },
  };
};

/**
 * 联系人公共接口
 * https://console-docs.apipost.cn/preview/1906f8488f8d39f6/002d1acd39b7bb41?target_id=209aa114-4b4f-4293-b7f8-a023e903472c
 * typeList 0-收件人, 1-发件人
 * countryId -国家
 * customerId -客户ID
 */
export const httpContactsPublicSelect = (obj) => {
  const { typeList = "0,1", customerId } = obj;
  return {
    type: "autocomplete",
    searchParamName: "orderSearch",
    httpRequest: (params) =>
      getContactsPublicList({
        customerId,
        typeList,
        ...params,
      }),
    getCustomData: (item) => {
      const title = `${item.name || "--"}/${item.phone || "--"}`;
      return {
        key: item.id,
        label: item.name,
        value: item.id,
        title,
        subtitle: item.address,
      };
    },
  };
};

/**
 * 国家
 */
export const httpCountrySelect = {
  type: "autocomplete",
  category: "country",
  httpRequest: getCountryList,
};

/**
 * 国家
 */
export const httpCountryListSelect = () => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return querySearchList({
        type: "country",
        ...params,
      });
    },
    defaultProp: {
      value: "id",
      label: "twoCode,nameCn",
    },
  };
};

/**
 * 拖车操作单-关联业务(选择操作单)、操作单详情、订单详情
 */
export const httpOperationListSelect = (obj) => {
  const {
    httpRequest = getListSingle,
    statusSearch = "2,3,4,6,9",
    labelKey = "operationOrderNum",
  } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: labelKey,
    httpRequest: (params) => {
      return httpRequest({
        statusSearch,
        ...params,
      });
    },
    getCustomData: (item) => {
      return {
        key: item.id,
        value: item.id,
        label: item[labelKey],
      };
    },
  };
};

/**
 * 订舱代理
 */
export const httpbookingAgentSelect = (routeProxy = 1) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => bookingAgent(params, routeProxy),
    defaultProp: {
      // value: 'id', // 传递的值，默认为id
      label: "shortName",
    },
  };
};

/**
 * 客户列表 serviceList 0-堡森 1-同行 2-客户 3-服务商 4-供应商
 */
export const httpCustomerSelect = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      const { clientIdentity, queryType } = obj;
      delete params.nameCn;
      let opt = {
        queryType,
        ...params,
        // userStatus: 0, // 账号状态 - 已激活
        status: 3, // 客户状态 - 正式
      };
      if (clientIdentity || clientIdentity === 0) {
        opt.serviceList = clientIdentity; // 客户身份筛选
      }
      return getIdentityList(opt);
      // return getCustomerList
    },
    getCustomData: (item) => {
      const title = `${item.code}[${item.shortName}]`;
      return {
        key: item.id,
        value: item.id,
        label: title,
        title,
        subtitle: item.nameCn,
      };
    },
  };
};

/**
 * 客户列表 过滤出自己的客户
 */
export const httpFollowUserIdAndKa = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => getListByFollowUserIdAndKa(params),
    getCustomData: (item) => {
      const title = `${item.code}[${item.shortName}]`;
      return {
        key: item.id,
        value: item.id,
        label: title,
        title,
        subtitle: item.nameCn,
      };
    },
  };
};
export const httpCompanySelect = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      const { httpRequest = getBsList, delKey = "name", ...nObj } = obj || {};
      const { [delKey]: name, ...nParams } = params;
      // status: 3 - 正式
      return httpRequest({
        ...nObj,
        ...nParams,
      });
    },
    getCustomData: (item) => {
      return {
        key: item.id,
        value: item.id,
        label: item.shortName,
        title: item.shortName,
      };
    },
  };
};

/**
 * 客户列表 结算报表用
 */
export const httpLogisticsCustomerSelect = (obj = {}) => {
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      return logisticsCustomerInfo(params);
    },
    getCustomData: httpCustomerSelect().getCustomData,
  };
};

// 航空/船公司
export const shipCompanyList = (obj) => {
  const { serviceList = "3", userStatus = "3", status = "3" } = obj || {};
  return {
    type: "autocomplete",
    defaultKey: "id",
    httpRequest: (params) =>
      getCustomerList({ ...params, serviceList, userStatus, status }),
    defaultProp: {
      value: "id",
      label: "shortName",
    },
  };
};

/**
 * 根据部门获取用户
 * status 0 - 启用
 */
export const httpDeptUserSelect = (deptId) => {
  let tempDeptId = deptId;
  return {
    type: "autocomplete",
    searchParamName: "userName",
    httpRequest: (params) => {
      if (tempDeptId) {
        return listUser({
          deptId: tempDeptId,
          status: 0,
          ...params,
        });
      }
      // 获取当前用户信息
      return getUserBy().then((res) => {
        tempDeptId = res.data.deptId; // 减少接口请求
        return listUser({
          deptId: res.data.deptId,
          status: 0,
          ...params,
        });
      });
    },
    defaultProp: {
      value: "userId",
      label: "userName,nickName",
    },
  };
};

/**
 * 获取所有记账主体集合(客户归属)
 */
export const httpAccountSubjectSelect = (obj) => {
  const {
    httpRequest = getAccountSubjectList,
    userId,
    isQueryFirstDept = undefined,
  } = obj || {};
  // getoptMainList
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) =>
      httpRequest({
        userId,
        ...params,
        isQueryFirstDept,
      }),
    defaultProp: {
      value: "deptId",
      label: "deptName",
    },
  };
};

/**
 * 获取产品信息
 * dataStatus: 1-已启用, 3-维护
 */
export const httpProductSkuSelect = (dataStatus = 1) => {
  return {
    type: "autocomplete",
    searchParamName: "sku",
    httpRequest: (params) => {
      const { name, ...searchObj } = params;
      return getProductInfo(
        {
          ...searchObj,
          dataStatusIn: dataStatus,
        },
        true
      );
    },
    getCustomData: (item) => {
      const { sku, customsCode, declaredNameCn, declaredNameEn } = item;
      let subtitle = declaredNameCn; // 申报产品品名(CN)
      const label = `${sku}/${customsCode || "--"}`;
      if (declaredNameEn) {
        subtitle += `/${declaredNameEn}`;
      }
      return {
        label,
        value: item.id,
        key: item.id,
        title: label,
        subtitle,
      };
    },
  };
};

/**
 * 传统订单
 */
export const httpTraditionListSelect = () => {
  return {
    type: "autocomplete",
    searchParamName: "sku",
    httpRequest: (params) => getTraditionListAll(params),
    getCustomData: (item) => {
      const { orderNum } = item;
      return {
        label: orderNum,
        title: orderNum,
        value: item.id,
        key: item.id,
      };
    },
  };
};

/**
 * 账单复制来源订单
 */
export const httpOrderInfoListSelect = (obj = {}) => {
  const { orderType, salesman } = obj;
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      return getOrderInfoList({
        orderType,
        salesman,
        ...params,
      });
    },
    getCustomData: (item) => {
      const { orderNum, shortName, orderId } = item;
      return {
        label: orderNum,
        title: orderNum,
        value: orderId,
        key: orderId,
        subtitle: shortName,
      };
    },
  };
};

/**
 * 往来单位 - 有权限控制，列表查询使用httpAllDealingCompanySelect
 */
export const httpDealingCompanySelect = (obj) => {
  const { serviceList = undefined } = obj || {};
  const httpCompanyRequest =
    serviceList !== undefined ? getIdentityList : getDealingCompany;
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return httpCompanyRequest({
        serviceList,
        ...params,
      });
    },
    defaultProp: {
      value: "id",
      label: "code,shortName",
    },
  };
};
// 全部往来单位 字典词-clientIdentity 0-堡森/1-同行/2-客户/3-服务商/4-供应商/9-个人
export const httpAllDealingCompanySelect = (obj = {}) => {
  const { defaultPropLabel = "code,shortName", clientIdentity = "0,1,2,3,4" } =
    obj;
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      return getAllDealingCompany({
        clientIdentity,
        ...params,
      });
    },
    defaultProp: {
      value: "id",
      label: defaultPropLabel,
    },
  };
};
// 通过记账主体ID获取往来单位
export const httpSubjectCompanySelect = () => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      const { mainId, ...nParams } = params;
      return getforeclose(mainId, nParams);
    },
    defaultProp: {
      value: "id",
      label: "nameCn",
    },
  };
};
// 往来单位(结算报表用)
export const httpLogisticsCompanySelect = (obj) => {
  const { salesmanId } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      return logisticsDealingsCompany({
        salesmanId, // 业务员
        ...params,
      });
    },
    defaultProp: {
      value: "id",
      label: "nameCn",
    },
  };
};
// 往来单位(市场部利润表用)
export const httpMarketProfitCompanySelect = () => {
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      return getMarketProfitDC({
        ...params,
      });
    },
    defaultProp: {
      value: "id",
      label: "nameCn",
    },
  };
};

/**
 * 币别
 */
export const httpCurrencySelect = {
  type: "autocomplete",
  category: "currency",
};

/**
 * 发票币别
 */
export const httpInvoiceCurrencySelect = () => {
  return {
    type: "autocomplete",
    httpRequest: getInvoiceCurrency,
    getCustomData: (item) => {
      const label = `${item.invoiceCurrencyName || "--"}/${
        item.currencyCode || "--"
      }`;
      return {
        label,
        title: label,
        value: item.invoiceCurrencyId,
        key: item.invoiceCurrencyId,
      };
    },
  };
};

/**
 * 水单认领/对账单信息
 * type - 0:应付/1:应收
 * status - 0:未对账/1:已对账
 * isClaim - 水单认领绑定(0:未认领绑定/1:已认领绑定)
 * dealingsCompany - 往来单位
 * businessCompany - 业务单位
 */
export const httpSttleBillSelect = (obj = {}) => {
  const { dealingsCompany, businessCompany, bankReceiptId } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getBysSttleBill({
        ...params,
        type: 1,
        status: 55,
        isClaim: 0,
        dealingsCompany,
        businessCompany,
        bankReceiptId,
      }),
    getCustomData: (item) => {
      const {
        billNo,
        dealingsCompanyName,
        orderNum,
        businessCompanyName,
        currencyCode,
      } = item;
      let subtitle = dealingsCompanyName; // 往来单位
      if (businessCompanyName) {
        subtitle += `/${businessCompanyName}`; // 记账主体
      }
      const billAmount = `待认领：${item.samount || "--"} (总金额：${
        item.tamount || "--"
      })`;
      // `账单金额/${currencyCode}：${toFixedNum(item.convertBaseMoney)}`
      return {
        label: billNo,
        title: `${billNo || "--"}/${orderNum || "--"}`,
        value: item.id,
        key: item.id,
        subtitleMultiline: [billAmount, subtitle],
      };
    },
  };
};

/**
 * 账号信息
 * type - 类型(0:堡森/1:外部)
 */
export const httpAccountSelect = (obj) => {
  const { labelKey = "shortName", ...paramObj } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "name",
    selectTxtWidth: 260,
    httpRequest: (params) => getAccountList({ ...params, ...paramObj }),
    getCustomData: (item) => {
      let label = `${item[labelKey] || item.customerName || "--"}/${
        item.accountName || "--"
      }`;
      if (labelKey === "accountName") {
        label = item[labelKey] || "--";
      }
      return {
        label,
        title: label,
        value: item.id,
        subtitleMultiline: [
          item.bankAccount,
          `${item.openingBank} ${item.code}`,
        ],
      };
    },
  };
};

/**
 * 产品品类
 */
export const httpGoodsSelect = (paramObj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => querySearchList({ ...params, type: "goods" }),
    getCustomData: (item) => {
      const { nameCn, nameEn, oneName, twoName } = item;
      const label = `${nameCn}/${nameEn}`;
      return {
        label,
        value: item.id,
        title: label,
        subtitleMultiline: [`${oneName}/${twoName}`],
      };
    },
  };
};

/**
 * 结算费用名称
 */
export const httpCostTypeSelect = (obj = {}) => {
  const { type, descs } = obj;
  return {
    type: "autocomplete",
    searchIdKey: "id",
    httpRequest: (params) => {
      const { cnName, ...nParams } = params;
      return settleCostTypeList({
        ...nParams,
        dataStatus: 1, // 1-已启用
        type, // 0-业务费用 1-财务费用 2-仓库费用
        descs,
      });
    },
    searchParamName: "name",
    getCustomData: (item) => {
      return {
        label: `${item.costCode}/${item.cnName}`,
        value: item.id,
        title: `${item.costCode}/${item.cnName}`,
        subtitle: item.desc,
      };
    },
  };
};

/**
 * 费用名称-运价管理
 */
export const httpFreightRateCostTypeSelect = () => {
  return {
    type: "autocomplete",
    searchIdKey: "id",
    httpRequest: (params) => getFreightRateCostType(params),
    searchParamName: "name",
    getCustomData: (item) => {
      return {
        label: `${item.costCode}/${item.cnName}`,
        value: item.id,
        title: `${item.costCode}/${item.cnName}`,
        subtitle: item.desc,
      };
    },
  };
};

/**
 * 根据企业查询账户信息
 */
export const httpCrmListSelect = (obj) => {
  const { labelKey = "customerShortName", customerId, customerIds } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      return getCrmList({
        customerId,
        customerIds,
        ...params,
      });
    },
    getCustomData: (item) => {
      const { accountName, openingBank, currencyCode } = item;
      const title = `${item[labelKey]}/${accountName || "--"}`;
      let subtitle = `${currencyCode}/`;
      if (labelKey === "bankAccount") {
        subtitle += `${openingBank || "--"}`;
      } else {
        subtitle += `${item["bankAccount"] || "--"}/${openingBank || "--"}`;
      }
      return {
        label: item[labelKey],
        value: item.id,
        title,
        subtitle,
      };
    },
  };
};

//根据所属公司的ID查询银行账号
export const httpGetBankAddressByCustomerId = () => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      const { customerId } = params;
      return getBankAddressByCustomerId(customerId || 0);
    },
    defaultProp: {
      value: "id",
      label: "customerName,bankAccount",
    },
  };
};

/**
 * 运输方式
 */
export const httpGetServiceChannel = (obj) => {
  const { freightType, transportType } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "synthesisQueryParam",
    httpRequest: (params) => {
      return getServiceChannel({ freightType, transportType, ...params });
    },
    defaultProp: {
      value: "id",
      label: "code,nameCn",
    },
  };
};

/**
 * 邮箱地址
 */
export const httpGetEmailAddr = (id) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return getContactsInfo({
        id,
        ...params,
      });
    },
    defaultProp: {
      value: "id",
      label: "email",
    },
  };
};

/**
 * 成本规则
 */
export const httpGetSchemeList = (row) => {
  const { status } = row;
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return getSchemeList({
        ...params,
        status,
      });
    },
    getCustomData: (item) => {
      const label = `${item.costCode}/${item.name}`;
      return {
        key: item.id,
        label: label ? label : "--",
        value: item.id,
      };
    },
  };
};

/**
 * 费用试算往来单位
 */
export const httpGetRelationVo = (row = {}) => {
  const { customerType, customerName = "nameCn" } = row;
  return {
    isBackAll: true,
    defaultKey: "customerId",
    type: "autocomplete",
    httpRequest: (params) => {
      const { pageNum, pageSize, name, customerIdList = [] } = params;
      return new Promise((resolve) => {
        const nParams = {
          customerType,
          customerIdList,
          customerName: params[customerName],
          name,
          pageSize,
          pageNum,
        };
        POSTRelationOriginRelations(nParams).then((res) => {
          resolve(res);
        });
      });
    },
    defaultProp: {
      value: "customerId",
      label: "customerName",
    },
  };
};

/**
 * 日常报销规则-根据所在部门获取员工
 */
export const httpGetUserByDept = (id, row = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return getUserByDept(id);
    },
    defaultProp: {
      value: "userId",
      label: "userName,nickName",
    },
  };
};

// 堡森客户列表
export const httpgetCustlist = (row = {}) => {
  const {
    httpRequest = getCustlist,
    status = "0,1,2,3,4,5",
    ids,
    category,
    categoryLike,
    isQueryFirstDept,
  } = row;
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return httpRequest({
        status,
        ids,
        category,
        categoryLike,
        isQueryFirstDept,
        ...params,
      });
    },
    defaultProp: {
      value: "id",
      label: "code,nameCn",
    },
  };
};

//费用方案计费公司或计费仓库
export const httpBillCompanyList = (row = {}) => {
  //0-公司  1仓库
  const { type, searchName = "name" } = row;
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      const { billCompanyId = "", nameCn } = params;
      return getBillCompanyList({
        billCompanyId,
        [searchName]: nameCn,
      });
    },
    getCustomData: (item) => {
      const {
        billCompanyId,
        billCompanyName,
        billWarehouseId,
        billWarehouseName,
      } = item;
      const value = type == 1 ? billWarehouseId : billCompanyId;
      const label = type == 1 ? billWarehouseName : billCompanyName;
      return {
        key: value,
        label: label,
        value: value,
      };
    },
  };
};

// 首页客户
export const httpByYeWuSelect = (obj) => {
  return {
    type: "autocomplete",
    searchParamName: "nameCn",
    httpRequest: getByYeWu,
    defaultProp: {
      value: "id",
      label: "nameCn",
    },
  };
};

// 水单管理记账账号
export const httpgetAccountInfoFromSD = (row) => {
  const { type, labelKey = "shortName" } = row;
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      return getAccountInfoFromSD({
        type,
        ...params,
      });
    },
    getCustomData: (item) => {
      let label = `${item[labelKey] || item.customerName || "--"}/${
        item.accountName || "--"
      }`;
      if (labelKey === "accountName") {
        label = item[labelKey] || "--";
      }
      return {
        label,
        title: label,
        value: item.id,
        subtitleMultiline: [
          item.bankAccount,
          `${item.openingBank} ${item.code}`,
        ],
      };
    },
  };
};

// 关联业务单号查询
export const httpByRelevancy = (obj) => {
  return {
    type: "autocomplete",
    searchParamName: "orderNum",
    isBackAll: true,
    httpRequest: getSettleAccountsRelevancyList,
    defaultProp: {
      value: "id",
      label: "orderNum",
    },
  };
};

// 关联清关查验单号
export const httpClearanceSend = (obj) => {
  const {
    operationId,
    WEB_httpRequest = getClearanceSendInfoList,
    WEB_value = "goodsId",
  } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      const bsNo = params.name || "";
      delete params.name;
      delete params.nameCn;
      return WEB_httpRequest({
        ...params,
        bsNo,
        operationId,
      });
    },
    defaultProp: {
      value: WEB_value,
      label: "bsNo",
    },
  };
};

/**
 * 查询用户详情，目前仅用于员工列表
 */
export const httpStaffDetail = (row = {}) => {
  const { isQueryStaff, otherUserId, isQueryFirstDept } = row;
  return {
    type: "autocomplete",
    searchParamName: "userName",
    httpRequest: (params) => {
      return listUser({
        ...params,
        isQueryStaff,
        otherUserId,
        isQueryFirstDept,
      });
    },
    defaultProp: {
      value: "userId",
      label: "userName,nickName",
    },
  };
};

/**
 * 查询部门，目前仅用于员工列表
 */
export const httpGetListDept = (obj) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) => {
      const { nameCn } = formModel;
      formModel = {
        ...formModel,
        pageSize: 999,
        deptName: nameCn,
      };
      delete formModel.nameCn;
      delete formModel.name;
      return listDept(formModel);
    },
    defaultProp: {
      value: "deptId",
      label: "deptName",
    },
  };
};

// ODA服务启用的数据
export const httpGetOdaSettings = (obj) => {
  const { stateEq = 1 } = obj || {};
  return {
    type: "autocomplete",
    httpRequest: (params) => getCostOdaSettingsList({ ...params, stateEq }),
  };
};

// 销售特殊费用规则下拉列表
export const httpGetCostSpecialChargesRule = () => {
  return {
    type: "autocomplete",
    httpRequest: getCostSpecialChargesRule,
    getCustomData: (item) => {
      const {
        id,
        code,
        costOdaSettingsName,
        settleCostTypeName,
        channelSupport,
      } = item;
      return {
        label: code,
        title: `${code || "--"}/${settleCostTypeName || "--"}`,
        subtitle: `渠道${channelSupport ? "支持" : "不支持"}${
          costOdaSettingsName ? `(${costOdaSettingsName})` : ""
        }`,
        value: id,
        key: id,
      };
    },
  };
};

// 获取客户列表
export const httpGetCostBindCustomer = () => {
  return {
    type: "autocomplete",
    httpRequest: getCostBindCustomer,
    defaultProp: {
      value: "customerId",
      label: "code,shortName",
    },
  };
};

/**
 * 所属公司，目前仅用于员工列表
 */
export const httpGetOperateMainList = (obj) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) => {
      console.log("formModel", formModel);
      formModel.pageSize = 999;
      return getOperateMainList(formModel);
    },
    defaultProp: {
      value: "id",
      label: "shortName",
    },
  };
};

//选测财务单带出数据
export const httpGetPaymentTaskList = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: getPaymentTaskList,
    defaultProp: {
      value: "id",
      label: "userName,nickName",
    },
  };
};

//选择财务单
export const httpGetCashierList = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) => {
      return getCashierList({
        ...formModel,
        pageSize: 9998,
      });
    },
    getCustomData: (item) => {
      const {
        id,
        orderNo,
        statementsCode,
        businessCompanyShortName,
        dealingsCompanyName,
      } = item;
      let subtitle = dealingsCompanyName; // 往来单位
      if (businessCompanyShortName) {
        subtitle += `/${businessCompanyShortName}`; // 记账主体
      }
      const billAmount = `核销金额：${item.verificationMoney || "0"} (总金额：${
        item.money || "--"
      })`;
      return {
        label: statementsCode,
        title: `${statementsCode || "--"}/${orderNo || "--"}`,
        value: id,
        key: id,
        subtitleMultiline: [billAmount, subtitle],
      };
    },
  };
};
/**
 * 客户和服务商的企业信息
 */
export const httpPOSTCusList = (obj) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) => {
      return POSTCusList(formModel);
    },
    defaultProp: {
      value: "id",
      label: "businessOwnershipName,name",
    },
  };
};
/**
 * 堡森账户
 */
export const httpPOSTBaAccount = (obj) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) => {
      const { id } = formModel;
      return POSTBaAccount(id);
    },
    // defaultProp: {
    //   value: "id",
    //   label: "shortName,bankAccount，",
    // },
    getCustomData: (item) => {
      let label = `${item.shortName || item.customerName || "--"}/${
        item.accountName || "--"
      }`;
      return {
        label,
        title: label,
        value: item.id,
        subtitleMultiline: [
          item.bankAccount,
          `${item.openingBank} ${item.code}`,
        ],
      };
    },
  };
};
/**
 * 堡森账户
 */
export const httpPOSTcrmAddress = (obj) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) => {
      console.log("formModel", formModel);
      const { id } = formModel;
      return POSTcrmAddress(id);
    },
    defaultProp: {
      value: "id",
      label: "businessOwnershipName,name",
    },
  };
};

/**
 * 待订舱订单
 */
export const httpWaitBooking = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) => getWaitBooking({ ...formModel, ...obj }),
    defaultProp: {
      value: "id",
      label: "operationOrderNum",
    },
  };
};

/**
 * 运价订单
 */
export const httpFreightRate = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) => getFreightRateList({ ...formModel, ...obj }),
    getCustomData: (item) => {
      const {
        settingInfo,
        freight,
        relevanceStartEffectiveTime,
        relevanceEndEffectiveTime,
        voyage,
      } = item;
      return {
        label: settingInfo,
        value: item.id,
        title: settingInfo,
        subtitle: `${freight}|${voyage}|${relevanceStartEffectiveTime}~${relevanceEndEffectiveTime}`,
      };
    },
  };
};

/**
 * Api列表，目前仅用于物流产品
 */
export const httpPOSTApiConfigGetPage = (obj) => {
  const { apiType } = obj || {};
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (formModel) => {
      return POSTApiConfigGetPage({
        apiType,
        ...formModel,
      });
    },
    defaultProp: {
      value: "id",
      label: "name",
    },
  };
};

/**
 * 订舱路线
 */
export const httpGETConfigMianOrderList = (obj) => {
  const { bookingSpaceProxy, warehouseId } = obj;
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (formModel) => {
      return getConfigMianOrderListVo({
        warehouseId,
        ...formModel,
        bookingSpaceProxy,
      });
    },
    getCustomData: (item) => {
      const {
        startNameCode,
        endNameCode,
        countryName,
        bookingSpaceProxyName,
        id,
      } = item;
      const label = `${startNameCode}->${endNameCode}(${countryName})/${bookingSpaceProxyName}`;
      return {
        key: id,
        label: label,
        countryName,
        value: id,
      };
    },
  };
};

/**
 * 订单账单明细复制来源
 */
export const httpGETAccountsOrderInfoList = (obj = {}) => {
  const { businessType } = obj;
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      return GETAccountsOrderInfoList({
        businessType,
        ...params,
      });
    },
    getCustomData: (item) => {
      const { orderNum, shortName, orderId } = item;
      return {
        label: orderNum,
        title: orderNum,
        value: orderId,
        key: orderId,
        subtitle: shortName,
      };
    },
  };
};

/**
 * 报价下拉
 */
export const httpQuotationSelect = (obj = {}) => {
  return {
    type: "autocomplete",
    searchParamName: "numberLike",
    httpRequest: (formModel) => getQuotationSelect({ ...formModel, ...obj }),
    getCustomData: (item) => {
      const {
        id,
        number,
        productInfo,
        shipCompanyName,
        freight,
        sailingSchedule,
        startPricePeriodValidity,
        endPricePeriodValidity,
      } = item;
      const label = `${number}${productInfo ? `|${productInfo}` : ""}`;
      const subtitle = `${shipCompanyName}|${freight}|${sailingSchedule}|${startPricePeriodValidity}~${endPricePeriodValidity}`;
      return {
        label: label,
        title: label,
        value: id,
        key: id,
        subtitle: subtitle,
      };
    },
  };
};

/**
 * 获取SONO信息
 */
export const GETSonoPageListsHttpRequest = (obj) => {
  const { httpRequest = getAccountSubjectList } = obj || {};
  // getoptMainList
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getSonoPageLists({
        ...params,
      }),
    defaultProp: {
      value: "id",
      label: "sono",
    },
  };
};

export const httpTakeInfo = (obj = {}) => {
  const { state = 1 } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) =>
      getConsigneeList({
        ...params,
        state,
      }),
    getCustomData: (item) => {
      return {
        label: `${item.contacts}(${item.phone})`,
        value: item.consigneeId,
        title: `${item.contacts}(${item.phone})`,
        subtitle: `${item.address}`,
      };
    },
    searchParamName: "contactsOrphone",
  };
};

// 根据委托人查询提货地址信息列表
export const httpPickupAddressInfo = (obj = {}) => {
  const { customerId } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      // if (customerId || params.customerId) {
        return getPickupAddressList({
          customerId,
          ...params,
        });
      // } else {
      //   return Promise.resolve({});
      // }
    },
    getCustomData: (item) => {
      return {
        label: item.code,
        value: item.id,
        title: item.code,
        subtitle: item.address,
      };
    },
    searchParamName: "code",
  };
};

/**
 * 企业管理查询所有订单代理配置
 */
export const httpGETQueryListVo = () => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return GETQueryListVo({});
    },
    defaultProp: {
      value: "operateMain",
      label: "operateMainName",
    },
  };
};

/**
 * 修改拼柜路线,订舱代理
 */
export const httpPOSTOrderIsolateConfig = (row = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return new Promise((resolve) => {
        POSTOrderIsolateConfig(row).then((res) => {
          const { data } = res || {};
          getCrmInfoPublicList({ ids: data }).then((Sres) => {
            resolve(Sres);
          });
        });
      });
    },
    defaultProp: {
      value: "id",
      label: "name",
    },
  };
};

/**
 * 待关联订单
 */
export const httpPendingRelated = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) =>
      pendingRelatedOrderList({ ...formModel, ...obj }),
    defaultProp: {
      value: "id",
      label: "operationOrderNum",
    },
  };
};

/**
 * 仅申请发票明细获取业务员，需要传ID
 */
export const httpSettleAccountsSalesman = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) => POSTSettleAccountsSalesman({ ...formModel }),
    defaultProp: {
      value: "userId",
      label: "userName,nickName",
    },
  };
};
/**
 * 包裹分页列表
 */
export const httpReturnWmsPackageList = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (formModel) =>
      getReturnWmsPackageList({ ...formModel, ...obj }),
    defaultProp: {
      value: "id",
      label: "trackSn",
    },
  };
};

/**
 * 报销单账户企业名称查询,仅用于我的费用报销
 */
export const httpAddressAccountInfoByCus = (obj) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      console.log("params", params);
      return GETAddressAccountInfoByCus({
        ...params,
      });
    },
    defaultProp: {
      value: "cusIde",
      label: "accountName",
    },
  };
};

/**
 * 报销单账户银行账户查询,仅用于我的费用报销
 */
export const httpAddressAccountInfoByName = (obj) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      console.log("params", params);
      const { name: bankAccount, nameCn, ...obj } = params;
      return GETAddressAccountInfoByName({
        ...obj,
        bankAccount,
      });
    },
    defaultProp: {
      value: "id",
      label: "accountName",
    },
  };
};

/**
 * 文件进度表查询航线
 */
export const httpRouteGroup = (data = {}) => {
  const { status = 1, ...obj } = data;
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return getRouteGroup({
        ...params,
        status,
        ...obj,
      });
    },
    defaultProp: {
      value: "id",
      label: "name",
    },
  };
};

/**
 * 电商跟踪表查询排柜组
 */
export const httpListNameEnIsSortBox = (obj = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return getListNameEnIsSortBox({
        ...params,
        ...obj,
      });
    },
    defaultProp: {
      value: "id",
      label: "name",
    },
  };
};

/**
 * 获取海外仓商品SKU
 */
export const httpOverseasWarehouseSkuPage = (row = {}) => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      const { name = undefined, nameCn, ...obj } = params;
      return POSTOverseasWarehouseSkuPage({
        ...obj,
        sku: name,
      });
    },
    defaultProp: {
      value: "stockSku",
      label: "stockSku",
    },
  };
};

//库位查询
export const httpGetReturnGoodsDetailLocationList = () => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return getReturnGoodsDetailLocationList(params);
    },
    defaultProp: {
      value: "locationId",
      label: "partitionName,locationCode",
    },
  };
};

//托盘查询
export const httpGetReturnGoodsDetailTrayListVo = () => {
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return getReturnGoodsDetailTrayListVo(params);
    },
    defaultProp: {
      value: "trayId",
      label: "traySn",
    },
  };
};

// 线索管理-根据业务类型获取下拉选项
export const httpGetSalesLeadsSelectPage = (obj) => ({
  type: "autocomplete",
  searchParamName: "name",
  httpRequest: (params) => {
    return getSalesLeadsSelectPage({ ...params, ...(obj || {}) });
  },
  defaultProp: {
    value: "businessId",
    label: "code,name",
  },
});

// 线索管理-获取已转客户线索下拉选项
export const httpGetClueSelectPage = (obj) => ({
  type: "autocomplete",
  searchParamName: "searchValue",
  httpRequest: (params) => {
    return getSalesLeads({ ...params, ...(obj || { countType: 563 }) });
  },
  defaultProp: {
    value: "id",
    label: "code,name",
  },
});

// 拜访记录获取下拉选项  selectType(1：部门列表  2：用户列表 3：客户列表)
export const httpGetVisitAndSignInPage = (obj) => {
  const { selectType } = obj || {};
  const value = {
    1: "deptId",
    2: "userId",
    3: "leadsId",
  }[selectType];
  const label = {
    1: "belongDeptName",
    2: "userName",
    3: "visitCustomer",
  }[selectType];
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      return getVisitAndSignInRecord({
        ...params,
        ...(obj || {}),
        isMine: 0, // 是否我的记录
        queryType: 2, // 1：列表  2：下拉框
      });
    },
    defaultProp: {
      value,
      label,
    },
  };
};
