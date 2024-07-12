import { httpUserSelect, httpRoleDeptUserSelect } from "@/comModel/httpSelect";

export const replaceMembersCols = (obj) => {
  const { handleSalesman } = obj || {};
  return {
    title: "更换成员",
    width: "450px",
    labelWidth: "78px",
    simpleCustomCols: [
      {
        span: 24,
        id: "salesman",
        selectLabelKey: "salesmanName",
        label: "销售员：",
        placeholder: "请选择",
        ...httpRoleDeptUserSelect({ getRoles: ["YW"] }),
        handle: handleSalesman,
      },
      {
        span: 24,
        id: "salesAssistant",
        selectLabelKey: "salesAssistantName",
        label: "销售助理：",
        placeholder: "请选择",
        ...httpUserSelect(),
        type: "slot",
      },
      {
        span: 24,
        id: "operator",
        selectLabelKey: "operatorName",
        label: "操作员：",
        placeholder: "请选择",
        ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
      },
      {
        span: 24,
        id: "fileMember",
        selectLabelKey: "fileMemberName",
        label: "文件员：",
        placeholder: "请选择",
        ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
      },
      {
        span: 24,
        id: "cusService",
        selectLabelKey: "cusServiceName",
        label: "客服：",
        placeholder: "请选择",
        ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
      },
      // {
      //   span: 24,
      //   id: "bookingPeople",
      // 	 selectLabelKey: "bookingPeopleName",
      //   label: "订舱人：",
      //   placeholder: "请选择订舱人",
      //   ...httpUserSelect()
      // },
    ],
    formRules: {
      operator: [
        { required: true, message: "请选择操作员", trigger: "change" },
      ],
      salesman: [
        { required: true, message: "请选择销售员", trigger: "change" },
      ],
      fileMember: [
        { required: true, message: "请选择文件员", trigger: "change" },
      ],
    },
  };
};
