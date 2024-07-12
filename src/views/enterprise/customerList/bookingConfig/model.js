import {httpGETQueryListVo,httpCompanySelect,httpPortPublicSelect,httpPOSTOrderIsolateConfig} from "@/comModel/httpSelect.js"
import { httpFBAWarehouseSelect, httpWarehousePublicSelect } from '@/comModel/warehouse.js'
const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left"
}
const TABLE_COL_1 = {
  labelTop: "CASE1市场订舱",
  labelBtm: "(电商海运FCL)",
  // customRow: true,
  prop: "case1CustomerName",
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  labelTop: "CASE2同行订舱",
  labelBtm: "(电商海运LCL)",
  prop: "case2CustomerName",
  // customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  prop: "case3CustomerName",
  labelTop: "CASE3拼柜",
  labelBtm: "(电商海运LCL)",
  // customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "case4CustomerName",
  labelTop: "CASE4市场订舱",
  labelBtm: "(电商空运LCL)",
  // customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COL_5 = {
  prop: "case5CustomerName",
  labelTop: "CASE5同行订舱",
  labelBtm: "(电商空运LCL)",
  // customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COL_6 = {
  prop: "case6CustomerName",
  labelTop: "CASE6市场订舱",
  labelBtm: "(传统海运FCL)",
  // customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COL_7 = {
  prop: "case7CustomerName",
  labelTop: "CASE7同行订舱",
  labelBtm: "(传统海运LCL)",
  // customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COL_8 = {
  prop: "case8CustomerName",
  labelTop: "CASE8市场订舱",
  labelBtm: "(传统空运LCL)",
  // customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}

const TABLE_COL_9 = {
  prop: "warehouseName",
  label: "国内起始仓",
  showOverflowTooltip: true,
}

const TABLE_COL_10 = {
  prop: "warehouseComName",
  label: "仓库所属公司",
  showOverflowTooltip: true,
}
const TABLE_COL_11 = {
  prop: "startPortName",
  label: "启运港",
  showOverflowTooltip: true,
}
const TABLE_COL_12 = {
  prop: "endPortName",
  label: "目的港",
  showOverflowTooltip: true,
}
const TABLE_COL_13 = {
  prop: "countryName",
  label: "目的国家",
  showOverflowTooltip: true,
}
const TABLE_COL_14 = {
  prop: "bookingSpaceProxyName",
  label: "订舱代理(主单)",
  showOverflowTooltip: true,
}
const TABLE_COL_15 = {
  prop: "operateMainName",
  showOverflowTooltip: true,
}
const TABLE_COL_16 = {
  prop: "operationMainName",
  label: "订舱代理(子单)",
  showOverflowTooltip: true,
}
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: 'right',
}


export const getTabsConfig = ()=>{
  return {
    title: ["* 操作订舱无需选择订舱代理（选择的是同行，同行资源集团内公用，无需配置）", "拼柜路线"],
    titleClass:['table-title-long','table-title'],
    tableColumns: [
      [
        TABLE_COL_15,
        TABLE_COL_1,
        TABLE_COL_2,
        TABLE_COL_3,
        TABLE_COL_4,
        TABLE_COL_5,
        TABLE_COL_6,
        TABLE_COL_7,
        TABLE_COL_8,
        TABLE_COL_OPERATION
      ],
      [
        TABLE_COL_INDEX,
        TABLE_COL_9,
        TABLE_COL_10,
        TABLE_COL_11,
        TABLE_COL_12,
        TABLE_COL_13,
        TABLE_COL_14,
        TABLE_COL_16,
        TABLE_COL_OPERATION,
      ],
    ],
  }
}




const SEARCH_FORM_1 = {
  span: 12,
  id: "operateMainName",
  label: "堡森公司：",
  type: "txt",
};

const SEARCH_FORM_2 = {
  span: 12,
  id: "copy",
  placeholder: "复制已有配置主体",
  ...httpGETQueryListVo(),
  isBackAll:true,
  type: "slot",
};

const SEARCH_FORM_3 = {
  span: 24,
  id: "case1CustomerIds",
  multiple: true,
  placeholder: "可选堡森主体",
  label: "CASE1市场订舱：",
  ...httpCompanySelect()
};
const SEARCH_FORM_4 = {
  span: 24,
  id: "case3CustomerIds",
  multiple: true,
  placeholder: "可选堡森主体",
  label: "CASE3拼柜：",
  ...httpCompanySelect()
};
const SEARCH_FORM_5 = {
  span: 24,
  id: "case4CustomerIds",
  multiple: true,
  placeholder: "可选堡森主体",
  label: "CASE4市场订舱：",
  ...httpCompanySelect()
};
const SEARCH_FORM_6 = {
  span: 24,
  id: "case6CustomerIds",
  multiple: true,
  placeholder: "可选堡森主体",
  label: "CASE6市场订舱：",
  ...httpCompanySelect()
};
const SEARCH_FORM_7 = {
  span: 24,
  id: "case8CustomerIds",
  multiple: true,
  placeholder: "可选堡森主体",
  label: "CASE8市场订舱：",
  ...httpCompanySelect()
};
const SEARCH_FORM_8 = {
  span: 24,
  id: "newWarehouseId",
  label: "国内起始仓：",
  ...httpWarehousePublicSelect({ itemId: "parentId", flagAvailable: 'y', typeList:'2,3' }),
};
const SEARCH_FORM_9 = {
  span: 24,
  id: "newStartPortId",
  label: "启运港：",
  ...httpPortPublicSelect()
};
const SEARCH_FORM_10 = {
  span: 24,
  id: "newEndPortId",
  label: "目的港：",
  ...httpPortPublicSelect()
};
const SEARCH_FORM_11 = {
  span: 24,
  id: "newBookingSpaceProxy",
  label: "订舱代理(主单)：",
  ...httpPOSTOrderIsolateConfig({agentType:0})
};
const SEARCH_FORM_12 = {
  span: 24,
  id: "newOperationMain",
  label: "订舱代理(子单)：",
  ...httpPOSTOrderIsolateConfig({agentType:2})
};

export const bookingDialogCols = () => {
  return {
    title: "修改订舱代理",
    width: "800px",
    labelWidth: "120px",
    simpleCustomCols: [
      SEARCH_FORM_1,
      SEARCH_FORM_2,
      SEARCH_FORM_3,
      SEARCH_FORM_4,
      SEARCH_FORM_5,
      SEARCH_FORM_6,
      SEARCH_FORM_7
    ],
    formRules: {
      case1CustomerIds: [
        { required: true, message: `请选择CASE1市场订舱`, trigger: "change" }
      ],
      case3CustomerIds: [
        { required: true, message: `请选择CASE3拼柜`, trigger: "change" }
      ],
      case4CustomerIds: [
        { required: true, message: `请选择CASE3拼柜`, trigger: "change" }
      ],
      case6CustomerIds: [
        { required: true, message: `请选择CASE6市场订舱`, trigger: "change" }
      ],
      case8CustomerIds: [
        { required: true, message: `请选择CASE8市场订舱`, trigger: "change" }
      ]
    },
  };
};


export const routeDialogCols = () => {
  return {
    title: "修改拼柜路线",
    width: "800px",
    labelWidth: "120px",
    simpleCustomCols: [
      SEARCH_FORM_8,
      SEARCH_FORM_9,
      SEARCH_FORM_10,
      SEARCH_FORM_11,
      SEARCH_FORM_12,
    ],
    formRules: {
      newWarehouseId: [
        { required: true, message: `请选择国内起始仓`, trigger: "change" }
      ],
      newStartPortId: [
        { required: true, message: `请选择启运港`, trigger: "change" }
      ],
      newEndPortId: [
        { required: true, message: `请选择目的港`, trigger: "change" }
      ],
      newBookingSpaceProxy: [
        { required: true, message: `请选择订舱代理(主单)`, trigger: "change" }
      ],
      newOperationMain: [
        { required: true, message: `请选择订舱代理(子单)`, trigger: "change" }
      ],
    },
  };
};
