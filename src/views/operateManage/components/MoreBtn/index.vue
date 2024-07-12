<template>
  <div class="operation-content-btn">
    <el-button
      class="operate-icon"
      size="mini"
      type="text"
      icon=""
      v-if="statusList[data.operationOrderStatus]"
      @click="handleUpdate(statusList[data.operationOrderStatus].status)"
    >
      {{ statusList[data.operationOrderStatus].text }}
    </el-button>
    <el-dropdown
      @command="handleCommand"
      v-if="config[data.operationOrderStatus]"
    >
      <el-button class="operate-icon" size="mini" type="text">
        更多<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <template v-for="option in config[data.operationOrderStatus]">
          <el-dropdown-item
            :key="option.type"
            :command="() => handleClick(option.type)"
          >
            {{ option.label }}
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>
    <span
      v-if="
        !statusList[data.operationOrderStatus] &&
        !config[data.operationOrderStatus]
      "
      >--</span
    >
    <!-- 更换成员 -->
    <ChangeMembersDialog
      ref="changeMembersDialog"
      :appendToBody="true"
      @handleSuccess="changeMemberSuccess"
    />
    <!-- 查看物流 -->
    <ComLogistTrack ref="myLogistTrack" :activities="activities">
      <template v-slot:title="slotProps">
        <span class="orange-bg"> {{ slotProps.activity.name }}</span>
      </template>
      <template v-slot:operationDate="slotProps">
        <span> {{ slotProps.activity.trajectoryTime }}</span>
      </template>
      <template v-slot:operationContent="slotProps">
        <span> {{ slotProps.activity.msg }}</span>
      </template>
    </ComLogistTrack>
    <!-- 放货登记 -->
    <ReleaseGoodsDialog
      ref="releaseGoodsDialog"
      :appendToBody="true"
      @handleSuccess="handleReleaseSuccess"
    />
    <!-- 新增账单 -->
    <BillEditDialog
      ref="billEditDialog"
      @handleSuccess="handleBillSuccess"
      :appendToBody="true"
      v-if="addBillShow"
    />
  </div>
</template>
<script>
import { config, statusList } from "./model";
import commonMixin from "@/utils/mixin";
import { updateOperation } from "@/api/operateManage/common";
export default {
  mixins: [commonMixin],
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    statusList: {
      type: Object,
      default: () => {
        return statusList;
      },
    },
  },
  components: {
    ChangeMembersDialog: () =>
      import("_comp/ComOperate/components/ChangeMembersDialog"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    ReleaseGoodsDialog: () =>
      import("_comp/ComOperate/components/ReleaseGoodsDialog"),
    BillEditDialog: () =>
      import(
        "@/views/settlementManage/statementManage/billDetailed/components/EditDialog"
      ),
  },
  data() {
    return {
      config,
      activities: {
        showBasic: true,
        title: "物流轨迹",
        label: "总耗时：",
        timeConsume: "3天15时25分",
        basicInfo: this.data,
      },
      addBillShow: false,
    };
  },
  methods: {
    handleCommand(cb) {
      cb && cb();
    },
    handleClick(type) {
      console.log(type);
      console.log(this.data);
      if (type === "changeMembers") {
        this.$refs.changeMembersDialog.show(this.data);
      } else if (type === "lookLogistics") {
        this.$refs.myLogistTrack.show(this.data.id);
      } else if (type === "addBill") {
        this.addBill(this.data);
      }
    },
    changeMemberSuccess() {
      this.$emit("handleSuccess");
    },
    handleReleaseSuccess() {
      this.handleUpdate(8, false);
    },
    handleUpdate(operationOrderStatus, needJudge = true) {
      const { id, bookingPeople, cusService, salesAssistant } = this.data;
      if (operationOrderStatus === 7 && needJudge) {
        this.$refs.releaseGoodsDialog.show(this.data);
        return;
      }
      updateOperation({
        id,
        bookingPeople,
        cusService,
        salesAssistant,
        operationOrderStatus,
      }).then(() => {
        this.data.operationOrderStatus = operationOrderStatus;
      });
    },
    addBill(row) {
      this.addBillShow = true;
      setTimeout(() => {
        this.$refs.billEditDialog.show({
          businessType: 0, //0操作单 1订舱单 2拼柜单 3清关单 4订单
          orderId: row.id, //操作单id
          orderNum: row.operationOrderNum, //操作单号
          deptId: row.deptId,
        });
      }, 1000);
    },
    handleBillSuccess() {
      this.$refs.chargeTableRef.refreshTable();
    },
  },
};
</script>

<style lang="scss" scoped>
.operation-content-btn {
  display: flex;

  .operate-icon {
    display: flex;
    align-items: center;
    margin-right: 14px;

    &.operate-icon-info {
      color: #606060;
    }

    /deep/ span {
      font-size: 12px;
    }
  }
}
</style>