import { MAX_PRODUCT_NUM, MAX_BOX_WEIGHT, MAX_BOX_VOLUME } from '@/utils/instructions'

export const config = {
  formLists: [
    {
      span: 8,
      id: "operationOrderNum",
      label: "工作单号：",
      placeholder: "--",
      type: "txt"
    },
    {
      span: 8,
      id: "bailorPeople",
      label: "委托人：",
      placeholder: "--",
      type: "txt"
    },
    {
      span: 8,
      id: "createTime",
      label: "接单时间：",
      placeholder: "--",
      type: "txt"
    }
  ],
  hyTableColumn: [// 海运
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      minWidth: 100,
      customRow: true,
      showOverflowTooltip: true,
      basicType: "customsDeclarationType"
    },
    {
      label: "箱号",
      prop: "ontainerSno",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "封号",
      prop: "sealingStripSno",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "件数",
      prop: "warehousingQuantity",
      customRow: true,
      showOverflowTooltip: true,
      width: 120,
      align: "center",
      decimal: 0,
			colMax: MAX_PRODUCT_NUM
    },
    {
      label: "包装",
      prop: "packTypeId",
      customRow: true,
      showOverflowTooltip: true,
      width: 120,
      basicType: "packagingCode"
    },
    {
      label: "箱型",
      prop: "boxSizeId",
      customRow: true,
      showOverflowTooltip: true,
      width: 120
    },
    // {
    //   label: "单件体积(CBM)",
    //   prop: "warehousingVolume",
    //   minWidth: 120,
    //   customRow: true,
    //   showOverflowTooltip: true,
    //   align: "right",
    //   decimal: 2,
		// 	colMax: MAX_BOX_VOLUME
    // },
    // {
    //   label: "单件毛重(KG)",
    //   prop: "warehousingWeight",
    //   minWidth: 120,
    //   customRow: true,
    //   showOverflowTooltip: true,
    //   align: "right",
    //   decimal: 2,
		// 	colMax: MAX_BOX_WEIGHT
    // },
    {
      label: "体积小计(CBM)",
      prop: "warehousingTotalVolume",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
      align: "right",
      decimal: 2
    },
    {
      label: "毛重小计(KG)",
      prop: "warehousingTotalWeight",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
      align: "right",
      decimal: 2
    },
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      fixed: 'right',
      width: '120px'
    },
  ],
  kyTableColumn: [ // 空运
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      minWidth: 100,
      customRow: true,
      showOverflowTooltip: true,
      basicType: "customsDeclarationType"
    },
    {
      label: "件数",
      prop: "warehousingQuantity",
      customRow: true,
      showOverflowTooltip: true,
      align: "center",
      width: 120,
      decimal: 0,
			colMax: MAX_PRODUCT_NUM
    },
    {
      label: "包装",
      prop: "packTypeId",
      customRow: true,
      showOverflowTooltip: true,
      width: 120,
      basicType: "packagingCode"
    },
    // {
    //   label: "长(CM)",
    //   prop: "warehousingLength",
    //   align: 'right',
    //   customRow: true,
    //   customHeader: true,
    //   minWidth: 120,
    //   align: "right",
    //   decimal: 1
    // },
    // {
    //   label: "宽(CM)",
    //   prop: "warehousingWidth",
    //   showOverflowTooltip: true,
    //   align: 'right',
    //   customRow: true,
    //   customHeader: true,
    //   minWidth: 120,
    //   align: "right",
    //   decimal: 1
    // },
    // {
    //   label: "高(CM)",
    //   prop: "warehousingHeight",
    //   showOverflowTooltip: true,
    //   align: 'right',
    //   customRow: true,
    //   customHeader: true,
    //   minWidth: 120,
    //   align: "right",
    //   decimal: 1
    // },
    // {
    //   label: "单件体积(CBM)",
    //   prop: "warehousingVolume",
    //   minWidth: 120,
    //   customRow: true,
    //   showOverflowTooltip: true,
    //   align: "right",
    //   decimal: 2,
		// 	colMax: MAX_BOX_VOLUME
    // },
    // {
    //   label: "单件毛重(KG)",
    //   prop: "warehousingWeight",
    //   minWidth: 120,
    //   customRow: true,
    //   showOverflowTooltip: true,
    //   align: "right",
    //   decimal: 2,
		// 	colMax: MAX_BOX_WEIGHT
    // },
    {
      label: "体积小计(CBM)",
      prop: "warehousingTotalVolume",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
      align: "right",
      decimal: 2
    },
    {
      label: "毛重小计(KG)",
      prop: "warehousingTotalWeight",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
      align: "right",
      decimal: 2
    },
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      fixed: 'right',
      width: '120px'
    },
  ],
  grossTotal: [
    {
      label: '总件数：',
      prop: 'totalQuantity',
      decimal: 0,
    },
    {
      label: '总体积(CBM)：',
      prop: 'totalVolume',
      decimal: 2,
    },
    {
      label: '总重量(KG)：',
      prop: 'totalWeight',
      decimal: 2,
    },
  ],
}

