<template>
  <div class="accessory">
    <div v-if="!uploadFilesModelConfig.isDetail">
      <div class="uploadFiles-class" v-if="!uploadFilesModelConfig.isDetail">
        <el-row class="accessory-title">
          <span class="file-required" v-if="fileRules.length">*</span>
          {{ uploadFilesModelConfig.fileLabel || "附件资料" }}
        </el-row>
        <el-row class="accessory-tips">
          支持扩展名：{{
            uploadConfig.accept.split(",").join(" ")
          }}，单个文件大小支撑到最大{{ uploadConfig.size }}M，最多上传{{
            uploadConfig.limit
          }}个附件
        </el-row>
      </div>
      <div class="accessory-uploadType">
        <span>附件类型：</span>
        <template v-for="(fBtn, fIdx) in uploadFilesModelConfig.fileTypeArr">
          <el-button
            :key="fIdx"
            @click="changeTabs(fBtn.fBtnParam, fIdx)"
            :type="activeIndex == fIdx ? 'activation' : ''"
          >
            {{ fBtn.label }}
          </el-button>
        </template>
      </div>
      <!-- 不能使用 { ...uploadConfig } 方式，否则传入上传组件内部的是一个新对象，会导致父组件取不到值 -->
      <ComUpload
        :class="[uploadFilesModelConfig.isDetail && 'file-detail-display']"
        :uploadConfig="
          Object.assign(uploadConfig, {
            disabled: uploadFilesModelConfig.disable,
            pasteUpload:
              uploadFilesModelConfig.pasteUpload !== undefined
                ? uploadFilesModelConfig.pasteUpload
                : true, // 显示图片粘贴上传
          })
        "
        @handleSuccess="uploadFilesModelConfig.uploadSuccess"
      />
    </div>

    <slot />
  </div>
</template>

<script>
import { defaultTextParams, fileTypeUploadUrl } from "_comp/ComUpload/model";
// import { getAttachList } from "@/api/overseas/fbaOrder";
export default {
  props: {
    fileRules: {
      type: Array,
      default: () => [],
    },
    uploadFilesModelData: {
      //数据传参
      type: Object,
      default: () => ({}),
    },
    uploadFilesModelConfig: {
      //配置传参
      type: Object,
      default: () => {
        return {};
      },
    },
    // formConfig: {
    //   type: Object,
    //   default: () => ({}),
    // },
    // fieldItem: {
    //   type: Object,
    //   default: () => ({}),
    // },
  },
  data() {
    return {
      uploadConfig: {
        ...defaultTextParams,
        drag: true,
        url: fileTypeUploadUrl,
        fileList: [],
        showFileList: false,
        uploadData: {}, //上传接口参数
      },
      // initAttachList: [], // 初始的附件数据
      activeIndex: 0,
    };
  },
  mounted() {},
  methods: {
    changeTabs(valObj, i) {
      this.activeIndex = i;
      Object.assign(this.uploadConfig.uploadData, valObj || {});
    },
    // fileRequest() {
    //   // 附件初始化
    //   const { isAttachFileId } = this.formConfig;
    //   if (isAttachFileId) {
    //     const {
    //       attachIdKeyName = "attachId",
    //       attachListKeyName = "attachList",
    //     } = this.fieldItem;
    //     const { [attachIdKeyName]: attachId, [attachListKeyName]: attachList } =
    //       this.formConfig.formModel;
    //     if (attachList?.length) {
    //       this.uploadConfig.fileList = this.fileArrFn(attachList);
    //       return;
    //     }
    //     if (attachId) {
    //       getAttachList({ attachId }).then((res) => {
    //         this.uploadConfig.fileList = this.fileArrFn(res?.data || []);
    //       });
    //     }
    //   }
    // },
    // fileArrFn(arr) {
    //   return arr.map((e) => {
    //     this.initAttachList.push(e.id);
    //     return e;
    //   });
    // },
  },
  watch: {
    // "uploadConfig.fileList"(nFiles) {
    //   // console.log('nFiles===', nFiles)
    //   if (this.formConfig.isAttachFileId) {
    //     const { attachFileUrlKey } = this.formConfig;
    //     const fileIds = nFiles.map((e) => {
    //       if (attachFileUrlKey) {
    //         return e.response && e.response[attachFileUrlKey]; // 返回文件链接
    //       }
    //       return e.response ? e.response.data?.join(",") : e.id;
    //     });
    //     // 删除的附件资料
    //     const delAttachIds = this.initAttachList.filter(
    //       (e) => !fileIds.includes(e)
    //     );
    //     this.$emit("fileListChange", { fileIds, delAttachIds });
    //   }
    // },
  },
  created() {
    const uploadFormConfig = {
      uploadData: {
        type:
          this.uploadFilesModelConfig?.fileTypeArr[this.activeIndex].fBtnParam
            .type || "",
      },
    };
    this.uploadConfig = Object.assign(this.uploadConfig, {
      ...(uploadFormConfig || {}),
    });
    // this.formConfig.uploadFormConfig = {
    //   ...this.formConfig.uploadFormConfig,
    //   uploadData: {
    //     type:
    //       this.uploadFilesModelConfig?.fileTypeArr[this.activeIndex].fBtnParam
    //         .type || "",
    //   },
    // };
    // this.uploadConfig = Object.assign(this.uploadConfig, {
    //   ...(this.formConfig.uploadFormConfig || {}),
    // });
  },
  mounted() {
    // this.fileRequest();
  },
  components: {
    ComUpload: () => import("_comp/ComUpload"),
  },
};
</script>

<style lang="scss" scoped>
.accessory {
  .uploadFiles-class {
    display: flex;

    .accessory-title {
      font-size: 14px;
      font-weight: bold;
      line-height: 22px;
      margin: 0;
      // padding-top: 14px;
      color: #515151;
      .file-required {
        color: #5094ff;
        margin-right: 4px;
      }
    }
    .accessory-tips {
      font-size: 13px;
      line-height: 20px;
      margin-left: 15px;
      // padding-top: 6px;
      margin-bottom: 10px;
      color: #bcbcbc;

      &.detail-accept-tips {
        font-size: 13px;
        line-height: 20px;
      }
    }
  }
  .accessory-uploadType {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  /deep/ {
    .el-button--activation {
      color: #5094ff;
      border-color: #5094ff;
      // background-color: rgba($color: #5094ff, $alpha: 0.2);
    }
  }
}
</style>
