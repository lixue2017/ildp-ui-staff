<template>
  <!-- 本组件仅用于传统订单上传 -->
  <div>
    <UploadFile
      ref="UploadFileRef"
      :uploadFilesModelData="{
        ...uploadFilesModelData,
      }"
      :uploadFilesModelConfig="{
        isDetail: uploadFilesModelConfig.isDetail,
        fileTypeArr: uploadFilesModelConfig.fileTypeArr || fileTypeArr, //上传类型
        uploadSuccess,
      }"
    >
      <template>
        <AttachmentTable
          ref="attachTableRef"
          :uploadFilesModelData="uploadFilesModelData"
          :uploadFilesModelConfig="{
            tableShowTable: uploadFilesModelConfig.tableShowTable,
            fileBtnArr: fileBtnArr[uploadFilesModelConfig.isDetail], //操作类型
          }"
          @deleteFile="handleDelete"
        />
      </template>
    </UploadFile>
  </div>
</template>

<script>
import { getAttachList } from "@/api/overseas/fbaOrder.js";
import { newGetAttachListByOrderId } from "@/api/common";
import { getOrderAttachList } from "@/api/common";
export default {
  props: {
    uploadFilesModelData: {
      //上传数据传参
      type: Object,
      default: () => ({}),
    },
    uploadFilesModelConfig: {
      //上传配置项传参
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    UploadFile: () => import("./uploadFile.vue"),
    AttachmentTable: () => import("./attachmentTable.vue"),
  },
  data() {
    return {
      fileTypeArr: [
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
      ],
      fileBtnArr: {
        0: [
          {
            text: "删除",
            btnOpnType: "delete",
          },
          {
            text: "资料下载",
            btnOpnType: "download",
          },
        ],
        1: [
          {
            text: "资料下载",
            btnOpnType: "download",
          },
        ],
      },
      nFileTypeArr: [],
      attachArr: [], //新增与初始化时的附件ID
      delIds: [],
    };
  },
  mounted() {
    const { isDetail,isGetAllFiles } = this.uploadFilesModelConfig;
    if (isDetail&&isGetAllFiles) {
      //如果详情需要查询所有附件（包括后续在员工端上传的其他类型附件）就走这个接口,
      this.initOrderAttachList();
    } else {
      //如果只需要查询在客户端上传的附件类型附件，直接取详情接口返回的附件lists就可以
      const { filesLists } = this.uploadFilesModelData;
      this.attachArr = this.uploadFilesModelData.filesLists.map((e) => {
        return e.id;
      });
      setTimeout(() => {
        this.$refs.attachTableRef?.setFileList(filesLists);
        this.$emit("attachIdList", this.attachArr);
      });
    }
  },
  methods: {
    uploadSuccess(res) {
      //上传附件成功
      this.attachArr.push(...res.data);
      const attachId = this.attachArr.join(",");
      getAttachList({ attachId }).then((res) => {
        const fileArr = res.data || [];
        this.$emit("attachIdList", this.attachArr, this.delIds);
        this.$nextTick(() => {
          this.$refs.attachTableRef?.setFileList(fileArr);
        });
      });
    },
    handleDelete(arr = [], deleteFile) {
      //删除附件
      this.attachArr = arr.map((e) => e.id);
      this.delIds = deleteFile;
      this.$emit("attachIdList", this.attachArr, this.delIds);
    },
    initOrderAttachList() {
      // 查询类型 1:客户端订单 2:员工端订单 3:员工端操作单
      //目前仅用于详情附件上传成功后页面局部刷新获取最新附件列表使用
      const opt = {
        ...this.uploadFilesModelData.paramObj,
        queryType: 1,
      };
      getOrderAttachList(opt).then((res) => {
        this.$refs.attachTableRef?.setFileList(res.data);
      });
    },
  },
};
</script>

 <style lang="scss" scoped>
</style>
