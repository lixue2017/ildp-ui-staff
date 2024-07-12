import {
  newGetAttachListByOrderId,
  updateAttachListByOrderIdNew,
} from "@/api/common";
import { fileCustomDialogCols } from "./model";

// 电商 114-报关资料节点
export const mixinDeclarationNodeFile = {
  data() {
    return {
      showFileTypeArr: ["100", "160", "60"],
    };
  },
  methods: {
    async handleMixinUploadDialogFile(row, callBack) {
      // console.log("==row=", row);
      const { orderId, orderType = 2 } = row;
      const { data } = await newGetAttachListByOrderId({
        orderId,
        orderType,
        queryTypeList: this.showFileTypeArr,
      });

      this.$refs.customDlgRef?.showCustomDialog({
        customFormConfig: fileCustomDialogCols(),
        formModel: {
          ...row,
          attachList: data || [],
        },
        httpRequest: () => {
          const { attachId, deleteAttachIdList } =
            this.$refs.mUploadTypeRef?.getAttachmentParams({
              isGetDeleteIds: true,
            }) || {};
          return updateAttachListByOrderIdNew([
            {
              attachIds: attachId,
              attachDeleteIds: deleteAttachIdList,
              orderId,
              orderType,
              queryType: 3, // 操作单
              sgin: "uploadCCA", // 用于更新节点
            },
          ]);
        },
        successFunction: () => {
          callBack && callBack();
        },
      });
    },
  },
  components: {
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
  },
};
