import {
  getAirFlightList
} from "@/api/marketManage/airline";
export const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "airFlightInfo",
                  label: "航次：",
                  placeholder: "请选择航次",
                  type: "autocomplete",
                  isBackAll: true,
                  isAutoInitRequest: true,
                  httpRequest: (params) => getAirFlightList({
                    ...params,
                    statusList: 1
                  }),
                  getCustomData: (item) => {
                    return {
                      key: item.id,
                      value: item.code,
                      label: `${item.code}[${item.name}]`
                    }
                  }
                },
                {
                  span: 24,
                  id: "routeProxy",
                  label: "代理类型：",
                  placeholder: "--",
                  type: "radio",
                  basicType: 'clientIdentity',
                  hideList: [5, 7],
                  disable: true
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
                  id: "flightName",
                  label: "船名：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "sailOpenTime",
                  label: "开航期：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "startPort",
                  label: "起运港：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 24,
                  id: "endPort",
                  label: "目的港：",
                  placeholder: "--",
                  type: "txt",
                }
              ],
            },
          ],
        }
      ],
    },
  ],
  formRules: {
    airFlightInfo: [
      { required: true, message: "请选择航线信息", trigger: "change" },
    ]
  }
}