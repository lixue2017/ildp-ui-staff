import { getAirlineList, getAirFlightList } from "@/api/marketManage/airline";
export const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "routeCode",
                  label: "航线信息：",
                  placeholder: "请选择航线信息",
                  type: "autocomplete",
                  defaultKey: "id",
                  isBackAll: true,
                  isAutoInitRequest: true,
                  httpRequest: (params) =>
                    getAirlineList({
                      ...params,
                      status: 1,
                    }),
                  getCustomData: (item) => {
                    return {
                      key: item.id,
                      value: item.code,
                      label: `${item.code}[${item.nameCn}]`,
                    };
                  },
                },
                {
                  span: 12,
                  id: "airGroup",
                  label: "航线组：",
                  type: "slot",
                  basicType: "clientIdentity",
                },
                {
                  span: 12,
                  id: "route",
                  label: "船次/航次：",
                  placeholder: "此处填写船次",
                  type: "autocomplete",
                  defaultKey: "id",
                  isBackAll: true,
                  focusLoad: true,
                  httpRequest: () => {},
                  getCustomData: (item) => {
                    return {
                      key: item.id,
                      value: item.code,
                      label: `${item.code}[${item.name}]`,
                    };
                  },
                },
                {
                  span: 12,
                  id: "shipCompany",
                  label: "航空/船公司：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "cabinProxy",
                  label: "订舱代理：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "sono",
                  label: "SO NO.：",
                  placeholder: "此处填写So No.",
                  type: "text",
                },
                {
                  span: 12,
                  id: "flightName",
                  label: "船名/航班名：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "lineType",
                  label: "类型：",
                  type: "radio",
                  basicType: "transportMode",
                  hideList: [4],
                  disable: true,
                },
                {
                  span: 12,
                  id: "sailOpenTime",
                  label: "开航期：",
                  placeholder: "--",
                  type: "txt",
                  // valueFormat: "yyyy-MM-dd"
                },
                {
                  span: 12,
                  id: "startPortName",
                  label: "起运港：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "cabinOpenTime",
                  label: "开舱日期：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "endPortName",
                  label: "目的港：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "cutGateTime",
                  label: "截关日期：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "transferName",
                  label: "中转港：",
                  placeholder: "--",
                  type: "txt",
                },
              ],
            },
          ],
        },
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  labelWidth: "100px",
                  label: "备注说明",
                  type: "txt",
                  className: "custom-remark",
                },
                {
                  span: 23,
                  id: "remark",
                  labelWidth: "20px",
                  placeholder: "备注说明（最多200字）",
                  type: "textarea",
                  maxlength: 200,
                  rows: 3,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    routeCode: [{ required: true, message: "请选择航线信息", trigger: "blur" }],
    route: [{ required: true, message: "请选择船次/航次", trigger: "blur" }],
    sono: [{ required: true, message: "请输入SONO", trigger: "blur" }],
  },
};
