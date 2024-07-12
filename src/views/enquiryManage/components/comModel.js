import { httpPortPublicSelect, httpUserSelect } from "@/comModel/httpSelect";

export const COM_FORM_START_PORT = {
  label: "起运港：",
  placeholder: "起运港",
  ...httpPortPublicSelect(),
  selectLabelKey: "startPortName",
};

export const COM_FORM_END_PORT = {
  label: "目的港：",
  placeholder: "目的港",
  ...httpPortPublicSelect(),
  selectLabelKey: "endPortName",
};

export const COM_FORM_DOMESTIC = {
  selectLabelKey: "domesticQuotedPriceUserName",
  label: "国内报价人：",
  placeholder: "国内报价人",
  ...httpUserSelect(),
  additionalParam: {
    roleIds: "133,144",
  },
};

export const COM_FORM_FOREIGN = {
  selectLabelKey: "foreignQuotedPriceUserName",
  label: "海外报价人：",
  placeholder: "海外报价人",
  ...httpUserSelect(),
  additionalParam: {
    roleIds: "146,129",
  },
};
