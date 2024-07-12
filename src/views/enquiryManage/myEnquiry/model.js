import {
  COM_FORM_DOMESTIC,
  COM_FORM_FOREIGN,
  COM_FORM_START_PORT,
  COM_FORM_END_PORT,
} from "@/views/enquiryManage/components/comModel";

const FORM_COLS_1 = {
  ...COM_FORM_DOMESTIC,
  span: 19,
  id: "domesticQuotedPriceUserId",
  placeholder: "请选择报价人",
};
const FORM_COLS_2 = {
  ...COM_FORM_FOREIGN,
  span: 19,
  id: "foreignQuotedPriceUserId",
  placeholder: "请选择报价人",
};

export const fromConfig = (type) => ({
  title: "更改报价人",
  width: "500px",
  labelWidth: "115px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                ...([1, 3].includes(type) ? [FORM_COLS_1] : []),
                ...([2, 3].includes(type) ? [FORM_COLS_2] : []),
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    domesticQuotedPriceUserId: [
      { required: true, message: "请选择报价人", trigger: "blur" },
    ],
    foreignQuotedPriceUserId: [
      { required: true, message: "请选择报价人", trigger: "blur" },
    ],
  },
});

const FORM_COLS_3 = {
  ...COM_FORM_START_PORT,
  span: 19,
  id: "startPortId",
  placeholder: "请选择起运港",
  isBackAll: true,
};
const FORM_COLS_4 = {
  ...COM_FORM_END_PORT,
  span: 19,
  id: "endPortId",
  placeholder: "请选择目的港",
  isBackAll: true,
};
export const portFromConfig = {
  title: "编辑港口",
  width: "500px",
  labelWidth: "115px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_3, FORM_COLS_4],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    startPortId: [{ required: true, message: "请选择起运港", trigger: "blur" }],
    endPortId: [{ required: true, message: "请选择目的港", trigger: "blur" }],
  },
};
