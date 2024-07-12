<template>
  <div>
    <!-- 财务付款详情页 -->
    <ViewDetails ref="detailsRef" webViewSource="paymentDetails">
      <template v-slot:footerBtn="{ btnInfo }">
        <template v-for="(fBtn, index) in rowStatusList">
          <el-button
            @click="
              () => fBtn.handleClick({ ...btnInfo, id: btnInfo.taskBillId })
            "
            :key="`f_${index}`"
            v-if="rShowFooterBtn(fBtn, btnInfo)"
          >
            {{ fBtn.text }}
          </el-button>
        </template>
      </template>
    </ViewDetails>

    <DistributionDialog ref="distributionRef" />
    <RegisterDialog ref="registerRef" />
    <WaterBillDialog ref="waterBillRef" />
    <WriteOffDialog ref="writeOffRef" />
    <ComCustomDialog ref="customDialogRef" />
    <AddDrawer ref="addDrawer" @handleSuccess="editSuccess" />
    <!-- <InvoiceEditDialog ref="InvoiceEditDialogRef" /> -->
  </div>
</template>

<script>
import { mixinPaymentExpenses } from "./mixinCostExpenses.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
export default {
  mixins: [mixinPaymentExpenses],
  data() {
    return {};
  },
  methods: {
    editSuccess(btnType) {
      if (btnType === "repulse") {
        // 打回
        this.$refs.detailsRef.reBack();
      } else {
        this.$refs.detailsRef.getDetailsInfo();
      }
    },
    rShowFooterBtn(bItem, row) {
      const { applicant, isMainBill } = row;
      if (isMainBill === 9) {
        return false;
      }
      const { userId } = this.curUserInfo;
      if (
        bItem.statusBtnArr.includes("btnBack") &&
        row.taskBillStatus !== 100
      ) {
        // 待分配状态只有第一次分配才可打回
        return (
          row.taskBillSerialCode.includes("-1") ||
          bItem.statusBtnArr.includes(row.taskBillStatus)
        );
      }
      return (
        bItem.statusBtnArr.includes(row.taskBillStatus) &&
        ((bItem.hasPermission ? hasBtnPermits(bItem.hasPermission) : true) ||
          applicant == userId) && //符合角色权限或创建人是自己;
        (bItem.isCostType ? bItem.isCostType.includes(row.type) : true)
      );
    },
  },
  components: {
    ViewDetails: () => import("./components/viewDetails"),
  },
};
</script>

<style lang="scss" scoped></style>
