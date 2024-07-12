import overseaLangObj from "@/language/overseasLang.js";

// 一件代发联系人
const CONTACTS_FORM_COL_1 = {
  id: "contacts",
	label: `${overseaLangObj.lxr_name || "联系人姓名"}：`,
}
const CONTACTS_FORM_COL_2 = {
  id: "company",
	label: `${overseaLangObj.company_name || "公司名字"}：`,
}
const CONTACTS_FORM_COL_3 = {
  id: "taxId",
	label: `${overseaLangObj.duty_paragraph || "税号"}：`,
  placeholder: "--",
  type: "slot",
  basicType: 'taxIdType',
  basicTypeVal: 'taxIdType'
}
const CONTACTS_FORM_COL_4 = {
  id: "phone",
	label: `${overseaLangObj.lx_dh_telephone() || "联系电话"}：`,
}
const CONTACTS_FORM_COL_5 = {
  id: "email",
	label: `${overseaLangObj.contact_email("联系邮箱")}：`,
}
const CONTACTS_FORM_COL_6 = {
  id: "postCode",
	label: `${overseaLangObj.zip_code || "邮编"}：`,
}
const CONTACTS_FORM_COL_7 = {
  id: "countryId",
	label: `${overseaLangObj.gj_country || "国家"}：`,
}
const CONTACTS_FORM_COL_8 = {
  id: "province",
	label: `${overseaLangObj.province_state || "省(州)"}：`,
}
const CONTACTS_FORM_COL_9 = {
  id: "city",
	label: `${overseaLangObj.cs_city || "城市"}：`,
}
const CONTACTS_FORM_COL_10 = {
  id: "detailsAddr",
	label: `${overseaLangObj.xx_dz || "详细地址"}：`,
  placeholder: "--",
  type: "txt",
}
const CONTACTS_FORM_COL_11 = {
  id: "detailsAddrtwo",
	label: `${overseaLangObj.address_2 || "地址2"}：`,
}
const CONTACTS_FORM_COL_12 = {
  id: "detailsAddrthree",
	label: `${overseaLangObj.address_3 || "地址3"}：`,
}
const CONTACTS_FORM_COL_13 = {
  id: "houseNumber",
	label: `${overseaLangObj.house_number || "门牌号"}：`,
}
const CONTACTS_FORM_COL_14 = {
  id: "eorl",
  label: "EORI：",
}
const CONTACTS_COLS = [
  CONTACTS_FORM_COL_1,
  CONTACTS_FORM_COL_2,
  CONTACTS_FORM_COL_3,
  CONTACTS_FORM_COL_4,
  CONTACTS_FORM_COL_5,
  CONTACTS_FORM_COL_6,
  CONTACTS_FORM_COL_7,
  CONTACTS_FORM_COL_8,
  CONTACTS_FORM_COL_9,
  CONTACTS_FORM_COL_10,
  CONTACTS_FORM_COL_11,
  CONTACTS_FORM_COL_12,
  CONTACTS_FORM_COL_13,
  CONTACTS_FORM_COL_14
]

export const CONTACTS_FORM_COLS = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: CONTACTS_COLS.map(e => {
                return {
                  ...e,
                  span: 8,
                  placeholder: "--",
                  type: ["taxId"].includes(e.id) ? e.type : "txt",
                  render: row => {
                    if (e.id === "countryId") {
                      return `${row.country?.twoCode || ''}[${row.country?.nameCn || ''}]`
                    }
                    return row[e.id]
                  }
                }
              })
            },
          ],
        },
      ],
    }
  ]
}