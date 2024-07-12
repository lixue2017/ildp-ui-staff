export const cardConfig = [
  {
    backgroundColor: '#ECF3FF',
    topLabel: "委托人",
    topValue: "createNickName",
    topDictVal: "",
    labelColor:"#80B1FF",
    valueColor:"#5094FF",
  },
  {
    backgroundColor: "#FFF3EC",
    topLabel: "工作单号",
    topValue: "number",
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


export const titleConfig=(row={})=>{
  const {viewDetailsSource}=row
  return {
    columnConfig: [
      // 标题左侧label，数据取值formModel
      {
        label: "创建人",
        prop: "createBy",
      },
      {
        label: "创建时间",
        prop: "createTime",
      },
      ...(viewDetailsSource=='webWarehouseOutbound'?[]:[{
        label: "业务员",
        prop: "salesmanName",
      }])
    ],
  }
}
