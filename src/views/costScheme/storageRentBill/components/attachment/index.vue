<template>
  <!-- 已废弃 -->
  <div class="upload-title">
    <div class="top">
      <div class="title">附件资料</div>
      <div class="subTitle">
        支持扩展名：{{
          billUploadConfig.accept.split(",").join(" ")
        }}，单个文件大小支撑到最大{{ billUploadConfig.size }}M，最多上传{{
          billUploadConfig.limit
        }}个附件
      </div>
    </div>
    <div class="tabs-upload">
      <div>
        <ComUpload
          :uploadConfig="billUploadConfig"
          @handleSuccess="uploadSuccess"
        >
        </ComUpload>
      </div>
    </div>

    <div class="upload-lists" v-if="attachmentShow">
      <ComAttachTable
        ref="attachTableRef"
        @deleteFile="handleDelete"
        :fileTitle="null"
        :fileTableBtnArr="operationBtn"
      />
    </div>
  </div>
</template>

  <script>
import { defaultTextParams, fileTypeUploadUrl } from "_comp/ComUpload/model";
import {
  getAttachSelectAllById,
  updateMonthlyBill,
  getMonthlyBillAttachInfos,
} from "@/api/costScheme/index.js"; //附件查询
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComUpload: () => import("_comp/ComUpload"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
  },
  props: {
    fileData: {
      type: Object,
      required: true,
    },
    attachmentInfo: {
      type: Object,
      required: true,
    },
    // attachList: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  data() {
    return {
      billUploadConfig: {
        ...defaultTextParams,
        drag: true,
        pasteUpload: true,
        fileList: [],
        showFileList: false,
        uploadData: {
          //传参
        },
      },
      operationBtn: [
        {
          text: "删除",
          btnOpnType: "delete",
        },
        {
          text: "资料下载",
          btnOpnType: "download",
        },
      ],
      files: [],
      filesIds: [],
      attachmentShow: false,
    };
  },
  mounted() {
    this.getFilesLists();
  },
  methods: {
    getFilesLists() {
      const { id } = this.fileData; //详情查询出的ID
      getMonthlyBillAttachInfos(id).then((res) => {
        this.files = res.data;
        this.filesIds = this.files.map((e) => {
          return e.id;
        });
        if (this.files.length > 0) {
          this.attachmentShow = true;
          setTimeout(() => {
            this.$refs.attachTableRef?.setFileList(this.files || []);
          });
        } else {
          this.attachmentShow = false;
        }
      });
    },
    uploadSuccess(row) {
      const { data } = row;
      this.filesIds = [...this.filesIds, ...data];
      this.bindUploadFiles();
      // this.$refs.attachTableRef?.attachRequestTable({
      //   attachId: this.filesIds.join(","),
      // });
    },
    handleDelete(row) {
      this.filesIds = row.map((e) => {
        return e.id;
      });
      this.bindUploadFiles();
    },
    bindUploadFiles() {
      //新增删除附件后将最新的附件绑定至ID
      const { id } = this.fileData;
      const attachIds = this.filesIds.join(",");
      const params = {
        id,
        attachIds,
      };
      updateMonthlyBill(params).then((res) => {
        setTimeout(() => {
          this.getFilesLists();
        }, 500);
      });
    },
  },
};
</script>
  <style rel="stylesheet/scss" lang="scss" scoped>
.upload-title {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 17px 0 10px;

    .title {
      font-size: 14px;
      font-weight: bold;
    }

    .subTitle {
      flex: 1;
      margin: 0 15px;
      color: #8b8b8b;
    }
  }
  .upload-lists {
    margin-top: 30px;
  }
}
</style>
