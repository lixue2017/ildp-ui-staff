import { httpAirFlightSelect } from "@/comModel/httpSelect";
const FORM_COLS_ROUTE = {
  span: 24,
  id: "routeNoManageId",
  label: "关联航次：",
  placeholder: "请选择航次",
  showCreate: true,
  ...httpAirFlightSelect,
  selectLabelKey: "routeNoMangeName",
  type: "slot",
  getCustomData: (item) => {
    const {
      flightName,
      name,
      code,
      startPortName,
      endPortName,
      lineTypeName,
      shipCompanyName,
    } = item;
    const title = `${flightName ? flightName : "--"}/${name ? name : "--"}/${
      code ? `(${code})` : "--"
    }`;
    const subtitle = `${startPortName ? startPortName : "--"}>${
      endPortName ? endPortName : "--"
    }/${lineTypeName ? lineTypeName : "--"}/${
      shipCompanyName ? shipCompanyName : "--"
    }`;
    return {
      key: item.id,
      label: title,
      subtitle,
      title,
      value: item.id,
    };
  },
};
export const relatedRouteConfig = () => ({
  title: "更换航线",
  width: "490px",
  labelWidth: "85px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_ROUTE],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    routeNoManageId: [
      { required: true, message: "请选择航次", trigger: "blur" },
    ],
  },
});
