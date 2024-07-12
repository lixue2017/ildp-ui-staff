<template>
  <!-- 目前仅用于国内清关详情右侧栏中的业务配置 -->
  <div>
    <ComCustomDialog
      ref="customDialogRef"
      :slotDlgFormIds="['businessConfigtType']"
    >
      <template v-slot:businessConfigtType="slotProps">
        <div
          v-for="(item, index) in getBusinessTypeLists(slotProps.formModel)"
          :key="index"
        >
          <el-checkbox disabled v-model="checked">{{ item.title }}</el-checkbox>
          <div class="select-class">
            <span
              class="select-lists"
              v-for="(sonItem, sonIndex) in item.chilren"
              :key="sonIndex"
              >{{ sonItem.label }}</span
            >
          </div>
        </div>
      </template>
    </ComCustomDialog>
  </div>
</template>

<script>
import { customDialogCols,businessTypeLists } from "@/views/components/ComOperate/components/remarks/model.js";
import {
  POSTClearanceUpdateBusinessConfig,
} from "@/api/operateManage/common";
export default {
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    return {
      businessTypeLists,
      checked: true,
    };
  },
  methods: {
    show(formData) {
      const { businessConfig, joinOrderId, orderType } = formData;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: customDialogCols({ orderType }),
        formModel: {
          businessConfig: this.typeConversion(businessConfig),
        },
        httpRequest: (formModel) => {
          const { businessConfig: businessConfigHandle } = formModel;
          if (businessConfig == businessConfigHandle) {
            return new Promise((resolve, reject) => {
              this.$message.error("业务配置与当前一致，请重新选择");
              reject();
            });
          }
          const params = {
            operationOrderId: joinOrderId,
            businessConfig: businessConfigHandle,
          };
          return POSTClearanceUpdateBusinessConfig(params);
        },
        successFunction: () => {
          this.$emit("handleSuccess");
        },
      });
    },
    getBusinessTypeLists(row) {
      const { businessConfig } = row;
      const selectLists = this.businessTypeLists.filter((e) => {
        return e.showType.includes(businessConfig);
      });
      return selectLists;
    },
  },
};
</script>

<style lang="scss" scoped>
.select-class {
  span {
    &:not(:first-child) {
      margin-left: 24px;
    }
  }

  .select-lists::before {
    content: "·";
  }
}
</style>
