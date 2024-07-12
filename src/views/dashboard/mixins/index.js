export default {
  components: {
    headOverview: () => import("@/views/dashboard/PanelGroup"), // 头部总览
    operationOrderQuantity: () => import("@/views/dashboard/PanelGroupOperate"), // 头部总览-操作员
    orderPending: () => import("@/views/dashboard/DualTable"), // 订单待办
    dsVolumeInfo: () => import("@/views/dashboard/GoodsInfo"), // 电商货量信息
    ctVolumeInfo: () => import("@/views/dashboard/GoodsInfo"), // 传统货量信息
    // orderQuantity: () => import("@/views/dashboard/GatherCard"), // 订单量板块
    operationProcess: () => import("@/views/dashboard/processList"), // 操作流程
    financialProcess: () => import("@/views/dashboard/DualTable"), // 财务流程
    dayPayment: () => import("@/views/dashboard/ReceiptPayment"), // 日实收实付
    halfYearUncollectedBill: () => import("@/views/dashboard/UncollectedBill"), // 近半年未收款账单
    shortcuts: () => import("@/views/dashboard/Shortcuts"), // 快捷工具
    backlog: () => import("@/views/dashboard/todoList"), // 待办
    cargoVolumeTrend: () => import("@/views/dashboard/GoodsTrend"), // 货量趋势
    dayBusinessMe: () => import("@/views/dashboard/GatherCard"), // 日常业务（我的）
    dayBusinessWaitMe: () => import("@/views/dashboard/GatherCard"), // 日常业务（待我审）
    operationSettlementQuantity: () =>
      import("@/views/dashboard/PendingSettlement"), // 操作待办结算
    orderQuantity: () => import("@/views/dashboard/OverseasUnfinished"), // 海外操作未完结
    operationProcess: () => import("@/views/dashboard/OperateLoading"), // 进行中操作单
    // LimitationGoods: () => import("@/views/dashboard/LimitationGoods"), // 货物时效
  },
};
