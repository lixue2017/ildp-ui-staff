<template>
  <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['salesAssistant']">
    <template v-slot:salesAssistant="slotProps">
      <AutoComplete
        v-if="isSalesAssistant"
        ref="salesAssistantRef"
        :formModel="slotProps.formModel"
        :fieldItem="{
          ...slotProps.fieldItem,
          isDefaultSelectVal: isDefaultVal,
        }"
        :additionalParam="{
          kaid: slotProps.formModel.salesman,
        }"
      />
    </template>
  </ComCustomDialog>
</template>
<script>
import { replaceMembersCols } from "./model";
import { updateOperation } from "@/api/operateManage/common";
export default {
  props: {},
  data() {
    return {
      isSalesAssistant: true,
      isDefaultVal: false,
    };
  },
  methods: {
    show(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: replaceMembersCols({
          handleSalesman: (val) => {
            this.$refs.salesAssistantRef?.changeFocusRequest();
            this.isSalesAssistant = false;
            this.isDefaultVal = !!val;
            this.$nextTick(() => {
              this.isSalesAssistant = true;
            });
          },
        }),
        formModel: {
          ...row,
        },
        httpRequest: (params) => {
          const {
            id,
            bookingPeople,
            cusService,
            fileMember,
            operator,
            salesAssistant,
            salesman,
            orderType,
          } = params || {};
          return updateOperation({
            id,
            bookingPeople,
            cusService,
            fileMember,
            operator,
            salesAssistant,
            salesman,
            orderType,
          });
        },
        successFunction: () => {
          this.$emit("handleSuccess");
        },
      });
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style lang="scss" scoped></style>
