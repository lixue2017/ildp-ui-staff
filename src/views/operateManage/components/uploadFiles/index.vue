<template>
  <div>
    <ComUploadTable
      :uploadTableConfig="{
        webEditUpload: true,
        haveRulesTag: uploadFileModel.haveRulesTag,
        webFileType: 'F101',
        webFileTypeArr: nFileTypeArr,
        uploadSuccess: uploadSuccess,
      }"
    >
      <template>
        <ComAttachTable
          :fileTitle="null"
          ref="attachTableRef"
          @deleteFile="handleDelete"
          :fileTableBtnArr="fileBtnArr"
          :paramObj="{
            viewSource: fileData.viewSource,
          }"
          v-show="this.attachArr.length"
        />
      </template>
    </ComUploadTable>
  </div>
</template>

<script>
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
    _setFileTable() {
      const { attachList } = this.fileData;
      this.handleDelete(attachList);
      setTimeout(() => {
        this.$refs.attachTableRef?.setFileList(attachList || []);
      }, 20);
    },
  },
  mounted() {
    this._setFileTable();
  },
  created() {
    this.nFileTypeArr = this.uploadFileModel.fileTypeArr || [
      {
        label: "客户下单",
        fBtnParam: {
          type: "30",
        },
      },
      {
        label: "客户报关资料",
        fBtnParam: {
          type: "100",
        },
      },
    ];
  },
};
</script>

<style lang="scss" scoped></style>
