<template>
  <!-- 此组件目前仅电商/传统/其他订单详情侧边栏引用 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr">
      <template v-slot:slideCard>
        <div class="operate-status">
          <span>{{ overseaLangObj.zt_status || "状态" }}</span>
          <div style="flex: 1">
            <el-select
              v-model="formData.state"
              @change="handleState"
              :disabled="formData.state === 2"
            >
              <template v-for="item in crmSalesLeadsState || []">
                <el-option
                  v-if="
                    (formData.state === 2 || item.value != 2) &&
                    (item.value != 9 ||
                      formData.isCustomer ||
                      formData.state === 9)
                  "
                  :key="Number(item.value)"
                  :label="item.nameCn"
                  :value="Number(item.value)"
                >
                </el-option>
              </template>
            </el-select>
          </div>
        </div>
        <div class="operate-btn" v-if="btnList(formData).length">
          <OperationButton
            :btnList="btnList(formData)"
            :operateDetail="formData"
            :nameArr="[]"
            @handleBtnClick="handleBtnClick"
          />
        </div>
      </template>
    </OperateSidebarCard>
    <ReceiveClueDialog ref="receiveClueRef" @handleSuccess="handleSuccess" />
  </div>
</template>

<script>
import { updateSalesLeadsState } from "@/api/clueManage/salesClue.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { btnList } from "./model.js";
import { mapState } from "vuex";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    OperateSidebarCard: () => import("_comp/ComOperate/components/operateCard"),
    OperationButton: () =>
      import("_comp/ComOperate/components/operateCard/operationButton.vue"), // 操作按钮
    ReceiveClueDialog: () =>
      import("@/views/clueManage/components/ReceiveClueDialog"),
  },
  data() {
    return {
      btnList,
      showBarTabArr: [
        {
          isTabShow: false,
          tabKey: "OrderTrackBar",
          name: "操作",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      crmSalesLeadsState: (state) =>
        state.dictionary.dicsData.crmSalesLeadsState,
    }),
  },
  created() {},
  methods: {
    handleBtnClick(btn, bItem) {
      const { id } = btn;
      const { value } = bItem || {};
      switch (value || id) {
        case "followUpTask":
        case "ordinaryTask":
          this.$emit("handleAddTask", value);
          break;
        case "convertCustomer":
          this.$emit("handleConvertCustomer");
          break;
        case "addFollow":
          this.$emit("handleFollowUp");
          break;
        case "updateClue":
          this.$emit("handleEdit");
          break;
        case "receiveClue":
          this.handleReceiveClue();
          break;

        default:
          break;
      }
    },
    handleSuccess() {
      this.$emit("handleReceiveClueSuccess");
    },
    handleReceiveClue() {
      const salesLeadsIds = [this.formData.id];
      this.$refs.receiveClueRef.show(salesLeadsIds);
    },
    handleState() {
      const { id, state } = this.formData;
      updateSalesLeadsState({
        id,
        state,
      }).then(() => {
        this.msgSuccess("状态设置成功");
        this.$emit("handleStateSuccess");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .status-bar-box .com-operate.com-operate-width {
    width: 270px;
  }
}
.operate-status {
  display: flex;
  font-size: 14px;
  height: 34px;
  line-height: 34px;
  border-radius: 4px;
  border: 1px solid #5094ff;
  margin-top: 44px;
  text-align: center;
  overflow: hidden;

  & > span:nth-child(1) {
    width: 74px;
    height: 34px;
    line-height: 34px;
    background: #5094ff;
    color: #fff;
  }
  /deep/ .el-select {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-color: transparent;
    }
  }
}
.operate-btn {
  .title {
    font-size: 14px;
    font-weight: 700;
    margin: 25px 0 10px;
    color: #515151;
  }
  .base-flex {
    margin-top: 10px;
  }
}
.el-button {
  background: #ffffff;
  box-shadow: 0px 0px 3px 0px rgba(203, 203, 203, 0.7);
  border-radius: 4px;
  border-color: transparent;
  &:hover {
    background: #fff;
    color: #5094ff;
    border-color: #5094ff;
  }
}
</style>
