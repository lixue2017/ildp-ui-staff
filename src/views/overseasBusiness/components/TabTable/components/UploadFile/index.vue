<template>
  <div>
    <ComUploadTable
      :uploadTableConfig="{
        webEditUpload: !fileData.isSee,
        webFileType: 'F202',
        webFileTypeArr: nFileTypeArr,
        tUploadConfig: {
          uploadData: nFileTypeArr[0] ? nFileTypeArr[0].fBtnParam : undefined,
        },
        uploadSuccess: uploadSuccess,
      }"
    >
      <template>
        <ComAttachTable
          :fileTitle="fileData.isSee ? '附件资料' : null"
          ref="attachTableRef"
          @deleteFile="handleDelete"
          :uploadFileModel="uploadSeeModel()"
          :fileTableBtnArr="fileData.isSee ? undefined : fileBtnArr"
        />
      </template>
    </ComUploadTable>
  </div>
</template>

<script>
import { uploadAttach } from "@/api/operateRecord/customsClearance";

export default {
  props: {
    fileData: {
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
      fileTypeArr: [
        {
          label: "清关资料",
          fBtnParam: {
            type: "160",
          },
        },
        {
          label: "清关资料",
          fBtnParam: {
            type: "160",
          },
        },
        {
          label: "派送资料",
          fBtnParam: {
            type: "161",
          },
        },
        {
          label: "入仓资料",
          fBtnParam: {
            type: "162",
          },
        },
      ],
      fileBtnArr: [
        {
          text: "删除",
          btnOpnType: "delete",
          showTypeList: this.fileData.delShowFileRowType,
        },
        {
          text: "资料下载",
          btnOpnType: "download",
        },
      ],
      nFileTypeArr: [],
      attachArr: [], //新增时的附件ID
    };
  },
  methods: {
    uploadSuccess(res) {
      this.attachArr.push(...res.data);
      this.$emit("attachIdList", this.attachArr);
      this.$refs.attachTableRef?.attachRequestTable({
        attachId: this.attachArr.join(","),
      });
    },
    handleDelete(arr = []) {
      this.attachArr = arr.map((e) => e.id);
      this.$emit("attachIdList", this.attachArr);
    },
    _setFileTable() {
      const { attachId } = this.fileData;
      if (attachId) {
        if (typeof attachId === "string") {
          this.attachArr = attachId.split(",");
        }
        setTimeout(() => {
          this.$refs.attachTableRef?.attachRequestTable({ attachId });
        }, 20);
      }
    },
    fileBtnList() {
      // 清关直清订单=160;清关派送订单=161;清关存仓订单=162;
      const { type } = this.fileData;
      let arr = ["160", "160", "161", "162"][type];
      this.nFileTypeArr = this.fileTypeArr.filter((e) =>
        arr.includes(e.fBtnParam.type)
      );
    },
    uploadSeeModel() {
      return {
        isUploadBtn: false,
        // btnTxt: "上传资料",
        // uploadModelData: {
        //   id: this.fileData.id,
        // },
        // uploadModelCols: {
        //   fileParamsType: 160,
        //   fileLabel: "清关资料",
        // },
        // uploadFileRequest: uploadAttach,
        // successUploadFn: () => {
        //   this.$emit("seeUploadFn");
        // },
      };
    },
  },
  mounted() {
    this._setFileTable();
  },
  created() {
    if (!this.fileData.isSee) {
      this.fileBtnList();
    }
  },
  watch: {
    "fileData.id"() {
      // 上下页更新附件
      this._setFileTable();
    },
  },
};
</script>

<style lang="scss" scoped></style>
