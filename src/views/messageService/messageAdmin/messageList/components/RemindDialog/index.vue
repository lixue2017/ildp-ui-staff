<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      :dialogBoxCenter="true"
      class="remind-dialog"
    >
      <template v-slot:title>
        <div>
          <span>{{ customDialogConfig.title }}</span>
          <el-tag size="mini" type="success" v-if="formData.msgType == 1"
            >通知</el-tag
          >
          <el-tag size="mini" color="rgb(102, 165, 255, 0.1)" v-else
            >待办</el-tag
          >
        </div>
      </template>
      <template v-slot:content>
        <div v-html="formData.msgContent"></div>
      </template>
    </ComDialog>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import { DICTIONARY_Obj } from "@/comModel/dictionary";
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
  data() {
    return {
      confirmClose: false,
      customDialogConfig: {
        title: "待办提醒",
        width: "379px",
        center: false,
        slotTitle: true,
        appendToBody: this.appendToBody,
      },
      btnList: [
        {
          text: "去查看",
          type: "primary",
          handleClick: this.handleView,
          status: [2],
        },
        {
          text: "关 闭",
          type: "info",
          plain: true,
          handleClick: () => {
            this.$refs.customDialog.handleClose();
          },
          status: [1, 2],
        },
      ],
      formData: {},
    };
  },
  computed: {
    ...mapGetters(["routesCollect"]),
  },
  methods: {
    handleFormSuccess() {
      this.hide();
      this.$emit("handleSuccess");
    },
    async show(row) {
      const { msgType } = row;
      this.customDialogConfig.title =
        DICTIONARY_Obj[`message_type_${msgType}`]?.nameCn;
      this.customDialogConfig.footer = this.btnList.filter((item) =>
        item.status.includes(msgType)
      );
      this.formData = row;
      this.$refs.customDialog.show();
    },
    handleView() {
      const { path: pathList = [] } = this.routesCollect;
      const { pushUrl: path, pushParam } = this.formData;
      if (!pathList.includes(path)) {
        this.$message.error("暂无权限，请联系管理员！");
        return;
      }
      let query = {};
      try {
        query = JSON.parse(pushParam);
      } catch (error) {
        this.$message.error("旧数据，参数错误！");
      }
      if (path) {
        this.hide();
        this.$router.push({
          path,
          query: {
            ...query,
            backPath: this.$route.fullPath,
          },
        });
      }
    },
    hide() {
      this.$refs.customDialog.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.el-tag {
  width: 50px;
  border-radius: 12px;
  text-align: center;
  margin-left: 10px;
  border: none;
  font-weight: bold;
}
</style>
