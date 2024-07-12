
import { examineConfirmForm } from "./model.js";
import { mapState } from "vuex";
import { postExpenseAudit,POSTBatchAudit } from "@/api/settlementManage/paymentReceived";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
export const costExamineMixin = {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    handleMixinExamine(row, status) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "账单审核",
          label: "备注：",
          id: "remark",
          rulesKey: status == 9 ? "remark" : "",
        }),
        formModel: {
          status, // 默认通过
          expenseBillId: row.id,
        },
        httpRequest: postExpenseAudit,
        successFunction: () => {
          this.successExamine();
        },
      });
    },
    handleBatchOperation(status) {
      //批量打回/确认
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "账单审核",
          label: "备注：",
          id: "remark",
          rulesKey: status == 9 ? "remark" : "",
        }),
        formModel: {
          status, // 默认通过
        },
        httpRequest: (formModel)=>{
          const expenseBillIds=this.selectionRows.map((e)=>e.id)
          const params = {
            ...formModel,
            expenseBillIds,
          };
          return POSTBatchAudit(params)
        },
        successFunction: () => {
          // this.onTableSelectionChange([])
          this.successExamine();
        },
      });
    },
    successExamine() {
      this.mixinkeepTable(); // 审核后列表刷新
    }
  },
  components: {
    ExamineConfirmDlg: () => import("_comp/ConfirmDialog/customFormDialog"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
}
