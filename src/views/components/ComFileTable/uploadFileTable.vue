<template>
  <div class="upload-table-box">
    <template v-if="uploadTableConfig.webEditUpload">
      <div class="top">
        <div
          :class="`title ${uploadTableConfig.haveRulesTag ? 'rulesTag' : ''}`"
        >
          {{ overseaLangObj.fj_zl || "附件资料" }}
        </div>
        <div class="subTitle">
          <template v-if="overseaLangObj.yu_yan_lang === 'en-us'">
            SUPPORTED FOR EXTENSIONS: {{
              fUploadConfig.accept.split(",").join(" ")
            }}，SUPPORT A SINGLE FILE SIZE OF UP TO {{ fUploadConfig.size }}M AND UPLOAD UP TO {{
              fUploadConfig.limit
            }} ATTACHMENTS
          </template>
          <template v-else
            >支持扩展名：{{
              fUploadConfig.accept.split(",").join(" ")
            }}，单个文件大小支撑到最大{{ fUploadConfig.size }}M，最多上传{{
              fUploadConfig.limit
            }}个附件</template
          >
        </div>
      </div>

      <div class="tabs-upload">
        <div
          class="base-flex-align"
          v-if="uploadTableConfig.webFileType === 'F101'"
        >
          <span>{{overseaLangObj.fj_type || "附件类型"}}：</span>
          <div class="custom-tabs-btn">
            <template v-for="(item, fIdx) in uploadTableConfig.webFileTypeArr">
              <el-button
                size="small"
                plain
                :key="`f_${fIdx}i`"
                @click="changeTabs(item.fBtnParam, fIdx)"
                :type="activeIndex == fIdx ? 'activation' : ''"
                >{{ item.label }}</el-button
              >
            </template>
          </div>
        </div>

        <div
          :class="
            uploadTableConfig.webFileType === 'F202' && 'receivable-file-type'
          "
        >
          <ComUpload
            :uploadConfig="fUploadConfig"
            @handleSuccess="uploadTableConfig.uploadSuccess"
          >
          </ComUpload>
          <div class="type-txt" v-if="uploadTableConfig.webFileType === 'F202'">
            {{overseaLangObj.fj_type || "附件类型"}}：{{overseaLangObj.mr_default || "默认"}}
            <span class="primary-text-color">{{
              uploadTableConfig.webFileTypeArr[0].label
            }}</span>
          </div>
        </div>
      </div>
    </template>

    <slot />
  </div>
</template>

<script>
import { defaultTextParams } from "_comp/ComUpload/model";
import { fileTypeUploadUrl } from "_comp/ComUpload/model";

export default {
  props: {
    uploadTableConfig: {
      type: Object,
      default: () => ({
        // webEditUpload: true,
        // webFileType: 'F101',
        // webFileTypeArr: [{
        // 	label: "应收账单合同",
        // 	fBtnParam: {
        // 		type: "131" // 上传时的参数
        // 	}
        // }, {
        // 	label: "应付账单合同",
        // 	fBtnParam: {
        // 		type: "124"
        // 	}
        // }],
        // uploadSuccess: (res) => {} // 调接口更新附件列表
      }),
    },
  },
  components: {
    ComUpload: () => import("_comp/ComUpload"),
  },
  data() {
    return {
      fUploadConfig: {
        ...defaultTextParams,
        drag: true,
        pasteUpload: true,
        fileList: [],
        url: fileTypeUploadUrl,
        uploadData: {},
      },
      activeIndex: 0,
    };
  },
  methods: {
    changeTabs(valObj, i) {
      this.activeIndex = i;
      Object.assign(this.fUploadConfig.uploadData, valObj || {});
    },
  },
  mounted() {},
  created() {
    const { webFileTypeArr, showFileList = false } = this.uploadTableConfig;
    const uploadFormConfig = {
      uploadData: {
        type: webFileTypeArr[this.activeIndex]?.fBtnParam?.type || "",
      },
      showFileList,
    };
    Object.assign(this.fUploadConfig, uploadFormConfig || {});
  },
};
</script>

<style lang="scss" scoped>
.upload-table-box {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 17px 0 10px;

    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .rulesTag:before {
      content: "*";
      color: #fa7a7a;
      margin-right: 4px;
    }
    .subTitle {
      flex: 1;
      margin: 0 15px;
      color: #8b8b8b;
    }

    .el-button {
      color: #5094ff;
      border-color: #5094ff;
    }
  }
  .upload-file-btn {
    background: rgba(80, 148, 255, 0.08);
  }
  .tabs-upload {
    padding: 0 20px 10px;
    .custom-tabs-btn {
      border-bottom: none;
      margin-left: 10px;
    }
  }
  .receivable-file-type {
    display: flex;
    .type-txt {
      margin-left: 18px;
      line-height: 36px;
    }
  }
}
</style>
