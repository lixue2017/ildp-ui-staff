<template>
  <div class="accessory">
    <template v-if="!fieldItem.detailDisplay">
      <el-row class="accessory-title" v-if="!fieldItem.hideTitle">
        <span class="file-required" v-if="fileRules.length">*</span>
        {{ fieldItem.fileLabel || overseaLangObj.fj_zl || "附件资料" }}
        <span class="accessory-title-tips" v-if="fieldItem.tipsTop">
          <template v-if="overseaLangObj.yu_yan_lang === 'en-us'">
            SUPPORTED FOR EXTENSIONS:
            {{ uploadConfig.accept.split(",").join(" ") }}，SUPPORT A SINGLE
            FILE SIZE OF UP TO {{ uploadConfig.size }}M AND UPLOAD UP TO
            {{ uploadConfig.limit }} ATTACHMENTS
          </template>
          <template v-else>
            支持扩展名：{{
              uploadConfig.accept.split(",").join(" ")
            }}，单个文件大小支撑到最大{{ uploadConfig.size }}M，最多上传{{
              uploadConfig.limit
            }}个附件
          </template>
        </span>
      </el-row>
      <el-row
        class="accessory-tips"
        v-if="!fieldItem.tipsTop && fieldItem.subTitle !== false"
      >
        <template v-if="overseaLangObj.yu_yan_lang === 'en-us'">
          SUPPORTED FOR EXTENSIONS:
          {{ uploadConfig.accept.split(",").join(" ") }}，SUPPORT A SINGLE FILE
          SIZE OF UP TO {{ uploadConfig.size }}M AND UPLOAD UP TO
          {{ uploadConfig.limit }} ATTACHMENTS
        </template>
        <template v-else
          >支持扩展名：{{
            uploadConfig.accept.split(",").join(" ")
          }}，单个文件大小支撑到最大{{ uploadConfig.size }}M，最多上传{{
            uploadConfig.limit
          }}个附件</template
        >
      </el-row>
    </template>
    <!-- 不能使用 { ...uploadConfig } 方式，否则传入上传组件内部的是一个新对象，会导致父组件取不到值 -->
    <span
      v-if="
        (!uploadConfig.fileList || !uploadConfig.fileList.length) &&
        fieldItem.disable
      "
      >--</span
    >
    <ComUpload
      v-else
      :class="[fieldItem.detailDisplay && 'file-detail-display']"
      :uploadConfig="
        Object.assign(uploadConfig, {
          disabled: fieldItem.disable,
          pasteUpload:
            fieldItem.pasteUpload !== undefined ? fieldItem.pasteUpload : true, // 显示图片粘贴上传
        })
      "
    />
  </div>
</template>

<script>
import { defaultTextParams, fileTypeUploadUrl } from "_comp/ComUpload/model";
import { getAttachList } from "@/api/overseas/fbaOrder";

export default {
  props: {
    formConfig: {
      type: Object,
      default: () => ({}),
    },
    fileRules: {
      type: Array,
      default: () => [],
    },
    fieldItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      uploadConfig: {
        ...defaultTextParams,
        drag: true,
        fileList: [],
        ...(this.fieldItem.uploadConfig || {}),
      },
      initAttachList: [], // 初始的附件数据
    };
  },
  methods: {
    fileRequest() {
      // 附件初始化
      const { isAttachFileId, getListReq, listParams } = this.formConfig;
      if (isAttachFileId) {
        const {
          attachIdKeyName = "attachId",
          attachListKeyName = "attachList",
        } = this.fieldItem;
        const { [attachIdKeyName]: attachId, [attachListKeyName]: attachList } =
          this.formConfig.formModel;
        if (attachList?.length) {
          this.uploadConfig.fileList = this.fileArrFn(attachList);
          return;
        }
        if (attachId) {
          (getListReq || getAttachList)(listParams || { attachId }).then(
            (res) => {
              this.uploadConfig.fileList = this.fileArrFn(
                res?.data || res?.rows || []
              );
            }
          );
        }
      }
    },
    fileArrFn(arr) {
      const { imageCardUrl } = this.fieldItem;
      return arr.map((e) => {
        this.initAttachList.push(e.id);
        if (!imageCardUrl) {
          return e;
        }
        let url = e?.filePath;
        const suffix = e.filePath?.split(".").pop();
        if (!["jpg", "jpeg", "png"].includes(suffix.toLocaleLowerCase())) {
          url = require("@/assets/image/transparent.png"); //如果上传的是非jpg,jpeg,png文件，就取本地的图片，暂无OBS，之后如果有OBS存储则保存在OBS上
        }
        return {
          ...e,
          [imageCardUrl]: url, // 图片显示赋值为 imageCardUrl: 'url'
        };
      });
    },
  },
  watch: {
    "uploadConfig.fileList"(nFiles) {
      // console.log('nFiles===', nFiles)
      if (this.formConfig.isAttachFileId) {
        const { attachFileUrlKey } = this.formConfig;
        const fileIds = nFiles
          .map((e) => {
            if (attachFileUrlKey) {
              return e.response && e.response[attachFileUrlKey]; // 返回文件链接
            }
            return e.response
              ? Array.isArray(e.response.data)
                ? e.response.data?.join(",")
                : e.response.data
              : e.id;
          })
          .filter((f) => !!f); // 过滤上传没有成功时返回了空数组
        // 删除的附件资料
        const delAttachIds = this.initAttachList.filter(
          (e) => !fileIds.includes(e)
        );
        this.$emit("fileListChange", { fileIds, delAttachIds, files: nFiles });
      }
    },
  },
  created() {
    Object.assign(this.uploadConfig, {
      ...(this.formConfig.uploadFormConfig || {}),
    });

    const { fileParamsType, uploadData } = this.fieldItem;
    if (fileParamsType) {
      // 有附件类型参数时，更换上传接口
      this.uploadConfig.url = fileTypeUploadUrl;
      this.uploadConfig.uploadData.type = fileParamsType;
    }
    if (uploadData?.resultType === 1) {
      this.uploadConfig.url = fileTypeUploadUrl;
    }
    if (uploadData) {
      Object.assign(this.uploadConfig.uploadData, uploadData);
    }
  },
  mounted() {
    this.fileRequest();
  },
  components: {
    ComUpload: () => import("_comp/ComUpload"),
  },
};
</script>

<style lang="scss" scoped>
.accessory-title {
  .file-required {
    color: #fa7a7a;
    margin-right: 4px;
  }
}
</style>
