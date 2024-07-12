<template>
  <!-- 此组件目前仅电商/传统/其他订单详情侧边栏引用 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr">
      <template v-slot:slideCard>
        <div class="operate-btn">
          <!-- <div class="title">您可以操作</div>
          <el-button @click="handleFollowUp()" plain style="width: 100%"
            >写新跟进</el-button
          >
          <div class="base-flex">
            <el-button @click="handleDelete()" plain style="flex: 1"
              >删除联系人</el-button
            >
            <el-button @click="handleEdit()" plain style="flex: 1"
              >编辑联系人</el-button
            >
          </div> -->
          <OperationButton
            :btnList="btnList"
            :operateDetail="formData"
            :nameArr="[]"
            @handleBtnClick="handleBtnClick"
          />
        </div>
      </template>
    </OperateSidebarCard>
  </div>
</template>

<script>
import { delContact } from "@/api/clueManage/contacts.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { btnList } from "./model.js";
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
  created() {},
  methods: {
    handleFollowUp() {
      this.$emit("handleFollowUp");
    },
    handleEdit() {
      this.$emit("handleEdit");
    },
    handleDelete() {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delContact(this.formData),
        },
        () => {
          this.msgSuccess("删除成功");
          this.$emit("handleDelSuccess");
        }
      );
    },
    handleBtnClick(row) {
      const { id } = row;
      switch (id) {
        case "addFollow":
          this.handleFollowUp();
          break;
        case "delContacts":
          this.handleDelete();
          break;
        case "editContacts":
          this.handleEdit();
          break;

        default:
          break;
      }
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
