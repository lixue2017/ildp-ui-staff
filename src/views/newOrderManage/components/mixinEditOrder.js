import { msgBox } from "@/utils/confirmBox.js";
import { deleteFreightTakerAll } from "@/api/trandition/index";

export default {
  data() {
    return {};
  },
  methods: {
    // 切换委托人确认框
    customerConfirmBox(val) {
      const msg =
        "切换委托人后，关联的收发通信息，以及提货信息将被清空，确认是否修改 ！";
      const title = "确认提示";
      const className = "el-icon-warning text-warning";
      msgBox(
        this,
        { title, className, msg },
        () => {
          const { id: orderId, orderType } = this.formConfig.formModel;
          deleteFreightTakerAll({
            orderId,
            orderType,
          }).then(() => {
            this.formConfig.formModel.customerId = val;
            this.$refs.myForm.setFormModel({
              shipper: "",
              consignee: "",
              notifier: "",
            });
          });
        },
        () => {
          this.$refs.myForm.setFormModel({
            customerId: this.formConfig.formModel.customerId,
          });
        }
      );
    },
  },
};
