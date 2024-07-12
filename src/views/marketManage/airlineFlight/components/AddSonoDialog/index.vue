<template>
  <!-- 此页面已弃用 -->
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    class="airline-dialog"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:airGroup="slotProps">
          <span v-if="slotProps.formModel.routeCode.routeGroupCode">
            <span>
              {{
                `${slotProps.formModel.routeCode.routeGroupCode}[${slotProps.formModel.routeCode.routeGroupName}]`
              }}
            </span>
            <span
              class="mark-icon"
              :style="{
                borderColor:
                  slotProps.dicsList[
                    slotProps.formModel.routeCode.routeProxy
                  ] &&
                  slotProps.dicsList[slotProps.formModel.routeCode.routeProxy]
                    .color,
                color:
                  slotProps.dicsList[
                    slotProps.formModel.routeCode.routeProxy
                  ] &&
                  slotProps.dicsList[slotProps.formModel.routeCode.routeProxy]
                    .color,
              }"
            >
              {{
                slotProps.dicsList[slotProps.formModel.routeCode.routeProxy] &&
                slotProps.dicsList[slotProps.formModel.routeCode.routeProxy]
                  .label
              }}
            </span>
          </span>
          <span v-else>--</span>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>
<script>
import { getAirFlightList, addPeerShipping } from "@/api/marketManage/airline";
import { config } from "./model";
import { mapState } from "vuex";
// import { getAirFlightList } from "@/api/common";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      status: 0,
      customDialogConfig: {
        title: "航次信息(同行)",
        width: "850px",
        dataStatus: 0,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "保存并登记",
            type: "primary",
            handleClick: () => {
              this.customDialogConfig.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
        type: "",
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "120px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
        visibleAll: true,
      },
    };
  },
  created() {
    this.changeAirline();
    this.changeAirFlight();
  },
  methods: {
    submitFormRequest(formModel) {
      let params = {
        operationOrderId: formModel.operationOrderId, // 操作单id
        orderNo: formModel.orderNo, // 操作单号
        routeId: formModel.route.id, // 航次
        remark: formModel.remark, // 备注
        sono: formModel.sono,
      };
      return addPeerShipping(params);
    },
    changeAirline() {
      const that = this;
      config.lists[0].fieldList[0].rows[0].cols[0].handle = (e) => {
        delete e.id;
        this.$refs.dialogForm.setFormModel({
          ...e,
        });
        that.routeCode = e.code;
        config.lists[0].fieldList[0].rows[0].cols[2].refreshRequest =
          !config.lists[0].fieldList[0].rows[0].cols[2].refreshRequest;
        config.lists[0].fieldList[0].rows[0].cols[2].httpRequest = (params) =>
          getAirFlightList({ ...params, routeCode: e.code, statusList: "1" });
      };
    },
    changeAirFlight() {
      config.lists[0].fieldList[0].rows[0].cols[2].handle = (e) => {
        this.$refs.dialogForm.setFormModel({
          cabinProxy: e.cabinProxy,
          flightName: e.flightName,
          sailOpenTime: e.sailOpenTime,
          cabinOpenTime: e.cabinOpenTime,
          cutGateTime: e.cutGateTime,
        });
      };
    },
    show({ operationOrderId, orderNo }) {
      this.formConfig.formModel = {
        operationOrderId,
        orderNo,
      };
      config.lists[0].fieldList[0].rows[0].cols[0].getSearchOptions = (e) => {
        const list = e[0];
        this.$refs.dialogForm.setFormModel({
          ...list,
          routeCode: list,
        });
        config.lists[0].fieldList[0].rows[0].cols[2].refreshRequest = true;
        config.lists[0].fieldList[0].rows[0].cols[2].httpRequest = (params) =>
          getAirFlightList({ ...params, routeCode: e.code, statusList: "1" });
      };
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess(res = {}) {
      this.$emit("handleSuccess", res.data);
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.airline-dialog {
  /deep/ {
    .el-radio {
      margin-right: 10px;
    }
  }
  .mark-icon {
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 12px;
    margin-left: 5px;
    border: 1px solid #66a5ff;
  }
}
</style>
