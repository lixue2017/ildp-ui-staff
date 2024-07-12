import { shipCompanyList } from "@/comModel/httpSelect";
import { getEnquiryList } from "@/api/enquiryManage";
import {
  COM_FORM_START_PORT,
  COM_FORM_END_PORT,
} from "@/views/enquiryManage/components/comModel";
const SEARCH_COLS_1 = (isOverseasToDoor) => ({
  span: 12,
  id: "numberLike",
  label: "询价编码：",
  placeholder: "询价编码",
  type: "slot",
  defaultKey: "number",
  httpRequest: getEnquiryList,
  searchParamName: "numberLike",
  getCustomData: (item) => {
    const { number, domesticQuotedPriceUserName, foreignQuotedPriceUserName } =
      item;
    return {
      label: number,
      value: number,
      key: number,
      title: number,
      subtitle: isOverseasToDoor
        ? foreignQuotedPriceUserName
        : domesticQuotedPriceUserName,
    };
  },
});
const SEARCH_COLS_2 = {
  span: 12,
  id: "airShipCompanyIdEq",
  label: "船公司：",
  placeholder: "船公司",
  ...shipCompanyList(),
};
const SEARCH_COLS_2_1 = {
  span: 12,
  ...SEARCH_COLS_2,
  label: "快递公司：",
  placeholder: "快递公司",
};
const SEARCH_COLS_3 = {
  span: 12,
  ...COM_FORM_START_PORT,
  id: "startPortIdEq",
};
const SEARCH_COLS_4 = {
  span: 12,
  ...COM_FORM_END_PORT,
  id: "endPortIdEq",
};
const SEARCH_COLS_5 = {
  span: 12,
  id: "deliveryAddressLike",
  label: "送货地址：",
  placeholder: "送货地址",
  type: "text",
};
const searchColumnsDomestic = (isOverseasToDoor) => [
  SEARCH_COLS_1(isOverseasToDoor),
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
];
const searchColumnsOverseas = (isOverseasToDoor) => [
  { ...SEARCH_COLS_1(isOverseasToDoor), span: 8 },
  { ...SEARCH_COLS_2_1, span: 8 },
  { ...SEARCH_COLS_5, span: 8 },
];
export const searchColumns = (isOverseasToDoor) =>
  isOverseasToDoor
    ? searchColumnsOverseas(isOverseasToDoor)
    : searchColumnsDomestic(isOverseasToDoor);
