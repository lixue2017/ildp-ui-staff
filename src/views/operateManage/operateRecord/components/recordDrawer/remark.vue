<template>
  <ComDrawer ref="rDrawerRef" :customDrawer="remarkDrawerConfig">
    <template v-slot:content>
      <div class="drawer-class">
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(rItem, index) in remarkList"
            :key="index"
            :color="index === 0 ? '#00adb2' : '#bcbcbc'"
            class="timeline"
          >
            <div class="operation" style="word-break: break-all">
              <div class="drawer-title">
                <span>{{ rItem.createTime || "--" }}</span>
                <span> {{ rItem.createUserName || "" }} </span>
                <span class="tag-blue-color" v-if="rItem.tag">
                  {{ getDictObj("remarkTag", rItem.tag) || "--" }}
                </span>
              </div>
            </div>
            <div
              class="operation"
              style="word-break: break-all; white-space: pre-wrap"
            >
              <template>{{ rItem.remark || "--" }}</template>
            </div>
          </el-timeline-item>
        </el-timeline>

        <el-input
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="请输入备注说明"
          v-model="remarkTxt"
        >
        </el-input>
      </div>
    </template>
  </ComDrawer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { httpDictRequest } from "@/api/performance/dictRecord.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDrawer: () => import("_comp/ComDrawer"),
    ComLog: () => import("_comp/ComLog"),
  },
  data() {
    return {
      formData: {},
      remarkDrawerConfig: {
        title: "",
        width: "660px",
        useFooter: "footer",
        footer: [
          {
            text: "确 认",
            type: "primary",
            handleClick: () => {
              const remark = this.remarkTxt.trim();
              if (!remark) {
                this.msgError("请输入备注");
              } else {
                const { pageRemarkNameKey, tootId, operationOrderId } =
                  this.formData || {};
                // this.rLoading = true;
                httpDictRequest(
                  {
                    pageRemarkNameKey,
                    requestKey: "postAddBusinessRemark",
                  },
                  {
                    remark,
                    businessId: tootId || operationOrderId,
                  }
                )
                  .then(() => {
                    this.msgSuccess("保存成功");
                    this.$emit("handleSuccess");
                    this.hide();
                  })
                  .finally(() => {
                    // this.rLoading = false;
                  });
              }
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      // rLoading: false,
      remarkList: [],
      remarkTxt: "",
    };
  },
  methods: {
    async show(row = {}) {
      this.remarkTxt = "";
      this.formData = row;
      await this["dictionary/getDictionary"]([
        "remarkBusinessType",
        "remarkTag",
        "attachConfig",
        "pageGetRemarkPermissionTag",
      ]);
      httpDictRequest(
        {
          pageRemarkNameKey: row.pageRemarkNameKey,
        },
        {
          businessId: row.tootId || row.operationOrderId,
        }
      ).then((res) => {
        // console.log("==x", res);
        this.remarkList = res.data || [];
        this.remarkDrawerConfig.title = `交接备注记录 (${this.remarkList.length})`;
      });
      this.$refs.rDrawerRef.show();
    },
    hide() {
      this.$refs.rDrawerRef.hide();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .drawer-content {
    padding: 5px 26px 10px;
  }
  .drawer-class {
    height: calc(100% - 2px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .el-timeline {
      height: calc(100% - 120px);
      overflow-y: auto;
    }
    .operation {
      margin-top: 10px;
      line-height: 22px;
    }
  }
}
</style>
