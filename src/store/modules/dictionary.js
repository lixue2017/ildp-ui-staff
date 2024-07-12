import { getBasicArchives } from "@/api/common";
const state = {
  dicsData: {},
  dicsInterfaceList: [],
  custTypeEn:
    "level,clientSource,clientCategory,clientIdentity,customerStatus,status,paymentMode,accountCycle,gender,invoiceType,addressType,accountStatus,outStorageStatus,businessOwnership,status,mainContacts,supplierType,trueOrFalse,normalShutdown,truckReceivingSource,warehousingSource,isApplyInvoiceStatus,priceGrade,costSaleLogisticsPriceState,costSaleOptPriceState,costSpecialChargesPriceState,platformOrderExportCurrency,apiType,apiConfigState,apiTimingFrequency,apiProductDifferenceType,erpApiProductState",
  serviceManageTypeEn: "accountCycle,serviceType",
  serviceChannel:
    "weightCounter,channelGroup,status,transportMode,out_warehouse_way,freightType",
  eCommerceTypeEn:
    "orderProductAttribute,transportMode,orderPlatform,customsClearanceType,customsDeclarationType,clientIdentity,freightType,productSituation,warehouseType,declaredUnit,taxIdType,orderStatus,soaStatus,billType,settlementBusinessType,paymentType,matchStatus,trueOrFalse,customsClearanceMode,headTransportMode,outWarehouseWay,businessSubmitOperationType,printType,attachType,attachConfig,quickOrderType",
  contactTypeEn: "taxIdType,status,customsClearanceType",
  airlineCodeTypeEn: "status,transportMode,tradeClause",
  bosSizeTypeEn: "status,size,box",
  portCode: "status,transportMode",
  tranditionTypeEn:
    "tradeClause,transportMode,orderBusinessType,clientIdentity,freightType,orderStatus,declareCurrencyId,boxSizeId,packagingCode,box,customsDeclarationType,navigationAgent,packagingCode,customsClearanceType,soaStatus,billType,settlementBusinessType,paymentType,productType,trackRecordStatus,trajectoryLv,trajectoryType,customsClearanceMode,businessSubmitOperationType,attachType,attachConfig,TOTransportMode",
  overseasOrderTypeEn:
    "orderStatus,orderPlatform,currency,warehouseType,productSituation,outStorageStatus,taxIdType,platformOrderExportCurrency",
  productTypeEn: "status,batteryType,declaredUnit",
  consigneeTypeEn: "status",
  privateWareTypeEn: "status,warehouseType",
  marketManage:
    "status,transportMode,navigationStatus,navigationAgent,navigationCompany,clientIdentity,cabinetType,bookingStatus,orderType,transportMode,trueOrFalse",
  airlineGroup:
    "status,navigationStatus,transportMode,navigationAgent,clientIdentity",
  airlineFlight:
    "status,navigationStatus,transportMode,cabinetType,box,warehouseType,clientIdentity,soaStatus,billType,settlementBusinessType,paymentType,inWarehouseStatus,trueOrFalse",
  operateList:
    "orderProductAttribute,orderBusinessType,orderPlatform,customsClearanceType,customsDeclarationType,clientIdentity,freightType,productSituation,warehouseType,declaredUnit,taxIdType,orderStatus,tradeClause,express,takeMethod,releaseMethod,accountCycle,issuingMethod,orderStatus,packagingCode,freightType,soaStatus,billType,settlementBusinessType,paymentType,transportMode,productSituation,containerTrailerType,trueOrFalse,headTransportMode,outWarehouseWay,operationQueryNodeStatus,importExportType,operationOrderType,voyageType,orderType",
  operateDetails:
    "orderProductAttribute,customsDeclarationType,transportMode,clientIdentity,orderBusinessType,tradeClause,orderPlatform,express,takeMethod,releaseMethod,accountCycle,issuingMethod,orderStatus,packagingCode,freightType,importExportType,paymentType,loadGoodsType,docType,warehouseType,storageWarehouseType,soaStatus,billType,settlementBusinessType,paymentType,productSituation,customsClearanceType,containerTrailerType,trueOrFalse,customsClearanceMode,outWarehouseWay,voyageType,operationOrderType,clearanceReservationWarehouse,inOutWarehouseStatus,information,attachConfig,attachType",
  BLinfoTypeEn:
    "status,importExportType,cabinetType,BOLStatus,clientIdentity,freightType,importExportType,navigationAgent,paymentType,issuingMethod,loadGoodsType,serviceType,box,do,pod,packagingCode,transportationClause,customsClearanceMode",
  nodeInfoTypeEn: "nodeType",
  cabinetArrangement:
    "information,inWarehouseStatus,sortBoxStatus,warehouseType,transportMode,customsDeclarationType,clearanceTrailerStatus,soaStatus,billType,settlementBusinessType,paymentType,headTransportMode,outWarehouseWay,inOutWarehouseStatus", // 排柜
  status: "status",
  feeDictionary:
    "invoiceCurrency,invoiceMedium,billType,accountCycle,express,freightPayType,invoiceType,settleType,express,orderBusinessType",
  billDictionary:
    "billStatus,paymentType,soaStatus,verificationStatus,RVPStatus,exchangeStatus,settlementBusinessType,soaStatus,settlementBusinessType,accountCycle,invoiceS,invoiceType,invoiceMedium,examineStatus,RVPType,billType,invoiceCurrency,SOAEnclosureType,paymentTaskState,collectionTaskState,trueOrFalse,rateChanges,isApplyInvoiceStatus,storageType,bankReceiptType,settleModel,billInvoiceStatus",
  declareAtCustoms:
    "clientIdentity,sortRegisterStatus,importExportType,orderStatus,customsType,freightType", // 报关管理
  trailer: "clientIdentity,trailerStatus,trailerType,trailerInfoStatus", // 拖车
  DocTypeEn: "docType,docStatus",
  billLocking: "lockStatus",
  customsClearance:
    "orderProductAttribute,inWarehouseStatus,clearanceStatus,devlieryStatus,trailerStatus,clearanceTrailerStatus,businessOwnership,importExportType,clientIdentity,tradeClause,freightType,cabinetType,do,pod,customsClearanceType,orderBusinessType,orderType,trueOrFalse,navigationCompany,clearanceReview,transportMode,warehousingSource,clearanceDeliveryPlaceType,orderState,storageType,clearanceReview,downListWarehousingSource,overseasAgencyType,overseaBusinessTypes,warehouseStorage,clearanceDeliveryStatus,clearanceDeliveryStatus,clearanceConfig,bookingTransportMode,deliveryBusinessTypes,operationOrderType,voyageType,customsClearanceMode,clearanceReservationWarehouse,headTransportMode,registerStatusLists,isBookingSpaceStatus,clearanceExamineStatus,qgSecondState", // 清关
  basicsWarehouse:
    "status,warehouseType,packagingConsumeType,haveWarehouseType,pickingFreightType,packagingStatus,warehousePartitionType,packagingInfoType,trueOrFalse", // 仓库基础设置
  predictionManage:
    "outboundLabelingType,warehousingSource,orderState,storageType,inStorageSource,aogStatus,putWayStatus,productSituation,orderStatus,enterWarehouse,billType,soaStatus,inWarehouseStatus,warehouseLabelType,strippingStatus,warehouseType,outStorageStatus,isSticker,settlementBusinessType,deliveryMethod,freightType,inStorageStatus,inOutWarehouseStatus,destinationType,taxIdType,orderPlatform,trueOrFalse,customsClearanceMode,headTransportMode,outWarehouseWay,intendDevannBusinessSource,warehousingSource,warehouseRepositoryType,warehouseStorage,downListWarehousingSource,roleIdOneByOne,stockNumType", //预报管理
  exWarehouseManage:
    "truckReceivingSource,truckDeliveryStatus,putWayStatus,trayPutState,warehousingSource", // 仓库管理/入库管理
  exWarehouseDict:
    "outStorageStatus,labelingBusinessType,isSticker,pickingType,inOutWarehouseStatus,customsClearanceMode,out_warehouse_way,pickingStatus,distributionBusinessType,destinationType,distributionPlanState,distributionPlanKdState,pickStickerStatus,pickPackStatus,transportMethod,roleIdOneByOne", // 仓库管理/出库管理
  inOutWarehouseProcess:
    "outboundLabelingType,outboundOrderType,outboundStatus,warehouseLabelType,isSticker,labelingBusinessType,outStorageStatus", // 仓库管理/过程记录
  batchLog: "wmsOptType,truckReceivingSource,warehousingSource", // 货物货架管理/批次记录
  messageService: "messageTriggerPoint,messageModule", // 货物货架管理/批次记录
  enquiryFrom:
    "freightType,productType,tradeClause,outWarehouseWay,inquirySheetType",
  enquiryList:
    "tradeType,freightType,quotationSheetState,inquirySheetState,shippingMode,productType,tradeClause,outWarehouseWay,bookingAgentType,inquirySheetType",
  overSeaOther:
    "nlOverAllStatus,freightType,clearanceDeliveryPlaceType,transportMode,downListWarehousingSource,storageType,overseaBusinessTypes,deliveryBusinessTypes,clearanceStatus,customsClearanceMode,headTransportMode,clearanceReservationWarehouse,importExportType,tradeClause,attachType,attachConfig", // 海外其他订单
  saleLogistics:
    "goodsPackType,priceGrade,costSaleLogisticsPriceState,chargingType,limitManageStatus",
  saleSpecialCost:
    "costSaleOptPriceState,saleOptPriceConfigChargeUnit,costFreeType",
  odaConfig:
    "odaState,postalType,countryOda,odaType,odaMatchingType,logicalOperationType,specialChargesRuleRuleType,goodsPackType,countryRule,costSpecialChargesRuleState",
  costPartitionScheme:
    "costPartitionSchemeState,costSpecialChargesPriceBillUnit,costSpecialChargesPriceState",
  freightRate:
    "freightType,freightRateState,pricingType,bookingAgentType,voyageType",
  customerQuotation:
    "freightType,shippingMode,quotationSheetState,inquirySheetType,productType,outWarehouseWay,tradeClause",
  dataOverview: "tongjiweidu,ywbbddlx,orderStatus",
  orderTypeEn:
    "transportMode,orderPlatform,customsClearanceType,customsDeclarationType,freightType,productSituation,warehouseType,declaredUnit,taxIdType,orderStatus,printType,packagingCode,customsClearanceMode,headTransportMode,outWarehouseWay,orderReservationCarState,orderReservationWarehousingState,orderReservationWarehousingCarType,tradeClause",
};

const mutations = {
  SET_DICTIONARY: (state, data) => {
    state.dicsData = {
      ...state.dicsData,
      ...data,
    };
  },
};

const actions = {
  getDictionary({ commit }, paramsField = "") {
    /** 参数类型: [String, Array] */
    return new Promise((resolve, reject) => {
      let keyArr = [];
      if (typeof paramsField === "string") {
        if (state.dicsInterfaceList.includes(paramsField)) {
          // 已有的字典词组合，不重复调接口
          resolve();
          return;
        }
        state.dicsInterfaceList.push(paramsField);
        keyArr = state[paramsField] ? state[paramsField].split(",") : [];
      } else {
        keyArr = paramsField || [];
      }

      let fieldArr = [];
      keyArr.forEach((key) => {
        // 已有的单个字典词，不重复调接口
        if (!state.dicsData[key]) {
          fieldArr.push(key);
        }
      });
      if (!fieldArr.length) {
        resolve();
        return;
      }

      getBasicArchives({ typeEn: fieldArr.join(",") })
        .then((res) => {
          commit("SET_DICTIONARY", res.data);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
