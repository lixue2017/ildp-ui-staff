// import { DICTIONARY_Obj } from '@/comModel/dictionary'

/*
橙色: #FF813D
红色: #fb6cc4
蓝色: #5094FF
黑色: #515151 - 草稿
灰色: #bcbcbc - 已完成
绿色: #35D06F
表格传值
{
  dicsStr: 'deliveryDic',
  customDicsArr: [0, 1, 'deliveryDic_2'], // 对象属性名
  customDicsVal: "type" // 不传时取 id 的值
}

表单传值
{
  dicsStr: 'deliveryDic',
  customDicsArr: [0, 'deliveryDic_state_7'], // 对象属性名
}
*/
export const DICTIONARY_Obj = {
  web_whether_0: {
    nameCn: "否",
    value: "0",
    color: "#FF6767",
  },
  web_whether_1: {
    nameCn: "是",
    value: "1",
    color: "#53C88A",
  },
  deliveryDic_0: {
    nameCn: "FBA出库",
    value: "0", // 字符串类型
  },
  deliveryDic_1: {
    nameCn: "一件代发",
    value: "1",
  },
  deliveryDic_2: {
    nameCn: "大货中转",
    value: "2",
  },
  deliveryDic_state_7: {
    nameCn: "待登记",
    value: "7",
    color: "#5094FF",
  },
  issue_type_0: {
    nameCn: "散货出库",
    value: "0",
  },
  issue_type_1: {
    nameCn: "整箱出库",
    value: "1",
  },
  vehicle_order_type_10: {
    nameCn: "整车POD",
    value: "10",
  },
  vehicle_order_type_20: {
    nameCn: "订单POD",
    value: "20",
  },
  freight_status_0: {
    // 卡车货物状态
    color: "#ff813d",
    nameCn: "未入仓",
    value: "0",
  },
  freight_status_1: {
    // 卡车货物状态
    color: "#5094ff",
    nameCn: "已入仓",
    value: "1",
  },
  freight_status_2: {
    // 卡车货物状态
    color: "#515151",
    nameCn: "已出仓",
    value: "2",
  },
  truck_status_4: {
    // 卡车状态
    color: "#ff813d",
    nameCn: "待出库",
    value: "4",
  },
  truck_status_5: {
    // 卡车状态
    color: "#5094ff",
    nameCn: "已排车",
    value: "5",
  },
  truck_status_6: {
    // 卡车状态
    color: "#515151",
    nameCn: "已出库",
    value: "6",
  },
  truck_status_9: {
    // 卡车状态
    color: "#515151",
    nameCn: "全部出库",
    value: "9",
  },
  storageWay_0: {
    // 对接头程存仓方式
    nameCn: "整箱存仓",
    color: "#FA541C",
    value: "0",
  },
  storageWay_1: {
    // 对接头程存仓方式
    nameCn: "大货中转",
    color: "#3179EF",
    value: "1",
  },
  storageMode_0: {
    // 托盘存仓方式
    nameCn: "SKU存仓",
    value: "0",
  },
  storageMode_1: {
    // 托盘存仓方式
    nameCn: "整箱存仓",
    value: "1",
  },
  storageMode_2: {
    // 托盘存仓方式
    nameCn: "大货中转",
    value: "2",
  },
  bol_status_1: {
    nameCn: "待提单完结",
    value: "0",
  },
  bol_status_2: {
    nameCn: "已完结",
    value: "2",
  },
  web_invoice_type_0: {
    nameCn: "增值税普票",
    value: "0",
  },
  web_invoice_type_1: {
    nameCn: "增值税专票",
    value: "1",
  },
  web_freight_mode_0: {
    nameCn: "到付现结",
    value: "0",
  },
  web_freight_mode_1: {
    nameCn: "寄付月结",
    value: "1",
  },
  verification_status_2: {
    nameCn: "待分配",
    value: "2",
  },
  verification_status_3: {
    nameCn: "待登记",
    value: "3",
  },
  verification_status_4: {
    nameCn: "待上传水单",
    value: "4",
  },
  verification_status_5: {
    nameCn: "待销账",
    value: "5",
  },
  headAgency_type_0: {
    //头程代理类型
    nameCn: "堡森",
    value: "0",
  },
  headAgency_type_1: {
    nameCn: "同行",
    value: "1",
  },
  overseasAgent_type_0: {
    //海外代理类型
    nameCn: "堡森",
    value: "0",
  },
  overseasAgent_type_1: {
    nameCn: "代理",
    value: "1",
  },
  overseasAgent_type_2: {
    nameCn: "头程同行",
    value: "2",
  },
  containerTrailer_type_0: {
    //集装箱拖车
    nameCn: "客户自拖",
    value: "0",
  },
  containerTrailer_type_1: {
    nameCn: "仓库集货",
    value: "1",
  },
  containerTrailer_type_2: {
    nameCn: "上门装柜",
    value: "2",
  },
  audit_status_0: {
    nameCn: "待审核",
    value: "0",
  },
  audit_status_1: {
    nameCn: "审核中",
    value: "1",
  },
  customsClearance_status_0: {
    //清关审核状态
    nameCn: "待审核",
    value: "0",
  },
  customsClearance_status_1: {
    nameCn: "审核中",
    value: "1",
  },
  customsClearance_status_2: {
    nameCn: "已提交",
    value: "2",
  },
  application_1: {
    //集装箱拖车
    nameCn: "客户端",
    value: "1",
  },
  application_2: {
    nameCn: "员工端",
    value: "2",
  },
  operation_object_20: {
    //集装箱拖车
    nameCn: "结算费用明细",
    value: "20",
  },
  operation_object_30: {
    nameCn: "成员更新",
    value: "30",
  },
  operation_type_10: {
    nameCn: "新增",
    value: "10",
  },
  operation_type_20: {
    nameCn: "修改",
    value: "20",
  },
  operation_type_30: {
    nameCn: "删除",
    value: "30",
  },
  supplier_status_1: {
    nameCn: "草稿",
    value: "0",
  },
  supplier_status_2: {
    nameCn: "待审核",
    value: "1",
  },
  supplier_status_3: {
    nameCn: "已驳回",
    value: "2",
  },
  supplier_status_4: {
    nameCn: "已启用",
    value: "3",
  },
  supplier_status_5: {
    nameCn: "已禁用",
    value: "4",
  },
  // supplier_type_1: {
  //   nameCn: "航空公司",
  //   value: '0'
  // },
  // supplier_type_2: {
  //   nameCn: "航空代理",
  //   value: '1'
  // },
  // supplier_type_3: {
  //   nameCn: "保险公司",
  //   value: '2'
  // },
  // supplier_type_4: {
  //   nameCn: "报关公司",
  //   value: '3'
  // },
  // supplier_type_5: {
  //   nameCn: "国内订舱代理",
  //   value: '4'
  // },
  // supplier_type_6: {
  //   nameCn: "拖车公司",
  //   value: '5'
  // },
  // supplier_type_7: {
  //   nameCn: "快递公司",
  //   value: '6'
  // },
  // supplier_type_8: {
  //   nameCn: "船代",
  //   value: '7'
  // },
  // supplier_type_9: {
  //   nameCn: "国外代理",
  //   value: '8'
  // },
  // supplier_type_10: {
  //   nameCn: "仓储公司",
  //   value: '9'
  // },
  // supplier_type_11: {
  //   nameCn: "船司",
  //   value: '10'
  // },
  opt_type_1: {
    nameCn: "国外代理",
    value: "1",
  },
  opt_type_2: {
    nameCn: "仓储公司",
    value: "2",
  },
  opt_type_3: {
    nameCn: "船司",
    value: "3",
  },
  transportation_clause_1: {
    // 运输条款
    nameCn: "Door to Door",
    value: "1",
  },
  transportation_clause_2: {
    nameCn: "Door To CY",
    value: "2",
  },
  transportation_clause_3: {
    nameCn: "CFS to CY",
    value: "3",
  },
  staff_status_1: {
    nameCn: "全部",
    value: "1",
  },
  staff_status_2: {
    nameCn: "草稿",
    value: "2",
  },
  staff_status_3: {
    nameCn: "待审核",
    value: "3",
  },
  staff_status_4: {
    nameCn: "正式",
    value: "4",
  },
  staff_status_5: {
    nameCn: "已驳回",
    value: "5",
  },
  staff_status_6: {
    nameCn: "已启用",
    value: "6",
  },
  staff_status_7: {
    nameCn: "已停用",
    value: "7",
  },
  delivery_Method_0: {
    nameCn: "卡车",
    value: "0",
  },
  delivery_Method_10: {
    nameCn: "快递",
    value: "10",
  },
  delivery_Method_20: {
    nameCn: "自提",
    value: "20",
  },
  read_status_0: {
    nameCn: "已读",
    value: "y",
    color: "#A5A5A5",
  },
  read_status_1: {
    nameCn: "未读",
    value: "n",
    color: "#FF813D",
  },
  message_type_1: {
    nameCn: "通知提醒",
    value: "1",
    color: "#515151",
  },
  message_type_2: {
    nameCn: "待办提醒",
    value: "2",
    color: "#FF813D",
  },
  handled_results_0: {
    nameCn: "未处理",
    value: "0",
  },
  handled_results_1: {
    nameCn: "已处理",
    value: "1",
  },
  message_level_0: {
    nameCn: "用户级",
    value: "0",
  },
  message_level_1: {
    nameCn: "账号级",
    value: "1",
  },
  message_level_2: {
    nameCn: "课程级",
    value: "2",
  },
  message_status_0: {
    color: "#ff813d",
    nameCn: "草稿",
    value: "0",
  },
  message_status_1: {
    color: "#5094ff",
    nameCn: "已启用",
    value: "1",
  },
  message_status_2: {
    color: "#5094FF",
    nameCn: "已禁用",
    value: "2",
  },
  push_status_0: {
    nameCn: "否",
    value: "n",
  },
  push_status_1: {
    nameCn: "是",
    value: "y",
    color: "#53C88A",
  },
  email_status_0: {
    color: "#ff813d",
    nameCn: "草稿",
    value: "0",
  },
  email_status_1: {
    color: "#5094ff",
    nameCn: "已启用",
    value: "1",
  },
  email_status_2: {
    color: "#8B8B8B",
    nameCn: "已禁用",
    value: "2",
  },
  send_status_0: {
    color: "#ff813d",
    nameCn: "发送中",
    value: "0",
  },
  send_status_1: {
    color: "#5094ff",
    nameCn: "发送成功",
    value: "1",
  },
  send_status_2: {
    color: "#8B8B8B",
    nameCn: "发送失败",
    value: "2",
  },
  message_module_1: {
    nameCn: "订单管理(员工端)",
    value: "1",
  },
  message_module_2: {
    nameCn: "市场管理",
    value: "2",
  },
  message_module_3: {
    nameCn: "项目管理",
    value: "3",
  },
  message_module_4: {
    nameCn: "结算管理",
    value: "4",
  },
  message_module_5: {
    nameCn: "操作履约管理",
    value: "5",
  },
  message_module_6: {
    nameCn: "国内仓库",
    value: "6",
  },
  message_module_7: {
    nameCn: "国内清关交接",
    value: "7",
  },
  message_module_8: {
    nameCn: "国外清关管理",
    value: "8",
  },
  message_module_9: {
    nameCn: "仓库管理",
    value: "9",
  },
  message_module_10: {
    nameCn: "权限管理",
    value: "10",
  },
  message_module_11: {
    nameCn: "物流信息",
    value: "11",
  },
  message_business_1: {
    nameCn: "员工端",
    value: "1",
  },
  message_business_2: {
    nameCn: "客户端",
    value: "2",
  },
  bill_type_0: {
    nameCn: "中文账单",
    value: "0",
  },
  bill_type_1: {
    nameCn: "香港账单",
    value: "1",
  },
  bill_type_2: {
    nameCn: "英文账单",
    value: "2",
  },
  order_report_state_0: {
    nameCn: "未完结",
    value: "0",
  },
  order_report_state_3: {
    nameCn: "已完结",
    value: "3",
  },
  product_attribute_0: {
    nameCn: "普货",
    value: 0,
  },
  product_attribute_1: {
    nameCn: "敏感货",
    value: 1,
  },
  web_whether_not_0: {
    nameCn: "否",
    value: false,
  },
  web_whether_not_1: {
    nameCn: "是",
    value: true,
  },
  print_format_1: {
    nameCn: "10*10",
    value: "1",
  },
  print_format_2: {
    nameCn: "A4纸张",
    value: "2",
  },
  is_whether_1: {
    nameCn: "是",
    value: true,
  },
  is_whether_2: {
    nameCn: "否",
    value: false,
  },
  print_sku_1: {
    nameCn: "按SKU汇总",
    value: 1,
  },
  print_sku_2: {
    nameCn: "显示箱号",
    value: 2,
  },
  print_sign_1: {
    nameCn: "MADE IN CHINA",
    value: 1,
  },
  print_sign_2: {
    nameCn: "MADE IN VIETNAM",
    value: 2,
  },
  print_sign_3: {
    nameCn: "无",
    value: 3,
  },
};
