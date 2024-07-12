<template>
  <div class="upload-title">
    <div class="top" v-if="fileData.type == 1">
      <div class="title">附件资料</div>
      <div class="subTitle">
        支持扩展名：{{
          billUploadConfig.accept.split(",").join(" ")
        }}，单个文件大小支撑到最大{{ billUploadConfig.size }}M，最多上传{{
          billUploadConfig.limit
        }}个附件
      </div>
    </div>

    <div class="tabs-upload" v-if="fileData.type == 1">
      <div>
        <ComUpload
          :uploadConfig="billUploadConfig"
          @handleSuccess="uploadSuccess"
        >
        </ComUpload>
      </div>
    </div>
    <div class="upload-lists">
      <ComAttachTable
        ref="attachTableRef"
        @deleteFile="handleDelete"
        :fileTitle="fileData.type == 1 ? null : '附件资料'"
        :fileTableBtnArr="getOperationBtn()"
      />
    </div>
  </div>
</template>

<script>
import { defaultTextParams, fileTypeUploadUrl } from "_comp/ComUpload/model";
import { getAttachSelectAllById } from "@/api/costScheme/index.js"; //附件查询
import { getInvoiceAttach } from "@/api/settlementManage/paymentReceived.js";
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
      default: () => ({
        // type // 1-新增与编辑发票  2-开票与详情
      }),
    },
  },
  data() {
    return {
      billUploadConfig: {
        ...defaultTextParams,
        drag: true,
        pasteUpload: true,
        fileList: [],
        url: fileTypeUploadUrl,
        showFileList: false,
        uploadData: {
          //传参
          type: 140,
        },
      },
      operationBtn: [
        {
          text: "删除",
          typeStatus: [1],
          btnOpnType: "delete",
        },
        {
          text: "资料下载",
          typeStatus: [1, 2],
          btnOpnType: "download",
        },
      ],
      attachArr: [],
    };
  },
  mounted() {
    const { id } = this.fileData;
    if (id.length > 0) {
      this.getFilesLists(id);
    }
  },
  methods: {
    getFilesLists(id) {
      getInvoiceAttach({ invoiceId: id }).then((res) => {
        this.handleDelete(res.data);
        this.$refs.attachTableRef?.setFileList(res.data || []);
      });
    },
    uploadSuccess(res) {
      console.log("this.attachArr", this.attachArr);
      this.attachArr.push(...res.data);
      this.$emit("attachIdList", this.attachArr);
      this.$refs.attachTableRef?.attachRequestTable({
        attachId: this.attachArr.join(","),
      });
    },
    getOperationBtn() {
      const { type } = this.fileData;
      const btnArr = this.operationBtn.filter((e) => {
        return e.typeStatus.includes(type);
      });
      return btnArr;
    },
    handleDelete(arr = []) {
      this.attachArr = arr.map((e) => e.id);
      this.$emit("attachIdList", this.attachArr);
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.upload-title {
  margin-top: -20px;
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
    // margin-top: 30px;
  }
}
</style>
