/** WMS退仓入库列表与详情公共数据 */
import { mapActions, mapState } from "vuex";
import { putReturnWmsOrderReceiving } from "@/api/warehouse/process";
import { customMessageBox } from "@/utils/confirmBox.js";
import { wmsCustomDialogCols } from "../model";

export const mixinWmsListDetails = {
  data() {
    return {};
  },
  methods: {
    handleWmsMixinReceiving(r, callBack) {
      // customMessageBox(this, {
      //   msgTitle: "接单",
      //   msgTxt1: "",
      //   msgTxt2: "是否确认接单？",
      //   httpMsgRequest: () => {
      //     return putReturnWmsOrderReceiving([r.id]).then(() => {
      //       this.msgSuccess("接单成功");
      //       callBack && callBack();
      //     });
      //   },
      // });
      this.$refs.mCustomDialogRef?.showCustomDialog({
        customFormConfig: wmsCustomDialogCols(),
        httpRequest: ({ operator }) => {
          return putReturnWmsOrderReceiving({
            ids: [r.id],
            operator,
          });
        },
        successFunction: () => {
          this.msgSuccess("接单成功");
          callBack && callBack();
        },
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  computed: {
    ...mapState({}),
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
