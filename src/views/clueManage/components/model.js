import { httpRoleDeptUserSelect } from "@/comModel/httpSelect";
import { CRM_ATTACH_URL } from "_comp/ComUpload/model";
const FORM_COLS_1 = {
  span: 24,
  id: "ownershipUserId",
  label: "接收对象：",
  placeholder: "选择人员",
  ...httpRoleDeptUserSelect(),
};
const FORM_COLS_2 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  placeholder: "请输入备注信息",
  type: "textarea",
  rows: 3,
  maxlength: 300,
};
export const transferCluesForm = () => {
  return {
    title: "转移线索",
    width: "480px",
    labelWidth: "75px",
    className: "content-padding-20",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [FORM_COLS_1, FORM_COLS_2],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      ownershipUserId: [
        { required: true, message: "请选择接收对象", trigger: "change" },
      ],
    },
  };
};

const FORM_COLS_3 = (uploadData) => ({
  span: 24,
  id: "attachId",
  hideTitle: true,
  label: "选择附件：",
  placeholder: "请选择附件",
  type: "customUploadFile",
  uploadConfig: {
    accept: ".rar,.zip,.doc,.docx,.pdf",
    size: 20,
    limit: 10,
    url: CRM_ATTACH_URL,
    uploadData,
    name: "attachFile",
  },
});
export const uploadFileForm = (uploadData = {}) => {
  return {
    title: "上传附件",
    width: "480px",
    labelWidth: "75px",
    isAttachFileId: true,
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [FORM_COLS_3(uploadData), FORM_COLS_2],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      attachId: [{ required: true, message: "请选择附件", trigger: "change" }],
    },
  };
};
