<template>
  <div class="app-content-container">
    <ComDetailTop
      title="邮件详情"
      :formModel="formConfig.formModel"
      class="title-sides-margin-none"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    />
    <ComForm v-if="isInitRes" class="template-from" :formConfig="formConfig">
      <template v-slot:mailContent="slotProps">
        <div class="mail-content" v-html="slotProps.formModel.content"></div>
      </template>
    </ComForm>
    <template>
      <ComAttachTable
        ref="attachRef"
        :paramObj="{
          viewSource: 'trOrder',
        }"
      />
    </template>
  </div>
</template>

<script>
import { formConfig } from "./model";
import { getRecordInfo } from "@/api/messageService";
export default {
  data() {
    return {
      isInitRes: false,
      formConfig: {
        formModel: {},
        labelWidth: "120px",
        lists: formConfig(),
      },
    };
  },
  created() {
    this.getDetails();
  },
  methods: {
    getDetails() {
      this.isInitRes = false;
      const { id } = this.$route.query;
      getRecordInfo(id).then((res) => {
        const { createUserName, meslaivList, ...initData } = res.data || {};
        this.formConfig.formModel = {
          ...initData,
          createBy: createUserName,
        };
        this.isInitRes = true;
        const nFileUrlArr = meslaivList.map((m) => {
          return {
            filePath: m.url,
            name: m.name,
            typeName: "邮件附件",
          };
        });
        setTimeout(() => {
          this.$refs.attachRef?.setFileList(nFileUrlArr);
        }, 300);
      });
    },
    handleTopClick({ type, id }) {
      if (["pre", "next"].includes(type)) {
        this.getDetails();
      }
    },
  },
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
  },
};
</script>
<style lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 80px);
}
.mail-content {
  background: #f0f6ff;
  border-radius: 4px;
  max-height: 500px;
  overflow-y: auto;
  padding: 20px 20px 30px;
  /deep/ {
    div,
    span,
    p {
      white-space: normal;
      word-break: break-all;
    }
  }
}
</style>
