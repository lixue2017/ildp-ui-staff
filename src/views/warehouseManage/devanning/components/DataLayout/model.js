import overseaLangObj from "@/language/overseasLang.js";

export const formConfig = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              {
                span: 24,
                id: "nlCode",
								label: `${overseaLangObj.nl_no || "NL编号"}：`,
                placeholder: "--",
                type: "slot",
              },
              {
                span: 24,
                id: "bsCode",
								label: `${overseaLangObj.gz_dh || "业务单号"}：`,
                placeholder: "--",
                type: "slot",
              },
              {
                span: 24,
                id: "sortBoxRegisterNo",
								label: `${overseaLangObj.gn_djh || "国内登记号"}：`,
								oneLineTipLabel: true,
                placeholder: "--",
                type: "txt",
              },
              {
                span: 24,
                id: "customerName",
								label: `${overseaLangObj.wtr_customer || "委托人信息"}：`,
                placeholder: "--",
                type: "txt",
              },
              {
                span: 24,
                id: "intendDevannBusinessSource",
								label: `${overseaLangObj.yw_type || "业务类型"}：`,
                placeholder: "--",
                type: "txt",
                basicType: "intendDevannBusinessSource",
              },
              {
                span: 24,
                id: "cabinetSn",
								label: `${overseaLangObj.gh_container_no || "柜号"}：`,
                placeholder: "--",
                type: "txt",
              },
              {
                span: 24,
                id: "cabinetTypeNum",
								label: `${overseaLangObj.gx_gl || "柜型柜量"}：`,
                placeholder: "--",
                type: "txt",
              },
              {
                span: 24,
                id: "trailerCompany",
								label: `${overseaLangObj.tc_gs || "拖车公司"}：`,
                placeholder: "--",
                type: "txt",
              },
              {
                span: 24,
                id: "hwOpt",
								label: `${overseaLangObj.hw_operator || "海外操作员"}：`,
                placeholder: "--",
                type: "txt",
              },
              {
                span: 24,
                id: "csOpt",
								label: "：",
								label: `${overseaLangObj.cs_operator || "长沙操作员"}：`,
                placeholder: "--",
                type: "txt",
              },
              {
                span: 24,
                id: "remark",
								label: `${overseaLangObj.bz_remark() || "备注"}：`,
                placeholder: "--",
                type: "txt",
              },
            ],
          },
        ],
      },
    ],
  },
];
