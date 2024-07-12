import { toFixedNum } from '@/utils/instructions'

export const config = {
  formLists: [{
    span: 6,
    id: "code",
    label: "整柜参考号：",
    placeholder: "--",
    type: "txt",
    // type: "slot",
    // basicType: "cabinetType",
    // basicTypeVal: "importExportType",
  },
  {
    span: 6,
    id: "boxModel",
    label: "柜型：",
    placeholder: "--",
    basicType: "box",
    type: "txt",
  },
  {
    span: 6,
    id: "shipCompany",
    label: "船公司：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "sailOpenTime",
    label: "开航期：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "cabinProxy",
    label: "订舱代理：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "singleBoxweight",
    label: "单柜重量：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "startPort",
    label: "起运港：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "endPort",
    label: "目的港：",
    placeholder: "--",
    type: "txt",
  }
  ],
  leftTableColumns: {
    tag: {
      prop: "type",
      basicType: "cabinetType",
      basicTypeVal: "type",
    },
    top: [
      {
        prop: "bailorPeople",
        label: "委托人",
        render: (rows) => {
          return `委托人：${rows.bailorPeople}`
        }
      },
      {
        prop: "TDH",
        type: "slot"
        // render: (rows) => {
        //   if (rows.TDH) {
        //     return `提单号：${rows.TDH}`
        //   } else {
        //     return `+HBL`
        //   }
        // }

      },
      {
        prop: "operation",
        type: "slot"
      }],
    bottom: [
      {
        prop: "cargoInfo",
        label: "货物信息",
        render: (row) => `货物信息：${toFixedNum(row.weight)}KG * ${toFixedNum(row.volume, 3)}m³`
      },
      {
        prop: "operationOrderNum",
        label: "工作单号",
        render: (row) => {
          return `工作单号：${row.operationOrderNum}`
        }
      },
    ]
  },
  tableColumns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "类型",
      prop: "lineType",
      showOverflowTooltip: true,
      basicType: "transportMode",
      basicTypeVal: "lineType",
    },
    {
      label: "订舱代理",
      prop: "cabinProxy",
      showOverflowTooltip: true,
    },
    {
      label: "船名",
      prop: "flightName",
      showOverflowTooltip: true,
    },
    {
      label: "航次",
      prop: "name",
      showOverflowTooltip: true,
    },
    {
      label: "开航期",
      prop: "sailOpenTime",
      showOverflowTooltip: true,
    },
    {
      label: "开舱日期",
      prop: "cabinOpenTime",
      showOverflowTooltip: true,
    },
    {
      label: "截单日期",
      prop: "cutOrderTime",
      showOverflowTooltip: true,
    },
    {
      label: "截关日期",
      prop: "cutGateTime",
      showOverflowTooltip: true,
    },
    {
      label: "状态",
      prop: "status",
      showOverflowTooltip: true,
      customRow: true,
      basicType: "navigationStatus",
      basicTypeVal: "status",
      fixed: 'right',
    }]
}



export const FCLconfig = {
  formLists: [
    {
      span: 6,
      id: "nation",
      label: "目的国：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 6,
      id: "shipCompany",
      label: "船公司：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 6,
      id: "sailOpenTime",
      label: "开航期：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 6,
      id: "flightName",
      label: "船名：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 6,
      id: "cabinProxyName",
      label: "订舱代理：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 6,
      id: "startPort",
      label: "起运港：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 6,
      id: "endPort",
      label: "目的港：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 6,
      id: "name",
      label: "船次：",
      placeholder: "--",
      type: "txt",
    },

  ],
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "operationOrderNum",
                  label: "工作单号：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "cabinProxy",
                  label: "订舱代理：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "freightType",
                  label: "装箱方式：",
                  placeholder: "--",
                  type: "txt",
                  basicType: "freightType"
                },
                {
                  span: 24,
                  id: "bailorPeople",
                  label: "委托人：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "freightBoxInfo",
                  label: "整柜信息：",
                  placeholder: "--",
                  type: "txt",
                },
              ]
            },
          ],
        },
      ],
    }
  ],
  formRules: {
  }
}
