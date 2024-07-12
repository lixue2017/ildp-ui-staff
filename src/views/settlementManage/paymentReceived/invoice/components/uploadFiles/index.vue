/* 发票信息编辑、待确认账单-水单认领页面使用到 */
<template>
  <div>
    <ComUploadTable
      :uploadTableConfig="{
        webEditUpload: true,
        haveRulesTag: uploadFileModel.haveRulesTag,
        webFileType: uploadFileModel.webFileType || 'F101',
        webFileTypeArr: nFileTypeArr,
        uploadSuccess: uploadSuccess,
      }"
    >
      <template>
        <ComAttachTable
          ref="attachTableRef"
          :fileTitle="null"
          @deleteFile="handleDelete"
          :fileTableBtnArr="fileBtnArr"
          v-show="attachArr.length || (attachList && attachList.length)"
        />
      </template>
    </ComUploadTable>
  </div>
</template>

<script>
import { getInvoiceAttach } from "@/api/settlementManage/paymentReceived.js";
export default {
  props: {
    fileData: {
      type: Object,
      default: () => ({}),
    },
    uploadFileModel: {
      type: Object,
      default: () => ({}),
    },
    attachList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
    ComUploadTable: () => import("_comp/ComFileTable/uploadFileTable.vue"),
  },
  data() {
    return {
      fileBtnArr: [
        {
          text: "删除",
          btnOpnType: "delete",
        },
        {
          text: "资料下载",
          btnOpnType: "download",
        },
      ],
      nFileTypeArr: [],
      attachArr: [],
    };
  },
  methods: {
    uploadSuccess(res) {
      if (res.data) {
        this.attachArr.push(...res.data);
        this.$emit("attachIdList", this.attachArr);
        this.$refs.attachTableRef?.attachRequestTable({
          attachId: this.attachArr.join(","),
        });
      }
    },
    handleDelete(arr) {
      this.attachArr = (arr || []).map((e) => e.id);
      this.$emit("attachIdList", this.attachArr);
    },
    getFilesLists(id) {
      getInvoiceAttach({ invoiceId: id }).then((res) => {
        this.handleDelete(res.data);
        this.$refs.attachTableRef?.setFileList(res.data || []);
      });
    },
  },
  mounted() {
    const { id } = this.fileData;
    if (id.length > 0) {
      this.getFilesLists(id);
    }
    if (this.attachList && this.attachList.length) {
      this.handleDelete(this.attachList);
      setTimeout(() => {
        this.$refs.attachTableRef?.setFileList(this.attachList);
      });
    }
  },
  created() {
    this.nFileTypeArr = this.uploadFileModel.fileTypeArr || [
      {
        label: "发票资料",
        fBtnParam: {
          type: "140",
        },
      },
      {
        label: "委托书",
        fBtnParam: {
          type: "390",
        },
      },
    ];
  },
};
</script>

<style lang="scss" scoped></style>
