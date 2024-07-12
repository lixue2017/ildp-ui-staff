<template>
  <div>
    <CustomFormDialog
      dlgClassName="related-route-dialog"
      ref="confirmDlgRef"
      :slotDlgFormIds="['routeNoManageId']"
    >
      <template v-slot:routeNoManageId="slotProps">
        <AutoComplete
          ref="routeNoManageIdRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            handleCreate: _handleAddRouteInfo,
            refreshRequest: routeRefreshRequest,
          }"
        />
      </template>
    </CustomFormDialog>
    <AddEditDialog
      ref="dialogRef"
      :appendToBody="true"
      @handleAddSuccess="handleSuccess"
    />
  </div>
</template>

<script>
import { relatedRouteConfig } from "./model.js";
import {
  getAssociatedQuantity,
  changeRouteNoManage,
} from "@/api/marketManage/airline.js";
import { msgBox } from "@/utils/confirmBox.js";
export default {
  props: {
    WEB_ids: {
      type: String,
      default: "",
    },
  },
  components: {
    CustomFormDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    AddEditDialog: () =>
      import(
        "@/views/marketManage/airlineFlight/components/AddEditDialog/index.vue"
      ),
  },
  data() {
    return {
      routeRefreshRequest: false,
    };
  },
  methods: {
    show(row) {
      const { id: soNoId, routeNoManageId, routeNoMangeName } = row;
      this.$refs.confirmDlgRef?.showCustomDialog({
        formModel: {
          routeNoManageId,
          routeNoMangeName,
        },
        httpRequest: (opt) => {
          const { routeNoManageId } = opt;
          return this.confirmBox({ soNoId, routeNoManageId });
        },
        successFunction: () => {
          this.$emit("handleSuccess");
        },
        customFormConfig: relatedRouteConfig(),
      });
    },
    _handleAddRouteInfo() {
      //新增航次信息
      this.$refs.dialogRef.show({ WEB_ids: this.WEB_ids }, true);
    },
    handleSuccess(routeNoManageId, row) {
      const { flightByName, name } = row;
      this.routeRefreshRequest = !this.routeRefreshRequest;
      this.$refs.confirmDlgRef.setDlgFormModel({
        routeNoManageId,
        routeNoMangeName: `${flightByName}/${name}`,
      });
    },
    confirmBox(row) {
      return new Promise((resolve, reject) => {
        getAssociatedQuantity(row.soNoId).then((res) => {
          const html = `<div class='confirm-content'><div>系统检测关联工作单存在${res.data}个SoNo，确认后将同时更换，更换航次后
SoNo及订单费用信息将关联至新的航次。</div><div>是否确认更换？</div></div>`;
          const title = "确认";
          msgBox(
            this,
            {
              title,
              html,
              showCancelButton: true,
              customClass: "route-confirm",
            },
            () => {
              changeRouteNoManage(row)
                .then(() => {
                  resolve();
                })
                .catch(() => {
                  reject();
                });
            },
            () => {
              reject();
            }
          );
        });
      });
    },
  },
};
</script>

<style lang="scss">
.related-route-dialog {
  .el-dialog__body {
    padding: 70px 90px 50px 80px;
  }
}
.route-confirm {
  width: 420px;
  padding-bottom: 0px;

  .el-message-box__title {
    font-size: 15px;
  }
  .el-message-box__header {
    padding: 17px 25px;
    background: #f4f4f4;
  }
  .el-message-box__content {
    padding: 30px 40px 40px;
  }
  .confirm-content {
    div {
      &:nth-child(1) {
        font-size: 12px;
        line-height: 17px;
        margin-bottom: 30px;
      }
      &:nth-child(2) {
        font-size: 13px;
        font-weight: bold;
        line-height: 18px;
      }
    }
  }
  .el-message-box__btns {
    padding: 15px 25px 13px;
    background: #f4f4f4;
  }
}
</style>
