import basicLangObj from "@/language/basicLang.js";
export const cardConfig = [
  {
    title:"目的仓",
    value:"warehouseName",
    backgroundColor: '#ECF3FF',
    // topLabel: "目的仓",
    // topValue: "warehouseName",
    // topDictVal: "",
    labelColor:"#80B1FF",
    valueColor:"#5094FF",
  },
  {
    title:"工作单号",
    value:"orderSn",
    backgroundColor: "#FFF3EC",
    // topLabel: "工作单号",
    // topValue: "orderSn",
    labelColor:"#FF985C",
    valueColor:"#FF813D",
  },
  {
    title:"合计应收/应付(RMB)",
    backgroundColor: "#ECECFF",
    topLabel: "应收",
    topValue: "totalReceiveRMB",
    bottomLabel: "应付",
    bottomValue: "totalPayRMB",
    labelColor:"#B1B1FF",
    valueColor:"#7676FF",
		decimal: 2
  },
  {
    title:"合计实收/实付(RMB)",
    backgroundColor: "#D2F1FF",
    topLabel: "实收",
    topValue: "totalRealityReceiveRMB",
    bottomLabel: "实付",
    bottomValue: "totalRealityPayRMB",
    labelColor:"#64CFFF",
    valueColor:"#13B5FF",
    decimal: 2
  },
]



export const titConfig=(row={})=>{
  const {viewDetailsSource}=row
  const isOrderAndOperation=["orderReceiving","operationReceiving"].includes(viewDetailsSource)
  return {
      columnConfig:[
    {
      label: basicLangObj.cjr_create || "创建人",
      prop: "createBy",
    },
    {
      label: basicLangObj.cj_date || "创建时间",
      prop: "createTime",
    },
    ...(isOrderAndOperation?[{
      label: "业务员",
      prop: "salesmanName",
    }]:[])
  ]
  }
}
