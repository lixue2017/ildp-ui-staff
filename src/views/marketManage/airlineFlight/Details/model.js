export const config = {
  formLists: [{
    span: 6,
    id: "routeCode",
    label: "航线信息：",
    type: "txt",
  },
  {
    span: 6,
    id: "countyName",
    label: "目的国：",
    type: "txt",
  },
  {
    span: 6,
    id: "cabinProxy",
    label: "订舱代理：",
    type: "txt",
  },
  {
    span: 6,
    id: "sailOpenTime",
    label: "开航期：",
    type: "txt",
		// txtTagArr: [{
		// 	basicType: "navigationStatus",
    //   basicTypeVal: "status",
		// }]
  },
  {
    span: 6,
    id: "shipCompany",
    label: "船公司：",
    type: "txt",
  },
  {
    span: 6,
    id: "startPortName",
    label: "起运港：",
    type: "txt",
  },
  {
    span: 6,
    id: "flightName",
    label: "船名：",
    type: "txt",
  },
  {
    span: 6,
    id: "cabinOpenTime",
    label: "开仓日期：",
    type: "txt",
  },
  {
    span: 6,
    // id: "routeGroup",
    // label: "航线组：",
		id: "sameIndustryProxyName",
    label: "同行代理：",
		type: "txt",
    // type: "slot",
    // basicType: "transportMode",
    // basicTypeVal: "lineType",
		// render: (row) => `${row.routeGroupCode || '--'}[${row.routeGroupName || '--'}]`,
		txtTagArr: [{
			basicType: "transportMode",
      basicTypeVal: "lineType",
		}, {
			tagColor: 'green',
			basicType: "clientIdentity",
      basicTypeVal: "routeProxy",
		}],
		tagStyleObj: {
			marginRight: "-10px",
		},
  },
  {
    span: 6,
    id: "endPortName",
    label: "目的港：",
    type: "txt",
  },
  {
    span: 6,
    id: "name",
    label: "船次：",
    type: "txt",
  },
  {
    span: 6,
    id: "cutGateTime",
    label: "截关日期：",
    type: "txt",
  }],
  leftTableColumns: {
    tag: {
      prop: "type",
      basicType: "cabinetType",
      basicTypeVal: "type",
    },
    top: [
      {
        prop: "boxModelCode",
        width: 50
        // basicType: "box",
        // basicTypeVal: "boxId",
      },
      {
        prop: "sono",
        width: 150
      },
      {
        prop: "code",
        type: 'slot',
      }],
    bottom: [
      {
        width: 200,
        render: (row) => {
          return `创建时间：${row.createTime}`
        }
      },
      {
        prop: "isCabinRelease",
        type: "slot"
      },
      {
        prop: "operation",
        type: "slot"
      }
    ],
    Appendix: [
      // {
      //   prop: "Appendix",
      //   type: "slot",
      // }
      {
        id: "attachId",
        // label: "清关资料：",
        labelWidth: "0px",
        type: "customUploadFile",
        disable: true,
        detailDisplay: false, // 详情一行显示
        noAcceptExplain: true, //详情是否显示说明文字
      }
    ]
  },
  tableColumns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "工作单号",
      prop: "operationOrderNum",
      align: 'center',
      showOverflowTooltip: true,
    },
    {
      label: "国家",
      prop: "countryName",
      align: 'center',
      showOverflowTooltip: true
    },
    {
      label: "起运港",
      prop: "startPortName",
      align: 'center',
      showOverflowTooltip: true,
    },
    {
      label: "目的港",
      prop: "endPortName",
      align: 'center',
      showOverflowTooltip: true,
    },
    {
      label: "(预计)总箱 数/件数",
      prop: "freightNum",
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },
    {
      label: "(预计)总重量 (KG)",
      prop: "freightWeight",
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },
    {
      label: "(预计)立方 (CBM)",
      prop: "freightVolume",
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },
    {
      label: "客户简称",
      prop: "bailorPeopleName",
      align: 'center',
      showOverflowTooltip: true,
      fixed: 'right',
    },
    {
      label: "业务员",
      prop: "salesmanName",
      align: 'center',
      showOverflowTooltip: true,
      fixed: 'right',
    }]
}

export const settlementTableColumns = [{
  type: "index",
  width: 50,
  align: "center"
},
{
  prop: "sono",
  label: "关联SONO",
  width: 150,
  showOverflowTooltip: true
},
{
  prop: "feeName",
  label: "费用名称",
  width: 150,
  showOverflowTooltip: true
},
{
  label: "类型",
  prop: "billType",
  showOverflowTooltip: true,
  minWidth: 100,
  basicType: 'billType',
  customRow: true,
},
{
  prop: "address",
  label: "往来单位",
  showOverflowTooltip: true,
  minWidth: 100
},
{
  prop: "currency",
  label: "币种",
  showOverflowTooltip: true,
},
{
  prop: "zhje",
  label: "折合金额",
  showOverflowTooltip: true,
  minWidth: 120
},
{
  prop: "billStatus",
  label: "状态",
  showOverflowTooltip: true,
  basicType: 'billStatus',
  customRow: true,
},
{
  prop: "lockSheet",
  label: "锁单",
  showOverflowTooltip: true,
  customRow: true,
},
{
  prop: "busior",
  label: "创建人",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true
},
{
  prop: "lastTime",
  label: "创建时间",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 140
},
{
  prop: "operation",
  label: "操作",
  showOverflowTooltip: true,
  width: 100,
  customRow: true,
  fixed: "right"
}]
