<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <div v-if="$refs.customDialog && $refs.customDialog.dialogVisible">
        <template v-for="item in tagList">
          <div
            class="tag"
            :key="item.id"
            v-if="item.children && item.children.length"
          >
            <div class="tag_parent">{{ item.name }}<span>(多选)</span></div>
            <div class="tag_child">
              <template v-for="child in item.children">
                <el-button
                  size="small"
                  :key="child.id"
                  type="primary"
                  :plain="!selectList.includes(child.id)"
                  round
                  @click="handleSelect(child)"
                  >{{ child.name }}</el-button
                >
              </template>
            </div>
          </div>
        </template>
      </div>
    </template>
  </ComDialog>
</template>

<script>
import { getTagAll } from "@/api/clueManage/labelMaintenance.js";
export default {
  components: {
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
      customDialogConfig: {
        title: "添加标签",
        width: "678px",
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "确 认",
            type: "primary",
            handleClick: this.handleSuccess,
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      tagList: [],
      selectList: [],
      selectTags: [],
    };
  },
  methods: {
    show(tags) {
      getTagAll().then(({ data }) => {
        this.tagList = data || [];
        this.selectList = tags || [];
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess", this.selectList, this.selectTags);
      this.hide();
    },
    handleSelect(btn) {
      if (this.selectList.includes(btn.id)) {
        const index = this.selectList.findIndex((id) => id === btn.id);
        this.selectList.splice(index, 1);
        this.selectTags.splice(index, 1);
      } else {
        this.selectList.push(btn.id);
        this.selectTags.push(btn);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tag {
  &:not(:last-child) {
    margin-bottom: 30px;
  }
}
.tag_parent {
  font-weight: bold;
  &::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 12px;
    background: linear-gradient(180deg, #1765ee 0%, #68c5fc 100%);
    border-radius: 2px;
    margin-right: 5px;
  }
  span {
    font-weight: 400;
    color: #8b8b8b;
  }
}
.tag_child {
  margin-left: -8px;
  .el-button {
    margin-top: 10px;
    margin-left: 10px;
  }
}
</style>
