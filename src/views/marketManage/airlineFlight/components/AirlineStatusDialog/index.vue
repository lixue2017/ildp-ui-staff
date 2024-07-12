<template>
  <ConfirmDialog ref="confirmDialog" />
</template>

<script>
import {
  editAirFlight,
  updateClearanceArrival,
} from "@/api/marketManage/airline";
import { getNodeDetail } from "@/api/operateManage/common";
import { formatDate } from "@/utils/index.js";
export default {
  components: {
    ConfirmDialog: () => import("@/views/components/ConfirmDialog"), // 时间确定弹窗
  },
  data() {
    return {};
  },
  methods: {
    show(id, status, obj) {
      const { operationOrderId } = obj || {};
      // nodeId: 17为离港, 23为到港
      const nodeId = status === 2 ? 17 : 23;
      getNodeDetail(nodeId).then((res) => {
        const data = res.data;
        let time_format = "/";
        if (!id && obj.orderType) {
          time_format = "-";
        }
        this.$refs.confirmDialog.handleFormDialog("timeConfirm", {
          dialogTitle: data.name,
          timeConfig: {
            timeValueFormat: `yyyy${time_format}MM${time_format}dd hh:mm:ss`,
          },
          formModel: {
            trajectoryTime: formatDate(new Date(), time_format),
            msg: data.msg,
          },
          httpRequest: (formData) => {
            // console.log(formData);
            const { trajectoryTime, msg } = formData;
            let params = {
              trajectoryTime,
              msg,
              id,
              operationOrderId,
              status,
            };
            if (!id && obj.orderType) {
              params.orderType = obj.orderType;
              return updateClearanceArrival(params);
            }
            return editAirFlight(params);
          },
          successFunction: () => {
            this.$emit("handleSuccess", status);
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
