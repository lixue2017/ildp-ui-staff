<template>
  <!-- 附件预览与下载 -->
  <el-popover
    placement="top"
    :width="previewDownloadConf.title ? 138 : 98"
    :title="previewDownloadConf.title || ''"
    popper-class="file-preview-popper"
    trigger="hover"
  >
    <div class="base-flex-center">
      <i
        class="el-icon-view"
        v-if="btnArr.includes('preview')"
        @click="handlePreviewDownload('preview')"
      />
      <i
        class="el-icon-download"
        v-if="btnArr.includes('download')"
        @click="handlePreviewDownload('download')"
      />
    </div>
    <template slot="reference">
      <slot v-if="btnConf.btnSlot" />
      <el-button
        v-else
        :size="btnConf.size || 'small'"
        :type="btnConf.btnType"
        :round="btnConf.round"
        :plain="btnConf.plain"
        class="operate-icon"
        >{{ btnTxt }}</el-button
      >
    </template>
  </el-popover>
</template>

<script>
import { filesPreview } from "@/utils/index";
import { download } from "@/utils/download.js";
export default {
  props: {
    btnArr: {
      type: Array,
      default: () => ["preview", "download"],
    },
    btnTxt: {
      type: String,
      default: () => "资料下载",
    },
    btnConf: {
      type: Object,
      default: () => ({
        btnType: "text",
      }),
    },
    previewDownloadConf: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loadMsg: null,
    };
  },
  methods: {
    async handlePreviewDownload(fType) {
      if (this.isThrottle) {
        return;
      }
      // 防止重复点击多次
      this.isThrottle = true;
      setTimeout(() => {
        this.isThrottle = false;
      }, 2000);
      const {
        previewHttp,
        previewParam,
        downloadHttp,
        downloadParam,
        asyncRequestParams,
        downloadBeforeFn,
      } = this.previewDownloadConf;
      if (downloadBeforeFn && !downloadBeforeFn()) {
        // 下载前的单独校验
        return false;
      }
      let previewDownloadParam = previewParam;
      let previewDownloadHttp = previewHttp;
      if (fType === "download") {
        // 压缩包预览、下载的接口、参数不同
        if (downloadParam) {
          previewDownloadParam = downloadParam;
        }
        if (downloadHttp) {
          previewDownloadHttp = downloadHttp;
        }
      }
      this.loadMsg?.close();
      this.loadMsg = this.$message({
        message: "文件准备中，请稍等。。。",
        type: "warning",
        duration: 0,
      });
      if (asyncRequestParams) {
        // 异步请求参数
        const rObj = (await asyncRequestParams()) || {};
        Object.assign(previewDownloadParam, rObj);
      }
      this.comRepeatedRequest(this, previewDownloadHttp, previewDownloadParam)
        .then((res = {}) => {
          this.loadMsg.close();
          let resUrl = res.data ? res.data : res.msg;
          if (res.data && res.data.msg) {
            resUrl = res.data.msg;
          }
          if (!resUrl) {
            this.msgError("无效文件！");
            return;
          }
          if (fType === "preview") {
            filesPreview(resUrl);
            // window.open(res.data);
            // res.data && filesPreview(res.data); // docx文件预览有问题
          } else {
            download(resUrl);
          }
          this.$emit("handleSuccess", fType);
        })
        .catch((err) => {
          this.loadMsg.close();
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
